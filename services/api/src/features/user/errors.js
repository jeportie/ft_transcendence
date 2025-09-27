// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   errors.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/27 14:34:11 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 15:08:16 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AppError } from "../utils/AppError.js";

export const UserErrors = {
    UserNotFound: (id) =>
        new AppError("USER_NOT_FOUND", "User not found", 404, `[User] No user with id=${id}`),
};

export const AdminErrors = {
    NoUsers: () =>
        new AppError("NO_USERS", "No users found", 404, "[Admin] No users in database"),
};
