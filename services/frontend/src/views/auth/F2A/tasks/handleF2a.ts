// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleF2a.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 10:13:33 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 13:07:20 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";

import { auth } from "../../../../spa/auth.js";
import { clearBox, showBox } from "../../../../spa/utils/errors.js";

export async function handleF2a({ addCleanup }) {
    const form = DOM.f2aForm;
    const otpInput = DOM.f2aOtp as HTMLInputElement;
    const backupBtn = DOM.f2aBackupBtn;
    const errorBox = DOM.f2aErrorDiv;

    const params = new URLSearchParams(location.search);
    const id = params.get("userId");
    const next = params.get("next") || "/dashboard";

    const onClick = () => {
        // @ts-expect-error
        window.navigateTo(`/backups?userId=${id}&next=${next}`);
    }

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        clearBox(errorBox);

        const { data, error } = await API.Post("/auth/login-totp", { code: otpInput.value, userId: id });

        if (error) {
            otpInput.value = "";
            otpInput?.focus();
            showBox(errorBox, error.message);
            return;
        }
        if (data.success) {
            auth.setToken(data.token || "dev-token");
            // @ts-expect-error
            setTimeout(() => window.navigateTo(next), 0);
        }
    }

    const onFocus = () => {
        clearBox(errorBox);
    };

    backupBtn?.addEventListener("click", onClick);
    form?.addEventListener("submit", onSubmit);
    otpInput?.addEventListener("focus", onFocus);

    addCleanup(() => {
        backupBtn?.removeEventListener("click", onClick);
        form?.removeEventListener("submit", onSubmit);
        otpInput?.removeEventListener("focus", onFocus);
    });

}
