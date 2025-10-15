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

/**
 * <otp-input length="6"></otp-input>
 *
 * Emits a 'submit' CustomEvent when all digits are filled.
 * Usage:
 *   const otp = document.querySelector("otp-input");
 *   otp.addEventListener("submit", (e) => console.log(e.detail.code));
 */

export class OtpInput extends HTMLElement {
    #inputs = [];
    #length = 6;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        // Style (you can customize)
        const style = document.createElement("style");
        style.textContent = `
      .otp-wrapper {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
      }
      input {
        width: 2rem;
        height: 2.5rem;
        text-align: center;
        font-size: 1.25rem;
        border: 1px solid #666;
        border-radius: 6px;
      }
      input:focus {
        outline: 2px solid #00bcd4;
        border-color: #00bcd4;
      }
    `;
        shadow.appendChild(style);

        // Structure
        const wrapper = document.createElement("div");
        wrapper.classList.add("otp-wrapper");
        shadow.appendChild(wrapper);

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
        this.#inputs[0]?.focus();

        this.#inputs.forEach((input, idx) => {
            input.addEventListener("input", () => {
                input.value = input.value.replace(/\D/g, "");
                if (input.value && idx < this.#inputs.length - 1)
                    this.#inputs[idx + 1].focus();

                const code = this.#inputs.map(i => i.value).join("");
                if (code.length === this.#length) {
                    this.dispatchEvent(new CustomEvent("submit", {
                        detail: { code },
                        bubbles: true,
                        composed: true,
                    }));
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !input.value && idx > 0)
                    this.#inputs[idx - 1].focus();
            });

            input.addEventListener("paste", (e) => {
                e.preventDefault();
                const paste = (e.clipboardData?.getData("text") ?? "")
                    .replace(/\D/g, "")
                    .slice(0, this.#length);

                paste.split("").forEach((digit, i) => {
                    if (this.#inputs[i]) this.#inputs[i].value = digit;
                });

                const code = this.#inputs.map(i => i.value).join("");
                if (code.length === this.#length) {
                    this.dispatchEvent(new CustomEvent("submit", {
                        detail: { code },
                        bubbles: true,
                        composed: true,
                    }));
                }
            });
        });
    }

    clear() {
        this.#inputs.forEach(i => i.value = "");
        this.#inputs[0]?.focus();
    }
}

customElements.define("otp-input", OtpInput);
