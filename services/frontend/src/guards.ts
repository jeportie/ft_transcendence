// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   guards.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/26 11:00:35 by jeportie          #+#    #+#             //
//   Updated: 2025/08/26 11:01:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// Example guard (redirect if not logged in)
export const requireAuth = (ctx: any) => {
    const logged = Boolean(localStorage.getItem("token"));
    return logged || "/login";
};

// Optional global block for API paths
export const onBeforeNavigate = (to: string) => {
    if (to.startsWith("/api/")) return false;
};
