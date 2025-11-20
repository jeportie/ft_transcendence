// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   resetPwd.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/17 13:37:58 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 13:10:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "@system";
import { DOM } from "../dom.generated.js";
import { showBox, clearBox } from "@system/core/dom/errors.js";

// API routes
const reset_pwd = API.routes.auth.local.resetPwd;

export async function resetPwd() {
    const resetForm = DOM.resetForm;
    const resetPwd = DOM.resetPwdInput;
    const resetConfirm = DOM.resetConfirmInput;
    const errorBox = DOM.resetErrorDiv;
    const infoBox = DOM.resetInfoDiv;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    resetPwd?.addEventListener("focus", () => {
        clearBox(errorBox);
    })

    resetForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!resetPwd?.value) {
            showBox(errorBox, "Please add your new password before submiting");
            return;
        }
        if (!resetConfirm?.value || resetPwd?.value !== resetConfirm?.value) {
            showBox(errorBox, "Please confirm your new password before submiting");
            return;
        }

        const { data, error } = await API.Post<{ success: boolean, message: string }>(reset_pwd, {
            token,
            pwd: resetPwd.value,
        });

        if (error) {
            showBox(errorBox, error.message);
            return;
        }

        if (data?.success) {
            showBox(infoBox, data?.message);
        }
    })
}
