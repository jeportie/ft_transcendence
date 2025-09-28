# ft_transcendence

Last common core project of 42 school

## some general notes

### Ports

webapp : localhost:5000
tilt.dev ui : localhost:10350
API docs (swagger) : localhost:5000/docs
Sqlite-web : localhost:8080
Prometheus : localhost:9090/targets
Graphana Metrics : localhost:3000

### Frontend dependencies

1. **TypeScript** → transpiles your `.ts` source into JS.
2. **esbuild** → bundles/transpiles TS modules, applies loaders, minifies, and serves.
3. **Tailwind** (via PostCSS) → generates utility classes based on your markup.
4. **Autoprefixer** (via PostCSS) → enriches that CSS for browser compatibility.

This chain ensures you get type-safe, modular code; ultra-fast builds;
utility-first, minimal CSS; and broad browser support—all with a tiny config
and lightning-fast iteration.

### TODO LIST

