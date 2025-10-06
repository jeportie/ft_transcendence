// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Signup.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 13:56:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 22:24:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";
import signupHTML from "../html/signup.html";
import { initRecaptcha, getRecaptchaToken, destroyRecaptcha } from "../spa/utils/recaptcha.js";

export default class Signup extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("Signup");
    }

    async getHTML() {
        return (signupHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();

        // DOM
        const signupForm = document.querySelector("#signup-form");
        const signupUsername = document.querySelector("#signup-username") as HTMLInputElement;
        const signupEmail = document.querySelector("#signup-email") as HTMLInputElement;
        const signupPwd = document.querySelector("#signup-pwd") as HTMLInputElement;
        const signupConfirm = document.querySelector("#signup-confirm") as HTMLInputElement;
        const signupError = document.querySelector("#signup-error");
        const googleSignupBtn = document.querySelector("#google-signup-btn");

        const captchaContainer = document.querySelector("#recaptcha-container") as HTMLElement;
        const siteKey = "6LftBt8rAAAAAIBkUgHnNTBvRWYO7fKTnNfWC3DW"; // hardcode or load from env

        await initRecaptcha(siteKey, captchaContainer);

        signupPwd.addEventListener("focus", () => {
            if (signupError) {
                signupError.classList.add("hidden");
                signupError.textContent = "";
            }
        })

        signupForm?.addEventListener("submit", event => {
            event.preventDefault();

            const captchaToken = getRecaptchaToken();
            if (!captchaToken) {
                signupError.textContent = "Please complete the captcha.";
                signupError.classList.remove("hidden");
                return;
            }
            console.log("[values]: ", signupUsername.value, signupPwd.value, signupConfirm.value, signupEmail.value);
            if (signupPwd.value !== signupConfirm.value) {
                signupError.textContent = "Passwords do not match.";
                signupError?.classList.remove("hidden");
                return;
            }

            API.post("/auth/register", {
                username: signupUsername.value,
                email: signupEmail.value,
                pwd: signupPwd.value,
                captcha: captchaToken
            }).then(data => {
                // auth.setToken(data.token || "dev-token");
                // @ts-ignore
                setTimeout(() => window.navigateTo("/finalize-subscription"), 0);
            }).catch(err => {
                console.error("❌ Subscrition Failed", err);
                signupPwd.value = "";
                signupUsername.focus();
                if (signupError) {
                    signupError.textContent = err.error;
                    signupError.classList.remove("hidden");
                }
            })
        })

        googleSignupBtn?.addEventListener("click", () => {
            window.location.href = `/api/auth/google/start?next=${encodeURIComponent("/dashboard")}`;
        });
    }

    destroy() {
        destroyRecaptcha();
    }
}
