// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Landing.ts                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:42:22 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 13:31:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import landingHTML from "../html/landing.html"

export default class Landing extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Welcome");
    }

    async getHTML() {
        return (landingHTML);
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
