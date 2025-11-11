// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/13 19:30:51 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 13:14:56 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";

import { setupLogoAnimation } from "@components/shared/setupLogoAnimation.js";
import { togglePassword } from "@components/shared/togglePassword.js";
import { handleGoogleButton } from "@components/shared/handleGoogleButton.js";
import { destroyRecaptcha } from "@system/core/utils/recaptcha.js";

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
