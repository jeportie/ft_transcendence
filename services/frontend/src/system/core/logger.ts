// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   logger.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/15 16:13:59 by jeportie          #+#    #+#             //
//   Updated: 2025/11/12 18:45:00 by jeportie         ###   ########.fr       //
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
let currentPrefixFilter: string | null = null;

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3, silent: 4 };

// ──────────────────────────────────────────────────────────────────────────── //
// Registry of all created prefix loggers
// ──────────────────────────────────────────────────────────────────────────── //
const prefixRegistry = new Map<string, Logger>();

function shouldLog(level: LogLevel) {
    return LEVELS[level] >= LEVELS[currentLevel];
}

function matchesPrefixFilter(prefix: string): boolean {
    if (!currentPrefixFilter) return true;
    return prefix.includes(currentPrefixFilter);
}

// ──────────────────────────────────────────────────────────────────────────── //
// Factory
// ──────────────────────────────────────────────────────────────────────────── //
function makePrefixedLogger(prefix = ""): Logger {
    const instance: Logger = {
        withPrefix(p: string) {
            const full = `${prefix} ${p}`.trim();
            if (prefixRegistry.has(full)) return prefixRegistry.get(full)!;
            const logger = makePrefixedLogger(full);
            prefixRegistry.set(full, logger);
            return logger;
        },

        debug: (...args: any[]) => {
            if (shouldLog("debug") && matchesPrefixFilter(prefix))
                console.debug(`%c${prefix}`, "color: cyan", ...args);
        },

        info: (...args: any[]) => {
            if (shouldLog("info") && matchesPrefixFilter(prefix))
                console.info(`%c${prefix}`, "color: green", ...args);
        },

        warn: (...args: any[]) => {
            if (shouldLog("warn") && matchesPrefixFilter(prefix))
                console.warn(`%c${prefix}`, "color: orange", ...args);
        },

        error: (...args: any[]) => {
            if (shouldLog("error") && matchesPrefixFilter(prefix))
                console.error(`%c${prefix}`, "color: red", ...args);
        },

        setLevel(level: LogLevel) {
            currentLevel = level;
        },
    };

    if (!prefixRegistry.has(prefix))
        prefixRegistry.set(prefix, instance);

    return instance;
}

// ──────────────────────────────────────────────────────────────────────────── //
// Global control API
// ──────────────────────────────────────────────────────────────────────────── //
const baseLogger = makePrefixedLogger("");

const controlAPI = {
    setGlobalLevel(level: LogLevel) {
        currentLevel = level;
    },

    setPrefixFilter(filter: string | null) {
        currentPrefixFilter = filter;
        if (filter)
            console.info(`[Logger] Showing only prefixes containing "${filter}"`);
        else
            console.info("[Logger] Showing all prefixes");
    },

    listPrefixes(show = true) {
        const list = Array.from(prefixRegistry.keys()).sort();
        if (show) {
            if (currentPrefixFilter) {
                console.info(
                    `%c[Logger] Current filter: "${currentPrefixFilter}"`,
                    "color: cyan; font-weight: bold"
                );
            } else {
                console.info("%c[Logger] Current filter: none", "color: gray");
            }

            const data = list.map((p) => ({
                prefix: p || "(root)",
            }));
            console.table(data);
        }
        return list;
    },
};

export const logger: Logger & typeof controlAPI = Object.assign(baseLogger, controlAPI);

