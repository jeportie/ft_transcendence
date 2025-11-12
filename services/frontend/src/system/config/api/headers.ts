// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   headers.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 16:56:28 by jeportie          #+#    #+#             //
//   Updated: 2025/11/12 09:22:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { resolveClientHeaders } from "./resolveClientHeader.js";

export async function withCommonHeaders(init: RequestInit) {
    const headers = await resolveClientHeaders();
    init.headers = {
        ...(init.headers || {}),
        ...headers,
    };
}
