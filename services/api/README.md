
---

# ✅ Folder Structure Review

```
services/api/
├── config/                # Build/runtime config files (package.json, tsconfig, etc.)
├── src/
│   ├── app.js             # Fastify app factory
│   ├── server.js          # Entrypoint: boot + migrations + listen
│   ├── config/            # Runtime config + env parsing
│   ├── db/                # SQLite connection, migrations, seeding
│   ├── plugins/           # Fastify plugins (jwt, cors, rateLimit, etc.)
│   ├── routes/            # HTTP routes (thin adapters)
│   │   ├── private/       # Auth-protected routes (/me, /admin/users)
│   │   └── public/        # Public routes (auth, oauth, health)
│   ├── schemas/           # JSON Schemas (login, register, me, etc.)
│   └── services/          # Business logic
│       ├── auth/          # Auth-related services
│       │   ├── local/     # Local login/register/logout/refresh
│       │   ├── oauth/     # Google OAuth (provider registry)
│       │   ├── cookie.js  # Cookie helpers
│       │   ├── tokens.js  # Token helpers
│       │   └── password.js# Argon2 helpers
│       ├── user/          # User queries (me, admin list)
│       └── system/        # Health service
├── Dockerfile
└── README.md
```

### 👍 Strengths

* **Clear separation**: config, db, plugins, routes, services are well scoped.
* **Thin routes**: routes just call services and attach schemas.
* **Schema-driven**: all schemas are centralized → good for OpenAPI.
* **Auth modularity**: local vs oauth nicely split.

### 🔧 Suggested Improvements

1. **Group by domain instead of layer (optional)**
   Right now it’s layered (routes/schemas/services split).
   An alternative is **feature-first structure**, e.g.:

   ```
   auth/
     ├── routes.js
     ├── schema.js
     ├── service.js
   user/
     ├── routes.js
     ├── schema.js
     ├── service.js
   ```

   → This makes onboarding easier (“I want to work on auth, go in `auth/`”).

   But your current structure is totally valid — stick with it if you like clarity.

2. **Move `schemas/` closer to their domain**
   Instead of one flat `schemas/` folder, put each schema next to its service.
   (Prevents drift between schema and implementation.)

   Example:
   `services/auth/local/loginSchema.js`

3. **Add `/tests` folder** (even if minimal)
   For integration tests: migrations → login → refresh → logout.

4. **Add `/docs` folder**
   For architecture decisions, ADRs, and the re-architecture plan you mentioned.

---

# 📝 Suggested README.md

Here’s a full draft that documents your backend with structure, explanation, and implementation guide.

```markdown
# ft_transcendence – API Service

This is the backend API for **ft_transcendence** (42 School project).  
It is built with **Fastify**, **SQLite**, and a modular architecture.

---

## 📂 Project Structure

```

src/
├── app.js          # Fastify app factory (registers plugins & routes)
├── server.js       # Entrypoint: runs migrations, starts server
├── config/         # Runtime config + env parsing
├── db/             # SQLite connection, migrations, demo seed
├── plugins/        # Fastify plugins (jwt, security, rateLimit, docs)
├── routes/         # HTTP routes (thin adapters)
│   ├── private/    # Protected routes (/me, /admin/users)
│   └── public/     # Public routes (auth, oauth, health)
├── schemas/        # JSON Schemas (OpenAPI docs)
└── services/       # Business logic
    ├── auth/       # Authentication
│   ├── local/  # Local login/register/logout/refresh
│   ├── oauth/  # Google OAuth (provider registry)
│   ├── cookie.js
│   ├── tokens.js
    └── password.js
    ├── user/       # User-related services
    └── system/     # Health checks

````
### Design Principles
- **Thin routes**: routes only parse/validate → delegate to services.
- **Services own logic**: all business logic lives in `services/`.
- **Schemas drive docs**: schemas = runtime validation + Swagger/OpenAPI.
- **Plugins extend app**: db, jwt, cors, docs, etc.
- **Migrations on boot**: schema changes applied automatically.

---

## 🚀 Running the API

```bash
# 1. Install deps
cd services/api
npm install

# 2. Run in dev
npm run dev

# 3. Build & start (prod)
npm run build
npm start
````

Environment variables (see `.env.local`):

```
NODE_ENV=development
HOST=0.0.0.0
PORT=5000

# Security
JWT_SECRET=supersecret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=7

# Cookies
COOKIE_NAME_RT=rt
COOKIE_SECURE=false
COOKIE_SAMESITE=lax

# OAuth (Google example)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

---

## 📖 API Overview

### Authentication

* `POST /api/auth/register` → Create account
* `POST /api/auth/login` → Login with username/email + password
* `POST /api/auth/refresh` → Rotate refresh cookie + return new access token
* `POST /api/auth/logout` → Revoke refresh + clear cookie
* `GET  /api/auth/google/start` → Redirect to Google consent
* `GET  /api/auth/google/callback` → OAuth callback (issues session)

### User

* `GET /api/me` → Current user profile (requires access token)
* `GET /api/admin/users` → List all users (admin only)

### System

* `GET /api/health` → Database + API health check

---

## 🔐 Session Model

* **Access token (JWT)**: short-lived, in-memory (frontend `AuthService`)
* **Refresh token (cookie)**: long-lived, httpOnly, rotated on use
* **Database**: refresh tokens stored hashed (`sha256`)

---

## 🛠 Implementation Manual (next providers)

To add another OAuth provider (GitHub, 42 intra, etc.):

1. Add provider entry in `services/auth/oauth/providers.js`:

   ```js
   export function makeGithubProvider(app) {
     // create OAuth client
     return {
       getAuthUrl: (state) => "...",
       exchangeCode: (code) => {...},
     };
   }
   ```

2. Extend `getProvider()`:

   ```js
   if (name === "github") return makeGithubProvider(app);
   ```

3. Update frontend: add “Continue with GitHub” button → `/api/auth/github/start`.

---

## ✅ TODO / Next Steps

### Solid & Stable Re-architecture

The injected-JS trick (writing `localStorage.hasSession`) works, but a more robust design is:

* **Frontend `AuthService` always tries `/api/auth/refresh` on boot**.
* If refresh succeeds → session is active.
* If refresh fails → redirect to login.
* No need for localStorage hacks.

### Must-have

* [ ] Finalize **register → login → refresh → logout** flows
* [ ] Switch SPA auth flow to **cookie-first (refresh)** model
* [ ] Add integration tests (`jest` or `tap`) for login + oauth
* [ ] Harden cookie security (`SameSite=None; Secure` in prod)

### Nice-to-have

* [ ] Add **GitHub OAuth**
* [ ] Add **42 Intra OAuth**
* [ ] Add **email verification flow**
* [ ] Add **role-based routes** beyond `admin`
* [ ] Add **rate limit per account**, not only per IP
* [ ] Add **password reset** (with token + expiry)
* [ ] Add **account deletion / GDPR cleanup**
* [ ] Add **docker-compose.yml** for `api + frontend + db`
* [ ] Add CI/CD (GitHub Actions → lint + test + docker build)

---

