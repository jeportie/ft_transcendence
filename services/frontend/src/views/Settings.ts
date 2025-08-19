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
        return (`
    <div class="min-h-screen grid grid-cols-[220px_1fr]">
      <aside class="bg-slate-800 text-white p-4">
        <h2 class="text-lg font-semibold mb-4">Menu</h2>
        <nav class="flex flex-col gap-2">
          <a href="/" class="hover:underline" data-link>Dashboard</a>
          <a href="/posts" class="hover:underline" data-link>Posts</a>
          <a href="/settings" class="hover:underline" data-link>Settings</a>
        </nav>
      </aside>
      <main class="p-6">
        <h1 class="text-2xl font-bold mb-4">Settings</h1>
        <div class="rounded-lg bg-slate-800 text-white p-4">
          <form id="settings-form" class="space-y-4">
            <div>
              <label for="name" class="block mb-1">Display name</label>
              <input id="name" name="name" type="text" placeholder="Your name"
                     class="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 focus:outline-none" />
            </div>
            <div>
              <label for="theme" class="block mb-1">Theme</label>
              <select id="theme" name="theme"
                      class="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 focus:outline-none">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <button type="submit"
                    class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
              Save
            </button>
          </form>
        </div>
      </main>
    </div>
  `)
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
