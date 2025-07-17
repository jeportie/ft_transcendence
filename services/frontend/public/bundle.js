"use strict";
(() => {
  // src/main.ts
  fetch("http://localhost:8000/health").then((r) => r.json()).then(console.log);
})();
