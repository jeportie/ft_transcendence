// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   sessions.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 22:01:51 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 22:49:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";

let off: Array<() => void> = [];

export function setupSessions({ ASSETS }) {
    const tbody = document.querySelector<HTMLElement>("#sessions-table-body");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" class="px-3 py-4 text-center text-neutral-400 text-sm">Loading sessions...</td></tr>`;

    (async () => {
        const res = await API.Get("/auth/sessions");
        if (res.error) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-3 py-4 text-center text-red-400 text-sm">Failed to load sessions.</td></tr>`;
            return;
        }

        const sessions = res.data?.sessions ?? [];
        tbody.innerHTML = "";
        if (!sessions.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-3 py-4 text-center text-neutral-400 text-sm">No active sessions.</td></tr>`;
            return;
        }

        const now = new Date();
        const status = (s: any) => {
            if (s.revokedAt) return { color: "bg-red-500", label: "Revoked" };
            const exp = new Date(s.expiresAt);
            const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            if (diff < 0) return { color: "bg-red-500", label: "Expired" };
            if (diff < 2) return { color: "bg-orange-400", label: "Expiring soon" };
            return { color: "bg-green-500", label: "Active" };
        };

        const icon = (device: string) => {
            if (/mobile|android|iphone/i.test(device)) return ASSETS.phone;
            if (/mac|windows/i.test(device)) return ASSETS.laptop;
            return ASSETS.desktop;
        };

        sessions.forEach((s: any) => {
            const { color, label } = status(s);
            const tr = document.createElement("tr");
            tr.className = "border-b border-neutral-800/60 hover:bg-neutral-800/30 transition-colors";
            tr.innerHTML = `
        <td class="px-3 py-3 text-center">
          <span class="relative group">
            <span class="inline-block w-2.5 h-2.5 rounded-full ${color}"></span>
            <span class="app-tooltip hidden group-hover:block text-xs text-neutral-200">${label}</span>
          </span>
        </td>
        <td class="px-3 py-3 whitespace-nowrap">
          <div class="flex items-center gap-2">
            ${icon(s.device)}
            <span class="text-neutral-100">${s.device}</span>
          </div>
        </td>
        <td class="px-3 py-3 whitespace-nowrap text-neutral-200">${s.ip}</td>
        <td class="px-3 py-3 whitespace-nowrap text-neutral-300">${s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleString() : "—"}</td>
        <td class="px-3 py-3 whitespace-nowrap text-neutral-300">${s.expiresAt ? new Date(s.expiresAt).toLocaleString() : "—"}</td>
        <td class="px-3 py-3 whitespace-nowrap text-right">
          ${s.current ? `<span class="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/20">Current</span>`
                    : `<button data-session="${s.id}" class="app-btn-secondary text-xs">Revoke</button>`}
        </td>`;
            tbody.appendChild(tr);
        });

        // Revoke handlers
        tbody.querySelectorAll<HTMLButtonElement>("button[data-session]").forEach((btn) => {
            const onClick = async () => {
                const id = btn.dataset.session!;
                const res = await API.Post("/auth/sessions/revoke", { sessionId: id });
                if (res.error) return alert("Failed to revoke session.");
                const row = btn.closest("tr") as HTMLElement | null;
                if (row) { row.classList.add("opacity-50", "pointer-events-none"); setTimeout(() => row.remove(), 300); }
            };
            btn.addEventListener("click", onClick);
            off.push(() => btn.removeEventListener("click", onClick));
        });
    })();
}

export function teardownSessions() {
    off.forEach(fn => fn()); off = [];
}
