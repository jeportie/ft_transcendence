// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/09/11 22:16:42 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { defineMiniRouter } from "@jeportie/mini-spa";
import { auth } from "./tools/AuthService.js";
// import TailwindAnimationHook from "./transitions/TailwindAnimationHook.js";
import Fetch from "./tools/Fetch.js";
import { routes } from "./routes.js";
import { onBeforeNavigate } from "./tools/guards.js";
import { showLoading, hideLoading } from "./views/LoadingOverlay.js";

// API
const API = new Fetch("/api");

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
    console.log("Waited 5 seconds.");
});
app.afterStart(() => {
    hideLoading();
})
app.start();

API.get("/health")
    .then(data => console.log("✅ Health check:", data))
    .catch((err) => console.error("❌ Error:", err));

// toggle dark mode manually
// document.documentElement.classList.toggle("dark");

window.addEventListener("auth:logout", () => {
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    // @ts-ignore
    window.navigateTo(`/login?next=${next}`);
});

(window as any).navigateTo = (url: string) => app.navigateTo(url);
