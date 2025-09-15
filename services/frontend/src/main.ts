// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/09/15 14:19:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { defineMiniRouter, onBeforeNavigate } from "@jeportie/mini-spa";
// import TailwindAnimationHook from "./transitions/TailwindAnimationHook.js";
import { routes } from "./spa/routes.js";
import { showLoading, hideLoading } from "./views/LoadingOverlay.js";
import { auth } from "./spa/auth.js";
import { API } from "./spa/api.js";
import { logger } from "./spa/logger.js";

//DOM
const app = document.querySelector("#app") as any;
defineMiniRouter();

app.routes = routes;
app.linkSelector = "[data-link]";
app.onBeforeNavigate = onBeforeNavigate;
// app.animationHook = new TailwindAnimationHook({ variant: "slide-push" });

app.beforeStart(async () => {
    const alreadyBooted = sessionStorage.getItem("appBooted");
    if (!alreadyBooted) {
        showLoading("Starting app...");

        try {
            // 1. Restore auth session
            await auth.initFromStorage();
            // 2. Health check
            const health = await API.get("/health");
            logger.info("[Health] ✅ OK:", health);
            // 3. Simulated preload (e.g. assets/fonts)
            await new Promise(resolve => setTimeout(resolve, 2000));
            logger.info("[Boot] Preload done");
            sessionStorage.setItem("appBooted", "1");

        } catch (err: any) {
            logger.error("[Boot] ❌ Startup failed:", err);

            hideLoading();
            throw err;
        }
    }
});

app.afterStart(() => {
    hideLoading();
})

app.start().catch((err: any) => {
    // Router.start() itself failed
    logger.error("[App] Router failed to start:", err);

    const container = document.querySelector("#app");
    if (container) {
        container.innerHTML = `
            <div class="ui-error-box">
              <h2>⚠️ App failed to start</h2>
              <pre>${err?.message || "Unknown error"}</pre>
            </div>
        `;
    }
});

window.addEventListener("auth:logout", () => {
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    // @ts-ignore
    window.navigateTo(`/login?next=${next}`);
});

(window as any).navigateTo = (url: string) => app.navigateTo(url);
