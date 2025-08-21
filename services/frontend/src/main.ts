// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/08/21 15:03:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Router from "./tools/Router.js";
import Fetch from "./tools/Fetch.js";

import Dashboard from "./views/Dashboard.ts";
import Posts from "./views/Posts.ts";
import Settings from "./views/Settings.ts";
import Game from "./views/Game.ts";
import NotFound from "./views/NotFound.ts";

const API = new Fetch("http://localhost:8000");

const routes = [
    { path: "/", view: Dashboard },
    { path: "/posts", view: Posts },
    { path: "/posts/:id", view: Posts },
    { path: "/settings", view: Settings },
    { path: "/game", view: Game },
    { path: "*", view: NotFound },
];

const router = new Router({
    routes,
    mountSelector: "#app",
    linkSelector: "[data-link]",
    onBeforeNavigate: (to) => {
        // Example: block access to /game if not logged in
        //
        // if (to.startsWith("/game") && !isLoggedIn()) {
        //      alert("You must be logged in to access the game.");
        //      return false; // cancels navigation
        // }
    },
});

// Export nav function to web dev console
window.navigateTo = (url) => router.navigateTo(url);

API.get("/health")
    .then(data => console.log("✅ Health check:", data))
    .catch((err) => console.error("❌ Health check error:", err));

router.start();
