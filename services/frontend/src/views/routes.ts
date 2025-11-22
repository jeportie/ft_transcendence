// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   routes.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 10:53:03 by jeportie          #+#    #+#             //
//   Updated: 2025/11/21 16:07:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import TailwindAnimationHook from "@styles/transitions/hooks/TailwindAnimationHook.js";
import OverlayAnimationHook from "@styles/transitions/hooks/OverlayAnimationHook.js";
import PersistentAnimationHook from "@styles/transitions/hooks/PersistentAnimationHook.js";
import { guards } from "@system/config/routes/guards.js";

// Landing layout
const LandingLayout = () => import("./Landing/_Layout/LandingLayout.js");
const Landing = () => import("./Landing/Landing/Landing.js");
const ServiceTerms = () => import("./Landing/Terms/ServiceTerms.js");
const PrivacyPolity = () => import("./Landing/Policy/PrivacyPolicy.js");
const Login = () => import("./Landing/Login/Login.js");
const Signup = () => import("./Landing/Signup/Signup.js");
const Forgot = () => import("./Landing/ForgotPwd/ForgotPwd.js");
const F2aLogin = () => import("./Landing/F2A/F2aLogin.js");
const BackupLogin = () => import("./Landing/Backup/BackupLogin.js");
const Activate = () => import("./Landing/Activate/Activate.js");
const Reset = () => import("./Landing/Reset/ResetPwd.js");

// App layout
const AppLayout = () => import("./App/_Layout/AppLayout.js");
const Dashboard = () => import("./App/Dashboard/Dashboard.js");
const Settings = () => import("./App/Settings/Settings.js");

// Arcade Layout
const ArcadeLayout = () => import("./Arcade/_Layout/ArcadeLayout.js");
const ArcadeMenu = () => import("./Arcade/Menu/Menu.js");
const ArcadeMatch = () => import("./Arcade/Match/Pong.js");

// Not Found Layout
const NotFound = () => import("./NotFound/NotFound.js");

const appHook = new PersistentAnimationHook();
const landingHook = new OverlayAnimationHook();
const arcadeHook = null;

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
        layout: ArcadeLayout,
        animationHook: landingHook,
        children: [
            { path: "arcade", component: ArcadeMenu },             // new menu
            { path: "arcade/play", component: ArcadeMatch },        // your current Pong.ts
            // { path: "arcade/tournament", component: ArcadeTournamentSetup },
            // { path: "arcade/tournament/bracket", component: ArcadeTournamentBracket },
        ],
    },
    {
        path: "/",
        layout: AppLayout,
        animationHook: appHook,
        children: [
            { path: "dashboard", component: Dashboard, beforeEnter: guards.requireAuth },
            { path: "settings", component: Settings, beforeEnter: guards.requireAuth },
        ],
    },

    { path: "*", component: NotFound },
];
