// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   mapLoader.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:06:59 by jeportie          #+#    #+#             //
//   Updated: 2025/10/09 11:11:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Load a particle map JSON from /maps/<name>.json
 * JSON format:
 * {
 *   "name": "constellation_name",
 *   "seed": 1234,
 *   "points": [ { "x": 0.1, "y": 0.2 }, ... ] // normalized 0..1
 * }
 */

export async function loadMapJson(name) {
    const url = `/maps/${name}.json`;
    try {
        const mod = await import(/* @vite-ignore */ url, { assert: { type: "json" } });
        return mod.default || mod;
    } catch {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch map ${name}: ${res.status}`);
        return await res.json();
    }
}

export function applyMapToParticles(state, pointsNorm, N) {
    const { width: w, height: h, particles } = state;
    const pts = pointsNorm.length ? pointsNorm : [];

    for (let i = 0; i < N; i++) {
        const src = pts.length ? pts[i % pts.length] : null;
        const x = src ? src.x * w : Math.random() * w;
        const y = src ? src.y * h : Math.random() * h;

        if (particles[i]) {
            particles[i].pos.x = x;
            particles[i].pos.y = y;
            particles[i].origin.x = x;
            particles[i].origin.y = y;
            particles[i].vel = new Vector((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
        } else {
            particles[i] = new Particle(x, y, state);
        }
    }
}

