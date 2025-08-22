// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:07:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Router from "./router/Router.js";
import Fetch from "./tools/Fetch.js";

// Lazy views 
const Dashboard = () => import("./views/Dashboard.ts");
const Settings = () => import("./views/Settings.ts");
const Posts = () => import("./views/Posts.ts");
const PostShow = () => import("./views/PostShow.ts");
const Game = () => import("./views/Game.ts");
const NotFound = () => import("./views/NotFound.ts");

// Lazy layout
const AppLayout = () => import("./layout/AppLayout.ts");

const API = new Fetch("http://localhost:8000");

// Example guard (redirect if not logged in)
const requireAuth = (ctx: any) => {
    void ctx;
    const logged = Boolean(localStorage.getItem("token"));
    return logged || "/login";
};

// Optional global block for API paths
const onBeforeNavigate = (to: string) => {
    if (to.startsWith("/api/")) return false;
};

const routes = [
    {
        path: "/",                // layout root
        component: Dashboard,     // optional: render Dashboard at "/"
        layout: AppLayout,        // children will be wrapped in AppLayout
        children: [
            { path: "settings", component: Settings, beforeEnter: requireAuth },
            { path: "posts", component: Posts },
            { path: "posts/:id", component: PostShow },
            { path: "game", component: Game, beforeEnter: requireAuth },
        ],
    },
    { path: "/login", component: () => import("./views/Login.ts") },
    { path: "*", component: NotFound },
];

// Tailwind-based fade transition
function fadeTransition(el: HTMLElement, phase: "out" | "in") {
    // We just toggle small utility classes; CSS is declared in tailwind (see section 4)
    return new Promise<void>((resolve) => {
        if (phase === "out") {
            el.classList.remove("route-enter", "route-enter-active");
            el.classList.add("route-leave");
            requestAnimationFrame(() => {
                el.classList.add("route-leave-active");
                // Wait for the single transition to end
                const done = () => { el.removeEventListener("transitionend", done); resolve(); };
                el.addEventListener("transitionend", done, { once: true });
            });
        } else {
            el.classList.remove("route-leave", "route-leave-active");
            el.classList.add("route-enter");
            requestAnimationFrame(() => {
                el.classList.add("route-enter-active");
                const done = () => {
                    el.classList.remove("route-enter", "route-enter-active");
                    el.removeEventListener("transitionend", done);
                    resolve();
                };
                el.addEventListener("transitionend", done, { once: true });
            });
        }
    });
}

const router = new Router({
    routes,
    mountSelector: "#app",
    linkSelector: "[data-link]",
    onBeforeNavigate,
    transition: fadeTransition,
});

API.get("/health")
    .then(data => console.log("✅ Health check:", data))
    .catch((err) => console.error("❌ Health check error:", err));

router.start();

// Export nav function to web dev console
window.navigateTo = (url) => router.navigateTo(url);
