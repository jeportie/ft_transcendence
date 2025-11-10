// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Modal.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/04 12:10:00 by jeportie          #+#    #+#             //
//   Updated: 2025/11/04 12:19:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export interface ModalTheme {
    createOverlay(): HTMLElement;
    createCard(): HTMLElement;
    createCloseButton(): HTMLElement;
}

export interface ModalOptions {
    styles: ModalTheme;
    closeOnOverlay?: boolean;
    closeOnEsc?: boolean;
    animate?: boolean;
    zIndex?: number;
}

/**
 * Modal
 * -----------------------------------------------------
 * A ready-to-use modal class: instantiate, render content, close.
 * Example:
 *   const modal = new Modal({ theme: liquidGlassTheme });
 *   modal.render(DOM.fragActivate2FA);
 *   ...
 *   modal.remove();
 */
export class Modal {
    #overlay!: HTMLElement;
    #card!: HTMLElement;
    #closeBtn!: HTMLElement;
    #options: ModalOptions;
    #isOpen = false;

    constructor(options: ModalOptions) {
        this.#options = {
            closeOnOverlay: true,
            closeOnEsc: true,
            animate: true,
            zIndex: 1000,
            ...options,
        };
    }

    render(content: HTMLElement | DocumentFragment) {
        if (this.#isOpen) return;
        this.#isOpen = true;

        const theme = this.#options.styles;
        this.#overlay = theme.createOverlay();
        this.#card = theme.createCard();
        this.#closeBtn = theme.createCloseButton();

        this.#card.appendChild(this.#closeBtn);
        this.#card.appendChild(content);
        this.#overlay.appendChild(this.#card);
        document.body.appendChild(this.#overlay);

        this.#bindEvents();

        if (this.#options.animate)
            requestAnimationFrame(() => this.#card.classList.add("modal-enter"));
    }


    remove() {
        if (!this.#isOpen) return;
        this.#isOpen = false;
        this.#destroy();
    }


    #destroy() {
        document.removeEventListener("keydown", this.#onEsc);
        this.#overlay?.remove();
    }

    #onEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") this.remove();
    };

    #bindEvents() {
        this.#closeBtn.addEventListener("click", () => this.remove());
        if (this.#options.closeOnOverlay)
            this.#overlay.addEventListener("click", (e) => {
                if (e.target === this.#overlay) this.remove();
            });
        if (this.#options.closeOnEsc)
            document.addEventListener("keydown", this.#onEsc);
    }
}

