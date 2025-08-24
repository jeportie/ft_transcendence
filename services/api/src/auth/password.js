// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   password.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/24 22:51:12 by jeportie          #+#    #+#             //
//   Updated: 2025/08/24 22:59:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as argon2 from "argon2";

/** Hash a plain password using Argon2id. */
export function hashPassword(plain) {
    return argon2.hash(plain, { type: argon2.argon2id });
}

/** Verify a plain password against a stored argon2 hash. */
export function verifyPassword(hash, plain) {
    return (argon2.verify(hash, plain));
}
