// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleGoogleButton.ts                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/13 16:39:05 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 00:06:00 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { create } from "@system/core/dom/dom.js";
import { resolveElement } from "@system/core/dom/resolveElement.js";

interface GoogleButtonParams {
    ASSETS: { googleIcon: string };
    addCleanup?: (fn: () => void) => void;
    btn?: HTMLButtonElement | null;
    getBtn?: () => HTMLButtonElement | null;
    btnSelector?: string;
    next?: string;
    logo?: { fadeAndReplaceWithLottie?: () => void };
}

export function handleGoogleButton(params: GoogleButtonParams) {
    const { ASSETS, addCleanup, btn, getBtn, btnSelector, next = "/dashboard", logo } = params;

    const button = resolveElement<HTMLButtonElement>({
        el: btn,
        getEl: getBtn,
        selector: btnSelector,
    });

    if (!button) {
        console.warn("[handleGoogleButton] No target button found");
        return;
    }

    const iconWrapper = create("span", "absolute left-4 flex items-center");
    const icon = create("img", "w-10 h-10 mr-2");
    icon.src = ASSETS.googleIcon;
    icon.alt = "Google icon";
    iconWrapper.appendChild(icon);
    button.prepend(iconWrapper);

    button.classList.add("flex", "items-center", "justify-center", "gap-2");

    const onClick = () => {
        logo?.fadeAndReplaceWithLottie?.();
        setTimeout(() => {
            window.location.href = `/api/auth/google/start?next=${encodeURIComponent(next)}`;
        }, 1800);
    };

    button.addEventListener("click", onClick);

    addCleanup?.(() => {
        button.removeEventListener("click", onClick);
        iconWrapper.remove();
    });
}
