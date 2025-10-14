// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleSignup.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/14 11:24:59 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 12:17:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";
import { auth } from "../../../../spa/auth.js";
import { DOM } from "../dom.generated.js";
import { initRecaptcha, getRecaptchaToken } from "../../../../spa/utils/recaptcha.js";

const form = DOM.signupForm || null;
const userInput = DOM.signupUserInput || null;
const emailInput = DOM.signupEmailInput || null;
const pwdInput = DOM.signupPwdInput || null;
const confirmInput = DOM.signupConfirmInput || null;
const errorBox = DOM.signupErrorDiv || null;
const captchaContainer = DOM.signupRecaptchaContainer || null;
const siteKey = "6LftBt8rAAAAAIBkUgHnNTBvRWYO7fKTnNfWC3DW"; // hardcode or load from env

async function onSubmit(event: SubmitEvent) {
    event.preventDefault();

    const captchaToken = getRecaptchaToken();
    if (!captchaToken) {
        errorBox.textContent = "Please complete the captcha.";
        errorBox?.classList.remove("hidden");
        return;
    }
    if (pwdInput?.value !== confirmInput?.value) {
        errorBox.textContent = "Passwords do not match.";
        errorBox?.classList.remove("hidden");
        return;
    }

    try {
        const data = API.post("/auth/register", {
            username: userInput?.value,
            email: emailInput?.value,
            pwd: pwdInput?.value,
            captcha: captchaToken
        });
        setTimeout(() => window.navigateTo("/finalize-subscription"), 0);

    } catch (err: any) {
        console.error(`❌ [${err.code || err.status}] ${err.message}`);
        pwdInput.value = "";
        userInput?.focus();

        if (errorBox) {
            errorBox.textContent = "Invalid username or password.";
            errorBox.classList.remove("hidden");
        }
    }
}

const onFocus = () => {
    if (errorBox) {
        errorBox.classList.add("hidden");
        errorBox.textContent = "";
    }
};

export async function handleSignup({ ASSETS, logo, addCleanup }) {

    await initRecaptcha(siteKey, captchaContainer);
    form?.addEventListener("submit", onSubmit);
    pwdInput?.addEventListener("focus", onFocus);

    addCleanup(() => {
        form?.removeEventListener("submit", onSubmit);
        pwdInput?.removeEventListener("focus", onFocus);
    });
}


