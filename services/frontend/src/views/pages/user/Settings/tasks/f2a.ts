// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   f2a.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/30 14:28:44 by jeportie          #+#    #+#             //
//   Updated: 2025/11/18 18:47:17 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "@system";
import { UserState } from "@system/core/user/UserState.js";
import { Modal } from "@components/abstract/Modal.js";
import * as STYLES from "@components/themes/index.js";
import { logger } from "@system/core/logger.js";

let off: Array<() => void> = [];
const styles = STYLES.liquidGlass;

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
        const form = DOM.methode2faForm;
        const appStatus = DOM.methodeF2aStatusTagAppSpan;
        const mailStatus = DOM.methodeF2aStatusTagMailSpan;

        const modal = new Modal({ styles });
        modal.render(DOM.fragMethode2FA);

        await UserState.refresh();
        user = await UserState.get();

        if (user?.f2a_enabled) {
            setStatus(appStatus, true);
        } else {
            setStatus(appStatus, false);
        }

        if (user?.f2a_email_enabled) {
            setStatus(mailStatus, true);
        } else {
            setStatus(mailStatus, false);
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const data = new FormData(form);
            const method = data.get("auth-method");

            if (method === "app") {
                if (user?.f2a_enabled)
                    openOtpForm();
                else
                    activate2FA();
            }
            if (method === "mail")
                activateMail2FA();
            modal.remove();
        })
    }

    async function activateMail2FA() {
        DOM.createActivateMail2FAFrag();
        const status = DOM.activateMailF2aStatusTagSpan;
        const otpForm = DOM.activateMail2faOtpForm;
        const otpInput = DOM.activateMail2faOtpInput;
        const text = DOM.activateMailF2aText;
        const resend = DOM.activateMail2faResendBtn;

        const email = user?.email;

        const modal = new Modal({ styles });
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

        const modal = new Modal({ styles });
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

        const modal = new Modal({ styles });
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
        const modal = new Modal({ styles });
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
        const modal = new Modal({ styles });
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
        const modal = new Modal({ styles });
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

    // const onClick = async () => {
    //     const user = await UserState.get(true);
    //     if (!user)
    //         return alert("Failed to fetch user info.");
    //     if (user.f2a_enabled) {
    //         openOtpForm();
    //     } else if (user.f2a_email_enabled) {
    //         openOtpMailForm();
    //     } else {
    //         openF2aMethode();
    //     }
    // };

    btn.addEventListener("click", openF2aMethode);
    off.push(() => btn.removeEventListener("click", openF2aMethode));
}

export function teardownF2a() {
    off.forEach((off) => off());
    off = [];
}
