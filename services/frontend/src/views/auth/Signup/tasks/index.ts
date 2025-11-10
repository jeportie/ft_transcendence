// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/13 19:30:51 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 10:39:34 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";

import { setupLogoAnimation } from "../../../shared/setupLogoAnimation.js";
import { togglePassword } from "../../../shared/togglePassword.js";
import { handleGoogleButton } from "../../../shared/handleGoogleButton.js";
import { destroyRecaptcha } from "@jeportie/mini-js/utils";

import { handleSignup } from "./handleSignup.js";

export const tasks = {
    init: [
        (ctx: any) =>
            setupLogoAnimation({
                ASSETS: ctx.ASSETS,
                getCard: () => DOM.signupCard,
            }),
    ],

    ready: [
        (ctx: any) =>
            togglePassword({
                ASSETS: ctx.ASSETS,
                addCleanup: ctx.addCleanup,
                input: DOM.signupPwdInput,
            }),
        (ctx: any) =>
            togglePassword({
                ASSETS: ctx.ASSETS,
                addCleanup: ctx.addCleanup,
                input: DOM.signupConfirmInput,
            }),
        handleSignup,
        (ctx: any) =>
            handleGoogleButton({
                ASSETS: ctx.ASSETS,
                addCleanup: ctx.addCleanup,
                btn: DOM.signupGoogleBtn,
                logo: ctx.logo,
            }),
    ],

    teardown: [destroyRecaptcha],
};
