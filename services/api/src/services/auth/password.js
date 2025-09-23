// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   password.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/04 18:18:52 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 14:40:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import argon2 from "argon2";

// need to fine tune it before production !
export async function hashPassword(plain) {
    return (argon2.hash(plain, { type: argon2.argon2id }));
}

export async function verifyPassword(hash, plain) {
    try {
        return (await argon2.verify(hash, plain));
    } catch {
        return (false);
    }
}
