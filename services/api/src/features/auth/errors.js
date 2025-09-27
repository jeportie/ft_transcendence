// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   errors.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/27 14:32:10 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 14:33:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AppError } from "../../utils/AppError.js";

export const AuthErrors = {
    MissingCredentials: () =>
        new AppError("MISSING_CREDENTIALS", "Missing credentials", 400),
    UserNotFound: (user) =>
        new AppError("USER_NOT_FOUND", "Invalid credentials", 401, `[Auth] User not found: ${user}`),
    InvalidPassword: (user) =>
        new AppError("INVALID_PASSWORD", "Invalid credentials", 401, `[Auth] Bad password: ${user}`),
    MissingFields: () =>
        new AppError("MISSING_FIELDS", "Missing required fields", 400),
    UserAlreadyExists: (user) =>
        new AppError("USER_ALREADY_EXISTS", "User already exists", 400, `[Auth] Duplicate username/email: ${user}`),
    NoRefreshCookie: () =>
        new AppError("NO_REFRESH_COOKIE", "Invalid session", 401),
    InvalidRefreshCookie: () =>
        new AppError("INVALID_REFRESH_COOKIE", "Invalid session", 401),
    RefreshNotFound: () =>
        new AppError("REFRESH_NOT_FOUND", "Invalid session", 401),
    RefreshRevoked: () =>
        new AppError("REFRESH_REVOKED", "Session revoked", 401),
    RefreshExpired: () =>
        new AppError("REFRESH_EXPIRED", "Session expired", 401),
};

export const OAuthErrors = {
    UnknownProvider: (name) =>
        new AppError("OAUTH_PROVIDER_UNKNOWN", `Unsupported provider: ${name}`, 400),
    InvalidState: () =>
        new AppError("OAUTH_STATE_INVALID", "Invalid OAuth state", 400),
    ExchangeFailed: () =>
        new AppError("OAUTH_EXCHANGE_FAILED", "Failed to exchange code with provider", 502),
    UserCreateFailed: () =>
        new AppError("OAUTH_USER_CREATE_FAILED", "Failed to create user from provider profile", 500),
};
