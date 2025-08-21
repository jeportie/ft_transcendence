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

export default class Router {
    constructor(opts) {
        this.routes = opts.routes.map((r) => {
            const { regex, keys, isCatchAll } = pathToRegex(r.path);
            return { path: r.path, view: r.view, regex, keys, isCatchAll };
        });

        this.notFound =
            this.routes.find((r) => r.isCatchAll) ||
            (opts.notFoundPath
                ? this.routes.find((r) => r.path === opts.notFoundPath)
                : undefined);

        const m = document.querySelector(opts.mountSelector ?? "#app");
        if (!m) throw new Error("Router: mount element not found");
        this.mountEl = m;

        this.linkSelector = opts.linkSelector ?? "[data-link]";
        this.onBeforeNavigate = opts.onBeforeNavigate;
        this.currentView = null;
        this.started = false;

        this.handlePopState = this.handlePopState.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    start() {
        if (this.started) return;
        this.started = true;

        window.addEventListener("popstate", this.handlePopState);
        document.body.addEventListener("click", this.handleClick);

        this.render();
    }

    stop() {
        if (!this.started) return;
        this.started = false;

        window.removeEventListener("popstate", this.handlePopState);
        document.body.removeEventListener("click", this.handleClick);
    }

    navigateTo(url, opts) {
        if (this.onBeforeNavigate && this.onBeforeNavigate(url) === false) return;

        if (opts?.replace) history.replaceState(opts?.state ?? null, "", url);
        else history.pushState(opts?.state ?? null, "", url);

        this.render();
    }

    handlePopState() {
        this.render();
    }

    handleClick(e) {
        if (e.defaultPrevented) return;
        if (e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const a = e.target.closest(this.linkSelector);
        if (!a) return;

        if (
            a.target === "_blank" ||
            a.hasAttribute("download") ||
            a.getAttribute("rel") === "external"
        )
            return;

        const url = new URL(a.href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (url.pathname.startsWith("/api/")) return;

        e.preventDefault();
        const next = url.pathname + url.search;
        this.navigateTo(next);
    }

    match(pathname) {
        for (const r of this.routes) {
            const m = pathname.match(r.regex);
            if (!m) continue;

            const values = m.slice(1);
            const params = {};
            r.keys.forEach((k, i) => {
                params[k] = decodeURIComponent(values[i] ?? "");
            });
            return { route: r, params };
        }
        return null;
    }

    buildContext(pathname, params) {
        return {
            path: pathname,
            params,
            query: parseQuery(window.location.search),
            state: history.state,
        };
    }

    async render() {
        const pathname = normalize(window.location.pathname);

        const m = this.match(pathname);
        const route = m?.route || this.notFound;
        const params = m?.params || {};

        if (!route) {
            this.mountEl.innerHTML = "<h1>Not Found</h1>";
            return;
        }

        this.currentView?.destroy?.();

        const ctx = this.buildContext(pathname, params);
        const view = new route.view(ctx);

        const html = await view.getHTML();
        this.mountEl.innerHTML = typeof html === "string" ? html : String(html);
        this.currentView = view;
        view.mount?.();
    }
}
