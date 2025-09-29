// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Subscribe.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 13:56:00 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 14:03:20 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";
import subscribeHTML from "../html/subscribe.html";

export default class Subscribe extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("Subscribe");
    }

    async getHTML() {
        return (subscribeHTML);
    }

    mount() {
        (this as any).layout?.reloadOnExit?.();

        // DOM
        const subscribeForm = document.querySelector("#subscribe-form") as HTMLFormElement;
        const subscribeUsername = document.querySelector("#subscribe-username") as HTMLInputElement;
        const subscribeEmail = document.querySelector("#subscribe-email") as HTMLInputElement;
        const subscribePwd = document.querySelector("#subscribe-pwd") as HTMLInputElement;
        const subscribeConfirm = document.querySelector("#subscribe-confirm") as HTMLInputElement;
        const subscribeError = document.querySelector("#subscribe-error") as HTMLDivElement;
        const googleSubscribeBtn = document.querySelector("#google-subscribe-btn") as HTMLButtonElement;

        subscribePwd.addEventListener("focus", () => {
            if (subscribeError) {
                subscribeError.classList.add("hidden");
                subscribeError.textContent = "";
            }
        })

        subscribeForm?.addEventListener("submit", event => {
            event.preventDefault();

            console.log("values:", subscribeUsername.value, subscribePwd.value, subscribeConfirm.value, subscribeEmail.value);
            if (subscribePwd.value !== subscribeConfirm.value) {
                subscribeError.textContent = "Passwords do not match.";
                subscribeError.classList.remove("hidden");
                return;
            }

            API.post("/auth/register", {
                username: subscribeUsername.value,
                email: subscribeEmail.value,
                pwd: subscribePwd.value
            }).then(data => {
                auth.setToken(data.token || "dev-token");
                // @ts-ignore
                setTimeout(() => window.navigateTo("/dashboard"), 0);
            }).catch(err => {
                console.error("❌ Subscrition Failed", err);
                subscribePwd.value = "";
                subscribeUsername.focus();
                if (subscribeError) {
                    subscribeError.textContent = err.error;
                    subscribeError.classList.remove("hidden");
                }
            })
        })

        googleSubscribeBtn?.addEventListener("click", () => {
            window.location.href = `/api/auth/google/start?next=${encodeURIComponent("/dashboard")}`;
        });
    }
}
