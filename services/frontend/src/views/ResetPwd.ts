// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   ResetPwd.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/23 13:56:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/07 10:48:28 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import resetHTML from "../html/resetPwd.html";

export default class ResetPwd extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("Reset Pwd");
    }

    async getHTML() {
        return (resetHTML);
    }

    async mount() {
        (this as any).layout?.reloadOnExit?.();

        // DOM
        const resetForm = document.querySelector("#reset-form") as HTMLFormElement || null;
        const resetOldPwd = document.querySelector("#reset-old-pwd") as HTMLInputElement || null;
        const resetPwd = document.querySelector("#reset-pwd") as HTMLInputElement || null;
        const resetConfirm = document.querySelector("#reset-confirm") as HTMLInputElement || null;
        const resetError = document.querySelector("#reset-error") as HTMLDivElement || null;
        const resetInfo = document.querySelector("#reset-info") as HTMLDivElement || null;

        resetPwd.addEventListener("focus", () => {
            resetError.classList.add("hidden");
            resetError.textContent = "";
        })

        resetForm?.addEventListener("submit", event => {
            event.preventDefault();

            if (!resetOldPwd.value) {
                resetError.textContent = "Please add your old password before submiting";
                resetError.classList.remove("hidden");
                return;
            }
            if (!resetPwd.value) {
                resetError.textContent = "Please add your new password before submiting";
                resetError.classList.remove("hidden");
                return;
            }
            if (!resetConfirm.value || resetPwd.value !== resetConfirm.value) {
                resetError.textContent = "Please confirm your new password before submiting";
                resetError.classList.remove("hidden");
                return;
            }

            API.post("/auth/reset-pwd", {
                user_id: "",
                pwd: resetPwd.value,
            }).then(data => {

            }).catch(err => {
                if (resetError) {
                    resetError.textContent = err.error;
                    resetError.classList.remove("hidden");
                }
            })
        })
    }
}
