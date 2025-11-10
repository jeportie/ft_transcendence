// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   LoadingOverlay.ts                                  :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/11 21:48:36 by jeportie          #+#    #+#             //
//   Updated: 2025/09/11 22:42:15 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import microchipSvg from "../assets/microchip.svg";

export function showLoading(message = "Loading...") {
    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.className = "ui-loader-overlay";

    overlay.innerHTML = `
    <div class="flex flex-col items-center gap-4">
      <!-- <div class="ui-loader-spinner"></div> -->
      ${microchipSvg}
      <p class="text-lg font-medium">${message}</p>
    </div>
  `;
    document.body.appendChild(overlay);
}

export function hideLoading() {
    document.getElementById("loading-overlay")?.remove();
}

