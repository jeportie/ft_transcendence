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
        console.error("No token found in URL");
        return window.navigateTo("/login?activation_failed=1");
    }

    const { data, error } = await API.Get(`/auth/activate/${token}`);

    if (error) {
        console.error("Activation failed:", error);
        window.navigateTo("/login?activation_failed=1");
        window.navigateTo(`/login?activation_failed=1?error_message=${error.error}`);
    }

    window.navigateTo("/login?activated=1");
}
