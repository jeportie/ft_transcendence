// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from f2aLogin.html
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

/**
 * F2ADOM — Lazy DOM accessor class
 * Each getter queries the DOM dynamically when accessed.
 */
export class F2ADOM {
    get f2aCard() { return $<HTMLDivElement>("f2a-card"); }
    get f2aForm() { return $<HTMLFormElement>("f2a-form"); }
    get f2aInputs() { return $<HTMLElement>("f2a-inputs"); }
    get f2aErrorDiv() { return $<HTMLDivElement>("f2a-error-div"); }
    get f2aBackupBtn() { return $<HTMLButtonElement>("f2a-backup-btn"); }
}

export interface F2ADomMap {
    f2aCard: HTMLDivElement | null;
    f2aForm: HTMLFormElement | null;
    f2aInputs: HTMLElement | null;
    f2aErrorDiv: HTMLDivElement | null;
    f2aBackupBtn: HTMLButtonElement | null;
}

export const DOM = new F2ADOM();
