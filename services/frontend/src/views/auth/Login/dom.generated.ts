// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from login.html
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

/**
 * LoginDOM — Lazy DOM accessor class
 * Each getter queries the DOM dynamically when accessed.
 */
export class LoginDOM {
    get loginCard() { return $<HTMLDivElement>("login-card"); }
    get loginForm() { return $<HTMLFormElement>("login-form"); }
    get loginUserInput() { return $<HTMLInputElement>("login-user-input"); }
    get loginPwdInput() { return $<HTMLInputElement>("login-pwd-input"); }
    get loginFormBtn() { return $<HTMLButtonElement>("login-form-btn"); }
    get loginErrorDiv() { return $<HTMLDivElement>("login-error-div"); }
    get loginGoogleBtn() { return $<HTMLButtonElement>("login-google-btn"); }
}

export interface LoginDomMap {
    loginCard: HTMLDivElement | null;
    loginForm: HTMLFormElement | null;
    loginUserInput: HTMLInputElement | null;
    loginPwdInput: HTMLInputElement | null;
    loginFormBtn: HTMLButtonElement | null;
    loginErrorDiv: HTMLDivElement | null;
    loginGoogleBtn: HTMLButtonElement | null;
}

export const DOM = new LoginDOM();
