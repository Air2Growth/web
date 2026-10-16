import { message } from './messages.ts';
import { scheduleHeroVideo } from './hero-loading.js';

/* Air2Growth — kleine Verhaltensschicht (kein Tracking, kein Versand).
   - Mobiles Menü: schließt per Link-Klick und Escape.
   - htmx: Server-Fehlfragmente (4xx/5xx) in der Statusregion zeigen.
   - Hero-Hintergrundvideo: Double-Buffer-Playlist (4 Clips, Endlosschleife).
     ZWEI gestapelte <video>-Elemente: aktives spielt sichtbar, Standby
     lädt NUR den nächsten Clip vor (preload auto). Übergang startet ca.
     1 s vor Ende: Standby spielt los, wartet auf echten gerenderten Frame
     (rVFC mit Fallback), wird DANN oben (z-top) 0→1 (~800 ms) eingeblendet,
     während das alte Video unten opak bleibt (kein Bild-Blitzen). Erst bei
     voller Deckung wird das alte gestoppt/resetet und als nächster Preload
     wiederverwendet. Bild (hero.webp) liegt IMMER darunter, nur für
     Initial-Load/totalen Ausfall/Reduced-Motion sichtbar. */
(function () {
  // Mobiles Vollbild-Menü: Button-Toggle steuert #mobile-menu (Overlay
  // außerhalb des transformierten Headers, fixed inset-0). Klassen
  // hidden/flex sind statisch im Markup (Tailwind-generiert), JS toggelt
  // nur hidden + aria/inert; Scroll-Lock via body.style (kein CSS nötig).
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var closeBtn = menu.querySelector('[data-nav-close]');
    var menuAnimation = null;
    var menuClosing = false;
    var menuMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var background = Array.from(document.body.children).filter(function (element) {
      return element !== menu && !['SCRIPT', 'LINK'].includes(element.tagName);
    });
    var previousInert = new Map();
    var mq = null;
    try { mq = window.matchMedia('(min-width: 1280px)'); } catch (e) { mq = null; }
    var lastFocus = null;
    var FOCUS_SEL = 'a[href], button:not([disabled])';
    function focusables() {
      return Array.prototype.slice.call(menu.querySelectorAll(FOCUS_SEL)).filter(function (el) {
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
      });
    }
    function isOpen() { return !menu.classList.contains('hidden'); }
    function applyScrollLock() {
      try { document.body.style.overflow = isOpen() ? 'hidden' : ''; } catch (e) {}
    }
    function openMenu() {
      if (isOpen() && !menuClosing) return;
      if (menuAnimation) menuAnimation.cancel();
      menuClosing = false;
      try { lastFocus = document.activeElement; } catch (e) { lastFocus = null; }
      menu.classList.remove('hidden');
      menu.setAttribute('aria-hidden', 'false');
      try { menu.inert = false; } catch (e) { try { menu.removeAttribute('inert'); } catch (e2) {} }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', message('Menü schließen'));
      background.forEach(function (element) {
        if (!previousInert.has(element)) previousInert.set(element, element.inert);
        element.inert = true;
      });
      applyScrollLock();
      if (!menuMotion.matches && typeof menu.animate === 'function') {
        menuAnimation = menu.animate(
          [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 220, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
      }
      var target = closeBtn || focusables()[0];
      if (target && target.focus) { try { target.focus(); } catch (e) {} }
    }
    function closeMenu(returnFocus) {
      if (!isOpen()) { applyScrollLock(); return; }
      if (menuClosing) return;
      menuClosing = true;
      if (menuAnimation) menuAnimation.cancel();
      function finishClose() {
        menu.classList.add('hidden');
        menu.setAttribute('aria-hidden', 'true');
        menu.inert = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', message('Menü öffnen'));
        previousInert.forEach(function (inert, element) { element.inert = inert; });
        previousInert.clear();
        menuClosing = false;
        applyScrollLock();
        if (returnFocus && typeof returnFocus.focus === 'function') {
          returnFocus.setAttribute('tabindex', '-1');
          returnFocus.focus({ preventScroll: true });
          returnFocus.addEventListener('blur', function () { returnFocus.removeAttribute('tabindex'); }, { once: true });
        } else if (returnFocus !== false && toggle.focus) {
          toggle.focus({ preventScroll: true });
        }
      }
      if (!menuMotion.matches && typeof menu.animate === 'function' && !(mq && mq.matches)) {
        menuAnimation = menu.animate(
          [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }],
          { duration: 160, easing: 'ease-out' }
        );
        menuAnimation.onfinish = finishClose;
      } else {
        finishClose();
      }
    }
    toggle.addEventListener('click', function () {
      if (isOpen()) closeMenu(true);
      else openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', function () { closeMenu(true); });
    menu.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function () {
        var url = new URL(link.href, location.href);
        var destination = url.origin === location.origin && url.pathname === location.pathname && url.hash
          ? document.getElementById(url.hash.slice(1)) : null;
        closeMenu(destination || false);
      });
    });
    document.addEventListener('keydown', function (event) {
      if (!isOpen()) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key === 'Tab') {
        var items = focusables();
        if (items.length === 0) { event.preventDefault(); return; }
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          try { last.focus(); } catch (e) {}
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          try { first.focus(); } catch (e) {}
        }
      }
    });
    function handleBreakpoint() {
      var desktop = false;
      try { desktop = !!(mq && mq.matches); } catch (e) {}
      if (desktop && isOpen()) closeMenu(false);
    }
    if (mq) {
      try {
        if (typeof mq.addEventListener === 'function') mq.addEventListener('change', handleBreakpoint);
        else if (typeof mq.addListener === 'function') mq.addListener(handleBreakpoint);
      } catch (e) {}
    }
    menuMotion.addEventListener('change', function (event) {
      if (event.matches && menuAnimation && menuAnimation.playState === 'running') menuAnimation.finish();
    });
    try { window.addEventListener('resize', handleBreakpoint); } catch (e) {}
  }

  // Expected validation errors use the server's specific field guidance.
  document.body.addEventListener('htmx:beforeSwap', function (event) {
    var detail = event.detail;
    if (detail && detail.target && detail.target.hasAttribute('data-status') &&
        detail.xhr && [400, 422].includes(detail.xhr.status)) {
      detail.shouldSwap = true;
      detail.isError = false;
    }
  });

  // htmx: Server-Fehlfragmente (4xx/5xx) sichtbar in der Statusregion zeigen.
  document.body.addEventListener('htmx:responseError', function (event) {
    var target = event.detail && event.detail.target;
    if (target && (target.hasAttribute('data-status') || (target.classList && target.classList.contains('form-status')))) {
      var status = event.detail.xhr ? event.detail.xhr.status : '?';
      var error = document.createElement('span');
      error.className = 'error';
      error.textContent = message('Die Anfrage konnte nicht verarbeitet werden ({status}). Bitte versuchen Sie es erneut oder schreiben Sie an info@air2growth.com.', { status });
      target.replaceChildren(error);
    }
  });

  // --- Hero-Hintergrundvideo: Double-Buffer (dekorativ, stumm, Loop) ---
  var videos = Array.prototype.slice.call(document.querySelectorAll('[data-hero-video]'));
  if (videos.length === 0) return;
  var firstVideo = videos[0];
  var hero = firstVideo.closest('[data-hero]') || firstVideo.parentElement;
  var control = document.querySelector('[data-hero-toggle]');
  var controlLabel = control ? control.querySelector('[data-hero-toggle-label]') : null;
  var controlIcon = control ? control.querySelector('[data-hero-toggle-icon]') : null;

  var playlistAttr =
    (hero && hero.getAttribute('data-playlist')) ||
    firstVideo.getAttribute('data-playlist') ||
    '';
  var playlist = playlistAttr
    .split(/\s+/)
    .filter(Boolean);
  if (playlist.length === 0) {
    playlist = ['video/1.mp4', 'video/2.mp4', 'video/3.mp4', 'video/4.mp4'];
  }

  // Ein-Video-Fallback (sollte nicht vorkommen, robust halten).
  var useDouble = videos.length >= 2;
  var active = videos[0];
  var standby = useDouble ? videos[1] : videos[0];

  function setHeroState(state) {
    try {
      if (hero && hero.setAttribute) hero.setAttribute('data-video-state', state);
      videos.forEach(function (v) {
        try { v.setAttribute('data-video-state', state); } catch (e) {}
      });
    } catch (e) {}
  }

  function setVisible(el, visible) {
    try { el.setAttribute('data-visible', visible ? 'true' : 'false'); } catch (e) {}
  }

  function setLayerTop(el, isTop) {
    try { el.setAttribute('data-layer', isTop ? 'top' : 'bottom'); } catch (e) {}
  }

  function showControl(show) {
    if (!control) return;
    // "hidden" gewinnt gegen "flex" im generierten CSS.
    if (show) control.classList.remove('hidden');
    else control.classList.add('hidden');
  }

  function setControlPlaying(playing) {
    if (!control) return;
    control.setAttribute('aria-pressed', playing ? 'false' : 'true');
    control.setAttribute(
      'aria-label',
      message(playing ? 'Hintergrundvideo pausieren' : 'Hintergrundvideo abspielen')
    );
    if (controlLabel) controlLabel.textContent = message(playing ? 'Pause' : 'Play');
    if (controlIcon) controlIcon.textContent = playing ? '\u275A\u275A' : '\u25B6';
  }

  // Reduzierte Bewegung / Datensparmodus: KEINE Quelle setzen, kein Fetch.
  var reduceQuery = null;
  try {
    reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  } catch (e) {
    reduceQuery = null;
  }
  var saveData = !!(
    typeof navigator !== 'undefined' &&
    navigator.connection &&
    navigator.connection.saveData
  );
  if ((reduceQuery && reduceQuery.matches) || saveData) {
    setHeroState('fallback');
    videos.forEach(function (v) {
      setVisible(v, false);
      setLayerTop(v, false);
    });
    showControl(false);
    return;
  }

  var LEAD = 1.0; // s vor Ende: Übergang einleiten (700–1000-ms-Fade deckt Ende ab)
  var FADE_MS = 800; // Tailwind duration-[800ms] im Markup
  var FRAME_TIMEOUT = 4000; // max. Warten auf ersten Standby-Frame
  var RETRY_DELAY = 150;

  var currentIndex = 0;
  var nextIndex = playlist.length > 1 ? 1 : 0;
  var standbySrcIndex = -1;
  var userPaused = false;
  var gaveUp = false; // initial: alle Clips fehlgeschlagen -> Bild
  var stuck = false; // nach Start: alle Nächsten fehlgeschlagen -> letzten Frame halten
  var hasEverPlayed = false;
  var playToken = 0; // invalidiert Racing-Events / Play-Rejects
  var transitionState = 'idle'; // idle | waiting-frame | fading
  var wasPlayingBeforeHide = false;
  var initialFailures = 0;
  var standbyFailures = 0;
  var lastInitialFailedSrc = '';
  var lastStandbyFailedKey = '';

  function pauseEl(el) {
    try { el.pause(); } catch (e) {}
  }

  function clearEl(el) {
    try { el.removeAttribute('src'); } catch (e) {}
    try { el.load(); } catch (e) {}
    setVisible(el, false);
    try { el.setAttribute('data-video-state', 'idle'); } catch (e) {}
  }

  function giveUpToFallbackInitial() {
    gaveUp = true;
    transitionState = 'idle';
    playToken += 1;
    videos.forEach(function (v) {
      pauseEl(v);
      clearEl(v);
      setLayerTop(v, false);
    });
    setHeroState('fallback');
    showControl(false);
  }

  function holdLastFrame() {
    // Nach erfolgreichem Start: alten sichtbaren Frame halten, Bild NICHT zeigen.
    stuck = true;
    transitionState = 'idle';
    pauseEl(standby);
    setVisible(standby, false);
    setLayerTop(standby, false);
    try { standby.removeAttribute('src'); } catch (e) {}
    try { standby.load(); } catch (e) {}
    // Aktives bleibt opak sichtbar (letzter Frame), Control bleibt nutzbar.
    setVisible(active, true);
    setHeroState('playing');
    showControl(true);
    if (!userPaused) setControlPlaying(true);
  }

  function waitForFirstFrame(video, token) {
    return new Promise(function (resolve) {
      if (token !== playToken) { resolve(false); return; }
      var done = false;
      function finish(ok) {
        if (done) return;
        done = true;
        resolve(!!ok && token === playToken);
      }
      function onPlaying() {
        try {
          if (typeof video.requestVideoFrameCallback === 'function') {
            var settled = false;
            try {
              video.requestVideoFrameCallback(function () {
                if (!settled) { settled = true; finish(true); }
              });
            } catch (e) {
              finish(true);
              return;
            }
            // Sane Fallback, falls rVFC nie feuert (sofort pausiert o. ä.).
            setTimeout(function () {
              if (!settled) { settled = true; finish(video.readyState >= 2); }
            }, 600);
          } else if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(function () {
              requestAnimationFrame(function () { finish(video.readyState >= 2); });
            });
            setTimeout(function () { finish(video.readyState >= 2); }, 600);
          } else {
            setTimeout(function () { finish(video.readyState >= 2); }, 300);
          }
        } catch (e) {
          finish(video.readyState >= 2);
        }
      }
      try {
        video.addEventListener('playing', onPlaying, { once: true });
      } catch (e) {
        try { video.addEventListener('playing', onPlaying); } catch (e2) {}
      }
      // Falls bereits spielend (Race), sofort auslösen.
      try {
        if (!video.paused && video.readyState >= 2) onPlaying();
      } catch (e) {}
      setTimeout(function () {
        try {
          finish(video.readyState >= 2 && !video.error);
        } catch (e) {
          finish(false);
        }
      }, FRAME_TIMEOUT);
    });
  }

  function preloadNext() {
    if (!useDouble) return;
    if (gaveUp || stuck) return;
    if (userPaused) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    if (playlist.length < 2) return;
    var want = playlist[nextIndex];
    var cur = '';
    try { cur = standby.getAttribute('src') || ''; } catch (e) { cur = ''; }
    if (cur === want && standbySrcIndex === nextIndex) return;
    try {
      pauseEl(standby);
      standby.muted = true;
      standby.src = want;
      try { standby.load(); } catch (e) {}
      standbySrcIndex = nextIndex;
      // Unsichtbar unten parken, bis echter Frame + Fade ihn nach oben holt.
      // (Falls gerade fading/waiting, nicht anfassen.)
      if (transitionState === 'idle') {
        setVisible(standby, false);
        setLayerTop(standby, false);
      }
    } catch (e) {}
  }

  function handleInitialFailure(token) {
    if (token !== playToken) return;
    var failedSrc = '';
    try { failedSrc = active.getAttribute('src') || active.currentSrc || ''; } catch (e) {}
    // reject+error feuern oft doppelt für dieselbe Quelle -> nur einmal zählen.
    if (failedSrc && failedSrc === lastInitialFailedSrc) return;
    if (failedSrc) lastInitialFailedSrc = failedSrc;
    playToken += 1; // zweite Race-Events (reject+error) für dieselbe Quelle entwerten
    initialFailures += 1;
    if (initialFailures >= playlist.length) {
      giveUpToFallbackInitial();
      return;
    }
    currentIndex = (currentIndex + 1) % playlist.length;
    nextIndex = (currentIndex + 1) % playlist.length;
    try { active.removeAttribute('src'); } catch (e) {}
    try { active.load(); } catch (e) {}
    setTimeout(function () { loadInitial(); }, RETRY_DELAY);
  }

  function handleStandbyFailure(token, failedIndex) {
    if (token !== playToken) return;
    var key = token + ':' + failedIndex;
    // play-Reject + error + Frame-Timeout feuern oft mehrfach für denselben
    // defekten Clip im selben Übergang -> nur einmal zählen/weiterschalten.
    if (key === lastStandbyFailedKey) return;
    lastStandbyFailedKey = key;
    standbyFailures += 1;
    if (standbyFailures >= playlist.length) {
      if (!hasEverPlayed) {
        giveUpToFallbackInitial();
      } else {
        holdLastFrame();
      }
      return;
    }
    nextIndex = (failedIndex + 1) % playlist.length;
    try { standby.pause(); } catch (e) {}
    try { standby.removeAttribute('src'); } catch (e) {}
    try { standby.load(); } catch (e) {}
    standbySrcIndex = -1;
    setVisible(standby, false);
    // Alten Frame NICHT anfassen (bleibt opak sichtbar).
    transitionState = 'idle';
    preloadNext();
    // Falls aktiv bereits zu Ende / kurz vor Ende: begrenzt sofort nächsten Kandidaten versuchen.
    var shouldRetry = false;
    try {
      if (active.ended) shouldRetry = true;
      else if (isFinite(active.duration) && isFinite(active.currentTime)) {
        if (active.duration - active.currentTime <= LEAD + 0.2) shouldRetry = true;
      }
    } catch (e) {}
    if (shouldRetry && !userPaused && !gaveUp && !stuck) {
      var t = playToken;
      setTimeout(function () {
        if (t !== playToken) return;
        if (transitionState !== 'idle') return;
        startTransition();
      }, RETRY_DELAY);
    }
  }

  function doFade(token, wantIndex) {
    if (token !== playToken) return;
    if (gaveUp) return;
    if (userPaused) {
      // Pause während Warten: Standby pausiert gepuffert halten, kein Fade, kein Resume.
      pauseEl(standby);
      transitionState = 'idle';
      return;
    }
    if (typeof document !== 'undefined' && document.hidden) {
      pauseEl(standby);
      transitionState = 'idle';
      return;
    }
    transitionState = 'fading';
    // Alt bleibt unten opak, Neu kommt oben transparent -> dann 0→1.
    setLayerTop(active, false);
    setVisible(active, true);
    setLayerTop(standby, true);
    setVisible(standby, false);
    var runFade = function () {
      if (token !== playToken) return;
      if (userPaused) {
        // Pause genau im Fade-Fenster: beide pausieren, visuellen Fade trotzdem
        // vollenden (gepauster Erstframe oben), danach Swap ohne Resume.
        pauseEl(active);
        pauseEl(standby);
      }
      if (typeof document !== 'undefined' && document.hidden) {
        pauseEl(active);
        pauseEl(standby);
      }
      setVisible(standby, true);
      try { standby.setAttribute('data-video-state', 'playing'); } catch (e) {}
      var completed = false;
      function complete() {
        if (completed) return;
        completed = true;
        if (token !== playToken) return;
        var oldActive = active;
        pauseEl(oldActive);
        setVisible(oldActive, false);
        setLayerTop(oldActive, false);
        try { oldActive.removeAttribute('src'); } catch (e) {}
        try { oldActive.load(); } catch (e) {}
        try { oldActive.setAttribute('data-video-state', 'idle'); } catch (e) {}
        // Rollen tauschen: eingehendes wird aktiv, altes wird Standby-Preload.
        active = standby;
        standby = oldActive;
        standbySrcIndex = -1;
        currentIndex = wantIndex;
        nextIndex = (currentIndex + 1) % playlist.length;
        standbyFailures = 0;
        transitionState = 'idle';
        hasEverPlayed = true;
        setHeroState('playing');
        showControl(true);
        if (userPaused) {
          pauseEl(active);
          setControlPlaying(false);
        } else if (typeof document !== 'undefined' && document.hidden) {
          pauseEl(active);
          // Control bleibt auf Pause-Symbol? Nein: versteckter Tab pausiert
          // temporär, Intent bleibt "spielend". Anzeige konsistent halten:
          setControlPlaying(true);
        } else {
          setControlPlaying(true);
          if (active.paused) {
            try {
              var pp = active.play();
              if (pp && typeof pp.catch === 'function') pp.catch(function () {});
            } catch (e) {}
          }
        }
        preloadNext();
      }
      try {
        var onEnd = function (ev) {
          if (ev && ev.target !== standby) return;
          try { standby.removeEventListener('transitionend', onEnd); } catch (e) {}
          complete();
        };
        standby.addEventListener('transitionend', onEnd);
        setTimeout(function () {
          try { standby.removeEventListener('transitionend', onEnd); } catch (e) {}
          complete();
        }, FADE_MS + 150);
      } catch (e) {
        setTimeout(complete, FADE_MS + 150);
      }
    };
    try {
      void standby.offsetWidth;
    } catch (e) {}
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () { runFade(); });
    } else {
      setTimeout(runFade, 16);
    }
  }

  function startTransition() {
    if (!useDouble) return;
    if (gaveUp || stuck || userPaused) return;
    if (transitionState === 'waiting-frame' || transitionState === 'fading') return;
    if (typeof document !== 'undefined' && document.hidden) return;
    if (playlist.length < 2) return;
    transitionState = 'waiting-frame';
    playToken += 1;
    var token = playToken;
    var wantIndex = nextIndex;
    var wantSrc = playlist[wantIndex];
    try {
      var cur = '';
      try { cur = standby.getAttribute('src') || ''; } catch (e) {}
      if (cur !== wantSrc || standbySrcIndex !== wantIndex) {
        try { standby.pause(); } catch (e) {}
        standby.muted = true;
        standby.src = wantSrc;
        try { standby.load(); } catch (e) {}
        standbySrcIndex = wantIndex;
      } else {
        standby.muted = true;
      }
      // Standby oben parken, aber unsichtbar bis echter Frame.
      setLayerTop(active, false);
      setVisible(active, true);
      setLayerTop(standby, true);
      setVisible(standby, false);
      var p = null;
      try {
        p = standby.play();
      } catch (err) {
        handleStandbyFailure(token, wantIndex);
        return;
      }
      if (p && typeof p.catch === 'function') {
        p.catch(function () {
          if (token === playToken) handleStandbyFailure(token, wantIndex);
        });
      }
      waitForFirstFrame(standby, token).then(function (ok) {
        if (token !== playToken) return;
        if (!ok) {
          handleStandbyFailure(token, wantIndex);
          return;
        }
        doFade(token, wantIndex);
      });
    } catch (e) {
      handleStandbyFailure(token, wantIndex);
    }
  }

  function loadInitial() {
    if (gaveUp || userPaused) return;
    playToken += 1;
    var token = playToken;
    var src = playlist[currentIndex];
    try {
      active.muted = true;
      // Falls Double-Buffer: saubere Start-Layer.
      if (useDouble) {
        setLayerTop(active, true);
        setLayerTop(standby, false);
        setVisible(standby, false);
      }
      setVisible(active, false);
      active.src = src;
      try { active.load(); } catch (e) {}
      var p = null;
      try {
        p = active.play();
      } catch (err) {
        handleInitialFailure(token);
        return;
      }
      if (p && typeof p.catch === 'function') {
        p.catch(function () {
          if (token === playToken) handleInitialFailure(token);
        });
      }
      waitForFirstFrame(active, token).then(function (ok) {
        if (token !== playToken) return;
        if (!ok) {
          handleInitialFailure(token);
          return;
        }
        if (userPaused || gaveUp) {
          pauseEl(active);
          return;
        }
        if (typeof document !== 'undefined' && document.hidden) {
          pauseEl(active);
          wasPlayingBeforeHide = true;
          return;
        }
        initialFailures = 0;
        standbyFailures = 0;
        lastInitialFailedSrc = '';
        hasEverPlayed = true;
        setVisible(active, true);
        if (useDouble) setLayerTop(active, true);
        try { active.setAttribute('data-video-state', 'playing'); } catch (e) {}
        setHeroState('playing');
        showControl(true);
        setControlPlaying(true);
        if (useDouble) {
          nextIndex = (currentIndex + 1) % playlist.length;
          preloadNext();
        } else {
          // Ein-Video-Betrieb: simple Schleife.
          nextIndex = (currentIndex + 1) % playlist.length;
        }
      });
    } catch (e) {
      handleInitialFailure(token);
    }
  }

  function loadSingleNext() {
    // Nur Ein-Video-Fallback (kein Double-Buffer).
    if (gaveUp || userPaused) return;
    playToken += 1;
    var token = playToken;
    try {
      active.src = playlist[currentIndex];
      active.load();
    } catch (e) {
      if (token === playToken) {
        initialFailures += 1;
        if (initialFailures >= playlist.length) giveUpToFallbackInitial();
        else {
          currentIndex = (currentIndex + 1) % playlist.length;
          loadSingleNext();
        }
      }
      return;
    }
    var r = null;
    try {
      active.muted = true;
      r = active.play();
    } catch (err) {
      if (token === playToken) {
        initialFailures += 1;
        if (initialFailures >= playlist.length) giveUpToFallbackInitial();
        else {
          currentIndex = (currentIndex + 1) % playlist.length;
          loadSingleNext();
        }
      }
      return;
    }
    if (r && typeof r.catch === 'function') {
      r.catch(function () {
        if (token !== playToken) return;
        initialFailures += 1;
        if (initialFailures >= playlist.length) giveUpToFallbackInitial();
        else {
          currentIndex = (currentIndex + 1) % playlist.length;
          loadSingleNext();
        }
      });
    }
  }

  function isActiveTarget(ev) {
    try {
      return ev && ev.target === active;
    } catch (e) {
      return false;
    }
  }

  function isStandbyTarget(ev) {
    try {
      return useDouble && ev && ev.target === standby;
    } catch (e) {
      return false;
    }
  }

  videos.forEach(function (v) {
    try { v.muted = true; } catch (e) {}
    // Nur echte Fehler behandeln. stalled/waiting/suspend sind Pufferzustände.
    v.addEventListener('error', function (ev) {
      if (gaveUp) return;
      if (!useDouble) {
        if (ev.target !== active) return;
        playToken += 1;
        var t = playToken;
        initialFailures += 1;
        if (!hasEverPlayed && initialFailures >= playlist.length) {
          giveUpToFallbackInitial();
          return;
        }
        if (initialFailures >= playlist.length * 2) {
          if (!hasEverPlayed) giveUpToFallbackInitial();
          return;
        }
        currentIndex = (currentIndex + 1) % playlist.length;
        setTimeout(function () {
          if (t !== playToken) return;
          loadSingleNext();
        }, RETRY_DELAY);
        return;
      }
      if (isStandbyTarget(ev)) {
        // Standby-Preload/Transition-Fehler: begrenzt skippen, Aktives bleibt bedeckt.
        // Dedup (Reject+Error+Timeout) via Token:Index-Schlüssel im Handler.
        var failed = standbySrcIndex >= 0 ? standbySrcIndex : nextIndex;
        handleStandbyFailure(playToken, failed);
        return;
      }
      if (isActiveTarget(ev)) {
        if (!hasEverPlayed) {
          // Initial: begrenzt nächsten Clip versuchen (Dedup via Quelle im Handler).
          handleInitialFailure(playToken);
          return;
        }
        // Aktives scheitert nach Start: nicht aufdecken, Übergang zum Standby versuchen.
        if (transitionState === 'idle' && !userPaused && !stuck) {
          startTransition();
        }
      }
    });

    v.addEventListener('timeupdate', function () {
      if (!useDouble) return;
      if (v !== active) return;
      if (transitionState !== 'idle') return;
      if (gaveUp || stuck || userPaused) return;
      if (typeof document !== 'undefined' && document.hidden) return;
      var d = NaN;
      var t = NaN;
      try {
        d = v.duration;
        t = v.currentTime;
      } catch (e) { return; }
      if (!isFinite(d) || !isFinite(t) || d <= 0) return;
      if (t < 1.0) return; // sehr kurze Clips nicht sofort überblenden
      if (d - t <= LEAD && d - t > 0) startTransition();
    });

    v.addEventListener('ended', function () {
      if (gaveUp || userPaused) return;
      if (!useDouble) {
        // Ein-Video-Loop.
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSingleNext();
        return;
      }
      if (v !== active) return;
      if (transitionState === 'fading') {
        // Altes endet unter bereits opaker werdender neuer Ebene: Fade darf vollenden.
        return;
      }
      if (transitionState === 'waiting-frame') {
        // Wartet bereits auf Standby-Frame: letzten Frame halten, kein Reset.
        return;
      }
      // Aktiv zu Ende, Ersatz noch nicht bereit: letzten Frame halten
      // (Video bleibt sichtbar, kein Hide/Reset), Übergang einleiten.
      startTransition();
    });

    // playing: nur für initiales Anzeigen + Control; Übergänge steuert rVFC/Fade.
    // Keine Auto-Skips bei Pufferzuständen.
  });

  if (control) {
    control.addEventListener('click', function () {
      if (userPaused) {
        userPaused = false;
        setControlPlaying(true);
        if (gaveUp) {
          gaveUp = false;
          stuck = false;
          hasEverPlayed = false;
          initialFailures = 0;
          standbyFailures = 0;
          lastInitialFailedSrc = '';
          lastStandbyFailedKey = '';
          transitionState = 'idle';
          currentIndex = 0;
          nextIndex = playlist.length > 1 ? 1 : 0;
          // Rollen zurücksetzen.
          active = videos[0];
          standby = useDouble ? videos[1] : videos[0];
          standbySrcIndex = -1;
          try { standby.removeAttribute('src'); } catch (e) {}
          try { standby.load(); } catch (e) {}
          setHeroState('idle');
          loadInitial();
          return;
        }
        if (stuck) {
          // Nach Halten: erneut nächsten Kandidaten versuchen.
          stuck = false;
          standbyFailures = 0;
          transitionState = 'idle';
          if (active.ended) {
            startTransition();
          } else {
            try {
              var pr = active.play();
              if (pr && typeof pr.catch === 'function') pr.catch(function () {});
            } catch (e) {}
            preloadNext();
          }
          return;
        }
        if (!useDouble) {
          if (!active.currentSrc && !active.getAttribute('src')) {
            loadSingleNext();
            return;
          }
          try {
            var s = active.play();
            if (s && typeof s.catch === 'function') s.catch(function () {});
          } catch (e) {}
          return;
        }
        // Double-Buffer-Resume: nur intendiertes Element fortsetzen.
        if (transitionState === 'fading') {
          // Fade läuft (beide pausiert): eingehendes (standby=top) ist Intent.
          // Fade-Timeout vollendet Swap auch pausiert; hier beide pausiert lassen
          // und Intent nach Swap erneut abspielen? Nein: user hat gerade Play
          // gedrückt -> Intent soll spielen. Da Swap noch aussteht, beide
          // anstoßen; complete() pausiert bei userPaused=false nicht.
          // userPaused ist jetzt false, also Fade darf spielend vollenden:
          try {
            var a1 = active.play();
            if (a1 && typeof a1.catch === 'function') a1.catch(function () {});
          } catch (e) {}
          try {
            var s1 = standby.play();
            if (s1 && typeof s1.catch === 'function') s1.catch(function () {});
          } catch (e) {}
          return;
        }
        if (active.ended) {
          // Gehaltenes Endbild: nächsten Clip einleiten statt alten zu wiederholen.
          if (transitionState === 'idle') startTransition();
          return;
        }
        try {
          var p2 = active.play();
          if (p2 && typeof p2.catch === 'function') p2.catch(function () {});
        } catch (e) {}
        // Standby bleibt gepuffert pausiert, bis Nahtstelle ihn braucht.
        preloadNext();
      } else {
        userPaused = true;
        pauseEl(active);
        if (useDouble) pauseEl(standby);
        setControlPlaying(false);
        // Kein Token-Bump: laufender Fade vollendet visuell (beide pausiert),
        // wartender Frame bricht via userPaused-Check ab (kein spontanes Resume).
      }
    });
  }

  // Tab im Hintergrund: beide pausieren, bei Rückkehr nur intendiertes fortsetzen.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      var anyPlaying = false;
      try {
        anyPlaying = !active.paused || (useDouble && !standby.paused);
      } catch (e) { anyPlaying = false; }
      wasPlayingBeforeHide = anyPlaying && !userPaused && !gaveUp;
      pauseEl(active);
      if (useDouble) pauseEl(standby);
    } else if (wasPlayingBeforeHide && !userPaused && !gaveUp) {
      wasPlayingBeforeHide = false;
      if (!useDouble) {
        try {
          var q = active.play();
          if (q && typeof q.catch === 'function') q.catch(function () {});
        } catch (e) {}
        return;
      }
      if (stuck) return; // gehaltenes Endbild bleibt, kein Auto-Resume-Loop
      if (transitionState === 'fading') {
        // Fade lief im Hidden-Tab visuell zu Ende (Swap mit Pause vollzogen):
        // nur aktuelles Intent-Element fortsetzen.
        try {
          if (active.ended) {
            if (!stuck) startTransition();
          } else {
            var r = active.play();
            if (r && typeof r.catch === 'function') r.catch(function () {});
          }
        } catch (e) {}
        return;
      }
      if (transitionState === 'waiting-frame') {
        // Standby wartete: neu einleiten (alter Token läuft ins Leere via Pause).
        transitionState = 'idle';
        if (active.ended) {
          startTransition();
        } else {
          try {
            var p3 = active.play();
            if (p3 && typeof p3.catch === 'function') p3.catch(function () {});
          } catch (e) {}
        }
        return;
      }
      if (active.ended) {
        startTransition();
      } else {
        try {
          var p4 = active.play();
          if (p4 && typeof p4.catch === 'function') p4.catch(function () {});
        } catch (e) {}
      }
    }
  });

  // Wechsel zu Reduced-Motion zur Laufzeit: stoppen, Bild zeigen.
  if (reduceQuery && typeof reduceQuery.addEventListener === 'function') {
    reduceQuery.addEventListener('change', function (event) {
      if (event.matches) {
        userPaused = true;
        playToken += 1;
        transitionState = 'idle';
        pauseEl(active);
        if (useDouble) pauseEl(standby);
        setHeroState('fallback');
        videos.forEach(function (v) {
          setVisible(v, false);
          setLayerTop(v, false);
        });
        showControl(false);
        setControlPlaying(false);
      }
    });
  }

  // Test-Hooks (kein UI-Einfluss): deterministische Prüfungen ohne Netzwerk-Raten.
  try {
    window.__heroVideo = {
      get active() { return active; },
      get standby() { return useDouble ? standby : null; },
      get state() { return transitionState; },
      get currentIndex() { return currentIndex; },
      get nextIndex() { return nextIndex; },
      startTransition: startTransition
    };
  } catch (e) {}

  setHeroState('idle');
  const cancelHeroStart = scheduleHeroVideo(hero, function () {
    if (!useDouble) loadSingleNext();
    else loadInitial();
  });
  if (import.meta.hot) import.meta.hot.dispose(cancelHeroStart);
})();
