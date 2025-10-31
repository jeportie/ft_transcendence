// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   config.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:13:50 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 10:46:06 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { normalizeParams, PARAM_SCHEMA } from "./params.js";
import { colorThemes } from "./colorThemes.js";

export const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
export const defaults = normalizeParams(); // backward compat for doc comments

export function createConfig(overrides = {}) {
    return {
        DPR,
        colors: colorThemes,
        params: normalizeParams(overrides),
        schema: PARAM_SCHEMA,
    };
}
