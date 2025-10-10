// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   uiPanel.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 09:45:19 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 10:38:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Pane } from "tweakpane";
import { toggleCinematicMode } from "./controls.js";

export function createUIPanel(state) {
    const pane = new Pane({ title: "ParticleFX Controls" });
    const f = pane.addFolder({ title: "Dynamics" });

    for (const [key, meta] of Object.entries(state.config.schema)) {
        if (meta.type === "number") {
            f.addInput(state.params, key, {
                min: meta.min ?? 0,
                max: meta.max ?? meta.default * 2,
            });
        }
    }

    const modeBtn = pane.addButton({ title: "Toggle Mode" });
    modeBtn.on("click", () => toggleCinematicMode(state));
}
