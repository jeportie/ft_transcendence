// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   reply.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/26 22:52:05 by jeportie          #+#    #+#             //
//   Updated: 2025/09/26 22:56:32 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function ok(reply, data = {}, status = 200) {
    return (reply.code(status).send({ success: true, ...data }));
}

export const created = (reply, data = {}) => ok(reply, data, 201);
export const noContent = (reply) => reply.code(204).send();
