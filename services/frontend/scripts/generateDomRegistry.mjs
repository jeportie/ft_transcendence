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

    return "HTMLElement";
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
/* 🧩 Detect if file is a <template> HTML                                     */
/* -------------------------------------------------------------------------- */
function isTemplateFile(content) {
    const clean = content
        .replace(/^\uFEFF/, "") // strip BOM
        .replace(/<!--[\s\S]*?-->/g, "") // strip comments
        .trimStart();
    return /^<template[\s>]/i.test(clean);
}

/* -------------------------------------------------------------------------- */
/* 🧩 Generate DOM registry for a folder or single file                        */
/* -------------------------------------------------------------------------- */
function generateForTarget(targetPath) {
    const isFile = targetPath.endsWith(".html");
    const folder = isFile ? path.dirname(targetPath) : targetPath;
    const htmlFiles = isFile ? [targetPath] : findHTMLFiles(folder);

    if (!htmlFiles.length) {
        console.log(`⚠️ No HTML files found in ${targetPath}`);
        return;
    }

    const normalFiles = [];
    const templateFiles = [];

    for (const file of htmlFiles) {
        const content = fs.readFileSync(file, "utf8");
        if (isTemplateFile(content)) templateFiles.push(file);
        else normalFiles.push(file);
    }

    // Collect IDs for normal HTML
    const allEntries = new Map();
    for (const file of normalFiles) {
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

    // Prepare template blocks
    const templateBlocks = templateFiles.map((file) => {
        const content = fs.readFileSync(file, "utf8");
        const ids = [...content.matchAll(idRegex)].map((m) => m[1]);
        const base = path.basename(file, ".html");
        const name = pascalCase(base);
        const importName = `${camelCase(base)}HTML`;
        const fragName = `frag${name}`;
        const methodName = `create${name}Frag`;

        const entries = ids.map((id) => ({
            id,
            camel: camelCase(id),
            type: guessType(id),
        }));

        const fields = [
            `  ${fragName}!: DocumentFragment;`,
            ...entries.map(({ camel, type }) => `  ${camel}!: ${type};`),
        ].join("\n");

        const assigns = entries
            .map(
                ({ id, camel, type }) => `    {
      const el = target.querySelector<${type}>("#${id}");
      if (!el) throw new Error("Missing element #${id} in template ${base}");
      this.${camel} = el;
    }`
            )
            .join("\n");

        const method = `
  ${methodName}() {
    this.${fragName} = cloneTemplate(${importName});
    const frag = this.${fragName}!;
${assigns.replaceAll("target.", "frag.")}
    return this;
  }`;

        return {
            importLine: `import ${importName} from "./${path.relative(folder, file).replace(/\\/g, "/")}";`,
            fields,
            method,
        };
    });

    // Prepare normal ID getters
    const normalGetters = Array.from(allEntries.values())
        .map(
            ({ id, camel, type }) => `  get ${camel}(): ${type} {
    const el = document.getElementById("${id}");
    if (!el) throw new Error("Missing element #${id} in DOM");
    return el as ${type};
  }`
        )
        .join("\n");


    const folderName = pascalCase(path.basename(folder));
    const className = `${folderName}DOM`;
    const outFile = path.join(folder, "dom.generated.ts");

    const outContent = `// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from ${isFile ? path.basename(targetPath) : folder}
// Created by scripts/generateDomRegistry.mjs

${templateBlocks.map((t) => t.importLine).join("\n")}

function cloneTemplate(html: string): DocumentFragment {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  const innerTpl = tpl.content.querySelector("template") as HTMLTemplateElement;
  return innerTpl.content.cloneNode(true) as DocumentFragment;
}

/**
 * ${className} — Unified DOM accessor for views and templates
 */
export class ${className} {
${normalGetters ? normalGetters + "\n" : ""}
${templateBlocks.map((t) => t.fields).join("\n\n")}
${templateBlocks.map((t) => t.method).join("\n")}
}

export const DOM = new ${className}();
`;

    fs.writeFileSync(outFile, outContent, "utf8");

    console.log(
        `✅ Generated ${outFile} (${allEntries.size} normal IDs, ${templateBlocks.length} template${templateBlocks.length !== 1 ? "s" : ""})`
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

    generateForTarget(target);
    process.exit(0);
}

/* -------------------------------------------------------------------------- */
/* 🏗️ Default mode: process all views in src/views                            */
/* -------------------------------------------------------------------------- */
const viewDirs = fs.existsSync(VIEWS_DIR) ? fs.readdirSync(VIEWS_DIR) : [];
for (const dir of viewDirs) {
    const full = path.join(VIEWS_DIR, dir);
    if (fs.statSync(full).isDirectory()) {
        generateForTarget(full);
    }
}

console.log("✨ Done — DOM registries generated for all views.");

