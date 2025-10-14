# ft_transcendence

Last common core project of 42 school

If you clone `ft_transcendence` elsewhere, run:

```bash
git clone --recurse-submodules https://github.com/jeportie/ft_transcendence.git
# or, if already cloned:
git submodule update --init --recursive
```

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

---

## Backup & Restore Process

We provide `make` targets to back up and restore **Prometheus**, **Grafana dashboards**, and the **SQLite DB**.  
Backups are stored in the `backups/` folder at the root of the repo.

### 🔹 Full Backup (Prometheus + Grafana + SQLite)

On workstation A:

```bash
make backup-all
git add backups/
git commit -m "Full backup"
git push
````

### 🔹 Full Restore

On workstation B:

```bash
git pull
make restore-all
```

This restores all volumes (Prometheus metrics history, Grafana dashboards, and the SQLite DB).

### 🔹 Light Backup (Grafana + SQLite only)

For smaller backups (safe to push to git, excludes Prometheus time-series):

```bash
make backup-light
git add backups/
git commit -m "Light backup"
git push
```

Restore on another workstation:

```bash
git pull
make restore-light
```

---

✅ Use **full backups** when you need metrics history.
✅ Use **light backups** when you just want dashboards + DB state without heavy Prometheus data.
