// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   howToUse.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 12:25:27 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 12:25:36 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { MotionValue } from "../lib/motion";
import { createRefractionFilter } from "./Filter";

const width = new MotionValue(210);
const height = new MotionValue(150);
const radius = new MotionValue(75);

const filterEl = createRefractionFilter({
    id: "magnifying-glass-filter",
    withSvgWrapper: true,
    width,
    height,
    radius,
    blur: 0,
    glassThickness: 110,
    bezelWidth: 25,
    refractiveIndex: 1.5,
    specularOpacity: 0.5,
    specularSaturation: 9,
    magnifyingScale: 24, // or omit
    colorScheme: new MotionValue<"light" | "dark">("light"),
    dpr: window.devicePixelRatio ?? 1,
});

// Append once to DOM (e.g., in <body>)
document.body.appendChild(filterEl);

// Then reference in CSS/SVG:
// style="backdrop-filter: url(#magnifying-glass-filter)"
