// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AuthService.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 17:43:48 by jeportie          #+#    #+#             //
//   Updated: 2025/08/26 17:46:06 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export class AuthService {
    #token = null;
    #storageKey = "hasSession";

    async initFromStorage() {
        this.#token = null;

        if (!localStorage.getItem(this.#storageKey)) {
            return false;
        }

        try {
            const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });

            if (res.status === 401) {
                this.clear();
                return false; // not logged in
            }
            if (!res.ok) {
                console.error("[Auth] Refresh failed:", res.status);
                this.clear();
                return false;
            }

            const json = await res.json();
            if (json && json.token) {
                this.setToken(json.token);
                return true;
            }
            return false;
        } catch (err) {
            console.error("[Auth] Refresh exception:", err);
            this.clear();
            return false;
        }
    }

    isLoggedIn() {
        return !!this.#token;
    }

    getToken() {
        return this.#token;
    }

    setToken(token) {
        this.#token = token;
        localStorage.setItem(this.#storageKey, "true");
    }

    clear() {
        this.#token = null;
        localStorage.removeItem(this.#storageKey);
    }

    isTokenExpired(skewSec = 10) {
        const t = this.#token;
        if (!t) return true;
        const parts = t.split(".");
        if (parts.length !== 3) return true;
        try {
            const payload = JSON.parse(atob(parts[1]));
            const now = Math.floor(Date.now() / 1000);
            return (payload.exp ?? 0) <= (now + skewSec);
        } catch {
            return true;
        }
    }
}

// Singleton instance for the app
export const auth = new AuthService();
