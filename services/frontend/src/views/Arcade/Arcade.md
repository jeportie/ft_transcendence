# 1. Scope & High-Level Architecture

We introduce an **Arcade system** with:

* A **public arcade section** (`/arcade`, `/arcade/play`)
* A **quick match mode** (2 local players, same device)
* A **tournament mode** (configured once, then uses same match view as quick match)
* A way for **each player to identify themselves**:

  * Guest
  * Local login (username/password)
  * OAuth (Google/GitHub/42)
* A **stats system**:

  * Matches + per-player stats
  * Supports guests (optionally linkable later to a user account)
* Integration with the existing **/app** section:

  * Dashboard with game stats
  * Profile & avatar
  * Friends list + friend stats
  * Future leaderboards

We keep the current **SPA routes**, **Fastify API**, **SQLite schema**, and we extend them with **game/tournament data** and **arcade-specific auth tokens** (short-lived per-player tokens, not cookie sessions).

---

# 2. Frontend Architecture

## 2.1 SPA Routes (current + planned)

From `src/views/routes.ts`, with Arcade + App:

| Path                    | Layout        | Component        | Guard       | Purpose                          |
| ----------------------- | ------------- | ---------------- | ----------- | -------------------------------- |
| `/`                     | LandingLayout | `Landing`        | public      | Marketing / intro                |
| `/login` etc.           | LandingLayout | Login/Signup/... | public      | Auth / onboarding                |
| `/arcade`               | ArcadeLayout  | `ArcadeMenu`     | public      | Game mode choice (quick / tour)  |
| `/arcade/play`          | ArcadeLayout  | `ArcadeMatch`    | public      | Quick match / tournament match   |
| `/dashboard`            | AppLayout     | `Dashboard`      | requireAuth | User dashboard + stats           |
| `/settings`             | AppLayout     | `Settings`       | requireAuth | Account security, sessions, 2FA  |
| `/profile` *(planned)*  | AppLayout     | `Profile`        | requireAuth | Profile, avatar, alias, bio      |
| `/friends` *(planned)*  | AppLayout     | `Friends`        | requireAuth | Friends, requests, mutual stats  |
| `/leaderboard` *(plan)* | AppLayout     | `Leaderboard`    | requireAuth | Global ranking & ranking filters |

The **Arcade** routes stay public, but each **player** can authenticate individually.

---

## 2.2 Arcade Layout & Quick Match View

### 2.2.1 `ArcadeLayout.html`

Already present:

* Background (particles / canvas)
* Header (ft_transcendence branding)
* Main container for Arcade views

We’ll ensure ArcadeMatch has a center “arena” area with **three main slots**:

```html
<section class="arcade-match-grid">
  <div id="player1-slot"></div>
  <div id="game-slot"></div>
  <div id="player2-slot"></div>
</section>
```

The **grid** is purely CSS/Tailwind (`Arcade.css`). These 3 slots are where we dynamically insert component templates.

---

## 2.3 Component Model for Arcade Match

We implement the quick game UI as a set of **HTML templates + TS classes**.

### 2.3.1 Base concept

Each component is:

* An **HTML template file** under `views/Arcade/Match/templates/`
* A **TS class** (controller) under `views/Arcade/Match/components/`
* Mounted into a slot (`player1-slot`, `player2-slot`, `game-slot`) by `Pong.ts` and `setupPong.ts`
* DOM access via your **`generateDomRegistry.mjs`** -> `dom.generated.ts`

You’re basically building “poor-man’s React”:

* Components are **fragments**
* State transitions = swap fragments in the slots
* Each component exposes `mount(root: HTMLElement, props)` and returns an `unmount` function or `destroy()` method.

---

## 2.4 Quick Match – Player & Game Cards

### 2.4.1 Slots & States

We have **3 logical areas**:

1. **Player 1 card** (left column, `#player1-slot`)
2. **Game card** (center column, `#game-slot`)
3. **Player 2 card** (right column, `#player2-slot`)

Each **Player slot** is a mini-state machine:

**Player states** (per slot):

