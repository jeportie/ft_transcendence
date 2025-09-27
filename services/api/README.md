
---

# ft_transcendence Backend (API Service)

You can find all the API definitions at : localhost:5000/docs (need to run the server first)

## Overview

This service is a **Fastify-based backend** for the `ft_transcendence` project.
It follows a **modular feature-based architecture**:

* **Plugins** register global capabilities (DB, JWT, docs, etc.).
* **Features** are self-contained folders, each with controllers, handlers, schemas, services, and SQL.
* **Utils** provide reusable helpers like error handling, SQL loading, and replies.
* **DB** layer handles SQLite connection and migrations.

The goal is **consistency**: any developer can add new features or routes by following the same structure and patterns.

---

## 🚦 Routes Overview

Here’s a list of all **currently implemented routes**:

### 🔐 Auth (`/api/auth`)

* `POST /api/auth/login` → login with username/email + password
* `POST /api/auth/register` → register new user
* `POST /api/auth/refresh` → refresh & rotate access/refresh tokens
* `POST /api/auth/logout` → logout (invalidate refresh token)
* `GET /api/auth/:provider/start` → start OAuth flow (currently `google`)
* `GET /api/auth/:provider/callback` → handle OAuth callback

### 👤 User (`/api/user`, `/api/admin`)

* `GET /api/user/me` → get current user profile (requires Bearer token)
* `GET /api/admin/users` → list all users (requires admin role)

### ⚙️ System (`/api/system`)

* `GET /api/system/health` → check API + DB health

---

## 🚀 Development Workflow

