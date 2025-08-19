// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   router.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/19 12:33:16 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 12:41:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Dashboard from "./views/Dashboard.ts";
import Posts from "./views/Posts.ts";
import Settings from "./views/Settings.ts";
import NotFound from "./views/NotFound.ts";
import Game from "./views/Game.ts";
import type AbstractView from "./views/AbstractView.ts";

const routes = [
    { path: "/", view: Dashboard },
    { path: "/posts", view: Posts },
    { path: "/posts/:id", view: Posts },
    { path: "/settings", view: Settings },
    { path: "/game", view: Game },
    { path: "*", view: NotFound },
];

let currentView: AbstractView | null = null;

function pathToRegex(path: string) {
    return (new RegExp("^" + path
        .replace(/\//g, "\\/")
        .replace(/:\w+/g, "([^\\/]+)") + "$"));
}

function getParams(match) {
    const res = match.result || [];
    const values = res.slice(1);
    const keys = Array.from(match.route.path
        .matchAll(/:(\w+)/g))
        .map(result => result[1]);

    return (Object.fromEntries(keys.map((key, i) => {
        return ([key, decodeURIComponent(values[i])]);
    })));
}

function normalize(path: string) {
    if (path !== "/")
        return (path.replace(/\/+$/, ""));
    else
        return (path);
}

export function navigateTo(url: string) {
    history.pushState(null, "", url);
    router();
}

function matchRoute(path: string, pathname: string) {
    if (path === "*") return null;
    return pathname.match(pathToRegex(path));
}

export async function router() {
    const pathname = normalize(location.pathname);

    const potentialMatches = routes.map(route => ({
        route,
        result: matchRoute(route.path, pathname),
    }));

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
    if (!match) {
        const notFound = routes.find(r => r.path === "*");
        // provide a non-null "result" so getParams() won’t crash
        match = { route: notFound, result: [pathname] };
    }

    const ctx = {
        path: pathname,
        params: getParams(match),
        query: Object.fromEntries(new URLSearchParams(location.search).entries()),
        hash: location.hash,
        state: history.state,
    };

    currentView?.destroy?.();
    const view = new match.route.view(ctx);
    const app = document.querySelector("#app");
    app.innerHTML = await view.getHTML();
    currentView = view;
    view.mount?.();
};
