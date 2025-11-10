// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 10:37:24 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 01:07:18 by jeportie         ###   ########.fr       //
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
        (ctx: any) =>
            setupLogoAnimation({
                ASSETS: ctx.ASSETS,
                getCard: () => DOM.loginCard,
            }),
    ],

    ready: [
        (ctx: any) =>
            togglePassword({
                ASSETS: ctx.ASSETS,
                addCleanup: ctx.addCleanup,
                input: DOM.loginPwdInput,
            }),
        showActivationMessages,
        handleLogin,
        (ctx: any) =>
            handleGoogleButton({
                ASSETS: ctx.ASSETS,
                addCleanup: ctx.addCleanup,
                btn: DOM.loginGoogleBtn,
                logo: ctx.logo,
            }),
    ],

    teardown: [],
};
