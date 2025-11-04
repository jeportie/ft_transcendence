// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   SessionsTable.ts                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/04 09:33:56 by jeportie          #+#    #+#             //
//   Updated: 2025/11/04 10:23:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractTableView } from "../../../../spa/abstractViewClasses/AbstractTableView.js";
import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";

export class SessionsTable extends AbstractTableView<any> {
    #ASSETS;
    #listeners: Array<() => void> = [];

    constructor(tbody: HTMLElement, ASSETS: any) {
        super(tbody);
        this.#ASSETS = ASSETS;
    }

    get loadingMessage() { return "Loading sessions..."; }
    get emptyMessage() { return "No active sessions."; }
    get errorMessage() { return "Failed to load sessions."; }

    protected renderMessage(type: "loading" | "empty" | "error", message?: string): void {
        const color =
            type === "error"
                ? "text-red-400"
                : type === "loading"
                    ? "text-neutral-400"
                    : "text-neutral-500";

        const text = message || (
            type === "loading" ? this.loadingMessage :
                type === "empty" ? this.emptyMessage :
                    this.errorMessage
        );

        this.tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-3 py-4 text-center text-sm ${color}">
                    ${text}
                </td>
            </tr>`;
    }

    async fetch() {
        const res = await API.Get("/auth/sessions");
        if (res.error) throw new Error("API Error");
        return res.data?.sessions ?? [];
    }

    renderRow(s: any): DocumentFragment {
        const now = new Date();

        const { color, label } = (() => {
            if (s.revokedAt) return { color: "bg-red-500", label: "Revoked" };
            const exp = new Date(s.expiresAt);
            const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            if (diff < 0) return { color: "bg-red-500", label: "Expired" };
            if (diff < 2) return { color: "bg-orange-400", label: "Expiring soon" };
            return { color: "bg-green-500", label: "Active" };
        })();

        const icon = (device: string) => {
            if (/mobile|android|iphone/i.test(device)) return this.#ASSETS.phone;
            if (/mac|windows/i.test(device)) return this.#ASSETS.laptop;
            return this.#ASSETS.desktop;
        };

        // Clone template
        DOM.createSessionRowFrag();
        const frag = DOM.fragSessionRow;

        DOM.sessionStatusDot.classList.add(color);
        DOM.sessionStatusLabel.textContent = label;
        DOM.sessionDeviceIcon.innerHTML = icon(s.device);
        DOM.sessionDeviceAgent.textContent = s.agent || s.userAgent || "Unknown agent";
        DOM.sessionDeviceName.textContent = s.device;
        DOM.sessionIp.textContent = s.ip;
        DOM.sessionLastActive.textContent = s.lastActiveAt
            ? new Date(s.lastActiveAt).toLocaleString()
            : "—";
        DOM.sessionExpiry.textContent = s.expiresAt
            ? new Date(s.expiresAt).toLocaleString()
            : "—";

        if (s.current) {
            DOM.sessionAction.innerHTML =
                `<span class="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/20">
                    Current
                </span>`;
        } else {
            const btn = document.createElement("button");
            btn.dataset.session = s.id;
            btn.className = "app-btn-third text-xs";
            btn.textContent = "Revoke";

            const onClick = async () => {
                const res = await API.Post("/auth/sessions/revoke", { sessionId: s.id });
                if (res.error) return alert("Failed to revoke session.");
                const row = btn.closest("tr")!;
                row.classList.add("opacity-50", "pointer-events-none");
                setTimeout(() => row.remove(), 300);
            };

            btn.addEventListener("click", onClick);
            this.#listeners.push(() => btn.removeEventListener("click", onClick));

            DOM.sessionAction.appendChild(btn);
        }

        return frag;
    }

    onRendered(rows: any[]) {
        console.debug(`[SessionsTable] Rendered ${rows.length} rows`);
    }

    teardown() {
        this.#listeners.forEach(off => off());
        this.#listeners = [];
    }
}

