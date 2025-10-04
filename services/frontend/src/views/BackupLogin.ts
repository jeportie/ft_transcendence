// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   F2aLogin.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/04 11:54:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";
import backupLoginHTML from "../html/backupLogin.html";

export default class BackupLogin extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("BackupLogin");
    }

    async getHTML() {
        return (backupLoginHTML);
    }

    mount() {
        // Canvas restart when leaving the LandingLayout:
        (this as any).layout?.reloadOnExit?.();

        // DOM
        const f2aLoginForm = document.querySelector("#backup-login-form");
        const f2aLoginError = document.querySelector("#backup-login-error");
        const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".otp-input"));

        this.setupOtpInputs(inputs);
        inputs[0]?.focus();
    }

    setupOtpInputs(inputs: HTMLInputElement[]) {
        inputs.forEach((input, idx) => {
            input.addEventListener("input", () => {
                const value = input.value;

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
        if (code.length !== 8) return;

        const params = new URLSearchParams(location.search);
        const next = params.get("next") || "/dashboard";
        const id = params.get("userId");

        try {
            const data = await API.post("/auth/verify-backup", { code, userId: id });
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
        const el = document.querySelector("#backup-login-error");
        if (!el) return;
        el.textContent = msg;
        el.classList.remove("hidden");
    }
}
