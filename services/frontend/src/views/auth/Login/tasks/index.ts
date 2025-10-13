// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 10:37:24 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 13:30:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { togglePassword } from "./tooglePassword.js";
import { showActivationMessages } from "./showActivationMessages.js";
import { handleLogin } from "./handleLogin.js";
import { handleGoogleLogin } from "./handleGoogleLogin.js";
import { setupLogoAnimation } from "./setupLogoAnimation.js";

export const tasks = {
    init: [setupLogoAnimation], // runs once before anything else
    ready: [togglePassword, showActivationMessages, handleLogin, handleGoogleLogin],
};
