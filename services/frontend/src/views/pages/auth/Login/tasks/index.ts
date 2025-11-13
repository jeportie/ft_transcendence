// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 10:37:24 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 15:49:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";

import { setupLogoAnimation } from "@components/shared/setupLogoAnimation.js";
import { togglePassword } from "@components/shared/togglePassword.js";
import { handleGoogleButton } from "@components/shared/handleGoogleButton.js";
import { handleGithubButton } from "@components/shared/handleGithubButton.js";
import { handle42Button } from "@components/shared/handle42Button.js";

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
        (ctx: any) =>
            handleGithubButton({
                ASSETS: ctx.ASSETS,
                addCleanup: ctx.addCleanup,
                btn: DOM.loginGithubBtn,
                logo: ctx.logo,
            }),
        (ctx: any) =>
            handle42Button({
                ASSETS: ctx.ASSETS,
                addCleanup: ctx.addCleanup,
                btn: DOM.loginFortytwoBtn,
                logo: ctx.logo,
            }),
    ],

    teardown: [],
};
