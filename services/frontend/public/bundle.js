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

  // src/games/lib2D/GameLoop.js
  var GameLoop = class {
    /**
     * Creates a new GameLoop.
     * @param {function(number, GameLoop):void} update - The function called each frame.
     *        It receives the delta time (in seconds) and the loop instance.
     */
    constructor(update) {
      this.update = update;
      this.last = 0;
      this.running = false;
      this.showFPS = false;
      this.fps = 0;
    }
    /**
     * Starts the game loop. Does nothing if already running.
     * @returns {void}
     */
    start() {
      if (this.running) return;
      this.running = true;
      this.last = performance.now();
      const step = (t) => {
        if (!this.running) return;
        const dt = (t - this.last) / 1e3;
        this.last = t;
        this.fps = Math.round(1 / dt);
        this.update(dt, this);
        this._renderOverlay();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    /**
     * Stops the game loop.
     * @returns {void}
     */
    stop() {
      this.running = false;
    }
    /**
     * Toggles the debug FPS overlay on or off.
     * @returns {void}
     */
    toggleFPS() {
      this.showFPS = !this.showFPS;
    }
    /**
     * Internal helper: renders the FPS overlay in the top-left corner if enabled.
     * @private
     * @returns {void}
     */
    _renderOverlay() {
      if (!this.showFPS) return;
      const ctx = document.querySelector("canvas").getContext("2d");
      ctx.fillStyle = "lime";
      ctx.font = "14px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`FPS: ${this.fps}`, 5, 5);
    }
  };

  // src/games/lib2D/Keyboard.js
  var Keyboard = class {
    constructor(target = window) {
      this.down = /* @__PURE__ */ new Set();
      target.addEventListener("keydown", (e) => this.down.add(e.key));
      target.addEventListener("keyup", (e) => this.down.delete(e.key));
    }
    /**
     * Is a key currently held?
     * @param {string} key
     * @returns {boolean}
     */
    isDown(key) {
      return this.down.has(key);
    }
  };

  // src/games/lib2D/Coord.js
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

  // src/games/lib2D/Vector.js
  var Vector = class _Vector extends Coord {
    /**
     * Factory: create a Vector from raw x,y.
     * @param {number} x
     * @param {number} y
     * @returns {Vector}
     */
    static from(x, y) {
      return new _Vector(x, y);
    }
    /**
     * Gets the magnitude (length) of the vector.
     * @type {number}
     */
    get magnitude() {
      return Math.hypot(this.x, this.y);
    }
    /**
     * Returns a new normalized (unit length) vector in the same direction.
     * @returns {Vector} A new Vector with magnitude 1 (or zero vector if original is zero).
     */
    normalize() {
      const mag = this.magnitude || 1;
      return new _Vector(this.x / mag, this.y / mag);
    }
    /**
     * Returns a new vector with its Y component inverted.
     * @returns {Vector} A new Vector reflected over the X-axis.
     */
    invertY() {
      return new _Vector(this.x, -this.y);
    }
    /**
     * Returns a new vector with its X component inverted.
     * @returns {Vector} A new Vector reflected over the Y-axis.
     */
    invertX() {
      return new _Vector(-this.x, this.y);
    }
    /**
     * Rotates the vector by a given angle around the origin.
     * @param {number} angleRad - The rotation angle in radians.
     * @returns {Vector} A new Vector representing the rotated vector.
     */
    rotate(angleRad) {
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      return new _Vector(
        this.x * cos - this.y * sin,
        this.x * sin + this.y * cos
      );
    }
    /**
     * Returns a new vector with the same direction but a different magnitude.
     * @param {number} newMag - The desired magnitude for the new vector.
     * @returns {Vector} A new Vector scaled to the specified magnitude.
     */
    withMagnitude(newMag) {
      return this.normalize().scale(newMag);
    }
    /**
     * Computes the dot product between this vector and another.
     * @param {Vector} other - The other vector.
     * @returns {number} The scalar dot product (this · other).
     */
    dot(other) {
      if (!(other instanceof _Vector)) {
        throw new TypeError("Vector.dot requires a Vector");
      }
      return this.x * other.x + this.y * other.y;
    }
    /**
     * Computes the 2D cross product (scalar) between this vector and another.
     * @param {Vector} other - The other vector.
     * @returns {number} The scalar cross product (this × other) in 2D.
     */
    cross(other) {
      if (!(other instanceof _Vector)) {
        throw new TypeError("Vector.cross requires a Vector");
      }
      return this.x * other.y - this.y * other.x;
    }
    /**
     * Renders this vector as an arrow from an origin point (ox, oy).
     * If no origin is provided, the vector is drawn from (0,0).
     * @param {CanvasRenderingContext2D} ctx - The 2D drawing context.
     * @param {Object} [options] - Rendering options.
     * @param {number} [options.ox=0] - X coordinate of the origin.
     * @param {number} [options.oy=0] - Y coordinate of the origin.
     * @param {string} [options.strokeStyle="#0ff"] - Color of the arrow line.
     * @param {number} [options.lineWidth=2] - Thickness of the arrow line.
     * @param {number} [options.headSize=8] - Size of the arrow head.
     * @returns {void}
     */
    render(ctx, { ox = 0, oy = 0, color = "#0ff", lineWidth = 2, headSize = 8 } = {}) {
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + this.x, oy + this.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.closePath();
      const angle = Math.atan2(this.y, this.x);
      const endX = ox + this.x;
      const endY = oy + this.y;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headSize * Math.cos(angle - Math.PI / 6),
        endY - headSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - headSize * Math.cos(angle + Math.PI / 6),
        endY - headSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.closePath();
    }
    /**
     * (Optional) Render only the vector endpoint as a single pixel (like Point).
     * Useful for a “pixel philosophy” debug view.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} [options]
     * @param {number} [options.ox=0]
     * @param {number} [options.oy=0]
     * @param {string} [options.color="#fff"]
     * @returns {void}
     */
    renderAsPixel(ctx, { ox = 0, oy = 0, color = "#fff" } = {}) {
      ctx.fillStyle = color;
      ctx.fillRect(ox + this.x, oy + this.y, 1, 1);
    }
    /**
     * Reflect this vector on a horizontal or vertical wall, with optional angle adjustment.
     * @param {"x"|"y"} axis - Axis of reflection ("x" for vertical wall, "y" for horizontal wall).
     * @param {number} [angle=0] - Extra angle (in radians) to rotate the reflected vector.
     *        Positive = counter-clockwise, Negative = clockwise.
     * @returns {Vector} A new reflected and rotated vector.
     */
    reflect(axis, angle = 0) {
      let reflected;
      if (axis === "x") {
        reflected = new _Vector(-this.x, this.y);
      } else if (axis === "y") {
        reflected = new _Vector(this.x, -this.y);
      } else {
        throw new Error("Vector.reflect axis must be 'x' or 'y'");
      }
      if (angle !== 0) {
        reflected = reflected.rotate(angle);
      }
      return reflected;
    }
  };

  // src/games/lib2D/Point.js
  var Point = class _Point extends Coord {
    /**
     * Factory: create a Point from raw x,y.
     * @param {number} x
     * @param {number} y
     * @returns {Point}
     */
    static from(x, y) {
      return new _Point(x, y);
    }
    /**
     * Translates this point by the given vector, modifying this instance.
     * @param {Vector} vector - The translation vector.
     * @returns {Point} This instance after translation.
     */
    translate(vector) {
      if (!(vector instanceof Vector))
        throw new TypeError("Point.translate requires a Vector object");
      return this.addSelf(vector);
    }
    /**
        * Add a Vector to this Point → new Point.
        * @param {Vector} v
        * @returns {Point}
     */
    add(vector) {
      if (!(vector instanceof Vector))
        throw new TypeError("Point.add requires a Vector object");
      const { x, y } = super.add(vector);
      return new _Point(x, y);
    }
    /**
     * In-place add a Vector to this Point → this Point.
     * @param {Vector} vector
     * @returns {Point}
     */
    addSelf(vector) {
      if (!(vector instanceof Vector))
        throw new TypeError("Point.addSelf requires a Vector object");
      super.addSelf(vector);
      return this;
    }
    /**
     * Subtracts another Point from this one, yielding a Vector from the other point to this one.
     * @param {Point} pt - The point to subtract.
     * @returns {Vector} A new Vector representing (this − pt).
     */
    sub(point) {
      if (!(point instanceof _Point))
        throw new TypeError("Point.sub requires a Point object");
      const { x, y } = super.sub(point);
      return new Vector(x, y);
    }
    /**
     * In-place subtract another Point from this one, converting this Point into the resulting Vector coordinates.
     * @param {Point} point - The point to subtract.
     * @returns {Point} This instance, now mutated to the Vector difference.
     */
    subSelf(point) {
      if (!(point instanceof _Point))
        throw new TypeError("Point.subSelf requires a Point object");
      const vector = this.sub(point);
      this.x = vector.x;
      this.y = vector.y;
      return this;
    }
    /**
     * Renders this point as a single pixel on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D drawing context.
     * @param {Object} [options] - Rendering options.
     * @param {string} [options.color="#fff"] - Fill color of the pixel.
     * @returns {void}
     */
    render(ctx, { color = "#fff" } = {}) {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, 1, 1);
    }
    /**
     * Moves this point in place by a velocity vector, scaled by delta time.
     * @param {Vector} velocity - The velocity to apply.
     * @param {number} dt - Delta time in seconds.
     * @returns {Point} This instance after moving.
     */
    move(velocity, dt = 1) {
      if (!(velocity instanceof Vector))
        throw new TypeError("Point.move requires a Vector");
      this.x += velocity.x * dt;
      this.y += velocity.y * dt;
      return this;
    }
    /**
     * Checks if this point is inside a rectangle.
     * @param {number} x - Rect X.
     * @param {number} y - Rect Y.
     * @param {number} w - Rect width.
     * @param {number} h - Rect height.
     * @returns {boolean} True if inside, false otherwise.
     */
    isInsideRect(x, y, w, h) {
      return this.x >= x && this.x <= x + w && this.y >= y && this.y <= y + h;
    }
  };

  // src/games/lib2D/AbstractEntity.js
  var AbstractEntity = class {
    /**
     * @param {number} x - Initial X position.
     * @param {number} y - Initial Y position.
     */
    constructor(x = 0, y = 0) {
      this.pos = new Point(x, y);
      this.vel = new Vector(0, 0);
      this.alive = true;
    }
    /**
     * Move by velocity * dt.
     * @param {number} dt - Delta time (seconds).
     * @returns {void}
     */
    update(dt) {
      this.pos.move(this.vel, dt);
    }
    /**
     * Render the entity. Override in subclasses.
     * @param {CanvasRenderingContext2D} _ctx
     * @returns {void}
     */
    render(_ctx) {
    }
    /**
     * Reflect velocity on axis with optional deflection angle (radians).
     * @param {"x"|"y"} axis
     * @param {number} [angle=0]
     * @returns {void}
     */
    bounce(axis, angle = 0) {
      this.vel = this.vel.reflect(axis, angle);
    }
    /**
     * Draws a tiny velocity arrow for debugging.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} [options]
     * @param {string} [options.color="#0ff"]
     * @returns {void}
     */
    renderVelocity(ctx, { color = "#0ff" } = {}) {
      this.vel.render(ctx, { ox: this.pos.x, oy: this.pos.y, color, lineWidth: 1, headSize: 6 });
    }
  };

  // src/games/lib2D/Rect.js
  var Rect = class extends AbstractEntity {
    /**
     * @param {number} x - Top-left X.
     * @param {number} y - Top-left Y.
     * @param {number} w - Width.
     * @param {number} h - Height.
     */
    constructor(x, y, w, h) {
      super(x, y);
      this.w = w;
      this.h = h;
    }
    /**
     * Render the rectangle.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} [options]
     * @param {string|null} [options.fill="#fff"]
     * @param {string|null} [options.stroke=null]
     * @param {number} [options.lineWidth=1]
     * @returns {void}
     */
    render(ctx, { fill = "#fff", stroke = null, lineWidth = 1 } = {}) {
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(this.pos.x, this.pos.y, this.w, this.h);
      }
    }
    /**
     * Point-in-rect test.
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    contains(x, y) {
      return x >= this.pos.x && x <= this.pos.x + this.w && y >= this.pos.y && y <= this.pos.y + this.h;
    }
  };

  // src/games/lib2D/utils.js
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  var deg2rad = (d) => d * Math.PI / 180;

  // src/games/pong/Paddle.js
  var Paddle = class extends Rect {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {Object} opts
     * @param {number} [opts.speed=360] - pixels per second
     * @param {Keyboard} [opts.keyboard] - keyboard helper
     * @param {string} [opts.keyUp="ArrowUp"]
     * @param {string} [opts.keyDown="ArrowDown"]
     * @param {number} [opts.canvasHeight] - for clamping
     * @param {string} [opts.color="#fff"]
     */
    constructor(x, y, w, h, {
      speed = 360,
      keyboard = null,
      keyUp = "ArrowUp",
      keyDown = "ArrowDown",
      canvasHeight = null,
      color = "#fff"
    } = {}) {
      super(x, y, w, h);
      this.speed = speed;
      this.keyboard = keyboard;
      this.keyUp = keyUp;
      this.keyDown = keyDown;
      this.canvasHeight = canvasHeight;
      this.color = color;
      this.moveDir = 0;
    }
    update(dt) {
      let dy = 0;
      if (this.keyboard?.isDown(this.keyUp)) dy -= 1;
      if (this.keyboard?.isDown(this.keyDown)) dy += 1;
      this.moveDir = dy;
      this.pos.y += dy * this.speed * dt;
      if (this.canvasHeight != null) {
        this.pos.y = clamp(this.pos.y, 0, this.canvasHeight - this.h);
      }
    }
    render(ctx) {
      super.render(ctx, { fill: this.color });
    }
  };

  // src/games/lib2D/Circle.js
  var Circle = class extends AbstractEntity {
    /**
     * @param {number} x - Center X.
     * @param {number} y - Center Y.
     * @param {number} r - Radius.
     */
    constructor(x, y, r) {
      super(x, y);
      this.r = r;
    }
    /**
     * Render the circle.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} [options]
     * @param {string|null} [options.fill="#fff"]
     * @param {string|null} [options.stroke=null]
     * @param {number} [options.lineWidth=1]
     * @returns {void}
     */
    render(ctx, { fill = "#fff", stroke = null, lineWidth = 1 } = {}) {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
      ctx.closePath();
    }
    /**
     * Point-in-circle test.
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    contains(x, y) {
      const dx = x - this.pos.x, dy = y - this.pos.y;
      return dx * dx + dy * dy <= this.r * this.r;
    }
  };

  // src/games/lib2D/collision/circleRect.js
  function clamp2(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
  function collideCircleRect(circle, rect) {
    const cx = clamp2(circle.x, rect.x, rect.x + rect.w);
    const cy = clamp2(circle.y, rect.y, rect.y + rect.h);
    const dx = circle.x - cx;
    const dy = circle.y - cy;
    const dist = Math.hypot(dx, dy);
    if (dist >= circle.r || dist === 0) {
      let nx = 0, ny = 0;
      if (dist > 0) {
        nx = dx / dist;
        ny = dy / dist;
      } else {
        const left = Math.abs(circle.x - rect.x);
        const right = Math.abs(circle.x - (rect.x + rect.w));
        const top = Math.abs(circle.y - rect.y);
        const bottom = Math.abs(circle.y - (rect.y + rect.h));
        const m = Math.min(left, right, top, bottom);
        if (m === left) nx = -1;
        else if (m === right) nx = 1;
        else if (m === top) ny = -1;
        else ny = 1;
      }
      return { collides: false, normal: { x: nx, y: ny }, penetration: 0, closest: { x: cx, y: cy } };
    }
    return {
      collides: true,
      normal: { x: dx / dist, y: dy / dist },
      penetration: circle.r - dist,
      closest: { x: cx, y: cy }
    };
  }

  // src/games/pong/Ball.js
  var Ball = class extends Circle {
    /**
     * @param {number} cx
     * @param {number} cy
     * @param {number} r
     * @param {Object} opts
     * @param {number} [opts.speed=380] - pixels per second
     * @param {number} [opts.serveAngleSpreadDeg=20] - random spread around straight line
     * @param {string} [opts.color="#25AEEE"]
     */
    constructor(cx, cy, r, { speed = 380, serveAngleSpreadDeg = 20, color = "#25AEEE" } = {}) {
      super(cx, cy, r);
      this.baseSpeed = speed;
      this.serveSpread = deg2rad(serveAngleSpreadDeg);
      this.color = color;
    }
    /**
     * Serve the ball toward left (-1) or right (+1).
     * @param {number} dir -1 or +1
     */
    serve(dir = 1) {
      const spread = Math.random() * this.serveSpread - this.serveSpread / 2;
      const angle = (dir > 0 ? 0 : Math.PI) + spread;
      const vx = Math.cos(angle) * this.baseSpeed;
      const vy = Math.sin(angle) * this.baseSpeed;
      this.vel = new Vector(vx, vy);
    }
    /**
     * Bounce on top/bottom walls.
     * @param {number} width
     * @param {number} height
     */
    bounceCanvas(width, height) {
      if (this.pos.y - this.r <= 0) {
        this.pos.y = this.r;
        this.vel = this.vel.reflect("y");
      } else if (this.pos.y + this.r >= height) {
        this.pos.y = height - this.r;
        this.vel = this.vel.reflect("y");
      }
    }
    /**
     * Try bounce against a paddle (Rect). Adds a small angle based on paddle moveDir.
     * @param {Rect} paddle
     * @param {number} deflectDeg - small extra deflection
     */
    bouncePaddle(paddle, deflectDeg = 12) {
      const hit = collideCircleRect(
        { x: this.pos.x, y: this.pos.y, r: this.r },
        { x: paddle.pos.x, y: paddle.pos.y, w: paddle.w, h: paddle.h }
      );
      if (!hit.collides) return false;
      this.pos.x += hit.normal.x * hit.penetration;
      this.pos.y += hit.normal.y * hit.penetration;
      const tweak = deg2rad(deflectDeg) * (paddle.moveDir || 0);
      if (Math.abs(hit.normal.x) > Math.abs(hit.normal.y)) {
        this.vel = this.vel.reflect("x", tweak);
      } else {
        this.vel = this.vel.reflect("y", tweak);
      }
      return true;
    }
    render(ctx) {
      super.render(ctx, { fill: this.color });
    }
  };

  // src/games/pong/Player.js
  var Player = class {
    /**
     * Creates a new Player.
     * @param {string} [name="Player"] - The name of the player.
     */
    constructor(name = "Player") {
      this.name = name;
      this.score = 0;
    }
    /**
     * Adds points to the player's score.
     * @param {number} [n=1] - The number of points to add.
     * @returns {void}
     */
    addPoint(n = 1) {
      this.score += n;
    }
    /**
     * Resets the player's score to zero.
     * @returns {void}
     */
    reset() {
      this.score = 0;
    }
  };

  // src/games/lib2D/Line.js
  var Line = class extends AbstractEntity {
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     */
    constructor(x1, y1, x2, y2) {
      super(0, 0);
      this.a = new Point(x1, y1);
      this.b = new Point(x2, y2);
    }
    /**
     * Move endpoints by velocity * dt.
     * @param {number} dt
     * @returns {void}
     */
    update(dt) {
      this.a.move(this.vel, dt);
      this.b.move(this.vel, dt);
    }
    /**
     * Render the line segment.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} [options]
     * @param {string} [options.color="#fff"]
     * @param {number} [options.lineWidth=2]
     * @param {number[]} [options.dash=[]]
     * @returns {void}
     */
    render(ctx, { color = "#fff", lineWidth = 2, dash = [] } = {}) {
      ctx.beginPath();
      if (dash.length) ctx.setLineDash(dash);
      ctx.moveTo(this.a.x, this.a.y);
      ctx.lineTo(this.b.x, this.b.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      if (dash.length) ctx.setLineDash([]);
      ctx.closePath();
    }
    /**
     * Distance from a point to this segment (useful for simple hit tests).
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    distanceToPoint(x, y) {
      const vx = this.b.x - this.a.x;
      const vy = this.b.y - this.a.y;
      const wx = x - this.a.x;
      const wy = y - this.a.y;
      const len2 = vx * vx + vy * vy || 1;
      const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / len2));
      const px = this.a.x + t * vx;
      const py = this.a.y + t * vy;
      const dx = x - px, dy = y - py;
      return Math.hypot(dx, dy);
    }
  };

  // src/games/pong/PongGame.js
  var PongGame = class {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.kb = new Keyboard();
      this.leftPlayer = new Player("Left");
      this.rightPlayer = new Player("Right");
      this.leftPaddle = new Paddle(20, canvas.height / 2 - 40, 10, 80, {
        speed: 420,
        keyboard: this.kb,
        keyUp: "w",
        keyDown: "s",
        canvasHeight: canvas.height,
        color: "#FECD52"
      });
      this.rightPaddle = new Paddle(canvas.width - 30, canvas.height / 2 - 40, 10, 80, {
        speed: 420,
        keyboard: this.kb,
        keyUp: "ArrowUp",
        keyDown: "ArrowDown",
        canvasHeight: canvas.height,
        color: "#57D269"
      });
      this.ball = new Ball(canvas.width / 2, canvas.height / 2, 8, { speed: 380, color: "#25AEEE" });
      this.ball.serve(Math.random() < 0.5 ? -1 : 1);
      this.loop = new GameLoop((dt) => this.update(dt));
    }
    start() {
      this.loop.start();
    }
    stop() {
      this.loop.stop();
    }
    resetBall(dir = 1) {
      this.ball.pos.x = this.canvas.width / 2;
      this.ball.pos.y = this.canvas.height / 2;
      this.ball.serve(dir);
    }
    update(dt) {
      const canvas = this.canvas;
      this.leftPaddle.update(dt);
      this.rightPaddle.update(dt);
      this.ball.update(dt);
      this.ball.bounceCanvas(canvas.width, canvas.height);
      this.ball.bouncePaddle(this.leftPaddle, 10);
      this.ball.bouncePaddle(this.rightPaddle, 10);
      if (this.ball.pos.x + this.ball.r < 0) {
        this.rightPlayer.addPoint();
        this.resetBall(1);
      } else if (this.ball.pos.x - this.ball.r > canvas.width) {
        this.leftPlayer.addPoint();
        this.resetBall(-1);
      }
      this.render();
    }
    render() {
      const { ctx, canvas } = this;
      const bg = new Rect(0, 0, canvas.width, canvas.height);
      bg.render(ctx, { fill: "#0b0f16" });
      const midLine = new Line(canvas.width / 2, 0, canvas.width / 2, canvas.height);
      midLine.render(ctx, { stroke: "#182235", dash: [8, 8] });
      this.leftPaddle.render(ctx);
      this.rightPaddle.render(ctx);
      this.ball.render(ctx);
      ctx.fillStyle = "#9aa";
      ctx.font = "20px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${this.leftPlayer.score}`, canvas.width / 2 - 40, 30);
      ctx.fillText(`${this.rightPlayer.score}`, canvas.width / 2 + 40, 30);
    }
  };

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
                <button id="start-button" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Start</button>
                <button id="stop-button"  class="px-4 py-2 rounded bg-slate-700 hover:bg-slate-700/60">Stop</button>
              </div>
              <p class="text-slate-300 text-sm">Controls Left Player: w \u2191 / s \u2193</p>
              <p class="text-slate-300 text-sm">Controls Right Player: Arrow \u2191 / Arrow \u2193</p>
            </div>
          </div>
        </main>
      </div>
    `
      );
    }
    mount() {
      const canvas = document.querySelector("#gameCanvas");
      const ctx = canvas.getContext("2d");
      const game = new PongGame(canvas, ctx);
      window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "f") game.loop.toggleFPS();
      });
      const start = document.querySelector("#start-button");
      const stop = document.querySelector("#stop-button");
      const bg = new Rect(0, 0, canvas.width, canvas.height);
      bg.render(ctx, { fill: "#0b0f16" });
      start.addEventListener("click", () => {
        game.start();
      });
      stop.addEventListener("click", () => {
        game.stop();
      });
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
  function normalize2(path) {
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
    const pathname = normalize2(location.pathname);
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
