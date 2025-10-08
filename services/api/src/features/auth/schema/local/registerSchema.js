// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   registerSchema.js                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/10 16:22:08 by jeportie          #+#    #+#             //
//   Updated: 2025/09/10 22:04:42 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const registerSchema = {
    summary: "Register new account",
    description: "Create a new user account with username, email, and password.",
    tags: ["Authentication"],
    operationId: "register",

    body: {
        type: "object",
        required: ["username", "email", "pwd"],
        properties: {
            username: {
                type: "string",
                description: "Username must be 3–32 chars, alphanumeric/underscore only",
                example: "jeportie_42"
            },
            email: {
                type: "string",
                format: "email",
                description: "Valid email address",
                example: "jeportie@42.fr"
            },
            pwd: {
                type: "string",
                minLength: 8,
                maxLength: 128,
                description: "Password (8–128 characters)",
                example: "S3curePassw0rd!"
            }
        },
    },
};
