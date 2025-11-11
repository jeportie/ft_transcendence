// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleForgot.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/14 18:17:51 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 19:03:13 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "@system";
import { ENV } from "@env";

import { initRecaptcha, getRecaptchaToken } from "@system/core/utils/recaptcha.js";
import { showBox, clearBox } from "@system/core/dom/errors.js";

const siteKey = ENV.RECAPTCHA_SITE_KEY;

// API Routes
const forgotPwd = API.routes.auth.local.forgotPwd;

// @ts-expect-error Need to put SPA in TS
export async function handleForgot({ addCleanup }) {
    const form = DOM.forgotPwdForm;
    const emailInput = DOM.forgotPwdEmailInput;
    const errorBox = DOM.forgotPwdErrorDiv;
    const infoBox = DOM.forgotPwdInfoDiv;
    const captchaContainer = DOM.forgotPwdRecaptchaContainer;

    if (!form || !emailInput)
        return;

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        clearBox(errorBox);
        clearBox(infoBox);

        if (!emailInput.value) {
            showBox(errorBox, "Please add your email before submiting.");
            return;
        }

        const captchaToken = getRecaptchaToken();
        if (!captchaToken) {
            showBox(errorBox, "Please compelte the captcha.");
            return;
        }

        const { data, error } = await API.Post(forgotPwd, {
            email: emailInput.value,
            captcha: captchaToken
        })

        if (error) {
            emailInput.value = "";
            emailInput.focus();
            showBox(errorBox, error.message);
            return;
        }

        if (data.success) {
            captchaContainer?.classList.add("hidden");
            showBox(infoBox, data.message);
            form.classList.add("hidden");
        }
    }

    const onFocus = () => {
        clearBox(errorBox);
    };

    await initRecaptcha(siteKey, captchaContainer);
    emailInput.addEventListener("focus", onFocus);
    form.addEventListener("submit", onSubmit);

    addCleanup(() => {
        form.removeEventListener("submit", onSubmit);
        emailInput.removeEventListener("focus", onFocus);
    });
}
