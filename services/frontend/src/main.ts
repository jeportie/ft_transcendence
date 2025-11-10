// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 15:09:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { defineMiniRouter } from "@jeportie/mini-spa";
import { routes } from "./views/routes.js";
import { logger } from "./spa/logger.js";
import { bootstrap } from "./app/bootstrap.js";
import { hideLoading } from "./views/pages/LoadingOverlay.js";

import "./spa/wc/index.js";

defineMiniRouter();
//DOM
const app = document.querySelector("#app") as any;

app.routes = routes;
app.linkSelector = "[data-link]";
// app.animationHook = new TailwindAnimationHook({ variant: "slide-push" });
app.beforeStart(async () => {
    bootstrap();
});
app.afterStart(() => {
    hideLoading();
})
app.start();

window.addEventListener("auth:logout", () => {
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    // @ts-ignore
    window.navigateTo(`/login?next=${next}`);
});

(window as any).navigateTo = (url: string) => app.navigateTo(url);
