import { localizedHref } from './locale-paths.ts';

const locale = document.documentElement.lang === 'en' ? 'en' : 'de';
const homePath = localizedHref('/', locale);

// Small, progressively enhanced interactions. All content is readable without JS.
// Preserve bookmarks when detailed product sections move off the homepage.
const movedHomeSections = {
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
