// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Settings.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:19:28 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 13:51:57 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import settingsHTML from "../html/settings.html";

export default class Settings extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Settings");
    };

    async getHTML() {
        return (settingsHTML);
    }

    mount() {
        const form = document.getElementById("settings-form") as HTMLFormElement | null;
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();                            // no full page reload ✅
            const data = Object.fromEntries(new FormData(form).entries());
            console.log("Settings submit:", data);

            // Later: real API call
            // await fetch("/api/settings", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify(data),
            // });
        });
    }
}
