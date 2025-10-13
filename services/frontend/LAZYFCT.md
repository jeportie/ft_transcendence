# 🎓 Mini-Class: “Lazy Functions” in Modern Front-End Apps

---

## 🧩 Part 1 — What “lazy” means

> 💬 “Lazy” = *not doing the work until it’s actually needed.*

In JavaScript, we can make:

* **lazy values** → using `getters` or functions that compute on demand.
* **lazy DOM lookups** → functions that fetch the element *when* we call them.

### Example

```js
// Eager (runs immediately)
const element = document.getElementById("login-card");

// Lazy (runs only when called)
const getElement = () => document.getElementById("login-card");
```

If the DOM changes after load, the first one becomes outdated —
the second one is *always fresh*.

---

## ⚙️ Part 2 — Why this matters in SPAs

In a **Single Page Application**, views appear and disappear dynamically:

* The `<div id="login-card">` might not exist when your code loads.
* It may later be destroyed and re-created (e.g. switching to signup → back to login).

So if you cached the element once, you’d get a stale or null reference.

👉 Lazy functions fix this because they *re-fetch* each time.

---

## 🧱 Part 3 — Pattern 1: Simple Lazy Accessors

```ts
// TypeScript + HTML type safety
function $<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

// Lazy accessors
export const loginCard = () => $<HTMLDivElement>("login-card");
export const loginForm = () => $<HTMLFormElement>("login-form");

// Usage
loginForm()?.addEventListener("submit", handleLogin);
```

✅ Always fresh
✅ Type-safe
✅ Short and clean

---

## 🧭 Part 4 — Pattern 2: Lazy Proxies (Dynamic Access)

If you want to avoid manually writing all those functions, you can use a **Proxy**:

```ts
export const DOM = new Proxy({}, {
  get(_target, key: string) {
    const id = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
    return document.getElementById(id);
  }
});
```

Then use it like:

```ts
DOM.loginCard?.classList.add("visible");
DOM.loginFormBtn?.disabled = true;
```

→ It dynamically converts `loginCard` → `#login-card`
→ Fetches elements lazily when you access them.

Perfect for auto-generated DOM registries.

---

## 🧰 Part 5 — Pattern 3: Lazy Components or View Classes

You can wrap this logic into a **view class** that manages its own lazy getters:

```ts
class LoginView {
  get card() { return document.getElementById("login-card") as HTMLDivElement | null; }
  get form() { return document.getElementById("login-form") as HTMLFormElement | null; }

  init() {
    this.form?.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    console.log("Submitting", this.card);
  }
}
```

→ `get` automatically acts like a lazy function
→ each access re-fetches the element
→ integrates nicely with lifecycle hooks (`mount`, `unmount`, etc.)

---

## 🧠 Part 6 — When to use lazy vs cached

| Use case                                    | Lazy function                  | Cached variable          |
| ------------------------------------------- | ------------------------------ | ------------------------ |
| Element may appear/disappear dynamically    | ✅                              | ❌                        |
| Element exists at startup and never changes | ⚙️ optional                    | ✅                        |
| You re-render the DOM (e.g. SPA views)      | ✅                              | ❌                        |
| You need speed inside tight animation loop  | ❌ (avoid repeated DOM lookups) | ✅ (cache once per frame) |

So often you’ll **mix both**:

* Lazy for safety
* Cached inside a local render loop for performance

Example:

```ts
const btn = loginFormBtn(); // cache just for this operation
btn?.classList.add("loading");
```

---

## 🧩 Part 7 — Pattern 4: Lazy Initialization Functions

Sometimes you want to delay not just the DOM lookup, but **initialization** itself:

```ts
let _pane = null;

export function getUIPanel() {
  if (!_pane) {
    _pane = new Pane({ title: "UI Panel" });
  }
  return _pane;
}
```

→ Here, the object is created lazily only on first access,
and cached afterward for reuse.

---

## 🌐 Part 8 — Practical SPA Lifecycle Example

Imagine your SPA router mounts a `Login` view like this:

```ts
import { loginCard, loginForm } from "./dom.generated.js";

export function mountLogin() {
  // Elements exist now — safe to use
  loginForm()?.addEventListener("submit", onSubmit);
  loginCard()?.classList.add("visible");
}

export function unmountLogin() {
  loginCard()?.remove();
}
```

Even if `unmountLogin` destroys the card, when you later remount,
`loginCard()` will still find the new instance.

---

## 🎯 Part 9 — Quick Recap

| Concept           | Description                            | Example                                          |
| ----------------- | -------------------------------------- | ------------------------------------------------ |
| **Lazy function** | Runs only when called                  | `const el = () => document.getElementById("id")` |
| **Lazy getter**   | Class property that re-fetches element | `get el() { return ... }`                        |
| **Lazy init**     | Create object only when needed         | `if (!obj) obj = new Obj()`                      |
| **SPA benefit**   | Avoid stale DOM references             | ✅ dynamic views stay stable                      |

---

## 🧩 Part 10 — Bonus: TypeScript Safety Tips

To keep autocomplete and safety:

```ts
type LoginDom = {
  loginCard: () => HTMLDivElement | null;
  loginForm: () => HTMLFormElement | null;
};

export const DOM: LoginDom = {
  loginCard: () => $<HTMLDivElement>("login-card"),
  loginForm: () => $<HTMLFormElement>("login-form"),
};
```

Then you get type-safe autocompletion like `DOM.loginForm()?.submit()`.

---

### 🔁 Tiny Practice Exercise

Try writing your own **“SignupDom”** registry:

* `signupCard`
* `signupForm`
* `signupEmailInput`
* `signupPwdInput`
* `signupConfirmInput`

