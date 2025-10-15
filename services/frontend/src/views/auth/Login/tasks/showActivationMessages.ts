// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   showActivationMessage.ts                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:33:34 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 11:33:40 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";

export function showActivationMessages({ addCleanup }) {
    const params = new URLSearchParams(location.search);
    const activated = params.get("activated");
    const error = params.get("activation_failed");
    const card = DOM.loginCard;
    if (!card) return;

    const timeouts: number[] = [];
    const messages: HTMLElement[] = [];

    function show(text: string, className: string) {
        const msg = document.createElement("div");
        msg.textContent = text;
        msg.className = className;
        card.prepend(msg);
        messages.push(msg);
        timeouts.push(window.setTimeout(() => msg.remove(), 4000));
    }

    if (activated)
        show("Your account has been activated successfully!", "ui-card-alert ui-alert-success mb-4");
    if (error)
        show("Error: Account not activated", "ui-alert ui-alert-error mb-4");

    addCleanup(() => {
        timeouts.forEach(clearTimeout);
        messages.forEach(m => m.remove());
    });
}
