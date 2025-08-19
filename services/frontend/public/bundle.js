"use strict";
(() => {
  // src/views/AbstractView.ts
  var AbstractView = class {
    constructor(ctx) {
      this.ctx = ctx;
      console.log(this.ctx);
    }
    setTitle(title) {
      document.title = title;
    }
    async getHTML() {
      return "";
    }
    mount() {
    }
    // bind DOM events here
    destroy() {
    }
    // cleanup timers/sockets/listeners
  };

  // src/views/Dashboard.ts
  var Dashboard = class extends AbstractView {
    constructor(ctx) {
      super(ctx);
      this.ctx = ctx;
      this.setTitle("Dashboard");
    }
    async getHTML() {
      return (
        /*html*/
        `
      <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
        <aside class="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
          <h2 class="text-lg font-semibold mb-3">Menu</h2>
          <nav class="flex flex-col gap-2">
            <a href="/" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
            <a href="/posts" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
            <a href="/settings" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
          </nav>
        </aside>
        <main class="space-y-4">
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <p class="text-slate-300">Welcome to your SPA dashboard!</p>
          </div>
        </main>
      </div>
    `
      );
    }
  };

  // src/views/Posts.ts
  var Posts = class extends AbstractView {
    constructor(ctx) {
      super(ctx);
      this.setTitle("Posts");
    }
    async getHTML() {
      return (
        /*html*/
        `
    <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
      <aside class="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
        <h2 class="text-lg font-semibold mb-3">Menu</h2>
        <nav class="flex flex-col gap-2">
          <a href="/" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
          <a href="/posts" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
          <a href="/settings" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
        </nav>
      </aside>

      <main class="space-y-4">
        <h1 class="text-2xl font-bold">Posts</h1>

        <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <p class="text-slate-300 mb-2">Recent posts</p>
          <ul class="space-y-2">
            <li><a href="/posts/1" data-link class="px-3 py-2 rounded hover:bg-slate-700/60 inline-block">Routing without frameworks</a></li>
            <li><a href="/posts/2" data-link class="px-3 py-2 rounded hover:bg-slate-700/60 inline-block">State management 101</a></li>
            <li><a href="/posts/3" data-link class="px-3 py-2 rounded hover:bg-slate-700/60 inline-block">Fastify tips</a></li>
          </ul>
        </div>
      </main>
    </div>
  `
      );
    }
  };

  // src/views/Settings.ts
  var Settings = class extends AbstractView {
    constructor(ctx) {
      super(ctx);
      this.setTitle("Settings");
    }
    async getHTML() {
      return (
        /*html*/
        `
    <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
      <aside class="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
        <h2 class="text-lg font-semibold mb-3">Menu</h2>
        <nav class="flex flex-col gap-2">
          <a href="/" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
          <a href="/posts" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
          <a href="/settings" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
        </nav>
      </aside>

      <main class="space-y-4">
        <h1 class="text-2xl font-bold">Settings</h1>

        <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
          <form id="settings-form" class="space-y-4">
            <div>
              <label for="name" class="block mb-1">Display name</label>
              <input id="name" name="name" type="text" placeholder="Your name"
                class="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 focus:outline-none" />
            </div>

            <div>
              <label for="theme" class="block mb-1">Theme</label>
              <select id="theme" name="theme"
                class="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 focus:outline-none">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <button type="submit"
              class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
              Save
            </button>
          </form>
        </div>
      </main>
    </div>
  `
      );
    }
    mount() {
      const form = document.getElementById("settings-form");
      form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        console.log("Settings submit:", data);
      });
    }
  };

  // src/views/NotFound.ts
  var NotFound = class extends AbstractView {
    constructor(ctx) {
      super(ctx);
      this.setTitle("NotFound");
    }
    async getHTML() {
      return (
        /*html*/
        `
    <div class="grid md:grid-cols-[220px_1fr] gap-6 p-6">
      <aside class="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
        <h2 class="text-lg font-semibold mb-3">Menu</h2>
        <nav class="flex flex-col gap-2">
          <a href="/" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Dashboard</a>
          <a href="/posts" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Posts</a>
          <a href="/settings" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Settings</a>
        </nav>
      </aside>

      <main class="space-y-4">
        <h1 class="text-2xl font-bold">Not Found</h1>

        <div class="rounded-xl border border-rose-800 bg-rose-900/80 p-4">
          <p class="text-rose-100">Sorry, the page you are looking for was not found.</p>
        </div>
      </main>
    </div>
  `
      );
    }
  };

  // src/router.ts
  var routes = [
    { path: "/", view: Dashboard },
    { path: "/posts", view: Posts },
    { path: "/posts/:id", view: Posts },
    { path: "/settings", view: Settings },
    { path: "*", view: NotFound }
  ];
  var currentView = null;
  function pathToRegex(path) {
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "$");
  }
  function getParams(match) {
    const res = match.result || [];
    const values = res.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);
    return Object.fromEntries(keys.map((key, i) => {
      return [key, decodeURIComponent(values[i])];
    }));
  }
  function normalize(path) {
    if (path !== "/")
      return path.replace(/\/+$/, "");
    else
      return path;
  }
  function navigateTo(url) {
    history.pushState(null, "", url);
    router();
  }
  function matchRoute(path, pathname) {
    if (path === "*") return null;
    return pathname.match(pathToRegex(path));
  }
  async function router() {
    const pathname = normalize(location.pathname);
    const potentialMatches = routes.map((route) => ({
      route,
      result: matchRoute(route.path, pathname)
    }));
    let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);
    if (!match) {
      const notFound = routes.find((r) => r.path === "*");
      match = { route: notFound, result: [pathname] };
    }
    const ctx = {
      path: pathname,
      params: getParams(match),
      query: Object.fromEntries(new URLSearchParams(location.search).entries()),
      hash: location.hash,
      state: history.state
    };
    currentView?.destroy?.();
    const view = new match.route.view(ctx);
    const app = document.querySelector("#app");
    app.innerHTML = await view.getHTML();
    currentView = view;
    view.mount?.();
  }

  // src/main.ts
  fetch("http://localhost:8000/health").then((r) => r.json()).then(console.log).catch(console.error);
  window.addEventListener("popstate", router);
  window.addEventListener("hashchange", router);
  document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
      if (e.defaultPrevented)
        return;
      if (e.button !== 0)
        return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = e.target.closest("[data-link]");
      if (!a)
        return;
      const url = new URL(a.href, window.location.origin);
      if (url.origin !== window.location.origin)
        return;
      if (a.target === "_blank" || a.hasAttribute("download") || a.getAttribute("rel") === "external")
        return;
      e.preventDefault();
      navigateTo(url.pathname + url.search + url.hash);
    });
    router();
  });
})();
//# sourceMappingURL=bundle.js.map
