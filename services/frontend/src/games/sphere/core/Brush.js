// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Brush.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 12:03:35 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 12:03:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

export function createBrush(scene, root) {
    const brush = BABYLON.MeshBuilder.CreateSphere("brush", { diameter: 0.12 }, scene);
    const mat = new BABYLON.StandardMaterial("brushMat", scene);
    mat.emissiveColor = new BABYLON.Color3(0.2, 0.8, 1.0);
    mat.alpha = 0.9;
    brush.material = mat;
    brush.setParent(root);
    brush.isVisible = false;
    return brush;
}
