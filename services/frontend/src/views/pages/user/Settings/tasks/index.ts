// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 23:18:37 by jeportie          #+#    #+#             //
//   Updated: 2025/11/15 18:37:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// import { ASSETS } from "../Settings.js";
import { setupF2a, teardownF2a } from "./f2a.js";
import { setupPwd, teardownPwd } from "./pwd.js";
import { setupDelete, teardownDelete } from "./delete.js";
import { setupSessions, teardownSessions } from "./sessions.js";
import { init } from "./init.js";

export const tasks = {
    init: [init, setupSessions],
    ready: [setupF2a, setupPwd, setupDelete],
    teardown: [teardownSessions, teardownF2a, teardownPwd, teardownDelete],
};
