// AUTO-GENERATED FILE — DO NOT EDIT
// Generated from src/views/pages/auth/Signup
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
 * SignupDOM — Unified DOM accessor for views and templates
 */
export class SignupDOM {
  get signupCard(): HTMLDivElement {
    const el = document.getElementById("signup-card");
    if (!el) throw new Error("Missing element #signup-card in DOM");
    return el as HTMLDivElement;
  }
  get signupForm(): HTMLFormElement {
    const el = document.getElementById("signup-form");
    if (!el) throw new Error("Missing element #signup-form in DOM");
    return el as HTMLFormElement;
  }
  get signupUserInput(): HTMLInputElement {
    const el = document.getElementById("signup-user-input");
    if (!el) throw new Error("Missing element #signup-user-input in DOM");
    return el as HTMLInputElement;
  }
  get signupEmailInput(): HTMLInputElement {
    const el = document.getElementById("signup-email-input");
    if (!el) throw new Error("Missing element #signup-email-input in DOM");
    return el as HTMLInputElement;
  }
  get signupPwdInput(): HTMLInputElement {
    const el = document.getElementById("signup-pwd-input");
    if (!el) throw new Error("Missing element #signup-pwd-input in DOM");
    return el as HTMLInputElement;
  }
  get signupConfirmInput(): HTMLInputElement {
    const el = document.getElementById("signup-confirm-input");
    if (!el) throw new Error("Missing element #signup-confirm-input in DOM");
    return el as HTMLInputElement;
  }
  get signupRecaptchaContainer(): HTMLElement {
    const el = document.getElementById("signup-recaptcha-container");
    if (!el) throw new Error("Missing element #signup-recaptcha-container in DOM");
    return el as HTMLElement;
  }
  get signupFormBtn(): HTMLButtonElement {
    const el = document.getElementById("signup-form-btn");
    if (!el) throw new Error("Missing element #signup-form-btn in DOM");
    return el as HTMLButtonElement;
  }
  get signupErrorDiv(): HTMLDivElement {
    const el = document.getElementById("signup-error-div");
    if (!el) throw new Error("Missing element #signup-error-div in DOM");
    return el as HTMLDivElement;
  }
  get signupGoogleBtn(): HTMLButtonElement {
    const el = document.getElementById("signup-google-btn");
    if (!el) throw new Error("Missing element #signup-google-btn in DOM");
    return el as HTMLButtonElement;
  }
  get signupGithubBtn(): HTMLButtonElement {
    const el = document.getElementById("signup-github-btn");
    if (!el) throw new Error("Missing element #signup-github-btn in DOM");
    return el as HTMLButtonElement;
  }
  get signupFortytwoBtn(): HTMLButtonElement {
    const el = document.getElementById("signup-fortytwo-btn");
    if (!el) throw new Error("Missing element #signup-fortytwo-btn in DOM");
    return el as HTMLButtonElement;
  }



}

export const DOM = new SignupDOM();
