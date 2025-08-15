// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 18:15:08 by jeportie          #+#    #+#             //
//   Updated: 2025/08/14 19:23:18 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import Settings from "./views/Settings.js";

function pathToRegex(path) {
    return (new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"));
}

function getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return (Object.fromEntries(keys.map((key, i) => {
        return ([key, values[i]]);
    })));
}

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

async function router() {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/posts", view: Posts },
        { path: "/posts/:id", view: Posts },
        { path: "/settings", view: Settings },
    ];

    //Test each route for potential match
    const potentialMatches = routes.map(route => {
        return ({
            route,
            result: location.pathname.match(pathToRegex(route.path)),
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

    //console.log(match.route.view());
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", event => {
        if (event.target.matches("[data-link]")) {
            event.preventDefault();
            navigateTo(event.target.href);
        }
    })
    router();
});
