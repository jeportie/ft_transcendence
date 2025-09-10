// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/09/09 20:19:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { defineMiniRouter } from "@jeportie/mini-spa";
import { auth } from "./tools/AuthService.js";
import TailwindAnimationHook from "./transitions/TailwindAnimationHook.js";
import Fetch from "./tools/Fetch.js";
import { routes } from "./routes.js";
import { onBeforeNavigate } from "./guards.js";

// API
const API = new Fetch("/api");

//DOM
const app = document.querySelector("#app") as any;

defineMiniRouter();
// auth.initFromStorage();

app.routes = routes;
app.linkSelector = "[data-link]";
app.onBeforeNavigate = onBeforeNavigate;
// app.animationHook = new TailwindAnimationHook({ variant: "slide-push" });
auth.initFromStorage().then(() => {
    app.start();
});
// app.start();

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
