"use strict";
(() => {
  // src/views/AbstractView.ts
  var AbstractView_default = class {
    constructor(params) {
      this.params = params;
      console.log(this.params);
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
  var Dashboard = class extends AbstractView_default {
    constructor(params) {
      super(params);
      this.params = params;
      this.setTitle("Dashboard");
    }
    async getHTML() {
      return (
        /* html */
        `
            <div class="dashboard">
                <aside class="sidebar">
                    <h2>Menu</h2>
                    <a href="/" class="nav-link" data-link>Dashboard</a>
                    <a href="/posts" class="nav-link" data-link>Posts</a>
                    <a href="/settings" class="nav-link" data-link>Settings</a>
                </aside>
                <main class="main">
                    <h1>Dashboard</h1>
                    <div class="card">
                        <p>Welcome to your SPA dashboard! Use the menu to navigate without reloading the page.</p>
                    </div>
                </main>
            </div>
        `
      );
    }
  };

  // src/views/Posts.ts
  var Posts = class extends AbstractView_default {
    constructor(params) {
      super(params);
      this.setTitle("Posts");
    }
    async getHTML() {
      return `
      <div class="dashboard">
        <aside class="sidebar">
          <h2>Menu</h2>
          <a href="/" class="nav-link" data-link>Dashboard</a>
          <a href="/posts" class="nav-link" data-link>Posts</a>
          <a href="/settings" class="nav-link" data-link>Settings</a>
        </aside>
        <main class="main">
          <h1>Posts</h1>
          <div class="card">
            <p>Recent posts</p>
            <ul>
              <li><a href="/posts/1" data-link>Routing without frameworks</a></li>
              <li><a href="/posts/2" data-link>State management 101</a></li>
              <li><a href="/posts/3" data-link>Fastify tips</a></li>
            </ul>
          </div>
        </main>
      </div>
    `;
    }
  };

  // src/views/Settings.ts
  var Settings = class extends AbstractView_default {
    constructor(params) {
      super(params);
      this.setTitle("Settings");
    }
    async getHTML() {
      return `
      <div class="dashboard">
        <aside class="sidebar">
          <h2>Menu</h2>
          <a href="/" class="nav-link" data-link>Dashboard</a>
          <a href="/posts" class="nav-link" data-link>Posts</a>
          <a href="/settings" class="nav-link" data-link>Settings</a>
        </aside>
        <main class="main">
          <h1>Settings</h1>
          <div class="card">
            <form id="settings-form">
              <div style="margin-bottom: .75rem;">
                <label for="name">Display name</label><br>
                <input id="name" name="name" type="text" placeholder="Your name" style="width:100%;padding:.5rem;border-radius:6px;border:0;outline:none;">
              </div>
              <div style="margin-bottom: .75rem;">
                <label for="theme">Theme</label><br>
                <select id="theme" name="theme" style="width:100%;padding:.5rem;border-radius:6px;border:0;outline:none;">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <button type="submit" class="nav-link" style="display:inline-block;background:#334155;">Save</button>
            </form>
          </div>
        </main>
      </div>
    `;
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
  var NotFound = class extends AbstractView_default {
    constructor(params) {
      super(params);
      this.setTitle("NotFound");
    }
    async getHTML() {
      return `
      <div class="dashboard">
        <aside class="sidebar">
          <h2>Menu</h2>
          <a href="/" class="nav-link" data-link>Dashboard</a>
          <a href="/posts" class="nav-link" data-link>Posts</a>
          <a href="/settings" class="nav-link" data-link>Settings</a>
        </aside>
        <main class="main">
          <h1>NotFound</h1>
          <div class="card">Sorry, the page you are looking for was not found</div>
        </main>
      </div>
    `;
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
    history.pushState(null, null, url);
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
    let match;
    match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);
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
  fetch("/health.json").then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }).then(console.log).catch(console.error);
  console.log("TS is RUNNING!");
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
