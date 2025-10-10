// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   f2a.handler.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:39:46 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 22:08:16 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/f2a.controller.js";
import * as schemas from "../schema/f2a/index.js";

export async function f2aRoutes(fastify) {
    const authGuard = { preHandler: [fastify.authenticate] };

    fastify.post("/enable", { ...authGuard, schema: schemas.enableSchema }, controller.enableF2a);
    fastify.post("/verify-totp", { ...authGuard, schema: schemas.verifyTotpSchema }, controller.verifyTotp);
    fastify.post("/login-totp", { schema: schemas.loginTotpSchema }, controller.loginTotp);
    fastify.post("/verify-backup", { schema: schemas.verifyBackupSchema }, controller.verifyBackup);
    fastify.post("/disable", { ...authGuard, schema: schemas.disableSchema }, controller.disableF2a);
    fastify.post("/backup", { ...authGuard, schema: schemas.backupSchema }, controller.generateBackupCodes);
    fastify.post("/check-2fa", { schema: schemas.checkF2aSchema }, controller.checkF2a);
}
