---

# 🔐 Auth Feature — Roadmap

### ✅ Already solid

* Local login/register
* JWT access + refresh rotation
* Cookies (httpOnly, signed)
* OAuth (Google)
* Error-code + controller separation

### 📌 Next milestones

1. **More OAuth providers**

   * GitHub (easy, good for devs)
   * Apple (strict, but cool for CV)
   * Meta (FB/IG — less relevant unless you want social features)
   * 42 Intra (makes sense for 42 projects & your portfolio)
     👉 You can add them one by one in `providers.js`.

2. **2FA / MFA**

   * **TOTP** (Google Authenticator, Authy): generate & verify QR codes/secrets.
   * **Backup codes**: one-time use codes for recovery.
   * **Email/SMS OTP**: fallback, but requires mailer + SMS service (Twilio, OVH).
     👉 This is a *real CV booster* if you do TOTP.

3. **Anti-bot / Verify Human**

   * ReCAPTCHA v3 or hCaptcha (for register/login).
   * Could also do a simple honeypot field (hidden input).
     👉 Useful if you deploy public, not required for ft_transcendence.

4. **Account management**

   * Delete account (with cascade: refresh tokens, game data, stats).
   * Change email / password (with re-auth).
   * Session management (list devices & revoke tokens).
     👉 This overlaps with **User** feature.

5. **Advanced security**

   * Rate limiting per route (already for login, but could fine-tune).
   * IP/device fingerprinting for sessions.
   * WebAuthn (FIDO2 / passkeys) — maybe overkill, but very modern.

---

# ⚙️ System Feature — Roadmap

### ✅ Already solid

* Health check with DB integration

### 📌 Next milestones

1. **Diagnostics**

   * Uptime, memory, CPU, request count.
   * DB status (migration version, pending migrations).
   * Connected services (OAuth providers, mail, Redis if added).

2. **Monitoring**

   * `/metrics` endpoint (Prometheus/StatsD).
   * Audit log system (security-critical actions: login, delete user, role change).

3. **Admin toggles**

   * Maintenance mode flag.
   * Feature flags (for new features rollout).

👉 For ft_transcendence, only health check is required. For your own site, adding `/metrics` and an audit log shows **production-grade engineering**.

---

# 👤 User Feature — Roadmap

### ✅ Already solid

* `GET /me` (profile)
* `GET /users` (admin only)

### 📌 Next milestones

1. **Profile management**

   * Update username, email, password.
   * Upload avatar (file storage or external service like S3/Cloudinary).
   * Add bio/social links (portfolio-friendly).

2. **Account lifecycle**

   * Delete account (cascade delete).
   * Deactivate / reactivate account.

3. **Roles & permissions**

   * Extend roles beyond `player/admin`: e.g., `moderator`, `editor`.
   * RBAC middleware for flexible access control.

4. **Social features** (for ft_transcendence game)

   * Friends / block list.
   * Game history (match stats).
   * Leaderboards.
   * Achievements.

👉 For your **portfolio site**, profile customization + social login + account deletion = enough to show production skills.

---


# 🔑 1. Where does 2FA belong?

* **Not a new top-level feature** → it’s part of **auth**.
* Why:

  * It’s directly tied to login/refresh/logout.
  * It affects **sessions** and **user identity**, not a separate domain like `user` or `system`.
* ✅ So: add it as a **sub-feature of `auth/`**, similar to how you already have `local/` and `oauth/`.

---

# 🔑 2. What kinds of 2FA exist?

You don’t need one 2FA per OAuth provider. 2FA is a **second step after the primary login** (local *or* OAuth). So the flow is:

1. User logs in with local credentials **or** Google OAuth.
2. If 2FA is enabled → require an extra factor.
3. If not enabled → session proceeds as usual.

Typical options you might support:

* **TOTP (time-based one-time password)** → e.g. Google Authenticator, Authy, Microsoft Authenticator.
* **Backup codes** → single-use tokens in case TOTP is lost.
* **(optional) Email/SMS codes** → but usually not for school projects (extra infra).

