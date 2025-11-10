// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   togglePassword.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:24:45 by jeportie          #+#    #+#             //
//   Updated: 2025/10/30 15:14:42 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { create } from "../../spa/utils/dom.js";
import { resolveElement } from "../../spa/utils/resolveElement.js";

interface TogglePasswordParams {
    ASSETS: { showIcon: string; hideIcon: string };
    addCleanup?: (fn: () => void) => void;
    input?: HTMLInputElement | null;
    getInput?: () => HTMLInputElement | null;
    inputSelector?: string;
}

export function togglePassword(params: TogglePasswordParams) {
    const { ASSETS, addCleanup, input, getInput, inputSelector } = params;

    const targetInput = resolveElement<HTMLInputElement>({
        el: input,
        getEl: getInput,
        selector: inputSelector,
    });

    if (!targetInput) {
        console.warn("[togglePassword] No target input found");
        return;
    }

    const wrapper = create("div", "relative w-full");
    targetInput.parentNode?.insertBefore(wrapper, targetInput);
    wrapper.appendChild(targetInput);

    const btn = create(
        "button",
        "absolute inset-y-0 right-3 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
    );
    btn.type = "button";

    const icon = create("img", "w-5 h-5 select-none") as HTMLImageElement;
    icon.src = ASSETS.showIcon;
    btn.appendChild(icon);
    wrapper.appendChild(btn);

    let visible = false;
    const onClick = (e: MouseEvent) => {
        e.preventDefault();
        visible = !visible;
        targetInput.type = visible ? "text" : "password";
        icon.src = visible ? ASSETS.hideIcon : ASSETS.showIcon;
    };

    btn.addEventListener("click", onClick);

    addCleanup?.(() => {
        btn.removeEventListener("click", onClick);
        wrapper.parentNode?.insertBefore(targetInput, wrapper);
        wrapper.remove();
    });
}
