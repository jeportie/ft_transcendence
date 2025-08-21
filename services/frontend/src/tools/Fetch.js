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

export default class Fetch {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    get(endpoint) {
        return fetch(this.baseURL + endpoint)
            .then(response => response.json());
    }

    put(endpoint, body) {
        return this.#send("put", endpoint, body);
    }

    post(endpoint, body) {
        return this.#send("post", endpoint, body);
    }

    delete(endpoint, body) {
        return this.#send("delete", endpoint, body);
    }

    #send(method, endpoint, body) {
        return fetch(this.baseURL + endpoint, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(response => response.json());
    }
}