---

# 🔑 3. Feature placement in your structure

Proposed `auth/f2a/`:

```
auth/
└── service/
    ├── f2a/
    │   ├── index.js
    │   ├── enableF2a.js
    │   ├── disableF2a.js
    │   ├── verifyF2a.js
    │   ├── backupCodes.js
    │   └── sql/
    │       ├── enableF2a.sql
    │       ├── disableF2a.sql
    │       ├── getF2aSecret.sql
    │       └── storeBackupCodes.sql
```

And in `auth/handler/f2a.handler.js` + `auth/controller/f2a.controller.js` + `auth/schema/f2aSchema.js`.

`auth/plugin.js` then registers these under `/api/auth/f2a`.

---

# 🔑 4. DB changes

You’ll need new migrations:

```sql
ALTER TABLE users
ADD COLUMN f2a_secret TEXT DEFAULT NULL;

CREATE TABLE backup_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    code_hash TEXT NOT NULL,
    used_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

---

# 🔑 5. Flow (roadmap)

### **Step 1. Enable 2FA**

* Route: `POST /api/auth/f2a/enable`
* Flow:

  1. Generate a secret (`otplib` or `speakeasy` lib).
  2. Save secret (hashed or encrypted) in DB.
  3. Return an `otpauth://` URI (QR code for authenticator apps).
  4. User scans QR in app and verifies with their first TOTP code.

### **Step 2. Verify 2FA (Login step)**

* Route: `POST /api/auth/f2a/verify`
* Called *after* username/password or OAuth login.
* Flow:

  1. Check if `user.f2a_secret` exists.
  2. If yes → require TOTP code before issuing access/refresh tokens.
  3. If no → skip and continue as usual.

### **Step 3. Disable 2FA**

* Route: `POST /api/auth/f2a/disable`
* Clears `f2a_secret` and backup codes.

### **Step 4. Backup codes**

* Route: `POST /api/auth/f2a/backup`
* Generates 10 one-time codes → hashed and stored in DB.
* User can download/save them.
* During verification, check code hash if TOTP fails.

---

# 🔑 6. Integration with `/settings`

* In your frontend `/settings` page:

  * Toggle 2FA on/off.
  * Show QR code when enabling.
  * Show/generate backup codes.
* Backend:

  * All of this is exposed under `auth/f2a/*` routes.
  * Requires an **authenticated session** (Bearer token) to manage 2FA.

---

# 🔑 7. Roadmap in your repo

1. **Migration** → add `f2a_secret` + `backup_codes`.
2. **Feature scaffold** (`auth/service/f2a`, controller, handler, schema, errors).
3. **Service logic**:

   * `enableF2a()`, `verifyF2a()`, `disableF2a()`, `generateBackupCodes()`.
4. **Controller wrappers** with `AppError.handle()`.
5. **Schemas** for request/response validation.
6. **Plugin** → register routes under `/api/auth/f2a`.
7. **Integrate into login flow**:

   * `local.controller.js` and `oauth.controller.js` should check if `user.f2a_secret` exists → if yes, **don’t issue tokens yet**, return `F2A_REQUIRED`.
   * Then frontend calls `/api/auth/f2a/verify` to finish login.
8. **Docs** update → add `/api/auth/f2a/*` to Swagger.

---

# 🔑 8. Will there be as many 2FA as OAuth providers?

No 🚫.
2FA is independent of the provider — it’s tied to the **user account**.

* User logs in via password *or* Google.
* Then your backend checks if 2FA is enabled for that user.
* So you only need **one 2FA system**, not one per provider.

---

✅ So: 2FA is a **sub-feature of Auth**, tied to the user, not the provider.

---

Do you want me to sketch the **DB migration + service function signatures** (`enableF2a`, `verifyF2a`, etc.) so you can directly scaffold the new feature?
