// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Settings.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:19:28 by jeportie          #+#    #+#             //
//   Updated: 2025/10/03 22:38:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import settingsHTML from "../html/settings.html";
import { API } from "../spa/api.js";

export default class Settings extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Settings");
    };

    async getHTML() {
        return (settingsHTML);
    }

    mount() {
        const toggle = document.querySelector("#f2a-toggle") as HTMLInputElement;
        const qrSection = document.querySelector("#f2a-qr-section");
        const qrImg = document.querySelector("#f2a-qr") as HTMLImageElement;
        const verifyBtn = document.querySelector("#f2a-verify-btn");
        const codeInput = document.querySelector("#f2a-code") as HTMLInputElement;

        const pwdOptionLabel = document.querySelector("#pwd-option-label") as HTMLLabelElement || null;
        const pwdModifyToogle = document.querySelector("#pwd-modify-toggle");
        const pwdForm = document.querySelector("#pwd-form");
        const oldPwd = document.querySelector("#old-pwd") as HTMLInputElement || null;
        const newPwd = document.querySelector("#new-pwd") as HTMLInputElement || null;
        const confirPwd = document.querySelector("#confirm-pwd") as HTMLInputElement || null;

        let username: string | null = null;
        let isOauth = false;
        // Load current state
        API.get("/user/me").then((user: any) => {
            console.log(user);
            username = user.me.username;
            toggle.checked = user.me.f2a_enabled;
            isOauth = user.me.oauth;
            if (isOauth) {
                pwdOptionLabel.textContent = "Add local password.";
                oldPwd.classList.add("hidden");
                const note = document.createElement("p");
                note.className = "ui-text-muted text-sm mt-2";
                note.textContent = "This account was created with OAuth. You can set a local password below.";
                pwdForm?.insertBefore(note, pwdForm.firstChild);
            }
        });

        pwdModifyToogle?.addEventListener("click", () => {
            pwdForm?.classList.remove("hidden");
        });

        pwdForm?.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!isOauth && !oldPwd.value) {
                alert("Missing old password.");
                return;
            }
            if (!newPwd.value) {
                alert("Missing new password.");
                return;
            }
            if (!confirPwd.value || confirPwd.value !== newPwd.value) {
                alert("Please confrim new password.");
                return;
            }
            try {
                const res = await API.post("/user/modify-pwd", {
                    username,
                    oauth: isOauth,
                    oldPwd: oldPwd.value,
                    newPwd: newPwd.value,
                });
                if (res.success) {
                    alert("Password updated successfully.");
                    pwdForm.classList.add("hidden");
                } else {
                    alert(res.message || "Password update failed.");
                }
            } catch (err) {
                console.error(err);
                alert("Error while updating password.");
            }
        })

        ///////////////////////////////////////////////// --- 2FA ---

        // Toggle → enable flow
        toggle.addEventListener("change", async () => {
            if (toggle.checked) {
                // Call backend to start enabling 2FA
                const data = await API.post("/auth/enable");
                qrImg.src = data.qr; // backend should return otpauth:// as QR URL
                qrSection.classList.remove("hidden");
            } else {
                await API.post("/auth/disable");
                // status.textContent = "Disabled";
            }
        });

        // Verify code after scanning QR
        verifyBtn.addEventListener("click", async e => {
            e.preventDefault();
            const code = codeInput.value;
            const res = await API.post("/auth/verify-totp", { code });

            console.log(res);
            if (res.success) {
                qrSection.classList.add("hidden");

                // Generate and show backup codes
                const backups = await API.post("/auth/backup");

                console.log(backups);
                if (backups.success && backups.codes) {
                    this.showBackupCodes(backups.codes);
                }
            } else {
                alert("Invalid code. Try again.");
            }
        });
    }

    showBackupCodes(codes: string[]) {
        const section = document.querySelector("#f2a-backup-section") as HTMLElement;
        const tableBody = document.querySelector("#f2a-backup-table") as HTMLElement;
        const downloadBtn = document.querySelector("#f2a-backup-download") as HTMLButtonElement;
        if (!section || !tableBody || !downloadBtn) return;

        // Clear old rows
        tableBody.innerHTML = "";

        // Populate table
        codes.forEach((code, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="border border-neutral-700 py-1">${index + 1}</td>
            <td class="border border-neutral-700 py-1 font-mono tracking-wide">${code}</td>
        `;
            tableBody.appendChild(row);
        });

        // Attach one-time download handler
        downloadBtn.onclick = () => {
            const text = [
                "Your 2FA Backup Codes",
                "======================",
                "",
                "Each code can be used once if you lose access to your authenticator app.",
                "",
                ...codes.map((c, i) => `${i + 1}. ${c}`),
                "",
                "⚠️ Keep this file private and stored securely.",
            ].join("\n");

            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "backup-codes.txt";
            a.click();
            URL.revokeObjectURL(url);
        };

        // Show section
        section.classList.remove("hidden");
    }

}
