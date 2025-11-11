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

// @ts-expect-error
export function showActivationMessages({ addCleanup }) {
    const params = new URLSearchParams(location.search);
    const activated = params.get("activated");
    const error = params.get("activation_failed");
    const error_message = params.get("error_message");
    const timeouts: number[] = [];
    const messages: HTMLElement[] = [];

    if (!DOM.loginCard)
        return;

    function show(text: string, className: string) {
        const msg = document.createElement("div");
        msg.textContent = text;
        msg.className = className;
        DOM.loginCard?.prepend(msg);
        messages.push(msg);
        timeouts.push(window.setTimeout(() => msg.remove(), 4000));
    }

    let decodedErrorMsg = error_message ? decodeURIComponent(error_message) : null;

    if (activated)
        show("Your account has been activated successfully!", "ui-card-alert ui-alert-success mb-4");
    if (error)
        show(`Error: Account not activated: ${decodedErrorMsg}`, "ui-card-alert ui-alert-error mb-4");

    addCleanup(() => {
        timeouts.forEach(clearTimeout);
        messages.forEach(m => m.remove());
    });
}
