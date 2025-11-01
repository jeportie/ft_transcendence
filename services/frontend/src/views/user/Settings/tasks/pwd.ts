// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   pwd.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/01 17:15:54 by jeportie          #+#    #+#             //
//   Updated: 2025/11/01 17:46:20 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";
import { openModalWith } from "../../../../spa/utils/modal.js";
import { togglePasswordSvg } from "../../../shared/togglePasswordSvg.js";

let off: Array<() => void> = [];

// @ts-expect-error
export async function setupPwd({ ASSETS }) {
    const btn = DOM.settingsPwdBtn;
    if (!btn) return;

    const me = await API.Get("/user/me");
    const user = me?.data?.me;

    // -------------------------------------------------------------
    // 1. Change password modal
    // -------------------------------------------------------------
    function openChangePwd() {
        DOM.createChangePwdFrag();
        const frag = DOM.fragChangePwd;
        const form = DOM.pwdForm;
        const oldPwd = DOM.oldPwd;
        const newPwd = DOM.newPwd as any;
        const confirm = DOM.confirmPwd;
        const hint = DOM.pwdHint;

        const { remove } = openModalWith(frag);

        togglePasswordSvg({ ASSETS, input: oldPwd });
        togglePasswordSvg({ ASSETS, input: confirm });

        if (user.oauth) {
            oldPwd.closest(".app-field")?.classList.add("hidden");
            hint.textContent = "This account was created with OAuth. You can set a local password below.";
            btn.innerText = "Create";
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!newPwd.value || confirm.value !== newPwd.value)
                return alert("Please enter a valid password and confirmation.");

            const { data, error } = await API.Post("/user/modify-pwd", {
                username: user.username,
                oauth: user.oauth,
                oldPwd: oldPwd.value,
                newPwd: newPwd.value,
            });
            if (error) return alert("Error while updating password.");
            if (data?.success) {
                alert("Password updated successfully.");
                form.reset();
                remove();
            } else alert(data?.message || "Password update failed.");
        });
    }

    // -------------------------------------------------------------
    // 2. Verify TOTP modal
    // -------------------------------------------------------------
    function openOtpForm() {
        DOM.createOtpFormFrag();
        const frag = DOM.fragOtpForm;
        const otpForm = DOM.pwdOtpForm;
        const disableCode = DOM.pwdDisableCode;
        const toBackup = DOM.pwdBackupBtn;

        const { remove } = openModalWith(frag);

        toBackup.addEventListener("click", () => {
            remove();
            openBackupForm();
        });

        otpForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = disableCode.value;
            const { data, error } = await API.Post("/auth/verify-totp", { code });
            if (error || !data?.success) return alert("Invalid code, cannot disable.");
            remove();
            openChangePwd();
        });
    }

    // -------------------------------------------------------------
    // 3. Verify backup code modal
    // -------------------------------------------------------------
    function openBackupForm() {
        DOM.createBackupFormFrag();
        const frag = DOM.fragBackupForm;
        const form = DOM.pwdBackOtpForm;
        const codeInput = DOM.pwdBackupCode;

        const { remove } = openModalWith(frag);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = codeInput.value;
            const { data, error } = await API.Post("/auth/verify-backup", { code });
            if (error || !data.success) return alert("Invalid code, cannot disable.");
            remove();
            openChangePwd();
        });
    }

    // -------------------------------------------------------------
    // Entry point depending on 2FA status
    // -------------------------------------------------------------
    const onClick = user.f2a_enabled ? openOtpForm : openChangePwd;
    btn.addEventListener("click", onClick);
    off.push(() => btn.removeEventListener("click", onClick));
}

export function teardownPwd() {
    off.forEach((fn) => fn());
    off = [];
}

