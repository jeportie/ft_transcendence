// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   endpoints.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 17:04:58 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 18:42:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Central, typed registry of your backend endpoints.
 * All paths here are *relative* to ENV.API_BASE (e.g., "/system/health").
 */
export type OAuthProvider = "google" | "github" | string;

export const API_ROUTES = {
    system: {
        health: "/system/health", // GET
    },

    auth: {
        // /api/auth/*
        local: {
            login: "/auth/login",           // POST
            register: "/auth/register",     // POST
            refresh: "/auth/refresh",       // POST
            logout: "/auth/logout",         // POST
            forgotPwd: "/auth/forgot-pwd",  // POST
            resetPwd: "/auth/reset-pwd",    // POST
            resendLink: "/auth/resend-link",// POST
            activate: (token: string) => `/auth/activate/${encodeURIComponent(token)}`, // GET
        },

        f2a: {
            enable: "/auth/enable",             // POST (auth)
            verifyTotp: "/auth/verify-totp",    // POST (auth)
            loginTotp: "/auth/login-totp",      // POST
            verifyBackup: "/auth/verify-backup",// POST
            disable: "/auth/disable",           // POST (auth)
            backup: "/auth/backup",             // POST (auth) generate codes
            check: "/auth/check-2fa",           // POST
        },

        oauth: {
            // GET /api/auth/:provider/start
            start: (provider: OAuthProvider) => `/auth/${encodeURIComponent(provider)}/start`,
            // GET /api/auth/:provider/callback
            callback: (provider: OAuthProvider) => `/auth/${encodeURIComponent(provider)}/callback`,
        },

        sessions: {
            get: "/auth/sessions",              // GET (auth)
            revoke: "/auth/sessions/revoke",    // POST (auth)
        },
    },

    user: {
        me: "/user/me",                       // GET (auth)
        modifyPwd: "/user/modify-pwd",        // POST (auth)
    },

    admin: {
        users: "/admin/users",                // GET (role=admin)
    },
} as const;

// Convenience type – infer literal string types from the structure above
export type ApiRoutes = typeof API_ROUTES;
