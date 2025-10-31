// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   EventBus.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/23 11:56:54 by jeportie          #+#    #+#             //
//   Updated: 2025/10/23 12:02:11 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export class EventBus {
    constructor() {
        this.listeners = {};
    }
    on(event, fn) {
        (this.listeners[event] ||= []).push(fn);
    }
    emit(event, data) {
        (this.listeners[event] || []).forEach((fn) => fn(data));
    }
}

