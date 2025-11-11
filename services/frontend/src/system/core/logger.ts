// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   logger.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:13:59 by jeportie          #+#    #+#             //
//   Updated: 2025/09/15 16:14:16 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const logger = {
    ...console, // include all methods from the native console
    info: (...args: any[]) => console.log(...args),
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
};
