// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   enableSchema.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28 14:50:26 by jeportie          #+#    #+#             //
//   Updated: 2025/09/28 14:50:39 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export const enableSchema = {
    summary: "Enable 2FA (init setup)",
    description: "Generates a TOTP secret + QR code for the user to scan with Google Authenticator.",
    tags: ["2FA"],
    operationId: "enable2FA",

};
