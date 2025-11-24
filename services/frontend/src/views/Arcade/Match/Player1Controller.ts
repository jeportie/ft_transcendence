// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Player1Controller.ts                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/24 17:00:14 by jeportie          #+#    #+#             //
//   Updated: 2025/11/24 17:06:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "./dom.generated.js";
import { setupLoginEnhancers } from "./tasks/setupLoginEnhancers.js";
import { ASSETS } from "./Pong.js";
import { GAME } from "./GameController.js";
import { API } from "@system";
import { logger } from "@system/core/logger";

const log = logger.withPrefix("[Player1]");

export class Player1Controller {
    private slot: HTMLElement;

    constructor(slot: HTMLElement) {
        this.slot = slot;
    }

    // -------------------------------------------------------------
    // SELECT MODE
    // -------------------------------------------------------------
    showSelectMode() {
        const { frag, selectLoginBtn, selectGuestBtn } =
            DOM.createPlayerSelectModeFrag();

        this.slot.innerHTML = "";
        this.slot.appendChild(frag);

        selectLoginBtn.addEventListener("click", () => this.showLoginForm());
        selectGuestBtn.addEventListener("click", () => this.showGuestForm());

        selectGuestBtn.addEventListener("click", () =>
            log.info("Guest mode selected")
        );
    }

    // -------------------------------------------------------------
    // LOGIN FORM
    // -------------------------------------------------------------
    showLoginForm() {
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
        } = DOM.createPlayerLoginFormFrag();

        this.slot.innerHTML = "";
        this.slot.appendChild(frag);

        // Optional enhancers (password eye, OAuth icons...)
        setupLoginEnhancers({
            ASSETS,
            addCleanup: () => { },
            player: "player1",
        });

        // ---- SUBMIT LOCAL LOGIN ----
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

            GAME.setPlayer1(
                {
                    type: "user",
                    ready: false,
                    username: identifier,
                    lastLoginSource: "local",
                    lastLoginError: null,
                },
                "P1 local login (pending)"
            );

            try {
                const res = await API.Post<{ token?: string; me?: any }>(
                    API.routes.auth.local.login,
                    {
                        user: identifier,
                        pwd,
                    }
                );

                if (res.error) {
                    const msg = res.error.message || "Login failed.";
                    playerLoginErrorDiv.textContent = msg;
                    playerLoginErrorDiv.classList.remove("hidden");

                    GAME.setPlayer1(
                        {
                            type: "user",
                            ready: false,
                            username: identifier,
                            lastLoginSource: "local",
                            lastLoginError: msg,
                        },
                        "P1 local login (error)"
                    );
                    log.warn("Login failed:", res.error);
                    return;
                }

                const me = res.data?.me || null;

                GAME.setPlayer1(
                    {
                        type: "user",
                        ready: true,
                        username: me?.username ?? identifier,
                        userId: me?.id,
                        avatarUrl: me?.avatar_url,
                        lastLoginSource: "local",
                        lastLoginError: null,
                    },
                    "P1 local login (success)"
                );

                log.info("Login success:", me || { username: identifier });

            } catch (err: any) {
                const msg = "Network error during login.";
                playerLoginErrorDiv.textContent = msg;
                playerLoginErrorDiv.classList.remove("hidden");

                GAME.setPlayer1(
                    {
                        type: "user",
                        ready: false,
                        username: identifier,
                        lastLoginSource: "local",
                        lastLoginError: msg,
                    },
                    "P1 local login (exception)"
                );

                log.error("Login exception:", err);
            }
        });

        // ---- OAUTH ----
        playerLoginGoogleBtn.addEventListener("click", () => {
            log.info("OAuth Google clicked");
            GAME.setPlayer1(
                { lastLoginSource: "oauth-google" },
                "P1 oauth-google click"
            );
        });

        playerLoginGithubBtn.addEventListener("click", () => {
            log.info("OAuth GitHub clicked");
            GAME.setPlayer1(
                { lastLoginSource: "oauth-github" },
                "P1 oauth-github click"
            );
        });

        playerLoginFortytwoBtn.addEventListener("click", () => {
            log.info("OAuth 42 clicked");
            GAME.setPlayer1(
                { lastLoginSource: "oauth-42" },
                "P1 oauth-42 click"
            );
        });

        playerLoginBackBtn?.addEventListener("click", () => this.showSelectMode());
    }

    // -------------------------------------------------------------
    // GUEST FORM
    // -------------------------------------------------------------
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

        // Random alias
        playerGuestRandomBtn.addEventListener("click", () => {
            playerGuestAliasInput.value =
                "Guest" + Math.floor(Math.random() * 9999);
        });

        // Submit
        playerGuestForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const alias = playerGuestAliasInput.value.trim();
            if (!alias) {
                playerGuestErrorDiv.textContent = "Alias cannot be empty.";
                playerGuestErrorDiv.classList.remove("hidden");
                return;
            }

            playerGuestErrorDiv.classList.add("hidden");

            GAME.setPlayer1(
                {
                    type: "guest",
                    ready: true,
                    alias,
                    lastLoginSource: undefined,
                    lastLoginError: null,
                },
                "P1 guest ready"
            );

            log.info("Guest alias selected:", alias);

            guestBackBtn?.addEventListener("click", () => this.showSelectMode());
        });
    }
}

