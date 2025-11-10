// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   pwd.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/01 17:15:54 by jeportie          #+#    #+#             //
//   Updated: 2025/11/04 16:50:14 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as STYLES from "../../../../spa/themes/index.js";

import { togglePasswordSvg } from "../../../shared/togglePasswordSvg.js";

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";
import { Modal } from "../../../../spa/abstract/Modal.js";
import { UserState } from "../../../../spa/UserState.js";

let off: Array<() => void> = [];
const styles = STYLES.liquidGlass;

// @ts-expect-error
export async function setupPwd({ ASSETS }) {
    let user = await UserState.get();

    const btn = DOM.settingsPwdBtn;
    if (!btn) return;

    function openChangePwd() {
        DOM.createChangePwdFrag();
        const form = DOM.changePwdForm;
        const oldPwd = DOM.changePwdOldInput;
        const newPwd = DOM.changePwdNewInput as any;
        const confirm = DOM.changePwdConfirmInput;

        const modal = new Modal({ styles });
        modal.render(DOM.fragChangePwd);

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
                modal.remove();
            } else alert(data?.message || "Password update failed.");
        });
    }

    function openOtpForm() {
        const modal = new Modal({ styles });

        DOM.createCheck2FAFrag();
        modal.render(DOM.fragCheck2FA);
        DOM.check2faTitle.innerText = "Enter your current authenticator \
            code to change your password."

        DOM.check2faGotoBackupBtn.addEventListener("click", () => {
            modal.remove();
            openBackupForm();
        });

        DOM.check2faForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = DOM.check2faOtpInput.value;
            const { data, error } = await API.Post("/auth/verify-totp", { code });
            if (error || !data?.success) return alert("Invalid code, cannot disable.");
            modal.remove();
            openChangePwd();
        });
    }

    function openBackupForm() {
        const modal = new Modal({ styles });

        DOM.createCheckBackupFrag();
        modal.render(DOM.fragCheckBackup);
        DOM.checkBackupTitle.innerText = "Enter your current backup \
            code to change your password."

        DOM.checkBackupGoto2faBtn.addEventListener("click", () => {
            modal.remove();
            openOtpForm();
        });

        DOM.checkBackupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const code = DOM.checkBackupOtpInput.value;
            const { data, error } = await API.Post("/auth/verify-backup", { code });
            if (error || !data.success) return alert("Invalid code, cannot disable.");
            modal.remove();
            openChangePwd();
        });
    }

    const onClick = async () => {
        const user = await UserState.get(true);
        if (!user)
            return alert("Failed to fetch user info.");
        if (user.f2a_enabled) {
            openOtpForm();
        } else {
            openChangePwd();
        }
    };

    btn.addEventListener("click", onClick);
    off.push(() => btn.removeEventListener("click", onClick));
}

export function teardownPwd() {
    off.forEach((fn) => fn());
    off = [];
}
