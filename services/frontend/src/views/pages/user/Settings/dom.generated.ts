// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from src/views/user/Settings
// Created by scripts/generateDomRegistry.mjs

import Activate2FAHTML from "./templates/Activate2FA.html";
import ChangePwdHTML from "./templates/ChangePwd.html";
import Check2FAHTML from "./templates/Check2FA.html";
import CheckBackupHTML from "./templates/CheckBackup.html";
import DisplayBackupCodesHTML from "./templates/DisplayBackupCodes.html";
import SessionRowHTML from "./templates/SessionRow.html";

function cloneTemplate(html: string): DocumentFragment {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  const firstTpl = tpl.content.firstElementChild as HTMLTemplateElement;
  if (firstTpl && firstTpl.tagName === "TEMPLATE")
      return firstTpl.content.cloneNode(true) as DocumentFragment;
  return tpl.content.cloneNode(true) as DocumentFragment;
}

/**
 * SettingsDOM — Unified DOM accessor for views and templates
 */
export class SettingsDOM {
  get settingsSection(): HTMLElement {
    const el = document.getElementById("settings-section");
    if (!el) throw new Error("Missing element #settings-section in DOM");
    return el as HTMLElement;
  }
  get settings2faBtn(): HTMLButtonElement {
    const el = document.getElementById("settings-2fa-btn");
    if (!el) throw new Error("Missing element #settings-2fa-btn in DOM");
    return el as HTMLButtonElement;
  }
  get settingsPwdBtn(): HTMLButtonElement {
    const el = document.getElementById("settings-pwd-btn");
    if (!el) throw new Error("Missing element #settings-pwd-btn in DOM");
    return el as HTMLButtonElement;
  }
  get settingsSessionsTable(): HTMLTableElement {
    const el = document.getElementById("settings-sessions-table");
    if (!el) throw new Error("Missing element #settings-sessions-table in DOM");
    return el as HTMLTableElement;
  }
  get settingsDeleteBtn(): HTMLButtonElement {
    const el = document.getElementById("settings-delete-btn");
    if (!el) throw new Error("Missing element #settings-delete-btn in DOM");
    return el as HTMLButtonElement;
  }
  get settingsCardsDiv(): HTMLDivElement {
    const el = document.getElementById("settings-cards-div");
    if (!el) throw new Error("Missing element #settings-cards-div in DOM");
    return el as HTMLDivElement;
  }

  fragActivate2FA!: DocumentFragment;
  activateF2aStatusTagSpan!: HTMLSpanElement;
  activate2faForm!: HTMLFormElement;
  activateF2aQrImg!: HTMLImageElement;
  activate2faCopyBtn!: HTMLButtonElement;
  activate2faIconSpan!: HTMLImageElement;
  activateF2aOtpInput!: HTMLInputElement;
  activate2faFormBtn!: HTMLButtonElement;

  fragChangePwd!: DocumentFragment;
  changePwdDiv!: HTMLInputElement;
  changePwdForm!: HTMLFormElement;
  changePwdOldInput!: HTMLInputElement;
  changePwdNewInput!: HTMLInputElement;
  changePwdConfirmInput!: HTMLInputElement;

  fragCheck2FA!: DocumentFragment;
  check2faTitle!: HTMLElement;
  check2faForm!: HTMLFormElement;
  check2faOtpInput!: HTMLInputElement;
  check2faFormBtn!: HTMLButtonElement;
  check2faGotoBackupBtn!: HTMLButtonElement;

  fragCheckBackup!: DocumentFragment;
  checkBackupTitle!: HTMLElement;
  checkBackupForm!: HTMLFormElement;
  checkBackupOtpInput!: HTMLInputElement;
  checkBackupFormBtn!: HTMLButtonElement;
  checkBackupGoto2faBtn!: HTMLButtonElement;

