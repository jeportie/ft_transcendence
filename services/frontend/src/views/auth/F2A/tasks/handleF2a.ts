// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleF2a.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 10:13:33 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 10:13:38 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";

import { auth } from "../../../../spa/auth.js";
import { setupOtpInputs } from "../../../../spa/wc/otp-inputs.ts";
import { clearBox, showBox } from "../../../../spa/utils/errors.js";

export async function handleF2a() {
    const backupBtn = DOM.f2aBackupBtn;
    const otpInputs = DOM.f2aInputs;
    const errorBox = DOM.f2aErrorDiv;

    const params = new URLSearchParams(location.search);
    const id = params.get("userId");
    const next = params.get("next") || "/dashboard";

    backupBtn?.addEventListener("click", () => {
        // @ts-expect-error
        window.navigateTo(`/backups?userId=${id}&next=${next}`);
    });

    const code = await setupOtpInputs(otpInputs);
    const { data, error } = await API.Post("/auth/login-totp", { code, userId: id });

    if (error) {
        // reset otp inputs + focus on inputs[0]
        showBox(errorBox, error.message);
        return;
    }
    if (data.success) {
        auth.setToken(data.token || "dev-token");
        // @ts-expect-error
        setTimeout(() => window.navigateTo(next), 0);
    }
}
