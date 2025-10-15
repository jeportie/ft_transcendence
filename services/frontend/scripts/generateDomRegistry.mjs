#!/usr/bin/env node

import fs from "fs";
import path from "path";

/* -------------------------------------------------------------------------- */
/* 🔧 Config                                                                  */
/* -------------------------------------------------------------------------- */
const VIEWS_DIR = "./src/views";
const idRegex = /id="([^"]+)"/g;

/* -------------------------------------------------------------------------- */
/* 🧠 Type guessing for element inference                                      */
/* -------------------------------------------------------------------------- */
function guessType(id) {
    id = id.toLowerCase();

    if (id.endsWith("-form")) return "HTMLFormElement";
    if (id.endsWith("-btn") || id.endsWith("-button")) return "HTMLButtonElement";
    if (id.endsWith("-input") || id.includes("pwd") || id.includes("pass") || id.includes("email"))
        return "HTMLInputElement";
    if (id.endsWith("-select")) return "HTMLSelectElement";
    if (id.endsWith("-textarea")) return "HTMLTextAreaElement";
    if (id.endsWith("-img") || id.includes("icon")) return "HTMLImageElement";
    if (id.endsWith("-video")) return "HTMLVideoElement";
    if (id.endsWith("-audio")) return "HTMLAudioElement";
    if (id.endsWith("-canvas")) return "HTMLCanvasElement";
    if (id.endsWith("-list") || id.endsWith("-ul") || id.endsWith("-ol")) return "HTMLUListElement";
    if (id.endsWith("-table")) return "HTMLTableElement";
    if (id.endsWith("-link")) return "HTMLAnchorElement";
    if (id.endsWith("-div") || id.includes("card") || id.includes("box")) return "HTMLDivElement";
    if (id.endsWith("-label")) return "HTMLLabelElement";
    if (id.endsWith("-span")) return "HTMLSpanElement";

    return "HTMLElement"; // fallback
}

/* -------------------------------------------------------------------------- */
/* 🪄 Utility functions                                                       */
/* -------------------------------------------------------------------------- */
function camelCase(id) {
    return id
        .split(/[-_]+/)
        .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
        .join("");
}

function pascalCase(str) {
    const camel = camelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function findHTMLFiles(dir) {
    const results = [];
    for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) results.push(...findHTMLFiles(full));
        else if (item.endsWith(".html")) results.push(full);
    }
    return results;
}

/* -------------------------------------------------------------------------- */
/* 🧩 Generate DOM registry for a single HTML file                             */
/* -------------------------------------------------------------------------- */
function generateForHTML(file) {
    const folder = path.dirname(file);
    const content = fs.readFileSync(file, "utf8");
    const entries = [];
    let match;

    while ((match = idRegex.exec(content)) !== null) {
        const id = match[1];
        const camel = camelCase(id);
        const type = guessType(id);
        entries.push({ id, camel, type });
    }

    if (!entries.length) {
        console.log(`⚠️ No IDs found in ${file}`);
        return;
    }

    const viewName = pascalCase(path.basename(folder)); // e.g., "Login"
    const className = `${viewName}DOM`;
    const interfaceName = `${viewName}DomMap`;
    const outFile = path.join(folder, "dom.generated.ts");

    const outContent = `// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from ${path.basename(file)}
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * ${className} — Lazy DOM accessor class
 * Each getter queries the DOM dynamically when accessed.
 */
export class ${className} {
${entries.map(({ id, camel, type }) => `  get ${camel}() { return $<${type}>("${id}"); }`).join("\n")}
}

export interface ${interfaceName} {
${entries.map(({ camel, type }) => `  ${camel}: ${type} | null;`).join("\n")}
}

export const DOM = new ${className}();
`;

    fs.writeFileSync(outFile, outContent, "utf8");
    console.log(`✅ Generated ${outFile} (${entries.length} IDs → ${className})`);
}

/* -------------------------------------------------------------------------- */
/* 🧩 Generate DOM registry for a folder (merge all .html)                     */
/* -------------------------------------------------------------------------- */
function generateForFolder(folder) {
    const htmlFiles = findHTMLFiles(folder);
    const allEntries = new Map(); // avoid duplicate IDs

    for (const file of htmlFiles) {
        const content = fs.readFileSync(file, "utf8");
        let match;
        while ((match = idRegex.exec(content)) !== null) {
            const id = match[1];
            if (!allEntries.has(id)) {
                const camel = camelCase(id);
                const type = guessType(id);
                allEntries.set(id, { id, camel, type });
            }
        }
    }

    if (allEntries.size === 0) {
        console.log(`⚠️ No IDs found in ${folder}`);
        return;
    }

    const folderName = pascalCase(path.basename(folder));
    const className = `${folderName}DOM`;
    const interfaceName = `${folderName}DomMap`;
    const outFile = path.join(folder, "dom.generated.ts");

    const outContent = `// AUTO-GENERATED FILE — DO NOT EDIT
// Aggregated from ${htmlFiles.length} HTML file(s)
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * ${className} — Lazy DOM accessor for all elements in this folder.
 */
export class ${className} {
${Array.from(allEntries.values())
            .map(({ id, camel, type }) => `  get ${camel}() { return $<${type}>("${id}"); }`)
            .join("\n")}
}

export interface ${interfaceName} {
${Array.from(allEntries.values())
            .map(({ camel, type }) => `  ${camel}: ${type} | null;`)
            .join("\n")}
}

export const DOM = new ${className}();
`;

    fs.writeFileSync(outFile, outContent, "utf8");
    console.log(
        `✅ Generated ${outFile} (${allEntries.size} unique IDs from ${htmlFiles.length} HTML file${htmlFiles.length > 1 ? "s" : ""})`
    );
}

/* -------------------------------------------------------------------------- */
/* 🚀 CLI Mode: process a single file, a folder, or all views                 */
/* -------------------------------------------------------------------------- */
const args = process.argv.slice(2);
if (args.length > 0) {
    const target = args[0];
    if (!fs.existsSync(target)) {
        console.error(`❌ Path not found: ${target}`);
        process.exit(1);
    }

    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
        generateForFolder(target);
    } else if (target.endsWith(".html")) {
        generateForHTML(target);
    } else {
        console.error("❌ Please provide either an HTML file or a folder path.");
        process.exit(1);
    }
    process.exit(0);
}

/* -------------------------------------------------------------------------- */
/* 🏗️ Default mode: process all views in src/views                            */
/* -------------------------------------------------------------------------- */
const htmlFiles = findHTMLFiles(VIEWS_DIR);
if (!htmlFiles.length) {
    console.log("⚠️ No HTML files found in", VIEWS_DIR);
    process.exit(0);
}

htmlFiles.forEach(generateForHTML);
console.log(`✨ Done — ${htmlFiles.length} view(s) processed.`);
