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

export default class {

    constructor(params) {
        this.params = params;

        console.log(this.params);
    };

    setTitle(title) {
        document.title = title;
    };

    async getHTML() {
        return "";
    }

    mount() { }                       // bind DOM events here

    destroy() { }                     // cleanup timers/sockets/listeners
}
