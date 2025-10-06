// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Activate.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/06 13:39:24 by jeportie          #+#    #+#             //
//   Updated: 2025/10/06 14:18:06 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import activateHTML from "../html/activate.html";
import { API } from "../spa/api.js";

export default class Activate extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Activate Account");
    }

    async getHTML() {
        return (activateHTML);
    }
    async mount() {
        (this as any).layout?.reloadOnExit?.();

        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
            console.error("No token found in URL");
            return window.navigateTo("/login?activation_failed=1");
        }
        try {
            const res = await API.get(`/auth/activate/${token}`);
            window.navigateTo("/login?activated=1");
        } catch (err) {
            console.error("Activation failed:", err);
            window.navigateTo("/login?activation_failed=1");
        }
    }
}
