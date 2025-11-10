// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleSignup.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/14 11:24:59 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 17:14:05 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";

import { initRecaptcha, getRecaptchaToken } from "../../../../spa/utils/recaptcha.js";
import { showBox, clearBox } from "../../../../spa/utils/errors.js";

import finalizeHTML from "../validateSignup.html";

const siteKey = "6LftBt8rAAAAAIBkUgHnNTBvRWYO7fKTnNfWC3DW"; // hardcode or load from env

export async function handleSignup({ ASSETS, logo, addCleanup, view }) {
    const form = DOM.signupForm;
    const userInput = DOM.signupUserInput;
    const emailInput = DOM.signupEmailInput;
    const pwdInput = DOM.signupPwdInput;
    const confirmInput = DOM.signupConfirmInput;
    const errorBox = DOM.signupErrorDiv;
    const captchaContainer = DOM.signupRecaptchaContainer;

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

        const { data, error } = await API.Post("/auth/register", {
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

        if (data.success) {
            logo?.fadeAndReplaceWithLottie();
            setTimeout(() => {
                view.swapContent(finalizeHTML);
            }, 2000);
        }
    }

    const onFocus = () => {
        clearBox(errorBox);
    };

    await initRecaptcha(siteKey, captchaContainer);
    form?.addEventListener("submit", onSubmit);
    pwdInput?.addEventListener("focus", onFocus);

    addCleanup(() => {
        form?.removeEventListener("submit", onSubmit);
        pwdInput?.removeEventListener("focus", onFocus);
    });
}


