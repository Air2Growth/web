// Decorative video must not compete with the page's initial content.
export function scheduleHeroVideo(hero, start, environment = window) {
  const { document, navigator } = environment;
  let disposed = false;
  let started = false;
  let ready = false;
  let frame = null;
  const motion = environment.matchMedia('(prefers-reduced-motion: reduce)');
  let waitingToLeaveHero = false;
  try {
    const target = document.getElementById(decodeURIComponent(environment.location?.hash.slice(1) || ''));
    waitingToLeaveHero = Boolean(target && !hero.contains(target) && !target.contains(hero));
  } catch { /* Invalid fragments do not affect the normal poster-first start. */ }

  function allowed() {
    const connection = navigator.connection;
    return !motion.matches && !connection?.saveData
      && !['slow-2g', '2g', '3g'].includes(connection?.effectiveType);
  }

  function attemptStart() {
    if (disposed || started || !ready || document.hidden || !allowed()) return;
    // A restored/anchored page may already have scrolled past the hero.
    const bounds = hero.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= environment.innerHeight) {
      waitingToLeaveHero = false;
      return;
    }
    // Native smooth scrolling can begin after load while the hero is still visible.
    if (waitingToLeaveHero) return;
    if (frame !== null) return;
    frame = environment.requestAnimationFrame(() => {
      // Give the decoded poster and page text a paint before requesting video.
      frame = environment.requestAnimationFrame(() => {
        frame = null;
        if (disposed || started || document.hidden || !allowed()) return;
        const currentBounds = hero.getBoundingClientRect();
        if (currentBounds.bottom <= 0 || currentBounds.top >= environment.innerHeight) return;
        started = true;
        removeListeners();
        start();
      });
    });
  }

  async function pageLoaded() {
    const poster = hero.querySelector('img');
    try { await poster?.decode(); } catch { /* Video can still work if the poster fails. */ }
    ready = true;
    attemptStart();
  }

  function removeListeners() {
    environment.removeEventListener('load', pageLoaded);
    environment.removeEventListener('scroll', attemptStart);
    document.removeEventListener('visibilitychange', attemptStart);
  }

  if (document.readyState === 'complete') pageLoaded();
  else environment.addEventListener('load', pageLoaded, { once: true });
  document.addEventListener('visibilitychange', attemptStart);
  environment.addEventListener('scroll', attemptStart, { passive: true });
  return () => {
    disposed = true;
    if (frame !== null) environment.cancelAnimationFrame(frame);
    removeListeners();
  };
}
