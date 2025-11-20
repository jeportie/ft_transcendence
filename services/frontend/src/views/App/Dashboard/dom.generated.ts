// AUTO-GENERATED FILE — DO NOT EDIT
// Aggregated from 1 HTML file(s)
// Created by scripts/generateDomRegistry.mjs

function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * DashboardDOM — Lazy DOM accessor for all elements in this folder.
 */
export class DashboardDOM {
  get dashboardInfoDiv() { return $<HTMLDivElement>("dashboard-info-div"); }
}

export interface DashboardDomMap {
  dashboardInfoDiv: HTMLDivElement | null;
}

export const DOM = new DashboardDOM();
