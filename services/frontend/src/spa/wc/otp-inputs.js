// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   otp-inputs.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 12:06:57 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 12:08:01 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export class OtpInput extends HTMLElement {
    static formAssociated = true;

    #inputs = [];
    #length = 6;
    #internals;

    constructor() {
        super();
        this.#internals = this.attachInternals();

        const wrapper = document.createElement("div");
        wrapper.className = "flex justify-between gap-2 mb-4";
        this.appendChild(wrapper);

        this.#length = parseInt(this.getAttribute("length") || "6", 10);

        for (let i = 0; i < this.#length; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.inputMode = "numeric";
            input.className = "otp-input";
            wrapper.appendChild(input);
            this.#inputs.push(input);
        }
    }

    connectedCallback() {
        const mode = this.getAttribute("submit") || "manual";
        this.#inputs[0]?.focus();

        this.#inputs.forEach((input, idx) => {
            // forward focus/blur events
            input.addEventListener("focus", () => {
                this.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
            });
            input.addEventListener("blur", () => {
                this.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
            });

            input.addEventListener("input", () => {
                input.value = input.value.replace(/\D/g, "");
                if (input.value && idx < this.#inputs.length - 1)
                    this.#inputs[idx + 1].focus();

                const code = this.#inputs.map(i => i.value).join("");
                if (code.length === this.#length) {
                    this.#internals.setFormValue(code);
                    if (mode === "auto") this.#internals.form?.requestSubmit();
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !input.value && idx > 0)
                    this.#inputs[idx - 1].focus();
            });
        });
    }

    focus() {
        this.#inputs[0]?.focus();
    }

    get value() {
        return this.#inputs.map(i => i.value).join("");
    }

    set value(v) {
        const str = String(v || "").replace(/\D/g, "").slice(0, this.#length);
        this.#inputs.forEach((i, idx) => {
            i.value = str[idx] || "";
        });
        this.#internals.setFormValue(this.value);
    }

    clear() {
        this.value = "";
        this.focus();
    }
}

customElements.define("otp-input", OtpInput);
