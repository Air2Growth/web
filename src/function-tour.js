import { gsap } from "gsap";
import { message } from "./messages.ts";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Absolute seconds, including holds, are the single timing manifest for the
// animation, guided driver, progress labels and reduced-motion still scenes.
export const TOUR_SCENES = Object.freeze([
  { id: "delivery", start: 0, end: 3, still: 1.8, title: "Delivery to the greenhouse", description: "The team brings the system into the greenhouse." },
  { id: "installation", start: 3, end: 6, still: 5, title: "Ready for cultivation", description: "Water and nutrients are already present before growth begins." },
  { id: "capture", start: 6, end: 11, still: 9, title: "Capture CO₂ from the air", description: "Ambient air passes through the filter, which captures CO₂." },
  { id: "supply", start: 11, end: 15, still: 13, title: "Supply CO₂ to the culture", description: "The captured CO₂ is released and supplied to the prepared culture." },
  { id: "growth", start: 15, end: 23, still: 20, title: "Microalgae grow", description: "With light, microalgae use CO₂, water and nutrients to build biomass." },
  { id: "harvest", start: 23, end: 29, still: 27.5, title: "Harvest and prepare biomass", description: "The harvested microalgae are intended to become liquid fertiliser." },
  { id: "service", start: 29, end: 32, still: 30.8, title: "Keep track of operation", description: "A touchscreen and machine monitoring are planned to support operation and service." },
  { id: "closing", start: 32, end: 38, still: 37.5, title: "Fertilise plants on site", description: "The resulting fertiliser is applied to plants in the greenhouse." },
].map(Object.freeze));
export const TOUR_DURATION = TOUR_SCENES.at(-1).end;

