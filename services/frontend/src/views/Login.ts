// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/08/25 18:17:19 by jeportie         ###   ########.fr       //
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
      <div class="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl p-6 text-slate-100">
        <h2 class="text-xl font-semibold mb-4">Login</h2>
        <form id="login-form" class="space-y-3">
          <input class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder:text-slate-300/50 outline-none focus:ring-2 focus:ring-white/30"
                 type="text" name="user" placeholder="Username" />
          <input class="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder:text-slate-300/50 outline-none focus:ring-2 focus:ring-white/30"
                 type="password" name="pass" placeholder="Password" />
          <button id="login-btn" class="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
            Sign in
          </button>
        </form>
        <p class="mt-3 text-sm text-slate-200/80">
          No account? <a href="/subscribe" data-link class="underline hover:text-white">Subscribe</a>
        </p>
      </div>
    `;
    }

    mount() {
        // If this view wants the canvas to restart when leaving the LandingLayout:
        (this as any).layout?.reloadOnExit?.();
        const btn = document.querySelector("#login-btn");
        btn?.addEventListener("click", (e) => {
            e.preventDefault();
            // @ts-ignore
            window.navigateTo("/dashboard");
        });
    }
}
