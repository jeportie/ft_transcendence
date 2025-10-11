// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleGoogleLogin.ts                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:32:41 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 11:32:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { setupLogoAnimation } from "./setupLogoAnimation.js";

export function handleGoogleLogin() {
    const btn = DOM.googleBtn;
    if (!btn) return;

    const logo = setupLogoAnimation();

    btn.addEventListener("click", () => {
        const params = new URLSearchParams(location.search);
        const next = params.get("next") || "/dashboard";

        logo?.fadeAndReplaceWithLottie();
        setTimeout(() => {
            window.location.href = `/api/auth/google/start?next=${encodeURIComponent(next)}`;
        }, 1800);
    });
}