  fragDisplayBackupCodes!: DocumentFragment;
  displayBackupStatusTagSpan!: HTMLSpanElement;
  displayBackupTableTbody!: HTMLElement;
  displayBackupDownloadBtn!: HTMLButtonElement;

  fragSessionRow!: DocumentFragment;
  sessionRow!: HTMLElement;
  sessionStatusDot!: HTMLElement;
  sessionStatusLabel!: HTMLLabelElement;
  sessionDeviceIcon!: HTMLImageElement;
  sessionDeviceAgent!: HTMLElement;
  sessionDeviceName!: HTMLElement;
  sessionIp!: HTMLElement;
  sessionLastActive!: HTMLElement;
  sessionExpiry!: HTMLElement;
  sessionAction!: HTMLElement;

  createActivate2FAFrag() {
    this.fragActivate2FA = cloneTemplate(Activate2FAHTML);
    const frag = this.fragActivate2FA!;
    {
      const el = frag.querySelector<HTMLSpanElement>("#activate-f2a-status-tag-span");
      if (!el) throw new Error("Missing element #activate-f2a-status-tag-span in template Activate2FA");
      this.activateF2aStatusTagSpan = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#activate-2fa-form");
      if (!el) throw new Error("Missing element #activate-2fa-form in template Activate2FA");
      this.activate2faForm = el;
    }
    {
      const el = frag.querySelector<HTMLImageElement>("#activate-f2a-qr-img");
      if (!el) throw new Error("Missing element #activate-f2a-qr-img in template Activate2FA");
      this.activateF2aQrImg = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#activate-2fa-copy-btn");
      if (!el) throw new Error("Missing element #activate-2fa-copy-btn in template Activate2FA");
      this.activate2faCopyBtn = el;
    }
    {
      const el = frag.querySelector<HTMLImageElement>("#activate-2fa-icon-span");
      if (!el) throw new Error("Missing element #activate-2fa-icon-span in template Activate2FA");
      this.activate2faIconSpan = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#activate-f2a-otp-input");
      if (!el) throw new Error("Missing element #activate-f2a-otp-input in template Activate2FA");
      this.activateF2aOtpInput = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#activate-2fa-form-btn");
      if (!el) throw new Error("Missing element #activate-2fa-form-btn in template Activate2FA");
      this.activate2faFormBtn = el;
    }
    return this;
  }

  createChangePwdFrag() {
    this.fragChangePwd = cloneTemplate(ChangePwdHTML);
    const frag = this.fragChangePwd!;
    {
      const el = frag.querySelector<HTMLInputElement>("#change-pwd-div");
      if (!el) throw new Error("Missing element #change-pwd-div in template ChangePwd");
      this.changePwdDiv = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#change-pwd-form");
      if (!el) throw new Error("Missing element #change-pwd-form in template ChangePwd");
      this.changePwdForm = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#change-pwd-old-input");
      if (!el) throw new Error("Missing element #change-pwd-old-input in template ChangePwd");
      this.changePwdOldInput = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#change-pwd-new-input");
      if (!el) throw new Error("Missing element #change-pwd-new-input in template ChangePwd");
      this.changePwdNewInput = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#change-pwd-confirm-input");
      if (!el) throw new Error("Missing element #change-pwd-confirm-input in template ChangePwd");
      this.changePwdConfirmInput = el;
    }
    return this;
  }

  createCheck2FAFrag() {
    this.fragCheck2FA = cloneTemplate(Check2FAHTML);
    const frag = this.fragCheck2FA!;
    {
      const el = frag.querySelector<HTMLElement>("#check-2fa-title");
      if (!el) throw new Error("Missing element #check-2fa-title in template Check2FA");
      this.check2faTitle = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#check-2fa-form");
      if (!el) throw new Error("Missing element #check-2fa-form in template Check2FA");
      this.check2faForm = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#check-2fa-otp-input");
      if (!el) throw new Error("Missing element #check-2fa-otp-input in template Check2FA");
      this.check2faOtpInput = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#check-2fa-form-btn");
      if (!el) throw new Error("Missing element #check-2fa-form-btn in template Check2FA");
      this.check2faFormBtn = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#check-2fa-goto-backup-btn");
      if (!el) throw new Error("Missing element #check-2fa-goto-backup-btn in template Check2FA");
      this.check2faGotoBackupBtn = el;
    }
    return this;
  }

