// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from src/views/pages/auth/Login
// Created by scripts/generateDomRegistry.mjs



function cloneTemplate(html: string): DocumentFragment {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  const firstTpl = tpl.content.firstElementChild as HTMLTemplateElement;
  if (firstTpl && firstTpl.tagName === "TEMPLATE")
      return firstTpl.content.cloneNode(true) as DocumentFragment;
  return tpl.content.cloneNode(true) as DocumentFragment;
}

/**
 * LoginDOM — Unified DOM accessor for views and templates
 */
export class LoginDOM {
  get loginCard(): HTMLDivElement {
    const el = document.getElementById("login-card");
    if (!el) throw new Error("Missing element #login-card in DOM");
    return el as HTMLDivElement;
  }
  get loginForm(): HTMLFormElement {
    const el = document.getElementById("login-form");
    if (!el) throw new Error("Missing element #login-form in DOM");
    return el as HTMLFormElement;
  }
  get loginUserInput(): HTMLInputElement {
    const el = document.getElementById("login-user-input");
    if (!el) throw new Error("Missing element #login-user-input in DOM");
    return el as HTMLInputElement;
  }
  get loginPwdInput(): HTMLInputElement {
    const el = document.getElementById("login-pwd-input");
    if (!el) throw new Error("Missing element #login-pwd-input in DOM");
    return el as HTMLInputElement;
  }
  get loginFormBtn(): HTMLButtonElement {
    const el = document.getElementById("login-form-btn");
    if (!el) throw new Error("Missing element #login-form-btn in DOM");
    return el as HTMLButtonElement;
  }
  get loginErrorDiv(): HTMLDivElement {
    const el = document.getElementById("login-error-div");
    if (!el) throw new Error("Missing element #login-error-div in DOM");
    return el as HTMLDivElement;
  }
  get loginGoogleBtn(): HTMLButtonElement {
    const el = document.getElementById("login-google-btn");
    if (!el) throw new Error("Missing element #login-google-btn in DOM");
    return el as HTMLButtonElement;
  }
  get loginGithubBtn(): HTMLButtonElement {
    const el = document.getElementById("login-github-btn");
    if (!el) throw new Error("Missing element #login-github-btn in DOM");
    return el as HTMLButtonElement;
  }
  get loginFortytwoBtn(): HTMLButtonElement {
    const el = document.getElementById("login-fortytwo-btn");
    if (!el) throw new Error("Missing element #login-fortytwo-btn in DOM");
    return el as HTMLButtonElement;
  }
  get inactiveP(): HTMLElement {
    const el = document.getElementById("inactive-p");
    if (!el) throw new Error("Missing element #inactive-p in DOM");
    return el as HTMLElement;
  }
  get inactiveRetryBtn(): HTMLButtonElement {
    const el = document.getElementById("inactive-retry-btn");
    if (!el) throw new Error("Missing element #inactive-retry-btn in DOM");
    return el as HTMLButtonElement;
  }
  get inactiveBoxDiv(): HTMLDivElement {
    const el = document.getElementById("inactive-box-div");
    if (!el) throw new Error("Missing element #inactive-box-div in DOM");
    return el as HTMLDivElement;
  }
  get inactiveBackBtn(): HTMLButtonElement {
    const el = document.getElementById("inactive-back-btn");
    if (!el) throw new Error("Missing element #inactive-back-btn in DOM");
    return el as HTMLButtonElement;
  }



}

export const DOM = new LoginDOM();
