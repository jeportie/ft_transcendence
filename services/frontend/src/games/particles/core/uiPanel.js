// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   uiPanel.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 13:19:06 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 15:38:17 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Pane } from "tweakpane";
import { Events } from "./events.js";
import { setSeed, setParticleMap, toggleCinematicMode } from "./controls.js";

export function createUIPanel(state) {
    const pane = new Pane({ container: document.body });
    const el = pane.element;
    Object.assign(el.style, {
        position: "fixed",
        // bottom: "1rem",
        right: "1rem",
        zIndex: 1000,
        background: "rgba(15,15,20,0.85)",
        borderRadius: "8px",
        backdropFilter: "blur(8px)",
        padding: "6px",
        color: "#ddd",
        fontSize: "12px",
    });
    el.style.display = "none"; // start hidden by default
    el.style.top = el.offsetTop + "px";
    el.style.bottom = "auto";

    /* ---------------- Draggable window ---------------- */
    const header = document.createElement("div");
    header.textContent = "⋮⋮ Particles";
    Object.assign(header.style, {
        cursor: "move",
        fontWeight: "600",
        letterSpacing: "0.2px",
        padding: "4px 8px",
        marginBottom: "6px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        userSelect: "none",
    });
    el.prepend(header);

    let drag = null;
    header.addEventListener("mousedown", (e) => {
        drag = { x: e.clientX, y: e.clientY, top: el.offsetTop, left: el.offsetLeft };
        document.body.style.userSelect = "none";
    });
    window.addEventListener("mouseup", () => { drag = null; document.body.style.userSelect = ""; });
    window.addEventListener("mousemove", (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        const newTop = Math.max(8, drag.top + dy);
        const newLeft = Math.max(8, drag.left + dx);
        el.style.top = newTop + "px";
        el.style.left = newLeft + "px";
        el.style.right = "auto";
    });


    /* ---------------- Folder organization ---------------- */
    const groups = {
        System: ["N", "seed", "mapName"],
        Motion: ["baseRadius", "radiusVelocityGain", "mouseStrength", "originK", "damping", "linkDist", "timeScale"],
        Flyers: ["flyerSpeedMin", "flyerSpeedMax", "flyerSpawnMin", "flyerSpawnMax",
            "flyerMaxAtOnce", "flyerCooldownMinMs", "flyerCooldownMaxMs"],
        Visual: ["breathe", "breatheSpeed", "breatheDepth"],
    };

    const makeBinding = (folder, key, meta) => {
        const opts = {
            min: meta.min ?? 0,
            max: meta.max ?? (typeof meta.default === "number" ? meta.default * 2 : undefined),
            step: ((meta.max ?? 1) - (meta.min ?? 0)) / 100 || 0.01,
            label: key,
        };

        // tooltip via info in v4
        if (meta.description) opts.info = meta.description;

        // --- Detect data type ---
        if (meta.type === "string") {
            const textBinding = folder.addBinding(state.params, key, {
                label: key,
                view: "text",
                info: meta.description || "",
            });
            textBinding.on("change", (ev) => {
                state.params[key] = ev.value;
                if (key === "mapName") setParticleMap(state, ev.value);
            });
            return;
        }

        if (meta.type === "boolean") {
            const boolBinding = folder.addBinding(state.params, key, {
                label: key,
                info: meta.description || "",
            });
            boolBinding.on("change", (ev) => {
                state.params[key] = ev.value;
            });
            return;
        }

        // Default (numeric)
        const binding = folder.addBinding(state.params, key, opts);
        binding.on("change", (ev) => {
            const value = ev.value;
            state.params[key] = value;
            if (key === "seed") setSeed(state, value);
            if (key === "N") setParticleMap(state, state.params.mapName);
        });

    };

    for (const [group, keys] of Object.entries(groups)) {
        const folder = pane.addFolder({ title: group, expanded: group === "System" });
        for (const key of keys) {
            const meta = state.config.schema[key];
            if (!meta) continue;
            makeBinding(folder, key, meta);
        }
    }

    /* ---------------- Preset selector ---------------- */
    const presets = {
        cinematic: "Cinematic",
        reactive: "Reactive",
    };
    const presetObj = { preset: state.currentMode || "reactive" };
    const presetBlade = pane.addBinding(presetObj, "preset", {
        label: "Preset",
        options: presets,
    });
    presetBlade.on("change", (ev) => toggleCinematicMode(state, ev.value === "cinematic"));

    /* ---------------- Theme selector ---------------- */
    const themeNames = Object.keys(state.config.colors);
    const themeObj = { theme: "default" };
    const themeBlade = pane.addBinding(themeObj, "theme", {
        label: "Theme",
        options: Object.fromEntries(themeNames.map((n) => [n, n])),
    });
    themeBlade.on("change", (ev) => {
        state.currentTheme = ev.value;
    });

    /* ---------------- 📊 Stats (A: compact / B: detailed) ----------------- */
    const statsFolder = pane.addFolder({ title: "📊 Stats", expanded: false });
    const stats = {
        variant: "A (compact)",
        fps: 0,
        frameMs: 0,
        minFPS: 999,
        maxFPS: 0,
        cores: self.navigator?.hardwareConcurrency ?? "n/a",
        renderer: "Canvas 2D",
    };
    const variant = statsFolder.addBinding(stats, "variant", {
        label: "View",
        options: { "A (compact)": "A (compact)", "B (detailed)": "B (detailed)" },
        info: "Choose compact or detailed stats view.",
    });
    const bFPS = statsFolder.addBinding(stats, "fps", { label: "FPS", readonly: true });
    const bMS = statsFolder.addBinding(stats, "frameMs", { label: "Frame ms", readonly: true });
    const bCPU = statsFolder.addBinding(stats, "cores", { label: "CPU cores", readonly: true });
    const bREN = statsFolder.addBinding(stats, "renderer", { label: "Renderer", readonly: true });

    // Detailed only:
    const bMin = statsFolder.addBinding(stats, "minFPS", { label: "Min FPS", readonly: true });
    const bMax = statsFolder.addBinding(stats, "maxFPS", { label: "Max FPS", readonly: true });

    function setDetailedVisible(on) {
        const elMin = bMin.controller.view.element.closest(".tp-lblv");
        const elMax = bMax.controller.view.element.closest(".tp-lblv");
        if (elMin) elMin.style.display = on ? "" : "none";
        if (elMax) elMax.style.display = on ? "" : "none";
    }

    setDetailedVisible(false);
    variant.on("change", (ev) => setDetailedVisible(ev.value === "B (detailed)"));

    // Live updates via Events from engine
    Events.on("stats.frame", ({ fps, frameMs }) => {
        // smoothing
        const sFPS = Math.round(fps);
        stats.fps = sFPS;
        stats.frameMs = Math.round(frameMs);
        stats.minFPS = Math.min(stats.minFPS, sFPS);
        stats.maxFPS = Math.max(stats.maxFPS, sFPS);
        // refresh bindings
        bFPS.refresh();
        bMS.refresh();
        bMin.refresh();
        bMax.refresh();
    });


    /* ---------------- Show/Hide toggle ---------------- */
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

    console.log("[UI] Panel created (Tweakpane v4.0.5)");
}

