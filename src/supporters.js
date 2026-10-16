import { gsap } from 'gsap';

const PIXELS_PER_SECOND = 32;

export function initSupporters(root) {
  const viewport = root.querySelector('[data-logo-viewport]');
  const track = root.querySelector('[data-logo-track]');
  const group = root.querySelector('[data-logo-group]');
  const button = root.querySelector('[data-marquee-toggle]');
  const label = button.querySelector('[data-marquee-label]');
  const pauseIcon = button.querySelector('[data-marquee-pause]');
  const playIcon = button.querySelector('[data-marquee-play]');
  const media = gsap.matchMedia();
  let userPaused = false;

  media.add('(prefers-reduced-motion: no-preference)', () => {
    const events = new AbortController();
    const options = { signal: events.signal };
    let hovered = false;
    let visible = false;

    // One complete, identical group makes the end and start visually match.
    // Its fixed logo slots are wider than the section at every breakpoint.
    const copy = group.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.removeAttribute('aria-label');
    copy.inert = true;
    copy.dataset.logoCopy = '';
    copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
    track.append(copy);
    root.dataset.marqueeReady = '';

    const distance = group.getBoundingClientRect().width;
    const tween = gsap.fromTo(track, { x: 0 }, {
      x: -distance,
      duration: distance / PIXELS_PER_SECOND,
      ease: 'none',
      repeat: -1,
      paused: true,
    });

    function updatePlayback() {
      const running = visible && !document.hidden && !hovered && !userPaused;
      tween.paused(!running);
      root.dataset.marqueeState = running ? 'running' : 'paused';
    }

    function updateButton() {
      label.textContent = userPaused ? 'Fortsetzen' : 'Pause';
      button.setAttribute('aria-label', userPaused ? 'Logo-Animation fortsetzen' : 'Logo-Animation pausieren');
      pauseIcon.hidden = userPaused;
      playIcon.hidden = !userPaused;
    }

    button.hidden = false;
    updateButton();
    button.addEventListener('click', () => {
      userPaused = !userPaused;
      updateButton();
      updatePlayback();
    }, options);

    viewport.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      hovered = true;
      updatePlayback();
    }, options);
    viewport.addEventListener('pointerleave', () => {
      hovered = false;
      updatePlayback();
    }, options);
    document.addEventListener('visibilitychange', updatePlayback, options);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(viewport);
    updatePlayback();

    return () => {
      observer.disconnect();
      events.abort();
      copy.remove();
      button.hidden = true;
      delete root.dataset.marqueeReady;
      delete root.dataset.marqueeState;
      // matchMedia reverts the tween and its inline transform automatically.
    };
  }, root);

  return () => media.revert();
}
