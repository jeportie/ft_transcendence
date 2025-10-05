// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   recaptcha.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/05 11:17:35 by jeportie          #+#    #+#             //
//   Updated: 2025/10/05 12:50:57 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

let widgetId = null;

/**
 * Render Google reCAPTCHA v2 widget safely for SPA navigation.
 * Ensures full control and prevents duplicate or missing renders.
 */
export async function initRecaptcha(siteKey, container) {
    if (!container) throw new Error("Missing captcha container");
    if (!siteKey) throw new Error("Missing siteKey for reCAPTCHA");

    const g = await waitForRecaptcha();

    // Check if previous widget is still attached to DOM
    const existingIframe = container.querySelector("iframe[src*='recaptcha']");
    const needsRerender = !existingIframe;

    if (widgetId !== null && !needsRerender) {
        console.log("[reCAPTCHA] ♻️ Already rendered, resetting widget");
        g.reset(widgetId);
        return;
    }

    // Re-render if DOM was replaced
    console.log("[reCAPTCHA] 🔁 Rendering new widget instance");
    container.innerHTML = "";
    widgetId = g.render(container, { sitekey: siteKey });
    console.log("[reCAPTCHA] ✅ Captcha rendered, widgetId =", widgetId);
}

/**
 * Wait until window.grecaptcha (or enterprise) is ready and exposes render().
 */
async function waitForRecaptcha() {
    const maxWait = 8000;
    let waited = 0;

    return new Promise((resolve, reject) => {
        const checkReady = () => {
            const g = window.grecaptcha?.render
                ? window.grecaptcha
                : window.grecaptcha?.enterprise?.render
                    ? window.grecaptcha.enterprise
                    : null;

            if (g && typeof g.render === "function") return resolve(g);

            if ((waited += 200) >= maxWait) {
                return reject(new Error("grecaptcha not loaded in time"));
            }

            setTimeout(checkReady, 200);
        };
        checkReady();
    });
}

/**
 * Retrieve the current captcha token after user validation.
 */
export function getRecaptchaToken() {
    try {
        const g = window.grecaptcha?.getResponse
            ? window.grecaptcha
            : window.grecaptcha?.enterprise;
        if (!g) throw new Error("grecaptcha not available yet");
        if (widgetId === null) throw new Error("Captcha not initialized");

        const token = g.getResponse(widgetId);
        console.log("[reCAPTCHA] 🧩 Token:", token || "(empty)");
        return token;
    } catch (error) {
        console.error("[reCAPTCHA] ❌ Token retrieval failed:", error);
        return "";
    }
}
