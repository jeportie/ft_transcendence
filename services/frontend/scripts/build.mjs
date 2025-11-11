// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   build.mjs                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/11 10:10:43 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 10:10:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { build } from "esbuild";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
//  Setup
// ---------------------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Fallback defaults
const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

const env = {
    __NODE_ENV__: JSON.stringify(mode),
    __API_BASE__: JSON.stringify(process.env.API_BASE || "/api"),
    __PUBLIC_URL__: JSON.stringify(process.env.PUBLIC_URL || "/"),
    __RECAPTCHA_SITE_KEY__: JSON.stringify(process.env.RECAPTCHA_SITE_KEY || ""),
};

// ---------------------------------------------------------------------------
//  Build command
// ---------------------------------------------------------------------------
await build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    sourcemap: !isProd,
    outfile: "public/bundle.js",
    publicPath: "/",
    logLevel: "info",
    format: "esm",
    loader: {
        ".png": "file",
        ".svg": "text",
        ".html": "text",
    },
    assetNames: "assets/[name]",
    define: env,
    watch: process.argv.includes("--watch"),
});

console.log(`✅ Build complete [${mode}]`);
