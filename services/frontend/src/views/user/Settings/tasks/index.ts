// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 23:18:37 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 22:33:33 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { setupF2a, teardownF2a } from "./f2a.js";
import { setupPwd, teardownPwd } from "./pwd.js";
import { setupSessions, teardownSessions } from "./sessions.js";

export const tasks = {
    // init: [setupSessions],          // table can start loading early
    init: [
        (ctx: any) => setupSessions({ ASSETS: ctx.ASSETS }),
    ],
    ready: [setupF2a, setupPwd],    // buttons exist now
    teardown: [teardownSessions, teardownF2a, teardownPwd],
};
