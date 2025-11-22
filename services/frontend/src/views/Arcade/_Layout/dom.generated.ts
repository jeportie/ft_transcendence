// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from src/views/Arcade/_Layout
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
 * LayoutDOM — Unified DOM accessor for views and templates
 */
export class LayoutDOM {
  get layoutArcadeHeroCanvas(): HTMLCanvasElement {
    const el = document.getElementById("layout-arcade-hero-canvas");
    if (!el) throw new Error("Missing element #layout-arcade-hero-canvas in DOM");
    return el as HTMLCanvasElement;
  }
  get arcadeLayoutModalLayerDiv(): HTMLDivElement {
    const el = document.getElementById("arcade-layout-modal-layer-div");
    if (!el) throw new Error("Missing element #arcade-layout-modal-layer-div in DOM");
    return el as HTMLDivElement;
  }



}

export const DOM = new LayoutDOM();
