// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Player2Controller.ts                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+       //
//                                                +#+#+#+#+#+   +#+          //
//   Created: 2025/11/24 12:04:56 by jeportie          #+#    #+#             //
//   Updated: 2025/11/24 17:40:00 by jeportie         ###   ########.fr      //
//                                                                            //
// ************************************************************************** //

import { DOM } from "./dom.generated.js";
import { setupLoginEnhancers } from "./tasks/setupLoginEnhancers.js";
import { ASSETS } from "./Pong.js";
import { GAME } from "./GameController.js";
import { API } from "@system";
import { logger } from "@system/core/logger";

const log = logger.withPrefix("[Player2]");

export class Player2Controller {
    private slot: HTMLElement;

    constructor(slot: HTMLElement) {
        this.slot = slot;
    }

    showSelectMode() {
        const { frag, selectLoginBtn, selectGuestBtn } =
            DOM.createPlayerSelectModeFrag();

        this.slot.innerHTML = "";
        this.slot.appendChild(frag);

        selectLoginBtn.addEventListener("click", () => this.showLoginForm());
        selectGuestBtn.addEventListener("click", () => this.showGuestForm());
    }

    showLoginForm() {
        const fragData = DOM.createPlayerLoginFormFrag();
        const {
            frag,
            playerLoginForm,
            playerLoginUserInput,
            playerLoginPwdInput,
            playerLoginErrorDiv,
            playerLoginGoogleBtn,
            playerLoginGithubBtn,
            playerLoginFortytwoBtn,
            playerLoginBackBtn,
        } = fragData;

        this.slot.innerHTML = "";
        this.slot.appendChild(frag);

        // Setup enhancers with explicit refs
        setupLoginEnhancers({
            ASSETS,
            addCleanup: () => { },
            player: "player2",
            pwdInput: playerLoginPwdInput,
            googleBtn: playerLoginGoogleBtn,
            githubBtn: playerLoginGithubBtn,
            fortyTwoBtn: playerLoginFortytwoBtn,
        }, GAME);

        // LOCAL LOGIN
        playerLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const identifier = playerLoginUserInput.value.trim();
            const pwd = playerLoginPwdInput.value;

            if (!identifier || !pwd) {
                playerLoginErrorDiv.textContent = "Please fill in both fields.";
                playerLoginErrorDiv.classList.remove("hidden");
                return;
            }

            playerLoginErrorDiv.classList.add("hidden");

            log.info("Local login attempt:", identifier);

            GAME.setPlayer2(
                {
                    type: "user",
                    ready: false,
                    username: identifier,
                    lastLoginSource: "local",
                },
                "P2 local login (pending)"
            );

            try {
                const res = await API.Post<{ token?: string; me?: any }>(
                    API.routes.auth.local.login,
                    { user: identifier, pwd }
                );

                if (res.error) {
                    const msg = res.error.message || "Login failed.";
                    playerLoginErrorDiv.textContent = msg;
                    playerLoginErrorDiv.classList.remove("hidden");

                    GAME.setPlayer2(
                        {
                            type: "user",
                            ready: false,
                            username: identifier,
                            lastLoginSource: "local",
                            lastLoginError: msg,
                        },
                        "P2 local login (error)"
                    );
                    return;
                }

                const me = res.data?.me;

                GAME.setPlayer2(
                    {
                        type: "user",
                        ready: true,
                        username: me?.username ?? identifier,
                        userId: me?.id,
                        avatarUrl: me?.avatar_url,
                    },
                    "P2 local login (success)"
                );

            } catch (err) {
                const msg = "Network error during login.";
                playerLoginErrorDiv.textContent = msg;
                playerLoginErrorDiv.classList.remove("hidden");

                GAME.setPlayer2(
                    {
                        type: "user",
                        ready: false,
                        username: identifier,
                        lastLoginSource: "local",
                        lastLoginError: msg,
                    },
                    "P2 local login (exception)"
                );
            }
        });

        playerLoginBackBtn?.addEventListener("click", () => this.showSelectMode());
    }

    showGuestForm() {
        const {
            frag,
            playerGuestForm,
            playerGuestAliasInput,
            playerGuestRandomBtn,
            playerGuestErrorDiv,
            guestBackBtn,
        } = DOM.createPlayerGuestFormFrag();

        this.slot.innerHTML = "";
        this.slot.appendChild(frag);

        playerGuestRandomBtn.addEventListener("click", () => {
            playerGuestAliasInput.value = "Guest" + Math.floor(Math.random() * 9999);
        });

        playerGuestForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const alias = playerGuestAliasInput.value.trim();
            if (!alias) {
                playerGuestErrorDiv.textContent = "Alias cannot be empty.";
                playerGuestErrorDiv.classList.remove("hidden");
                return;
            }

            playerGuestErrorDiv.classList.add("hidden");

            GAME.setPlayer2(
                { type: "guest", ready: true, alias },
                "P2 guest ready"
            );
        });

        guestBackBtn?.addEventListener("click", () => this.showSelectMode());
    }
}

