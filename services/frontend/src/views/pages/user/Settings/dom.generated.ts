// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from src/views/pages/user/Settings
// Created by scripts/generateDomRegistry.mjs

import Activate2FAHTML from "./templates/Activate2FA.html";
import ActivateMail2FAHTML from "./templates/ActivateMail2FA.html";
import ChangePwdHTML from "./templates/ChangePwd.html";
import Check2FAHTML from "./templates/Check2FA.html";
import Check2FAMailHTML from "./templates/Check2FAMail.html";
import CheckBackupHTML from "./templates/CheckBackup.html";
import DeleteAcountHTML from "./templates/DeleteAcount.html";
import DisplayBackupCodesHTML from "./templates/DisplayBackupCodes.html";
import SessionRowHTML from "./templates/SessionRow.html";
import methode2FAHTML from "./templates/methode2FA.html";

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

  fragActivateMail2FA!: DocumentFragment;
  activateMailF2aStatusTagSpan!: HTMLSpanElement;
  activateMailF2aText!: HTMLElement;
  activateMail2faOtpForm!: HTMLFormElement;
  activateMail2faOtpInput!: HTMLInputElement;
  activateMail2faOtpSubmitBtn!: HTMLButtonElement;
  activateMail2faResendBtn!: HTMLButtonElement;

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

  fragCheck2FAMail!: DocumentFragment;
  check2faMailTitle!: HTMLElement;
  check2faMailForm!: HTMLFormElement;
  check2faMailOtpInput!: HTMLInputElement;
  check2faMailFormBtn!: HTMLButtonElement;
  check2faMailGotoBackupBtn!: HTMLButtonElement;

  fragCheckBackup!: DocumentFragment;
  checkBackupTitle!: HTMLElement;
  checkBackupForm!: HTMLFormElement;
  checkBackupOtpInput!: HTMLInputElement;
  checkBackupFormBtn!: HTMLButtonElement;
  checkBackupGoto2faBtn!: HTMLButtonElement;

  fragDeleteAcount!: DocumentFragment;
  deleteAcountDiv!: HTMLDivElement;
  deleteAcountForm!: HTMLFormElement;
  deleteAcountInput!: HTMLInputElement;

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
  sessionBrowser!: HTMLElement;
  sessionIp!: HTMLElement;
  sessionLastActive!: HTMLElement;
  sessionExpiry!: HTMLElement;
  sessionAction!: HTMLElement;

  fragMethode2FA!: DocumentFragment;
  methode2faForm!: HTMLFormElement;
  methodeF2aStatusTagAppSpan!: HTMLSpanElement;
  methodeF2aStatusTagMailSpan!: HTMLSpanElement;
  methode2faFormBtn!: HTMLButtonElement;

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

  createActivateMail2FAFrag() {
    this.fragActivateMail2FA = cloneTemplate(ActivateMail2FAHTML);
    const frag = this.fragActivateMail2FA!;
    {
      const el = frag.querySelector<HTMLSpanElement>("#activate-mail-f2a-status-tag-span");
      if (!el) throw new Error("Missing element #activate-mail-f2a-status-tag-span in template ActivateMail2FA");
      this.activateMailF2aStatusTagSpan = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#activate-mail-f2a-text");
      if (!el) throw new Error("Missing element #activate-mail-f2a-text in template ActivateMail2FA");
      this.activateMailF2aText = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#activate-mail-2fa-otp-form");
      if (!el) throw new Error("Missing element #activate-mail-2fa-otp-form in template ActivateMail2FA");
      this.activateMail2faOtpForm = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#activate-mail-2fa-otp-input");
      if (!el) throw new Error("Missing element #activate-mail-2fa-otp-input in template ActivateMail2FA");
      this.activateMail2faOtpInput = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#activate-mail-2fa-otp-submit-btn");
      if (!el) throw new Error("Missing element #activate-mail-2fa-otp-submit-btn in template ActivateMail2FA");
      this.activateMail2faOtpSubmitBtn = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#activate-mail-2fa-resend-btn");
      if (!el) throw new Error("Missing element #activate-mail-2fa-resend-btn in template ActivateMail2FA");
      this.activateMail2faResendBtn = el;
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

  createCheck2FAMailFrag() {
    this.fragCheck2FAMail = cloneTemplate(Check2FAMailHTML);
    const frag = this.fragCheck2FAMail!;
    {
      const el = frag.querySelector<HTMLElement>("#check-2fa-mail-title");
      if (!el) throw new Error("Missing element #check-2fa-mail-title in template Check2FAMail");
      this.check2faMailTitle = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#check-2fa-mail-form");
      if (!el) throw new Error("Missing element #check-2fa-mail-form in template Check2FAMail");
      this.check2faMailForm = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#check-2fa-mail-otp-input");
      if (!el) throw new Error("Missing element #check-2fa-mail-otp-input in template Check2FAMail");
      this.check2faMailOtpInput = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#check-2fa-mail-form-btn");
      if (!el) throw new Error("Missing element #check-2fa-mail-form-btn in template Check2FAMail");
      this.check2faMailFormBtn = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#check-2fa-mail-goto-backup-btn");
      if (!el) throw new Error("Missing element #check-2fa-mail-goto-backup-btn in template Check2FAMail");
      this.check2faMailGotoBackupBtn = el;
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

  createDeleteAcountFrag() {
    this.fragDeleteAcount = cloneTemplate(DeleteAcountHTML);
    const frag = this.fragDeleteAcount!;
    {
      const el = frag.querySelector<HTMLDivElement>("#delete-acount-div");
      if (!el) throw new Error("Missing element #delete-acount-div in template DeleteAcount");
      this.deleteAcountDiv = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#delete-acount-form");
      if (!el) throw new Error("Missing element #delete-acount-form in template DeleteAcount");
      this.deleteAcountForm = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#delete-acount-input");
      if (!el) throw new Error("Missing element #delete-acount-input in template DeleteAcount");
      this.deleteAcountInput = el;
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
      const el = frag.querySelector<HTMLElement>("#session-browser");
      if (!el) throw new Error("Missing element #session-browser in template SessionRow");
      this.sessionBrowser = el;
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

  createMethode2FAFrag() {
    this.fragMethode2FA = cloneTemplate(methode2FAHTML);
    const frag = this.fragMethode2FA!;
    {
      const el = frag.querySelector<HTMLFormElement>("#methode-2fa-form");
      if (!el) throw new Error("Missing element #methode-2fa-form in template methode2FA");
      this.methode2faForm = el;
    }
    {
      const el = frag.querySelector<HTMLSpanElement>("#methode-f2a-status-tag-app-span");
      if (!el) throw new Error("Missing element #methode-f2a-status-tag-app-span in template methode2FA");
      this.methodeF2aStatusTagAppSpan = el;
    }
    {
      const el = frag.querySelector<HTMLSpanElement>("#methode-f2a-status-tag-mail-span");
      if (!el) throw new Error("Missing element #methode-f2a-status-tag-mail-span in template methode2FA");
      this.methodeF2aStatusTagMailSpan = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#methode-2fa-form-btn");
      if (!el) throw new Error("Missing element #methode-2fa-form-btn in template methode2FA");
      this.methode2faFormBtn = el;
    }
    return this;
  }
}

export const DOM = new SettingsDOM();
