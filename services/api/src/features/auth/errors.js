// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   errors.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/27 14:32:10 by jeportie          #+#    #+#             //
//   Updated: 2025/10/07 16:02:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AppError } from "../../utils/AppError.js";

export const AuthErrors = {
    MissingCredentials: () =>
        new AppError("MISSING_CREDENTIALS", "Missing credentials", 400),
    UserNotFound: (user) =>
        new AppError("USER_NOT_FOUND", "Invalid credentials", 401,
            `[Auth] User not found: ${user}`),
    InvalidPassword: (user) =>
        new AppError("INVALID CREDENTIALS", "Invalid credentials", 401,
            `[Auth] Bad password: ${user}`),
    MissingFields: () =>
        new AppError("MISSING_FIELDS", "Missing required fields", 400),
    UserAlreadyExists: (user) =>
        new AppError("USER_ALREADY_EXISTS", "User already exists", 400,
            `[Auth] Duplicate username/email: ${user}`),
    NoRefreshCookie: () =>
        new AppError("NO_REFRESH_COOKIE", "No Refresh Cookie. Invalid session", 401),
    InvalidRefreshCookie: () =>
        new AppError("INVALID_REFRESH_COOKIE", "Invalid Refresh Cookie. Invalid session", 401),
    RefreshNotFound: () =>
        new AppError("REFRESH_NOT_FOUND", "Refresh not found. Invalid session", 401),
    RefreshRevoked: () =>
        new AppError("REFRESH_REVOKED", "Session revoked", 401),
    RefreshExpired: () =>
        new AppError("REFRESH_EXPIRED", "Session expired", 401),
    MissingActivationToken: () =>
        new AppError("MISSING_ACTIVATION_TOKEN", "Missing Activation Token", 400),
    InvalidActivationToken: () =>
        new AppError("INVALID_OR_EXPIRED_TOKEN", "Invalid or expired token", 400),
    UsedActivationToken: () =>
        new AppError("USED_ACTIVATION_TOKEN", "Activation Token already used", 400),
    MissingResetPwdToken: () =>
        new AppError("MISSING_RESET_PWD_TOKEN", "Missing Reset Password Token", 400),
    InvalidResetPwdToken: () =>
        new AppError("INVALID_RESET_TOKEN", "Invalid or expired reset token", 400),
    UsedResetPwdToken: () =>
        new AppError("USED_RESET_PWD_TOKEN", "Reset Password Token already used", 400),
    LinkExpired: () =>
        new AppError("LINK_EXPIRED", "Activation link expired", 400),
    DbFail: () =>
        new AppError("DB_FAIL", "The database failed", 401),
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

export const F2AErrors = {
    CodeGenerationFailed: () =>
        new AppError("QR_GENERATE_FAILED", "Failed to generate QR code", 500,
            "[Auth 2FA] QR code generation failed"),
    Invalid2FACode: () =>
        new AppError("INVALID_2FA_CODE", "Invalid 2FA code", 401),
    Expired2FACode: () =>
        new AppError("EXPIRED_2FA_CODE", "Expired 2FA code", 401),
    BackupGenerateFailed: () =>
        new AppError("BACKUP_GENERATE_FAILED", "Failed to generate backup codes", 500,
            "[Auth 2FA] Backup codes generation failed"),
    BackupExhausted: () =>
        new AppError("BACKUP_EXHAUSTED", "This backup code was already used", 401),
}

export const RecaptchaErrors = {
    MissingToken: () =>
        new AppError("MISSING_reCAPTCHA", "Missing reCAPTCHA token", 400),
    InvalidRecaptcha: () =>
        new AppError("INVALID_reCAPTCHA", "Invalid reCAPTCHA verification", 400),
}
