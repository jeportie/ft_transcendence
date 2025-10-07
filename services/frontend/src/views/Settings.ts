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
        const settings = document.querySelector("#settings-form") as HTMLFormElement | null;
        const toggle = document.querySelector("#f2a-toggle") as HTMLInputElement;
        const status = document.querySelector("#f2a-status");
        const qrSection = document.querySelector("#f2a-qr-section");
        const qrImg = document.querySelector("#f2a-qr") as HTMLImageElement;
        const verifyBtn = document.querySelector("#f2a-verify-btn");
        const codeInput = document.querySelector("#f2a-code") as HTMLInputElement;

        const pwdModifyToogle = document.querySelector("#pwd-modify-toggle");
        const pwdForm = document.querySelector("#pwd-form");


        let username: string | null = null;
        // Load current state
        API.get("/user/me").then(user => {
            username = user.me.username;
            toggle.checked = user.me.f2a_enabled;
            status.textContent = "2FA";
        });

        pwdModifyToogle?.addEventListener("click", () => {
            pwdForm?.classList.remove("hidden");
        });

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
                const backups = await API.post("/auth/backup");
                console.log(backups);
            } else {
                alert("Invalid code. Try again.");
            }
        });

        // Verify code after scanning QR
        verifyBtn.addEventListener("click", async e => {
            e.preventDefault();
            const code = codeInput.value;
            const res = await API.post("/auth/verify-totp", { code });

            if (res.success) {
                qrSection.classList.add("hidden");

                // Generate and show backup codes
                const backups = await API.post("/auth/backup");
                if (backups.success && backups.codes) {
                    this.showBackupCodes(backups.codes);
                }
            } else {
                alert("Invalid code. Try again.");
            }
        });

        settings?.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form).entries());
            console.log("Settings submit:", data);

            // Later: real API call
            // await fetch("/api/settings", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify(data),
            // });
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
