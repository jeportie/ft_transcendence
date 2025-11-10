// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleBackup.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 15:21:19 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 15:32:36 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "../../../../spa/api.js";

import { auth } from "../../../../spa/auth.js";
import { clearBox, showBox } from "../../../../spa/utils/errors.js";

export async function handleBackup({ addCleanup }) {
    const form = DOM.backupForm;
    const otpInput = DOM.backupOtp as HTMLInputElement;
    const f2aBtn = DOM.backupPreviousBtn;
    const errorBox = DOM.backupErrorDiv;

    const params = new URLSearchParams(location.search);
    const id = params.get("userId");
    const next = params.get("next") || "/dashboard";

    const onClick = () => {
        // @ts-expect-error
        window.navigateTo(`/f2a-login?userId=${id}&next=${next}`);
    }

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        clearBox(errorBox);

        const { data, error } = await API.Post("/auth/verify-backup", { code: otpInput.value, userId: id });

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

    f2aBtn?.addEventListener("click", onClick);
    form?.addEventListener("submit", onSubmit);
    otpInput?.addEventListener("focus", onFocus);

    addCleanup(() => {
        f2aBtn?.removeEventListener("click", onClick);
        form?.removeEventListener("submit", onSubmit);
        otpInput?.removeEventListener("focus", onFocus);
    });
}
