# ft_transcendence

Last common core project of 42 school

## some general notes

### Ports

backend service port : 5000
frontend service port : 3000
sqlite port : 8191

### Frontend dependencies

1. **TypeScript** → transpiles your `.ts` source into JS.
2. **esbuild** → bundles/transpiles TS modules, applies loaders, minifies, and serves.
3. **Tailwind** (via PostCSS) → generates utility classes based on your markup.
4. **Autoprefixer** (via PostCSS) → enriches that CSS for browser compatibility.

This chain ensures you get type-safe, modular code; ultra-fast builds;
utility-first, minimal CSS; and broad browser support—all with a tiny config
and lightning-fast iteration.
