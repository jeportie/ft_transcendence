// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from settings.html
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

/**
 * SettingsDOM — Lazy DOM accessor class
 * Each getter queries the DOM dynamically when accessed.
 */
export class SettingsDOM {
    get settingsSection() { return $<HTMLElement>("settings-section"); }
    get settings2faBtn() { return $<HTMLButtonElement>("settings-2fa-btn"); }
    get settingsPwdBtn() { return $<HTMLButtonElement>("settings-pwd-btn"); }
    get settingsSessionsTable() { return $<HTMLTableElement>("settings-sessions-table"); }
    get settingsDeleteBtn() { return $<HTMLButtonElement>("settings-delete-btn"); }
    get settingsCardsDiv() { return $<HTMLDivElement>("settings-cards-div"); }
}

export interface SettingsDomMap {
    settingsSection: HTMLElement | null;
    settings2faBtn: HTMLButtonElement | null;
    settingsPwdBtn: HTMLButtonElement | null;
    settingsSessionsTable: HTMLTableElement | null;
    settingsDeleteBtn: HTMLButtonElement | null;
    settingsCardsDiv: HTMLDivElement | null;
}

export const DOM = new SettingsDOM();
