// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleF2a.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 10:13:33 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 10:13:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";

// import { handleForgot } from "./handleForgot.js";

export const tasks = {
    init: [],

    ready: [
        // handleForgot,
    ],

    teardown: [],
};


// DOM
const f2aLoginForm = document.querySelector("#f2a-login-form");
const f2aLoginError = document.querySelector("#f2a-login-error");
const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".otp-input"));
const backupBtn = document.querySelector("#backup-btn");

const params = new URLSearchParams(location.search);
const id = params.get("userId");
const next = params.get("next") || "/dashboard";

backupBtn?.addEventListener("click", () => {
    window.navigateTo(`/backups?userId=${id}&next=${next}`);
});
this.setupOtpInputs(inputs);
inputs[0]?.focus();

setupOtpInputs(inputs: HTMLInputElement[]) {
    inputs.forEach((input, idx) => {
        input.addEventListener("input", () => {
            const value = input.value.replace(/\D/g, "");
            input.value = value;

            if (value && idx < inputs.length - 1) {
                inputs[idx + 1].focus();
            }

            // auto-submit when last field filled
            if (idx === inputs.length - 1 && inputs.every(i => i.value.length === 1)) {
                this.submitCode(inputs);
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && idx > 0) {
                inputs[idx - 1].focus();
            }
        });

        input.addEventListener("paste", (e) => {
            e.preventDefault();
            const paste = (e.clipboardData?.getData("text") ?? "")
                .replace(/\D/g, "")
                .slice(0, inputs.length);

            paste.split("").forEach((digit, i) => {
                inputs[i].value = digit;
            });

            if (paste.length === inputs.length) this.submitCode(inputs);
        });
    });
}

async submitCode(inputs: HTMLInputElement[]) {
    const code = inputs.map(i => i.value).join("");
    if (code.length !== 6) return;

    const params = new URLSearchParams(location.search);
    const next = params.get("next") || "/dashboard";
    const id = params.get("userId");

    try {
        const data = await API.post("/auth/login-totp", { code, userId: id });
        if (data.success) {
            auth.setToken(data.token || "dev-token");
            // @ts-ignore
            setTimeout(() => window.navigateTo(next), 0);
        } else {
            this.showError("Invalid code");
        }
    } catch (err) {
        this.showError("Something went wrong");
        console.error(err);
    }
}

showError(msg: string) {
    const el = document.querySelector("#f2a-login-error");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden");
}