1. `PlayerLoginCard`
2. `PlayerGuestAliasCard`
3. `PlayerProfileCard`
4. `PlayerPendingLinkCard` *(optional for QR / OAuth linking)*
5. `PlayerSummaryCard` *(optional after match)*

**Game states** (center):

1. `GameModeSelectorCard` (quick vs tournament, best-of, score limit…)
2. `GameSettingsCard` (ball speed, win score, powerups, etc.)
3. `GameCanvasCard` (actual Pong canvas)
4. `GameEndCard` (score, rematch, back to menu)

---

### 2.4.2 Player components (detailed)

#### Common TS type for a player slot

```ts
export type PlayerIdentityMode = "guest" | "user";

export interface ArcadePlayerContext {
  slot: 1 | 2;
  mode: PlayerIdentityMode | null;
  userId?: number;           // when mode === "user"
  arcadeToken?: string;      // short-lived JWT for this match
  displayName: string;
  avatarUrl?: string;
  isReady: boolean;          // ready to start game
}
```

`Pong.ts` (ArcadeMatch view) holds:

```ts
const player1: ArcadePlayerContext = { slot: 1, mode: null, displayName: "Player 1", isReady: false };
const player2: ArcadePlayerContext = { slot: 2, mode: null, displayName: "Player 2", isReady: false };
```

#### 1. `PlayerLoginCard`

**Template**: `views/Arcade/Match/templates/PlayerLoginCard.html`
**Controller**: `views/Arcade/Match/components/PlayerLoginCard.ts`

**Purpose**: let the player choose **how to identify** themselves:

* Play as Guest
* Log in with username/password (arcade mode)
* OAuth via Google/GitHub/42
* (Optional) QR linking

**UI elements**:

* Player title: “Player 1” / “Player 2”
* Buttons:

  * “Play as Guest”
  * “Login with Email/Username”
  * “Login with Google”
  * “Login with GitHub”
  * “Login with 42”
  * (optional) “Scan QR with your phone”
* Small hint: “Logging in lets you keep your stats and avatar.”

**API usage**:

* Guest:

  * No API call
  * We switch to `PlayerGuestAliasCard`

* Username/password:

  * `POST /api/auth/login` with body `{ identifier, password, mode: "arcade" }`
  * Backend returns `{ arcadeToken, user, profile }`
  * `playerContext.userId`, `displayName`, `avatarUrl`, `arcadeToken` updated
  * We switch to `PlayerProfileCard`

* OAuth:

  * Use existing `/api/auth/{provider}/start?mode=arcade`
  * Popup window → callback returns `arcadeToken` + `user` or a special `/arcade/oauth-callback` route
  * Same result: `PlayerProfileCard`

---

#### 2. `PlayerGuestAliasCard`

**Template**: `PlayerGuestAliasCard.html`
**Controller**: `PlayerGuestAliasCard.ts`

**Purpose**: let a guest choose a nickname.

**UI**:

* Text input: “Enter your nickname”
* Optional random name button (“Random name”)
* Button: “Confirm”

**Behavior**:

* On confirm:

  * `playerContext.mode = "guest"`
  * `playerContext.displayName = nickname`
  * `playerContext.isReady = true`
  * No API call at this step; we’ll use this nickname when sending match results.

---

#### 3. `PlayerProfileCard`

**Template**: `PlayerProfileCard.html`
**Controller**: `PlayerProfileCard.ts`

**Purpose**: show summary when the player is authenticated.

**UI**:

* Avatar

* Display name

* Some micro-stats (last 5 games, win rate), fetched from:

  * `GET /api/game/stats/summary?userId=...`

* Buttons:

  * “Ready” / “Not Ready”
  * “Switch Account”
  * “Play as Guest Instead”

**Behavior**:

* “Ready” toggles `playerContext.isReady`
* “Switch account” → go back to `PlayerLoginCard`
* “Play as guest instead” → go to `PlayerGuestAliasCard`

---

### 2.4.3 Game components (center slot)

#### 1. `GameModeSelectorCard`

**Template**: `GameModeSelectorCard.html`
**Controller**: `GameModeSelectorCard.ts`

**UI**:

* Title: `Choose game mode`
* Buttons:

  * “Quick Match”
  * “Tournament Match” (when tournament context exists or creation allowed)
