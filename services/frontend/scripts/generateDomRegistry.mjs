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
/* 🧩 Generate DOM registry for a given HTML file                              */
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

    const outFile = path.join(folder, "dom.generated.ts");

    /* ---------------------------------------------------------------------- */
    /* ✨ Generate file content (dynamic proxy + typed getters)                */
    /* ---------------------------------------------------------------------- */
    const outContent = `// ⚙️ AUTO-GENERATED FILE — DO NOT EDIT
// Generated from ${path.basename(file)}
// Created by scripts/generateDomRegistry.js

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

// 🔥 Dynamic Proxy: resolves elements lazily every time they're accessed
export const DOM = new Proxy({}, {
  get(_target, key: string) {
    // convert camelCase key → dash-id (e.g. loginFormBtn → login-form-btn)
    const id = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
    return $<HTMLElement>(id);
  }
});

// 🧩 Typed accessors (runtime safe functions)
${entries
            .map(({ id, camel, type }) => `export const ${camel} = () => $<${type}>("${id}");`)
            .join("\n")}
`;

    fs.writeFileSync(outFile, outContent, "utf8");
    console.log(`✅ Generated ${outFile} (${entries.length} IDs)`);
}

/* -------------------------------------------------------------------------- */
/* 🚀 CLI Mode: process a single file or all views                            */
/* -------------------------------------------------------------------------- */
const args = process.argv.slice(2);
if (args.length > 0) {
    const targetFile = args[0];
    if (!fs.existsSync(targetFile)) {
        console.error(`❌ File not found: ${targetFile}`);
        process.exit(1);
    }
    generateForHTML(targetFile);
    process.exit(0);
}

const htmlFiles = findHTMLFiles(VIEWS_DIR);
if (!htmlFiles.length) {
    console.log("⚠️ No HTML files found in", VIEWS_DIR);
    process.exit(0);
}

htmlFiles.forEach(generateForHTML);
console.log(`✨ Done — ${htmlFiles.length} view(s) processed.`);
