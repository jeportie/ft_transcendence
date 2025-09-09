// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   validateLoginInput.js                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/09 21:08:40 by jeportie          #+#    #+#             //
//   Updated: 2025/09/09 21:09:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default function validateLoginInput(body) {
    if (!body || typeof body !== "object") {
        return "Missing body";
    }
    const { user, pwd } = body;

    if (typeof user !== "string" || user.trim().length === 0) {
        return "Username or email required";
    }
    if (user.length > 64) {
        return "Username/email too long";
    }
    if (typeof pwd !== "string") {
        return "Password required";
    }
    if (pwd.length < 3) {
        return "Password too short";
    }
    if (pwd.length > 128) {
        return "Password too long";
    }
    return null; // no error
}
