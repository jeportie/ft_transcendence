// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Modal.liquidPanel.ts                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/19 19:04:32 by jeportie          #+#    #+#             //
//   Updated: 2025/11/19 19:04:37 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import type { ModalTheme } from "../abstract/Modal.js";

export const liquidPanel: ModalTheme = {
    createOverlay() {
        const el = document.createElement("div");
        el.dataset.modal = "overlay";

        el.className =
            "fixed inset-0 flex items-center justify-center " +
            "bg-black/70 backdrop-blur-xl z-[1200]";

        return el;
    },

    createCard() {
        const el = document.createElement("div");
        el.dataset.modal = "card";

        el.className =
            "relative w-full max-w-2xl p-10 rounded-2xl " +
            "bg-[rgba(18,18,28,0.85)] border border-white/10 " +
            "backdrop-blur-2xl shadow-2xl shadow-black/50 " +
            "overflow-hidden";

        return el;
    },

    createCloseButton() {
        const el = document.createElement("button");
        el.dataset.modal = "close";

        el.className =
            "absolute top-4 right-4 text-neutral-200 text-xl px-2 py-1 rounded-md " +
            "hover:bg-white/10 hover:text-white transition";

        el.textContent = "✕";

        return el;
    },
};
