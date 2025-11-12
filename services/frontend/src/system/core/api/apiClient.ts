// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   apiClient.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 17:11:20 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 18:46:08 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { safeGet, safePost, safePut, safeDelete } from "@jeportie/mini-fetch";
import { http } from "./http.js";
import { API_ROUTES } from "@system";
import { logger } from "@system/core/logger";

export const API = {
    routes: API_ROUTES,

    Get: <T>(url: string, opts?: RequestInit) =>
        safeGet<T>(http, url, opts, logger),
    Post: <T>(url: string, body?: object, opts?: RequestInit) =>
        safePost<T>(http, url, body, opts, logger),
    Put: <T>(url: string, body?: object, opts?: RequestInit) =>
        safePut<T>(http, url, body, opts, logger),
    Delete: <T>(url: string, body?: object, opts?: RequestInit) =>
        safeDelete<T>(http, url, body, opts, logger),
};
