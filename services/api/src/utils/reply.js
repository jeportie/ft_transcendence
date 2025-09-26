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

export function fail(reply, error, status = 400) {
    return reply.code(status).send({ success: false, error });
}

export const created = (reply, data = {}) => ok(reply, data, 201);
export const noContent = (reply) => reply.code(204).send();

export const badRequest = (reply, msg = "Bad request") => fail(reply, msg, 400);
export const unauthorized = (reply, msg = "Unauthorized") => fail(reply, msg, 401);
export const forbidden = (reply, msg = "Forbidden") => fail(reply, msg, 403);
export const notFound = (reply, msg = "Not found") => fail(reply, msg, 404);
export const conflict = (reply, msg = "Conflict") => fail(reply, msg, 409);
export const serverError = (reply, msg = "Server error") => fail(reply, msg, 500);