* For a pure quick mode, we can default to Quick Match and skip this card.

---

#### 2. `GameSettingsCard`

**Template**: `GameSettingsCard.html`
**Controller**: `GameSettingsCard.ts`

**Purpose**:

* Configure rules for the match:

  * Score limit (e.g., 5, 7, 11)
  * Ball speed difficulty (easy / medium / hard)
  * Optional powerups (future)
  * Maybe “Best of 3 / 5” for tournaments

**Behavior**:

* On “Start Match” click:

  * Validate that `player1.isReady && player2.isReady`

  * Create a **match** on the backend:

    ```ts
    POST /api/game/matches
    {
      type: "quick",
      rules: { scoreLimit, ballSpeed, ... },
      players: [
        {
          slot: 1,
          mode: player1.mode,
          userId: player1.userId ?? null,
          displayName: player1.displayName,
        },
        {
          slot: 2,
          mode: player2.mode,
          userId: player2.userId ?? null,
          displayName: player2.displayName,
        }
      ]
    }
    ```

  * Response: `{ matchId, rules, playersResolved }`

  * Store `matchId` in `Pong.ts` context

  * Switch to `GameCanvasCard`

---

#### 3. `GameCanvasCard`

**Template**: `GameCanvasCard.html` (wraps a `<canvas>` + scoreboard UI)
**Controller**: `GameCanvasCard.ts`

**Purpose**: embed your existing Pong engine (`PongGame.js`, `Player.js`, `Ball.js`,`Paddle.js`) into the arcade UI.

**Responsibilities**:

* Setup canvas sizing and input handling (keyboard / maybe gamepad)
* Show:

  * Player 1 name + score
  * Player 2 name + score
  * Timer / match status

**On game finish:**

* Collect results from `PongGame`:

  * Winner slot
  * Final scores
  * Possibly extras (hit count, rally length, etc.)
* Call backend:

```ts
POST /api/game/matches/:id/result
{
  players: [
    { slot: 1, score: p1Score },
    { slot: 2, score: p2Score },
  ],
  winnerSlot: 1 | 2,
  stats: { ...optionalExtras }
}
```

* Switch to `GameEndCard` with match summary.

---

#### 4. `GameEndCard`

**Template**: `GameEndCard.html`
**Controller**: `GameEndCard.ts`

**UI**:

* “Player X wins!”
* Scores
* Buttons:

  * “Rematch” (same players & rules, new match record)
  * “Change settings”
  * “Back to menu”

For tournaments, we pass a `tournamentId` / `round` / `matchIndex` through the context, and `GameEndCard` triggers:

```ts
POST /api/game/tournaments/:tournamentId/advance
{ matchId, winnerUserId || null, winnerSlot }
```

Then transitions to the next match or to bracket summary.

---

## 2.5 Tournament Section (Frontend)

Tournament will reuse much of the quick-match infrastructure.

### 2.5.1 Views

* `views/Arcade/Menu/Menu.ts`

  * From here, players can:

    * Play quick match
    * Configure / join a tournament
* Planned new views:

| File                                            | Purpose                                 |
| ----------------------------------------------- | --------------------------------------- |
| `Arcade/Tournament/setup.html` + `Setup.ts`     | Create / configure tourney              |
| `Arcade/Tournament/bracket.html` + `Bracket.ts` | Show bracket, current match, next games |

### 2.5.2 Tournament creation flow

On `/arcade` -> “Tournament” button:

1. Show `TournamentSetupCard` (inside ArcadeMenu or dedicated view)

   * Parameters:

     * Number of players (4, 8)
     * Player list:

       * Local “slots” where players identify like in quick match **or**
       * Choose from existing friends (when logged in through phone or later in app)
   * When done:

     * `POST /api/game/tournaments`

       ```json
       {
         "name": "Saturday Night Cup",
         "createdByUserId": 123,
         "players": [
           { "userId": 1, "displayName": "jeportie" },
           { "userId": 2, "displayName": "Antoine" },
           { "guestName": "Guest 1" },
           ...
         ],
         "rules": { "scoreLimit": 11, "bestOf": 3 }
       }
       ```
     * Response: `{ tournamentId, bracket }`

