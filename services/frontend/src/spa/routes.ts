// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   routes.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 10:53:03 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 22:05:47 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import TailwindAnimationHook from "../styles/transitions/hooks/TailwindAnimationHook.js";
import OverlayAnimationHook from "../styles/transitions/hooks/OverlayAnimationHook.js";
import PersistentAnimationHook from "../styles/transitions/hooks/PersistentAnimationHook.js";
import { guards } from "./guards.js";

// Landing layout
const LandingLayout = () => import("../layouts/LandingLayout/LandingLayout.js");
const Landing = () => import("../views/landing/Landing/Landing.js");
const ServiceTerms = () => import("../views/landing/Terms/ServiceTerms.js");
const PrivacyPolity = () => import("../views/landing/Policy/PrivacyPolicy.js");
const Login = () => import("../views/auth/Login/Login.js");
const Signup = () => import("../views/auth/Signup/Signup.js");
const Forgot = () => import("../views/auth/ForgotPwd/ForgotPwd.js");
const F2aLogin = () => import("../views/auth/F2A/F2aLogin.js");
const BackupLogin = () => import("../views/auth/Backup/BackupLogin.js");
const Activate = () => import("../views/auth/Activate/Activate.js");
const Reset = () => import("../views/auth/Reset/ResetPwd.js");

// App layout
const AppLayout = () => import("../layouts/AppLayout/AppLayout.js");
const Dashboard = () => import("../views/user/Dashboard/Dashboard.js");
const Settings = () => import("../views/user/Settings/Settings.js");
const Game = () => import("../views/pong/Match/Pong.js");
const NotFound = () => import("../views/404/NotFound.js");

const appHook = new PersistentAnimationHook();
const landingHook = new OverlayAnimationHook();

export const routes = [
    {
        path: "/",
        layout: LandingLayout,
        animationHook: landingHook,
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
        animationHook: appHook,
        children: [
            { path: "dashboard", component: Dashboard, beforeEnter: guards.requireAuth },
            { path: "settings", component: Settings, beforeEnter: guards.requireAuth },
            { path: "pong", component: Game, beforeEnter: guards.requireAuth },
        ],
    },

    { path: "*", component: NotFound },
];

// Add feature to router : possibility to have a global beforeEnter per layout
