// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   routes.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 10:53:03 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 18:58:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import TailwindAnimationHook from "../styles/transitions/hooks/TailwindAnimationHook.js";
import OverlayAnimationHook from "../styles/transitions/hooks/OverlayAnimationHook.js";
import { guards } from "./guards.js";

// Landing layout
const LandingLayout = () => import("../views/LandingLayout.js");
const Landing = () => import("../views/Landing.js");
const Login = () => import("../views/auth/Login/Login.js");
const Signup = () => import("../views/auth/Signup/Signup.js");
const Forgot = () => import("../views/auth/ForgotPwd/ForgotPwd.js");
const Reset = () => import("../views/ResetPwd.js");
const F2aLogin = () => import("../views/F2aLogin.js");
const BackupLogin = () => import("../views/BackupLogin.js");
const NotActive = () => import("../views/NotActive.js");
const FinalizeSubscription = () => import("../views/FinalizeSubscription.js");
const Activate = () => import("../views/Activate.js");
const ServiceTerms = () => import("../views/ServiceTerms.js");
const PrivacyPolity = () => import("../views/PrivacyPolicy.js");

// App layout
const AppLayout = () => import("../views/AppLayout.js");
const Dashboard = () => import("../views/Dashboard.js");
const Settings = () => import("../views/Settings.js");
const Posts = () => import("../views/Posts.js");
const PostShow = () => import("../views/PostShow.js");
const Game = () => import("../views/Game.js");
const NotFound = () => import("../views/NotFound.js");

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
