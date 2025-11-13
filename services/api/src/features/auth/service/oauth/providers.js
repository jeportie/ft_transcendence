// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   providers.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/16 16:51:12 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 11:36:12 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { OAuthErrors } from "../../errors.js";
import { makeGoogleProvider } from "./providers/google.js";

const registry = {
    google: makeGoogleProvider,
    // github: makeGitHubProvider,
    // fortyTwo: make42Provider,
};

export function getProvider(fastify, name) {
    const factory = registry[name];
    if (!factory)
        throw OAuthErrors.UnknownProvider(name);
    return factory(fastify);
}
