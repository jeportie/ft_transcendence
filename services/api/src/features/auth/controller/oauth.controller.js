// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   oauth.controller.js                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/25 19:36:51 by jeportie          #+#    #+#             //
//   Updated: 2025/09/25 19:51:43 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { startOAuth } from "../service/oauth/start.js";
import { handleOAuthCallback } from "../service/oauth/callback.js";

export async function startOauth(req, reply) {
    const { provider } = req.params;
    const { next = "/dashboard" } = req.query || {};

    const url = await startOAuth(req.server, provider, next, reply);
    if (!url)
        return (reply.code(404).send({ message: "cannot start OAuth" }));
    reply.redirect(url);
}

export async function handleOAuth(req, reply) {
    const { provider } = req.params;
    const { code, state } = req.query;
    const data = await handleOAuthCallback(req.server, provider, code, state, req, reply);

    if (!data.success) {
        return (reply.code(data.status || 400).send(data));
    }
    // Important: redirect so the browser leaves the JSON page
    // Instead of a raw redirect, inject a script that marks session in localStorage
    reply.type("text/html").send(`
      <script>
        localStorage.setItem("hasSession", "true");
        window.location.href = "${data.redirect}";
      </script>
    `);
}

/*

## Solid & Stable Re-architecture

The injected-JS trick works, but it’s a bit hacky. A more robust design is to make **localStorage irrelevant** and let your refresh cookie be the single source of truth.

### How to do it right:

1. **Change `AuthService.initFromStorage()`**

   * Right now it only refreshes if `localStorage.hasSession` exists.
   * Instead, it should *always* try to call `/api/auth/refresh` first.
   * If refresh returns a valid token → call `auth.setToken()` and return true.
   * If refresh returns 401 → clear localStorage and return false.

   That way, you don’t need the “fake flag” at all.

   Example:

   ```js
   async initFromStorage() {
     try {
       const newToken = await this.#refreshFn?.();
       if (newToken) {
         this.setToken(newToken);
         this.logger.info?.("[Auth] Session restored");
         return true;
       }
       this.logger.warn?.("[Auth] No session to restore");
       this.clear();
       return false;
     } catch (err) {
       this.logger.error?.("[Auth] Refresh exception:", err);
       this.clear();
       return false;
     }
   }
   ```

   👉 Remove the `localStorage.getItem(this.#storageKey)` check.

---

2. **Let the backend own session truth**

   * Refresh cookie = only source of session state.
   * SPA doesn’t need to persist “hasSession” flag manually.
   * If cookie exists and is valid, refresh works.
   * If cookie doesn’t exist, refresh fails, SPA redirects to login.

---

3. **Optional: localStorage still useful**

   * You can still use `localStorage` to store the short-lived access token (so you don’t need to refresh on every SPA boot).
   * But it’s just a cache, not an indicator of session validity.

---

### Benefits of this design

* No more injected scripts.
* No more fragile sync between backend and SPA.
* Works equally well for:

  * Manual login
  * Google OAuth
  * Future GitHub/42 login.
* Easy logout → just clear refresh cookie server-side, SPA will fail refresh next time.

---
*/
