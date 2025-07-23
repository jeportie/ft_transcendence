"use strict";
(() => {
  // src/main.ts
  fetch("/health.json").then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }).then(console.log).catch(console.error);
  console.log("TS is RUNNING!");
})();
