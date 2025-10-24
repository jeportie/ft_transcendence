// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   useValueOrMotion.ts                                :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 11:56:56 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 11:57:12 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { MotionValue } from "./motion";

export function useValueOrMotion<T>(value: T | MotionValue<T>): MotionValue<T> {
    return value instanceof MotionValue ? value : new MotionValue(value);
}

export function getValueOrMotion<T>(value: T | MotionValue<T>): T {
    return value instanceof MotionValue ? value.get() : value;
}
