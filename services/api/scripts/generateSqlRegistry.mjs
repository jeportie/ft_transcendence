// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   generateSqlRegistry.mjs                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/17 14:55:12 by jeportie          #+#    #+#             //
//   Updated: 2025/11/17 18:07:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const FEATURES_ROOT = path.resolve(__dirname, "../src/features");
const APP_JS = path.resolve(__dirname, "../src/app.js");

// ------------------------------------------------------------
// Clean SQL
// ------------------------------------------------------------
function cleanSql(sql) {
    return sql
        .replace(/^--.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//gm, "")
        .replace(/\r?\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// ------------------------------------------------------------
// Find all sql folders
// ------------------------------------------------------------
function scanRecursive(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let result = {};

    for (const entry of entries) {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === "sql") {
                return readSqlFolder(full);
            }
            const nested = scanRecursive(full);
            if (Object.keys(nested).length > 0) {
                result[entry.name] = nested;
            }
        }
    }
    return result;
}

function readSqlFolder(dir) {
    let out = {};
    for (const file of fs.readdirSync(dir)) {
        if (file.endsWith(".sql")) {
            const name = file.replace(".sql", "");
            const raw = fs.readFileSync(path.join(dir, file), "utf8");
            out[name] = cleanSql(raw);
        }
    }
    return out;
}

// ------------------------------------------------------------
// Detect route handlers inside a feature
// ------------------------------------------------------------
function detectRouteHandlers(featureName) {
    const routes = [];

    const featurePath = path.join(FEATURES_ROOT, featureName);
    const folders = fs.readdirSync(featurePath, { withFileTypes: true });

    for (const folder of folders) {
        if (!folder.isDirectory()) continue;

        const handlerFile = path.join(featurePath, folder.name, "handler.js");

        if (fs.existsSync(handlerFile)) {
            routes.push({
                importName: `${folder.name}Routes`,
                importPath: `./${folder.name}/handler.js`
            });
        }
    }
    return routes;
}

// ------------------------------------------------------------
// NEW: Update or create plugin.js
// ------------------------------------------------------------
function updatePluginFile(featureName, routes) {
    const featurePath = path.join(FEATURES_ROOT, featureName);
    const pluginFile = path.join(featurePath, "plugin.js");

    const importRoutesBlock = routes
        .map(r => `import { ${r.importName} } from "${r.importPath}";`)
        .join("\n");

    const registerRoutesBlock = routes
        .map(r => `        await scoped.register(${r.importName});`)
        .join("\n");

    const INITIAL_PLUGIN_TEMPLATE = `// AUTO-GENERATED — YOU MAY EDIT
import fp from "fastify-plugin";
import { sql } from "./sqlRegistry.generated.js";

// AUTO-GENERATED ROUTES START
${importRoutesBlock}
// AUTO-GENERATED ROUTES END

export default fp(async function ${featureName}Plugin(parent) {
    await parent.register(async function(scoped) {
        scoped.decorate("sql", sql);

        // AUTO-REGISTER ROUTES START
${registerRoutesBlock}
        // AUTO-REGISTER ROUTES END

    }, { prefix: "/api/${featureName}" });
});
`;

    // If plugin does not exist → create from scratch
    if (!fs.existsSync(pluginFile)) {
        fs.writeFileSync(pluginFile, INITIAL_PLUGIN_TEMPLATE);
        console.log(`[Plugin]   ✔ Created ${featureName}/plugin.js`);
        return;
    }

    // Otherwise → update ONLY generated blocks
    let content = fs.readFileSync(pluginFile, "utf8");

    // Update import block
    const importRegex = /\/\/ AUTO-GENERATED ROUTES START[\s\S]*?\/\/ AUTO-GENERATED ROUTES END/m;
    content = content.replace(
        importRegex,
        `// AUTO-GENERATED ROUTES START\n${importRoutesBlock}\n// AUTO-GENERATED ROUTES END`
    );

    // Update registration block
    const regRegex = /\/\/ AUTO-REGISTER ROUTES START[\s\S]*?\/\/ AUTO-REGISTER ROUTES END/m;
    content = content.replace(
        regRegex,
        `// AUTO-REGISTER ROUTES START\n${registerRoutesBlock}\n        // AUTO-REGISTER ROUTES END`
    );

    fs.writeFileSync(pluginFile, content);
    console.log(`[Plugin]   ✔ Updated ${featureName}/plugin.js`);
}

// ------------------------------------------------------------
// Update app.js import and registration blocks
// ------------------------------------------------------------
function updateAppJs(featureNames) {
    let app = fs.readFileSync(APP_JS, "utf8");

    // Update import block
    const importBlock =
`// AUTO-GENERATED FEATURES START
${featureNames.map(f => `import ${f}Plugin from "./features/${f}/plugin.js";`).join("\n")}
// AUTO-GENERATED FEATURES END`;

    app = app.replace(
        /\/\/ AUTO-GENERATED FEATURES START[\s\S]*?\/\/ AUTO-GENERATED FEATURES END/m,
        importBlock
    );

    // Update registration block
    const registerBlock =
`// AUTO-REGISTERED FEATURES START
${featureNames.map(f => `    await fastify.register(${f}Plugin);`).join("\n")}
    // AUTO-REGISTERED FEATURES END`;

    app = app.replace(
        /\/\/ AUTO-REGISTERED FEATURES START[\s\S]*?\/\/ AUTO-REGISTERED FEATURES END/m,
        registerBlock
    );

    fs.writeFileSync(APP_JS, app);
    console.log(`[App.js]   ✔ Updated imports and registrations`);
}


// ------------------------------------------------------------
// MAIN
// ------------------------------------------------------------
const featureNames = fs.readdirSync(FEATURES_ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

for (const feature of featureNames) {
    const sql = scanRecursive(path.join(FEATURES_ROOT, feature));

    fs.writeFileSync(
        path.join(FEATURES_ROOT, feature, "sqlRegistry.generated.js"),
        `// AUTO-GENERATED — DO NOT EDIT\nexport const sql = ${JSON.stringify(sql, null, 2)};\n`
    );
    console.log(`[SQL]      ✔ Generated SQL registry for "${feature}"`);

    const routes = detectRouteHandlers(feature);
    updatePluginFile(feature, routes);
}

updateAppJs(featureNames);

console.log("\n✨ All SQL registries, plugin.js files, and app.js have been updated.\n");
