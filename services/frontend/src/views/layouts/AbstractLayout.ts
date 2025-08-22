// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AbstractLayout.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:08:13 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 14:11:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// services/frontend/src/layouts/AbstractLayout.ts
export default class AbstractLayout {
    // You can keep a context like your AbstractView if you want
    protected ctx: any;

    constructor(ctx: any) {
        this.ctx = ctx;
    }

    async getHTML(): Promise<string> {
        // Must contain <!-- router-slot -->
        return "<!-- router-slot -->";
    }

    mount(): void { }
    destroy(): void { }
}
