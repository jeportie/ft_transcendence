
// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 18:15:08 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 12:36:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import Settings from "./views/Settings.js";
import NotFound from "./views/NotFound.js";

const routes = [
    { path: "/", view: Dashboard },
    { path: "/posts", view: Posts },
    { path: "/posts/:id", view: Posts },
    { path: "/settings", view: Settings },
    { path: "*", view: NotFound },
];

let currentView = null; // tracks the mounted view

function pathToRegex(path) {
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

function normalize(path) {
    if (path !== "/")
        return (path.replace(/\/+$/, ""));
    else
        return (path);
}

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

function matchRoute(path, pathname) {
    if (path === "*") return null;
    return pathname.match(pathToRegex(path));
}

async function router() {
    const pathname = normalize(location.pathname);

    const potentialMatches = routes.map(route => ({
        route,
        result: matchRoute(route.path, pathname),
    }));

    let match;
    match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
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

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.defaultPrevented)
            return;
        if (e.button !== 0)
            return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
            return;
        const a = e.target.closest("[data-link]");
        if (!a)
            return;
        const url = new URL(a.href, window.location.origin);
        if (url.origin !== window.location.origin)
            return;
        if (a.target === "_blank" || a.hasAttribute("download") || a.getAttribute("rel") === "external")
            return;
        e.preventDefault();
        navigateTo(url.pathname + url.search + url.hash);
    });
    router();
});
