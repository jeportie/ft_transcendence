// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   build.mjs                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/11 10:10:43 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 12:05:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { build, context } from "esbuild";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
//  Setup
// ---------------------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";
const watchMode = process.argv.includes("--watch");

const env = {
    __NODE_ENV__: JSON.stringify(mode),
    __API_BASE__: JSON.stringify(process.env.API_BASE || "/api"),
    __PUBLIC_URL__: JSON.stringify(process.env.PUBLIC_URL || "/"),
    __RECAPTCHA_SITE_KEY__: JSON.stringify(process.env.RECAPTCHA_SITE_KEY || ""),
};

const options = {
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
};

// ---------------------------------------------------------------------------
//  Build or Watch
// ---------------------------------------------------------------------------
if (watchMode) {
    const ctx = await context(options);
    await ctx.watch();
    console.log("👀 Watching for changes...");
} else {
    await build(options);
    console.log(`✅ Build complete [${mode}]`);
}

