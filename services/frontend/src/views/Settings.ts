// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Settings.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:19:28 by jeportie          #+#    #+#             //
//   Updated: 2025/08/14 19:22:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import AbstractView from "./AbstractView.js";

export default class Settings extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Settings");
    };

    async getHTML() {
        return /*html*/ `
      <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
        <aside class="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
          <h2 class="text-lg font-semibold mb-3">Menu</h2>
          <nav class="flex flex-col gap-2">
            <a href="/" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
            <a href="/posts" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
            <a href="/settings" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
          </nav>
        </aside>

        <main class="space-y-4">
          <h1 class="text-2xl font-bold">Settings</h1>

          <form id="settings-form" class="rounded-xl border border-slate-700 bg-slate-800/60 p-5 space-y-4 max-w-lg">
            <div>
              <label for="name" class="block text-sm mb-1">Display name</label>
              <input id="name" name="name" type="text" placeholder="Your name"
                     class="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div>
              <label for="theme" class="block text-sm mb-1">Theme</label>
              <select id="theme" name="theme"
                      class="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <button type="submit"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
              Save
            </button>

            <p id="settings-msg" class="text-sm text-slate-400"></p>
          </form>
        </main>
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
