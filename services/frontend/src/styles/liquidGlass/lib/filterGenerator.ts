// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   filterGenerator.ts                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 12:52:40 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 13:00:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { calculateMagnifyingDisplacementMap } from "./magnifyingDisplacement";
import { imageDataToUrl } from "./imageDataToUrl";

export function createMagnifyingFilter(id = "magnifying-glass-filter", width = 210, height = 150) {
    const imageData = calculateMagnifyingDisplacementMap(width, height);
    const dataUrl = imageDataToUrl(imageData);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.display = "none";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", id);

    const feImage = document.createElementNS("http://www.w3.org/2000/svg", "feImage");
    feImage.setAttribute("href", dataUrl);
    feImage.setAttribute("result", "magnifying_displacement_map");
    feImage.setAttribute("x", "0");
    feImage.setAttribute("y", "0");
    feImage.setAttribute("width", width.toString());
    feImage.setAttribute("height", height.toString());
    filter.appendChild(feImage);

    const feDisplace = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
    feDisplace.setAttribute("in", "SourceGraphic");
    feDisplace.setAttribute("in2", "magnifying_displacement_map");
    feDisplace.setAttribute("scale", "24");
    feDisplace.setAttribute("xChannelSelector", "R");
    feDisplace.setAttribute("yChannelSelector", "G");
    filter.appendChild(feDisplace);

    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    return `url(#${id})`;
}

