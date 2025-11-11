// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   UserState.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/04 16:26:34 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 14:14:43 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "@system";

export interface User {
    id: number;
    username: string;
    email: string;
    f2a_enabled: boolean;
    oauth: boolean;
    [key: string]: any;
}

export class UserState {
    static #user: User | null = null;

    /** Get cached user or fetch if not available */
    static async get(force = false): Promise<User | null> {
        if (!this.#user || force)
            await this.refresh();
        return this.#user;
    }

    /** Fetch from API and update cache */
    static async refresh(): Promise<User | null> {
        try {
            const res = await API.Get<{ me: any }>("/user/me");
            if (res.error) throw new Error(res.error.message);
            this.#user = res.data?.me || null;
            return this.#user;
        } catch (err) {
            console.error("[UserState] Failed to fetch /user/me", err);
            this.#user = null;
            return null;
        }
    }

    /** Manually update local cache (e.g., after toggle) */
    static update(patch: Partial<User>) {
        if (!this.#user) return;
        this.#user = { ...this.#user, ...patch };
    }

    /** Clear cached user (e.g., on logout) */
    static clear() {
        this.#user = null;
    }
}
