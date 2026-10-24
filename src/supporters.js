export function initSupporters(root) {
  const viewport = root.querySelector('[data-logo-viewport]');
  const group = root.querySelector('[data-logo-group]');
  const controls = root.querySelector('[data-supporter-controls]');
  const previous = root.querySelector('[data-supporter-previous]');
  const next = root.querySelector('[data-supporter-next]');
  if (!viewport || !group || !controls || !previous || !next) return () => {};

  const events = new AbortController();
  const options = { signal: events.signal };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  function updateControls() {
    frame = 0;
    const maximum = viewport.scrollWidth - viewport.clientWidth;
    controls.hidden = maximum <= 2;
    previous.disabled = viewport.scrollLeft <= 2;
    next.disabled = viewport.scrollLeft >= maximum - 2;
  }

  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(updateControls);
  }

  function move(direction) {
    viewport.scrollBy({
      left: direction * Math.max(viewport.clientWidth * 0.75, 200),
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  }

  previous.addEventListener('click', () => move(-1), options);
  next.addEventListener('click', () => move(1), options);
  viewport.addEventListener('scroll', scheduleUpdate, { ...options, passive: true });
  viewport.addEventListener('keydown', (event) => {
    if (event.target !== viewport || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      viewport.scrollTo({
        left: event.key === 'Home' ? 0 : viewport.scrollWidth,
        behavior: reducedMotion.matches ? 'instant' : 'smooth',
      });
    }
  }, options);

  // Native scrolling and linked logos work independently of this enhancement.
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleUpdate) : null;
  observer?.observe(viewport);
  observer?.observe(group);
  window.addEventListener('resize', scheduleUpdate, options);
  updateControls();

  return () => {
    events.abort();
    observer?.disconnect();
    cancelAnimationFrame(frame);
    controls.hidden = true;
  };
}
