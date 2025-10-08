// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   loginSchema.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 17:42:30 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 15:12:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const loginSchema = {
    summary: "Login (issue access & refresh, or request 2FA)",
    description:
        "Authenticate with username/email + password. If 2FA is enabled, \
        the server responds with `f2a_required` instead of issuing tokens. \
        If the account has not been activated, the server responds with \
        'activation_required' instead of issuing tokens.",
    tags: ["Authentication"],
    operationId: "login",

    body: {
        type: "object",
        required: ["user", "pwd"],
        properties: {
            user: {
                type: "string",
                minLength: 3,
                maxLength: 64,
                description: "Username or email of the account",
                example: "jeportie",
            },
            pwd: {
                type: "string",
                minLength: 3,
                maxLength: 128,
                description: "Password (3–128 characters)",
                example: "secret123",
            },
        },
        additionalProperties: false,
    },
};
