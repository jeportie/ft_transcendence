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
import { auth, API, logger } from "./spa/initApp.js";

//DOM
const app = document.querySelector("#app") as any;
defineMiniRouter();

app.routes = routes;
app.linkSelector = "[data-link]";
app.onBeforeNavigate = onBeforeNavigate;
// app.animationHook = new TailwindAnimationHook({ variant: "slide-push" });
app.beforeStart(async () => {
    showLoading("Starting app...");
    await auth.initFromStorage();
    await new Promise(resolve => setTimeout(resolve, 5000));
    logger.info("[] Waited 5 seconds.");
});
app.afterStart(() => {
    hideLoading();
})
app.start();

API.get("/health")
    .then((data: any) => logger.info("[Health] ✅ Health check:", data))
    .catch((err: any) => logger.error("[Health] ❌ Error:", err));

window.addEventListener("auth:logout", () => {
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    // @ts-ignore
    window.navigateTo(`/login?next=${next}`);
});

(window as any).navigateTo = (url: string) => app.navigateTo(url);
