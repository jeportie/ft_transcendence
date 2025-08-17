// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 18:15:08 by jeportie          #+#    #+#             //
//   Updated: 2025/08/16 19:55:47 by jeportie         ###   ########.fr       //
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

function pathToRegex(path) {
    return (new RegExp("^" + path
        .replace(/\//g, "\\/")
        .replace(/:\w+/g, "([^\\/]+)") + "$"));
}

function getParams(match) {
    const values = match.result.slice(1);
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

async function router() {
    const pathname = normalize(location.pathname);
    const potentialMatches = routes.map(route => {
        return ({
            route,
            result: pathname.match(pathToRegex(route.path)),
        });
    });

    let match;
    match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
    if (!match) {
        match = {
            route: routes[0], //for now goes back to dashboard but need to redirect to 404 cutome page or something like that
            isMatch: true,
        }
    }
    const view = new match.route.view(getParams(match));
    document.querySelector("#app").innerHTML = await view.getHTML();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        // 1) ignore if already handled (e.g., inside another handler)
        if (e.defaultPrevented) return;
        // 2) only left-clicks (0). let middle/right clicks behave normally
        if (e.button !== 0) return;
        // 3) respect modifier keys (Cmd/Ctrl/Shift/Alt) — users expect new tab/window
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        // 4) support clicks on nested elements inside the link
        const a = e.target.closest("[data-link]");
        if (!a) return;
        // 5) let “real” external links go through (don’t hijack)
        const url = new URL(a.href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        // 6) respect links meant to open a new tab or download files
        if (a.target === "_blank" || a.hasAttribute("download") || a.getAttribute("rel") === "external") return;
        // 7) we’re handling it as an SPA nav; prevent full page reload
        e.preventDefault();
        // 8) keep query and hash if present
        navigateTo(url.pathname + url.search + url.hash);
    });
    router();
});
