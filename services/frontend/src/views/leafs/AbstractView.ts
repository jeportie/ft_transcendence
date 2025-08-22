// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AbstractView.ts                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/14 18:36:41 by jeportie          #+#    #+#             //
//   Updated: 2025/08/19 12:40:17 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export type ViewCtx = {
    path: string;
    params: Record<string, string>;
    query: Record<string, string>;
    hash: string;
    state: any;
};

export default class AbstractView {
    protected ctx: ViewCtx;

    constructor(ctx: ViewCtx) {
        this.ctx = ctx;

        console.log(this.ctx);
    };

    setTitle(title: string) {
        document.title = title;
    };

    async getHTML() {
        return "";
    }

    mount(): void { }                       // bind DOM events here

    destroy(): void { }                     // cleanup timers/sockets/listeners
}
