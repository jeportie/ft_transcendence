// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupPlayer.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/24 12:06:29 by jeportie          #+#    #+#            //
//   Updated: 2025/11/24 17:48:31 by jeportie         ###   ########.fr       //
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

    const savedP1 = sessionStorage.getItem("game_p1");
    const savedP2 = sessionStorage.getItem("game_p2");

    if (savedP1) GAME.setPlayer1(JSON.parse(savedP1), "restore P1");
    if (savedP2) GAME.setPlayer2(JSON.parse(savedP2), "restore P2");

    sessionStorage.removeItem("game_p1");
    sessionStorage.removeItem("game_p2");

    const oauthPlayer = sessionStorage.getItem("oauth_player");
    sessionStorage.removeItem("oauth_player");

    const oauthSource = sessionStorage.getItem("oauth_provider");
    sessionStorage.removeItem("oauth_provider");

    let me = null;

    if (oauthPlayer) {
        try {
            const res = await API.Get(API.routes.user.me);
            me = res.data?.me ?? null;
            console.log("[setupPlayers] /user/me →", res.data);
        } catch {
            me = null;
        }
    }

    if (me && oauthPlayer === "player1") {
        GAME.setPlayer1({
            type: "user",
            ready: true,
            username: me.username,
            userId: me.id,
            avatarUrl: me.avatar ?? null,
            lastLoginSource: oauthSource as any,
        }, "P1 OAuth auto-attach");

        p2.showSelectMode();
        return;
    }


    if (me && oauthPlayer === "player2") {
        GAME.setPlayer2({
            type: "user",
            ready: true,
            username: me.username,
            userId: me.id,
            avatarUrl: me.avatar ?? null,
            lastLoginSource: oauthSource as any,
        }, "P2 OAuth auto-attach");

        p1.showSelectMode();
        return;
    }

    p1.showSelectMode();
    p2.showSelectMode();
}

