// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from src/views/Arcade/Match
// Created by scripts/generateDomRegistry.mjs

import GameCanvasHTML from "./components/GameCanvas.html";
import GameSettingsHTML from "./components/GameSettings.html";
import PlayerGuestFormHTML from "./components/PlayerGuestForm.html";
import PlayerLoginFormHTML from "./components/PlayerLoginForm.html";
import PlayerSelectModeHTML from "./components/PlayerSelectMode.html";

function cloneTemplate(html: string): DocumentFragment {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  const firstTpl = tpl.content.firstElementChild as HTMLTemplateElement;
  if (firstTpl && firstTpl.tagName === "TEMPLATE")
      return firstTpl.content.cloneNode(true) as DocumentFragment;
  return tpl.content.cloneNode(true) as DocumentFragment;
}

export class MatchDOM {
  get player1Slot(): HTMLElement {
    const el = document.getElementById("player1-slot");
    if (!el) throw new Error("Missing element #player1-slot in DOM");
    return el as HTMLElement;
  }
  get gameSlot(): HTMLElement {
    const el = document.getElementById("game-slot");
    if (!el) throw new Error("Missing element #game-slot in DOM");
    return el as HTMLElement;
  }
  get player2Slot(): HTMLElement {
    const el = document.getElementById("player2-slot");
    if (!el) throw new Error("Missing element #player2-slot in DOM");
    return el as HTMLElement;
  }


  createGameCanvasFrag() {
    const frag = cloneTemplate(GameCanvasHTML);
    return {
      frag,
      pongCanvas: frag.querySelector<HTMLCanvasElement>("#pong-canvas")!,
      pongStartBtn: frag.querySelector<HTMLButtonElement>("#pong-start-btn")!,
      pongStopBtn: frag.querySelector<HTMLButtonElement>("#pong-stop-btn")!,
      matchEndScreen: frag.querySelector<HTMLElement>("#match-end-screen")!,
      matchResultText: frag.querySelector<HTMLElement>("#match-result-text")!,
      rematchBtn: frag.querySelector<HTMLButtonElement>("#rematch-btn")!,
      quitBtn: frag.querySelector<HTMLButtonElement>("#quit-btn")!,
    };
  }

  createGameSettingsFrag() {
    const frag = cloneTemplate(GameSettingsHTML);
    return {
      frag,
      gameSettingsRoot: frag.querySelector<HTMLElement>("#game-settings-root")!,
      gsP1Mode: frag.querySelector<HTMLElement>("#gs-p1-mode")!,
      gsP1Id: frag.querySelector<HTMLElement>("#gs-p1-id")!,
      gsP1Userid: frag.querySelector<HTMLElement>("#gs-p1-userid")!,
      gsP1Ready: frag.querySelector<HTMLElement>("#gs-p1-ready")!,
      gsP2Mode: frag.querySelector<HTMLElement>("#gs-p2-mode")!,
      gsP2Id: frag.querySelector<HTMLElement>("#gs-p2-id")!,
      gsP2Userid: frag.querySelector<HTMLElement>("#gs-p2-userid")!,
      gsP2Ready: frag.querySelector<HTMLElement>("#gs-p2-ready")!,
      gsDebugJson: frag.querySelector<HTMLElement>("#gs-debug-json")!,
      gsBtnContinue: frag.querySelector<HTMLElement>("#gs-btn-continue")!,
      gsBtnReset: frag.querySelector<HTMLElement>("#gs-btn-reset")!,
    };
  }

  createPlayerGuestFormFrag() {
    const frag = cloneTemplate(PlayerGuestFormHTML);
    return {
      frag,
      playerGuestCard: frag.querySelector<HTMLDivElement>("#player-guest-card")!,
      playerGuestForm: frag.querySelector<HTMLFormElement>("#player-guest-form")!,
      playerGuestAliasInput: frag.querySelector<HTMLInputElement>("#player-guest-alias-input")!,
      playerGuestRandomBtn: frag.querySelector<HTMLButtonElement>("#player-guest-random-btn")!,
      playerGuestSubmitBtn: frag.querySelector<HTMLButtonElement>("#player-guest-submit-btn")!,
      playerGuestErrorDiv: frag.querySelector<HTMLDivElement>("#player-guest-error-div")!,
      guestBackBtn: frag.querySelector<HTMLButtonElement>("#guest-back-btn")!,
    };
  }

  createPlayerLoginFormFrag() {
    const frag = cloneTemplate(PlayerLoginFormHTML);
    return {
      frag,
      playerLoginCard: frag.querySelector<HTMLDivElement>("#player-login-card")!,
      playerLoginForm: frag.querySelector<HTMLFormElement>("#player-login-form")!,
      playerLoginUserInput: frag.querySelector<HTMLInputElement>("#player-login-user-input")!,
      playerLoginPwdInput: frag.querySelector<HTMLInputElement>("#player-login-pwd-input")!,
      playerLoginFormBtn: frag.querySelector<HTMLButtonElement>("#player-login-form-btn")!,
      playerLoginErrorDiv: frag.querySelector<HTMLDivElement>("#player-login-error-div")!,
      playerLoginGoogleBtn: frag.querySelector<HTMLButtonElement>("#player-login-google-btn")!,
      playerLoginGithubBtn: frag.querySelector<HTMLButtonElement>("#player-login-github-btn")!,
      playerLoginFortytwoBtn: frag.querySelector<HTMLButtonElement>("#player-login-fortytwo-btn")!,
      playerLoginBackBtn: frag.querySelector<HTMLButtonElement>("#player-login-back-btn")!,
    };
  }

  createPlayerSelectModeFrag() {
    const frag = cloneTemplate(PlayerSelectModeHTML);
    return {
      frag,
      selectLoginBtn: frag.querySelector<HTMLButtonElement>("#select-login-btn")!,
      selectGuestBtn: frag.querySelector<HTMLButtonElement>("#select-guest-btn")!,
    };
  }
}

export const DOM = new MatchDOM();
