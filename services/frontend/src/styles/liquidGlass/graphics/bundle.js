// lib/magnifyingDisplacement.ts
function createImageDataBrowser(width, height) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  return ctx.createImageData(width, height);
}
function calculateMagnifyingDisplacementMap(canvasWidth, canvasHeight) {
  const dpr = window.devicePixelRatio ?? 1;
  const bufferWidth = Math.floor(canvasWidth * dpr);
  const bufferHeight = Math.floor(canvasHeight * dpr);
  const imageData = createImageDataBrowser(bufferWidth, bufferHeight);
  const cx = bufferWidth / 2;
  const cy = bufferHeight / 2;
  const sx = bufferWidth / 2;
  const sy = bufferHeight / 2;
  const data = imageData.data;
  for (let y = 0; y < bufferHeight; y++) {
    for (let x = 0; x < bufferWidth; x++) {
      const idx = (y * bufferWidth + x) * 4;
      const rX = (x - cx) / sx;
      const rY = (y - cy) / sy;
      data[idx] = 128 - rX * 127;
      data[idx + 1] = 128 - rY * 127;
      data[idx + 2] = 0;
      data[idx + 3] = 255;
    }
  }
  return imageData;
}

// lib/displacementMap.ts
function calculateDisplacementMap(glassThickness = 200, bezelWidth = 50, bezelHeightFn = (x) => x, refractiveIndex = 1.5, samples = 128) {
  const eta = 1 / refractiveIndex;
  function refract(normalX, normalY) {
    const dot = normalY;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) return null;
    const kSqrt = Math.sqrt(k);
    return [-(eta * dot + kSqrt) * normalX, eta - (eta * dot + kSqrt) * normalY];
  }
  return Array.from({ length: samples }, (_, i) => {
    const x = i / samples;
    const y = bezelHeightFn(x);
    const dx = 1e-4;
    const y2 = bezelHeightFn(x + dx);
    const derivative = (y2 - y) / dx;
    const magnitude = Math.sqrt(derivative * derivative + 1);
    const normal = [-derivative / magnitude, -1 / magnitude];
    const refracted = refract(normal[0], normal[1]);
    if (!refracted) return 0;
    const remainingHeight = y * bezelWidth + glassThickness;
    return refracted[0] * (remainingHeight / refracted[1]);
  });
}
function calculateDisplacementMap2(canvasWidth, canvasHeight, objectWidth, objectHeight, radius, bezelWidth, maximumDisplacement, precomputedDisplacementMap = [], dpr) {
  const devicePixelRatio = dpr ?? window.devicePixelRatio ?? 1;
  const bufferWidth = Math.floor(canvasWidth * devicePixelRatio);
  const bufferHeight = Math.floor(canvasHeight * devicePixelRatio);
  const imageData = createImageDataBrowser(bufferWidth, bufferHeight);
  const data = imageData.data;
  const cx = bufferWidth / 2;
  const cy = bufferHeight / 2;
  const radius_ = radius * devicePixelRatio;
  const bezel = bezelWidth * devicePixelRatio;
  const outerSq = radius_ ** 2;
  const innerSq = (radius_ - bezel) ** 2;
  for (let y = 0; y < bufferHeight; y++) {
    for (let x = 0; x < bufferWidth; x++) {
      const idx = (y * bufferWidth + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const distSq = dx * dx + dy * dy;
      if (distSq > outerSq || distSq < innerSq) continue;
      const dist = Math.sqrt(distSq);
      const distFromSide = radius_ - dist;
      const cos = dx / dist;
      const sin = dy / dist;
      const bezelIndex = Math.floor(
        distFromSide / bezel * precomputedDisplacementMap.length
      );
      const distance = precomputedDisplacementMap[bezelIndex] ?? 0;
      const dX = -cos * distance / maximumDisplacement;
      const dY = -sin * distance / maximumDisplacement;
      data[idx] = 128 + dX * 127;
      data[idx + 1] = 128 + dY * 127;
      data[idx + 2] = 0;
      data[idx + 3] = 255;
    }
  }
  return imageData;
}

// lib/specular.ts
function calculateRefractionSpecular(objectWidth, objectHeight, radius, bezelWidth, specularAngle = Math.PI / 3, dpr) {
  const devicePixelRatio = dpr ?? window.devicePixelRatio ?? 1;
  const W = Math.floor(objectWidth * devicePixelRatio);
  const H = Math.floor(objectHeight * devicePixelRatio);
  const img = createImageDataBrowser(W, H);
  const data = img.data;
  const cx = W / 2;
  const cy = H / 2;
  const r = radius * devicePixelRatio;
  const b = bezelWidth * devicePixelRatio;
  const innerSq = Math.max(0, (r - b * 0.45) ** 2);
  const outerSq = (r + 0.75 * devicePixelRatio) ** 2;
  const lx = Math.cos(specularAngle);
  const ly = Math.sin(specularAngle);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 < innerSq || d2 > outerSq) continue;
      const d = Math.sqrt(d2);
      const nx = dx / d;
      const ny = dy / d;
      const ndotl = Math.max(0, nx * lx + ny * ly);
      const t = Math.min(1, Math.max(0, (d - (r - b * 0.45)) / (b * 0.45 + 0.75)));
      const rim = Math.sqrt(1 - (1 - t) * (1 - t));
      const intensity = ndotl * rim;
      if (intensity <= 0) continue;
      const c = Math.round(255 * intensity);
      const a = Math.round(200 * intensity);
      data[i] = c;
      data[i + 1] = c;
      data[i + 2] = c;
      data[i + 3] = a;
    }
  }
  return img;
}

