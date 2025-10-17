// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleLogin.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:33:11 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 10:04:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";

import { auth } from "../../../../spa/auth.js";
import { showBox, clearBox } from "../../../../spa/utils/errors.js";

import notActiveHtml from "../notActive.html";

/**
 * Handles login form submission and feedback display.
 * Registers cleanup logic for event listeners.
 */
export function handleLogin({ ASSETS, logo, addCleanup, view }) {
    const form = DOM.loginForm;
    const userInput = DOM.loginUserInput;
    const pwdInput = DOM.loginPwdInput;
    const errorBox = DOM.loginErrorDiv;

    if (!form || !userInput || !pwdInput)
        return;

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        clearBox(errorBox);

        const { data, error } = await API.Post("/auth/login", {
            user: userInput.value,
            pwd: pwdInput.value,
        });

        if (error) {
            pwdInput.value = "";
            userInput.focus();
            showBox(errorBox, "Invalid username or password.");
            return;
        }

        logo?.fadeAndReplaceWithLottie();
        console.log(data);
        setTimeout(() => {
            if (data.activation_required) {
                view.swapContent(notActiveHtml).then(() => {
                    // @ts-expect-error
                    DOM.inactiveP.innerHTML = `
                        Sorry <strong>${data.username}</strong>, your account is not active yet.
                        Please validate your account with the validation link we sent 
                        you by email.
                    `;
                    DOM.inactiveRetryBtn?.addEventListener("click", async () => {
                        const { data: data2, error: error2 } = await API.Post("/auth/resend-link", {
                            user_id: data.user_id,
                        });
                        if (error2) {
                            showBox(DOM.inactiveBoxDiv, error2.message);
                            return;
                        }
                        if (data2.success) {
                            // @ts-expect-error
                            window.navigateTo("/login");
                        }
                    })
                    DOM.inactiveBackBtn?.addEventListener("click", () => {
                        // @ts-expect-error
                        window.navigateTo("/login");
                    });
                });
            } else if (data.f2a_required) {
                // @ts-expect-error
                window.navigateTo(`/f2a-login?userId=${data.user_id}`);
            } else {
                auth.setToken(data.token || "dev-token");
                // @ts-expect-error
                window.navigateTo("/dashboard");
            }
        }, 2000);
    };

    const onFocus = () => {
        clearBox(errorBox);
    };

    form.addEventListener("submit", onSubmit);
    pwdInput.addEventListener("focus", onFocus);

    addCleanup(() => {
        form.removeEventListener("submit", onSubmit);
        pwdInput.removeEventListener("focus", onFocus);
    });
}
