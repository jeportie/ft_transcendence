// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   rayColor.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 11:52:38 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 11:52:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function getRayColor(intensity: number) {
    const hue = 180 + Math.abs(intensity) * 85;
    return `hsl(${hue},88%,54%)`;
}

export function getRayColorDimmed(intensity: number) {
    const hue = 180 + Math.abs(intensity) * 85;
    return `hsl(${hue},76%,45%)`;
}
