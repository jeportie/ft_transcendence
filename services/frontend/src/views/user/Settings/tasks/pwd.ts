// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   pwd.ts                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 22:00:47 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 23:00:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";
import pwdCardHTML from "../templates/ChangePwd.html";
import { openModalWith } from "../../../../spa/utils/modal.js";

let off: Array<() => void> = [];

export function setupPwd() {
    const btn = document.querySelector<HTMLButtonElement>("#btn-open-pwd");
    if (!btn) return;

    const onClick = async () => {
        const tpl = document.createElement("template");
        tpl.innerHTML = pwdCardHTML.trim();
        const frag = tpl.content.cloneNode(true) as DocumentFragment;
        const { remove } = openModalWith(frag);

        const form = document.querySelector<HTMLFormElement>("#pwd-form")!;
        const oldPwd = document.querySelector<HTMLInputElement>("#old-pwd")!;
        const newPwd = document.querySelector<HTMLInputElement>("#new-pwd")!;
        const confirm = document.querySelector<HTMLInputElement>("#confirm-pwd")!;
        const hint = document.querySelector<HTMLElement>("#pwd-hint")!;

        const me = await API.Get("/user/me");
        const user = me?.data?.me;
        if (user?.oauth) {
            oldPwd.closest(".app-field")?.classList.add("hidden");
            hint.textContent = "This account was created with OAuth. You can set a local password below.";
        }

        const onSubmit = async (e: Event) => {
            e.preventDefault();
            if (!user?.oauth && !oldPwd.value) return alert("Missing old password.");
            if (!newPwd.value) return alert("Missing new password.");
            if (confirm.value !== newPwd.value) return alert("Please confirm the same new password.");

            const { data, error } = await API.Post("/user/modify-pwd", {
                username: user.username, oauth: !!user.oauth,
                oldPwd: oldPwd.value, newPwd: newPwd.value,
            });
            if (error) return alert("Error while updating password.");
            if (data?.success) { alert("Password updated successfully."); form.reset(); remove(); }
            else alert(data?.message || "Password update failed.");
        };

        form.addEventListener("submit", onSubmit);
        off.push(() => form.removeEventListener("submit", onSubmit));
    };

    btn.addEventListener("click", onClick);
    off.push(() => btn.removeEventListener("click", onClick));
}

export function teardownPwd() { off.forEach(fn => fn()); off = []; }
