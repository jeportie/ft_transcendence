// AUTO-GENERATED FILE — DO NOT EDIT
// Aggregated from 1 HTML file(s)
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * AppLayoutDOM — Lazy DOM accessor for all elements in this folder.
 */
export class AppLayoutDOM {
  get appLayout() { return $<HTMLElement>("app-layout"); }
  get appMenuCanvas() { return $<HTMLCanvasElement>("app-menu-canvas"); }
  get appOverlayCanvas() { return $<HTMLCanvasElement>("app-overlay-canvas"); }
  get appSidebar() { return $<HTMLElement>("app-sidebar"); }
  get appLogoutBtn() { return $<HTMLButtonElement>("app-logout-btn"); }
  get appSidebarToggleBtn() { return $<HTMLButtonElement>("app-sidebar-toggle-btn"); }
}

export interface AppLayoutDomMap {
  appLayout: HTMLElement | null;
  appMenuCanvas: HTMLCanvasElement | null;
  appOverlayCanvas: HTMLCanvasElement | null;
  appSidebar: HTMLElement | null;
  appLogoutBtn: HTMLButtonElement | null;
  appSidebarToggleBtn: HTMLButtonElement | null;
}

export const DOM = new AppLayoutDOM();
