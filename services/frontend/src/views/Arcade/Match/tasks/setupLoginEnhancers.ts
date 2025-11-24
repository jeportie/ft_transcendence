// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupLoginEnhancers.ts                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/24 13:28:51 by jeportie          #+#    #+#             //
//   Updated: 2025/11/24 15:29:34 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import { API } from "@system";
import { togglePassword } from "@components/shared/togglePassword.js";
import { handleGoogleButton } from "@components/shared/handleGoogleButton.js";
import { handleGithubButton } from "@components/shared/handleGithubButton.js";
import { handle42Button } from "@components/shared/handle42Button.js";

export function setupLoginEnhancers(ctx: any) {
    if (!DOM.playerLoginForm) return;

    // Password eye toggle
    togglePassword({
        ASSETS: ctx.ASSETS,
        input: DOM.playerLoginPwdInput,
        addCleanup: ctx.addCleanup,
    });

    // --- Google -------------------------------------------------------------
    handleGoogleButton({
        ASSETS: ctx.ASSETS,
        btn: DOM.playerLoginGoogleBtn,
        addCleanup: ctx.addCleanup,
    });

    DOM.playerLoginGoogleBtn?.addEventListener("click", () => {
        sessionStorage.setItem("oauth_player", ctx.player); // "player1" or "player2"
        window.location.href =
            "/api" + API.routes.auth.oauth.start("google") + "?next=/arcade/play";
    });

    // --- GitHub --------------------------------------------------------------
    handleGithubButton({
        ASSETS: ctx.ASSETS,
        btn: DOM.playerLoginGithubBtn,
        addCleanup: ctx.addCleanup,
    });

    DOM.playerLoginGithubBtn?.addEventListener("click", () => {
        sessionStorage.setItem("oauth_player", ctx.player);
        window.location.href =
            "/api" + API.routes.auth.oauth.start("github") + "?next=/arcade/play";
    });

    // --- 42 ------------------------------------------------------------------
    handle42Button({
        ASSETS: ctx.ASSETS,
        btn: DOM.playerLoginFortytwoBtn,
        addCleanup: ctx.addCleanup,
    });

    DOM.playerLoginFortytwoBtn?.addEventListener("click", () => {
        sessionStorage.setItem("oauth_player", ctx.player);
        window.location.href =
            "/api" + API.routes.auth.oauth.start("42") + "?next=/arcade/play";
    });
}

