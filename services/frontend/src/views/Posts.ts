// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Posts.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 19:12:34 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 13:44:05 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { AbstractView } from "@jeportie/mini-spa";
import postsHTML from "../html/posts.html";

export default class Posts extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        this.setTitle("Posts");
    }

    async getHTML() {
        return (postsHTML);
    }
}
