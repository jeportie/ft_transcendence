// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   resetPwd.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/17 13:37:58 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 10:38:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";
import { DOM } from "../dom.generated.js";
import { clearBox, showBox } from "@jeportie/mini-js/utils";

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

    resetForm?.addEventListener("submit", event => {
        event.preventDefault();

        if (!resetPwd?.value) {
            showBox(errorBox, "Please add your new password before submiting");
            return;
        }
        if (!resetConfirm?.value || resetPwd?.value !== resetConfirm?.value) {
            showBox(errorBox, "Please confirm your new password before submiting");
            return;
        }

        const { data, error } = API.post("/auth/reset-pwd", {
            token,
            pwd: resetPwd.value,
        });

        if (error) {
            showBox(errorBox, error.message);
            return;
        }

        if (data.success) {
            showBox(infoBox, data.message);
        }
    })
}
