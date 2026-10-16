import { gsap } from "gsap";
import { message } from "./messages.ts";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const TOUR_DURATION = 60;
// Absolute seconds include transitions and holds. The scroll driver, scene
// announcements, reduced-motion stills and progress all use this manifest.
export const TOUR_SCENES = Object.freeze([
  { id: "order", start: 0, end: 6, still: 3, title: "Order your Air2Growth" },
  { id: "delivery", start: 6, end: 14, still: 10, title: "Delivered by our team" },
  { id: "installation", start: 14, end: 22, still: 19, title: "Installed by Air2Growth" },
  { id: "process", start: 22, end: 39, still: 36, title: "From air to liquid fertiliser" },
  { id: "touchscreen", start: 39, end: 46, still: 43, title: "Check the integrated touchscreen" },
  { id: "fault", start: 46, end: 51, still: 49, title: "Faults reach our support team" },
  { id: "maintenance", start: 51, end: 57, still: 55, title: "Stay informed during maintenance" },
  { id: "closing", start: 57, end: TOUR_DURATION, still: TOUR_DURATION, title: "From carbon to crop" },
]);

const clamp = (value) => Math.max(0, Math.min(1, value));
const monitoringStart = TOUR_SCENES.find((scene) => scene.id === "fault").start;
export function formatTourTime(seconds) {
  const whole = Math.floor(seconds + 1e-6);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
export function sceneAt(time) {
  const index = TOUR_SCENES.findIndex((scene) => time < scene.end);
  return index < 0 ? TOUR_SCENES.length - 1 : index;
}

function buildTimeline(root, isMobile) {
  const q = (name) => root.querySelectorAll(`[data-art="${name}"]`);
  const theme = getComputedStyle(root);
  const color = (name) => theme.getPropertyValue(`--color-${name}`).trim();
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", duration: .6 } });
  const show = (name, at, duration = .4) => tl.to(q(name), { autoAlpha: 1, duration }, at);
  const hide = (name, at, duration = .4) => tl.to(q(name), { autoAlpha: 0, duration }, at);
  TOUR_SCENES.forEach((scene) => tl.addLabel(scene.id, scene.start));
  tl.set(root.querySelectorAll(".tour-initial-hidden"), { autoAlpha: 0 }, 0);
  // Establish the camera pivot once. Reapplying svgOrigin after a pan would
  // convert it through the transformed world and leave a residual offset.
  tl.set(q("world"), { svgOrigin: "575 480", smoothOrigin: false, x: 0, y: 0, scale: 1 }, 0);
  tl.set(q("machine"), { autoAlpha: 0 }, 0);
  tl.set(q("customer"), { x: -50 }, 0);
  tl.set(q("van"), { x: -125 }, 0);
  tl.set([q("co2-in"), q("co2-release"), q("culture-bubbles"), q("harvest-flow")], { autoAlpha: 0 }, 0);
  tl.set(q("culture"), { fill: color("sage"), scaleY: .45, transformOrigin: "center bottom" }, 0);

  // A little atmosphere, entirely determined by the same reversible clock.
  tl.to(q("clouds"), { x: 26, duration: TOUR_DURATION, ease: "none" }, 0);
  tl.to(q("glass-shine"), { autoAlpha: .45, duration: 6, repeat: 3, yoyo: true, ease: "sine.inOut" }, "process");

  show("order", "order", .5);
  hide("customer-rest-arm", "order", 0);
  tl.fromTo(q("order-hand"), { x: 6, y: 4 }, { x: -5, y: 0, duration: .9, immediateRender: false }, "order+=1.2");
  tl.to(q("customer-eyes"), { scaleY: .1, transformOrigin: "center", duration: .1, repeat: 1, yoyo: true }, "order+=2.1");
  show("confirmation", "order+=2.5", .35);
  tl.fromTo(q("confirmation"), { scale: .92 }, { scale: 1, transformOrigin: "center", duration: .5, immediateRender: false }, "order+=2.5");
  tl.to(q("order-hand"), { x: 3, y: 8, duration: .7 }, "order+=3.3");
  tl.to(q("confirmation"), { x: -43, y: 122, scale: .7, transformOrigin: "center", duration: .75 }, "order+=5");
  hide("order", "delivery-=.5");
  show("customer-rest-arm", "delivery-=.4", .1);
  show("crate", "delivery-=.4"); show("packer", "delivery-=.2");
  tl.to(q("customer"), { x: 380, duration: .7 }, "delivery-=.5");
  tl.set(q("employee"), { x: -390 }, "delivery-=.2");
  show("employee", "delivery");
  tl.to(q("packer-arm"), { rotation: -20, svgOrigin: "170 414", duration: .45, repeat: 1, yoyo: true }, "delivery+=.2");
  hide("confirmation", "delivery+=.3");
  show("van", "delivery+=.6");
  tl.fromTo(q("van-door"), { scaleX: .2 }, { scaleX: 1, transformOrigin: "left center", duration: .65, immediateRender: false }, "delivery+=.7");
  tl.to(q("crate"), { x: 45, y: -4, duration: .8 }, "delivery+=.6");
  hide("crate", "delivery+=1.1"); hide("packer", "delivery+=1.5"); hide("employee", "delivery+=1.5");
  tl.fromTo(q("van"), { x: -125 }, { x: 310, duration: 3.8, ease: "power1.inOut", immediateRender: false }, "delivery+=2");
  tl.to(q("wheel"), { rotation: 720, transformOrigin: "50% 50%", duration: 3.8, ease: "none" }, "delivery+=2");
  tl.to(q("van"), { y: -1.4, duration: .32, repeat: 9, yoyo: true, ease: "sine.inOut" }, "delivery+=2.3");
  tl.to(q("landscape"), { x: -30, duration: 3.2, ease: "none" }, "delivery+=2.2");
  tl.to(q("landscape"), { x: 0, duration: .8 }, "delivery+=5.4");
  show("assistant", "delivery+=5.3");
  show("machine", "delivery+=6.5"); show("wrap", "delivery+=6.5"); show("trolley", "delivery+=6.5");
  tl.set([q("machine"), q("wrap"), q("trolley")], { x: 95 }, "delivery+=6.4");
  tl.set(q("employee"), { x: 45 }, "delivery+=6.4"); show("employee", "delivery+=6.6");
  tl.to(q("van"), { x: 1000, y: 0, duration: 1, ease: "power2.in" }, "delivery+=6.8");
  hide("van", "installation", .15); hide("assistant", "installation+=.2");

  tl.to([q("machine"), q("wrap"), q("trolley")], { x: 0, duration: 1.2 }, "installation");
  tl.to(q("customer"), { x: 0, duration: 1 }, "installation");
  tl.to(q("employee"), { x: -25, duration: 1.2 }, "installation");
  hide("trolley", "installation+=1.2");
  tl.to(q("wrap"), { y: -130, rotation: -7, autoAlpha: 0, duration: 1.1 }, "installation+=1.4");
  show("connections", "installation+=2.5"); show("checklist", "installation+=2.8");
  tl.fromTo(q("tick"), { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, stagger: .7, duration: .3, transformOrigin: "center", immediateRender: false }, "installation+=3");
  show("handover-hand", "installation+=5.2");
  hide("employee-rest-arm", "installation+=5.2", .1);
  tl.to(q("customer"), { rotation: 2, transformOrigin: "center bottom", duration: .35, repeat: 1, yoyo: true }, "installation+=6");
  hide("handover-hand", "installation+=7"); hide("checklist", "installation+=7");
  show("employee-rest-arm", "installation+=7", .1);
  hide("connections", "process-=.5"); hide("employee", "process-=.6");
  tl.to(q("customer"), { x: -75, autoAlpha: 0, duration: .7 }, "process-=.6");

  // Separate capture, regeneration, biological growth and preparation phases.
  show("cutaway", "process", .6); hide("front-panel", "process", .6); hide("status-light", "process");
  tl.to(q("world"), { scale: isMobile ? 1.4 : 1.7, duration: .9 }, "process");
  show("air-stream", "process+=.6");
  tl.to(q("air-stream"), { strokeDashoffset: -72, duration: 3, ease: "none" }, "process+=.6");
  tl.fromTo(q("co2-in"), { x: 0, autoAlpha: 0 }, { x: 56, autoAlpha: 1, duration: 1.4, repeat: 1, repeatDelay: .2, ease: "none", immediateRender: false }, "process+=.6");
  hide("co2-in", "process+=3.6", .25); hide("air-stream", "process+=3.7", .25);
  tl.to(q("cartridge"), { fill: color("warning-soft"), duration: .55 }, "process+=4");
  tl.to(q("cartridge"), { fill: color("tint"), duration: .6 }, "process+=6.2");
  tl.fromTo(q("co2-release"), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 19, duration: 1.2, repeat: 1, repeatDelay: .2, ease: "none", immediateRender: false }, "process+=4.1");
  hide("co2-release", "process+=6.7", .3);
  show("nutrient-flow", "process+=7");
  tl.to(q("nutrient-flow"), { strokeDashoffset: -42, duration: 4.8, ease: "none" }, "process+=7");
  tl.to(q("culture"), { fill: color("brand"), scaleY: 1, duration: 4.8 }, "process+=7");
  tl.fromTo(q("culture-bubbles"), { y: 12, autoAlpha: 0 }, { y: -18, autoAlpha: .85, duration: 1.45, repeat: 2, ease: "none", immediateRender: false }, "process+=7.3");
  hide("culture-bubbles", "process+=11.7"); hide("nutrient-flow", "process+=11.8");
  show("harvest-flow", "process+=12");
  tl.to(q("harvest-flow"), { strokeDashoffset: -70, duration: 4, ease: "none" }, "process+=12");
  tl.to(q("separator"), { rotation: 360, transformOrigin: "center", duration: 3.8, ease: "none" }, "process+=12");
  show("product", "process+=12.7");
  tl.fromTo(q("product-liquid"), { scaleY: .05 }, { scaleY: 1, transformOrigin: "center bottom", duration: 2.4, immediateRender: false }, "process+=13");
  tl.to(q("field-worker"), { x: isMobile ? -205 : -165, y: 10, scale: 1.23, svgOrigin: "865 387", duration: .75 }, "process+=12.8");
  tl.set(q("application"), { x: isMobile ? -119 : -79 }, "process+=12.8");
  hide("rake", "process+=12.8"); show("application", "process+=13.4");
  tl.to(q("irrigation-water"), { strokeDashoffset: -35, duration: 2.3, ease: "none" }, "process+=13.6");
  hide("application", "process+=16.1");
  tl.to(q("field-worker"), { x: 0, y: 0, scale: 1, duration: .6 }, "process+=16.1");
  show("rake", "process+=16.4"); hide("cutaway", "touchscreen-=.5", .5); show("front-panel", "touchscreen-=.5", .5);
  hide("air-stream", "touchscreen-=.5"); show("status-light", "touchscreen-=.5");

  tl.to(q("world"), { scale: isMobile ? 1.6 : 1.65, x: isMobile ? -175 : 0, duration: 1 }, "touchscreen");
  tl.to(q("customer"), { x: 370, autoAlpha: 1, duration: .9 }, "touchscreen");
  tl.to(q("touchscreen"), { scale: 1.25, transformOrigin: "left center", duration: .8 }, "touchscreen+=.4");
  show("touch-hand", "touchscreen+=2", .3);
  hide("customer-rest-arm", "touchscreen+=2", .1);
  tl.to(q("customer"), { rotation: -3, duration: .35 }, "touchscreen+=2");
  hide("screen-ok", "touchscreen+=2.4"); show("screen-cards", "touchscreen+=2.4");
  tl.to(q("customer"), { rotation: 0, duration: .4 }, "touchscreen+=3.1");
  hide("touch-hand", "touchscreen+=4.8");
  show("customer-rest-arm", "touchscreen+=4.8", .1);
  show("data-line", "fault-=.5");

  tl.to(q("world"), { scale: 1, x: 0, duration: .8 }, "fault");
  tl.to(q("customer"), { x: 0, duration: .8 }, "fault+=.2");
  tl.to(q("status-light"), { fill: color("warning"), duration: .25 }, "fault");
  hide("screen-cards", "fault", .15); show("screen-fault", "fault", .25);
  tl.set(q("data-packet"), { x: 0, y: 0, autoAlpha: 1 }, "fault+=.4");
  tl.to(q("data-packet"), { x: isMobile ? 32 : 65, y: -35, duration: .4, ease: "none" }, "fault+=.5");
  tl.to(q("data-packet"), { x: isMobile ? 34 : 88, y: -116, duration: .4, ease: "none" }, "fault+=.9");
  tl.to(q("data-packet"), { x: isMobile ? 55 : 160, y: -140, duration: .4, ease: "none" }, "fault+=1.3");
  show("support", "fault+=1.8");
  tl.to(q("data-line"), { strokeDashoffset: -36, duration: 3.5, ease: "none" }, "fault+=.5");
  hide("screen-fault", "fault+=3.4", .2); show("screen-needed", "fault+=3.4", .2);

  tl.to(q("support"), { scale: .68, svgOrigin: "850 235", y: -45, duration: .6 }, "maintenance");
  tl.set(q("employee"), { x: 15 }, "maintenance"); show("employee", "maintenance+=.3");
  tl.to(q("employee"), { x: -25, duration: .9 }, "maintenance+=.3");
  show("service-hand", "maintenance+=1.2");
  hide("employee-rest-arm", "maintenance+=1.2", .1);
  tl.fromTo(q("service-hand"), { rotation: 0 }, { rotation: -5, svgOrigin: "738 398", duration: .6, repeat: 1, yoyo: true, immediateRender: false }, "maintenance+=1.5");
  hide("screen-needed", "maintenance+=2.4", .2); show("screen-service", "maintenance+=2.4", .3);
  tl.to(q("customer"), { rotation: 3, duration: .3, repeat: 1, yoyo: true }, "maintenance+=3.1");
  hide("service-hand", "maintenance+=4.8");
  show("employee-rest-arm", "maintenance+=4.8", .1);
  hide("data-line", "closing-=.3");

  tl.to(q("employee"), { x: isMobile ? -25 : 0, duration: .8 }, "closing");
  tl.to(q("touchscreen"), { scale: 1, duration: .8 }, "closing");
  tl.to(q("world"), { scale: 1, x: 0, duration: .8 }, "closing");
  tl.fromTo(q("logo"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .9, immediateRender: false }, "closing");
  // Exactly sixty logical seconds. No independent infinite story animations.
  tl.to({ time: 0 }, { time: TOUR_DURATION, duration: TOUR_DURATION, ease: "none" }, 0);
  return tl;
}

