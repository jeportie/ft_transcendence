// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   initMiniRouter.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 15:13:26 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 15:14:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function initMiniRouter(app: any, {
    routes,
    linkSelector = "[data-link]",
    animationHook,         // optional
    beforeStart = [],
    afterStart = [],
}: {
    routes: any[],
    linkSelector?: string,
    animationHook?: any,
    beforeStart?: Array<() => void | Promise<void>>,
    afterStart?: Array<() => void | Promise<void>>,
}) {
    app.routes = routes;
    app.linkSelector = linkSelector;
    if (animationHook) app.animationHook = animationHook;

    for (const fn of beforeStart) app.beforeStart(fn);
    for (const fn of afterStart) app.afterStart(fn);
}
