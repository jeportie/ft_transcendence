// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   env.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 17:00:57 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 17:14:25 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

declare const __NODE_ENV__: "development" | "production" | "test";
declare const __API_BASE__: string;
declare const __PUBLIC_URL__: string;
declare const __RECAPTCHA_SITE_KEY__: string;

type Mode = "development" | "production" | "test";
type RuntimeConfig = Partial<{
    API_BASE: string;
    PUBLIC_URL: string;
    FEATURE_FLAGS: Record<string, boolean>;
}>;

const RUNTIME: RuntimeConfig =
    (typeof window !== "undefined" && (window as any).__APP_CONFIG__) || {};

const BUILD = {
    NODE_ENV: __NODE_ENV__ as Mode,
    API_BASE: __API_BASE__,
    PUBLIC_URL: __PUBLIC_URL__,
} as const;

export const ENV = Object.freeze({
    MODE: BUILD.NODE_ENV,
    API_BASE: RUNTIME.API_BASE ?? BUILD.API_BASE,
    PUBLIC_URL: RUNTIME.PUBLIC_URL ?? BUILD.PUBLIC_URL,
    FEATURE_FLAGS: Object.freeze({ ...(RUNTIME.FEATURE_FLAGS || {}) }),
    RECAPTCHA_SITE_KEY: __RECAPTCHA_SITE_KEY__,
});

export const isDev = ENV.MODE === "development";
export const isProd = ENV.MODE === "production";

