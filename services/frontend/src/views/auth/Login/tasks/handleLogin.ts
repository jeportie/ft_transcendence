// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleLogin.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:33:11 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 11:34:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";
import { auth } from "../../../../spa/auth.js";
import { DOM } from "../dom.generated.js";
import { setupLogoAnimation } from "./setupLogoAnimation.js";

export function handleLogin({ ASSETS, logo }) {
    const form = DOM.loginForm;
    const userInput = DOM.loginUserInput;
    const pwdInput = DOM.loginPwdInput;
    const errorBox = DOM.loginErrorDiv;
    if (!form || !userInput || !pwdInput) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        API.post("/auth/login", {
            user: userInput.value,
            pwd: pwdInput.value,
        })
            .then(data => {
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
            })
            .catch(err => {
                console.error(`❌ [${err.code || err.status}] ${err.message}`);
                pwdInput.value = "";
                userInput.focus();

                if (errorBox) {
                    errorBox.textContent = "Invalid username or password.";
                    errorBox.classList.remove("hidden");
                }
            });
    });

    pwdInput.addEventListener("focus", () => {
        if (errorBox) {
            errorBox.classList.add("hidden");
            errorBox.textContent = "";
        }
    });
}

