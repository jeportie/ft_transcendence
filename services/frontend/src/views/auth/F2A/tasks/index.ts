// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 09:50:48 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 10:15:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { handleF2A } from "./handleF2a.js";
import { setupInputs } from "./setupInputs.js"

export const tasks = {
    init: [],

    ready: [
        setupInputs,
        handleF2A,
    ],

    teardown: [],
};
