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
        return !!this.#token || !!localStorage.getItem(this.#storageKey);
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
}

// Singleton instance for the app
export const auth = new AuthService();
