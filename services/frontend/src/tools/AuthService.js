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

// Minimal AuthService for Lesson 1
export class AuthService {
    #storageKey = "token";
    #token = null;

    initFromStorage() {
        this.#token = localStorage.getItem(this.#storageKey);
    }

    isLoggedIn() {
        // return !!this.#token;
        return !!this.#token;
    }

    getToken() {
        return this.#token;
    }

    setToken(token) {
        this.#token = token;
        localStorage.setItem(this.#storageKey, token);
    }

    clear() {
        this.#token = null;
        localStorage.removeItem(this.#storageKey);
    }

    // Proactive expiry check
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
