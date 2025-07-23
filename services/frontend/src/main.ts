// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   main.ts                                            :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/07/14 17:49:45 by jeportie          #+#    #+#             //
//   Updated: 2025/07/14 17:53:26 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

fetch('/health.json')
	.then(r => {
		if (!r.ok) throw new Error(`HTTP ${r.status}`);
		return r.json();
	})
	.then(console.log)
	.catch(console.error);

console.log("TS is RUNNING!");
