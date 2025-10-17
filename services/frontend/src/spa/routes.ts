// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   routes.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 10:53:03 by jeportie          #+#    #+#             //
//   Updated: 2025/10/17 14:07:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import TailwindAnimationHook from "../styles/transitions/hooks/TailwindAnimationHook.js";
import OverlayAnimationHook from "../styles/transitions/hooks/OverlayAnimationHook.js";
import { guards } from "./guards.js";

// Landing layout
const LandingLayout = () => import("../views/LandingLayout.js");
// |--> Landing
const Landing = () => import("../views/landing/Landing/Landing.js");
const ServiceTerms = () => import("../views/landing/Terms/ServiceTerms.js");
const PrivacyPolity = () => import("../views/landing/Policy/PrivacyPolicy.js");
// |--> Auth
const Login = () => import("../views/auth/Login/Login.js");
const Signup = () => import("../views/auth/Signup/Signup.js");
const Forgot = () => import("../views/auth/ForgotPwd/ForgotPwd.js");
const F2aLogin = () => import("../views/auth/F2A/F2aLogin.js");
const BackupLogin = () => import("../views/auth/Backup/BackupLogin.js");
const Activate = () => import("../views/auth/Activate/Activate.js");
const Reset = () => import("../views/auth/Reset/ResetPwd.js");

// App layout
const AppLayout = () => import("../views/AppLayout.js");
// |--> User
const Dashboard = () => import("../views/user/Dashboard/Dashboard.js");
const Settings = () => import("../views/Settings.js");
// |--> Game
const Game = () => import("../views/Game.js");
// |--> Other
const NotFound = () => import("../views/404/NotFound.js");

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
            { path: "game", component: Game, beforeEnter: guards.requireAuth },
        ],
    },
    { path: "*", component: NotFound },
];

// Add feature to router : possibility to have a global beforeEnter per layout
