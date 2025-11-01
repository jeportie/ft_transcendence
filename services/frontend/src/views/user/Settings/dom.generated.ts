// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from src/views/user/Settings
// Created by scripts/generateDomRegistry.mjs

import BackupFormHTML from "./templates/BackupForm.html";
import ChangePwdHTML from "./templates/ChangePwd.html";
import F2aHTML from "./templates/F2a.html";
import OtpFormHTML from "./templates/OtpForm.html";

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

  fragBackupForm!: DocumentFragment;
  pwdBackupWrap!: HTMLInputElement;
  pwdBackOtpForm!: HTMLFormElement;
  pwdBackupCode!: HTMLInputElement;
  pwdConfirmBackup!: HTMLInputElement;

  fragChangePwd!: DocumentFragment;
  pwdNormalDiv!: HTMLInputElement;
  pwdHint!: HTMLInputElement;
  pwdForm!: HTMLFormElement;
  oldPwd!: HTMLInputElement;
  newPwd!: HTMLInputElement;
  confirmPwd!: HTMLInputElement;

  fragF2a!: DocumentFragment;
  tpl2faCard!: HTMLDivElement;
  f2aStatusTag!: HTMLElement;
  f2aEnableWrap!: HTMLElement;
  f2aQr!: HTMLElement;
  f2aEnableCode!: HTMLElement;
  f2aBackupWrap!: HTMLElement;
  f2aBackupTable!: HTMLTableElement;
  f2aBackupDownload!: HTMLElement;
  f2aDisableWrap!: HTMLElement;
  f2aDisableCode!: HTMLElement;
  f2aConfirmDisable!: HTMLElement;
  f2aBackupCode!: HTMLElement;

  fragOtpForm!: DocumentFragment;
  pwdDisableWrap!: HTMLInputElement;
  pwdOtpForm!: HTMLFormElement;
  pwdDisableCode!: HTMLInputElement;
  pwdConfirmDisable!: HTMLInputElement;
  pwdBackupBtn!: HTMLButtonElement;

  createBackupFormFrag() {
    this.fragBackupForm = cloneTemplate(BackupFormHTML);
    const frag = this.fragBackupForm!;
    {
      const el = frag.querySelector<HTMLInputElement>("#pwd-backup-wrap");
      if (!el) throw new Error("Missing element #pwd-backup-wrap in template BackupForm");
      this.pwdBackupWrap = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#pwd-back-otp-form");
      if (!el) throw new Error("Missing element #pwd-back-otp-form in template BackupForm");
      this.pwdBackOtpForm = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#pwd-backup-code");
      if (!el) throw new Error("Missing element #pwd-backup-code in template BackupForm");
      this.pwdBackupCode = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#pwd-confirm-backup");
      if (!el) throw new Error("Missing element #pwd-confirm-backup in template BackupForm");
      this.pwdConfirmBackup = el;
    }
    return this;
  }

  createChangePwdFrag() {
    this.fragChangePwd = cloneTemplate(ChangePwdHTML);
    const frag = this.fragChangePwd!;
    {
      const el = frag.querySelector<HTMLInputElement>("#pwd-normal-div");
      if (!el) throw new Error("Missing element #pwd-normal-div in template ChangePwd");
      this.pwdNormalDiv = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#pwd-hint");
      if (!el) throw new Error("Missing element #pwd-hint in template ChangePwd");
      this.pwdHint = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#pwd-form");
      if (!el) throw new Error("Missing element #pwd-form in template ChangePwd");
      this.pwdForm = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#old-pwd");
      if (!el) throw new Error("Missing element #old-pwd in template ChangePwd");
      this.oldPwd = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#new-pwd");
      if (!el) throw new Error("Missing element #new-pwd in template ChangePwd");
      this.newPwd = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#confirm-pwd");
      if (!el) throw new Error("Missing element #confirm-pwd in template ChangePwd");
      this.confirmPwd = el;
    }
    return this;
  }

  createF2aFrag() {
    this.fragF2a = cloneTemplate(F2aHTML);
    const frag = this.fragF2a!;
    {
      const el = frag.querySelector<HTMLDivElement>("#tpl-2fa-card");
      if (!el) throw new Error("Missing element #tpl-2fa-card in template F2a");
      this.tpl2faCard = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-status-tag");
      if (!el) throw new Error("Missing element #f2a-status-tag in template F2a");
      this.f2aStatusTag = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-enable-wrap");
      if (!el) throw new Error("Missing element #f2a-enable-wrap in template F2a");
      this.f2aEnableWrap = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-qr");
      if (!el) throw new Error("Missing element #f2a-qr in template F2a");
      this.f2aQr = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-enable-code");
      if (!el) throw new Error("Missing element #f2a-enable-code in template F2a");
      this.f2aEnableCode = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-backup-wrap");
      if (!el) throw new Error("Missing element #f2a-backup-wrap in template F2a");
      this.f2aBackupWrap = el;
    }
    {
      const el = frag.querySelector<HTMLTableElement>("#f2a-backup-table");
      if (!el) throw new Error("Missing element #f2a-backup-table in template F2a");
      this.f2aBackupTable = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-backup-download");
      if (!el) throw new Error("Missing element #f2a-backup-download in template F2a");
      this.f2aBackupDownload = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-disable-wrap");
      if (!el) throw new Error("Missing element #f2a-disable-wrap in template F2a");
      this.f2aDisableWrap = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-disable-code");
      if (!el) throw new Error("Missing element #f2a-disable-code in template F2a");
      this.f2aDisableCode = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-confirm-disable");
      if (!el) throw new Error("Missing element #f2a-confirm-disable in template F2a");
      this.f2aConfirmDisable = el;
    }
    {
      const el = frag.querySelector<HTMLElement>("#f2a-backup-code");
      if (!el) throw new Error("Missing element #f2a-backup-code in template F2a");
      this.f2aBackupCode = el;
    }
    return this;
  }

  createOtpFormFrag() {
    this.fragOtpForm = cloneTemplate(OtpFormHTML);
    const frag = this.fragOtpForm!;
    {
      const el = frag.querySelector<HTMLInputElement>("#pwd-disable-wrap");
      if (!el) throw new Error("Missing element #pwd-disable-wrap in template OtpForm");
      this.pwdDisableWrap = el;
    }
    {
      const el = frag.querySelector<HTMLFormElement>("#pwd-otp-form");
      if (!el) throw new Error("Missing element #pwd-otp-form in template OtpForm");
      this.pwdOtpForm = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#pwd-disable-code");
      if (!el) throw new Error("Missing element #pwd-disable-code in template OtpForm");
      this.pwdDisableCode = el;
    }
    {
      const el = frag.querySelector<HTMLInputElement>("#pwd-confirm-disable");
      if (!el) throw new Error("Missing element #pwd-confirm-disable in template OtpForm");
      this.pwdConfirmDisable = el;
    }
    {
      const el = frag.querySelector<HTMLButtonElement>("#pwd-backup-btn");
      if (!el) throw new Error("Missing element #pwd-backup-btn in template OtpForm");
      this.pwdBackupBtn = el;
    }
    return this;
  }
}

export const DOM = new SettingsDOM();
