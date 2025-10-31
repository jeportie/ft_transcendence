// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   events.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/10 09:42:35 by jeportie          #+#    #+#             //
//   Updated: 2025/10/10 09:42:49 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const Events = {
    listeners: {},
    on(event, fn) { (this.listeners[event] ||= []).push(fn); },
    emit(event, data) { (this.listeners[event] || []).forEach(fn => fn(data)); },
};
