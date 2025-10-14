// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from forgotPwd.html
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * ForgotPwdDOM — Lazy DOM accessor class
 * Each getter queries the DOM dynamically when accessed.
 */
export class ForgotPwdDOM {
  get forgotPwdCard() { return $<HTMLInputElement>("forgot-pwd-card"); }
  get forgotPwdForm() { return $<HTMLFormElement>("forgot-pwd-form"); }
  get forgotPwdEmailInput() { return $<HTMLInputElement>("forgot-pwd-email-input"); }
  get forgotPwdRecaptchaContainer() { return $<HTMLInputElement>("forgot-pwd-recaptcha-container"); }
  get forgotPwdFormBtn() { return $<HTMLButtonElement>("forgot-pwd-form-btn"); }
  get forgotPwdErrorDiv() { return $<HTMLInputElement>("forgot-pwd-error-div"); }
  get forgotPwdInfoDiv() { return $<HTMLInputElement>("forgot-pwd-info-div"); }
}

export interface ForgotPwdDomMap {
  forgotPwdCard: HTMLInputElement | null;
  forgotPwdForm: HTMLFormElement | null;
  forgotPwdEmailInput: HTMLInputElement | null;
  forgotPwdRecaptchaContainer: HTMLInputElement | null;
  forgotPwdFormBtn: HTMLButtonElement | null;
  forgotPwdErrorDiv: HTMLInputElement | null;
  forgotPwdInfoDiv: HTMLInputElement | null;
}

export const DOM = new ForgotPwdDOM();
