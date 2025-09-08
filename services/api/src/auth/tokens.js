// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   tokens.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/08 18:09:19 by jeportie          #+#    #+#             //
//   Updated: 2025/09/08 18:14:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import crypto from "crypto";

export function generateRefreshToken() {
    return (crypto.randomBytes(32).toString("hex"));
}

export function hashToken(token) {
    return (crypto.createHash("sha256").update(token, "utf8").digest("hex"));
}

export function addDayUTC(days) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + days);
    return (d.toISOString().replace(/\.\d{3}Z$/, "Z"));
}
