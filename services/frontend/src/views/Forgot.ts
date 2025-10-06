// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Forgot.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 13:56:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 23:56:57 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";
import forgotHTML from "../html/forgotPwd.html";
import { initRecaptcha, getRecaptchaToken, destroyRecaptcha } from "../spa/utils/recaptcha.js";

export default class Forgot extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("Forgot");
    }

    async getHTML() {
        return (forgotHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();

        // DOM
        const forgotForm = document.querySelector("#forgot-form");
        const forgotEmail = document.querySelector("#forgot-email") as HTMLInputElement;
        const forgotError = document.querySelector("#forgot-error");
        const forgotBtn = document.querySelector("#forgot-btn");

        const captchaContainer = document.querySelector("#recaptcha-forgot-container") as HTMLElement;
        const siteKey = "6LftBt8rAAAAAIBkUgHnNTBvRWYO7fKTnNfWC3DW"; // hardcode or load from env

        await initRecaptcha(siteKey, captchaContainer);

        forgotEmail.addEventListener("focus", () => {
            if (forgotError) {
                forgotError.classList.add("hidden");
                forgotError.textContent = "";
            }
        })

        forgotForm?.addEventListener("submit", event => {
            event.preventDefault();

            const captchaToken = getRecaptchaToken();
            if (!captchaToken) {
                forgotError.textContent = "Please complete the captcha.";
                forgotError.classList.remove("hidden");
                return;
            }

            API.post("/auth/register", {
                email: forgotEmail.value,
                captcha: captchaToken
            }).then(data => {
                // auth.setToken(data.token || "dev-token");
                // @ts-ignore
                setTimeout(() => window.navigateTo("/finalize-subscription"), 0);
            }).catch(err => {
                if (forgotError) {
                    forgotError.textContent = err.error;
                    forgotError.classList.remove("hidden");
                }
            })
        })
    }

    destroy() {
        destroyRecaptcha();
    }
}
