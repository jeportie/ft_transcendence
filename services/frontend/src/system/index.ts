// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   index.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 18:22:33 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 18:23:13 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// ── App lifecycle
export { bootstrap } from "./app/bootstrap.js";
export { wireGlobals } from "./app/wireGlobals.js";

// ── Configuration
export { ENV, isDev, isProd } from "./config/env.js";
export {
    API_ROUTES,
    type ApiRoutes,
    type OAuthProvider,
} from "./config/api/endpoints.js";
export { withCommonHeaders } from "./config/api/headers.js";
export { guards } from "./config/routes/guards.js";

// ── API client (high-level safe wrappers)
// NOTE: we intentionally do NOT export the low-level `http` singleton here.
export { API } from "./core/api/apiClient.js";

// ── Auth (high-level service)
export { auth, markHasSession } from "./core/auth/auth.js";

// ── DOM utilities
export { create as createEl } from "./core/dom/dom.js";
export { showBox, clearBox, toggleVisibility } from "./core/dom/errors.js";
export { resolveElement } from "./core/dom/resolveElement.js";

// ── Logging
export { logger } from "./core/logger.js";

// ── User state and utilities
export { getDeviceFingerprint } from "./core/user/getDeviceFingerprint.js";
export { UserState, type User } from "./core/user/UserState.js";

// ── Misc utilities
export {
    initRecaptcha,
    destroyRecaptcha,
    getRecaptchaToken,
} from "./core/utils/recaptcha.js";
