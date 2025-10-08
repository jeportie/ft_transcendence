// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Login.ts                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 14:13:21 by jeportie          #+#    #+#             //
//   Updated: 2025/10/08 15:33:09 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// @ts-ignore
import { AbstractView } from "@jeportie/mini-spa";
import { API } from "../spa/api.js";
import { auth } from "../spa/auth.js";
import loginHTML from "../html/login.html";
import spaceShipSvg from "../assets/spaceship.svg";
import googleIcon from "../assets/google.png";

export default class Login extends AbstractView {
    constructor(ctx: any) {
        super(ctx);
        // @ts-ignore
        this.setTitle("Login");
    }

    async getHTML() {
        return (loginHTML);
    }

    mount() {
        // Canvas restart when leaving the LandingLayout:
        (this as any).layout?.reloadOnExit?.();

        // DOM
        const loginForm = document.querySelector("#login-form");
        const userName = document.querySelector("#user-name") as HTMLInputElement;
        const userPwd = document.querySelector("#user-pwd") as HTMLInputElement;
        const errorBox = document.querySelector("#login-error");
        const googleBtn = document.querySelector("#google-btn") as HTMLButtonElement;
        const card = document.querySelector(".ui-card");

        // Create animation element (absolute in same place)
        const animWrapper = document.createElement("div");
        animWrapper.innerHTML = `
            <dotlottie-wc
                src="https://lottie.host/ffd0055c-8d94-4608-8a8d-4a97fd97a035/WUB7J2v2eu.lottie"
                style="width: 100%; height: 100%;"
                autoplay
                loop
            ></dotlottie-wc>
        `;
        animWrapper.className = "absolute inset-0 opacity-0 transition-opacity duration-500 flex items-center justify-center";

        if (card) {
            // Add the <script> if not already present
            if (!document.querySelector('script[src*="dotlottie-wc"]')) {
                const lottieScript = document.createElement("script");
                lottieScript.type = "module";
                lottieScript.src = "https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.1/dist/dotlottie-wc.js";
                document.head.appendChild(lottieScript);
            }
        }

        if (card) {
            // Create logo container
            const logoContainer = document.createElement("div");
            logoContainer.className = "relative mx-auto mb-4 w-[120px] h-[120px] flex items-center justify-center";

            // Add static SVG (default visible)
            const staticLogo = document.createElement("div");
            staticLogo.innerHTML = spaceShipSvg;
            staticLogo.className = "absolute inset-0 opacity-90 transition-opacity duration-300 flex items-center justify-center";
            staticLogo.querySelector("svg")?.classList.add("w-full", "h-full");

            // Add the container to the card
            logoContainer.appendChild(staticLogo);
            card.prepend(logoContainer);
        }

        // read ?next from URL
        const params = new URLSearchParams(location.search);
        const next = params.get("next") || "/dashboard";
        const activated = params.get("activated");
        const error = params.get("activation_failed");

        // ✅ Show success message if account was just activated
        if (activated) {
            const msg = document.createElement("div");
            msg.textContent = "Your account has been activated successfully!";
            msg.className = "ui-card-alert ui-alert-success mb-4";
            document.querySelector(".ui-card")?.prepend(msg);
            // Optionally fade it out after a few seconds
            setTimeout(() => msg.remove(), 4000);
        }
        if (error) {
            const msg = document.createElement("div");
            msg.textContent = "Error: Account not activated";
            msg.className = "ui-alert ui-alert-error mb-4";
            document.querySelector(".ui-card")?.prepend(msg);
            // Optionally fade it out after a few seconds
            setTimeout(() => msg.remove(), 4000);
        }

        // Hide error when focusing inputs
        userPwd.addEventListener("focus", () => {
            if (errorBox) {
                errorBox.classList.add("hidden");
                errorBox.textContent = "";
            }
        });

        loginForm?.addEventListener("submit", event => {
            event.preventDefault();

            API.post("/auth/login", {
                user: userName.value,
                pwd: userPwd.value,
            })
                .then(data => {
                    const logoContainer = card?.querySelector("div.relative");
                    const staticLogo = logoContainer?.querySelector("div > svg")?.parentElement;

                    if (staticLogo) {
                        staticLogo.classList.remove("opacity-90"); // ensure starting from visible
                        staticLogo.classList.add("opacity-0", "transition-opacity", "duration-150", "ease-out"); // faster fade

                        // fully remove after fade completes
                        setTimeout(() => staticLogo.remove(), 50);
                    }
                    logoContainer?.appendChild(animWrapper);
                    setTimeout(() => animWrapper.classList.add("opacity-90"), 1);

                    // Navigate after 2s
                    setTimeout(() => {
                        if (data.activation_required) {
                            window.navigateTo(`/not-active?userId=${data.user_id}`);
                        } else if (data.f2a_required) {
                            window.navigateTo(`/f2a-login?userId=${data.user_id}`);
                        } else {
                            auth.setToken(data.token || "dev-token");
                            window.navigateTo(next);
                        }
                    }, 2000);
                })
                .catch(err => {
                    console.error(`❌ [${err.code || err.status}] ${err.message}`);
                    userPwd.value = "";
                    userName.focus();

                    if (errorBox) {
                        errorBox.textContent = "Invalid username or password.";
                        errorBox.classList.remove("hidden");
                    }
                });

        })

        if (googleBtn) {
            const iconWrapper = document.createElement("span");
            iconWrapper.className = "absolute left-4 flex items-center";

            const icon = document.createElement("img");
            icon.src = googleIcon;
            icon.alt = "Google icon";
            icon.className = "w-8 h-8";

            iconWrapper.appendChild(icon);
            googleBtn.prepend(iconWrapper);
        }

        googleBtn?.addEventListener("click", () => {
            const params = new URLSearchParams(location.search);
            const next = params.get("next") || "/dashboard";
            const logoContainer = card?.querySelector("div.relative");
            const staticLogo = logoContainer?.querySelector("div > svg")?.parentElement;

            if (staticLogo) {
                staticLogo.classList.remove("opacity-90"); // ensure starting from visible
                staticLogo.classList.add("opacity-0", "transition-opacity", "duration-150", "ease-out"); // faster fade

                // fully remove after fade completes
                setTimeout(() => staticLogo.remove(), 50);
            }
            logoContainer?.appendChild(animWrapper);
            setTimeout(() => animWrapper.classList.add("opacity-90"), 1);

            setTimeout(() => window.location.href = `/api/auth/google/start?next=${encodeURIComponent(next)}`, 1800);
        });
    }
}
