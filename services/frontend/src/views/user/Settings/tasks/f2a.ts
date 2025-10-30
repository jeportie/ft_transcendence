// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   f2a.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/30 14:28:44 by jeportie          #+#    #+#             //
//   Updated: 2025/10/30 14:28:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";
import twoFactorHTML from "../templates/F2a.html";
import { openModalWith } from "../../../../spa/utils/modal.js";

let listeners: Array<() => void> = [];

export function setupF2a() {
    const btn = document.querySelector<HTMLButtonElement>("#btn-2fa-toggle");
    if (!btn) return;

    // Reflect current state
    API.Get("/user/me").then(({ data }) => {
        if (data?.me) btn.textContent = data.me.f2a_enabled ? "Disable" : "Enable";
    });

    const onClick = async () => {
        const me = await API.Get("/user/me");
        const enabled = Boolean(me?.data?.me?.f2a_enabled);

        // Build modal
        const tpl = document.createElement("template");
        tpl.innerHTML = twoFactorHTML.trim();
        const innerTpl = tpl.content.querySelector("template") as HTMLTemplateElement;
        const frag = innerTpl.content.cloneNode(true) as DocumentFragment;

        // Query elements
        const statusTag = frag.querySelector("#f2a-status-tag") as HTMLElement;
        const enableWrap = frag.querySelector("#f2a-enable-wrap") as HTMLElement;
        const disableWrap = frag.querySelector("#f2a-disable-wrap") as HTMLElement;
        const qrImg = frag.querySelector("#f2a-qr") as HTMLImageElement;
        const enableCode = frag.querySelector("#f2a-enable-code") as any;
        const disableCode = frag.querySelector("#f2a-disable-code") as any;
        const confirmDisableBtn = frag.querySelector("#f2a-confirm-disable") as HTMLButtonElement;
        const backupWrap = frag.querySelector("#f2a-backup-wrap") as HTMLElement;
        const backupTbody = frag.querySelector("#f2a-backup-table") as HTMLElement;
        const dlBtn = frag.querySelector("#f2a-backup-download") as HTMLButtonElement;

        const { remove } = openModalWith(frag);

        // --- Helper to update status tag ---
        const setStatus = (isEnabled: boolean) => {
            if (isEnabled) {
                statusTag.textContent = "Enabled";
                statusTag.className =
                    "inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-green-500/15 text-green-300 border border-green-400/20";
            } else {
                statusTag.textContent = "Disabled";
                statusTag.className =
                    "inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-red-500/15 text-red-300 border border-red-400/20";
            }
        };

        // =========================================================
        // ENABLE FLOW
        // =========================================================
        if (!enabled) {
            setStatus(false);
            enableWrap.classList.remove("hidden");

            const { data, error } = await API.Post("/auth/enable");
            if (error) return alert("Failed to start 2FA setup");

            qrImg.src = data.qr;
            enableCode?.focus?.();

            const verifyEnable = async (code: string) => {
                if (!code || code.length < 6) return;
                const { data, error } = await API.Post("/auth/verify-totp", { code });
                if (error || !data?.success) return alert("Invalid code.");

                setStatus(true);
                btn.textContent = "Disable";

                // Fetch backup codes
                const res = await API.Post("/auth/backup");
                const codes: string[] = res.data?.codes ?? [];
                if (!codes.length) return;
                backupTbody.innerHTML = codes
                    .map(
                        (c, i) => `
          <tr class="border-b border-neutral-800/60">
            <td class="px-3 py-1 text-neutral-300">${i + 1}</td>
            <td class="px-3 py-1 font-mono tracking-wide text-neutral-100">${c}</td>
          </tr>`
                    )
                    .join("");
                backupWrap.classList.remove("hidden");

                dlBtn.onclick = () => {
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
                };
            };

            const onComplete = (e: any) => verifyEnable(e?.detail?.value ?? enableCode.value ?? "");
            const onChange = () => verifyEnable(enableCode.value ?? "");
            enableCode?.addEventListener?.("complete", onComplete);
            enableCode?.addEventListener?.("change", onChange);
            listeners.push(() => enableCode?.removeEventListener?.("complete", onComplete));
            listeners.push(() => enableCode?.removeEventListener?.("change", onChange));
        }

        // =========================================================
        // DISABLE FLOW
        // =========================================================
        else {
            setStatus(true);
            disableWrap.classList.remove("hidden");
            disableCode?.focus?.();

            const onConfirmDisable = async () => {
                const code = disableCode.value ?? "";
                if (!code || code.length < 6) return alert("Enter a valid 6-digit code.");

                const { data, error } = await API.Post("/auth/verify-totp", { code });
                if (error || !data?.success) return alert("Invalid code, cannot disable.");

                const res = await API.Post("/auth/disable");
                if (res.error) return alert("Failed to disable 2FA.");

                btn.textContent = "Enable";
                setStatus(false);
                alert("Two-factor authentication disabled successfully.");
                remove();
            };

            confirmDisableBtn.addEventListener("click", onConfirmDisable);
            listeners.push(() => confirmDisableBtn.removeEventListener("click", onConfirmDisable));
        }
    };

    btn.addEventListener("click", onClick);
    listeners.push(() => btn.removeEventListener("click", onClick));
}

export function teardownF2a() {
    listeners.forEach((off) => off());
    listeners = [];
}

