# Canvas 2D Context (ctx) — Practical Cheatsheet

Minimal, no-nonsense reference for building your lib2D and Pong.

---

## Quick Start
```html
<canvas id="game" width="800" height="500"></canvas>
<script type="module">
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  // draw here…
</script>
```

---

## Styles (set **before** drawing)
```js
ctx.fillStyle = "#25AEEE";   // fill color
ctx.strokeStyle = "#FECD52"; // outline color
ctx.lineWidth = 2;           // line thickness
ctx.setLineDash([8,4]);      // dashed lines: on, off
ctx.setLineDash([]);         // reset dash
ctx.font = "16px monospace"; // text font
ctx.textAlign = "left";      // left | center | right | start | end
ctx.textBaseline = "alphabetic"; // top | middle | bottom | alphabetic | ideographic | hanging
```

**Tip:** Styles are *sticky*. Set once, then draw multiple things with the same style.

---

## Rectangles (immediate)
```js
ctx.fillRect(x, y, w, h);   // filled rect
ctx.strokeRect(x, y, w, h); // outlined rect
ctx.clearRect(x, y, w, h);  // erase to transparent
```
Use `fillRect(x, y, 1, 1)` to draw a **single pixel**.

---

## Paths (custom shapes)
```js
ctx.beginPath();     // start a fresh path
ctx.moveTo(x1, y1);  // move pen (no drawing)
ctx.lineTo(x2, y2);  // draw a straight segment
// ... more lineTo / curves ...
ctx.closePath();     // optional: connect end → start (useful for polygons)
ctx.stroke();        // outline the path (uses strokeStyle, lineWidth)
ctx.fill();          // fill the path (uses fillStyle)
```

### Example: triangle
```js
ctx.beginPath();
ctx.moveTo(150, 150);
ctx.lineTo(200, 180);
ctx.lineTo(180, 220);
ctx.closePath();
ctx.fillStyle = "purple";
ctx.fill();
ctx.strokeStyle = "white";
ctx.stroke();
```

---

## Circles & Arcs
```js
// full circle = 0 → Math.PI * 2 (angles are in radians)
ctx.beginPath();
ctx.arc(cx, cy, radius, startAngle, endAngle, /* anticlockwise? */ false);
ctx.fill();
ctx.stroke();
```
**Common full circle:**
```js
ctx.beginPath();
ctx.arc(100, 250, 40, 0, Math.PI * 2);
ctx.fillStyle = "skyblue";
ctx.fill();
ctx.strokeStyle = "black";
ctx.stroke();
```

**`arcTo(x1, y1, x2, y2, radius)`**: arc tangent to two segments (advanced / optional).

---

## Curves (optional)
```js
ctx.quadraticCurveTo(cpx, cpy, x, y); // one control point
ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y); // two control points
```
Useful for smooth shapes; not needed for basic Pong.

---

## Lines Utility (common pattern)
```js
function drawLine(ctx, x1, y1, x2, y2, { strokeStyle="#fff", lineWidth=2, dash=[] } = {}) {
  ctx.beginPath();
  if (dash.length) ctx.setLineDash(dash);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  if (dash.length) ctx.setLineDash([]);
}
```

---

## Text
```js
ctx.font = "20px monospace";
ctx.fillStyle = "#57D269";
ctx.fillText("Score: 3", 20, 30);

ctx.strokeStyle = "#fff";
ctx.lineWidth = 1;
ctx.strokeText("Outline", 20, 60);
```

---

## Transforms (move/rotate/scale the canvas)
Transforms are **stateful**. Always pair with `save()` / `restore()` to avoid surprises.

```js
ctx.save();                 // snapshot current transform & styles
ctx.translate(dx, dy);      // move origin
ctx.rotate(angleRad);       // rotate the axes
ctx.scale(sx, sy);          // scale axes
// draw things in the transformed space…
ctx.restore();              // revert to previous state
```

### Example: rotate a square around its center
```js
function drawRotSquare(ctx, x, y, size, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "orange";
  ctx.fillRect(-size/2, -size/2, size, size);
  ctx.restore();
}
```

---

## Clearing the Frame (per tick)
```js
// option A: clear to transparent
ctx.clearRect(0, 0, canvas.width, canvas.height);

// option B: paint background color
ctx.fillStyle = "#0b0f16";
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

---

## Pixels (low-level)
Fast pixel = `fillRect(x, y, 1, 1)`.

Raw pixel access (slower, for batch operations or effects):
```js
const img = ctx.getImageData(x, y, w, h);
const data = img.data; // Uint8ClampedArray [r,g,b,a,...]

// mutate data...
data[0] = 255; // red channel of first pixel

ctx.putImageData(img, x, y); // write back
```

---

## Images
```js
// Ensure the image is loaded before drawing.
const img = new Image();
img.src = "sprite.png";
img.onload = () => {
  ctx.drawImage(img, 50, 300);           // draw at (50,300)
  ctx.drawImage(img, 0, 0, 64, 64, 120, 300, 64, 64); // crop & scale
};
```

---

## Shadows (optional flair)
```js
ctx.shadowColor = "rgba(0,0,0,0.4)";
ctx.shadowBlur = 8;
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
// draw something… then reset if needed
```

---

## Hit Regions (manual)
Canvas is pixel-based; it doesn’t track shapes. You implement hit-tests yourself.
```js
function pointInRect(px, py, x, y, w, h) {
  return px >= x && px <= x+w && py >= y && py <= y+h;
}
```

---

## Common Patterns for a Lib

### 1) Safe options destructuring
```js
function dot(ctx, x, y, { color="#fff", size=1, ...rest } = {}) {
  void rest;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}
```

### 2) Line/Arrow helper
```js
function arrow(ctx, ox, oy, dx, dy, { strokeStyle="#0ff", lineWidth=2, headSize=8 } = {}) {
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ox + dx, oy + dy);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  const ang = Math.atan2(dy, dx);
  const ex = ox + dx, ey = oy + dy;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - headSize * Math.cos(ang - Math.PI/6), ey - headSize * Math.sin(ang - Math.PI/6));
  ctx.lineTo(ex - headSize * Math.cos(ang + Math.PI/6), ey - headSize * Math.sin(ang + Math.PI/6));
  ctx.lineTo(ex, ey);
  ctx.stroke();
}
```

### 3) Frame Loop
```js
let last = 0;
function frame(now) {
  const dt = (now - last) / 1000; // seconds
  last = now;

  // clear
  ctx.fillStyle = "#10141f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw stuff…

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

---

## Gotchas & Tips
- Always call `beginPath()` before drawing a **new shape** with path APIs.
- `closePath()` is optional; it just connects back to the start point.
- Transforms affect *everything* after them until `restore()`.
- Styles are global — set them deliberately.
- Prefer `fillRect(x,y,1,1)` for single pixels (simple & fast).
- Text rendering uses the **current** `font`, `textAlign`, `textBaseline`.
- For crisp lines at 1px, consider 0.5 offsets due to pixel grid (optional).

---
