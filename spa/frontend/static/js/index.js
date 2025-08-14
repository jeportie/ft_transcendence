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

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

async function router() {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/posts", view: Posts },
        { path: "/settings", view: Settings },
    ];

    //Test each route for potential match
    const potentialMatches = routes.map(route => {
        return ({
            route,
            isMatch: location.pathname === route.path,
        });
    });

    let match;

    match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);
    if (!match) {
        match = {
            route: routes[0], //for now goes back to dashboard but need to redirect to 404 cutome page or something like that
            isMatch: true,
        }
    }
    const view = new match.route.view();

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
