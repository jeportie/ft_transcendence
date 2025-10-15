// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupOtpInputs.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/15 10:13:56 by jeportie          #+#    #+#             //
//   Updated: 2025/10/15 11:26:58 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

/**
 * Initialize OTP-style input behavior inside a container.
 * Automatically handles focus, backspace, paste, and validation.
 *
 * @param container - The element containing the inputs
 * @returns a promise that returns the current code string
 */

export async function setupOtpInputs(container: HTMLElement) {
    if (!container)
        return;

    const inputs = Array.from(container.querySelectorAll<HTMLInputElement>("input.otp-input"));
    const length = inputs.length;

    return new Promise((resolve) => {
        const getCode = () => inputs.map(i => i.value).join("");

        inputs.forEach((input, idx) => {
            input.addEventListener("input", () => {
                const value = input.value.replace(/\D/g, "");
                input.value = value;

                if (value && idx < inputs.length - 1) inputs[idx + 1].focus();

                const code = getCode();
                if (code.length === length) resolve(code);
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !input.value && idx > 0)
                    inputs[idx - 1].focus();
            });

            input.addEventListener("paste", (e) => {
                e.preventDefault();
                const paste = (e.clipboardData?.getData("text") ?? "")
                    .replace(/\D/g, "")
                    .slice(0, length);

                paste.split("").forEach((digit, i) => {
                    if (inputs[i]) inputs[i].value = digit;
                });

                const code = getCode();
                if (code.length === length) resolve(code);
            });
        });
    });
}
