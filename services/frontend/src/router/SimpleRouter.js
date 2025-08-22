// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   Router.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/08/21 13:55:36 by jeportie          #+#    #+#             //
//   Updated: 2025/08/21 15:18:18 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { pathToRegex, normalize, parseQuery } from "./routerTools.js";

/**
 * Simple, framework-agnostic SPA router.
 *
 * Public API:
 *   - new Router(options)
 *   - router.start()
 *   - router.stop()
 *   - router.navigateTo(url, { replace?, state? })
 *
 * Views must implement:
 *   - async getHTML(): string
 *   - mount?(): void        (optional, runs after HTML is in the DOM)
 *   - destroy?(): void      (optional, runs before unmount)
 */

/**
 * @typedef RouterOptions
 * @prop {Array<{ path:string, view:new(ctx:any)=>any }>} routes
 * @prop {string} [mountSelector="#app"]
 * @prop {string} [linkSelector="[data-link]"]
 * @prop {(to:string)=>boolean|void|Promise<boolean|void>} [onBeforeNavigate]
 * @prop {string} [notFoundPath] Optional explicit not-found path in your route table
 */

export default class Router {
    #routes = [];
    #notFound;
    #mountEl;
    #linkSelector;
    #onBeforeNavigate;
    #currentView = null;
    #started = false;

    #onPopState = () => {
        this.#render();
    };

    #onClick = (event) => {
        // Only normal left-clicks
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        // Find the nearest matching link
        const target = event.target;
        if (!(target instanceof Element)) return;

        const linkEl = target.closest(this.#linkSelector);
        if (!linkEl) return;

        // Respect standard link behaviors
        if (linkEl.target === "_blank") return;
        if (linkEl.hasAttribute("download")) return;
        if (linkEl.getAttribute("rel") === "external") return;

        // Only handle same-origin, non-API links
        const urlObj = new URL(linkEl.href, window.location.origin);
        if (urlObj.origin !== window.location.origin) return;
        if (urlObj.pathname.startsWith("/api/")) return;

        // SPA navigation
        event.preventDefault();
        const pathAndQuery = urlObj.pathname + urlObj.search;
        this.navigateTo(pathAndQuery);
    };

    /**
     * @param {RouterOptions} opts
     * @throws {Error} If mount element isn't found or routes are empty
     */
    constructor(opts) {
        if (!opts || !Array.isArray(opts.routes) || opts.routes.length === 0) {
            throw new Error("Router: you must provide a non-empty routes array.");
        }

        // Precompile routes to regexes for fast matching
        this.#routes = opts.routes.map((r) => {
            const { regex, keys, isCatchAll } = pathToRegex(r.path);
            return { path: r.path, view: r.view, regex, keys, isCatchAll };
        });

        // Optional explicit notFound mapping, or the first catch-all definition ("*")
        this.#notFound =
            this.#routes.find((r) => r.isCatchAll) ||
            (opts.notFoundPath
                ? this.#routes.find((r) => r.path === opts.notFoundPath)
                : undefined);

        // Mount point in the DOM where views will be injected
        const m = document.querySelector(opts.mountSelector ?? "#app");
        if (!m) throw new Error("Router: mount element not found.");
        this.#mountEl = /** @type {HTMLElement} */ (m);

        this.#linkSelector = opts.linkSelector ?? "[data-link]";
        this.#onBeforeNavigate = opts.onBeforeNavigate;
    }

    /**
     * Start handling navigation:
     * - Binds `popstate` (back/forward) and delegated link clicks.
     * - Performs initial render.
     */
    start() {
        if (this.#started) return;
        this.#started = true;
        // Listen for browser history navigation
        window.addEventListener("popstate", this.#onPopState);
        // Intercept clicks on internal links (delegation for performance)
        document.body.addEventListener("click", this.#onClick);
        this.#render();
    }

    /**
     * Stop handling navigation and remove event listeners.
     */
    stop() {
        if (!this.#started) return;
        this.#started = false;

        window.removeEventListener("popstate", this.#onPopState);
        document.body.removeEventListener("click", this.#onClick);
    }

    /**
     * Programmatically navigate within the SPA.
     *
     * @param {string} url A path + optional query string (e.g. "/posts/7?tab=comments")
     * @param {{ replace?: boolean, state?: any }} [opts]
     *   - replace: use history.replaceState instead of pushState
     *   - state:   arbitrary serializable state stored in history.state
     */
    async navigateTo(url, opts) {
        // Allow user-defined guard/confirm (sync or async). Any falsey return cancels.
        if (this.#onBeforeNavigate) {
            const result = await this.#onBeforeNavigate(url);
            if (result === false) return;
        }

        // Update the address bar without a full reload
        if (opts?.replace) {
            history.replaceState(opts?.state ?? null, "", url);
        } else {
            history.pushState(opts?.state ?? null, "", url);
        }
        this.#render();
    }

    /**
     * Try to match the current pathname against known routes.
     * @param {string} pathname Normalized path (e.g. "/posts/7")
     * @returns {{ route:any, params:Record<string,string> } | null}
     */
    #match(pathname) {
        for (const r of this.#routes) {
            const m = pathname.match(r.regex);
            if (!m) continue;

            const values = m.slice(1); // capture groups
            const params = {};
            r.keys.forEach((k, i) => {
                params[k] = decodeURIComponent(values[i] ?? "");
            });
            return { route: r, params };
        }
        return null;
    }

    /**
     * Build the per-view context object.
     * @param {string} pathname
     * @param {Record<string,string>} params
     * @returns {{ path:string, params:Record<string,string>, query:Record<string,string>, state:any }}
     */
    #buildContext(pathname, params) {
        return {
            path: pathname,
            params,
            query: parseQuery(window.location.search),
            state: history.state,
        };
    }

    /**
     * Core render pipeline:
     * - Resolve current route
     * - Destroy previous view
     * - Instantiate new view with context
     * - Inject HTML into mount point
     * - Call mount() lifecycle
     */
    async #render() {
        const pathname = normalize(window.location.pathname);

        const m = this.#match(pathname);
        const route = m?.route || this.#notFound;
        const params = m?.params || {};

        if (!route) {
            this.#mountEl.innerHTML = "<h1>Not Found</h1>";
            return;
        }
        this.#currentView?.destroy?.();

        const ctx = this.#buildContext(pathname, params);
        const view = new route.view(ctx);
        const html = await view.getHTML();

        this.#mountEl.innerHTML = typeof html === "string" ? html : String(html);
        this.#currentView = view;
        view.mount?.();
    }
}
