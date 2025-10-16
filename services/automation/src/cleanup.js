// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   cleanup.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/16 11:52:53 by jeportie          #+#    #+#             //
//   Updated: 2025/10/16 17:36:45 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import cron from "node-cron";
import { archiveInactiveUsers } from "./tasks/archiveInactiveUsers.js";
import { purgeExpiredTokens } from "./tasks/purgeExpiredTokens.js";
import { logDbSnapshot } from "./tasks/debugDatabase.js";
import dotenv from "dotenv";
dotenv.config();

const SCHEDULE = process.env.RUN_SCHEDULE || "0 2 * * *";

console.log(`[Automation] Service starting with schedule: ${SCHEDULE}`);

async function runAllTasks() {
    console.log("[Automation] Running scheduled maintenance...");
    // await logDbSnapshot();
    await archiveInactiveUsers();
    await purgeExpiredTokens();
    console.log("[Automation] Maintenance completed ✅");
}

// Run once at startup
await runAllTasks();

// Schedule
cron.schedule(SCHEDULE, async () => {
    await runAllTasks();
});
