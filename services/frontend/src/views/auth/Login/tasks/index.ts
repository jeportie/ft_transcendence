// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 10:37:24 by jeportie          #+#    #+#             //
//   Updated: 2025/10/13 16:51:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { setupLogoAnimation } from "../../../shared/setupLogoAnimation.js";
import { togglePassword } from "../../../shared/togglePassword.js";
import { handleGoogleButton } from "../../../shared/handleGoogleButton.js";
import { handleLogin } from "./handleLogin.js";
import { showActivationMessages } from "./showActivationMessages.js";

export const tasks = {
    init: [
        (ctx) => setupLogoAnimation({
            ...ctx,
            getCard: () => DOM.loginCard, // ✅ Login’s own card element
        }),
    ],

    ready: [
        ({ ASSETS, addCleanup }) => togglePassword({
            ASSETS,
            addCleanup,
            input: DOM.loginPwdInput,
        }),
        showActivationMessages,
        handleLogin,
        (ctx) => handleGoogleButton({ ...ctx, btnSelector: "#google-btn" }),
    ],

    teardown: [],
};
