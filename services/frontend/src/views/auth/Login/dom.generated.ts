// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from login.html
// Created by scripts/generateDomRegistry.js

/**
 * Utility: safe DOM getter
 */
function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

/**
 * 🔥 Lazy DOM class for Login view
 * Each getter re-queries the DOM at access time (safe for SPA re-mounts)
 */
export class LoginDOM {
    get card() { return $<HTMLDivElement>("login-card"); }
    get form() { return $<HTMLFormElement>("login-form"); }
    get userInput() { return $<HTMLInputElement>("login-user-input"); }
    get pwdInput() { return $<HTMLInputElement>("login-pwd-input"); }
    get formBtn() { return $<HTMLButtonElement>("login-form-btn"); }
    get errorDiv() { return $<HTMLDivElement>("login-error-div"); }
    get googleBtn() { return $<HTMLButtonElement>("login-google-btn"); }
}

/**
 * Export singleton instance for convenience
 */
export const DOM = new LoginDOM();

