// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:14:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";

export default class Login extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Login");
    }

    async getHTML() {
        return /*html*/ `
      <h1 class="text-2xl font-bold">Login</h1>
      <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
        <form id="login-form" class="space-y-4">
          <input name="email" type="email" placeholder="Email"
                 class="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 focus:outline-none" />
          <input name="password" type="password" placeholder="Password"
                 class="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 focus:outline-none" />
          <button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Login</button>
        </form>
      </div>
    `;
    }

    mount() {
        const form = document.getElementById("login-form") as HTMLFormElement | null;
        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            localStorage.setItem("token", "demo");
            window.navigateTo("/");
        });
    }
}
