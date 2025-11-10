// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/14 18:11:41 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 10:40:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { destroyRecaptcha } from "@jeportie/mini-js/utils";
import { handleForgot } from "./handleForgot.js";

export const tasks = {
    init: [],

    ready: [
        handleForgot,
    ],

    teardown: [destroyRecaptcha],
};



