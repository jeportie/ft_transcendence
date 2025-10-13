# 🧭 View Architecture — Transcendence Frontend

## Overview

Each **view** in the app (e.g. `Login`, `Signup`, `Dashboard`) is a self-contained module that:

* Inherits from [`AbstractView`](https://github.com/jeportie/mini-router)
* Returns its HTML via `getHTML()`
* Runs its setup logic in `mount()` and cleans up in `destroy()`
* Uses the **tasks system** to register per-view initialization routines and automatic cleanups

---

## 🧩 Folder Structure

```
views/
  ├── auth/
  │   └── Login/
  │       ├── login.html
  │       ├── dom.generated.ts     ← auto-generated DOM bindings
  │       ├── Login.ts             ← view class
  │       └── tasks/               ← small, composable logic blocks
  │            ├── setupLogoAnimation.ts
  │            ├── togglePassword.ts
  │            ├── handleLogin.ts
  │            ├── handleGoogleLogin.ts
  │            ├── showActivationMessages.ts
  │            └── index.ts
  └── Signup/
      └── (same pattern)
```

---

## 🔄 View Lifecycle

| Phase        | Where            | Purpose                           |
| ------------ | ---------------- | --------------------------------- |
| **Init**     | `tasks.init`     | Create DOM elements, logos, etc.  |
| **Ready**    | `tasks.ready`    | Attach listeners and UI behaviors |
| **Teardown** | `tasks.teardown` | Run before the view unmounts      |

Each view instance manages its own cleanup stack :

```ts
this.#cleanups = [];
addCleanup(fn) → push cleanup callback
destroy() → run and clear all
```

---

## 🪄 DOM Registry

DOM IDs are auto-scanned by `scripts/generateDomRegistry.js`:

```bash
node scripts/generateDomRegistry.js src/views/auth/Login/login.html
```

This generates `dom.generated.ts` with:

```ts
export const DOM = new Proxy({}, { ... });
export const loginForm = () => $<HTMLFormElement>("login-form");
```

Now in any task :

```ts
import { DOM } from "../dom.generated.js";
DOM.loginForm?.addEventListener("submit", onSubmit);
```

---

## 🧱 Implementing a New View

1. **Create folder structure**

   ```
   views/MyView/
     ├── myView.html
     ├── MyView.ts
     └── tasks/
         ├── index.ts
         └── myTasks.ts
   ```

2. **Generate DOM registry**

   ```bash
   node scripts/generateDomRegistry.js src/views/MyView/myView.html
   ```

3. **Define tasks**

   ```ts
   // tasks/index.ts
   import { setupLogoAnimation } from "../../shared/setupLogoAnimation.js";
   export const tasks = { init: [setupLogoAnimation], ready: [], teardown: [] };
   ```

4. **Create view class**

   ```ts
   import { AbstractView } from "@jeportie/mini-spa";
   import { tasks } from "./tasks/index.ts";
   import html from "./myView.html";

   export default class MyView extends AbstractView {
     #cleanups = [];

     async getHTML() { return html; }

     async mount() {
       const context = { addCleanup: fn => this.#cleanups.push(fn) };
       for (const fn of tasks.init ?? []) Object.assign(context, fn(context) || {});
       for (const fn of tasks.ready ?? []) fn(context);
     }

     destroy() { for (const fn of this.#cleanups) fn(); }
   }
   ```

---

## 🧹 Cleanup Discipline

Every listener or timeout must register itself :

```ts
btn.addEventListener("click", onClick);
addCleanup(() => btn.removeEventListener("click", onClick));
```

When the router switches views, `destroy()` is called → everything is unbound safely.

---

## 🧠 Shared Helpers

Reusable UI/logic between views lives in `/src/views/shared/`:

* `setupLogoAnimation.ts`
* `handleGoogleButton.ts`
* `togglePassword.ts`

Each exports a pure function receiving `{ ASSETS, addCleanup }`.

---

## 🚀 Example Quick Start

To add a new “ResetPassword” view:

```bash
mkdir -p src/views/auth/ResetPassword/tasks
cp src/views/auth/Login/login.html src/views/auth/ResetPassword/reset.html
node scripts/generateDomRegistry.js src/views/auth/ResetPassword/reset.html
# Implement ResetPassword.ts using Login as template
```

---
