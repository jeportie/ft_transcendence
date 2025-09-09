// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   validateRegisterInput.js                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/09 21:10:00 by jeportie          #+#    #+#             //
//   Updated: 2025/09/09 21:10:42 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export default function validateRegisterInput(body) {
    if (!body || typeof body !== "object") {
        return "Missing body";
    }
    const { username, email, pwd } = body;

    if (typeof username !== "string" || !/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
        return "Username must be 3–32 chars, alphanumeric/underscore only";
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Invalid email format";
    }

    if (typeof pwd !== "string" || pwd.length < 8) {
        return "Password must be at least 8 characters";
    }
    if (pwd.length > 128) {
        return "Password too long";
    }
    return null;
}
