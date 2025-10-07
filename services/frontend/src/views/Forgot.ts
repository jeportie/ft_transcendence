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
        const forgotInfo = document.querySelector("#forgot-info");

        const captchaContainer = document.querySelector("#recaptcha-forgot-container") as HTMLElement;
        const siteKey = "6LftBt8rAAAAAIBkUgHnNTBvRWYO7fKTnNfWC3DW"; // hardcode or load from env

        await initRecaptcha(siteKey, captchaContainer);

        forgotEmail.addEventListener("focus", () => {
            forgotError?.classList.add("hidden");
            forgotError.textContent = "";
        })

        forgotForm?.addEventListener("submit", event => {
            event.preventDefault();

            if (!forgotEmail.value) {
                forgotError.textContent = "Please add your email before submiting";
                forgotError?.classList.remove("hidden");
                return;
            }
            const captchaToken = getRecaptchaToken();
            if (!captchaToken) {
                forgotError.textContent = "Please complete the captcha.";
                forgotError.classList.remove("hidden");
                return;
            }

            forgotInfo.textContent = "If your email exists, we sent a link";
            forgotInfo?.classList.remove("hidden");

            API.post("/auth/forgot-pwd", {
                email: forgotEmail.value,
                captcha: captchaToken
            }).then(data => {

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
