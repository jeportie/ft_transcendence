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

        // --- Sessions Auto-Load ----------------------------------------------------
        const tbody = document.querySelector("#sessions-table-body") as HTMLElement;
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" class="px-3 py-4 text-center text-neutral-400 text-sm">Loading sessions...</td></tr>`;

            const res = await API.Get("/auth/sessions");
            if (res.error) {
                console.error(res.error.message);
                tbody.innerHTML = `<tr><td colspan="5" class="px-3 py-4 text-center text-red-400 text-sm">Failed to load sessions.</td></tr>`;
            } else {
                const sessions = res.data.sessions || [];
                console.log("[Sessions]", sessions);
                tbody.innerHTML = "";

                if (!sessions.length) {
                    tbody.innerHTML = `<tr><td colspan="5" class="px-3 py-4 text-center text-neutral-400 text-sm">No active sessions.</td></tr>`;
                    return;
                }


                // Helpers ------------------------------------------------------------
                const now = new Date();

                const getStatus = (s: any) => {
                    if (s.revokedAt) return { color: "bg-red-500", label: "Revoked" };
                    const exp = new Date(s.expiresAt);
                    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                    if (diff < 0) return { color: "bg-red-500", label: "Expired" };
                    if (diff < 2) return { color: "bg-orange-400", label: "Expiring soon" };
                    return { color: "bg-green-500", label: "Active" };
                };

                const getDeviceIcon = (device: string) => {
                    if (/mobile|android|iphone/i.test(device))
                        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
        class="inline w-5 h-5 align-middle text-neutral-300"><rect width="256" height="256" fill="none"/><rect x="64" y="24" width="128" height="208" rx="16"
        fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="64" y1="56" x2="192" y2="56" fill="none"
        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="64" y1="200" x2="192" y2="200" fill="none"
        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`;
                    if (/mac|windows/i.test(device))
                        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
        class="inline w-5 h-5 align-middle text-neutral-300"><rect width="256" height="256" fill="none"/><rect x="32" y="48" width="192" height="144" rx="16"
        transform="translate(256 240) rotate(180)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="160"
        y1="224" x2="96" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="32" y1="152"
        x2="224" y2="152" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="128" y1="192"
        x2="128" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`;
                    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
      class="inline w-5 h-5 align-middle text-neutral-300"><rect width="256" height="256" fill="none"/><path d="M40,176V72A16,16,0,0,1,56,56H200a16,16,0,0,1,16,16V176"
      fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M24,176H232v16a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16Z"
      fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="144" y1="88" x2="112" y2="88"
      fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`;
                };

                // ---------------------------------------------------------------------
                sessions.forEach((s: any) => {
                    const { color, label } = getStatus(s);
                    const tr = document.createElement("tr");
                    tr.className =
                        "border-b border-neutral-800/60 hover:bg-neutral-800/30 transition-colors";

                    tr.innerHTML = `
    <td class="px-3 py-3 text-center">
      <span class="relative group">
        <span class="inline-block w-2.5 h-2.5 rounded-full ${color}"></span>
        <span class="app-tooltip hidden group-hover:block text-xs text-neutral-200">
          ${label}
        </span>
      </span>
    </td>

    <td class="px-3 py-3 whitespace-nowrap">
      <div class="flex items-center gap-2">
        <span class="relative group">
          ${getDeviceIcon(s.device)}
          <span class="app-tooltip hidden group-hover:block text-xs text-neutral-200 max-w-[280px] whitespace-normal">
            ${s.agent.replace(/</g, "&lt;")}
          </span>
        </span>
        <span class="text-neutral-100">${s.device}</span>
      </div>
    </td>

    <td class="px-3 py-3 whitespace-nowrap text-neutral-200">${s.ip}</td>

    <td class="px-3 py-3 whitespace-nowrap text-neutral-300">
      ${s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleString() : "—"}
    </td>

    <td class="px-3 py-3 whitespace-nowrap text-right">
      ${s.current
                            ? `<span class="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/20">Current</span>`
                            : `<button data-session="${s.id}" class="app-btn-secondary text-xs">Revoke</button>`
                        }
    </td>`;

                    tbody.appendChild(tr);
                });

                // Revoke logic (unchanged)
                tbody.querySelectorAll<HTMLButtonElement>("button[data-session]").forEach((btn) => {
                    btn.addEventListener("click", async () => {
                        const id = btn.dataset.session!;
                        const res = await API.Post("/auth/sessions/revoke", { sessionId: id });
                        if (res.error) {
                            alert("Failed to revoke session.");
                            return;
                        }

                        const row = btn.closest("tr");
                        if (row) {
                            row.classList.add("opacity-50", "pointer-events-none");
                            setTimeout(() => row.remove(), 300);
                        }
                    });
                });
            }
        }
    }
}
