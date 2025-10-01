// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Settings.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:19:28 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 13:51:57 by jeportie         ###   ########.fr       //
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
        const status = document.querySelector("#f2a-status")!;
        const qrSection = document.querySelector("#f2a-qr-section")!;
        const qrImg = document.querySelector("#f2a-qr") as HTMLImageElement;
        const verifyBtn = document.querySelector("#f2a-verify-btn")!;
        const codeInput = document.querySelector("#f2a-code") as HTMLInputElement;

        let username: string | null = null;
        // Load current state
        API.get("/user/me").then(user => {
            username = user.me.username;
            toggle.checked = user.f2a_enabled;
            status.textContent = user.f2a_enabled ? "Enabled" : "Disabled";
        });

        // Toggle → enable flow
        toggle.addEventListener("change", async () => {
            if (toggle.checked) {
                // Call backend to start enabling 2FA
                const data = await API.post("/auth/enable");
                qrImg.src = data.qr; // backend should return otpauth:// as QR URL
                qrSection.classList.remove("hidden");
            } else {
                await API.post("/auth/disable");
                status.textContent = "Disabled";
            }
        });

        // Verify code after scanning QR
        verifyBtn.addEventListener("click", async e => {
            e.preventDefault();
            const code = codeInput.value;
            const res = await API.post("/auth/verify-totp", { code });
            console.log(res);
            if (res.success) {
                status.textContent = "Enabled";
                qrSection.classList.add("hidden");
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
}
