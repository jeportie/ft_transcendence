// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   tooglePassword.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:24:45 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 13:29:30 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { create } from "../../../../spa/utils/dom.js";

export function togglePassword({ ASSETS, addCleanup }) {
    const userPwd = DOM.loginPwdInput;
    if (!userPwd) return;

    const wrapper = create("div", "relative w-full");
    userPwd.parentNode?.insertBefore(wrapper, userPwd);
    wrapper.appendChild(userPwd);

    const btn = create(
        "button",
        "absolute inset-y-0 right-3 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
    );
    btn.type = "button";
    btn.style.cursor = "pointer";

    const icon = create("img", "w-5 h-5 select-none") as HTMLImageElement;
    icon.src = ASSETS.showIcon;
    icon.alt = "Show password";

    btn.appendChild(icon);
    wrapper.appendChild(btn);

    let visible = false;
    const onClick = (e: MouseEvent) => {
        e.preventDefault();
        visible = !visible;
        userPwd.type = visible ? "text" : "password";
        icon.src = visible ? ASSETS.hideIcon : ASSETS.showIcon;
        icon.alt = visible ? "Hide password" : "Show password";
    };

    btn.addEventListener("click", onClick);

    addCleanup(() => {
        btn.removeEventListener("click", onClick);
        const parent = wrapper.parentNode;
        if (parent) parent.insertBefore(userPwd, wrapper);
        wrapper.remove();
    });
}

