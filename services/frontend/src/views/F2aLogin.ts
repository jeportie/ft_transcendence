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
import f2aLoginHTML from "../html/f2aLogin.html";

export default class F2aLogin extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("F2aLogin");
    }

    async getHTML() {
        return (f2aLoginHTML);
    }

    mount() {
        // Canvas restart when leaving the LandingLayout:
        (this as any).layout?.reloadOnExit?.();

        // DOM
        const f2aLoginForm = document.querySelector("#f2a-login-form");
        const f2aLoginError = document.querySelector("#f2a-login-error");
        const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".otp-input"));

        this.setupOtpInputs(inputs);
        inputs[0]?.focus();

        // // read ?next from URL
        // const params = new URLSearchParams(location.search);
        // const next = params.get("next") || "/dashboard";
        //
        // // Hide error when focusing inputs
        // userPwd.addEventListener("focus", () => {
        //     if (errorBox) {
        //         errorBox.classList.add("hidden");
        //         errorBox.textContent = "";
        //     }
        // });
        //
        // loginForm?.addEventListener("submit", event => {
        //     event.preventDefault();
        //
        //     API.post("/auth/login", {
        //         user: userName.value,
        //         pwd: userPwd.value,
        //     })
        //         .then(data => {
        //             auth.setToken(data.token || "dev-token");
        //             // @ts-ignore
        //             setTimeout(() => window.navigateTo(next), 0);
        //         })
        //         .catch(err => {
        //             console.error("❌ Login failed:", err);
        //             userPwd.value = "";
        //             userName.focus();
        //
        //             if (errorBox) {
        //                 errorBox.textContent = "Invalid username or password.";
        //                 errorBox.classList.remove("hidden");
        //             }
        //         });
        // })
        //
        // googleBtn?.addEventListener("click", () => {
        //     const params = new URLSearchParams(location.search);
        //     const next = params.get("next") || "/dashboard";
        //     window.location.href = `/api/auth/google/start?next=${encodeURIComponent(next)}`;
        // });
    }

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

        try {
            const res = await API.post("/auth/f2a/verify", { code });
            if (res.ok) {
                await auth.restoreSession();
                this.navigate("/dashboard");
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
}
