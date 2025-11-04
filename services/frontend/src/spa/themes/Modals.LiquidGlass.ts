// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Modals.LiquidGlass.ts                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/04 11:17:57 by jeportie          #+#    #+#             //
//   Updated: 2025/11/04 12:05:46 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import type { ModalStyles } from "../abstract/Modal.js";

export const liquidGlass: ModalStyles = {
    createOverlay() {
        const el = document.createElement("div");
        el.dataset.modal = "overlay";
        el.className =
            "app-modal-overlay fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[1000]";
        return el;
    },

    createCard() {
        const el = document.createElement("div");
        el.dataset.modal = "card";
        el.className = "app-modal-card relative w-full max-w-md p-6 rounded-xl";
        return el;
    },

    createCloseButton() {
        const el = document.createElement("button");
        el.dataset.modal = "close";
        el.className = "app-modal-close absolute top-0 right-2 text-neutral-200 text-lg";
        el.textContent = " ✕";
        return el;
    },
};

