// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   recaptcha.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/05 11:17:35 by jeportie          #+#    #+#             //
//   Updated: 2025/11/12 17:21:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { logger } from "@system/core/logger.js";

const log = logger.withPrefix("[reCAPTCHA] ");

declare global {
    interface Window {
        grecaptcha?: ReCaptcha | ReCaptchaEnterprise;
    }
}

interface ReCaptcha {
    render: (container: HTMLElement | string, params: { sitekey: string }) => number;
    reset: (id?: number) => void;
    getResponse: (id?: number) => string;
    ready: (cb: () => void) => void;
}

interface ReCaptchaEnterprise extends ReCaptcha {
    enterprise: ReCaptcha;
}

let widgetId: number | null = null;
let grecaptchaReadyPromise: Promise<ReCaptcha> | null = null;

async function waitForGrecaptchaReady(): Promise<ReCaptcha> {
    if (grecaptchaReadyPromise)
        return grecaptchaReadyPromise;

    grecaptchaReadyPromise = new Promise((resolve, reject) => {
        const maxWait = 10000;
        let waited = 0;

        const check = (): void => {
            const g: ReCaptcha | null =
                window.grecaptcha?.render
                    ? window.grecaptcha
                    // @ts-expect-error
                    : window.grecaptcha?.enterprise?.render
                        // @ts-expect-error
                        ? (window.grecaptcha.enterprise as ReCaptcha)
                        : null;

            if (g && typeof g.render === "function") {
                g.ready(() => {
                    log.info("✅ API ready");
                    resolve(g);
                });
                return;
            }

            if ((waited += 200) >= maxWait) {
                reject(new Error("grecaptcha not loaded in time"));
                return;
            }

            setTimeout(check, 200);
        };
        check();
    });

    return grecaptchaReadyPromise;
}

export async function initRecaptcha(
    siteKey: string,
    container: HTMLElement
): Promise<void> {
    if (!container) throw new Error("Missing captcha container");
    if (!siteKey) throw new Error("Missing siteKey for reCAPTCHA");

    const g = await waitForGrecaptchaReady();

    // Detect if iframe still exists
    const iframeExists = container.querySelector("iframe[src*='recaptcha']");
    if (widgetId !== null && iframeExists) {
        log.info("♻️ Reset existing widget");
        g.reset(widgetId);
        return;
    }

    log.info("🔁 Rendering new widget");
    container.innerHTML = "";
    widgetId = g.render(container, { sitekey: siteKey });
    log.info("✅ Captcha rendered, widgetId =", widgetId);
}

export function destroyRecaptcha(): void {
    document.body.classList.add("teardown");
    try {
        const g = window.grecaptcha;
        if (g && typeof g.reset === "function" && widgetId !== null) {
            log.info("🧹 Widget destroyed");
            g.reset(widgetId);
            widgetId = null;
        }
        document.querySelectorAll("iframe[src*='recaptcha']").forEach((el) => el.remove());
    } finally {
        // remove the teardown marker after 100ms (after DOM cleanup)
        setTimeout(() => document.body.classList.remove("teardown"), 100);
    }
}

export function getRecaptchaToken(): string {
    try {
        const g: ReCaptcha | undefined =
            window.grecaptcha?.getResponse
                ? window.grecaptcha
                : (window.grecaptcha as ReCaptchaEnterprise)?.enterprise;

        if (!g)
            throw new Error("grecaptcha not available yet");
        if (widgetId === null)
            throw new Error("Captcha not initialized");

        const token = g.getResponse(widgetId);
        return token;
    } catch (error) {
        log.error("❌ Token retrieval failed:", error);
        return "";
    }
}
