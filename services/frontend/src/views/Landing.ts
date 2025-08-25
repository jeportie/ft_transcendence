// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Landing.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:42:22 by jeportie          #+#    #+#             //
//   Updated: 2025/08/25 18:53:33 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";

export default class Landing extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Welcome");
    }

    async getHTML() {
        return /*html*/ ``;
    }

    // mount() {
    //     const btn = document.querySelector("#login-btn");
    //     btn?.addEventListener("click", (e) => {
    //         e.preventDefault();
    //         // @ts-ignore
    //         window.navigateTo("/dashboard");
    //     });
    // }
}
