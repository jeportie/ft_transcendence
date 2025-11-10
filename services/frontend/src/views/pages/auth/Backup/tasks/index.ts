// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 15:16:08 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 15:22:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { handleBackup } from "./handleBackup.js";

export const tasks = {
    init: [],

    ready: [
        handleBackup,
    ],

    teardown: [],
};

