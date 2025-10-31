// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   draw.js                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/09 11:00:11 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 14:41:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { clamp, lerp } from "./utils.js";

export function drawBackground(ctx, state) {
    const g = ctx.createLinearGradient(0, 0, state.width, state.height);
    g.addColorStop(0, "#0b0f16");
    g.addColorStop(1, "#05070b");
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, state.width, state.height);
    ctx.restore();
}

export function drawLinks(ctx, state) {
    const { particles, params, mouse } = state;
    const maxD2 = params.linkDist * params.linkDist;

    ctx.lineWidth = 1;
    ctx.lineCap = "round";

    for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.pos.x - b.pos.x;
            const dy = a.pos.y - b.pos.y;
            const d2 = dx * dx + dy * dy;
            if (d2 >= maxD2) continue;

            const d = Math.sqrt(d2);
            const alpha = clamp(1 - d / params.linkDist, 0, 1);

            const ca = a.currentColor || { r: 148, g: 163, b: 184, t: 0 };
            const cb = b.currentColor || ca;
            const mixT = 0.5;
            const r = Math.round(lerp(ca.r, cb.r, mixT));
            const g = Math.round(lerp(ca.g, cb.g, mixT));
            const bcol = Math.round(lerp(ca.b, cb.b, mixT));

            const mDist = (a.pos.distanceTo(mouse.pos) + b.pos.distanceTo(mouse.pos)) * 0.5;
            const mNorm = clamp(1 - mDist / (params.baseRadius * 2), 0, 1);
            const mouseFade = Math.pow(mNorm, 1.5);

            const bright = (ca.t + cb.t) * 0.5;
            const glowBoost = 0.6 + bright * 0.9;
            const hoverBoost = 0.3 + mouse.fade * 0.4;
            const idleBoost = 0.6 + Math.pow(1 - mouse.fade, 1.6) * 1.5;

            const finalAlpha =
                0.01 + alpha * (0.2 + 0.8 * mouseFade * mouse.fade) * glowBoost * hoverBoost * idleBoost;

            ctx.strokeStyle = `rgba(${r},${g},${bcol},${finalAlpha})`;
            ctx.beginPath();
            ctx.moveTo(a.pos.x, a.pos.y);
            ctx.lineTo(b.pos.x, b.pos.y);
            ctx.stroke();
        }
    }

    ctx.lineWidth = 2;
    ctx.globalCompositeOperation = "lighter";
    for (const seg of state.activeSegments) {
        ctx.strokeStyle = `rgba(255,255,200,${seg.fade})`;
        ctx.beginPath();
        ctx.moveTo(seg.a.pos.x, seg.a.pos.y);
        ctx.lineTo(seg.b.pos.x, seg.b.pos.y);
        ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
}
