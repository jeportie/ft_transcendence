// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   handler.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:39:46 by jeportie          #+#    #+#             //
//   Updated: 2025/11/18 12:01:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "./controller.js";
import * as schema from "./schema/index.js";

export async function f2aRoutes(fastify) {
    const authGuard = { preHandler: [fastify.authenticate] };

    fastify.post("/enable", { ...authGuard, schema: schema.enableSchema }, controller.enableF2a);
    fastify.post("/verify-totp", { ...authGuard, schema: schema.verifyTotpSchema }, controller.verifyTotp);
    fastify.post("/login-totp", { schema: schema.loginTotpSchema }, controller.loginTotp);
    fastify.post("/verify-backup", { schema: schema.verifyBackupSchema }, controller.verifyBackup);
    fastify.post("/disable", { ...authGuard, schema: schema.disableSchema }, controller.disableF2a);
    fastify.post("/backup", { ...authGuard, schema: schema.backupSchema }, controller.generateBackupCodes);
    fastify.post("/check-2fa", { schema: schema.checkF2aSchema }, controller.checkF2a);
    fastify.post("/email/enable", { schema: null }, controller.enableEmail);
    fastify.post("/email/verify", { schema: null }, controller.verifyEmail);
}
