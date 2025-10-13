// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/13 19:30:51 by jeportie          #+#    #+#             //
//   Updated: 2025/10/13 19:48:16 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";

import { setupLogoAnimation } from "../../../shared/setupLogoAnimation.js";
import { togglePassword } from "../../../shared/togglePassword.js";
import { handleGoogleButton } from "../../../shared/handleGoogleButton.js";

export const tasks = {
    init: [
        (ctx) => setupLogoAnimation({ ASSETS: ctx.ASSETS, getCard: () => DOM.signupCard }),
    ],

    ready: [
        (ctx) => togglePassword({ ASSETS: ctx.ASSETS, addCleanup: ctx.addCleanup, input: DOM.loginPwdInput }),
        showActivationMessages,
        handleLogin,
        (ctx) => handleGoogleButton({ ...ctx, btnSelector: "#google-btn" }),
    ],

    teardown: [],
};
