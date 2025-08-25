// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/08/26 00:07:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { defineMiniRouter } from "@jeportie/mini-spa";
import TailwindAnimationHook from "./transitions/TailwindAnimationHook.js";
import OverlayAnimationHook from "./transitions/OverlayAnimationHook.js";
import Fetch from "./tools/Fetch.js";

// Register the <mini-router> custom element
defineMiniRouter();

// Lazy views 
const Landing = () => import("./views/Landing.ts");
const Login = () => import("./views/Login.ts");

const Dashboard = () => import("./views/Dashboard.ts");
const Settings = () => import("./views/Settings.ts");
const Posts = () => import("./views/Posts.ts");
const PostShow = () => import("./views/PostShow.ts");
const Game = () => import("./views/Game.ts");
const NotFound = () => import("./views/NotFound.ts");

// Lazy layout
const AppLayout = () => import("./views/AppLayout.ts");
const LandingLayout = () => import("./views/LandingLayout.ts");

const API = new Fetch("/api");

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
    {
        path: "/",
        layout: LandingLayout,
        animationHook: new OverlayAnimationHook(),
        children: [
            { path: "", component: Landing },
            { path: "login", component: Login },
        ]
    },
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
    { path: "*", component: NotFound },
];

const app = document.querySelector("#app") as any;
app.routes = routes;
app.linkSelector = "[data-link]";
app.onBeforeNavigate = onBeforeNavigate;
//app.animationHook = new OverlayAnimationHook();
app.animationHook = new TailwindAnimationHook({ variant: "fade" });
app.start();
(window as any).navigateTo = (url: string) => app.navigateTo(url);

API.get("/health")
    .then(data => console.log("✅ Health check:", data))
    .catch((err) => console.error("❌ Health check error:", err));

const test = {
    user: "jerome",
    content: "Hello backend, this is the frontend speaking to you!",
};

API.post("/echo", test)
    .then(data => console.log("✅ POST:", data))
    .catch(err => console.error("❌ POST:", err));
