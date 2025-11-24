// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   GameController.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+       //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/24 14:02:10 by jeportie          #+#    #+#             //
//   Updated: 2025/11/24 15:39:01 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "./dom.generated.js";
import { API } from "@system";
import GameSettingsHTML from "./components/GameSettings.html";
import { setupPong } from "./tasks/setupPong.js";
import { logger } from "@system/core/logger";

const log = logger.withPrefix("[Game]");

export interface PlayerState {
    type: "user" | "guest" | "none";
    ready: boolean;
    alias?: string;
    userId?: number;
    username?: string;
    token?: string;
    avatarUrl?: string;
    lastLoginSource?: "local" | "oauth-google" | "oauth-github" | "oauth-42";
    lastLoginError?: string | null;
}

function cloneTemplate(html: string): DocumentFragment {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    const firstTpl = tpl.content.firstElementChild as HTMLTemplateElement;
    if (firstTpl && firstTpl.tagName === "TEMPLATE")
        return firstTpl.content.cloneNode(true) as DocumentFragment;
    return tpl.content.cloneNode(true) as DocumentFragment;
}

export class GameController {

    p1: PlayerState = { type: "none", ready: false };
    p2: PlayerState = { type: "none", ready: false };

    constructor() { }

    setPlayer1(state: Partial<PlayerState>, context = "update P1") {
        Object.assign(this.p1, state);
        this.logState(context);
        this.checkReady();
    }

    setPlayer2(state: Partial<PlayerState>, context = "update P2") {
        Object.assign(this.p2, state);
        this.logState(context);
        this.checkReady();
    }

    private checkReady() {
        if (this.p1.ready && this.p2.ready) {
            this.showGameSettings();
        }
    }

    private fillSettingsTable(root: HTMLElement) {
        const p1 = this.p1;
        const p2 = this.p2;

        const q = (id: string) =>
            root.querySelector<HTMLElement>(id) ?? undefined;

        const id = (id: string) => q(`#${id}`);

        id("gs-p1-mode")!.textContent = p1.type.toUpperCase();
        id("gs-p1-id")!.textContent = p1.alias || p1.username || "-";
        id("gs-p1-userid")!.textContent =
            typeof p1.userId === "number" ? String(p1.userId) : "-";
        id("gs-p1-ready")!.textContent = p1.ready ? "YES" : "NO";

        id("gs-p2-mode")!.textContent = p2.type.toUpperCase();
        id("gs-p2-id")!.textContent = p2.alias || p2.username || "-";
        id("gs-p2-userid")!.textContent =
            typeof p2.userId === "number" ? String(p2.userId) : "-";
        id("gs-p2-ready")!.textContent = p2.ready ? "YES" : "NO";

        const debug = id("gs-debug-json");
        if (debug) {
            debug.textContent = JSON.stringify(
                {
                    player1: this.p1,
                    player2: this.p2,
                },
                null,
                2
            );
        }
    }

    showGameSettings() {
        log.info("Both players ready → injecting GameSettings");

        const frag = cloneTemplate(GameSettingsHTML);
        const root = frag.querySelector<HTMLElement>("#game-settings-root");
        if (!root) {
            log.error("Missing #game-settings-root in GameSettings template");
            return;
        }

        // Remplir la table avec l'état courant
        this.fillSettingsTable(root);

        // Injecter dans le slot central
        DOM.gameSlot.innerHTML = "";
        DOM.gameSlot.appendChild(frag);

        // Boutons
        const continueBtn = root.querySelector<HTMLButtonElement>("#gs-btn-continue");
        const resetBtn = root.querySelector<HTMLButtonElement>("#gs-btn-reset");

        continueBtn?.addEventListener("click", () => {
            this.startMatch();
        });

        resetBtn?.addEventListener("click", () => {
            // Simple reset pour l’instant
            location.reload();
        });
    }

    startMatch() {
        log.info("Starting match → inject GameCanvas & bootstrap Pong");

        DOM.createGameCanvasFrag();
        DOM.gameSlot.innerHTML = "";
        DOM.gameSlot.appendChild(DOM.fragGameCanvas);

        // Lance la logique Pong avec le canvas + boutons
        if (!DOM.pongCanvas) {
            log.error("No pongCanvas found after createGameCanvasFrag");
            return;
        }
        setupPong(DOM.pongCanvas, DOM.pongStartBtn, DOM.pongStopBtn);

        // On affiche le bouton Start
        DOM.pongStartBtn?.classList.remove("hidden");
    }

    logState(context = "") {
        const label = context ? `State (${context})` : "State";
        console.groupCollapsed(`%c[Game] ${label}`, "color:#00ffaa");
        console.table({
            Player1: this.p1,
            Player2: this.p2,
        });
        console.groupEnd();
    }
}

export const GAME = new GameController();

