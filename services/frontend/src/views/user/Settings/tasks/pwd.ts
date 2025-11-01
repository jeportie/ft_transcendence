// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   pwd.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 22:00:47 by jeportie          #+#    #+#             //
//   Updated: 2025/10/30 23:01:27 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";
import pwdCardHTML from "../templates/ChangePwd.html";
import { openModalWith } from "../../../../spa/utils/modal.js";
import { togglePasswordSvg } from "../../../shared/togglePasswordSvg.js";

let off: Array<() => void> = [];

// @ts-expect-error
export function setupPwd({ ASSETS }) {
    const btn = DOM.settingsPwdBtn;
    if (!btn) return;

    const onClick = async () => {
        const me = await API.Get("/user/me");
        const user = me?.data?.me;

        function changePwd() {
            DOM.createChangePwdFrag();
            const frag = DOM.fragChangePwd as any;
            const form = DOM.pwdForm;
            const oldPwd = DOM.oldPwd;
            const newPwd = DOM.newPwd as any;
            const confirm = DOM.confirmPwd;
            const hint = DOM.pwdHint;
            const normal = DOM.pwdNormalDiv;

            normal.classList.remove("hidden");
            const { remove } = openModalWith(frag);

            togglePasswordSvg({ ASSETS, input: oldPwd });
            togglePasswordSvg({ ASSETS, input: confirm });

            if (user.oauth) {
                oldPwd.closest(".app-field")?.classList.add("hidden");
                hint.textContent = "This account was created with OAuth. You can set a local password below.";
                btn.innerText = "Create";
            }

            const onSubmit = async (e: Event) => {
                e.preventDefault();
                if (!newPwd.value || confirm?.value !== newPwd.value) {
                    newPwd.markInvalid();
                    return alert("Please enter a valid password and confirmation.");
                }
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
            };

            form.addEventListener("submit", onSubmit);
            off.push(() => form.removeEventListener("submit", onSubmit));

        }

        function verifyBackupCodes() {
            DOM.createChangePwdFrag();
            DOM.pwdBackupWrap.classList.remove("hidden");
            const { remove } = openModalWith(DOM.fragChangePwd);

            DOM.pwdBackOtpForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const code = DOM.pwdBackupCode.value;
                const { data, error } = await API.Post("/auth/verify-backup", { code });
                if (error || !data.success)
                    return alert("Invalid code, cannot disable.");
                remove();
                changePwd();
            })

        }

        if (user.f2a_enabled) {
            DOM.createChangePwdFrag();
            const frag = DOM.fragChangePwd;
            const otpForm = DOM.pwdOtpForm;
            const disableCode = DOM.pwdDisableCode;
            const disableWrap = DOM.pwdDisableWrap;
            const toBackup = DOM.pwdBackupBtn;

            disableWrap.classList.remove("hidden");
            const { remove } = openModalWith(frag);

            toBackup.addEventListener("click", () => {
                console.log("Clicked");
                remove();
                verifyBackupCodes();
            })

            otpForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const code = disableCode.value;
                const { data, error } = await API.Post("/auth/verify-totp", { code });
                if (error || !data?.success)
                    return alert("Invalid code, cannot disable.");
                remove();
                changePwd();
            })

        } else {
            changePwd();
        }
    };

    btn.addEventListener("click", onClick);
    off.push(() => btn.removeEventListener("click", onClick));
}

export function teardownPwd() {
    off.forEach((fn) => fn());
    off = [];
}

