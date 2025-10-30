// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   pwd.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 22:00:47 by jeportie          #+#    #+#             //
//   Updated: 2025/10/30 15:15:43 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //


import { API } from "../../../../spa/api.js";
import pwdCardHTML from "../templates/ChangePwd.html";
import { openModalWith } from "../../../../spa/utils/modal.js";
import { togglePasswordSvg } from "../../../shared/togglePasswordSvg.js";

let off: Array<() => void> = [];

export function setupPwd({ ASSETS }) {
    const btn = document.querySelector<HTMLButtonElement>("#btn-open-pwd");
    if (!btn) return;

    const onClick = async () => {
        const tpl = document.createElement("template");
        tpl.innerHTML = pwdCardHTML.trim();
        const innerTpl = tpl.content.querySelector("template") as HTMLTemplateElement;
        const frag = innerTpl.content.cloneNode(true) as DocumentFragment;

        const form = frag.querySelector<HTMLFormElement>("#pwd-form")!;
        const oldPwd = frag.querySelector<HTMLInputElement>("#old-pwd")!;
        const newPwd = frag.querySelector("#new-pwd")! as any;
        const confirm = frag.querySelector<HTMLInputElement>("#confirm-pwd")!;
        const hint = frag.querySelector<HTMLElement>("#pwd-hint")!;

        const { remove } = openModalWith(frag);

        togglePasswordSvg({ ASSETS, input: oldPwd });
        togglePasswordSvg({ ASSETS, input: confirm });

        const me = await API.Get("/user/me");
        const user = me?.data?.me;

        if (user?.oauth) {
            oldPwd.closest(".app-field")?.classList.add("hidden");
            hint.textContent =
                "This account was created with OAuth. You can set a local password below.";
        }

        const onSubmit = async (e: Event) => {
            e.preventDefault();
            const newPwdEl = form.querySelector("#new-pwd") as any;
            if (!newPwdEl.value || confirm.value !== newPwdEl.value) {
                newPwdEl.markInvalid();
                return alert("Please enter a valid password and confirmation.");
            }

            const { data, error } = await API.Post("/user/modify-pwd", {
                username: user.username,
                oauth: !!user.oauth,
                oldPwd: oldPwd.value,
                newPwd: newPwd.value,
            });

            if (error) return alert("Error while updating password.");
            if (data?.success) {
                alert("Password updated successfully.");
                form.reset();
                remove();
            } else alert(data?.message || "Password update failed.");
        };

        form.addEventListener("submit", onSubmit);
        off.push(() => form.removeEventListener("submit", onSubmit));
    };

    btn.addEventListener("click", onClick);
    off.push(() => btn.removeEventListener("click", onClick));
}

export function teardownPwd() {
    off.forEach((fn) => fn());
    off = [];
}

