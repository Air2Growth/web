import { message } from './messages.ts';
import { localizedHref } from './locale-paths.ts';

const locale = document.documentElement.lang === 'en' ? 'en' : 'de';
const homePath = localizedHref('/', locale);

// Small, progressively enhanced interactions. All content is readable without JS.
// Preserve bookmarks when detailed product sections move off the homepage.
const movedHomeSections = {
  '#problem': '/#loesung',
  '#vorteile': '/loesung#vorteile',
  '#funktionsweise': '/loesung#funktionsweise',
  '#rechenmodell': '/loesung',
  '#fragen': '/loesung#fragen',
};
function redirectMovedHomeSection() {
  const movedDestination = window.location.pathname === homePath && movedHomeSections[window.location.hash];
  if (!movedDestination) return;
  const destination = new URL(localizedHref(movedDestination, locale), window.location.href);
  destination.search = window.location.search;
  window.location.replace(destination.href);
}
redirectMovedHomeSection();
window.addEventListener('hashchange', redirectMovedHomeSection);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const animations = new Set();

function animate(element, frames, options) {
  if (reducedMotion.matches || typeof element?.animate !== 'function') return null;
  const animation = element.animate(frames, options);
  animations.add(animation);
  animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  return animation;
}

reducedMotion.addEventListener('change', (event) => {
  if (event.matches) animations.forEach((animation) => animation.finish());
});

// One quiet entrance in the hero; subsequent sections remain visible and still.
document.querySelectorAll('[data-hero-enter]').forEach((element, index) => {
  animate(element, [
    { opacity: 0, transform: 'translateY(12px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ], { duration: 650, delay: index * 90, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
});

// Native details retain keyboard support and a usable no-JS fallback.
const process = document.querySelector('[data-process]');
if (process) {
  const steps = [...process.querySelectorAll('[data-process-step]')];
  const captions = {
    capture: 'Am Anfang steht ein Rohstoff, der uns umgibt.',
    transform: 'Aus gefiltertem CO₂ wird die Grundlage für den biologischen Prozess.',
    grow: 'Mikroalgen machen den nächsten Schritt zum Bio-Flüssigdünger.',
  };
  const caption = process.querySelector('[data-process-caption]');
  const flowPath = process.querySelector('[data-flow-path]');
  const pending = new WeakMap();
  const desiredOpen = new WeakMap();
  let flowAnimation;

  function showStage(stage, respondToAction = true) {
    process.querySelectorAll('[data-process-stage]').forEach((group) => {
      const active = group.dataset.processStage === stage;
      group.classList.toggle('opacity-100', active);
      group.classList.toggle('opacity-40', !active);
    });
    if (caption) {
      caption.textContent = message(captions[stage]);
      if (respondToAction) animate(caption, [{ opacity: 0.4 }, { opacity: 1 }], { duration: 220 });
    }
    if (flowAnimation) flowAnimation.cancel();
    if (respondToAction && flowPath) {
      flowAnimation = animate(flowPath, [{ strokeDashoffset: 22 }, { strokeDashoffset: 0 }], { duration: 650, easing: 'ease-out' });
    }
  }

  function setOpen(details, open) {
    desiredOpen.set(details, open);
    const current = pending.get(details);
    const fromHeight = details.getBoundingClientRect().height;
    if (current) current.cancel();
    const summary = details.querySelector('summary');
    if (reducedMotion.matches || typeof details.animate !== 'function') {
      details.open = open;
      return;
    }
    details.open = true;
    const targetHeight = open ? summary.offsetHeight + details.querySelector('[data-step-content]').offsetHeight : summary.offsetHeight;
    const animation = animate(details, [
      { height: `${fromHeight}px`, overflow: 'hidden' },
      { height: `${targetHeight}px`, overflow: 'hidden' },
    ], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
    pending.set(details, animation);
    animation.onfinish = () => {
      details.open = open;
      pending.delete(details);
    };
  }

  // JS controls exclusivity during height transitions; native name handles no JS.
  steps.forEach((details) => {
    desiredOpen.set(details, details.open);
    details.removeAttribute('name');
  });
  steps.forEach((details) => {
    details.querySelector('summary').addEventListener('click', (event) => {
      event.preventDefault();
      const open = !desiredOpen.get(details);
      steps.forEach((other) => {
        if (other !== details && desiredOpen.get(other)) setOpen(other, false);
      });
      setOpen(details, open);
      if (open) showStage(details.dataset.processStep);
    });
  });
  showStage('capture', false);
}

// The active nav state follows actual document position, including direct hashes.
const navLinks = [...document.querySelectorAll('[data-section-link]')];
const sections = [...document.querySelectorAll('main > section[id]')];
if (navLinks.length) {
  let scheduled = false;
  function updateNavigation() {
    scheduled = false;
    const threshold = Math.min(window.innerHeight * 0.35, 220);
    let current = '';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= threshold) current = `${homePath}#${section.id}`;
    });
    navLinks.forEach((link) => {
      const destination = new URL(link.href, window.location.href);
      if (destination.pathname === window.location.pathname && !destination.hash && destination.pathname !== homePath) link.setAttribute('aria-current', 'page');
      else if (window.location.pathname === homePath && destination.pathname + destination.hash === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateNavigation);
    }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();
}

// Feedback stays beside the submitted form and preserves entered values.
function requestForm(event) {
  const element = event.detail?.elt;
  return element?.closest?.('form[data-form]') || event.target?.closest?.('form[data-form]');
}

document.body.addEventListener('htmx:beforeRequest', (event) => {
  const form = requestForm(event);
  if (!form) return;
  form.setAttribute('aria-busy', 'true');
  form.querySelectorAll('button[type="submit"]').forEach((button) => { button.disabled = true; });
});

document.body.addEventListener('htmx:afterRequest', (event) => {
  const form = requestForm(event);
  if (!form) return;
  form.removeAttribute('aria-busy');
  form.querySelectorAll('button[type="submit"]').forEach((button) => { button.disabled = false; });
});

document.body.addEventListener('htmx:afterSwap', (event) => {
  const status = event.detail?.target;
  if (status?.hasAttribute('data-status')) {
    animate(status, [{ opacity: 0.3 }, { opacity: 1 }], { duration: 200 });
  }
});

['htmx:sendError', 'htmx:timeout'].forEach((name) => {
  document.body.addEventListener(name, (event) => {
    const form = requestForm(event);
    if (!form) return;
    const status = form.querySelector('[data-status]');
    const error = document.createElement('span');
    error.className = 'error';
    error.textContent = message('Die Verbindung ist fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie an info@air2growth.com.');
    status.replaceChildren(error);
  });
});
