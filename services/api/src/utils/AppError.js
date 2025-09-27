// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   AppError.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/27 14:01:13 by jeportie          #+#    #+#             //
//   Updated: 2025/09/27 14:30:07 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export class AppError extends Error {
    constructor(code, message, status = 400, logMessage = null) {
        super(message);
        this.name = "AppError";
        this.code = code;
        this.publicMessage = message;
        this.status = status;
        this.logMessage = logMessage;
        Error.captureStackTrace?.(this, this.constructor);
    }

    static handle(err, req, reply, context = "[App]") {
        if (err instanceof AppError) {
            if (err.logMessage)
                req.server.log.warn(err.logMessage);
            return reply.code(err.status).send({
                success: false,
                error: err.publicMessage,
                code: err.code,
                status: err.status,
                context
            });
        }

        req.server.log.error(err, `${context} Unexpected error`);
        return reply.code(500).send({
            success: false,
            error: "Unexpected error",
            code: "UNEXPECTED_ERROR",
            status: 500,
            context
        });
    }
}
