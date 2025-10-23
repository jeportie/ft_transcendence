// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   GeometryFactory.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 12:03:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 12:40:16 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as BABYLON from "babylonjs";

export function createGridGeometry(scene, root, pattern = "ico") {
    const R = 1.5;
    const COUNT = 15000;
    const points = generatePattern(pattern, R, COUNT, scene);
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 4);
    const rest = [], pos = [], vel = [];

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        rest[i] = p.clone();
        pos[i] = p.clone();
        vel[i] = BABYLON.Vector3.Zero();
        const k = i * 3;
        positions[k] = p.x;
        positions[k + 1] = p.y;
        positions[k + 2] = p.z;
        const c = i * 4;
        colors[c] = colors[c + 1] = colors[c + 2] = 1;
        colors[c + 3] = 1;
    }

    const mesh = new BABYLON.Mesh(`sphere_${pattern}`, scene);
    mesh.setParent(root);
    const vData = new BABYLON.VertexData();
    vData.positions = positions;
    vData.colors = colors;
    vData.applyToMesh(mesh, true);

    // material: GPU point-cloud, unlit, vertex-color driven
    const mat = new BABYLON.StandardMaterial("dotMat", scene);
    mat.pointsCloud = true;
    mat.pointSize = 2;

    // IMPORTANT: match old behavior (unlit + emissive so vertex colors are visible)
    mat.disableLighting = true;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);   // <-- this makes the points visible
    mat.specularColor = new BABYLON.Color3(0, 0, 0);   // no spec/gloss

    // (Optional) make sure vertex colors are honored
    // Some Babylon builds expose 'useVertexColors' (plural). Setting both is harmless.
    mat.useVertexColors = true;

    mesh.material = mat;


    return { R, rest, pos, vel, positions, colors, COUNT: points.length, mesh };
}

function generatePattern(name, R, count, scene) {
    const pts = [];
    switch (name) {
        case "ico": {
            const temp = BABYLON.MeshBuilder.CreateIcoSphere("icoTemp", { radius: R, subdivisions: 40 }, scene);
            const positions = temp.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            temp.dispose();
            for (let i = 0; i < positions.length; i += 3)
                pts.push(new BABYLON.Vector3(positions[i], positions[i + 1], positions[i + 2]));
            break;
        }
        case "fibonacci": {
            const offset = 2 / count;
            const inc = Math.PI * (3 - Math.sqrt(5));
            for (let i = 0; i < count; i++) {
                const y = ((i * offset) - 1) + offset / 2;
                const r = Math.sqrt(1 - y * y);
                const phi = i * inc;
                pts.push(new BABYLON.Vector3(Math.cos(phi) * r * R, y * R, Math.sin(phi) * r * R));
            }
            break;
        }
        case "spiral": {
            const turns = 1024;
            for (let i = 0; i < count; i++) {
                const t = i / count;
                const y = R * (1 - 2 * t);
                const radius = Math.sqrt(R * R - y * y);
                const angle = t * Math.PI * 2 * turns;
                pts.push(new BABYLON.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
            }
            break;
        }
        case "noise": {
            for (let i = 0; i < count * 2; i++) {
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos(2 * Math.random() - 1);
                const x = Math.sin(phi) * Math.cos(theta);
                const y = Math.cos(phi);
                const z = Math.sin(phi) * Math.sin(theta);
                const noise = (Math.random() - 0.5) * 0.2;
                pts.push(new BABYLON.Vector3(x * (R + noise), y * (R + noise), z * (R + noise)));
            }
            break;
        }
        case "latlon": {
            const latSeg = 120, lonSeg = 120;
            for (let lat = 0; lat <= latSeg; lat++) {
                const phi = (lat / latSeg) * Math.PI;
                const y = Math.cos(phi);
                const r = Math.sin(phi);
                for (let lon = 0; lon <= lonSeg; lon++) {
                    const theta = (lon / lonSeg) * 2 * Math.PI;
                    pts.push(new BABYLON.Vector3(r * Math.cos(theta) * R, y * R, r * Math.sin(theta) * R));
                }
            }
            break;
        }
    }
    return pts;
}
