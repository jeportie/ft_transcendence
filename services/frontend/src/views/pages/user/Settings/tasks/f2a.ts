// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   f2a.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/30 14:28:44 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 19:27:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "@system";
import { UserState } from "@system/core/user/UserState.js";
import { Modal } from "@components/abstract/Modal.js";
import * as STYLES from "@components/themes/index.js";
import { logger } from "@system/core/logger.js";

let off: Array<() => void> = [];
const glass = STYLES.liquidGlass;
const panel = STYLES.liquidPanel;

// API routes
const enable = API.routes.auth.f2a.enable;
const disable = API.routes.auth.f2a.disable;
const verifTotp = API.routes.auth.f2a.verifyTotp;
const verifBackup = API.routes.auth.f2a.verifyBackup;
const generateBackup = API.routes.auth.f2a.backup;
const enableEmail = API.routes.auth.f2a.enableEmail;
const verifyEmail = API.routes.auth.f2a.verifyEmail;

function setStatus(el: HTMLElement, isEnabled: boolean) {
    if (isEnabled) {
        el.textContent = "Enabled";
        el.className = "app-status-tag-enabled";
    } else {
        el.textContent = "Disabled";
        el.className = "app-status-tag-disabled";
    }
};

// @ts-expect-error
export async function setupF2a({ ASSETS }) {
    const btn = DOM.settings2faBtn;
    if (!btn)
        return;

    let user = await UserState.get();

    async function openF2aMethode() {
        DOM.createMethode2FAFrag();
        const frag = DOM.fragMethode2FA;
        const totpStatus = DOM.methode2faTotpStatusSpan;
        const totpBtn = DOM.methode2faTotpActionBtn;
        const emailStatus = DOM.methode2faEmailStatusSpan;
        const emailBtn = DOM.methode2faEmailActionBtn;
        const smsStatus = DOM.methode2faSmsStatusSpan;
        const backupStatus = DOM.methode2faBackupStatusSpan;
        const backupBtn = DOM.methode2faBackupActionBtn;

        const modal = new Modal({ styles: panel });
        modal.render(frag);

        await UserState.refresh();
        const user = await UserState.get();

        const isTotp = user?.mfa?.totp === true;
        setStatus(totpStatus, isTotp);
        totpBtn.textContent = isTotp ? "Disable" : "Enable";

        const isEmail = user?.mfa?.email === true;
        setStatus(emailStatus, isEmail);
        emailBtn.textContent = isEmail ? "Disable" : "Enable";

        // ====== SMS (always disabled for now) ======
        setStatus(smsStatus, false);

        // ====== BACKUP STATUS ======
        const hasBackup =
            Array.isArray(user?.mfa?.backup) &&
            user.mfa.backup.length > 0;

        setStatus(backupStatus, hasBackup);
        backupBtn.textContent = hasBackup ? "View" : "Generate";

        totpBtn.addEventListener("click", async () => {
            activate2FA();
            modal.remove();
        });

        emailBtn.addEventListener("click", async () => {
            activateMail2FA();
            modal.remove();
        });

        backupBtn.addEventListener("click", async () => {
            diplayBackupCodes();
            modal.remove();
        });
    }

    async function activateMail2FA() {
        DOM.createActivateMail2FAFrag();
        const status = DOM.activateMailF2aStatusTagSpan;
        const otpForm = DOM.activateMail2faOtpForm;
        const otpInput = DOM.activateMail2faOtpInput;
        const text = DOM.activateMailF2aText;
        const resend = DOM.activateMail2faResendBtn;

        const email = user?.email;

        const modal = new Modal({ styles: glass });
        modal.render(DOM.fragActivateMail2FA);
        setStatus(status, false);
        text.innerText = `Enter the 6-digit code we sent to ${email}.`

        await UserState.refresh();
        user = await UserState.get();

        const { data, error } = await API.Post(enableEmail, { email });

        if (error || !data?.success)
            return alert(error.message);

        resend.addEventListener("click", async () => {
            const { data, error } = await API.Post(enableEmail, { email });
            alert("Code resend ! Please check your emails.");

            if (error || !data?.success)
                return alert(error.message);
        })

        otpForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const code = otpInput.value;
            if (!code) {
                alert("Please enter your authentication code.");
                return;
            }

            const { data, error } = await API.Post(verifyEmail, { code });
            if (error || !data?.success)
                return alert(error.message);

            setStatus(status, true);
            btn.textContent = "Disable";
            modal.remove();
        });
    }

    async function activate2FA() {
        DOM.createActivate2FAFrag()
        const form = DOM.activate2faForm;
        const statusTag = DOM.activateF2aStatusTagSpan;
        const qrImg = DOM.activateF2aQrImg;
        const otpInput = DOM.activateF2aOtpInput;

        const modal = new Modal({ styles: glass });
        modal.render(DOM.fragActivate2FA);
        setStatus(statusTag, false);

        const { data, error } = await API.Post<{ qr: any, otpauth: any }>(enable);
        if (error)
            return alert("Failed to start 2FA setup");
        qrImg.src = data?.qr;
        DOM.activate2faIconSpan.innerHTML = `${ASSETS.copyIcon}`;
        otpInput.focus();

        DOM.activate2faCopyBtn.onclick = async () => {
            const text = data?.otpauth;
            try {
                await navigator.clipboard.writeText(text);
                DOM.activate2faCopyBtn.textContent = "Copied!";
            } catch (err) {
                DOM.activate2faCopyBtn.textContent = "Failed to copy";
            }
        };

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const code = otpInput.value;

            if (!code || code.length < 6)
                return;

            const { data, error } = await API.Post<{ success: boolean }>(verifTotp, { code });

            if (error || !data?.success)
                return alert("Invalid code.");

            setStatus(statusTag, true);
            modal.remove();
            diplayBackupCodes();
        });
    }

    async function diplayBackupCodes() {
        await UserState.refresh();
        user = await UserState.get();
        logger.withPrefix("[DisplayCodes]: ").debug(user);
        DOM.createDisplayBackupCodesFrag();
        const backupTbody = DOM.displayBackupTableTbody;

        const modal = new Modal({ styles: glass });
        modal.render(DOM.fragDisplayBackupCodes);
        setStatus(DOM.displayBackupStatusTagSpan, true);

        // Fetch backup codes
        const res = await API.Post<{ codes: string[] }>(generateBackup);
        const codes: string[] = res.data?.codes ?? [];
        if (!codes.length)
            return;
        backupTbody.innerHTML = codes
            .map(
                (c, i) => `
          <tr class="border-b border-neutral-800/60">
            <td class="px-3 py-1 text-neutral-300">${i + 1}</td>
            <td class="px-3 py-1 font-mono tracking-wide text-neutral-100">${c}</td>
          </tr>`
            )
            .join("");

        DOM.displayBackupDownloadBtn.onclick = () => {
            const text = [
                "Your 2FA Backup Codes",
                "======================",
                "",
                ...codes.map((c, i) => `${i + 1}. ${c}`),
                "",
                "⚠️ Keep this file private and stored securely."
            ].join("\n");
            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = Object.assign(document.createElement("a"), {
                href: url,
                download: "backup-codes.txt"
            });
            a.click();
            URL.revokeObjectURL(url);
            modal.remove();
        };

    }

    function openOtpForm() {
        DOM.createCheck2FAFrag();
        const modal = new Modal({ styles: glass });
        modal.render(DOM.fragCheck2FA);
        DOM.check2faTitle.innerText = "Enter your current authenticator code to disable two-factor authentication."

        DOM.check2faGotoBackupBtn.addEventListener("click", () => {
            modal.remove();
            openBackupForm();
        });

        DOM.check2faForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = DOM.check2faOtpInput.value;
            const { data, error } = await API.Post<{ success: boolean }>(verifTotp, { code });
            if (error || !data?.success)
                return alert("Invalid code, cannot disable.");

            const res = await API.Post(disable);
            if (res.error)
                return alert(res.error.message);
            modal.remove();
        });
    }

    function openBackupForm() {
        DOM.createCheckBackupFrag();
        const modal = new Modal({ styles: glass });
        modal.render(DOM.fragCheckBackup);
        DOM.checkBackupTitle.innerText = "Enter your current backup code to disable two-factor authentication."

        DOM.checkBackupGoto2faBtn.addEventListener("click", () => {
            modal.remove();
            openOtpForm();
        });

        DOM.checkBackupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = DOM.checkBackupOtpInput.value;
            const { data, error } = await API.Post<{ success: boolean }>(verifBackup, { code });
            if (error || !data?.success)
                return alert("Invalid code, cannot disable.");

            const res = await API.Post(disable);
            if (res.error)
                return alert(res.error.message);
            modal.remove();
        });
    }

    function openOtpMailForm() {
        DOM.createCheck2FAMailFrag();
        const modal = new Modal({ styles: glass });
        modal.render(DOM.fragCheck2FAMail);
        DOM.check2faMailTitle.innerText = "Enter your current email code to disable two-factor authentication."

        DOM.check2faMailGotoBackupBtn.addEventListener("click", () => {
            modal.remove();
            // Need to find a way to link all 2fa together
        });

        DOM.check2faMailForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = DOM.check2faMailOtpInput.value;
            const { data, error } = await API.Post(verifyEmail, { code });
            if (error || !data?.success)
                return alert("Invalid code, cannot disable.");
            modal.remove();
            activate2FA();
        });
    }

    btn.addEventListener("click", openF2aMethode);
    off.push(() => btn.removeEventListener("click", openF2aMethode));
}

export function teardownF2a() {
    off.forEach((off) => off());
    off = [];
}
