// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from signup.html
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * SignupDOM — Lazy DOM accessor class
 * Each getter queries the DOM dynamically when accessed.
 */
export class SignupDOM {
  get signupCard() { return $<HTMLDivElement>("signup-card"); }
  get signupForm() { return $<HTMLFormElement>("signup-form"); }
  get signupUserInput() { return $<HTMLInputElement>("signup-user-input"); }
  get signupEmailInput() { return $<HTMLInputElement>("signup-email-input"); }
  get signupPwdInput() { return $<HTMLInputElement>("signup-pwd-input"); }
  get signupConfirmInput() { return $<HTMLInputElement>("signup-confirm-input"); }
  get signupRecaptchaContainer() { return $<HTMLElement>("signup-recaptcha-container"); }
  get signupFormBtn() { return $<HTMLButtonElement>("signup-form-btn"); }
  get signupErrorDiv() { return $<HTMLDivElement>("signup-error-div"); }
  get signupGoogleBtn() { return $<HTMLButtonElement>("signup-google-btn"); }
}

export interface SignupDomMap {
  signupCard: HTMLDivElement | null;
  signupForm: HTMLFormElement | null;
  signupUserInput: HTMLInputElement | null;
  signupEmailInput: HTMLInputElement | null;
  signupPwdInput: HTMLInputElement | null;
  signupConfirmInput: HTMLInputElement | null;
  signupRecaptchaContainer: HTMLElement | null;
  signupFormBtn: HTMLButtonElement | null;
  signupErrorDiv: HTMLDivElement | null;
  signupGoogleBtn: HTMLButtonElement | null;
}

export const DOM = new SignupDOM();
