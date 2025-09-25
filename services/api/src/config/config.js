// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   config.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 14:26:18 by jeportie          #+#    #+#             //
//   Updated: 2025/09/04 23:00:22 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { asNumber, asBool, asString, requireString } from "./envParser.js";
import * as dotenv from "dotenv";

const result = dotenv.config({ path: "../.env.local" });

const NODE_ENV = asString(process.env.NODE_ENV, "development");
const IS_PROD = NODE_ENV === "production";

const config = {
    NODE_ENV,
    HOST: asString(process.env.HOST, "0.0.0.0"),
    PORT: asNumber(process.env.PORT, 5000),

    // Security
    JWT_SECRET: asString(process.env.JWT_SECRET, ""),
    COOKIE_SECURE: asBool(process.env.COOKIE_SECURE, IS_PROD),

    // CORS
    CORS_ORIGIN: asString(process.env.CORS_ORIGIN, "http://localhost:8000"),

    // Tokens
    ACCESS_TOKEN_TTL: asString(process.env.ACCESS_TOKEN_TTL, "1m"),
    REFRESH_TOKEN_TTL_DAYS: asNumber(process.env.REFRESH_TOKEN_TTL_DAYS, 7),

    // Cookies
    COOKIE_NAME_RT: asString(process.env.COOKIE_NAME_RT, "rt"),
    COOKIE_SAMESITE: asString(process.env.COOKIE_SAMESITE, "lax"), // "lax" | "none" | "strict"
    COOKIE_DOMAIN: asString(process.env.COOKIE_DOMAIN, ""),         // optional

    // Google OAuth
    GOOGLE_CLIENT_ID: requireString(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: requireString(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET"),
    GOOGLE_REDIRECT_URI: requireString(process.env.GOOGLE_REDIRECT_URI, "GOOGLE_REDIRECT_URI"),
};

const errors = [];

if (!config.JWT_SECRET)
    errors.push("Missing JWT_SECRET");
if (IS_PROD && !config.CORS_ORIGIN)
    errors.push("Missing CORS_ORIGIN in production");

if (errors.length) {
    const msg = `[config] Invalid configuration:\n- ${errors.join("\n- ")}\n`;
    throw new Error(msg);
}

export default config;
