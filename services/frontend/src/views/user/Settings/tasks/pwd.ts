// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   pwd.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/01 17:15:54 by jeportie          #+#    #+#             //
//   Updated: 2025/11/02 18:58:39 by jeportie         ###   ########.fr       //
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

    function openChangePwd() {
        DOM.createChangePwdFrag();
        const form = DOM.changePwdForm;
        const oldPwd = DOM.changePwdOldInput;
        const newPwd = DOM.changePwdNewInput as any;
        const confirm = DOM.changePwdConfirmInput;

        const { remove } = openModalWith(DOM.fragChangePwd);

        togglePasswordSvg({ ASSETS, input: oldPwd });
        togglePasswordSvg({ ASSETS, input: confirm });

        if (user.oauth) {
            oldPwd.closest(".app-field")?.classList.add("hidden");
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

    function openOtpForm() {
        DOM.createCheck2FAFrag();
        const { remove } = openModalWith(DOM.fragCheck2FA);
        DOM.check2faTitle.innerText = "Enter your current authenticator \
            code to change your password."

        DOM.check2faGotoBackupBtn.addEventListener("click", () => {
            remove();
            openBackupForm();
        });

        DOM.check2faForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = DOM.check2faOtpInput.value;
            const { data, error } = await API.Post("/auth/verify-totp", { code });
            if (error || !data?.success) return alert("Invalid code, cannot disable.");
            remove();
            openChangePwd();
        });
    }

    function openBackupForm() {
        DOM.createCheckBackupFrag();
        const { remove } = openModalWith(DOM.fragCheckBackup);
        DOM.checkBackupTitle.innerText = "Enter your current backup \
            code to change your password."

        DOM.checkBackupGoto2faBtn.addEventListener("click", () => {
            remove();
            openOtpForm();
        });

        DOM.checkBackupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = DOM.checkBackupOtpInput.value;
            const { data, error } = await API.Post("/auth/verify-backup", { code });
            if (error || !data.success) return alert("Invalid code, cannot disable.");
            remove();
            openChangePwd();
        });
    }

    const onClick = user.f2a_enabled ? openOtpForm : openChangePwd;
    btn.addEventListener("click", onClick);
    off.push(() => btn.removeEventListener("click", onClick));
}

export function teardownPwd() {
    off.forEach((fn) => fn());
    off = [];
}
