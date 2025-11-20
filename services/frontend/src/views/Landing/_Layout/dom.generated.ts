// AUTO-GENERATED FILE — DO NOT EDIT
// Aggregated from 1 HTML file(s)
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

/**
 * LandingLayoutDOM — Lazy DOM accessor for all elements in this folder.
 */
export class LandingLayoutDOM {
    get layoutLandingHeroCanvas() { return $<HTMLCanvasElement>("layout-landing-hero-canvas"); }
    get layoutLandingAuthToggle() { return $<HTMLAnchorElement>("layout-landing-auth-toggle"); }
    get landingLayoutModalLayerDiv() { return $<HTMLDivElement>("landing-layout-modal-layer-div"); }
}

export interface LandingLayoutDomMap {
    layoutLandingHeroCanvas: HTMLCanvasElement | null;
    layoutLandingAuthToggleA: HTMLElement | null;
    landingLayoutModalLayerDiv: HTMLDivElement | null;
}

export const DOM = new LandingLayoutDOM();
