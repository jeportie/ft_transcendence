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
import { defineMiniRouter, setupMiniRouter } from "@jeportie/mini-spa";
import { routes } from "./views/routes.js";

import { bootstrap } from "./app/bootstrap.js";
import { hideLoading } from "./views/pages/LoadingOverlay.js";
import { wireGlobals } from "./app/wireGlobals.js";

import "./spa/wc/index.js";

const app = document.querySelector("#app") as any;

defineMiniRouter();
setupMiniRouter(app, {
    routes,
    linkSelector: "[data-link]",
    // animationHook: new TailwindAnimationHook({ variant: "slide-push" }),
    beforeStart: [() => bootstrap()],
    afterStart: [() => hideLoading()],
});

wireGlobals(app);
app.start();
