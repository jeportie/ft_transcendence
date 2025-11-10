// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/14 18:11:41 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 19:01:57 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { destroyRecaptcha } from "../../../../spa/utils/recaptcha.js";
import { handleForgot } from "./handleForgot.js";

export const tasks = {
    init: [],

    ready: [
        handleForgot,
    ],

    teardown: [destroyRecaptcha],
};



