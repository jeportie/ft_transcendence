// src/styles/liquidGlass/lib/motion.ts
var MotionValue = class {
    constructor(initial) {
        this.subscribers = [];
        this._value = initial;
    }
    get() {
        return this._value;
    }
    set(v) {
        this._value = v;
        this.subscribers.forEach((fn) => fn(v));
    }
    onChange(fn) {
        this.subscribers.push(fn);
        fn(this._value);
        return () => {
            this.subscribers = this.subscribers.filter((f) => f !== fn);
        };
    }
};
function useTransform(source, transform) {
    const mv = new MotionValue(transform(source.get()));
    source.onChange((v) => mv.set(transform(v)));
    return mv;
}
function useSpring(source, opts) {
    const mv = new MotionValue(source.get());
    let vel = 0;
    const dt = 1 / 60;
    const update = () => {
        const target = source.get();
        const x = mv.get();
        const fSpring = opts.stiffness * (target - x);
        const fDamp = opts.damping * vel;
        const a = fSpring - fDamp;
        vel += a * dt;
        mv.set(x + vel * dt);
        requestAnimationFrame(update);
    };
    update();
    source.onChange(() => {
    });
    return mv;
}

// src/styles/liquidGlass/lib/magnifyingDisplacement.ts
function createImageDataBrowser(width, height) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    return ctx.createImageData(width, height);
}
function calculateMagnifyingDisplacementMap(canvasWidth, canvasHeight) {
    const dpr = window.devicePixelRatio ?? 1;
    const bufferWidth = Math.floor(canvasWidth * dpr);
    const bufferHeight = Math.floor(canvasHeight * dpr);
    const imageData = createImageDataBrowser(bufferWidth, bufferHeight);
    const ratio = Math.max(bufferWidth / 2, bufferHeight / 2);
    for (let y = 0; y < bufferHeight; y++) {
        for (let x = 0; x < bufferWidth; x++) {
            const idx = (y * bufferWidth + x) * 4;
            const rX = (x - bufferWidth / 2) / ratio;
            const rY = (y - bufferHeight / 2) / ratio;
            imageData.data[idx] = 128 - rX * 127;
            imageData.data[idx + 1] = 128 - rY * 127;
            imageData.data[idx + 2] = 0;
            imageData.data[idx + 3] = 255;
        }
    }
    return imageData;
}

// src/styles/liquidGlass/lib/imageDataToUrl.ts
function imageDataToUrl(imageData) {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

// src/styles/liquidGlass/lib/filterGenerator.ts
function createMagnifyingFilter(id = "magnifying-glass-filter", width = 210, height = 150) {
    const imageData = calculateMagnifyingDisplacementMap(width, height);
    const dataUrl = imageDataToUrl(imageData);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.display = "none";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", id);
    const feImage = document.createElementNS("http://www.w3.org/2000/svg", "feImage");
    feImage.setAttribute("href", dataUrl);
    feImage.setAttribute("result", "magnifying_displacement_map");
    feImage.setAttribute("x", "0");
    feImage.setAttribute("y", "0");
    feImage.setAttribute("width", width.toString());
    feImage.setAttribute("height", height.toString());
    filter.appendChild(feImage);
    const feDisplace = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
    feDisplace.setAttribute("in", "SourceGraphic");
    feDisplace.setAttribute("in2", "magnifying_displacement_map");
    feDisplace.setAttribute("scale", "24");
    feDisplace.setAttribute("xChannelSelector", "R");
    feDisplace.setAttribute("yChannelSelector", "G");
    filter.appendChild(feDisplace);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);
    return `url(#${id})`;
}

// src/styles/liquidGlass/graphics/magnifyingGlass.ts

