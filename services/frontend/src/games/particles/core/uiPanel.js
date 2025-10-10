// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   uiPanel.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 09:45:19 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 09:45:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { Pane } from "tweakpane";

export function createUIPanel(state) {
    const pane = new Pane({ title: "ParticleFX Controls" });
    const f = pane.addFolder({ title: "Dynamics" });
    f.addInput(state.params, "baseRadius", { min: 50, max: 300 });
    f.addInput(state.params, "mouseStrength", { min: 0.01, max: 0.2 });
    f.addInput(state.params, "originK", { min: 0.0001, max: 0.002 });
    f.addInput(state.params, "damping", { min: 0.95, max: 0.999 });
    f.addInput(state.params, "flyerSpeedMin", { min: 1, max: 40 });
    f.addInput(state.params, "flyerSpeedMax", { min: 1, max: 40 });

    const modeBtn = pane.addButton({ title: "Toggle Mode" });
    modeBtn.on("click", () => toggleCinematicMode(state));
}
