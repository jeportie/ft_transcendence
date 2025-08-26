// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   guards.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 11:00:35 by jeportie          #+#    #+#             //
//   Updated: 2025/08/26 11:01:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { auth } from "./tools/AuthService.js";

// If fail, we return to login/ but keeping the wanted page as argument 
// so when logged in we go back to the requested page
export const requireAuth = (ctx: any) => {
    if (auth.isLoggedIn())
        return (true);

    const wanted = (ctx?.path || location.pathname) + (location.search || "") + (location.hash || "");

    const next = encodeURIComponent(wanted);
    return (`/login?next=${next}`);
};

export const onBeforeNavigate = (to: string) => {
    if (to.startsWith("/api/"))
        return false;
};
