// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AFetch.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/21 14:37:50 by jeportie          #+#    #+#             //
//   Updated: 2025/08/21 14:40:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default class AFetch {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async get(endpoint) {
        const response = await fetch(this.baseURL + endpoint);
        return response.json();
    }

    async put(endpoint, body) {
        return this.#send("PUT", endpoint, body);
    }

    async post(endpoint, body) {
        return this.#send("POST", endpoint, body);
    }

    async delete(endpoint, body) {
        return this.#send("DELETE", endpoint, body);
    }

    async #send(method, endpoint, body) {
        const response = await fetch(this.baseURL + endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        return response.json();
    }
}
