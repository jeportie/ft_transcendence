// ⚙️ AUTO-GENERATED FILE — DO NOT EDIT
// Generated from login.html
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
export const loginCard = () => $<HTMLDivElement>("login-card");
export const loginForm = () => $<HTMLFormElement>("login-form");
export const loginUserInput = () => $<HTMLInputElement>("login-user-input");
export const loginPwdInput = () => $<HTMLInputElement>("login-pwd-input");
export const loginFormBtn = () => $<HTMLButtonElement>("login-form-btn");
export const loginErrorDiv = () => $<HTMLDivElement>("login-error-div");
export const googleBtn = () => $<HTMLButtonElement>("google-btn");
