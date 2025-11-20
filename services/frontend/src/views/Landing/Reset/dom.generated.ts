// AUTO-GENERATED FILE — DO NOT EDIT
// Aggregated from 1 HTML file(s)
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * ResetDOM — Lazy DOM accessor for all elements in this folder.
 */
export class ResetDOM {
  get resetForm() { return $<HTMLFormElement>("reset-form"); }
  get resetPwdInput() { return $<HTMLInputElement>("reset-pwd-input"); }
  get resetConfirmInput() { return $<HTMLInputElement>("reset-confirm-input"); }
  get resetBtn() { return $<HTMLButtonElement>("reset-btn"); }
  get resetErrorDiv() { return $<HTMLDivElement>("reset-error-div"); }
  get resetInfoDiv() { return $<HTMLDivElement>("reset-info-div"); }
}

export interface ResetDomMap {
  resetForm: HTMLFormElement | null;
  resetPwdInput: HTMLInputElement | null;
  resetConfirmInput: HTMLInputElement | null;
  resetBtn: HTMLButtonElement | null;
  resetErrorDiv: HTMLDivElement | null;
  resetInfoDiv: HTMLDivElement | null;
}

export const DOM = new ResetDOM();
