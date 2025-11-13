// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleGithubButton.ts                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/13 16:39:05 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 14:18:20 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { create } from "@system/core/dom/dom.js";
import { resolveElement } from "@system/core/dom/resolveElement.js";
import { logger } from "@system/core/logger";

const log = logger.withPrefix("[HandleGithubBtn]");

interface GithubButtonParams {
    ASSETS: { githubIcon: string };
    addCleanup?: (fn: () => void) => void;
    btn?: HTMLButtonElement | null;
    getBtn?: () => HTMLButtonElement | null;
    btnSelector?: string;
    next?: string;
    logo?: { fadeAndReplaceWithLottie?: () => void };
}

export function handleGithubButton(params: GithubButtonParams) {
    const { ASSETS, addCleanup, btn, getBtn, btnSelector, next = "/dashboard", logo } = params;

    const button = resolveElement<HTMLButtonElement>({
        el: btn,
        getEl: getBtn,
        selector: btnSelector,
    });

    if (!button) {
        log.warn("No target button found");
        return;
    }

    const iconWrapper = create("span", "absolute left-6 flex items-center");
    const icon = create("img", "w-7 h-7 mr-2");
    icon.src = ASSETS.githubIcon;
    icon.alt = "Github icon";
    iconWrapper.appendChild(icon);
    button.prepend(iconWrapper);

    button.classList.add("flex", "items-center", "justify-center", "gap-2");

    const onClick = () => {
        logo?.fadeAndReplaceWithLottie?.();
        setTimeout(() => {
            window.location.href = `/api/auth/github/start?next=${encodeURIComponent(next)}`;
        }, 1800);
    };

    button.addEventListener("click", onClick);

    addCleanup?.(() => {
        button.removeEventListener("click", onClick);
        iconWrapper.remove();
    });
}
