// AUTO-GENERATED FILE — DO NOT EDIT
// Aggregated from 1 HTML file(s)
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * MatchDOM — Lazy DOM accessor for all elements in this folder.
 */
export class MatchDOM {
  get pongCanvas() { return $<HTMLCanvasElement>("pong-canvas"); }
  get pongStartBtn() { return $<HTMLButtonElement>("pong-start-btn"); }
  get pongStopBtn() { return $<HTMLButtonElement>("pong-stop-btn"); }
}

export interface MatchDomMap {
  pongCanvas: HTMLCanvasElement | null;
  pongStartBtn: HTMLButtonElement | null;
  pongStopBtn: HTMLButtonElement | null;
}

export const DOM = new MatchDOM();
