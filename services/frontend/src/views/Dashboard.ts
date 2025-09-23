// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Dashboard.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 18:39:16 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 13:26:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import dashboardHTML from "../html/dashboard.html";

export default class Dashboard extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Dashboard");
    };

    getHTML() {
        return (dashboardHTML);
    }

    mount() {
        const userInfoEl = document.querySelector("#user-info");

        API.get("/me")
            .then((data: any) => {
                console.log(data); // backend response
                if (data?.success || data?.username) {
                    const username = data.username || data.me?.username;
                    const email = data.email || data.me?.email;
                    userInfoEl!.innerHTML =
                        `<p><strong>Logged in as:</strong> ${username} (${email})</p>`;
                } else {
                    userInfoEl!.innerHTML = `<p class="ui-error">Could not load user info.</p>`;
                }
            })
            .catch((err: any) => {
                console.error("[Dashboard] Failed to fetch /me:", err);
                userInfoEl!.innerHTML = `<p class="ui-error">Error loading user info.</p>`;
            });
    }
}

