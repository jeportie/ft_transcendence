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

    initFromStorage() {
        this.#token = null; // reset first

        // Try to restore using refresh cookie
        return fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
            .then(res => res.ok ? res.json() : null)
            .then(json => {
                if (json?.token) {
                    this.setToken(json.token);
                    return true; // session restored
                } else {
                    this.clear();
                    return false;
                }
            })
            .catch(() => {
                this.clear();
                return false;
            });
    }

    isLoggedIn() {
        return !!this.#token;
    }

    getToken() {
        return this.#token;
    }

    setToken(token) {
        this.#token = token;
    }

    clear() {
        this.#token = null;
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


// Version local storage / unsafe
// export class AuthService {
//     #storageKey = "token";
//     #token = null;
//
//     initFromStorage() {
//         this.#token = localStorage.getItem(this.#storageKey);
//     }
//
//     isLoggedIn() {
//         return !!this.#token;
//     }
//
//     getToken() {
//         return this.#token;
//     }
//
//     setToken(token) {
//         this.#token = token;
//         localStorage.setItem(this.#storageKey, token);
//     }
//
//     clear() {
//         this.#token = null;
//         localStorage.removeItem(this.#storageKey);
//     }
//
//     isTokenExpired(skewSec = 10) {
//         const t = this.#token;
//         if (!t) return true;
//         const parts = t.split(".");
//         if (parts.length !== 3) return true;
//         try {
//             const payload = JSON.parse(atob(parts[1]));
//             const now = Math.floor(Date.now() / 1000);
//             return (payload.exp ?? 0) <= (now + skewSec);
//         } catch {
//             return true;
//         }
//     }
// }

// Singleton instance for the app
export const auth = new AuthService();
