// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleGoogleButton.ts                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/13 16:39:05 by jeportie          #+#    #+#             //
//   Updated: 2025/10/13 16:39:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { create } from "../../spa/utils/dom.js";

/**
 * Enhances a Google OAuth button with icon + navigation.
 */
export function handleGoogleButton({ ASSETS, addCleanup, btnSelector, next = "/dashboard", logo }) {
    const btn = document.querySelector(btnSelector) as HTMLButtonElement | null;
    if (!btn) return;

    const iconWrapper = create("span", "absolute left-4 flex items-center");
    const icon = create("img", "w-5 h-5 mr-2") as HTMLImageElement;
    icon.src = ASSETS.googleIcon;
    icon.alt = "Google icon";
    iconWrapper.appendChild(icon);
    btn.prepend(iconWrapper);

    btn.classList.add("flex", "items-center", "justify-center", "gap-2");

    const onClick = () => {
        logo?.fadeAndReplaceWithLottie?.();
        setTimeout(() => {
            window.location.href = `/api/auth/google/start?next=${encodeURIComponent(next)}`;
        }, 1800);
    };

    btn.addEventListener("click", onClick);
    addCleanup(() => {
        btn.removeEventListener("click", onClick);
        iconWrapper.remove();
    });
}
