// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   bootstrap.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 14:20:20 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 15:09:13 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { auth } from "../spa/auth.js";
import { logger } from "../spa/logger.js";
import { showLoading, hideLoading } from "../views/pages/LoadingOverlay.js";

import { API } from "../spa/api.js";

export async function bootstrap() {
    const restored = await auth.initFromStorage();
    if (restored) {
        logger.info("[Boot] Auth session restored from cookie");
    } else {
        logger.info("[Boot] No session to restore");
    }
    const alreadyBooted = sessionStorage.getItem("appBooted");
    if (!alreadyBooted) {
        showLoading("Starting app...");

        try {
            const { data, error } = await API.Get("/system/health");
            if (error)
                throw new Error(error.message);
            logger.info("[Health] ✅ OK:", data);

            await new Promise(resolve => setTimeout(resolve, 2000));
            logger.info("[Boot] Preload done");
            sessionStorage.setItem("appBooted", "1");

        } catch (err: any) {
            logger.error("[Boot] ❌ Startup failed:", err);
            hideLoading();
            throw err;
        }
    }
}