function setupMagnifyingGlass(svgRoot) {
    const lens = svgRoot.querySelector(".lens");
    const inputs = {
        specularOpacity: document.getElementById("specularOpacity"),
        specularSaturation: document.getElementById("specularSaturation"),
        refractionBase: document.getElementById("refractionBase"),
    };

    if (!lens) {
        console.warn("[LiquidGlass] No .lens element found");
        return;
    }

    // 🔹 Generate and attach the SVG filter
    // --- Create the SVG filter for real refraction + specular light
    const defs = svgRoot.querySelector("#filter-defs");
    const filterEl = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filterEl.id = "magnifying-glass-filter";
    filterEl.setAttribute("x", "0");
    filterEl.setAttribute("y", "0");
    filterEl.setAttribute("width", "100%");
    filterEl.setAttribute("height", "100%");
    filterEl.setAttribute("filterUnits", "userSpaceOnUse");
    filterEl.setAttribute("primitiveUnits", "userSpaceOnUse");

    // 1️⃣ Displacement map texture
    const imgData = calculateMagnifyingDisplacementMap(210, 150);
    const dataUrl = imageDataToUrl(imgData);
    const feMap = document.createElementNS("http://www.w3.org/2000/svg", "feImage");
    feMap.setAttribute("href", dataUrl);
    feMap.setAttribute("result", "map");
    filterEl.appendChild(feMap);

    // 2️⃣ Displace the source image (the background inside <g>)
    const feDisp = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
    feDisp.setAttribute("in", "SourceGraphic");
    feDisp.setAttribute("in2", "map");
    feDisp.setAttribute("scale", "40");          // <- base strength
    feDisp.setAttribute("xChannelSelector", "R");
    feDisp.setAttribute("yChannelSelector", "G");
    feDisp.setAttribute("result", "displaced");
    filterEl.appendChild(feDisp);

    // 3️⃣ Add specular lighting (gloss highlight)
    const feLight = document.createElementNS("http://www.w3.org/2000/svg", "feSpecularLighting");
    feLight.setAttribute("in", "displaced");
    feLight.setAttribute("surfaceScale", "2");
    feLight.setAttribute("specularConstant", "0.75");
    feLight.setAttribute("specularExponent", "20");
    feLight.setAttribute("lighting-color", "white");
    feLight.setAttribute("result", "specLight");

    const fePoint = document.createElementNS("http://www.w3.org/2000/svg", "fePointLight");
    fePoint.setAttribute("x", "400");
    fePoint.setAttribute("y", "180");
    fePoint.setAttribute("z", "200");
    feLight.appendChild(fePoint);
    filterEl.appendChild(feLight);

    // 4️⃣ Combine displaced image + specular
    const feComp = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
    feComp.setAttribute("in", "specLight");
    feComp.setAttribute("in2", "displaced");
    feComp.setAttribute("operator", "arithmetic");
    feComp.setAttribute("k1", "0");
    feComp.setAttribute("k2", "1");
    feComp.setAttribute("k3", "1");
    feComp.setAttribute("k4", "0");
    feComp.setAttribute("result", "final");
    filterEl.appendChild(feComp);

    defs.appendChild(filterEl);


    // 🔹 Motion values
    const isDragging = new MotionValue(false);
    const refractionBase = new MotionValue(parseFloat(inputs.refractionBase?.value ?? "1"));
    const specularSaturation = new MotionValue(parseFloat(inputs.specularSaturation?.value ?? "9"));
    const specularOpacity = new MotionValue(parseFloat(inputs.specularOpacity?.value ?? "0.5"));

    const dragMultiplier = useTransform(isDragging, d => (d ? 1 : 0.8));
    const refractionLevel = useSpring(useTransform(refractionBase, v => v * dragMultiplier.get()), {
        stiffness: 250,
        damping: 14,
    });
    const objectScale = useSpring(useTransform(isDragging, d => (d ? 1 : 0.9)), {
        stiffness: 300,
        damping: 20,
    });

    // 🔹 Drag logic (SVG coordinates)
    let drag = false;
    let offsetX = 0, offsetY = 0;

    svgRoot.addEventListener("mousedown", (e) => {
        const pt = svgRoot.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svgRoot.getScreenCTM().inverse());
        offsetX = svgP.x - parseFloat(lens.getAttribute("x"));
        offsetY = svgP.y - parseFloat(lens.getAttribute("y"));
        drag = true;
        isDragging.set(true);
    });

    window.addEventListener("mouseup", () => {
        drag = false;
        isDragging.set(false);
    });

    window.addEventListener("mousemove", (e) => {
        if (!drag) return;
        const pt = svgRoot.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svgRoot.getScreenCTM().inverse());
        const x = svgP.x - offsetX;
        const y = svgP.y - offsetY;
        lens.setAttribute("x", x.toFixed(1));
        lens.setAttribute("y", y.toFixed(1));
    });

    // 🔹 Animate filter + lens
    const feDisplace = filterEl.querySelector("feDisplacementMap");
    feLight = filterEl.querySelector("feSpecularLighting");

    const render = () => {
        const scale = 80 * refractionLevel.get(); // stronger base to see it clearly
        const specExp = 10 + specularSaturation.get();
        const specConst = 0.1 + specularOpacity.get() * 0.9;

        feDisplace.setAttribute("scale", scale.toFixed(2));
        feLight.setAttribute("specularExponent", specExp.toFixed(1));
        feLight.setAttribute("specularConstant", specConst.toFixed(2));

        lens.setAttribute("fill", `rgba(255,255,255,${0.12 * specularOpacity.get()})`);
        lens.setAttribute("transform", `scale(${objectScale.get()})`);
        requestAnimationFrame(render);
    };
    render();

    render();

    // 🔹 Bind controls
    inputs.refractionBase?.addEventListener("input", (e) =>
        refractionBase.set(parseFloat(e.target.value))
    );
    inputs.specularSaturation?.addEventListener("input", (e) =>
        specularSaturation.set(parseFloat(e.target.value))
    );
    inputs.specularOpacity?.addEventListener("input", (e) =>
        specularOpacity.set(parseFloat(e.target.value))
    );
}
export {
    setupMagnifyingGlass
};
//# sourceMappingURL=bundle.js.map
