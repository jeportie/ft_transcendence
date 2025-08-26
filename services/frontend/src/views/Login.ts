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

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import Fetch from "../tools/Fetch.js";

// API
const API = new Fetch("/api");

export default class Login extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("Login");
    }

    async getHTML() {
        return /*html*/ `
            <div class="ui-card">
              <h2 class="ui-card-title">Login</h2>
              <form id="login-form" class="ui-form">
                <input id="user-name" class="ui-input" type="text" placeholder="Username" />
                <input id="user-pwd" class="ui-input" type="password" placeholder="Password" />
                <button id="login-btn" class="ui-btn-primary w-full mt-1">Sign in</button>
              </form>
              <p class="ui-text-small mt-3">
              <a href="/subscribe" data-link class="ui-hint-link">Subscribe</a> </p>
            </div>
        `;
    }

    mount() {
        // Canvas restart when leaving the LandingLayout:
        (this as any).layout?.reloadOnExit?.();

        // DOM
        const loginForm = document.querySelector("#login-form");
        const userName = document.querySelector("#user-name");
        const userPwd = document.querySelector("#user-pwd");
        const loginBtn = document.querySelector("#login-btn");

        loginForm?.addEventListener("submit", event => {
            event.preventDefault();

            API.post("/auth", {
                user: userName.value,
                pwd: userPwd.value,
            })
                .then(data => {
                    console.log("AUTH:", data);
                    if (data.succes === true)
                        window.navigateTo("/dashboard");
                })
                .catch(err => console.error("❌ ERROR:", err));
        })

        // loginBtn?.addEventListener("click", (e) => {
        //     e.preventDefault();
        //     // @ts-ignore
        //     window.navigateTo("/dashboard");
        // });
    }
}
