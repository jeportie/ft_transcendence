// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handleActivate.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 09:42:55 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 10:03:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../../../../spa/api.js";

export async function handleActivate() {

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
        const msg = encodeURIComponent("No token found in URL");
        return window.navigateTo(`/login?activation_failed=1&error_message=${msg}`);
    }

    const { data, error } = await API.Get(`/auth/activate/${token}`);

    if (error) {
        const msg = encodeURIComponent(error.message || "Activation failed");
        return window.navigateTo(`/login?activation_failed=1&error_message=${msg}`);
    }

    window.navigateTo("/login?activated=1");
}