1. Run migrations automatically at startup (`server.js`).
2. Use `npm run dev` (nodemon) for live reload.
3. Access API docs at [http://localhost:5000/docs](http://localhost:5000/docs).
4. DB file is stored in `src/data/app.db` (local dev).

   * In Docker, mount a volume at `/data` if you want persistence.

---

## Folder Structure

```
src/
├── app.js              # Build and configure the Fastify app
├── server.js           # App entrypoint
├── config/             # Environment and configuration
├── db/                 # SQLite connection and migrations
├── plugins/            # Fastify plugins (db, jwt, docs, security, etc.)
├── features/           # Self-contained features (auth, system, user, …)
├── utils/              # Shared helpers (AppError, reply, sqlLoader, …)
├── data/               # Local SQLite database file (dev only)
```

### `config/`

* `config.js` → Centralized configuration from environment variables.
* `envParser.js` → Helpers to coerce env values into correct types.

### `db/`

* `connection.js` → Opens SQLite DB, ensures folder exists.
* `migrations.js` → Runs `.sql` migrations at startup.
* `migrations/` → Each SQL file is versioned (`001_xxx.sql`).
* `hashDemoUserPwd.js` → Ensures demo user password is Argon2 hashed.

### `plugins/`

Reusable Fastify plugins:

* `db.js` → Makes `fastify.getDb()` available.
* `jwt.js` → Configures JWT and `fastify.authenticate/authorize`.
* `security.js` → CORS + security headers.
* `docs.js` → Swagger/OpenAPI UI at `/docs`.
* `rateLimit.js` → Global rate limiting.

### `features/`

Each feature is **self-contained**:

```
features/
└── auth/
    ├── controller/   # Thin wrappers: call service, handle errors, reply
    ├── handler/      # Route definitions (register controllers + schema)
    ├── schema/       # JSON schemas for request/response validation
    ├── service/      # Business logic, DB queries, SQL
    ├── errors.js     # Feature-specific error codes
    └── plugin.js     # Register all routes under a prefix
```

Example: `features/auth/plugin.js` registers both local login and OAuth routes under `/api/auth`.

### `utils/`

* `AppError.js` → Standard error wrapper with code, message, status, logging.
* `reply.js` → Helpers for consistent replies (`ok()`, `created()`, etc.).
* `sqlLoader.js` → Import `.sql` queries relative to service file.

---

## Standard Flow (Request Lifecycle)

1. **Request enters handler** → defined in `feature/handler/...handler.js`.
2. **Schema validation** → body/query/response validated automatically.
3. **Controller executes** → calls service and wraps error handling.
4. **Service runs business logic** → DB queries, password hashing, token creation, etc.
5. **Errors** are thrown using `AppError` (feature errors collected in `errors.js`).
6. **Replies** are sent using `utils/reply.js`.

---

## Coding Conventions

* **Routes** must:

  * Live in `handler/xxx.handler.js`.
  * Use a JSON schema (`schema/`) for validation.
  * Call a **controller**, not the service directly.

* **Controllers**:

  * Wrap service calls in try/catch.
  * On success → use `ok(reply, data)`.
  * On failure → use `AppError.handle()`.

* **Services**:

  * Contain all the logic (DB, tokens, hashing).
  * Load SQL with `loadSql(import.meta.url, "./sql/file.sql")`.
  * Throw feature-specific errors from `errors.js`.

* **Errors**:

  * Always define them in `feature/errors.js` for consistency.
  * Example:

    ```js
    export const UserErrors = {
      NotFound: (id) => new AppError("USER_NOT_FOUND", "User not found", 404, `[User] No user with id=${id}`)
    }
    ```

* **Replies**:

  * Use helpers from `utils/reply.js` (`ok`, `created`, `noContent`).
  * Never `reply.send({})` directly in controllers.

---

## Adding a New Feature (Step by Step)

Let’s say we want a **Game** feature.

### 1. Create folder structure

```
features/game/
├── controller/game.controller.js
├── handler/game.handler.js
├── schema/gameSchema.js
├── service/game.service.js
├── sql/getGame.sql
├── errors.js
└── plugin.js
```

### 2. Define SQL

`features/game/sql/getGame.sql`

```sql
SELECT id, name, created_at
FROM games
WHERE id = :id;
```

### 3. Create errors

`features/game/errors.js`

```js
import { AppError } from "../../utils/AppError.js";

export const GameErrors = {
  NotFound: (id) =>
    new AppError("GAME_NOT_FOUND", "Game not found", 404, `[Game] id=${id}`),
};
```

### 4. Implement service

`features/game/service/game.service.js`

```js
import { loadSql } from "../../../utils/sqlLoader.js";
import { GameErrors } from "../errors.js";

const getGameSql = loadSql(import.meta.url, "../sql/getGame.sql");

export async function getGame(fastify, id) {
  const db = await fastify.getDb();
  const game = await db.get(getGameSql, { ":id": id });
  if (!game) throw GameErrors.NotFound(id);
  return { game };
}
```

### 5. Controller

`features/game/controller/game.controller.js`

```js
import * as service from "../service/game.service.js";
import { AppError } from "../../../utils/AppError.js";
import { ok } from "../../../utils/reply.js";

const DOMAIN = "[Game]";

export async function getGame(req, reply) {
  try {
    const data = await service.getGame(req.server, req.params.id);
    return ok(reply, data);
  } catch (err) {
    return AppError.handle(err, req, reply, DOMAIN);
  }
}
```

### 6. Schema

`features/game/schema/gameSchema.js`

```js
export const getGameSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer", minimum: 1 }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["success", "game"],
      properties: {
        success: { type: "boolean" },
        game: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: { type: "integer" },
            name: { type: "string" }
          }
        }
      }
    }
  }
};
```

### 7. Handler

`features/game/handler/game.handler.js`

```js
import * as controller from "../controller/game.controller.js";
import { getGameSchema } from "../schema/gameSchema.js";

export async function gameRoutes(fastify) {
  fastify.get("/:id", { schema: getGameSchema }, controller.getGame);
}
```

### 8. Plugin

`features/game/plugin.js`

```js
import fp from "fastify-plugin";
import { gameRoutes } from "./handler/game.handler.js";

export default fp(async function gamePlugin(fastify) {
  await fastify.register(gameRoutes, { prefix: "/api/games" });
});
```

### 9. Register in `app.js`

```js
import gamePlugin from "./features/game/plugin.js";
// …
await fastify.register(gamePlugin);
```

✅ Done → `/api/games/:id` is now available.

---

## Adding a New Route to an Existing Feature

Suppose you want `POST /api/user/promote`.

1. Add `promoteUser.sql` to `features/user/service/sql/`.
2. Add `promoteUser()` function in `user.service.js`.
3. Add schema in `schema/promoteSchema.js`.
4. Add controller method in `controller/user.controller.js`.
5. Register in `handler/user.handler.js`.
6. Update `plugin.js` if new handler is needed.

---

## 🧪 Example: Adding a Protected Route

Suppose you want `GET /api/posts/private` that only authenticated users can see:

```js
fastify.get(
  "/private",
  { preHandler: [fastify.authenticate] },
  controller.getPrivatePosts
);
```

If you want admin-only:

```js
fastify.get(
  "/all",
  { preHandler: [fastify.authorize("admin")] },
  controller.getAllPosts
);
```

---

## Example Error Handling

* **Good**:

  ```js
  if (!row) throw UserErrors.UserNotFound(id);
  ```
* **Bad**:

  ```js
  if (!row) reply.code(404).send({ error: "Not found" });
  ```

Use the **error catalog** instead of ad-hoc replies.

---

## Example Success Reply

* **Good**:

  ```js
  return ok(reply, { user });
  ```
* **Bad**:

  ```js
  return reply.send({ user });
  ```

Always include `success: true` automatically via helpers.

---

## Swagger Docs

* Every route **must** define a schema.
* `/docs` shows live API documentation.

---

## Checklist for New Code

* [ ] SQL in `/sql/` file, loaded with `loadSql`.
* [ ] Errors defined in `errors.js`.
* [ ] Business logic in `service/`.
* [ ] Controller wraps service + errors.
* [ ] Schema defines validation + docs.
* [ ] Handler registers routes.
* [ ] Plugin groups feature routes under prefix.
* [ ] Register feature plugin in `app.js`.

---

## ✅ Coding Conventions

* **Errors** → define in `errors.js` using `AppError`.
* **Controllers** → thin, wrap service in try/catch, return `ok()` or `AppError.handle()`.
* **Services** → business logic, database queries. No `reply` here.
* **Handlers** → connect routes to controllers + schemas.
* **Plugins** → register handlers under `/api/<feature>`.
* **Schemas** → OpenAPI + validation (`tags`, `body`, `response`).
