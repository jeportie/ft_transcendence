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

type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

export interface Logger {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    setLevel(level: LogLevel): void;
    withPrefix(prefix: string): Logger;
}

let currentLevel: LogLevel = "debug";
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3, silent: 4 };

function shouldLog(level: LogLevel) {
    return LEVELS[level] >= LEVELS[currentLevel];
}

// 🧩 Helper that applies color & prefix formatting
function makePrefixedLogger(prefix = "") {
    return {
        withPrefix: (p: string) => makePrefixedLogger(`${prefix} ${p}`.trim()),

        debug: (...args: any[]) => {
            if (shouldLog("debug"))
                console.debug(`%c${prefix}`, "color: gray", ...args);
        },

        info: (...args: any[]) => {
            if (shouldLog("info"))
                console.info(`%c${prefix}`, "color: cyan", ...args);
        },

        warn: (...args: any[]) => {
            if (shouldLog("warn"))
                console.warn(`%c${prefix}`, "color: orange", ...args);
        },

        error: (...args: any[]) => {
            if (shouldLog("error"))
                console.error(`%c${prefix}`, "color: red", ...args);
        },

        setLevel(level: LogLevel) {
            currentLevel = level;
        },
    };
}

console.log("[Logger] Loaded logger module");

// Export a base prefixed logger
export const logger = makePrefixedLogger("");
