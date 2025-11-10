// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   wireGlobals.ts                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/10 15:11:26 by jeportie          #+#    #+#             //
//   Updated: 2025/11/10 15:11:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export function wireGlobals(app: any) {
    // Avoid duplicating listeners when HMR reloads
    const LOGOUT_HANDLER = "__mini_logout_handler_installed__";
    if (!(window as any)[LOGOUT_HANDLER]) {
        window.addEventListener("auth:logout", () => {
            const next = encodeURIComponent(location.pathname + location.search + location.hash);
            app.navigateTo(`/login?next=${next}`);
        });
        (window as any)[LOGOUT_HANDLER] = true;
    }

    // Optional: expose a stable global helper
    (window as any).navigateTo = (url: string, opts?: any) => app.navigateTo(url, opts);
}
