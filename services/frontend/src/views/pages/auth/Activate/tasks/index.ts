// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 23:18:37 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 23:19:08 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { handleActivate } from "./handleActivate.js";

export const tasks = {
    init: [],
    ready: [handleActivate],
    teardown: [],
};
