// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 10:37:24 by jeportie          #+#    #+#             //
//   Updated: 2025/10/13 16:41:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// import { togglePassword } from "./tooglePassword.js";
// import { showActivationMessages } from "./showActivationMessages.js";
// import { handleLogin } from "./handleLogin.js";
// import { handleGoogleLogin } from "./handleGoogleLogin.js";
// import { setupLogoAnimation } from "./setupLogoAnimation.js";
//
// export const tasks = {
//     init: [setupLogoAnimation],
//     ready: [togglePassword, showActivationMessages, handleLogin, handleGoogleLogin],
//     teardown: [],
// };

import { DOM } from "../dom.generated.js";

import { setupLogoAnimation } from "../../shared/setupLogoAnimation.js";
import { togglePassword } from "../../shared/togglePassword.js";
import { handleGoogleButton } from "../../shared/handleGoogleButton.js";
import { handleLogin } from "./handleLogin.js";
import { showActivationMessages } from "./showActivationMessages.js";

export const tasks = {
    init: [setupLogoAnimation({
        ASSETS,
        getCard: () => DOM.signupCard, // Signup view’s own card element
    })],
    ready: [
        ({ ASSETS, addCleanup, logo }) => togglePassword({ ASSETS, addCleanup, input: document.querySelector("#login-pwd-input") }),
        showActivationMessages,
        handleLogin,
        (ctx) => handleGoogleButton({ ...ctx, btnSelector: "#google-btn" }),
    ],
    teardown: [],
};
