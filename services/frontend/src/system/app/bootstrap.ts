// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   bootstrap.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 14:20:20 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 18:52:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { showLoading, hideLoading } from "@views/loading";
import { logger } from "@system/core/logger";
import { isDev } from "@system";
import { auth } from "@auth";
import { API } from "@system";

const log = logger.withPrefix('[Boot]');

window.recaptchaLoaded = () => {
    logger.withPrefix("[reCAPTCHA]").info("✅ script loaded");
};

if (isDev) {
    // Expose the logger globally for debugging
    (window as any).logger = logger;

    console.info(
        "%c[Logger] Available dev commands:",
        "color: cyan; font-weight: bold"
    );
    console.info(`
        logger.setPrefixFilter("Router")   → show only router logs
        logger.setPrefixFilter("Fetch")    → show only fetch logs
        logger.setPrefixFilter(null)       → show all logs again
        console.table(logger.listPrefixes()) → list all known prefixes
    `);
}

export async function bootstrap() {
    const restored = await auth.init();
    if (restored) {
        log.info("Auth session restored from cookie");
    } else {
        log.info("No session to restore");
    }
    const alreadyBooted = sessionStorage.getItem("appBooted");
    if (!alreadyBooted) {
        showLoading("Starting app...");

        try {
            const { data, error } = await API.Get(API.routes.system.health);
            if (error)
                throw new Error(error.message);
            log.withPrefix("[Health] ").info("✅ OK:", data);

            await new Promise(resolve => setTimeout(resolve, 2000));
            log.info("Preload done");
            sessionStorage.setItem("appBooted", "1");

        } catch (err: any) {
            log.error("❌ Startup failed:", err);
            hideLoading();
            throw err;
        }
    }
}
