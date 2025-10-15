// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   otp-inputs.js                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 12:06:57 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 15:50:57 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export class OtpInput extends HTMLElement {
    static formAssociated = true;

    #inputs = [];
    #length = 6;
    #positions = [];
    #internals;

    constructor() {
        super();
        this.#internals = this.attachInternals();

        const divclass = this.getAttribute("divclass") || "flex justify-between gap-2 mb-4 items-center";

        const wrapper = document.createElement("div");
        wrapper.className = divclass;
        this.appendChild(wrapper);

        this.#length = parseInt(this.getAttribute("length") || "6", 10);

        const symbol = this.getAttribute("separator") || "-";
        const inclass = this.getAttribute("inclass") || "otp-input w-10 text-center";

        // Parse "position" attribute: e.g. "1-3-5" → [1, 3, 5]
        const positionAttr = this.getAttribute("position");
        if (positionAttr) {
            this.#positions = positionAttr
                .split("-")
                .map((n) => parseInt(n.trim(), 10))
                .filter((n) => !isNaN(n) && n > 0 && n < this.#length);
        }

        for (let i = 0; i < this.#length; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.inputMode = "numeric";
            input.className = inclass;
            wrapper.appendChild(input);
            this.#inputs.push(input);

            if (this.#positions.includes(i + 1) && i < this.#length - 1) {
                const sep = document.createElement("span");
                sep.textContent = symbol;
                sep.className =
                    "otp-separator select-none text-gray-400 text-xl font-semibold flex items-center justify-center";
                wrapper.appendChild(sep);
            }
        }
    }

    connectedCallback() {
        const mode = this.getAttribute("submit") || "manual";
        this.#inputs[0]?.focus();

        this.#inputs.forEach((input, idx) => {
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

                const code = this.#inputs.map((i) => i.value).join("");
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
        return this.#inputs.map((i) => i.value).join("");
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
