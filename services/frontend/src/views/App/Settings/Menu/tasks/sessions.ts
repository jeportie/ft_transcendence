// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   sessions.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 22:01:51 by jeportie          #+#    #+#             //
//   Updated: 2025/11/11 14:28:17 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { SessionsTable } from "../components/SessionsTable.js";

let table: any = null;

// @ts-expect-error
export async function setupSessions({ ASSETS, view }) {
    table = new SessionsTable(DOM.settingsSessionsTable, ASSETS);
    view.registerComponent("sessionsTable", table);
    await table.load();
}

export function teardownSessions() {
    table?.teardown?.();
    table = null;
}
