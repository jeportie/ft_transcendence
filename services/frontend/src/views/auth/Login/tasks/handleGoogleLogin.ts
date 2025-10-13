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
import { create } from "../../../../spa/utils/dom.js";

export function handleGoogleLogin({ ASSETS }) {
    const btn = DOM.googleBtn;
    console.log("BTN FOUND:", btn, btn?.innerHTML);
    if (!btn) return;

    // Create icon container
    const iconWrapper = create("span", "absolute left-4 flex items-center");
    const icon = create("img", "w-5 h-5 mr-2") as HTMLImageElement;
    icon.src = ASSETS.googleIcon;
    icon.alt = "Google icon";
    iconWrapper.appendChild(icon);
    btn.prepend(iconWrapper);
    console.log("AFTER PREPEND:", btn.innerHTML);

    // Keep nice flex alignment
    btn.classList.add("flex", "items-center", "justify-center", "gap-2");

    const logo = setupLogoAnimation({ ASSETS });

    btn.addEventListener("click", () => {
        const params = new URLSearchParams(location.search);
        const next = params.get("next") || "/dashboard";
        logo?.fadeAndReplaceWithLottie();
        setTimeout(() => {
            window.location.href = `/api/auth/google/start?next=${encodeURIComponent(next)}`;
        }, 1800);
    });
}
