// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleLogin.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:33:11 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 11:43:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "@system";
import { auth } from "@auth";
import { showBox, clearBox } from "@system/core/dom/errors.js";
import notActiveHtml from "../notActive.html";

interface LoginResponse {
    token?: string;
    activation_required?: boolean;
    f2a_required?: boolean;
    user_id?: string;
    username?: string;
}

// API routes
const login = API.routes.auth.local.login;
const resendLink = API.routes.auth.local.resendLink;

// @ts-expect-error
export function handleLogin({ logo, addCleanup, view }) {
    const form = DOM.loginForm;
    const userInput = DOM.loginUserInput;
    const pwdInput = DOM.loginPwdInput;
    const errorBox = DOM.loginErrorDiv;

    if (!form || !userInput || !pwdInput)
        return;

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        clearBox(errorBox);

        const { data, error } = await API.Post<LoginResponse>(login, {
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

        setTimeout(() => {
            if (data?.activation_required) {
                view.swapContent(notActiveHtml).then(() => {
                    // @ts-expect-error
                    DOM.inactiveP.innerHTML = `
                        Sorry <strong>${data?.username}</strong>, your account is not active yet.
                        Please validate your account with the validation link we sent 
                        you by email.
                    `;
                    DOM.inactiveRetryBtn?.addEventListener("click", async () => {
                        const res = await API.Post<{ success: boolean }>(resendLink, {
                            user_id: data.user_id,
                        });
                        if (res.error) {
                            showBox(DOM.inactiveBoxDiv, res.error.message);
                            return;
                        }
                        if (res.data?.success) {
                            window.navigateTo("/login");
                        }
                    })
                    DOM.inactiveBackBtn?.addEventListener("click", () => {
                        window.navigateTo("/login");
                    });
                });
            } else if (data?.f2a_required) {
                window.navigateTo(`/f2a-login?userId=${data?.user_id}`);
            } else {
                auth.setToken(data?.token || "dev-token");
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
