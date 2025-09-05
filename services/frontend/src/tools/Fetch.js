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
    constructor(baseURL, { getToken = () => auth.getToken() } = {}) {
        this.baseURL = baseURL;
        this.getToken = getToken;
    }

    get(endpoint, opts) { return this.#send("GET", endpoint, undefined, opts); }
    post(endpoint, body, opts) { return this.#send("POST", endpoint, body, opts); }
    put(endpoint, body, opts) { return this.#send("PUT", endpoint, body, opts); }
    delete(endpoint, body, opts) { return this.#send("DELETE", endpoint, body, opts); }

    async #send(method, endpoint, body, opts = {}) {
        const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };

        // Attach Bearer token if present
        const token = this.getToken?.();
        if (token)
            headers["Authorization"] = `Bearer ${token}`;

        const init = { method, headers, credentials: "omit" };
        if (body !== undefined && method !== "GET" && method !== "HEAD") {
            init.body = JSON.stringify(body);
        }

        const res = await fetch(this.baseURL + endpoint, init);

        const text = await res.text();
        const data = text ? safeJson(text) : null;

        if (!res.ok) {
            const err = new Error((data && data.error) || res.statusText || "Request failed");
            err.status = res.status;
            err.data = data;
            throw err;
        }
        return (data);
    }
}
