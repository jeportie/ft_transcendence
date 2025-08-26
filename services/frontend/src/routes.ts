// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   routes.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 10:53:03 by jeportie          #+#    #+#             //
//   Updated: 2025/08/26 11:06:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import TailwindAnimationHook from "./transitions/TailwindAnimationHook.js";
import OverlayAnimationHook from "./transitions/OverlayAnimationHook.js";
import { onBeforeNavigate } from "./guards.js";
import { requireAuth } from "./guards.js";

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

export const routes = [
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
        path: "/",
        layout: AppLayout,
        animationHook: new TailwindAnimationHook({ variant: "zoom" }),
        children: [
            { path: "dashboard", component: Dashboard, beforeEnter: requireAuth },
            { path: "settings", component: Settings, beforeEnter: requireAuth },
            { path: "posts", component: Posts, beforeEnter: requireAuth },
            { path: "posts/:id", component: PostShow, beforeEnter: requireAuth },
            { path: "game", component: Game, beforeEnter: requireAuth },
        ],
    },
    { path: "*", component: NotFound },
];

// Add feature to router : possibility to have a global beforeEnter per layout
