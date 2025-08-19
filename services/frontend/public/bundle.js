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
            <a href="/game" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
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
          <a href="/game" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
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
          <a href="/game" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
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
          <a href="/game" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
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

  // src/games/pong/Ball.ts
  var Ball = class {
    constructor(position, velocity, radius, canvas, drawer) {
      this.position = position;
      this.velocity = velocity;
      this.radius = radius;
      this.canvas = canvas;
      this.drawer = drawer;
    }
    update(leftPaddle) {
      this.position.translate(this.velocity);
      if (this.position.y - this.radius < 0) {
        this.position.y = this.radius;
        this.velocity = this.velocity.invertY();
      }
      if (this.position.y + this.radius > this.canvas.height) {
        this.position.y = this.canvas.height - this.radius;
        this.velocity = this.velocity.invertY();
      }
      if (this.position.x + this.radius > this.canvas.width) {
        this.position.x = this.canvas.width - this.radius;
        this.velocity = this.velocity.invertX();
      }
      this.isOnPaddle(leftPaddle);
    }
    isOnPaddle(paddle) {
      const closestX = Math.max(
        paddle.position.x,
        Math.min(this.position.x, paddle.position.x + paddle.height)
      );
      const closestY = Math.max(
        paddle.position.y,
        Math.min(this.position.y, paddle.position.y + paddle.width)
      );
      const dx = this.position.x - closestX;
      const dy = this.position.y - closestY;
      const distSq = dx * dx + dy * dy;
      if (distSq <= this.radius * this.radius) {
        if (this.velocity.x < 0) {
          this.velocity = this.velocity.invertX();
        }
      }
    }
    draw() {
      this.drawer.circle(
        this.position.x,
        this.position.y,
        this.radius,
        { fillStyle: "#FFFFFF", strokeStyle: "#555555", lineWidth: 3 }
      );
    }
  };

  // src/games/pong/Paddle.ts
  var Paddle = class {
    constructor(position, canvas, drawer) {
      this.position = position;
      this.canvas = canvas;
      this.drawer = drawer;
      this.speedY = 0;
      this.maxSpeed = 6;
      this.acceleration = 0.3;
      this.friction = 0.2;
      this.height = 10;
      this.width = 50;
      this.upPressed = false;
      this.downPressed = false;
      this._keydown = this._onKeyDown.bind(this);
      this._keyup = this._onKeyUp.bind(this);
      window.addEventListener("keydown", (event) => this._onKeyDown(event));
      window.addEventListener("keyup", (event) => this._onKeyUp(event));
    }
    _onKeyDown(event) {
      if (event.key === "ArrowUp") this.upPressed = true;
      if (event.key === "ArrowDown") this.downPressed = true;
    }
    _onKeyUp(event) {
      if (event.key === "ArrowUp") this.upPressed = false;
      if (event.key === "ArrowDown") this.downPressed = false;
    }
    destroy() {
      window.removeEventListener("keydown", this._keydown);
      window.removeEventListener("keyup", this._keyup);
    }
    update() {
      if (this.upPressed && !this.downPressed) {
        this.speedY = Math.max(this.speedY - this.acceleration, -this.maxSpeed);
      } else if (this.downPressed && !this.upPressed) {
        this.speedY = Math.min(this.speedY + this.acceleration, this.maxSpeed);
      } else {
        if (this.speedY > 0) this.speedY = Math.max(this.speedY - this.friction, 0);
        if (this.speedY < 0) this.speedY = Math.min(this.speedY + this.friction, 0);
      }
      this.position.y += this.speedY;
      this.position.y = Math.max(
        0,
        Math.min(this.position.y, this.canvas.height - this.height)
      );
    }
    draw() {
      this.drawer.rect(
        this.position.x,
        this.position.y,
        this.height,
        this.width,
        {
          fillStyle: "#FFFFFF",
          strokeStyle: "#555555",
          lineWidth: 3
        }
      );
    }
  };

  // src/games/lib2D/Position.ts
  var Position = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    // Move this position by the given vector (in-place)
    translate(vector) {
      this.x += vector.x;
      this.y += vector.y;
    }
  };

  // src/games/lib2D/Coord.ts
  var Coord = class {
    /**
     * Creates a new Coord instance.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     */
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    /**
     * Creates a copy of this coordinate.
     * @returns {Coord} A new Coord instance with the same x and y values.
     */
    copy() {
      return new this.constructor(this.x, this.y);
    }
    /**
     * Adds another Coord to this one without modifying the original.
     * @param {Coord} src - The source Coord to add.
     * @returns {Coord} A new Coord representing the sum.
     */
    add(src) {
      return new this.constructor(this.x + src.x, this.y + src.y);
    }
    /**
     * Adds another Coord to this one, modifying this instance.
     * @param {Coord} src - The source Coord to add.
     * @returns {Coord} This instance after addition.
     */
    addSelf(src) {
      this.x += src.x;
      this.y += src.y;
      return this;
    }
    /**
     * Subtracts another Coord from this one without modifying the original.
     * @param {Coord} src - The source Coord to subtract.
     * @returns {Coord} A new Coord representing the difference.
     */
    sub(src) {
      return new this.constructor(this.x - src.x, this.y - src.y);
    }
    /**
     * Subtracts another Coord from this one, modifying this instance.
     * @param {Coord} src - The source Coord to subtract.
     * @returns {Coord} This instance after subtraction.
     */
    subSelf(src) {
      this.x -= src.x;
      this.y -= src.y;
      return this;
    }
    /**
     * Scales this coordinate by a factor without modifying the original.
     * @param {number} factor - The scale factor.
     * @returns {Coord} A new Coord scaled by the given factor.
     */
    scale(factor) {
      return new this.constructor(this.x * factor, this.y * factor);
    }
    /**
     * Scales this coordinate by a factor, modifying this instance.
     * @param {number} factor - The scale factor.
     * @returns {Coord} This instance after scaling.
     */
    scaleSelf(factor) {
      this.x *= factor;
      this.y *= factor;
      return this;
    }
    /**
     * Divides this coordinate by a factor without modifying the original.
     * @param {number} factor - The divisor.
     * @returns {Coord} A new Coord divided by the given factor.
     */
    div(factor) {
      return new this.constructor(this.x / factor, this.y / factor);
    }
    /**
     * Divides this coordinate by a factor, modifying this instance.
     * @param {number} factor - The divisor.
     * @returns {Coord} This instance after division.
     */
    divSelf(factor) {
      this.x /= factor;
      this.y /= factor;
      return this;
    }
    /**
     * Negates this coordinate without modifying the original.
     * @returns {Coord} A new Coord with both x and y negated.
     */
    negate() {
      return new this.constructor(-this.x, -this.y);
    }
    /**
     * Negates this coordinate, modifying this instance.
     * @returns {Coord} This instance after negation.
     */
    negateSelf() {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }
    /**
     * Checks if this coordinate is equal to another.
     * @param {Coord} src - The source Coord to compare.
     * @returns {boolean} True if both x and y are equal, otherwise false.
     */
    equals(src) {
      return this.x === src.x && this.y === src.y;
    }
    /**
     * Calculates the Euclidean distance to another coordinate.
     * @param {Coord} src - The source Coord to measure distance to.
     * @returns {number} The distance between this and the source coordinate.
     */
    distanceTo(src) {
      const dx = this.x - src.x;
      const dy = this.y - src.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Returns a string representation of this coordinate.
     * @returns {string} The string in the form '(x, y)'.
     */
    toString() {
      return `(${this.x}, ${this.y})`;
    }
  };

  // src/games/lib2D/Draw2D.ts
  var Draw2D = class {
    constructor(ctx) {
      this.ctx = ctx;
    }
    // Draw a filled circle
    circle(x, y, radius, { fillStyle = "#ffffff", strokeStyle = null, lineWidth = 1 } = {}) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
      ctx.closePath();
    }
    // Draw a filled rectangle
    rect(x, y, width, height, { fillStyle = "#ffffff", strokeStyle = null, lineWidth = 1 } = {}) {
      const ctx = this.ctx;
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x, y, width, height);
      }
      if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
      }
    }
    // Draw a line from (x1,y1) to (x2,y2)
    line(x1, y1, x2, y2, { strokeStyle = "#ffffff", lineWidth = 2, dash = [] } = {}) {
      const ctx = this.ctx;
      ctx.beginPath();
      if (dash.length) ctx.setLineDash(dash);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.closePath();
    }
  };

  // src/games/pong/drawBG.ts
  function drawBackground(draw, canvas) {
    draw.rect(
      0,
      0,
      canvas.width,
      canvas.height,
      { fillStyle: "#000000" }
    );
    draw.line(
      canvas.width / 2,
      0,
      canvas.width / 2,
      canvas.height,
      { strokeStyle: "#555555", lineWidth: 4, dash: [10, 10] }
    );
  }

  // src/games/pong/init.ts
  function createPong(canvas) {
    const ctx = canvas.getContext("2d");
    const draw = new Draw2D(ctx);
    const speed = 4;
    const angleRad = 3.09;
    const velocity = new Coord(1, 0).rotate(angleRad).scale(speed);
    const startPosition = new Position(canvas.width / 2, canvas.height / 2);
    const paddlePos = new Position(5, canvas.height / 2);
    const ball = new Ball(startPosition, velocity, 10, canvas, draw);
    const paddle = new Paddle(paddlePos, canvas, draw);
    let running = false;
    let rafId = 0;
    const loop = () => {
      if (!running) return;
      drawBackground(draw, canvas);
      paddle.update();
      paddle.draw();
      ball.update(paddle);
      ball.draw();
      rafId = requestAnimationFrame(loop);
    };
    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    }
    function dispose() {
      stop();
      paddle.destroy();
    }
    return { start, stop, dispose };
  }

  // src/views/Game.ts
  var Game = class extends AbstractView {
    constructor(ctx) {
      super(ctx);
      this.setTitle("Game");
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
            <a href="/game" data-link class="px-3 py-2 rounded hover:bg-slate-700/60">Game</a>
          </nav>
        </aside>

        <main class="space-y-4">
          <h1 class="text-2xl font-bold">Pong</h1>

          <div class="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <div class="space-y-3">
              <canvas id="gameCanvas" width="800" height="600" class="w-full rounded-xl border border-slate-700 bg-black"></canvas>
              <div class="flex gap-2">
                <button id="btn-start" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Start</button>
                <button id="btn-stop"  class="px-4 py-2 rounded bg-slate-700 hover:bg-slate-700/60">Stop</button>
              </div>
              <p class="text-slate-300 text-sm">Controls: \u2191 / \u2193</p>
            </div>
          </div>
        </main>
      </div>
    `
      );
    }
    mount() {
      const canvas = document.getElementById("gameCanvas");
      if (!canvas) return;
      const api = createPong(canvas);
      const startBtn = document.getElementById("btn-start");
      const stopBtn = document.getElementById("btn-stop");
      startBtn?.addEventListener("click", api.start);
      stopBtn?.addEventListener("click", api.stop);
      api.start();
      this.disposeGame = () => {
        stopBtn?.removeEventListener("click", api.stop);
        startBtn?.removeEventListener("click", api.start);
        api.dispose();
      };
    }
    destroy() {
      this.disposeGame?.();
    }
  };

  // src/router.ts
  var routes = [
    { path: "/", view: Dashboard },
    { path: "/posts", view: Posts },
    { path: "/posts/:id", view: Posts },
    { path: "/settings", view: Settings },
    { path: "/game", view: Game },
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
  fetch("http://localhost:8000/health").then((res) => {
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return res.json();
  }).then((data) => {
    console.log("\u2705 Health check:", data);
  }).catch((err) => {
    console.error("\u274C Health check error:", err);
  });
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