const clamp = (value) => Math.max(0, Math.min(1, value));
const monitoringStart = TOUR_SCENES.find((scene) => scene.id === "service").start;
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
  // One stable pivot keeps camera movement reversible when scrubbing.
  tl.set(q("world"), { svgOrigin: "575 480", smoothOrigin: false, x: 0, y: 0, scale: 1 }, 0);
  tl.set(q("machine"), { autoAlpha: 0, x: 50 }, 0);
  tl.set(q("customer"), { x: -50 }, 0);
  tl.set([q("co2-in"), q("co2-release"), q("culture-bubbles"), q("harvest-flow")], { autoAlpha: 0 }, 0);
  // Liquid volume is present from setup; only algae density changes during growth.
  tl.set(q("culture"), { fill: color("water"), scaleY: 1 }, 0);
  tl.set(q("algae-cells"), { autoAlpha: .25 }, 0);
  tl.set(q("application-plant"), { x: isMobile ? -40 : 0 }, 0);

  show("van", "delivery", .15);
  tl.fromTo(q("van"), { x: -330 }, { x: -70, duration: 1.4, immediateRender: false }, "delivery");
  tl.to(q("wheel"), { rotation: 300, transformOrigin: "50% 50%", duration: 1.4, ease: "none" }, "delivery");
  show("machine", "delivery+=1.1"); show("trolley", "delivery+=1.1");
  tl.set(q("trolley"), { x: 50 }, "delivery");
  show("employee", "delivery+=1.2");
  tl.to([q("machine"), q("trolley")], { x: 0, duration: 1.2 }, "delivery+=1.4");
  tl.to(q("van"), { x: -650, duration: .8 }, "delivery+=2.1");
  hide("van", "installation", .1); hide("trolley", "installation", .25);

  show("connections", "installation", .25);
  show("checklist", "installation+=.1");
  tl.fromTo(q("tick"), { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, stagger: .22, duration: .2, transformOrigin: "center", immediateRender: false }, "installation+=.2");
  show("cutaway", "installation+=.5"); hide("front-panel", "installation+=.5");
  show("nutrient-flow", "installation+=.5");
  hide("nutrient-flow", "installation+=1.5");
  hide("checklist", "installation+=1.7"); hide("connections", "installation+=2");
  hide("employee", "installation+=2");
  tl.to(q("customer"), { x: -75, autoAlpha: 0, duration: .6 }, "installation+=2.1");

  // Preserve the detailed cabinet cutaway: capture, supply, growth, preparation.
  hide("status-light", "capture", .25);
  tl.to(q("world"), { scale: isMobile ? 1.4 : 1.65, duration: .8 }, "capture");
  show("air-stream", "capture+=.3");
  tl.to(q("air-stream"), { strokeDashoffset: -90, duration: 4, ease: "none" }, "capture+=.3");
  tl.fromTo(q("co2-in"), { x: 0, autoAlpha: 0 }, { x: 56, autoAlpha: 1, duration: 1.5, repeat: 1, repeatDelay: .25, ease: "none", immediateRender: false }, "capture+=.5");
  hide("co2-in", "capture+=4.3", .25); hide("air-stream", "capture+=4.4", .25);

  tl.to(q("cartridge"), { fill: color("water"), duration: .5 }, "supply");
  tl.fromTo(q("co2-release"), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 19, duration: 1.3, repeat: 1, repeatDelay: .2, ease: "none", immediateRender: false }, "supply+=.2");
  tl.to(q("cartridge"), { fill: color("tint"), duration: .6 }, "supply+=2.9");
  hide("co2-release", "supply+=3.5", .3);

  tl.to(q("culture"), { fill: color("leaf"), duration: 6 }, "growth+=.2");
  tl.to(q("algae-cells"), { autoAlpha: 1, duration: 5 }, "growth+=.4");
  tl.fromTo(q("culture-bubbles"), { y: 10, autoAlpha: 0 }, { y: -16, autoAlpha: .85, duration: 2, repeat: 2, ease: "none", immediateRender: false }, "growth+=.6");
  hide("culture-bubbles", "growth+=7", .5);

  show("harvest-flow", "harvest");
  tl.to(q("harvest-flow"), { strokeDashoffset: -90, duration: 5.2, ease: "none" }, "harvest");
  tl.to(q("separator"), { rotation: 540, transformOrigin: "center", duration: 4.6, ease: "none" }, "harvest+=.3");
  show("product", "harvest+=1");
  tl.fromTo(q("product-liquid"), { scaleY: .05 }, { scaleY: 1, transformOrigin: "center bottom", duration: 3, immediateRender: false }, "harvest+=1.2");
  hide("harvest-flow", "harvest+=5.3");

  hide("cutaway", "service", .4); show("front-panel", "service", .4);
  show("status-light", "service");
  tl.to(q("world"), { scale: isMobile ? 1.35 : 1.3, x: isMobile ? -40 : 0, duration: .6 }, "service");
  hide("screen-ok", "service", .2); show("screen-cards", "service", .3);
  tl.to(q("touchscreen"), { scale: 1.2, transformOrigin: "left center", duration: .4 }, "service");
  show("data-line", "service+=.3"); show("support", "service+=.6");
  tl.to(q("data-line"), { strokeDashoffset: -25, duration: 1.8, ease: "none" }, "service+=.3");
  hide("support", "service+=2.2", .4); hide("data-line", "service+=2.2", .4);

  // The final hold shows actual application, inside the same greenhouse.
  tl.to(q("touchscreen"), { scale: 1, duration: .6 }, "closing");
  tl.to(q("world"), { scale: 1, x: 0, y: 0, duration: .8 }, "closing");
  tl.to(q("field-worker"), { x: isMobile ? -140 : -100, y: 10, scale: 1.23, svgOrigin: "865 387", duration: .8 }, "closing");
  tl.set(q("application"), { x: isMobile ? -54 : -14 }, "closing");
  hide("rake", "closing", .2);
  show("application", "closing+=.8");
  tl.to(q("irrigation-water"), { strokeDashoffset: -70, duration: 4, ease: "none" }, "closing+=1");
  tl.to(q("application-plant"), { scale: 1.08, transformOrigin: "center bottom", duration: 2 }, "closing+=2");
  // The manifest sets the final hold. No independent repeating animations.
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
  const progressFill = $("[data-progress-fill]");
  const progressBar = $("[data-tour-progress]");
  const timeLabel = $("[data-tour-time]");
  const caption = $("[data-tour-caption]");
  const sceneTitle = $("[data-tour-scene-title]");
  const sceneDescription = $("[data-tour-scene-description]");
  const announcement = $("[data-tour-announce]");
  const privacy = $("[data-tour-privacy]");
  const lastScene = TOUR_SCENES.length - 1;
  progressBar.setAttribute("aria-valuemax", String(TOUR_DURATION));
  const durationLabel = $("[data-tour-duration]");
  durationLabel.textContent = message("A {duration}-second guided tour. Pause or exit at any time.", { duration: TOUR_DURATION });
  durationLabel.hidden = false;
  const abort = new AbortController();
  let timeline, trigger, driver, mediaContext;
  let state = "poster", progress = 0, currentScene = -1, displayedSecond = -1;
  let reduceMotion = false, disposed = false, resizing = 0, activation = 0, completionFrame = 0;
  let expectedScroll = null, savedScrollBehaviour = null;
  let layoutPending = false;

  function setState(value) {
    state = value;
    root.dataset.tourState = value;
    controls.hidden = value === "poster";
    caption.hidden = value === "poster";
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
    const sceneChanged = index !== currentScene;
    if (sceneChanged) {
      currentScene = index;
      root.dataset.scene = scene.id;
      sceneTitle.textContent = message(scene.title);
      sceneDescription.textContent = message(scene.description);
      if (announce) announcement.textContent = message(scene.title) + ". " + message(scene.description);
      privacy.hidden = time < monitoringStart;
      previous.disabled = index === 0;
      next.textContent = message(index === lastScene ? "Finish" : "Next");
    }
    progressFill.style.transform = `scaleX(${progress})`;
    // Text and accessibility updates need second precision, not frame precision.
    const whole = Math.floor(time + 1e-6);
    if (whole !== displayedSecond || sceneChanged) {
      displayedSecond = whole;
      progressBar.setAttribute("aria-valuenow", String(whole));
      progressBar.setAttribute("aria-valuetext", message("{elapsed} of {duration} seconds. {scene}", { elapsed: whole, duration: TOUR_DURATION, scene: message(scene.title) }));
      timeLabel.textContent = `${formatTourTime(time)} / ${formatTourTime(TOUR_DURATION)}`;
    }
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
      start: "top 104px", end: () => `+=${Math.round(window.innerHeight * 2.5)}`,
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
      hint.textContent = message("Reduced motion: explore the still scenes at your own pace.");
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
    const frame = TOUR_SCENES[Math.max(0, Math.min(lastScene, index))];
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
    privacy.hidden = true;
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
  on(next, "click", () => currentScene === lastScene ? finish() : showStill(currentScene + 1));
  on(window, "wheel", () => pause(), { passive: true });
  on(window, "touchstart", (event) => {
    // A control tap's click handles playback; pausing here would toggle it twice.
    if (!event.target.closest?.("[data-tour-controls]")) pause();
  }, { passive: true });
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
