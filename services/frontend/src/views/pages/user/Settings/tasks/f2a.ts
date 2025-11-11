// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   f2a.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/30 14:28:44 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 14:12:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "@system";
import { UserState } from "@system/core/user/UserState.js";
import { Modal } from "@components/abstract/Modal.js";
import * as STYLES from "@components/themes/index.js";

let off: Array<() => void> = [];
const styles = STYLES.liquidGlass;

// API routes
const enable = API.routes.auth.f2a.enable;
const verifTotp = API.routes.auth.f2a.verifyTotp;
const verifBackup = API.routes.auth.f2a.verifyBackup;

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
    if (!btn) return;

    let user = await UserState.get();

    if (user)
        btn.textContent = user.f2a_enabled ? "Disable" : "Enable";

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
            btn.textContent = "Disable";
            modal.remove();
            diplayBackupCodes();
        });
    }

    async function diplayBackupCodes() {
        await UserState.refresh();
        user = await UserState.get();
        console.log('[in display codes]:', user);
        DOM.createDisplayBackupCodesFrag();
        const backupTbody = DOM.displayBackupTableTbody;

        const modal = new Modal({ styles });
        modal.render(DOM.fragDisplayBackupCodes);
        setStatus(DOM.displayBackupStatusTagSpan, true);

        // Fetch backup codes
        const res = await API.Post<{ codes: string[] }>(verifBackup);
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
            if (error || !data?.success) return alert("Invalid code, cannot disable.");
            modal.remove();
            activate2FA();
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
            if (error || !data?.success) return alert("Invalid code, cannot disable.");
            modal.remove();
            activate2FA();
        });
    }

    const onClick = async () => {
        const user = await UserState.get(true);
        if (!user)
            return alert("Failed to fetch user info.");
        if (user.f2a_enabled) {
            openOtpForm();
        } else {
            activate2FA();
        }
    };

    btn.addEventListener("click", onClick);
    off.push(() => btn.removeEventListener("click", onClick));
}

export function teardownF2a() {
    off.forEach((off) => off());
    off = [];
}
