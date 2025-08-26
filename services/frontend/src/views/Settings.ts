// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Settings.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:19:28 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:16:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";

export default class Settings extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Settings");
    };

    async getHTML() {
        return /*html*/ `
        <h1 class="ui-title">Settings</h1>
        <div class="ui-card-solid">
          <form id="settings-form" class="ui-form-lg">
            <div>
              <label for="name" class="ui-label">Display name</label>
              <input id="name" name="name" type="text" placeholder="Your name" class="ui-input-solid" />
            </div>
    
            <div>
              <label for="theme" class="ui-label">Theme</label>
              <select id="theme" name="theme" class="ui-input-solid">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
    
            <button type="submit" class="ui-btn-primary">Save</button>
          </form>
        </div>
        `;
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
