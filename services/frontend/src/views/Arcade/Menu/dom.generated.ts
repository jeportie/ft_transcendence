// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from src/views/Arcade/Menu
// Created by scripts/generateDomRegistry.mjs



function cloneTemplate(html: string): DocumentFragment {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  const firstTpl = tpl.content.firstElementChild as HTMLTemplateElement;
  if (firstTpl && firstTpl.tagName === "TEMPLATE")
      return firstTpl.content.cloneNode(true) as DocumentFragment;
  return tpl.content.cloneNode(true) as DocumentFragment;
}

/**
 * MenuDOM — Unified DOM accessor for views and templates
 */
export class MenuDOM {
  get arcadeQuickBtn(): HTMLButtonElement {
    const el = document.getElementById("arcade-quick-btn");
    if (!el) throw new Error("Missing element #arcade-quick-btn in DOM");
    return el as HTMLButtonElement;
  }
  get arcadeTournamentBtn(): HTMLButtonElement {
    const el = document.getElementById("arcade-tournament-btn");
    if (!el) throw new Error("Missing element #arcade-tournament-btn in DOM");
    return el as HTMLButtonElement;
  }
  get arcadeLoginBtn(): HTMLButtonElement {
    const el = document.getElementById("arcade-login-btn");
    if (!el) throw new Error("Missing element #arcade-login-btn in DOM");
    return el as HTMLButtonElement;
  }
  get arcadeGuestBtn(): HTMLButtonElement {
    const el = document.getElementById("arcade-guest-btn");
    if (!el) throw new Error("Missing element #arcade-guest-btn in DOM");
    return el as HTMLButtonElement;
  }



}

export const DOM = new MenuDOM();
