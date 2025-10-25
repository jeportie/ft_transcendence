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
  const bufferWidth = Math.floor(objectWidth * devicePixelRatio);
  const bufferHeight = Math.floor(objectHeight * devicePixelRatio);
  const imageData = createImageDataBrowser(bufferWidth, bufferHeight);
  const data = imageData.data;
  const cx = bufferWidth / 2;
  const cy = bufferHeight / 2;
  const radius_ = radius * devicePixelRatio;
  const bezel_ = bezelWidth * devicePixelRatio;
  const radiusSq = radius_ ** 2;
  const outerSq = (radius_ + devicePixelRatio) ** 2;
  const innerSq = (radius_ - bezel_) ** 2;
  const specularVec = [Math.cos(specularAngle), Math.sin(specularAngle)];
  for (let y = 0; y < bufferHeight; y++) {
    for (let x = 0; x < bufferWidth; x++) {
      const idx = (y * bufferWidth + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const distSq = dx * dx + dy * dy;
      if (distSq < innerSq || distSq > outerSq) continue;
      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const ny = dy / dist;
      const dot = Math.max(0, nx * specularVec[0] + ny * specularVec[1]);
      const edge = Math.max(0, 1 - (radius_ - dist) / bezel_);
      const intensity = dot * Math.sqrt(1 - (1 - edge) ** 2);
      const color = Math.min(255, intensity * 255);
      data[idx] = color;
      data[idx + 1] = color;
      data[idx + 2] = color;
      data[idx + 3] = Math.round(color);
    }
  }
  return imageData;
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
    blur = 0.2,
    scaleRatio = 1,
    specularOpacity = 0.4,
    specularSaturation = 4,
    magnify = false,
    magnifyingScale = 1
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
  const maxDisplacement = Math.max(...precomputed.map((v) => Math.abs(v))) || 1;
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
  if (magnify && magnifyUrl) {
    const feImgMag = document.createElementNS(svgNS, "feImage");
    feImgMag.setAttribute("href", magnifyUrl);
    feImgMag.setAttribute("width", String(width));
    feImgMag.setAttribute("height", String(height));
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
  feImgDisp.setAttribute("width", String(width));
  feImgDisp.setAttribute("height", String(height));
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
  feImgSpec.setAttribute("width", String(width));
  feImgSpec.setAttribute("height", String(height));
  feImgSpec.setAttribute("result", "specular_layer");
  f.appendChild(feImgSpec);
  const feComp = document.createElementNS(svgNS, "feComposite");
  feComp.setAttribute("in", "displaced_saturated");
  feComp.setAttribute("in2", "specular_layer");
  feComp.setAttribute("operator", "in");
  feComp.setAttribute("result", "specular_saturated");
  f.appendChild(feComp);
  const feTrans = document.createElementNS(svgNS, "feComponentTransfer");
  feTrans.setAttribute("in", "specular_layer");
  feTrans.setAttribute("result", "specular_faded");
  const feFuncA = document.createElementNS(svgNS, "feFuncA");
  feFuncA.setAttribute("type", "linear");
  feFuncA.setAttribute("slope", String(specularOpacity));
  feTrans.appendChild(feFuncA);
  f.appendChild(feTrans);
  const feBlend1 = document.createElementNS(svgNS, "feBlend");
  feBlend1.setAttribute("in", "specular_saturated");
  feBlend1.setAttribute("in2", "displaced");
  feBlend1.setAttribute("mode", "normal");
  feBlend1.setAttribute("result", "withSaturation");
  f.appendChild(feBlend1);
  const feBlend2 = document.createElementNS(svgNS, "feBlend");
  feBlend2.setAttribute("in", "specular_faded");
  feBlend2.setAttribute("in2", "withSaturation");
  feBlend2.setAttribute("mode", "normal");
  f.appendChild(feBlend2);
  defs.appendChild(f);
  return f;
}

// graphics/magnifyingGlass.ts
function setupMagnifyingGlass(root) {
  const lens = root.querySelector(".lens");
  const lensImage = lens?.querySelector(".lens-image");
  if (!lens || !lensImage) return;
  let current = createRefractionFilter({
    id: "liquid",
    magnify: true,
    width: 210,
    height: 150,
    specularOpacity: 0.5,
    specularSaturation: 9,
    scaleRatio: 1
  });
  requestAnimationFrame(() => {
    lensImage.style.filter = `url(#${current.id})`;
  });
  function syncInnerImageOffset() {
    const containerRect = root.getBoundingClientRect();
    const lensRect = lens.getBoundingClientRect();
    const x = lensRect.left - containerRect.left;
    const y = lensRect.top - containerRect.top;
    lensImage.style.left = `${-x}px`;
    lensImage.style.top = `${-y}px`;
  }
  syncInnerImageOffset();
  window.addEventListener("resize", syncInnerImageOffset);
  const opacity = document.getElementById("specularOpacity");
  const sat = document.getElementById("specularSaturation");
  const refr = document.getElementById("refractionBase");
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
      scaleRatio: parseFloat(refr.value)
    });
    lensImage.style.filter = `url(#${current.id})`;
  }
  [opacity, sat, refr].forEach((s) => s.addEventListener("input", rebuild));
  let dragging = false;
  let offsetX = 0, offsetY = 0;
  lens.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    lens.style.cursor = "grabbing";
  });
  window.addEventListener("mouseup", () => {
    dragging = false;
    lens.style.cursor = "grab";
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const rect = root.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;
    lensImage.style.left = `${-x}px`;
    lensImage.style.top = `${-y}px`;
  });
}
export {
  setupMagnifyingGlass
};
//# sourceMappingURL=bundle.js.map
