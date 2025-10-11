// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   setupLogoAnimation.ts                              :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/11 11:34:19 by jeportie          #+#    #+#             //
//   Updated: 2025/10/11 11:35:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { DOM } from "../dom.generated.js";
import spaceShipSvg from "../../../assets/spaceship.svg";

export function setupLogoAnimation() {
    const card = DOM.loginCard;
    if (!card) return;

    // Load Lottie if not already added
    if (!document.querySelector('script[src*="dotlottie-wc"]')) {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.1/dist/dotlottie-wc.js";
        document.head.appendChild(script);
    }

    // Create logo container
    const logoContainer = document.createElement("div");
    logoContainer.className = "relative mx-auto mb-4 w-[120px] h-[120px] flex items-center justify-center";

    // Static SVG
    const staticLogo = document.createElement("div");
    staticLogo.innerHTML = spaceShipSvg;
    staticLogo.className =
        "absolute inset-0 opacity-90 transition-opacity duration-300 flex items-center justify-center";
    staticLogo.querySelector("svg")?.classList.add("w-full", "h-full");

    logoContainer.appendChild(staticLogo);
    card.prepend(logoContainer);

    // Return helper for later animation (e.g., fade + replace)
    return {
        logoContainer,
        fadeAndReplaceWithLottie: () => {
            const animWrapper = document.createElement("div");
            animWrapper.innerHTML = `
        <dotlottie-wc
          src="https://lottie.host/ffd0055c-8d94-4608-8a8d-4a97fd97a035/WUB7J2v2eu.lottie"
          style="width: 100%; height: 100%;"
          autoplay loop
        ></dotlottie-wc>`;
            animWrapper.className =
                "absolute inset-0 opacity-0 transition-opacity duration-500 flex items-center justify-center";

            staticLogo.classList.replace("opacity-90", "opacity-0");
            setTimeout(() => staticLogo.remove(), 150);
            logoContainer.appendChild(animWrapper);
            setTimeout(() => animWrapper.classList.add("opacity-90"), 10);
        },
    };
}