2. The frontend redirects to `/arcade/play?tournamentId=X&matchId=Y`

   * `ArcadeMatch` reads `tournamentId` and `matchId`
   * Pre-fills player cards with appropriate participants
   * Locks editing of identity (since they are defined by tournament)

3. After each match:

   * `/api/game/matches/:id/result`
   * `/api/game/tournaments/:id/advance`
   * Tournament API responds with:

     * Next match pairing
     * Tournament status (round, bracket tree)

4. `Arcade/Tournament/Bracket.ts` may show bracket visually (optional first iteration: simple list).

---

## 2.6 App Section – Game-related features

### 2.6.1 Dashboard view

**Files**: already exist (`App/Dashboard/...`), we enhance them.

Dashboard will query:

* `GET /api/game/stats/me`

  * Summary:

    * Total matches
    * Wins / losses
    * Win rate
    * Best streak
    * Last 5 matches list
* `GET /api/game/stats/favorite-opponents`

**Dashboard components** (conceptual):

* `StatsSummaryCard`
* `RecentMatchesTable`
* `FavoriteOpponentsList`

---

### 2.6.2 Profile view

**Planned Files**:

* `views/App/Profile/profile.html`
* `views/App/Profile/Profile.ts`
* `views/App/Profile/dom.generated.ts`
* `views/App/Profile/components/AvatarUploader.ts`

**Features**:

* Show / edit:

  * Display name (alias)
  * Country / flag
  * Bio
* Avatar:

  * Upload image:

    * `POST /api/user/profile/avatar` (multipart/form-data)
  * Backend:

    * Saves file to `/data/avatars/{userId}.png` or similar
    * Stores `avatar_url` in `user_profiles` table
  * Frontend:

    * After success, refreshes profile from `GET /api/user/profile/me`

---

### 2.6.3 Friends view

**Planned Files**:

* `views/App/Friends/friends.html`
* `Friends.ts`
* `dom.generated.ts`
* Components:

  * `FriendList.ts`
  * `FriendRequests.ts`
  * `FriendStatsPreview.ts`

**API calls**:

* `GET /api/user/friends`
* `GET /api/user/friends/requests`
* `POST /api/user/friends/request`
* `POST /api/user/friends/accept`
* `POST /api/user/friends/remove`
* `GET /api/game/stats/against/:friendId` (for “versus friend” stats)

---

### 2.6.4 Leaderboard view (optional first iteration, but good to plan)

* `GET /api/game/stats/leaderboard?sort=elo&limit=50`
* Display:

  * Top players with:

    * alias
    * avatar
    * rank / ELO
    * win rate

---

## 2.7 Frontend – Summary of Arcade-related API usage

| UI Component            | HTTP Method & Route                                                          | Purpose                              |
| ----------------------- | ---------------------------------------------------------------------------- | ------------------------------------ |
| PlayerLoginCard         | `POST /api/auth/login` (mode: "arcade")                                      | Auth with password, get arcade token |
| PlayerLoginCard (OAuth) | `GET /api/auth/{provider}/start?mode=arcade` → callback returns arcade token | Auth with OAuth, get arcade token    |
| PlayerProfileCard       | `GET /api/game/stats/summary?userId=...`                                     | Show micro stats                     |
| GameSettingsCard        | `POST /api/game/matches`                                                     | Create a new quick match             |
| GameCanvasCard          | `POST /api/game/matches/:id/result`                                          | Commit final result                  |
| GameEndCard (tourney)   | `POST /api/game/tournaments/:id/advance`                                     | Advance bracket                      |
| Dashboard               | `GET /api/game/stats/me`                                                     | Global user stats                    |
| Friends view            | `GET /api/user/friends` etc.                                                 | Social graph                         |
| Profile avatar upload   | `POST /api/user/profile/avatar`                                              | Upload avatar                        |

---

# 3. Backend Architecture

We integrate with your existing **Fastify + SQLite** setup:

* New feature module: `features/game`
* Uses same `sqlRegistry.generated.js` pattern
* New migrations `011_*.sql`, `012_*.sql`, etc. in `services/shared/db/migrations/`