export function initFunctionTour(root) {
  if (root.dataset.tourReady) return () => {};
  root.dataset.tourReady = "true";
  const $ = (selector) => root.querySelector(selector);
  const stage = $("[data-tour-stage]");
  const svg = $("[data-tour-svg]");
  const begin = $("[data-tour-begin]");
  const toggle = $("[data-tour-toggle]");
  const controls = $("[data-tour-controls]");
  const replay = $("[data-tour-replay]");
  const previous = $("[data-tour-previous]");
  const next = $("[data-tour-next]");
  const skip = $("[data-tour-skip]");
  const hint = $("[data-tour-hint]");
  const abort = new AbortController();
  let timeline, trigger, driver, mediaContext;
  let state = "poster", progress = 0, currentScene = -1;
  let reduceMotion = false, disposed = false, resizing = 0, activation = 0, completionFrame = 0;
  let expectedScroll = null, savedScrollBehaviour = null;
  let layoutPending = false;

  function setState(value) {
    state = value;
    root.dataset.tourState = value;
    controls.hidden = value === "poster";
    $("[data-tour-launch]").hidden = value !== "poster";
    toggle.hidden = value === "complete" || value === "still";
    toggle.textContent = message(value === "playing" ? "Pause" : "Resume");
    replay.hidden = value !== "complete";
    previous.hidden = next.hidden = value !== "still";
    skip.textContent = message(value === "complete" ? "Continue website" : "Skip tour");
  }

  function renderFrame(time, announce = true) {
    progress = clamp(time / TOUR_DURATION);
    root.dataset.tourTime = time.toFixed(2);
    const index = sceneAt(time);
    const scene = TOUR_SCENES[index];
    if (index !== currentScene) {
      currentScene = index;
      root.dataset.scene = scene.id;
      if (announce) $("[data-tour-announce]").textContent = message(scene.title);
    }
    $("[data-tour-privacy]").hidden = time < monitoringStart;
    $("[data-progress-fill]").style.transform = `scaleX(${progress})`;
    $("[data-tour-progress]").setAttribute("aria-valuenow", time.toFixed(1));
    $("[data-tour-progress]").setAttribute("aria-valuetext", message("{elapsed} of {duration} seconds. {scene}", { elapsed: Math.floor(time), duration: TOUR_DURATION, scene: message(scene.title) }));
    $("[data-tour-time]").textContent = `${formatTourTime(time)} / ${formatTourTime(TOUR_DURATION)}`;
    previous.disabled = index === 0;
    next.textContent = message(index === 7 ? "Finish" : "Next");
  }

  function stopDriver() {
    if (driver) { driver.kill(); driver = null; }
    expectedScroll = null;
    // Restore the site's existing smooth scrolling when the driver yields.
    if (savedScrollBehaviour !== null) {
      document.documentElement.style.scrollBehavior = savedScrollBehaviour;
      savedScrollBehaviour = null;
    }
  }

  function pause(sourceMessage = "Paused. Scroll to explore, or resume the guided tour.") {
    if (state !== "playing") return;
    stopDriver();
    setState("paused");
    hint.textContent = message(sourceMessage);
  }

  function releasePin(preservePosition = true) {
    if (!trigger) return;
    const before = stage.getBoundingClientRect().top;
    trigger.kill(true, true);
    trigger = null;
    if (preservePosition) {
      const after = stage.getBoundingClientRect().top;
      window.scrollTo({ top: window.scrollY + after - before, behavior: "instant" });
    }
  }

  function finish() {
    if (disposed || state === "complete") return;
    stopDriver();
    const refocus = document.activeElement === toggle || document.activeElement === next;
    setState("complete");
    releasePin();
    timeline?.progress(1, true);
    renderFrame(TOUR_DURATION);
    hint.textContent = message("The journey is complete. Take your time with the final view.");
    if (refocus) replay.focus({ preventScroll: true });
  }

  function queueFinish() {
    // Never remove a pin during ScrollTrigger's own update traversal.
    if (completionFrame) return;
    completionFrame = requestAnimationFrame(() => {
      completionFrame = 0;
      if (!layoutPending && progress >= 1 && state !== "poster") finish();
    });
  }

  function attachPin(atProgress = 0) {
    trigger = ScrollTrigger.create({
      id: "air2growth-function-tour", trigger: stage, pin: stage,
      start: "top 104px", end: () => `+=${Math.round(window.innerHeight * 4)}`,
      animation: timeline, scrub: true, invalidateOnRefresh: false,
      onUpdate(self) {
        if (disposed || !trigger || layoutPending) return;
        renderFrame(self.progress * TOUR_DURATION);
        if (self.progress >= 1 && state === "paused") queueFinish();
      },
    });
    trigger.refresh();
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * atProgress, behavior: "instant" });
    ScrollTrigger.update();
    timeline.progress(atProgress, true);
    renderFrame(atProgress * TOUR_DURATION, false);
  }

  function resume() {
    if (!trigger || reduceMotion || state === "complete") return;
    stopDriver();
    // Read actual scroll progress, including any manual reverse scrubbing.
    const from = clamp((window.scrollY - trigger.start) / (trigger.end - trigger.start));
    if (from >= 1) { finish(); return; }
    setState("playing");
    hint.textContent = message("Scroll to take over. Escape to exit.");
    savedScrollBehaviour = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    const clock = { progress: from };
    driver = gsap.to(clock, {
      progress: 1, duration: TOUR_DURATION * (1 - from), ease: "none",
      onUpdate() {
        if (!trigger) return;
        expectedScroll = Math.round(trigger.start + (trigger.end - trigger.start) * clock.progress);
        window.scrollTo({ top: expectedScroll, behavior: "instant" });
        ScrollTrigger.update();
      },
      onComplete: queueFinish,
    });
  }

  async function start() {
    const token = ++activation;
    clearTimeout(resizing); layoutPending = false;
    cancelAnimationFrame(completionFrame); completionFrame = 0;
    stopDriver(); releasePin();
    timeline?.revert(); timeline = null;
    progress = 0; currentScene = -1;
    setState(reduceMotion ? "still" : "paused");
    mediaContext.buildTour();
    if (reduceMotion) {
      showStill(0);
      hint.textContent = message("Reduced motion: explore the eight still scenes at your own pace.");
      next.focus({ preventScroll: true });
      return;
    }
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (disposed || token !== activation || state === "poster") return;
    attachPin();
    toggle.focus({ preventScroll: true });
    resume();
  }

  function showStill(index) {
    const frame = TOUR_SCENES[Math.max(0, Math.min(7, index))];
    timeline.time(frame.still, true);
    renderFrame(frame.still);
  }

  function exit() {
    ++activation;
    clearTimeout(resizing); layoutPending = false;
    cancelAnimationFrame(completionFrame); completionFrame = 0;
    stopDriver();
    releasePin();
    timeline?.revert(); timeline = null;
    setState("poster");
    progress = 0; currentScene = -1;
    delete root.dataset.scene;
    delete root.dataset.tourTime;
    $("[data-tour-privacy]").hidden = true;
    $("[data-tour-announce]").textContent = message("Tour exited.");
    begin.focus({ preventScroll: true });
  }

  function continueWebsite(event) {
    event?.preventDefault();
    if (state !== "complete") exit();
    else { stopDriver(); releasePin(); }
    const heading = $("#journey-heading");
    heading.focus({ preventScroll: true });
    $("#journey-explained").scrollIntoView({ behavior: "instant", block: "start" });
  }

  const mm = gsap.matchMedia();
  mm.add({ reduce: "(prefers-reduced-motion: reduce)", mobile: "(max-width: 640px)", all: "all" }, (context) => {
    reduceMotion = Boolean(context.conditions.reduce);
    mediaContext = context;
    context.add("buildTour", () => { timeline = buildTimeline(root, Boolean(context.conditions.mobile)); });
    if (state !== "poster") {
      context.buildTour();
      timeline.progress(progress, true);
      setState(state === "complete" ? "complete" : reduceMotion ? "still" : "paused");
      renderFrame(progress * TOUR_DURATION, false);
      if (!reduceMotion && state !== "complete") attachPin(progress);
      hint.textContent = message("Layout or motion preference changed. Continue when you are ready.");
    }
    return () => { stopDriver(); releasePin(); timeline = null; };
  }, root);

  function resize() {
    svg.setAttribute("viewBox", window.innerWidth <= 640 ? "280 130 520 490" : "0 0 1000 620");
    $("[data-art=data-route]").setAttribute("d", window.innerWidth <= 640 ? "M692 338c48-2 22-142 55-147" : "M692 338c83-1 76-146 171-147");
    if (!trigger) return;
    const saved = progress;
    layoutPending = true;
    cancelAnimationFrame(completionFrame); completionFrame = 0;
    pause("Viewport changed. Resume when you are ready.");
    clearTimeout(resizing);
    resizing = window.setTimeout(() => {
      if (!trigger) { layoutPending = false; return; }
      trigger.refresh();
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * saved, behavior: "instant" });
      layoutPending = false;
      ScrollTrigger.update();
      timeline?.progress(saved, true);
      renderFrame(saved * TOUR_DURATION, false);
    }, 300);
  }
  resize();
  const on = (target, type, handler, options = {}) => target.addEventListener(type, handler, { ...options, signal: abort.signal });
  on(begin, "click", start); on(replay, "click", start);
  on(toggle, "click", () => state === "playing" ? pause() : resume());
  on($("[data-tour-exit]"), "click", exit); on(skip, "click", continueWebsite);
  on(previous, "click", () => showStill(currentScene - 1));
  on(next, "click", () => currentScene === 7 ? finish() : showStill(currentScene + 1));
  on(window, "wheel", () => pause(), { passive: true });
  on(window, "touchstart", () => pause(), { passive: true });
  on(window, "pointerdown", (event) => {
    if (event.clientX >= document.documentElement.clientWidth || event.target.closest?.("header")) pause();
  }, { passive: true });
  on(window, "keydown", (event) => {
    if (state === "poster" || state === "complete") return;
    if (event.key === "Escape") { event.preventDefault(); exit(); return; }
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key) && !event.target.closest?.("button,a,input,textarea,select")) pause();
  });
  on(window, "scroll", () => {
    if (state === "playing" && expectedScroll !== null && Math.abs(window.scrollY - expectedScroll) > 3) pause();
  }, { passive: true });
  on(document, "visibilitychange", () => { if (document.hidden) pause("Paused while this tab was hidden. Resume when you are ready."); });
  on(window, "resize", resize, { passive: true });
  begin.disabled = false;

  return () => {
    disposed = true; ++activation;
    abort.abort(); clearTimeout(resizing); cancelAnimationFrame(completionFrame);
    stopDriver(); releasePin(false); timeline?.revert(); mm.revert();
    delete root.dataset.tourReady;
  };
}
