// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 23:18:37 by jeportie          #+#    #+#             //
//   Updated: 2025/10/30 19:51:08 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { ASSETS } from "../Settings.js";
import { setupF2a, teardownF2a } from "./f2a.js";
import { setupPwd, teardownPwd } from "./pwd.js";
import { setupSessions, teardownSessions } from "./sessions.js";
import { init } from "./init.js";

export const tasks = {
    init: [
        init,
        (ctx: any) => setupSessions({ ASSETS: ctx.ASSETS }),
    ],
    ready: [
        (ctx: any) => setupF2a(),
        (ctx: any) => setupPwd({ ASSETS: ctx.ASSETS }), // ✅ pass context down
    ],
    teardown: [teardownSessions, teardownF2a, teardownPwd],
};

