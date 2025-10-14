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

    async mount() {
        const userInfoEl = document.querySelector("#user-info");
        if (!userInfoEl)
            return;

        const { data, error } = await API.Get("/user/me");

        if (error) {
            console.error("[Dashboard] Failed to fetch /user/me:", error);
            userInfoEl.innerHTML = `<p class="ui-error">Error loading user info.</p>`;
            return;
        }

        console.log(data);

        const user = data.me;
        if (!data.success || !user) {
            userInfoEl!.innerHTML = `<p class="ui-error">Could not load user info.</p>`;
        } else {
            userInfoEl.innerHTML = `
                <p><strong>Logged in as:</strong> ${user.username} (${user.email})</p>
            `;
        }
    }
}

