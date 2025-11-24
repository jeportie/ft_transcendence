// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupLoginEnhancers.ts                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/24 13:28:51 by jeportie          #+#    #+#             //
//   Updated: 2025/11/24 17:46:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { API } from "@system";
import { togglePassword } from "@components/shared/togglePassword.js";
import { handleGoogleButton } from "@components/shared/handleGoogleButton.js";
import { handleGithubButton } from "@components/shared/handleGithubButton.js";
import { handle42Button } from "@components/shared/handle42Button.js";
import { GameController } from "../GameController";

export interface LoginEnhancerContext {
    ASSETS: any;
    addCleanup: () => void;
    player: "player1" | "player2";

    // Explicit element references
    pwdInput: HTMLInputElement;
    googleBtn: HTMLButtonElement;
    githubBtn: HTMLButtonElement;
    fortyTwoBtn: HTMLButtonElement;
}

export function setupLoginEnhancers(ctx: LoginEnhancerContext, GAME: GameController) {
    const { ASSETS, addCleanup, player, pwdInput, googleBtn, githubBtn, fortyTwoBtn } = ctx;

    // -------------------------------------------------------------
    // PASSWORD EYE ICON
    // -------------------------------------------------------------
    togglePassword({
        ASSETS,
        input: pwdInput,
        addCleanup,
    });

    // -------------------------------------------------------------
    // GOOGLE
    // -------------------------------------------------------------
    handleGoogleButton({ ASSETS, btn: googleBtn, addCleanup });
    googleBtn.addEventListener("click", () => {
        sessionStorage.setItem("oauth_provider", "oauth-google");
        sessionStorage.setItem("oauth_player", player);
        sessionStorage.setItem("game_p1", JSON.stringify(GAME.p1));
        sessionStorage.setItem("game_p2", JSON.stringify(GAME.p2));
        window.location.href =
            "/api" + API.routes.auth.oauth.start("google") + "?next=/arcade/play";
    });

    // -------------------------------------------------------------
    // GITHUB
    // -------------------------------------------------------------
    handleGithubButton({ ASSETS, btn: githubBtn, addCleanup });
    githubBtn.addEventListener("click", () => {
        sessionStorage.setItem("oauth_provider", "oauth-github");
        sessionStorage.setItem("oauth_player", player);
        sessionStorage.setItem("game_p1", JSON.stringify(GAME.p1));
        sessionStorage.setItem("game_p2", JSON.stringify(GAME.p2));
        window.location.href =
            "/api" + API.routes.auth.oauth.start("github") + "?next=/arcade/play";
    });

    // -------------------------------------------------------------
    // 42
    // -------------------------------------------------------------
    handle42Button({ ASSETS, btn: fortyTwoBtn, addCleanup });
    fortyTwoBtn.addEventListener("click", () => {
        sessionStorage.setItem("oauth_provider", "oauth-42");
        sessionStorage.setItem("oauth_player", player);
        sessionStorage.setItem("game_p1", JSON.stringify(GAME.p1));
        sessionStorage.setItem("game_p2", JSON.stringify(GAME.p2));
        window.location.href =
            "/api" + API.routes.auth.oauth.start("42") + "?next=/arcade/play";
    });
}
