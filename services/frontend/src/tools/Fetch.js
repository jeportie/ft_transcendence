// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Fetch.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/21 14:04:55 by jeportie          #+#    #+#             //
//   Updated: 2025/08/21 14:05:42 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { auth } from "./AuthService.js";

function safeJson(t) {
    try { return JSON.parse(t); } catch { return null; }
}

export default class Fetch {
    constructor(baseURL, {
        getToken = () => auth.getToken(),
        onToken = (token) => auth.setToken(token),
    } = {}) {
        this.baseURL = baseURL;
        this.getToken = getToken;
        this.onToken = onToken;
    }

    get(endpoint, opts) { return this.#send("GET", endpoint, undefined, opts); }
    post(endpoint, body, opts) { return this.#send("POST", endpoint, body, opts); }
    put(endpoint, body, opts) { return this.#send("PUT", endpoint, body, opts); }
    delete(endpoint, body, opts) { return this.#send("DELETE", endpoint, body, opts); }

    async #send(method, endpoint, body, opts = {}) {
        console.log(`[Fetch] Sending ${method} ${endpoint} with token:`, this.getToken?.());
        const headers = { ...(opts.headers || {}) };
        if (body !== undefined && method !== "GET" && method !== "HEAD") {
            headers["Content-Type"] = "application/json";
        }

        // Attach Bearer token if present
        const token = this.getToken?.();
        if (token)
            headers["Authorization"] = `Bearer ${token}`;

        const init = { method, headers, credentials: "include" };
        if (body !== undefined && method !== "GET" && method !== "HEAD") {
            init.body = JSON.stringify(body);
        }

        let res = await fetch(this.baseURL + endpoint, init);

        const text = await res.text();
        const data = text ? safeJson(text) : null;

        if (res.status === 401 && !endpoint.startsWith("/auth/")) {
            console.log("[Fetch] Got 401, trying refresh...");
            const refreshedToken = await this.#tryRefresh();
            if (refreshedToken) {
                // Retry original request with new token
                const retryHeaders = { ...headers };
                const newTok = this.getToken?.();
                if (newTok) retryHeaders["Authorization"] = `Bearer ${newTok}`;
                res = await fetch(this.baseURL + endpoint, { ...init, headers: retryHeaders });
                const text2 = await res.text();
                const data2 = text2 ? safeJson(text2) : null;
                if (!res.ok) {
                    const err2 = new Error((data2 && data2.error) || res.statusText || "Request failed");
                    err2.status = res.status;
                    err2.data = data2;
                    throw err2;
                }
                return (data2);
            }
        }

        if (!res.ok) {
            const err = new Error((data && (data.error || data.message)) || res.statusText || "Request failed");
            err.status = res.status;
            err.data = data;
            throw err;
        }
        return (data);
    }

    async #tryRefresh() {
        try {
            const res = await fetch(this.baseURL + "/auth/refresh", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) return false;
            const json = await res.json();
            if (json && json.token) {
                console.log("[Fetch] Refresh success, new token:", json.token);
                this.onToken(json.token);
                return true;
            }
            console.log("[Fetch] Refresh failed");
            return false;
        } catch {
            return false;
        }
    }
}
