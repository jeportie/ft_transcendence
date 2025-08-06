// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Draw2D.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/05 18:06:50 by jeportie          #+#    #+#             //
//   Updated: 2025/08/06 18:05:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default class Draw2D {
    constructor(ctx) {
        this.ctx = ctx;
    }

    // Draw a filled circle
    circle(x, y, radius, { fillStyle = '#ffffff', strokeStyle = null, lineWidth = 1 } = {}) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        if (fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.fill();
        }
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
        ctx.closePath();
    }

    // Draw a filled rectangle
    rect(x, y, width, height, { fillStyle = '#ffffff', strokeStyle = null, lineWidth = 1 } = {}) {
        const ctx = this.ctx;
        if (fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.fillRect(x, y, width, height);
        }
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(x, y, width, height);
        }
    }

    // Draw a line from (x1,y1) to (x2,y2)
    line(x1, y1, x2, y2, { strokeStyle = '#ffffff', lineWidth = 2, dash = [] } = {}) {
        const ctx = this.ctx;
        ctx.beginPath();
        if (dash.length) ctx.setLineDash(dash);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.setLineDash([]);   // reset dash
        ctx.closePath();
    }
}
