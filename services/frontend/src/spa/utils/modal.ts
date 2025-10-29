// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   modal.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 21:45:29 by jeportie          #+#    #+#             //
//   Updated: 2025/10/29 22:59:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function openModalWith(content: HTMLElement | DocumentFragment) {
    const overlay = document.createElement("div");
    overlay.className = "app-modal-overlay";
    const cardWrap = document.createElement("div");
    cardWrap.className = "app-modal-card";

    const close = document.createElement("button");
    close.className = "app-modal-close";
    close.setAttribute("aria-label", "Close");
    close.textContent = " ✕";

    cardWrap.appendChild(close);
    cardWrap.appendChild(content);
    overlay.appendChild(cardWrap);
    document.body.appendChild(overlay);

    const remove = () => overlay.remove();
    close.addEventListener("click", remove);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) remove(); });
    return { remove, overlay, cardWrap };
}