  createCheckBackupFrag() {
    this.fragCheckBackup = cloneTemplate(CheckBackupHTML);
    const frag = this.fragCheckBackup!;
    {
      const el = frag.querySelector<HTMLElement>("#check-backup-title");
      if (!el) throw new Error("Missing element #check-backup-title in template CheckBackup");
      this.checkBackupTitle = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#check-backup-form");
      if (!el) throw new Error("Missing element #check-backup-form in template CheckBackup");
      this.checkBackupForm = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#check-backup-otp-input");
      if (!el) throw new Error("Missing element #check-backup-otp-input in template CheckBackup");
      this.checkBackupOtpInput = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#check-backup-form-btn");
      if (!el) throw new Error("Missing element #check-backup-form-btn in template CheckBackup");
      this.checkBackupFormBtn = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#check-backup-goto-2fa-btn");
      if (!el) throw new Error("Missing element #check-backup-goto-2fa-btn in template CheckBackup");
      this.checkBackupGoto2faBtn = el;
    }
    return this;
  }

  createDisplayBackupCodesFrag() {
    this.fragDisplayBackupCodes = cloneTemplate(DisplayBackupCodesHTML);
    const frag = this.fragDisplayBackupCodes!;
    {
      const el = frag.querySelector<HTMLSpanElement>("#display-backup-status-tag-span");
      if (!el) throw new Error("Missing element #display-backup-status-tag-span in template DisplayBackupCodes");
      this.displayBackupStatusTagSpan = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#display-backup-table-tbody");
      if (!el) throw new Error("Missing element #display-backup-table-tbody in template DisplayBackupCodes");
      this.displayBackupTableTbody = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#display-backup-download-btn");
      if (!el) throw new Error("Missing element #display-backup-download-btn in template DisplayBackupCodes");
      this.displayBackupDownloadBtn = el;
    }
    return this;
  }

  createSessionRowFrag() {
    this.fragSessionRow = cloneTemplate(SessionRowHTML);
    const frag = this.fragSessionRow!;
    {
      const el = frag.querySelector<HTMLElement>("#session-row");
      if (!el) throw new Error("Missing element #session-row in template SessionRow");
      this.sessionRow = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#session-status-dot");
      if (!el) throw new Error("Missing element #session-status-dot in template SessionRow");
      this.sessionStatusDot = el;
    }
    {
      const el = frag.querySelector<HTMLLabelElement>("#session-status-label");
      if (!el) throw new Error("Missing element #session-status-label in template SessionRow");
      this.sessionStatusLabel = el;
    }
    {
      const el = frag.querySelector<HTMLImageElement>("#session-device-icon");
      if (!el) throw new Error("Missing element #session-device-icon in template SessionRow");
      this.sessionDeviceIcon = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#session-device-agent");
      if (!el) throw new Error("Missing element #session-device-agent in template SessionRow");
      this.sessionDeviceAgent = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#session-device-name");
      if (!el) throw new Error("Missing element #session-device-name in template SessionRow");
      this.sessionDeviceName = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#session-ip");
      if (!el) throw new Error("Missing element #session-ip in template SessionRow");
      this.sessionIp = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#session-last-active");
      if (!el) throw new Error("Missing element #session-last-active in template SessionRow");
      this.sessionLastActive = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#session-expiry");
      if (!el) throw new Error("Missing element #session-expiry in template SessionRow");
      this.sessionExpiry = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#session-action");
      if (!el) throw new Error("Missing element #session-action in template SessionRow");
      this.sessionAction = el;
    }
    return this;
  }
}

export const DOM = new SettingsDOM();
