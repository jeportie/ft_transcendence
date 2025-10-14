// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleLogin.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:33:11 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 11:50:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";
import { auth } from "../../../../spa/auth.js";
import { DOM } from "../dom.generated.js";

/**
 * Handles login form submission and feedback display.
 * Registers cleanup logic for event listeners.
 */
export function handleLogin({ ASSETS, logo, addCleanup }) {
    const form = DOM.loginForm;
    const userInput = DOM.loginUserInput;
    const pwdInput = DOM.loginPwdInput;
    const errorBox = DOM.loginErrorDiv;

    if (!form || !userInput || !pwdInput)
        return;

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        try {
            const data = await API.post("/auth/login", {
                user: userInput.value,
                pwd: pwdInput.value,
            });

            logo?.fadeAndReplaceWithLottie();

            setTimeout(() => {
                if (data.activation_required) {
                    window.navigateTo(`/not-active?userId=${data.user_id}`);
                } else if (data.f2a_required) {
                    window.navigateTo(`/f2a-login?userId=${data.user_id}`);
                } else {
                    auth.setToken(data.token || "dev-token");
                    window.navigateTo("/dashboard");
                }
            }, 2000);
        } catch (err) {
            console.error(`❌ [${err.code || err.status}] ${err.message}`);
            pwdInput.value = "";
            userInput.focus();

            if (errorBox) {
                errorBox.textContent = "Invalid username or password.";
                errorBox.classList.remove("hidden");
            }
        }
    };

    const onFocus = () => {
        if (errorBox) {
            errorBox.classList.add("hidden");
            errorBox.textContent = "";
        }
    };

    form.addEventListener("submit", onSubmit);
    pwdInput.addEventListener("focus", onFocus);

    addCleanup(() => {
        form.removeEventListener("submit", onSubmit);
        pwdInput.removeEventListener("focus", onFocus);
    });
}
