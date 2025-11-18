// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   enableEmail.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/18 11:57:31 by jeportie          #+#    #+#             //
//   Updated: 2025/11/18 12:06:32 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// POST /auth/f2a/email/enable
//      send a 6-digit code to user email
//      store a temporary email_2fa_token hashed (or in Redis)
//      return { method: "email", sent: true }

export async function enableEmail(fastify, request, reply) {

}
