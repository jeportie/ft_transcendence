// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   sessions.ts                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/29 22:01:51 by jeportie          #+#    #+#             //
//   Updated: 2025/11/04 10:33:21 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { SessionsTable } from "../components/SessionsTable.js";

let table: any = null;

// The context is provided by AbstractView.mount → { ASSETS, view, addCleanup }
export async function setupSessions({ ASSETS, view }) {
    table = new SessionsTable(DOM.settingsSessionsTable, ASSETS);
    view.registerComponent("sessionsTable", table);
    await table.load(); // handles rendering all rows internally
}

export function teardownSessions() {
    // You don’t need this manually, but in case the view calls teardown directly:
    table?.teardown?.();
    table = null;
}
