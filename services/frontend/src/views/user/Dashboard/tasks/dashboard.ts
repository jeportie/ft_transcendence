// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   dashboard.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/17 11:48:54 by jeportie          #+#    #+#             //
//   Updated: 2025/10/17 11:57:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";
import { DOM } from "../dom.generated.js";

export async function dashboard() {
    const userInfoEl = DOM.dashboardInfoDiv;
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
