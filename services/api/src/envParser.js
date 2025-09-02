// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   envParser.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 15:06:01 by jeportie          #+#    #+#             //
//   Updated: 2025/09/02 15:15:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function asString(v, fallback) {
    if (v == null || v === "")
        return (fallback);
    else
        return (String(v));
}

export function asNumber(v, fallback) {
    const n = Number(v);

    if (Number.isFinite(n))
        return (n);
    else
        return (fallback);
}

export function asBool(v, fallback) {
    if (v == null || v === "")
        return (fallback);

    const s = String(v).toLowerCase().trim();

    if (["1", "true", "yes", "y", "on"].includes(s))
        return (true);
    if (["0", "false", "no", "n", "off"].includes(s))
        return (false);
    return (fallback);
}

// add asNumberList(), asJson(), asUrl()
