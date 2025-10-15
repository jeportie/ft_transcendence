// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from backupLogin.html
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * BackupDOM — Lazy DOM accessor class
 * Each getter queries the DOM dynamically when accessed.
 */
export class BackupDOM {
  get backupCard() { return $<HTMLDivElement>("backup-card"); }
  get backupForm() { return $<HTMLFormElement>("backup-form"); }
  get backupOtp() { return $<HTMLElement>("backup-otp"); }
  get backupErrorDiv() { return $<HTMLDivElement>("backup-error-div"); }
  get backupPreviousBtn() { return $<HTMLButtonElement>("backup-previous-btn"); }
}

export interface BackupDomMap {
  backupCard: HTMLDivElement | null;
  backupForm: HTMLFormElement | null;
  backupOtp: HTMLElement | null;
  backupErrorDiv: HTMLDivElement | null;
  backupPreviousBtn: HTMLButtonElement | null;
}

export const DOM = new BackupDOM();
