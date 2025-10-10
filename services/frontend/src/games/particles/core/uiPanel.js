// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   uiPanel.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 09:45:19 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 11:41:23 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Pane } from "tweakpane";
import { Events } from "./events.js";
import { setSeed, setParticleMap, toggleCinematicMode } from "./controls.js";

export function createUIPanel(state) {
    const pane = new Pane({ container: document.body });
    const el = pane.element;

    /* ---------- Floating + draggable styling ---------- */
    Object.assign(el.style, {
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 1000,
        cursor: "move",
        background: "rgba(15,15,20,0.85)",
        borderRadius: "8px",
        backdropFilter: "blur(8px)",
        padding: "6px",
        color: "#ddd",
        fontSize: "12px",
    });

    // Simple drag logic
    let drag = null;
    el.addEventListener("mousedown", (e) => {
        if (e.target.closest(".tp-lblv_l, .tp-btnv")) return;
        drag = { x: e.clientX, y: e.clientY, top: el.offsetTop, left: el.offsetLeft };
        document.body.style.userSelect = "none";
    });
    window.addEventListener("mouseup", () => {
        drag = null;
        document.body.style.userSelect = "";
    });
    window.addEventListener("mousemove", (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        el.style.top = drag.top + dy + "px";
        el.style.left = drag.left + dx + "px";
        el.style.right = "auto";
    });

    /* ---------- Detect Tweakpane version ---------- */
    const isV4 = typeof pane.addBinding === "function";

    /* ---------- Parameter sliders ---------- */
    for (const [key, meta] of Object.entries(state.config.schema)) {
        if (meta.type !== "number") continue;

        const opts = {
            min: meta.min ?? 0,
            max: meta.max ?? meta.default * 2,
            step: ((meta.max ?? 1) - (meta.min ?? 0)) / 100 || 0.01,
            label: key,
        };

        const onChange = (value) => {
            state.params[key] = value;
            // trigger re-init for structural params
            if (key === "seed") setSeed(state, state.params.seed);
            if (key === "N") setParticleMap(state, state.params.mapName);
        };

        if (isV4) {
            pane.addBinding(state.params, key, opts).on("change", (ev) => onChange(ev.value));
        } else {
            const input = pane.addInput(state.params, key, opts);
            input.on("change", (ev) => onChange(ev.value));
        }
    }

    /* ---------- Listen to global param events ---------- */
    Events.on("params.changed", (params) => {
        if (params._pendingReinit) return;
        // could log or later refresh UI dynamically if schema changes
        // console.log("[UI] Params changed", params);
    });

    /* ---------- Toggle mode button ---------- */
    if (isV4) {
        pane.addBlade({
            view: "button",
            label: "mode",
            title: "Toggle Mode",
        }).on("click", () => toggleCinematicMode(state));
    } else {
        const btn = pane.addButton({ title: "Toggle Mode" });
        btn.on("click", () => toggleCinematicMode(state));
    }

    /* ---------- Floating show/hide button ---------- */
    const toggleBtn = document.createElement("button");
    Object.assign(toggleBtn.style, {
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 2000,
        background: "#1e293b",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: "12px",
    });
    toggleBtn.textContent = "🧩 Panel";
    toggleBtn.onclick = () => {
        el.style.display = el.style.display === "none" ? "block" : "none";
    };
    document.body.appendChild(toggleBtn);

    console.log("[UI] Panel created (Tweakpane", isV4 ? "v4+" : "v3", ")");
}