---

## 3.1 New Database Tables

We add at least **4 main tables**:

1. `matches`
2. `match_players`
3. `tournaments`
4. `tournament_players`

Plus **profiles** & **friends** for app:

5. `user_profiles`
6. `friends`

### 3.1.1 `matches`

**Purpose**: one row = one played or planned match.

**Columns (DDL sketch)**:

```sql
CREATE TABLE IF NOT EXISTS matches (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    type            TEXT NOT NULL,              -- 'quick' | 'tournament'
    tournament_id   INTEGER,                    -- NULL for quick matches
    created_by      INTEGER,                    -- optional: user id who started the match
    rules_json      TEXT NOT NULL,              -- JSON string with settings
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    started_at      TEXT,
    finished_at     TEXT,
    status          TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'running' | 'finished' | 'cancelled'

    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);
```

### 3.1.2 `match_players`

**Purpose**: link players (user or guest) to a match.

```sql
CREATE TABLE IF NOT EXISTS match_players (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id        INTEGER NOT NULL,
    slot            INTEGER NOT NULL,              -- 1, 2
    user_id         INTEGER,                       -- NULL for guest
    guest_name      TEXT,                          -- for guests
    display_name    TEXT NOT NULL,                 -- snapshot (user alias or guest name)
    is_winner       INTEGER NOT NULL DEFAULT 0,
    score           INTEGER,                      -- final score
    stats_json      TEXT,                         -- JSON (hits, rallies, etc.)
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_match_players_match ON match_players(match_id);
CREATE INDEX IF NOT EXISTS idx_match_players_user ON match_players(user_id);
```

### 3.1.3 `tournaments`