// lib/surfaceEquations.ts
var CONVEX_CIRCLE = {
  title: "Convex Circle",
  fn: (x) => Math.sqrt(1 - (1 - x) ** 2)
};
var CONVEX = {
  title: "Convex Squircle",
  fn: (x) => Math.pow(1 - Math.pow(1 - x, 4), 1 / 4)
};
var CONCAVE = {
  title: "Concave",
  fn: (x) => 1 - CONVEX_CIRCLE.fn(x)
};
var LIP = {
  title: "Lip",
  fn: (x) => {
    const convex = CONVEX.fn(x * 2);
    const concave = CONCAVE.fn(x) + 0.1;
    const smootherstep = 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
    return convex * (1 - smootherstep) + concave * smootherstep;
  }
};

// lib/imageDataToUrl.ts
function imageDataToUrl(imageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get 2D context");
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

// lib/refractionFilter.ts
function createRefractionFilter(options) {
  const {
    id,
    width = 150,
    height = 150,
    radius = Math.floor((width + height) / 4),
    bezelWidth = 40,
    glassThickness = 120,
    refractiveIndex = 1.5,
    bezelType = "convex_squircle",
    blur = 0,
    scaleRatio = 1,
    specularOpacity = 0.5,
    specularSaturation = 9,
    magnify = true,
    magnifyingScale = 24
    // stronger default so zoom is obvious
  } = options;
  let surfaceFn;
  switch (bezelType) {
    case "convex_circle":
      surfaceFn = CONVEX_CIRCLE.fn;
      break;
    case "concave":
      surfaceFn = CONCAVE.fn;
      break;
    case "lip":
      surfaceFn = LIP.fn;
      break;
    default:
      surfaceFn = CONVEX.fn;
  }
  const precomputed = calculateDisplacementMap(glassThickness, bezelWidth, surfaceFn, refractiveIndex);
  const disp = calculateDisplacementMap2(width, height, width, height, radius, bezelWidth, 100, precomputed, 1);
  const spec = calculateRefractionSpecular(width, height, radius, bezelWidth, void 0, 1);
  const dispUrl = imageDataToUrl(disp);
  const specUrl = imageDataToUrl(spec);
  const magnifyUrl = magnify ? imageDataToUrl(calculateMagnifyingDisplacementMap(width, height)) : null;
  const svgNS = "http://www.w3.org/2000/svg";
  let svg = document.querySelector("svg#liquid-glass-defs");
  let defs = svg?.querySelector("defs");
  if (!svg || !defs) {
    svg = document.createElementNS(svgNS, "svg");
    svg.id = "liquid-glass-defs";
    svg.style.display = "none";
    defs = document.createElementNS(svgNS, "defs");
    svg.appendChild(defs);
    document.body.appendChild(svg);
  }
  const old = document.getElementById(id);
  if (old?.parentElement) old.parentElement.removeChild(old);
  const f = document.createElementNS(svgNS, "filter");
  f.setAttribute("id", id);
  f.setAttribute("color-interpolation-filters", "sRGB");
  f.setAttribute("filterUnits", "userSpaceOnUse");
  f.setAttribute("primitiveUnits", "userSpaceOnUse");
  f.setAttribute("x", "0");
  f.setAttribute("y", "0");
  f.setAttribute("width", String(width));
  f.setAttribute("height", String(height));
  if (magnify && magnifyUrl) {
    const feImgMag = document.createElementNS(svgNS, "feImage");
    feImgMag.setAttribute("href", magnifyUrl);
    feImgMag.setAttribute("x", "0");
    feImgMag.setAttribute("y", "0");
    feImgMag.setAttribute("width", String(width));
    feImgMag.setAttribute("height", String(height));
    feImgMag.setAttribute("preserveAspectRatio", "none");
    feImgMag.setAttribute("result", "magnifying_displacement_map");
    f.appendChild(feImgMag);
    const feDispMag = document.createElementNS(svgNS, "feDisplacementMap");
    feDispMag.setAttribute("in", "SourceGraphic");
    feDispMag.setAttribute("in2", "magnifying_displacement_map");
    feDispMag.setAttribute("scale", String(magnifyingScale));
    feDispMag.setAttribute("xChannelSelector", "R");
    feDispMag.setAttribute("yChannelSelector", "G");
    feDispMag.setAttribute("result", "magnified_source");
    f.appendChild(feDispMag);
  }
  const feBlur = document.createElementNS(svgNS, "feGaussianBlur");
  feBlur.setAttribute("in", magnify ? "magnified_source" : "SourceGraphic");
  feBlur.setAttribute("stdDeviation", String(blur));
  feBlur.setAttribute("result", "blurred_source");
  f.appendChild(feBlur);
  const feImgDisp = document.createElementNS(svgNS, "feImage");
  feImgDisp.setAttribute("href", dispUrl);
  feImgDisp.setAttribute("x", "0");
  feImgDisp.setAttribute("y", "0");
  feImgDisp.setAttribute("width", String(width));
  feImgDisp.setAttribute("height", String(height));
  feImgDisp.setAttribute("preserveAspectRatio", "none");
  feImgDisp.setAttribute("result", "displacement_map");
  f.appendChild(feImgDisp);
  const feDisp = document.createElementNS(svgNS, "feDisplacementMap");
  feDisp.setAttribute("in", "blurred_source");
  feDisp.setAttribute("in2", "displacement_map");
  feDisp.setAttribute("scale", String(40 * scaleRatio));
  feDisp.setAttribute("xChannelSelector", "R");
  feDisp.setAttribute("yChannelSelector", "G");
  feDisp.setAttribute("result", "displaced");
  f.appendChild(feDisp);
  const feSat = document.createElementNS(svgNS, "feColorMatrix");
  feSat.setAttribute("in", "displaced");
  feSat.setAttribute("type", "saturate");
  feSat.setAttribute("values", String(specularSaturation));
  feSat.setAttribute("result", "displaced_saturated");
  f.appendChild(feSat);
  const feImgSpec = document.createElementNS(svgNS, "feImage");
  feImgSpec.setAttribute("href", specUrl);
  feImgSpec.setAttribute("x", "0");
  feImgSpec.setAttribute("y", "0");
  feImgSpec.setAttribute("width", String(width));
  feImgSpec.setAttribute("height", String(height));
  feImgSpec.setAttribute("preserveAspectRatio", "none");
  feImgSpec.setAttribute("result", "specular_layer");
  f.appendChild(feImgSpec);
  const feTrans = document.createElementNS(svgNS, "feComponentTransfer");
  feTrans.setAttribute("in", "specular_layer");
  feTrans.setAttribute("result", "specular_faded");
  const feFuncA = document.createElementNS(svgNS, "feFuncA");
  feFuncA.setAttribute("type", "linear");
  feFuncA.setAttribute("slope", String(specularOpacity));
  feTrans.appendChild(feFuncA);
  f.appendChild(feTrans);
  const feSpecBlur = document.createElementNS(svgNS, "feGaussianBlur");
  feSpecBlur.setAttribute("in", "specular_faded");
  feSpecBlur.setAttribute("stdDeviation", "0.6");
  feSpecBlur.setAttribute("result", "specular_bloom");
  f.appendChild(feSpecBlur);
  const feComp = document.createElementNS(svgNS, "feComposite");
  feComp.setAttribute("in", "displaced_saturated");
  feComp.setAttribute("in2", "specular_bloom");
  feComp.setAttribute("operator", "in");
  feComp.setAttribute("result", "specular_masked");
  f.appendChild(feComp);
  const feBlendScreen = document.createElementNS(svgNS, "feBlend");
  feBlendScreen.setAttribute("in", "specular_masked");
  feBlendScreen.setAttribute("in2", "displaced");
  feBlendScreen.setAttribute("mode", "screen");
  feBlendScreen.setAttribute("result", "withSpecular");
  f.appendChild(feBlendScreen);
  const feBlendFinal = document.createElementNS(svgNS, "feBlend");
  feBlendFinal.setAttribute("in", "specular_faded");
  feBlendFinal.setAttribute("in2", "withSpecular");
  feBlendFinal.setAttribute("mode", "normal");
  f.appendChild(feBlendFinal);
  defs.appendChild(f);
  return f;
}

// graphics/magnifyingGlass.ts
function setupMagnifyingGlass(root) {
  const lens = root.querySelector(".lens");
  if (!lens) return;
  let current = createRefractionFilter({
    id: "liquid",
    magnify: true,
    width: 210,
    height: 150,
    specularOpacity: 0.5,
    specularSaturation: 9,
    scaleRatio: 1,
    magnifyingScale: 24
  });
  requestAnimationFrame(() => {
    lens.style.backdropFilter = `url(#${current.id})`;
  });
  const opacity = document.getElementById("specularOpacity");
  const sat = document.getElementById("specularSaturation");
  const refr = document.getElementById("refractionBase");
  const mag = document.getElementById("magnifyScale");
  function rebuild() {
    const old = document.getElementById("liquid");
    if (old?.parentElement) old.parentElement.removeChild(old);
    current = createRefractionFilter({
      id: "liquid",
      magnify: true,
      width: 210,
      height: 150,
      specularOpacity: parseFloat(opacity.value),
      specularSaturation: parseFloat(sat.value),
      scaleRatio: parseFloat(refr.value),
      magnifyingScale: parseFloat(mag.value)
    });
    lens.style.backdropFilter = `url(#${current.id})`;
  }
  [opacity, sat, refr, mag].forEach((s) => s.addEventListener("input", rebuild));
  let dragging = false;
  let offX = 0, offY = 0;
  lens.addEventListener("mousedown", (e) => {
    dragging = true;
    offX = e.offsetX;
    offY = e.offsetY;
    lens.style.cursor = "grabbing";
  });
  window.addEventListener("mouseup", () => {
    dragging = false;
    lens.style.cursor = "grab";
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const rect = root.getBoundingClientRect();
    const x = e.clientX - rect.left - offX;
    const y = e.clientY - rect.top - offY;
    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;
  });
}
export {
  setupMagnifyingGlass
};
//# sourceMappingURL=bundle.js.map
