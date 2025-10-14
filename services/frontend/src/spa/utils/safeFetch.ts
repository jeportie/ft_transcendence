// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   safeFetch.ts                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/14 14:35:31 by jeportie          #+#    #+#             //
//   Updated: 2025/10/14 14:41:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "../api.js";
import { logger } from "../logger.js";

// ============================================================
// Shared Types
// ============================================================

export interface SafeResult<T = any> {
    data: T | null;
    error: Error | null;
}

export interface SafeRequestOptions {
    url: string;
    body?: object;
}

/**
 * Safe wrapper for API POST calls that normalizes errors and logs automatically.
 */
export async function safePost<T = any>(
    url: string,
    body: object
): Promise<SafeResult<T>> {
    try {
        const data = await API.post<T>(url, body);
        return { data, error: null };
    } catch (err: any) {
        const msg = `[API] ❌ ${err.code || err.status || "Error"}: ${err.message || "Unknown error"}`;
        logger.error(msg, err);
        return { data: null, error: err };
    }
}

/**
 * Safe wrapper for API GET calls that normalizes errors and logs automatically.
 */
export async function safeGet<T = any>(url: string): Promise<SafeResult<T>> {
    try {
        const data = await API.get<T>(url);
        return { data, error: null };
    } catch (err: any) {
        const msg = `[API] ❌ ${err.code || err.status || "Error"}: ${err.message || "Unknown error"}`;
        logger.error(msg, err);
        return { data: null, error: err };
    }
}

