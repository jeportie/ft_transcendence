// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from signup.html
// Created by scripts/generateDomRegistry.js

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

// Dynamic Proxy: resolves elements lazily every time they're accessed
export const DOM = new Proxy({}, {
  get(_target, key: string) {
    const id = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
    return $<HTMLElement>(id);
  }
});

// Typed accessors (runtime safe functions)
export const signupCard = () => $<HTMLDivElement>("signup-card");
export const signupForm = () => $<HTMLFormElement>("signup-form");
export const signupUserInput = () => $<HTMLInputElement>("signup-user-input");
export const signupEmailInput = () => $<HTMLInputElement>("signup-email-input");
export const signupPwdInput = () => $<HTMLInputElement>("signup-pwd-input");
export const signupConfirmInput = () => $<HTMLInputElement>("signup-confirm-input");
export const signupRecaptchaContainer = () => $<HTMLElement>("signup-recaptcha-container");
export const signupFormBtn = () => $<HTMLButtonElement>("signup-form-btn");
export const signupErrorDiv = () => $<HTMLDivElement>("signup-error-div");
export const signupGoogleBtn = () => $<HTMLButtonElement>("signup-google-btn");
