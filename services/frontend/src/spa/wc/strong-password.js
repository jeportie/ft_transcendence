// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   strong-password.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/30 11:40:00 by jeportie          #+#    #+#             //
//   Updated: 2025/10/30 13:37:51 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export class StrongPassword extends HTMLElement {
    static formAssociated = true;

    #internals;
    #input;
    #progress;
    #rules = {};
    #mode = "full";
    #built = false;

    constructor() {
        super();
        this.#internals = this.attachInternals();
    }

    connectedCallback() {
        if (!this.#built) this.#build();

        this.#input.addEventListener("input", () => this.#evaluate());
        this.#input.addEventListener("focus", () =>
            this.dispatchEvent(new FocusEvent("focus", { bubbles: true }))
        );
        this.#input.addEventListener("blur", () =>
            this.dispatchEvent(new FocusEvent("blur", { bubbles: true }))
        );
    }

    // ==============================================================
    // 🧱 Build DOM
    // ==============================================================

    #build() {
        this.#built = true;
        this.#mode = this.getAttribute("mode") || "full";

        // --- Wrapper ---
        const wrapper = document.createElement("div");
        Object.assign(wrapper.style, {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            width: "100%",
        });
        this.appendChild(wrapper);

        // --- Input wrapper (for eye icon positioning) ---
        const inputWrap = document.createElement("div");
        Object.assign(inputWrap.style, {
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
        });
        wrapper.appendChild(inputWrap);

        // --- Input field ---
        this.#input = document.createElement("input");
        this.#input.type = "password";
        this.#input.placeholder = this.getAttribute("placeholder") || "Enter password";
        Object.assign(this.#input.style, {
            width: "100%",
            borderRadius: "0.375rem", // rounded-md
            padding: "0.5rem 2.2rem 0.5rem 0.75rem", // right padding for eye icon
            backgroundColor: "rgba(10,10,15,0.4)", // bg-neutral-950/40
            color: "rgba(255,255,255,0.94)",       // text-neutral-100
            border: "1px solid rgba(255,255,255,0.1)", // border-white/10
            outline: "none",
            backdropFilter: "blur(12px) saturate(140%)",
            WebkitBackdropFilter: "blur(12px) saturate(140%)",
            transition: "border-color 0.2s ease, background-color 0.2s ease",
        });

        this.#input.addEventListener("focus", () => {
            this.#input.style.borderColor = "rgba(255,255,255,0.3)";
            this.#input.style.backgroundColor = "rgba(20,20,30,0.45)";
        });

        this.#input.addEventListener("blur", () => {
            this.#input.style.borderColor = "rgba(255,255,255,0.1)";
            this.#input.style.backgroundColor = "rgba(10,10,15,0.4)";
        });

        inputWrap.appendChild(this.#input);

        // --- Eye toggle button with inline SVGs ---
        const btn = document.createElement("button");
        btn.type = "button";
        Object.assign(btn.style, {
            position: "absolute",
            right: "0.6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1.5rem",
            height: "1.5rem",
            background: "none",
            border: "none",
            padding: "0",
            cursor: "pointer",
            color: "rgba(255,255,255,0.7)",
            opacity: "0.8",
            transition: "opacity 0.2s",
            lineHeight: "0",
        });


        const svgShow = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
     width="23" height="23" fill="none" stroke="#ffffff" stroke-width="32"
     stroke-linecap="round" stroke-linejoin="round"
     style="
       opacity: 0.8;
       transition: opacity 0.25s ease, stroke 0.25s ease;
     ">
  <path d="M256 128C136 128 48 256 48 256s88 128 208 128 208-128 208-128S376 128 256 128Z"/>
  <circle cx="256" cy="256" r="65"/>
</svg>
`;

        const svgHide = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
     width="23" height="23" fill="none" stroke="#ffffff" stroke-width="32"
     stroke-linecap="round" stroke-linejoin="round"
     style="
       opacity: 0.8;
       transition: opacity 0.25s ease, stroke 0.25s ease;
     ">
  <path d="M256 128C136 128 48 256 48 256s88 128 208 128 208-128 208-128S376 128 256 128Z"/>
  <circle cx="256" cy="256" r="65"/>
  <path d="M416 96L96 416"/>
</svg>
`;


        btn.innerHTML = svgShow;

        btn.addEventListener("mouseenter", () => (btn.style.opacity = "1"));
        btn.addEventListener("mouseleave", () => (btn.style.opacity = "0.8"));

        btn.addEventListener("click", () => {
            const isVisible = this.#input.type === "text";
            this.#input.type = isVisible ? "password" : "text";
            btn.innerHTML = isVisible ? svgShow : svgHide;
        });

        inputWrap.appendChild(btn);

        // --- Progress bar ---
        this.#progress = document.createElement("div");
        Object.assign(this.#progress.style, {
            height: "4px",
            width: "100%",
            borderRadius: "2px",
            background: "rgba(255,255,255,0.1)",
            overflow: "hidden",
            marginTop: "4px",
        });

        const bar = document.createElement("div");
        Object.assign(bar.style, {
            height: "100%",
            width: "0%",
            borderRadius: "2px",
            background: "#ef4444", // red
            transition: "width 0.3s ease, background 0.3s ease",
        });
        this.#progress.appendChild(bar);
        wrapper.appendChild(this.#progress);

        // --- Rules list (only for full mode) ---
        if (this.#mode === "full") this.#addRulesList(wrapper);
    }

    // ==============================================================
    // 🔍 Evaluate password
    // ==============================================================

    #evaluate() {
        if (!this.#progress) return;
        const pwd = this.#input.value;
        const bar = this.#progress.firstElementChild;

        const rules = {
            length: pwd.length >= 8,
            lower: /[a-z]/.test(pwd),
            upper: /[A-Z]/.test(pwd),
            number: /\d/.test(pwd),
            symbol: /[^A-Za-z0-9]/.test(pwd),
        };

        const score = Object.values(rules).filter(Boolean).length;
        this.#internals.setFormValue(pwd);

        const palette = ["#ef4444", "#fb923c", "#facc15", "#4ade80", "#10b981"];
        const idx = Math.max(0, Math.min(score - 1, palette.length - 1));
        bar.style.background = palette[idx];
        bar.style.width = `${(score / 5) * 100}%`;

        if (this.#mode === "minimal") return;

        // --- Update checklist only in full mode ---
        for (const [key, valid] of Object.entries(rules)) {
            const li = this.#rules[key];
            if (!li) continue;
            const icon = li.querySelector("svg");
            const span = li.querySelector("span");

            if (valid) {
                icon.innerHTML =
                    '<path fill="currentColor" d="M7.629 13.933L4.2 10.5l1.4-1.4 2.029 2.028L14.4 4.9l1.4 1.4z"/>';
                icon.style.color = "#10b981"; // green
                span.style.color = "#10b981";
            } else {
                icon.innerHTML =
                    '<path fill="currentColor" d="M5.3 4.3L4.3 5.3 8.0 9l-3.7 3.7 1 1L9 10l3.7 3.7 1-1L10 9l3.7-3.7-1-1L9 8l-3.7-3.7z"/>';
                icon.style.color = "#9ca3af"; // gray
                span.style.color = "#9ca3af";
            }
        }
    }

    // ==============================================================
    // ❌ Mark invalid
    // ==============================================================

    markInvalid() {
        const bar = this.#progress?.firstElementChild;
        if (bar) {
            bar.style.background = "#dc2626";
            bar.style.width = "100%";
        }

        if (this.#mode === "full") {
            for (const li of Object.values(this.#rules)) {
                const icon = li.querySelector("svg");
                const span = li.querySelector("span");
                icon.innerHTML =
                    '<path fill="currentColor" d="M5.3 4.3L4.3 5.3 8.0 9l-3.7 3.7 1 1L9 10l3.7 3.7 1-1L10 9l3.7-3.7-1-1L9 8l-3.7-3.7z"/>';
                icon.style.color = "#ef4444";
                span.style.color = "#f87171";
            }
        }

        this.#input.style.border = "1px solid #ef4444";
        setTimeout(() => {
            this.#input.style.border = "1px solid rgba(255,255,255,0.1)";
        }, 1000);
    }

    // ==============================================================
    // 🧩 Add rules list
    // ==============================================================

    #addRulesList(wrapper) {
        const ul = document.createElement("ul");
        Object.assign(ul.style, {
            listStyle: "none",
            margin: "4px 0 0 0",
            padding: "0",
        });

        const rules = {
            length: "At least 8 characters",
            lower: "One lowercase letter",
            upper: "One uppercase letter",
            number: "One number",
            symbol: "One special character",
        };

        for (const [key, label] of Object.entries(rules)) {
            const li = document.createElement("li");
            Object.assign(li.style, {
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "2px",
            });

            const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            icon.setAttribute("viewBox", "0 0 20 20");
            icon.setAttribute("width", "12");
            icon.setAttribute("height", "12");
            icon.innerHTML =
                '<path fill="currentColor" d="M5.3 4.3L4.3 5.3 8.0 9l-3.7 3.7 1 1L9 10l3.7 3.7 1-1L10 9l3.7-3.7-1-1L9 8l-3.7-3.7z"/>';
            icon.style.color = "#9ca3af";

            const span = document.createElement("span");
            span.textContent = label;
            Object.assign(span.style, {
                color: "#9ca3af",
                fontSize: "13px",
            });

            li.append(icon, span);
            ul.appendChild(li);

            this.#rules[key] = li;
        }

        wrapper.appendChild(ul);
    }

    // ==============================================================
    // Accessors
    // ==============================================================

    get value() {
        return this.#input?.value ?? "";
    }

    set value(v) {
        if (!this.#input) this.#build();
        this.#input.value = v ?? "";
        this.#evaluate();
        this.#internals.setFormValue(v);
    }

    focus() {
        this.#input?.focus();
    }
}

if (!customElements.get("strong-password")) {
    customElements.define("strong-password", StrongPassword);
}
