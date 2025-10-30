// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   f2a.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 22:00:18 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 22:59:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";
import twoFactorHTML from "../templates/F2a.html";
import { openModalWith } from "../../../../spa/utils/modal.js";

let listeners: Array<() => void> = [];

export function setupF2a() {
    const btn = document.querySelector<HTMLButtonElement>("#btn-2fa-toggle");
    if (!btn) return;

    // reflect current state once
    API.Get("/user/me").then(({ data }) => {
        if (data?.me) btn.textContent = data.me.f2a_enabled ? "Disable" : "Enable";
    });

    const onClick = async () => {
        // Build modal content from template file
        const tpl = document.createElement("template");
        tpl.innerHTML = twoFactorHTML.trim();
        // const frag = tpl.content.cloneNode(true) as DocumentFragment;
        const innerTpl = tpl.content.querySelector("template") as HTMLTemplateElement;
        const frag = innerTpl.content.cloneNode(true) as DocumentFragment;

        // Query inside modal
        const statusTag = frag.querySelector("#f2a-status-tag") as HTMLElement;
        const enableBtn = frag.querySelector("#f2a-enable-btn") as HTMLButtonElement;
        const disableBtn = frag.querySelector("#f2a-disable-btn") as HTMLButtonElement;
        const qrWrap = frag.querySelector("#f2a-qr-wrap") as HTMLElement;
        const qrImg = frag.querySelector("#f2a-qr") as HTMLImageElement;
        const otp = frag.querySelector("#f2a-code") as any;
        const backupWrap = frag.querySelector("#f2a-backup-wrap") as HTMLElement;
        const backupTbody = frag.querySelector("#f2a-backup-table") as HTMLElement;
        const dlBtn = frag.querySelector("#f2a-backup-download") as HTMLButtonElement;

        // Mount modal
        const { remove } = openModalWith(frag);

        const setUI = (enabled: boolean) => {
            statusTag.textContent = enabled ? "Enabled" : "Disabled";
            statusTag.className = enabled
                ? "inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-green-500/15 text-green-300 border border-green-400/20"
                : "inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-red-500/15 text-red-300 border border-red-400/20";
            enableBtn.disabled = enabled;
            disableBtn.disabled = !enabled;
            btn.textContent = enabled ? "Disable" : "Enable";
            if (!enabled) { qrWrap.classList.add("hidden"); backupWrap.classList.add("hidden"); }
        };

        // initial status
        const me = await API.Get("/user/me");
        setUI(Boolean(me?.data?.me?.f2a_enabled));

        // enable
        const onEnable = async () => {
            const { data, error } = await API.Post("/auth/enable");
            if (error) return alert("Failed to start 2FA");
            qrImg.src = data.qr; // data:image/png;base64,...
            qrWrap.classList.remove("hidden");
            otp?.focus?.();
        };
        enableBtn.addEventListener("click", onEnable);
        listeners.push(() => enableBtn.removeEventListener("click", onEnable));

        // disable
        const onDisable = async () => {
            const { error } = await API.Post("/auth/disable");
            if (error) return alert("Failed to disable 2FA");
            setUI(false);
            remove();
        };
        disableBtn.addEventListener("click", onDisable);
        listeners.push(() => disableBtn.removeEventListener("click", onDisable));

        // verify
        async function verify(code: string) {
            if (!code || code.length < 6) return;
            const { data, error } = await API.Post("/auth/verify-totp", { code });
            if (error || !data?.success) return alert("Invalid code.");
            setUI(true);
            qrWrap.classList.add("hidden");

            const res = await API.Post("/auth/backup");
            const codes: string[] = res.data?.codes ?? [];
            if (!codes.length) return;
            backupTbody.innerHTML = codes.map((c, i) => `
        <tr class="border-b border-neutral-800/60">
          <td class="px-3 py-1 text-neutral-300">${i + 1}</td>
          <td class="px-3 py-1 font-mono tracking-wide text-neutral-100">${c}</td>
        </tr>`).join("");
            backupWrap.classList.remove("hidden");

            dlBtn.onclick = () => {
                const text = ["Your 2FA Backup Codes", "======================", "",
                    "Each code can be used once if you lose access to your authenticator app.", "",
                    ...codes.map((c, i) => `${i + 1}. ${c}`), "", "⚠️ Keep this file private and stored securely."].join("\n");
                const blob = new Blob([text], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = Object.assign(document.createElement("a"), { href: url, download: "backup-codes.txt" });
                a.click(); URL.revokeObjectURL(url);
            };
        }
        const onComplete = (e: any) => verify(e?.detail?.value ?? otp.value ?? "");
        const onChange = () => verify(otp.value ?? "");
        otp?.addEventListener?.("complete", onComplete);
        otp?.addEventListener?.("change", onChange);
        listeners.push(() => otp?.removeEventListener?.("complete", onComplete));
        listeners.push(() => otp?.removeEventListener?.("change", onChange));
    };

    btn.addEventListener("click", onClick);
    listeners.push(() => btn.removeEventListener("click", onClick));
}

export function teardownF2a() {
    listeners.forEach(off => off()); listeners = [];
}
