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
import { API } from "@system";
import { auth } from "@auth";
import { clearBox, showBox } from "@system/core/dom/errors.js";

// API routes
const verifyBackup = API.routes.auth.f2a.verifyBackup;

// @ts-expect-error Need to put the spa lib in TS
export async function handleBackup({ addCleanup }) {
    const form = DOM.backupForm;
    const otpInput = DOM.backupOtp as HTMLInputElement;
    const f2aBtn = DOM.backupPreviousBtn;
    const errorBox = DOM.backupErrorDiv;

    const params = new URLSearchParams(location.search);
    const id = params.get("userId");
    const next = params.get("next") || "/dashboard";

    const onClick = () => {
        window.navigateTo(`/f2a-login?userId=${id}&next=${next}`);
    }

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        clearBox(errorBox);

        const { data, error } = await API.Post(verifyBackup, { code: otpInput.value, userId: id });

        if (error) {
            otpInput.value = "";
            otpInput?.focus();
            showBox(errorBox, error.message);
            return;
        }
        if (data.success) {
            auth.setToken(data.token || "dev-token");
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
