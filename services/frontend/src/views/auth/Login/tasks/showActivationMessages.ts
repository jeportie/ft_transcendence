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

export function showActivationMessages() {
    const params = new URLSearchParams(location.search);
    const activated = params.get("activated");
    const error = params.get("activation_failed");
    const card = DOM.loginCard;
    if (!card) return;

    if (activated) {
        const msg = document.createElement("div");
        msg.textContent = "Your account has been activated successfully!";
        msg.className = "ui-card-alert ui-alert-success mb-4";
        card.prepend(msg);
        setTimeout(() => msg.remove(), 4000);
    }

    if (error) {
        const msg = document.createElement("div");
        msg.textContent = "Error: Account not activated";
        msg.className = "ui-alert ui-alert-error mb-4";
        card.prepend(msg);
        setTimeout(() => msg.remove(), 4000);
    }
}
