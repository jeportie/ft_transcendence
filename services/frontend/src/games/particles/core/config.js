// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   config.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:13:50 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 09:37:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { normalizeParams } from "./params.js";

export const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

export const defaults = normalizeParams();

export const colorThemes = {
    default: [
        { r: 147, g: 197, b: 253 }, // #93c5fd  blue
        { r: 167, g: 243, b: 208 }, // #a7f3d0  mint
        { r: 255, g: 255, b: 255 }, // #ffffff  white-hot
        { r: 253, g: 224, b: 71 }, // #fde047  yellow
        { r: 251, g: 146, b: 60 }  // #fb923c  orange
    ],
    electric: [
        { r: 147, g: 197, b: 253 }, // #93c5fd  blue
        { r: 14, g: 165, b: 233 }, // #0EA5E9 - sky-500 (cool cyan)
        { r: 56, g: 189, b: 248 }, // #38BDF8 - sky-400 (bright electric)
        { r: 147, g: 197, b: 253 }, // #93C5FD - blue-300 (light blue)
        { r: 191, g: 219, b: 254 }, // #BFDBFE - blue-200 (soft electric fog)
        { r: 224, g: 242, b: 254 }, // #E0F2FE - blue-50  (icy glow)
    ],

    fire: [
        { r: 254, g: 215, b: 170 }, // #FED7AA - orange-200 (warm dawn)
        { r: 253, g: 224, b: 71 },  // #FDE047 - yellow-300 (glow)
        { r: 251, g: 146, b: 60 },  // #FB923C - orange-400 (burn)
        { r: 239, g: 68, b: 68 },  // #EF4444 - red-500 (flame)
        { r: 220, g: 38, b: 38 },  // #DC2626 - red-600 (ember core)
    ],

    mint: [
        { r: 52, g: 211, b: 153 }, // #34D399 - emerald-400 (fresh)
        { r: 110, g: 231, b: 183 }, // #6EE7B7 - emerald-300 (minty)
        { r: 167, g: 243, b: 208 }, // #A7F3D0 - mint-200 (calm)
        { r: 209, g: 250, b: 229 }, // #D1FAE5 - mint-100 (airy)
        { r: 236, g: 253, b: 245 }, // #ECFDF5 - mint-50  (mist)
    ],

    aurora: [
        { r: 59, g: 130, b: 246 }, // #3B82F6 - blue-500 (polar night)
        { r: 99, g: 102, b: 241 }, // #6366F1 - indigo-500 (magnetic)
        { r: 168, g: 85, b: 247 }, // #A855F7 - purple-500 (energy arc)
        { r: 217, g: 70, b: 239 }, // #D946EF - fuchsia-500 (burst)
        { r: 244, g: 114, b: 182 }, // #F472B6 - pink-400 (excited shimmer)
    ],

    ocean: [
        { r: 15, g: 118, b: 110 }, // #0F766E - teal-700 (deep sea)
        { r: 13, g: 148, b: 136 }, // #0D9488 - teal-600 (calm depth)
        { r: 20, g: 184, b: 166 }, // #14B8A6 - teal-500 (currents)
        { r: 45, g: 212, b: 191 }, // #2DD4BF - teal-400 (surface)
        { r: 153, g: 246, b: 228 }, // #99F6E4 - teal-200 (foam)
    ],

    sunset: [
        { r: 254, g: 240, b: 138 }, // #FEF08A - yellow-200 (dawn)
        { r: 253, g: 186, b: 116 }, // #FDBA74 - orange-300 (golden light)
        { r: 251, g: 113, b: 133 }, // #FB7185 - rose-400 (soft glow)
        { r: 244, g: 63, b: 94 }, // #F43F5E - rose-500 (heat)
        { r: 225, g: 29, b: 72 }, // #E11D48 - rose-600 (intense dusk)
    ],
};



