// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   f2a.handler.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:39:46 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 17:09:30 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import * as controller from "../controller/f2a.controller.js";
import { enableSchema } from "../schema/f2a/enableSchema.js";
import { verifyTotpSchema } from "../schema/f2a/verifyTotpSchema.js";
import { verifyBackupSchema } from "../schema/f2a/verifyBackupSchema.js";
import { disableSchema } from "../schema/f2a/disableSchema.js";
import { backupSchema } from "../schema/f2a/backupSchema.js";

export async function f2aRoutes(fastify) {
    const authGuard = { preHandler: [fastify.authenticate] };

    fastify.post("/f2a/enable", { ...authGuard, schema: enableSchema }, controller.enableF2a);
    fastify.post("/f2a/verify-totp", { ...authGuard, schema: verifyTotpSchema }, controller.verifyTotp);
    fastify.post("/f2a/verify-backup", { ...authGuard, schema: verifyBackupSchema }, controller.verifyBackup);
    fastify.post("/f2a/disable", { ...authGuard, schema: disableSchema }, controller.disableF2a);
    fastify.post("/f2a/backup", { ...authGuard, schema: backupSchema }, controller.generateBackupCodes);
}
