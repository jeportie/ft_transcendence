// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   delete.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/15 17:56:24 by jeportie          #+#    #+#             //
//   Updated: 2025/11/15 18:40:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "@system";
import { UserState } from "@system/core/user/UserState.js";
import { Modal } from "@components/abstract/Modal.js";
import * as STYLES from "@components/themes/index.js";
import { logger } from "@system/core/logger.js";

let off: Array<() => void> = [];
const styles = STYLES.liquidGlass;

// API routes
const verifTotp = API.routes.auth.f2a.verifyTotp;
const verifyBackup = API.routes.auth.f2a.verifyBackup;

export async function setupDelete({ ASSETS }) {
    let user = await UserState.get();

    const btn = DOM.settingsDeleteBtn;
    if (!btn)
        return;

    function openDeleteAcount() {
        DOM.createDeleteAcountFrag();
        const form = DOM.deleteAcountForm;
        const confirm = DOM.deleteAcountInput;

        const modal = new Modal({ styles });
        modal.render(DOM.fragDeleteAcount);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (confirm.value !== "DELETE")
                return alert("Please enter 'DELETE' in the input field.");
        })
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
            const { data, error } = await API.Post<{ success: boolean }>(verifTotp, { code });
            if (error || !data?.success)
                return alert("Invalid code, cannot disable.");
            modal.remove();
            openDeleteAcount();
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
            const { data, error } = await API.Post<{ success: boolean }>(verifyBackup, { code });
            if (error || !data?.success)
                return alert("Invalid code, cannot disable.");
            modal.remove();
            openDeleteAcount();
        });
    }

    const onClick = async () => {
        const user = await UserState.get(true);
        if (!user)
            return alert("Failed to fetch user info.");
        if (user.f2a_enabled) {
            openOtpForm();
        } else {
            openDeleteAcount();
        }
    };

    btn.addEventListener("click", onClick);
    off.push(() => btn.removeEventListener("click", onClick));
}

export function teardownDelete() {
    off.forEach((fn) => fn());
    off = [];
}
