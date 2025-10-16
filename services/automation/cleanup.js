// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   cleanup.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 11:52:53 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 11:53:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import cron from "node-cron";
import { archiveInactiveUsers } from "./tasks/archiveInactiveUsers.js";
import { purgeExpiredTokens } from "./tasks/purgeExpiredTokens.js";

console.log("[Cleanup] Service starting...");

async function runAllTasks() {
    console.log("[Cleanup] Running scheduled maintenance...");
    await archiveInactiveUsers();
    await purgeExpiredTokens();
    console.log("[Cleanup] Maintenance completed ✅");
}

// Run once at startup
await runAllTasks();

// Schedule every day at 02:00
cron.schedule("0 2 * * *", async () => {
    await runAllTasks();
});
