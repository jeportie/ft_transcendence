// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleF2a.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 10:13:33 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 10:55:41 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "@system";
import { auth } from "@auth";
import { clearBox, showBox } from "@system/core/dom/errors.js";

// API routes
const loginTotp = API.routes.auth.f2a.loginTotp;

// @ts-expect-error Need to put the spa lib in TS
export async function handleF2a({ addCleanup }) {
    const otpInput = DOM.f2aOtp as HTMLInputElement;
    const errorBox = DOM.f2aErrorDiv;

    const params = new URLSearchParams(location.search);
    const id = params.get("userId");
    const next = params.get("next") || "/dashboard";

    const onClick = () => {
        window.navigateTo(`/backups?userId=${id}&next=${next}`);
    }

    const onSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        clearBox(errorBox);

        const { data, error } = await API.Post(loginTotp, { code: otpInput.value, userId: id });

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

    DOM.f2aBackupBtn?.addEventListener("click", onClick);
    DOM.f2aForm?.addEventListener("submit", onSubmit);
    otpInput?.addEventListener("focus", onFocus);

    addCleanup(() => {
        DOM.f2aBackupBtn?.removeEventListener("click", onClick);
        DOM.f2aForm?.removeEventListener("submit", onSubmit);
        otpInput?.removeEventListener("focus", onFocus);
    });

}
