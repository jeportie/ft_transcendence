// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   providers.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/16 16:51:12 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 15:36:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { OAuthErrors } from "../../errors.js";
import { makeGoogleProvider } from "./providers/google.js";
import { makeGitHubProvider } from "./providers/github.js";
import { makeFortyTwoProvider } from "./providers/fortyTwo.js";

const registry = {
    google: makeGoogleProvider,
    github: makeGitHubProvider,
    "42": makeFortyTwoProvider,
};

export function getProvider(fastify, name) {
    const factory = registry[name];
    if (!factory)
        throw OAuthErrors.UnknownProvider(name);
    return factory(fastify);
}
