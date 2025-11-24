// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupPlayer.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/24 12:06:29 by jeportie          #+#    #+#             //
//   Updated: 2025/11/24 16:21:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Player1Controller } from "../Player1Controller.js";
import { Player2Controller } from "../Player2Controller.js";
import { GAME } from "../GameController.js";
import { API } from "@system";

export async function setupPlayers() {
    const slot1 = document.getElementById("player1-slot");
    const slot2 = document.getElementById("player2-slot");

    if (!slot1 || !slot2) return;

    const p1 = new Player1Controller(slot1);
    const p2 = new Player2Controller(slot2);

    // ---------------------------------------------------------------------
    // 1. CHECK IF USER RETURNED FROM OAUTH
    // ---------------------------------------------------------------------
    const oauthPlayer = sessionStorage.getItem("oauth_player");
    sessionStorage.removeItem("oauth_player");

    let me = null;

    if (oauthPlayer) {
        try {
            const res = await API.Get(API.routes.user.me);
            // me = res.me;
            console.log(me);
        } catch {
            // No valid session — treat as no oauth
            me = null;
        }
    }

    // ---------------------------------------------------------------------
    // 2. HANDLE OAUTH RECOVERY
    // ---------------------------------------------------------------------
    if (me && oauthPlayer === "player1") {
        GAME.setPlayer1(
            {
                type: "user",
                ready: true,
                userId: me.id,
                username: me.username,
                avatarUrl: me.avatar || null,
                lastLoginSource: "oauth",
                lastLoginError: null,
            },
            "P1 OAuth auto-attach"
        );
        p2.showSelectMode();
        return;
    }

    if (me && oauthPlayer === "player2") {
        p1.showSelectMode();
        GAME.setPlayer2(
            {
                type: "user",
                ready: true,
                userId: me.id,
                username: me.username,
                avatarUrl: me.avatar || null,
                lastLoginSource: "oauth",
                lastLoginError: null,
            },
            "P2 OAuth auto-attach"
        );
        return;
    }

    // ---------------------------------------------------------------------
    // 3. NORMAL FLOW (NO OAuth)
    // ---------------------------------------------------------------------
    p1.showSelectMode();
    p2.showSelectMode();
}

