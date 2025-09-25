// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   health.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/02 17:43:14 by jeportie          #+#    #+#             //
//   Updated: 2025/09/23 15:13:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { healthSchema } from "../../schemas/healthSchema.js";
import { getHealth } from "../../services/system/health.js";

export default async function(app) {
    app.get('/health', { schema: healthSchema }, async () => {
        const data = await getHealth(app);
        if (data)
            return (data);
    });
};
