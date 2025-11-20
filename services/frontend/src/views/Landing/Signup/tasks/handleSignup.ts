// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleSignup.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/14 11:24:59 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 13:21:19 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "@system";
import { ENV } from "@env";

import { initRecaptcha, getRecaptchaToken } from "@system/core/utils/recaptcha.js";
import { showBox, clearBox } from "@system/core/dom/errors.js";
import finalizeHTML from "../validateSignup.html";

const siteKey = ENV.RECAPTCHA_SITE_KEY;

// API routes
const register = API.routes.auth.local.register;

// @ts-expect-error
export async function handleSignup({ logo, addCleanup, view }) {
    const form = DOM.signupForm;
    const userInput = DOM.signupUserInput;
    const emailInput = DOM.signupEmailInput;
    const pwdInput = DOM.signupPwdInput;
    const confirmInput = DOM.signupConfirmInput;
    const errorBox = DOM.signupErrorDiv;

    if (!form)
        return;

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();

        const captchaToken = getRecaptchaToken();
        if (!captchaToken) {
            showBox(errorBox, "Please complete the captcha.");
            return;
        }

        if (!userInput || !emailInput || !pwdInput || !confirmInput)
            return;

        if (pwdInput.value !== confirmInput.value) {
            showBox(errorBox, "Passwords do not match.");
            return;
        }

        const { data, error } = await API.Post<{ success: boolean }>(register, {
            username: userInput.value,
            email: emailInput.value,
            pwd: pwdInput.value,
            captcha: captchaToken
        })

        if (error) {
            pwdInput.value = "";
            userInput.focus();
            showBox(errorBox, error.message);
            return;
        }

        if (data?.success) {
            logo?.fadeAndReplaceWithLottie();
            setTimeout(() => {
                view.swapContent(finalizeHTML);
            }, 2000);
        }
    }

    const onFocus = () => {
        clearBox(errorBox);
    };

    await initRecaptcha(siteKey, DOM.signupRecaptchaContainer);
    form?.addEventListener("submit", onSubmit);
    pwdInput?.addEventListener("focus", onFocus);

    addCleanup(() => {
        form?.removeEventListener("submit", onSubmit);
        pwdInput?.removeEventListener("focus", onFocus);
    });
}


