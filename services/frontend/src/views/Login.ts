// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/09/16 17:34:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";

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
                <input id="user-name" class="ui-input"
                type="text"
                placeholder="Username"
                autocomplete="username"/>
                <input id="user-pwd" class="ui-input"
                type="password"
                placeholder="Password"
                autocomplete="current-password"/>
                <button id="login-btn" class="ui-btn-primary w-full mt-1">Sign in</button>
              </form>
              <div id="login-error" class="ui-error hidden mt-2"></div>
              <p class="ui-text-small mt-3">
              <a href="/subscribe" data-link class="ui-hint-link">Subscribe</a> </p>
              <button id="google-btn" class="ui-btn-secondary w-full mt-2">
                Continue with Google
              </button>
            </div>
        `;
    }

    mount() {
        // Canvas restart when leaving the LandingLayout:
        (this as any).layout?.reloadOnExit?.();

        // DOM
        const loginForm = document.querySelector("#login-form");
        const userName = document.querySelector("#user-name") as HTMLInputElement;
        const userPwd = document.querySelector("#user-pwd") as HTMLInputElement;
        const errorBox = document.querySelector("#login-error");
        const googleBtn = document.querySelector("#google-btn") as HTMLButtonElement;

        // read ?next from URL
        const params = new URLSearchParams(location.search);
        const next = params.get("next") || "/dashboard";

        // Hide error when focusing inputs
        userPwd.addEventListener("focus", () => {
            if (errorBox) {
                errorBox.classList.add("hidden");
                errorBox.textContent = "";
            }
        });

        loginForm?.addEventListener("submit", event => {
            event.preventDefault();

            API.post("/auth/login", {
                user: userName.value,
                pwd: userPwd.value,
            })
                .then(data => {
                    auth.setToken(data.token || "dev-token");
                    // @ts-ignore
                    setTimeout(() => window.navigateTo(next), 0);
                })
                .catch(err => {
                    console.error("❌ Login failed:", err);
                    userPwd.value = "";
                    userName.focus();

                    if (errorBox) {
                        errorBox.textContent = "Invalid username or password.";
                        errorBox.classList.remove("hidden");
                    }
                });
        })

        googleBtn?.addEventListener("click", () => {
            const params = new URLSearchParams(location.search);
            const next = params.get("next") || "/dashboard";
            window.location.href = `/api/auth/google/start?next=${encodeURIComponent(next)}`;
        });
    }
}
