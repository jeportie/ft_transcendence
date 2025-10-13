// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   routes.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 10:53:03 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 13:33:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import TailwindAnimationHook from "../styles/transitions/hooks/TailwindAnimationHook.js";
import OverlayAnimationHook from "../styles/transitions/hooks/OverlayAnimationHook.js";
import { guards } from "./guards.js";

// Landing layout
const LandingLayout = () => import("../views/LandingLayout.ts");
const Landing = () => import("../views/Landing.ts");
// const Login = () => import("../views/Login.ts");
const Login = () => import("../views/auth/Login/Login.ts");
const Forgot = () => import("../views/Forgot.ts");
const Reset = () => import("../views/ResetPwd.ts");
const F2aLogin = () => import("../views/F2aLogin.ts");
const BackupLogin = () => import("../views/BackupLogin.ts");
const Signup = () => import("../views/Signup.ts");
const NotActive = () => import("../views/NotActive.ts");
const FinalizeSubscription = () => import("../views/FinalizeSubscription.ts");
const Activate = () => import("../views/Activate.ts");
const ServiceTerms = () => import("../views/ServiceTerms.ts");
const PrivacyPolity = () => import("../views/PrivacyPolicy.ts");

// App layout
const AppLayout = () => import("../views/AppLayout.ts");
const Dashboard = () => import("../views/Dashboard.ts");
const Settings = () => import("../views/Settings.ts");
const Posts = () => import("../views/Posts.ts");
const PostShow = () => import("../views/PostShow.ts");
const Game = () => import("../views/Game.ts");
const NotFound = () => import("../views/NotFound.ts");

export const routes = [
    {
        path: "/",
        layout: LandingLayout,
        animationHook: new OverlayAnimationHook(),
        children: [
            { path: "", component: Landing },
            { path: "login", component: Login },
            { path: "forgot-password", component: Forgot },
            { path: "reset-password", component: Reset },
            { path: "f2a-login", component: F2aLogin },
            { path: "backups", component: BackupLogin },
            { path: "signup", component: Signup },
            { path: "not-active", component: NotActive },
            { path: "finalize-subscription", component: FinalizeSubscription },
            { path: "activate", component: Activate },
            { path: "service-terms", component: ServiceTerms },
            { path: "privacy-policy", component: PrivacyPolity },
        ]
    },
    {
        path: "/",
        layout: AppLayout,
        animationHook: new TailwindAnimationHook({ variant: "zoom" }),
        children: [
            { path: "dashboard", component: Dashboard, beforeEnter: guards.requireAuth },
            { path: "settings", component: Settings, beforeEnter: guards.requireAuth },
            { path: "posts", component: Posts, beforeEnter: guards.requireAuth },
            { path: "posts/:id", component: PostShow, beforeEnter: guards.requireAuth },
            { path: "game", component: Game, beforeEnter: guards.requireAuth },
        ],
    },
    { path: "*", component: NotFound },
];

// Add feature to router : possibility to have a global beforeEnter per layout
