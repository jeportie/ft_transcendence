// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 16:01:47 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Router from "./router/Router.js";
import Fetch from "./tools/Fetch.js";
import { createRouteTransition } from "./transition.ts";

// Lazy views 
const Landing = () => import("./views/Landing.ts");
const Dashboard = () => import("./views/Dashboard.ts");
const Settings = () => import("./views/Settings.ts");
const Posts = () => import("./views/Posts.ts");
const PostShow = () => import("./views/PostShow.ts");
const Game = () => import("./views/Game.ts");
const Login = () => import("./views/Login.ts");
const NotFound = () => import("./views/NotFound.ts");

// Lazy layout
const AppLayout = () => import("./views/layouts/AppLayout.ts");

const API = new Fetch("http://localhost:8000");

// Example guard (redirect if not logged in)
const requireAuth = (ctx: any) => {
    const logged = Boolean(localStorage.getItem("token"));
    return logged || "/login";
};

// Optional global block for API paths
const onBeforeNavigate = (to: string) => {
    if (to.startsWith("/api/")) return false;
};

const routes = [
    { path: "/", component: Landing },
    {
        path: "/",                // layout root
        layout: AppLayout,        // children will be wrapped in AppLayout
        children: [
            { path: "dashboard", component: Dashboard /*, beforeEnter: requireAuth */ },
            { path: "settings", component: Settings /*, beforeEnter: requireAuth */ },
            { path: "posts", component: Posts },
            { path: "posts/:id", component: PostShow },
            { path: "game", component: Game/*, beforeEnter: requireAuth*/ },
        ],
    },
    { path: "/login", component: Login },
    { path: "*", component: NotFound },
];

// Pick a global default
const transition = createRouteTransition("slide");

const router = new Router({
    routes,
    mountSelector: "#app",
    linkSelector: "[data-link]",
    onBeforeNavigate,
    transition,
});

API.get("/health")
    .then(data => console.log("✅ Health check:", data))
    .catch((err) => console.error("❌ Health check error:", err));

router.start();

// Export nav function to web dev console
window.navigateTo = (url) => router.navigateTo(url);
