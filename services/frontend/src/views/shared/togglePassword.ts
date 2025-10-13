// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   togglePassword.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:24:45 by jeportie          #+#    #+#             //
//   Updated: 2025/10/13 16:49:35 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { create } from "../../spa/utils/dom.js";

/**
 * Adds a show/hide toggle button to a password input.
 * @param {HTMLInputElement} input 
 */
export function togglePassword({ ASSETS, addCleanup, input }: any) {
    if (!input) return;

    const wrapper = create("div", "relative w-full");
    input.parentNode?.insertBefore(wrapper, input);
    wrapper.appendChild(input);

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
        input.type = visible ? "text" : "password";
        icon.src = visible ? ASSETS.hideIcon : ASSETS.showIcon;
    };
    btn.addEventListener("click", onClick);

    addCleanup(() => {
        btn.removeEventListener("click", onClick);
        const parent = wrapper.parentNode;
        if (parent) parent.insertBefore(input, wrapper);
        wrapper.remove();
    });
}