```sql
CREATE TABLE IF NOT EXISTS tournaments (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    created_by      INTEGER NOT NULL,
    rules_json      TEXT NOT NULL,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    started_at      TEXT,
    finished_at     TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'running' | 'finished' | 'cancelled',

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### 3.1.4 `tournament_players`

```sql
CREATE TABLE IF NOT EXISTS tournament_players (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id   INTEGER NOT NULL,
    user_id         INTEGER,
    guest_name      TEXT,
    display_name    TEXT NOT NULL,
    seed            INTEGER,               -- optional seeding
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_tournament_players_tournament ON tournament_players(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_players_user ON tournament_players(user_id);
```

(*Bracket structure can be encoded in `matches` with `tournament_id` + `rules_json` containing round info / opponent mapping. For v1, simple knockout is enough.*)

### 3.1.5 `user_profiles`

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id         INTEGER PRIMARY KEY,
    display_name    TEXT,            -- alias (can differ from username)
    avatar_url      TEXT,
    country         TEXT,
    bio             TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3.1.6 `friends`

```sql
CREATE TABLE IF NOT EXISTS friends (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    friend_id       INTEGER NOT NULL,
    status          TEXT NOT NULL,         -- 'pending' | 'accepted' | 'blocked'
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, friend_id)
);
CREATE INDEX IF NOT EXISTS idx_friends_user ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend ON friends(friend_id);
```

---

## 3.2 Arcade Auth Tokens

We extend existing `/api/auth/login` and OAuth provider flows with an **arcade mode**:

### 3.2.1 `POST /api/auth/login`

**Existing behavior**:

* Validates credentials
* Issues access+refresh tokens
* Stores refresh token in `refresh_tokens`
* Sets cookies

**Arcade extension**:

* Request body adds: `mode?: "arcade" | "default"`

* If `mode === "arcade"`:

  * Do **not** create refresh token row
  * Do **not** set cookies
  * Issue a **short-lived JWT** (`scope: "arcade"`, `exp: now + 15min`)
  * Return JSON:

    ```json
    {
      "user": { "id": 1, "username": "jeportie" },
      "profile": { "displayName": "Jérome", "avatarUrl": "/avatars/1.png" },
      "arcadeToken": "<JWT>"
    }
    ```

* Keep the current behavior for `mode` null or `default`.

### 3.2.2 OAuth flows

* `GET /api/auth/{provider}/start?mode=arcade`

  * Pass `mode=arcade` through state parameter.
* `GET /api/auth/{provider}/callback?mode=arcade`

  * If `mode=arcade`:

    * Same as login arcade mode:

      * Issue `arcadeToken`
      * Return to frontend with JSON or via redirect to `/arcade/oauth-callback#token=<...>`.

This way you avoid two browser cookie sessions and still reuse `features/auth/oauth`.

---

## 3.3 Game / Tournament API Routes

Create a new feature module: `features/game`.

### 3.3.1 Routes overview

| Method | Route                               | Purpose                                  |
| ------ | ----------------------------------- | ---------------------------------------- |
| POST   | `/api/game/matches`                 | Create a new match (quick or tournament) |
| POST   | `/api/game/matches/:id/result`      | Submit match result                      |
| GET    | `/api/game/matches/:id`             | Get match details                        |
| POST   | `/api/game/tournaments`             | Create a tournament                      |
| GET    | `/api/game/tournaments/:id`         | Get tournament details & bracket         |
| POST   | `/api/game/tournaments/:id/advance` | Register winner & compute next match     |
| GET    | `/api/game/stats/me`                | Get aggregate stats for current user     |
| GET    | `/api/game/stats/summary`           | Summary stats for specified user id      |
| GET    | `/api/game/stats/leaderboard`       | Leaderboard                              |
| GET    | `/api/game/stats/against/:friendId` | Head-to-head stats with a friend         |

---

### 3.3.2 `POST /api/game/matches`

**Request**:

```json
{
  "type": "quick",
  "tournamentId": null,
  "rules": {
    "scoreLimit": 11,
    "ballSpeed": "normal"
  },
  "players": [
    { "slot": 1, "userId": 1, "mode": "user", "displayName": "jeportie" },
    { "slot": 2, "userId": null, "mode": "guest", "displayName": "Guest 1" }
  ]
}
```

**Behavior**:

* Insert into `matches` table
* Insert into `match_players` all provided players
* Return:

```json
{
  "matchId": 123,
  "rules": { ... },
  "players": [ ...resolved data... ]
}
```

**SQL queries** (separate `.sql` files under `features/game/sql`):

* `insertMatch.sql`

  ```sql
  INSERT INTO matches (type, tournament_id, created_by, rules_json)
  VALUES (:type, :tournament_id, :created_by, :rules_json);
  ```
* `insertMatchPlayer.sql`

  ```sql
  INSERT INTO match_players
    (match_id, slot, user_id, guest_name, display_name)
  VALUES
    (:match_id, :slot, :user_id, :guest_name, :display_name);
  ```

---

### 3.3.3 `POST /api/game/matches/:id/result`

**Request**:

```json
{
  "players": [
    { "slot": 1, "score": 11 },
    { "slot": 2, "score": 8 }
  ],
  "winnerSlot": 1,
  "stats": {
    "p1Hits": 40,
    "p2Hits": 35,
    "longestRally": 18
  }
}
```

**Behavior**:

* Update `matches`:

  * `status = 'finished'`
  * `finished_at = now`
* Update `match_players`:

  * Set `score`, `is_winner`, `stats_json` for each slot

**SQL**:

* `updateMatchResult.sql`

  ```sql
  UPDATE matches
  SET status = 'finished', finished_at = datetime('now')
  WHERE id = :match_id;
  ```

* `updateMatchPlayerResult.sql`

  ```sql
  UPDATE match_players
  SET score = :score,
      is_winner = :is_winner,
      stats_json = :stats_json
  WHERE match_id = :match_id
    AND slot = :slot;
  ```

If `tournament_id` is not null, the service then calls tournament logic (`advanceTournamentMatch`).

---

### 3.3.4 `POST /api/game/tournaments`

**Request**:

```json
{
  "name": "Saturday Cup",
  "rules": { "scoreLimit": 11, "bestOf": 3 },
  "players": [
    { "userId": 1, "displayName": "jeportie" },
    { "userId": 2, "displayName": "Antoine" },
    { "guestName": "Guest 1", "displayName": "Guest 1" },
    { "guestName": "Guest 2", "displayName": "Guest 2" }
  ]
}
```

**Behavior**:

* Insert `tournaments` row
* Insert `tournament_players` rows
* Compute initial bracket (simple knockout v1) and pre-create matches or defer match creation until each match is about to be played.

**SQL**:

* `insertTournament.sql`
* `insertTournamentPlayer.sql`

---

### 3.3.5 `POST /api/game/tournaments/:id/advance`

**Request**:

```json
{
  "matchId": 123,
  "winnerSlot": 1
}
```

**Behavior**:

* Determine winner `user_id` / `guest_name` from `match_players`
* Update bracket model (in code or storing bracket JSON in `tournaments.rules_json` or a dedicated `tournament_matches` table—optional v2)
* If next round match is ready:

  * return `nextMatchId` and `players` to play
* If tournament is finished:

  * update `tournaments.status = 'finished'`
  * `finished_at = now`

**API response**:

```json
{
  "status": "advance-ok",
  "nextMatch": {
    "matchId": 124,
    "players": [ ... ]
  } // or null if tournament ended
}
```

---

## 3.4 Game Stats API

### 3.4.1 `GET /api/game/stats/me`

Authenticated via usual cookie + JWT (not arcade token).

**Behavior**:

* Use `request.user.id`
* Query aggregated stats:

Example SQL:

```sql
SELECT
  COUNT(*) AS total_matches,
  SUM(CASE WHEN mp.is_winner = 1 THEN 1 ELSE 0 END) AS wins,
  SUM(CASE WHEN mp.is_winner = 0 THEN 1 ELSE 0 END) AS losses
FROM match_players mp
WHERE mp.user_id = :user_id;
```

Also:

```sql
SELECT
  opponent.display_name AS opponent_name,
  SUM(CASE WHEN self.is_winner = 1 THEN 1 ELSE 0 END) AS wins,
  SUM(CASE WHEN self.is_winner = 0 THEN 1 ELSE 0 END) AS losses
FROM match_players self
JOIN match_players opponent
  ON self.match_id = opponent.match_id
 AND self.slot != opponent.slot
WHERE self.user_id = :user_id
GROUP BY opponent.display_name
ORDER BY (wins + losses) DESC
LIMIT 5;
```

Returned JSON is consumed by Dashboard.

---

### 3.4.2 Leaderboard

`GET /api/game/stats/leaderboard?limit=50`

* Simple first version: sort by number of wins or win rate.
* Later: maintain an ELO column in a separate `user_game_stats` table updated after each match.

---

## 3.5 Profile & Friends API

Just the skeleton here:

### 3.5.1 Profile

* `GET /api/user/profile/me`
* `GET /api/user/profile/:id`
* `POST /api/user/profile`

  * Update display_name, bio, country
* `POST /api/user/profile/avatar`

  * Accepts `multipart/form-data` with `avatar` file
  * Stores image file, updates `user_profiles.avatar_url`

### 3.5.2 Friends

* `GET /api/user/friends`
* `GET /api/user/friends/requests`
* `POST /api/user/friends/request`

  ```json
  { "friendId": 42 }
  ```
* `POST /api/user/friends/accept`
* `POST /api/user/friends/remove`

All with simple SQL on `friends` table.

---

# 4. Summary / Implementation Order

**Suggested order to implement:**

1. **DB migrations** for:

   * `matches`, `match_players`
   * `tournaments`, `tournament_players`
   * `user_profiles`, `friends`

2. **Backend feature `game`**:

   * `POST /api/game/matches`
   * `POST /api/game/matches/:id/result`
   * `GET /api/game/stats/me`

3. **Extend `/api/auth/login`** with `mode: "arcade"` returning `arcadeToken`.

4. **Frontend ArcadeMatch refactor**:

   * Introduce `player1-slot`, `player2-slot`, `game-slot`
   * Add `PlayerLoginCard`, `PlayerGuestAliasCard`, `PlayerProfileCard`
   * Wire `GameSettingsCard` + `GameCanvasCard` to new match API

5. Add tournament flows (v2)

6. Add profile & avatar (v2)

7. Add friends & leaderboard (v3+)
