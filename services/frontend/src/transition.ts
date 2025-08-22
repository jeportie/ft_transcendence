// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   transition.ts                                      :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/22 16:00:20 by jeportie          #+#    #+#             //
//   Updated: 2025/08/22 16:00:31 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

type Variant = "slide" | "fade" | "zoom" | "none";

export function createRouteTransition(defaultVariant: Variant = "slide") {
    return function transition(el: HTMLElement, phase: "out" | "in") {
        // Per-navigation override: router.navigateTo(url, { state: { trans: "fade" } })
        const state = history.state as { trans?: Variant } | null;
        const variant: Variant = state?.trans ?? defaultVariant;

        // Expose variant to CSS
        el.setAttribute("data-trans", variant);

        // If no animation desired, just resolve
        if (variant === "none") return Promise.resolve();

        return new Promise<void>((resolve) => {
            const end = () => {
                el.removeEventListener("transitionend", end);
                resolve();
            };

            if (phase === "out") {
                el.classList.remove("route-enter", "route-enter-active");
                el.classList.add("route-leave");
                requestAnimationFrame(() => {
                    el.classList.add("route-leave-active");
                    el.addEventListener("transitionend", end, { once: true });
                });
            } else {
                el.classList.remove("route-leave", "route-leave-active");
                el.classList.add("route-enter");
                requestAnimationFrame(() => {
                    el.classList.add("route-enter-active");
                    el.addEventListener("transitionend", end, { once: true });
                });
            }
        });
    };
}
