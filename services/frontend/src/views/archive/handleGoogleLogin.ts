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
import { create } from "../../../../spa/utils/dom.js";

/**
 * Handles Google OAuth button setup and click logic.
 * Adds teardown to remove event listeners and UI icon.
 */
export function handleGoogleLogin({ ASSETS, logo, addCleanup }) {
    const btn = DOM.googleBtn;
    if (!btn) return;

    // Create icon container dynamically
    const iconWrapper = create("span", "absolute left-4 flex items-center");
    const icon = create("img", "w-5 h-5 mr-2") as HTMLImageElement;
    icon.src = ASSETS.googleIcon;
    icon.alt = "Google icon";
    iconWrapper.appendChild(icon);
    btn.prepend(iconWrapper);

    // Maintain layout consistency
    btn.classList.add("flex", "items-center", "justify-center", "gap-2");

    const onClick = () => {
        const params = new URLSearchParams(location.search);
        const next = params.get("next") || "/dashboard";

        logo?.fadeAndReplaceWithLottie();

        setTimeout(() => {
            window.location.href = `/api/auth/google/start?next=${encodeURIComponent(next)}`;
        }, 1800);
    };

    btn.addEventListener("click", onClick);

    // 🧹 Register teardown: remove event listener + UI icon
    addCleanup(() => {
        btn.removeEventListener("click", onClick);
        iconWrapper.remove();
    });
}
