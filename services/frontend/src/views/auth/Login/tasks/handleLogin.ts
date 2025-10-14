// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleLogin.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:33:11 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 14:53:19 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";

import { auth } from "../../../../spa/auth.js";
import { showError, clearError } from "../../../../spa/utils/errors.js";
import { safePost } from "../../../../spa/utils/safeFetch.js";

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
        clearError(errorBox);

        const { data, error } = await safePost("/auth/login", {
            user: userInput.value,
            pwd: pwdInput.value,
        });

        if (error) {
            pwdInput.value = "";
            userInput.focus();
            showError(errorBox, "Invalid username or password.");
            return;
        }

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
    };

    const onFocus = () => {
        clearError(errorBox);
    };

    form.addEventListener("submit", onSubmit);
    pwdInput.addEventListener("focus", onFocus);

    addCleanup(() => {
        form.removeEventListener("submit", onSubmit);
        pwdInput.removeEventListener("focus", onFocus);
    });
}
