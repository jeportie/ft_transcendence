// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/08/26 11:23:15 by jeportie         ###   ########.fr       //
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
            <div class="ui-card">
              <h2 class="ui-card-title">Login</h2>
              <form class="ui-form">
                <input class="ui-input" type="text" placeholder="Username" />
                <input class="ui-input" type="password" placeholder="Password" />
                <button id="login-btn" class="ui-btn-primary w-full mt-1">Sign in</button>
              </form>
              <p class="ui-text-small mt-3">
               No account ?<a href="/subscribe" data-link class="ui-hint-link">Subscribe</a>
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
