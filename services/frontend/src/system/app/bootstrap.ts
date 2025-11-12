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
import { auth } from "@auth";
import { API } from "@system";

const log = logger.withPrefix('[Boot]');

export async function bootstrap() {
    const restored = await auth.initFromStorage();
    if (restored) {
        log.info("[Boot] Auth session restored from cookie");
    } else {
        log.info("[Boot] No session to restore");
    }
    const alreadyBooted = sessionStorage.getItem("appBooted");
    if (!alreadyBooted) {
        showLoading("Starting app...");

        try {
            const { data, error } = await API.Get(API.routes.system.health);
            if (error)
                throw new Error(error.message);
            log.info("[Health] ✅ OK:", data);

            await new Promise(resolve => setTimeout(resolve, 2000));
            log.info("[Boot] Preload done");
            sessionStorage.setItem("appBooted", "1");

        } catch (err: any) {
            log.error("[Boot] ❌ Startup failed:", err);
            hideLoading();
            throw err;
        }
    }
}
