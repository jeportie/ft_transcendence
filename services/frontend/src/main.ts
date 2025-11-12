// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 18:38:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { defineMiniRouter, setupMiniRouter } from "@jeportie/mini-spa";
import { routes } from "@views/routes";
import { hideLoading } from "@views/loading";
import { bootstrap } from "@system/app/bootstrap.js";
import { wireGlobals } from "@system/app/wireGlobals.js";
import { logger } from "@system";

import "./components/wc/index.js";

logger.setLevel("silent");

const app = document.querySelector("#app") as any;

defineMiniRouter();
setupMiniRouter(app, {
    routes,
    linkSelector: "[data-link]",
    logger,
    // animationHook: new TailwindAnimationHook({ variant: "slide-push" }),
    beforeStart: [() => bootstrap()],
    afterStart: [() => hideLoading()],
});

wireGlobals(app);
app.start();
