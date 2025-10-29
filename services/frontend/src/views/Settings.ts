// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Settings.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:19:28 by jeportie          #+#    #+#             //
//   Updated: 2025/10/27 20:41:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import settingsHTML from "../html/settings.html";
import { API } from "../spa/api.js";

type Me = { username: string; f2a_enabled: boolean; oauth: boolean };

export default class Settings extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Settings");
    }

    async getHTML() {
        return settingsHTML;
    }

    async mount() {
        // Buttons in the action list
        const btn2faToggle = document.querySelector("#btn-2fa-toggle") as HTMLButtonElement | null;
        const btnPwd = document.querySelector("#btn-open-pwd") as HTMLButtonElement | null;
        const btnSessions = document.querySelector("#btn-open-sessions") as HTMLButtonElement | null;

        // Templates (modals)
        const tpl2fa = document.querySelector<HTMLTemplateElement>("#tpl-2fa-card")!;
        const tplPwd = document.querySelector<HTMLTemplateElement>("#tpl-pwd-card")!;
        const tplSessions = document.querySelector<HTMLTemplateElement>("#tpl-sessions-card")!;

        // Load user state
        const meRes = await API.Get("/user/me");
        if (meRes.error) { console.error(meRes.error.message); return; }
        const me: Me = meRes.data.me;

        // Reflect 2FA state in toggle label
        const set2faToggleLabel = (enabled: boolean) => {
            if (btn2faToggle) btn2faToggle.textContent = enabled ? "Disable" : "Enable";
        };
        set2faToggleLabel(me.f2a_enabled);

        // --- Helpers -----------------------------------------------------------
        const openModal = (frag: DocumentFragment) => {
            const overlay = document.createElement("div");
            overlay.className = "app-modal-overlay";
            const modal = document.createElement("div");
            modal.className = "app-modal-card";

            const close = document.createElement("button");
            close.className = "app-modal-close";
            close.setAttribute("aria-label", "Close");
            close.textContent = "✕";

            modal.appendChild(close);
            modal.appendChild(frag);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            const remove = () => overlay.remove();
            close.addEventListener("click", remove);
            overlay.addEventListener("click", (e) => { if (e.target === overlay) remove(); });

            return { overlay, modal, remove };
        };

        const fillBackupCodes = (tbody: HTMLElement, codes: string[]) => {
            tbody.innerHTML = "";
            codes.forEach((c, i) => {
                const tr = document.createElement("tr");
                tr.className = "border-b border-neutral-800/60";
                tr.innerHTML = `
          <td class="px-3 py-1 text-neutral-300">${i + 1}</td>
          <td class="px-3 py-1 font-mono tracking-wide text-neutral-100">${c}</td>
        `;
                tbody.appendChild(tr);
            });
        };

        // --- 2FA Toggle (Enable/Disable) --------------------------------------
        btn2faToggle?.addEventListener("click", async () => {
            // Open modal
            const frag = tpl2fa.content.cloneNode(true) as DocumentFragment;
            const { remove: closeModal } = openModal(frag);

            // Modal elements
            const statusTag = document.querySelector("#f2a-status-tag") as HTMLElement;
            const enableBtn = document.querySelector("#f2a-enable-btn") as HTMLButtonElement;
            const disableBtn = document.querySelector("#f2a-disable-btn") as HTMLButtonElement;
            const qrWrap = document.querySelector("#f2a-qr-wrap") as HTMLElement;
            const qrImg = document.querySelector("#f2a-qr") as HTMLImageElement;
            const otp = document.querySelector("#f2a-code") as any; // <otp-inputs>
            const backupWrap = document.querySelector("#f2a-backup-wrap") as HTMLElement;
            const backupTbody = document.querySelector("#f2a-backup-table") as HTMLElement;
            const dlBtn = document.querySelector("#f2a-backup-download") as HTMLButtonElement;

            const setEnabledUI = (enabled: boolean) => {
                statusTag.textContent = enabled ? "Enabled" : "Disabled";
                statusTag.className = enabled
                    ? "inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-green-500/15 text-green-300 border border-green-400/20"
                    : "inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-red-500/15 text-red-300 border border-red-400/20";
                enableBtn.disabled = enabled;
                disableBtn.disabled = !enabled;
                set2faToggleLabel(enabled);
                if (!enabled) { qrWrap.classList.add("hidden"); backupWrap.classList.add("hidden"); }
            };

            setEnabledUI(me.f2a_enabled);

            // Enable flow
            enableBtn.addEventListener("click", async () => {
                const { data, error } = await API.Post("/auth/enable");
                if (error) { console.error(error.message); alert("Failed to start 2FA."); return; }
                // Expect { qr: 'data:image/png;base64,...' }
                qrImg.src = data.qr;
                qrWrap.classList.remove("hidden");
                // focus otp if component exposes method
                try { otp?.focus?.(); } catch { }
            });

            // Disable flow
            disableBtn.addEventListener("click", async () => {
                const { error } = await API.Post("/auth/disable");
                if (error) { console.error(error.message); alert("Failed to disable 2FA."); return; }
                setEnabledUI(false);
                alert("Two-factor authentication disabled.");
            });

            // OTP verification (listen for <otp-inputs> events)
            const verify = async (code: string) => {
                if (!code || code.length < 6) return;
                const { data, error } = await API.Post("/auth/verify-totp", { code });
                if (error) { console.error(error.message); alert("Verification failed."); return; }
                if (!data?.success) { alert("Invalid code. Try again."); return; }

                setEnabledUI(true);
                qrWrap.classList.add("hidden");

                // Generate backup codes
                const backupRes = await API.Post("/auth/backup");
                if (backupRes.error) { console.error(backupRes.error.message); return; }
                const codes: string[] = backupRes.data?.codes || [];
                if (!codes.length) return;

                fillBackupCodes(backupTbody, codes);
                backupWrap.classList.remove("hidden");

                dlBtn.onclick = () => {
                    const text = [
                        "Your 2FA Backup Codes",
                        "======================", "",
                        "Each code can be used once if you lose access to your authenticator app.", "",
                        ...codes.map((c, i) => `${i + 1}. ${c}`), "",
                        "⚠️ Keep this file private and stored securely.",
                    ].join("\n");
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = "backup-codes.txt"; a.click();
                    URL.revokeObjectURL(url);
                };
            };

            // Support both custom 'complete' event and standard 'change'
            otp?.addEventListener?.("complete", (e: any) => verify(e?.detail?.value ?? otp.value ?? ""));
            otp?.addEventListener?.("change", () => verify(otp.value ?? ""));
        });

        // --- Password Modal ----------------------------------------------------
        btnPwd?.addEventListener("click", () => {
            const frag = tplPwd.content.cloneNode(true) as DocumentFragment;
            const { remove: closeModal } = openModal(frag);

            const form = document.querySelector("#pwd-form") as HTMLFormElement;
            const oldPwd = document.querySelector("#old-pwd") as HTMLInputElement;
            const newPwd = document.querySelector("#new-pwd") as HTMLInputElement;
            const confirmPw = document.querySelector("#confirm-pwd") as HTMLInputElement;
            const hint = document.querySelector("#pwd-hint") as HTMLElement;

            if (me.oauth) {
                oldPwd.closest(".app-field")?.classList.add("hidden");
                hint.textContent = "This account was created with OAuth. You can set a local password below.";
            }

            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                if (!me.oauth && !oldPwd.value) return alert("Missing old password.");
                if (!newPwd.value) return alert("Missing new password.");
                if (confirmPw.value !== newPwd.value) return alert("Please confirm the same new password.");

                const { data, error } = await API.Post("/user/modify-pwd", {
                    username: me.username,
                    oauth: me.oauth,
                    oldPwd: oldPwd.value,
                    newPwd: newPwd.value,
                });
                if (error) { console.error(error.message); alert("Error while updating password."); return; }
                if (data?.success) { alert("Password updated successfully."); form.reset(); closeModal(); }
                else { alert(data?.message || "Password update failed."); }
            });
        });

        // --- Sessions Modal ----------------------------------------------------
        btnSessions?.addEventListener("click", async () => {
            const frag = tplSessions.content.cloneNode(true) as DocumentFragment;
            openModal(frag);

            const tbody = document.querySelector("#sessions-table-body") as HTMLElement;
            const res = await API.Get("/auth/sessions");
            if (res.error) { console.error(res.error.message); alert("Unable to load sessions."); return; }

            const sessions: Array<{
                id: string; device: string; ip: string; location?: string;
                current?: boolean; createdAt?: string; lastActiveAt?: string;
            }> = res.data?.sessions || [];

            tbody.innerHTML = "";
            sessions.forEach((s) => {
                const tr = document.createElement("tr");
                tr.className = "border-b border-neutral-800/60";
                tr.innerHTML = `
          <td class="px-3 py-3 whitespace-nowrap">
            <div class="text-neutral-100">${s.device || "Unknown device"}</div>
            <div class="text-xs text-neutral-400">${s.createdAt ? new Date(s.createdAt).toLocaleString() : ""}</div>
          </td>
          <td class="px-3 py-3 whitespace-nowrap">
            <div class="text-neutral-200">${s.ip}</div>
            <div class="text-xs text-neutral-400">${s.location || ""}</div>
          </td>
          <td class="px-3 py-3 whitespace-nowrap text-neutral-300">
            ${s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleString() : "—"}
          </td>
          <td class="px-3 py-3 whitespace-nowrap text-right">
            ${s.current
                        ? `<span class="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/20">Current</span>`
                        : `<button data-session="${s.id}" class="app-btn-secondary">Revoke</button>`
                    }
          </td>
        `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll<HTMLButtonElement>("button[data-session]").forEach((btn) => {
                btn.addEventListener("click", async () => {
                    const sessionId = btn.dataset.session!;
                    const { error } = await API.Post("/auth/sessions/revoke", { sessionId });
                    if (error) { console.error(error.message); alert("Failed to revoke session."); return; }
                    btn.closest("tr")?.remove();
                });
            });
        });
    }
}

