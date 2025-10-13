// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Signup.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 13:56:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 00:07:20 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import { tasks } from "../Signup/tasks/index.js";

import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";
import signupHTML from "../html/signup.html";
import { initRecaptcha, getRecaptchaToken, destroyRecaptcha } from "../spa/utils/recaptcha.js";
import spaceShipSvg from "../../../assets/spaceship.svg";
import googleIcon from "../../../assets/google.png";
import hideIcon from "../../../assets/hide.png";
import showIcon from "../../../assets/show.png";

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
        const card = document.querySelector(".ui-card");

        // --- Password visibility toggles setup --- //
        function createPasswordToggle(input: HTMLInputElement) {
            const wrapper = document.createElement("div");
            wrapper.className = "relative w-full";

            // Move the input into the wrapper
            input.parentNode?.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            // Create toggle button
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className =
                "absolute inset-y-0 right-3 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity";
            btn.style.cursor = "pointer";

            // Create the <img> icon
            const icon = document.createElement("img");
            icon.src = showIcon;
            icon.alt = "Show password";
            icon.className = "w-5 h-5 select-none";
            btn.appendChild(icon);
            wrapper.appendChild(btn);

            // Toggle behavior
            let visible = false;
            btn.addEventListener("click", e => {
                e.preventDefault();
                visible = !visible;
                input.type = visible ? "text" : "password";
                icon.src = visible ? hideIcon : showIcon;
                icon.alt = visible ? "Hide password" : "Show password";
            });
        }

        // Apply toggles to both password fields
        createPasswordToggle(signupPwd);
        createPasswordToggle(signupConfirm);

        if (card) {
            // Create logo container
            const logoContainer = document.createElement("div");
            logoContainer.className = "relative mx-auto mb-4 w-[120px] h-[120px] flex items-center justify-center";

            // Add static SVG (default visible)
            const staticLogo = document.createElement("div");
            staticLogo.innerHTML = spaceShipSvg;
            staticLogo.className = "absolute inset-0 opacity-90 transition-opacity duration-300 flex items-center justify-center";
            staticLogo.querySelector("svg")?.classList.add("w-full", "h-full");

            // Add the container to the card
            logoContainer.appendChild(staticLogo);
            card.prepend(logoContainer);
        }

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

        if (googleSignupBtn) {
            const iconWrapper = document.createElement("span");
            iconWrapper.className = "absolute left-4 flex items-center";

            const icon = document.createElement("img");
            icon.src = googleIcon;
            icon.alt = "Google icon";
            icon.className = "w-8 h-8";

            iconWrapper.appendChild(icon);
            googleSignupBtn.prepend(iconWrapper);
        }

        googleSignupBtn?.addEventListener("click", () => {
            window.location.href = `/api/auth/google/start?next=${encodeURIComponent("/dashboard")}`;
        });
    }

    destroy() {
        destroyRecaptcha();
    }
}
