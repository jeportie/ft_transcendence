// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 14:34:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";
import loginHTML from "../html/login.html";

export default class Login extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("Login");
    }

    async getHTML() {
        return (loginHTML);
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
        const activated = params.get("activated");
        const error = params.get("activation_failed");

        // ✅ Show success message if account was just activated
        if (activated) {
            const msg = document.createElement("div");
            msg.textContent = "Your account has been activated successfully!";
            msg.className = "ui-card-alert ui-alert-success mb-4";
            document.querySelector(".ui-card")?.prepend(msg);
            // Optionally fade it out after a few seconds
            setTimeout(() => msg.remove(), 4000);
        }
        if (error) {
            const msg = document.createElement("div");
            msg.textContent = "Error: Account not activated";
            msg.className = "ui-alert ui-alert-error mb-4";
            document.querySelector(".ui-card")?.prepend(msg);
            // Optionally fade it out after a few seconds
            setTimeout(() => msg.remove(), 4000);
        }

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
                    // @ts-ignore
                    if (data.activation_required) {
                        setTimeout(() => window.navigateTo(`/not-active?userId=${data.user_id}`), 0);
                    } else if (data.f2a_required) {
                        setTimeout(() => window.navigateTo(`/f2a-login?userId=${data.user_id}`), 0);
                    } else {
                        auth.setToken(data.token || "dev-token");
                        setTimeout(() => window.navigateTo(next), 0);
                    }
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
