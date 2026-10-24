// Run in the T3 preview on the Vite /function page:
// await (await import('/tests/function-tour.browser.js')).runFunctionTourChecks()
// Exercises the actual document scroll, controls and GSAP instance.
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initFunctionTour, TOUR_DURATION, TOUR_SCENES } from "../src/function-tour.js";

export async function runFunctionTourChecks() {
  const root = document.querySelector("[data-function-tour]");
  const $ = (selector) => root.querySelector(selector);
  const results = [];
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const state = () => root.dataset.tourState;
  async function waitFor(predicate, timeout = 1000) {
    const start = performance.now();
    while (!predicate()) {
      if (performance.now() - start > timeout) throw new Error("Tour state timed out: " + state());
      await sleep(16);
    }
  }
  async function launch(button = "[data-tour-begin]") {
    $(button).click();
    await waitFor(() => state() === "playing");
    assert(document.querySelectorAll(".pin-spacer").length === 1, "One active pin expected");
  }
  async function seek(time) {
    const trigger = ScrollTrigger.getById("air2growth-function-tour");
    assert(trigger, "Missing active tour trigger");
    window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * time / TOUR_DURATION, behavior: "instant" });
    ScrollTrigger.update();
    await sleep(35);
  }

  if (state() !== "poster") $("[data-tour-exit]").click();
  assert(!document.querySelector(".pin-spacer"), "Poster must have no runway");

  // Real DOM event dispatch covers the touchstart -> click ordering, but does
  // not replace a physical-device check of the browser's generated tap events.
  await launch();
  const toggle = $("[data-tour-toggle]");
  const touchStart = (target) => {
    const event = new TouchEvent("touchstart", { bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    assert(!event.defaultPrevented, "Touch input must remain available for native scrolling");
  };
  const tapClick = () => toggle.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  touchStart(toggle);
  assert(state() === "playing", "Touching Pause must leave the toggle to its click handler");
  tapClick();
  assert(state() === "paused", "A Pause tap must pause exactly once");
  const touchPausedTime = root.dataset.tourTime;
  const touchPausedY = scrollY;
  await sleep(120);
  assert(state() === "paused" && root.dataset.tourTime === touchPausedTime && scrollY === touchPausedY, "A Pause tap must keep playback stopped");
  touchStart(toggle);
  assert(state() === "paused", "Touching Resume must wait for its click handler");
  tapClick();
  assert(state() === "playing", "A Resume tap must resume exactly once");
  await waitFor(() => Number(root.dataset.tourTime) > Number(touchPausedTime));
  touchStart($("[data-art=greenhouse]"));
  assert(state() === "paused", "Touching the illustration outside the controls must pause playback");
  const outsideTouchTime = root.dataset.tourTime;
  const outsideTouchY = scrollY;
  await sleep(120);
  assert(root.dataset.tourTime === outsideTouchTime && scrollY === outsideTouchY, "Touch interruption outside the controls must stop the driver");
  $("[data-tour-exit]").click();
  results.push({ check: "Touch Pause/Resume taps and interruption outside playback controls", passed: true });

  const seen = [];
  let privacyIntroduced = false;
  let progressAnnouncements = 0;
  const progressObserver = new MutationObserver((changes) => { progressAnnouncements += changes.length; });
  progressObserver.observe($("[data-tour-progress]"), { attributes: true, attributeFilter: ["aria-valuetext"] });
  const observer = new MutationObserver(() => {
    const scene = root.dataset.scene;
    if (scene && seen.at(-1) !== scene) seen.push(scene);
    if (["service", "closing"].includes(scene)) {
      assert(!$("[data-tour-privacy]").hidden, "Privacy statement must persist from the service scene");
      privacyIntroduced = true;
    }
  });
  observer.observe(root, { attributes: true, attributeFilter: ["data-scene"] });
  await launch();
  const beganAt = performance.now();
  assert(TOUR_DURATION >= 35 && TOUR_DURATION <= 40, "Tour must fit the approved duration");
  assert(ScrollTrigger.getById("air2growth-function-tour").animation.duration() === TOUR_DURATION, "Animation duration must match the manifest");
  assert(Number($("[data-tour-progress]").getAttribute("aria-valuemax")) === TOUR_DURATION, "Progress duration must come from the manifest");
  TOUR_SCENES.forEach((scene, index) => {
    assert(scene.start === (TOUR_SCENES[index - 1]?.end ?? 0), "Scenes must be contiguous");
    assert(scene.still >= scene.start && scene.still <= scene.end, "Every still must belong to its scene");
  });
  await waitFor(() => state() === "complete", TOUR_DURATION * 1000 + 3000);
  const elapsed = (performance.now() - beganAt) / 1000;
  observer.disconnect();
  progressObserver.disconnect();
  assert(progressAnnouncements <= TOUR_DURATION + TOUR_SCENES.length + 2, "Accessible progress must not be rewritten every frame");
  assert(Math.abs(elapsed - TOUR_DURATION) < .4, `Guided playback took ${elapsed.toFixed(2)} seconds`);
  assert(seen.join(",") === TOUR_SCENES.map(scene => scene.id).join(","), "All eight scenes must play in order: " + seen);
  assert(privacyIntroduced && !$("[data-tour-privacy]").hidden, "Closing hold needs the privacy statement");
  assert(!document.querySelector(".pin-spacer"), "Completion must release the pin");
  assert(getComputedStyle($("[data-art=machine]")).visibility === "visible", "Closing greenhouse must retain the machine");
  assert(getComputedStyle($("[data-art=order]")).visibility === "hidden", "Closing hold must not reset to ordering");
  const camera = $("[data-art=world]").transform.baseVal.consolidate().matrix;
  assert(Math.abs(camera.a - 1) < .001 && Math.abs(camera.d - 1) < .001 && Math.abs(camera.e) < .01 && Math.abs(camera.f) < .01, "Closing camera must return to its original framing");
  assert(getComputedStyle($("[data-art=greenhouse]")).visibility === "visible", "The greenhouse must remain visible at the end");
  assert(getComputedStyle($("[data-art=application]")).visibility === "visible", "Final hold must show fertiliser being applied to plants");
  const plantBounds = $("[data-art=application-plant]").getBoundingClientRect();
  const productBounds = $("[data-art=product]").getBoundingClientRect();
  const waterBounds = $("[data-art=irrigation-water]").getBoundingClientRect();
  assert(plantBounds.left > productBounds.right, "Application plant must be separate from the collection container");
  assert(waterBounds.right >= plantBounds.left && waterBounds.left <= plantBounds.right, "Fertiliser stream must reach the plant");
  assert($("[data-tour-time]").textContent.endsWith("0:38"), "Displayed timing must match the measured duration");
  results.push({ check: "Eight scenes, greenhouse application and guided duration", seconds: +elapsed.toFixed(2), progressAnnouncements });

  await launch("[data-tour-replay]");
  window.dispatchEvent(new WheelEvent("wheel", { deltaY: 100 }));
  assert(state() === "paused", "Wheel input must pause the driver");
  const pausedY = scrollY;
  await sleep(120);
  assert(scrollY === pausedY, "Paused driver must stay stopped");
  await seek(TOUR_SCENES.find(scene => scene.id === "service").still);
  assert(root.dataset.scene === "service", "Forward scrolling must scrub");
  await seek(TOUR_SCENES.find(scene => scene.id === "delivery").still);
  assert(root.dataset.scene === "delivery", "Reverse scrolling must scrub coherently");
  await seek(TOUR_SCENES.find(scene => scene.id === "installation").still);
  assert(getComputedStyle($("[data-art=cutaway]")).visibility === "visible", "Setup must reveal the prepared culture");
  const prepared = getComputedStyle($("[data-art=culture]")).fill;
  assert(prepared === "rgb(220, 234, 236)", "Water must already fill the culture before growth");
  const levelBeforeGrowth = $("[data-art=culture]").getBoundingClientRect().height;
  await seek(TOUR_SCENES.find(scene => scene.id === "capture").still);
  assert(getComputedStyle($("[data-art=co2-release]")).visibility === "hidden", "Capture must precede supply");
  assert(getComputedStyle($("[data-art=harvest-flow]")).visibility === "hidden", "Harvesting must wait for culture growth");
  await seek(TOUR_SCENES.find(scene => scene.id === "supply").still);
  assert(getComputedStyle($("[data-art=co2-in]")).visibility === "hidden", "Capture must stop during supply");
  assert(getComputedStyle($("[data-art=co2-release]")).visibility === "visible", "Released CO₂ must reach cultivation");
  await seek(TOUR_SCENES.find(scene => scene.id === "growth").still);
  assert(getComputedStyle($("[data-art=culture]")).fill !== prepared, "Algae density must develop in the already filled culture");
  assert(getComputedStyle($("[data-art=harvest-flow]")).visibility === "hidden", "Growth must precede harvest");
  assert($("[data-art=culture]").getBoundingClientRect().height >= levelBeforeGrowth, "Growth must not empty the prepared culture");
  await seek(TOUR_SCENES.find(scene => scene.id === "harvest").still);
  assert(getComputedStyle($("[data-art=product]")).visibility === "visible", "Preparation must produce the illustrated liquid container");
  await seek(TOUR_SCENES.find(scene => scene.id === "capture").still);
  assert(getComputedStyle($("[data-art=product]")).visibility === "hidden", "Reverse scrubbing must reset the harvest");
  assert(getComputedStyle($("[data-art=application]")).visibility === "hidden", "Reverse scrubbing must reset plant application");
  await seek(TOUR_DURATION - 2);
  $("[data-tour-toggle]").click();
  const resumedAt = performance.now();
  await waitFor(() => state() === "complete", 3500);
  const remaining = (performance.now() - resumedAt) / 1000;
  assert(Math.abs(remaining - 2) < .35, "Resume must use the remaining two seconds");
  assert(!document.querySelector(".pin-spacer"), "Replay completion must clean up its pin");
  results.push({ check: "Native input, reverse scrubbing, resume and replay cleanup", remainingSeconds: +remaining.toFixed(2) });

  await launch("[data-tour-replay]");
  Object.defineProperty(document, "hidden", { configurable: true, value: true });
  document.dispatchEvent(new Event("visibilitychange"));
  assert(state() === "paused", "Hidden tab must pause");
  delete document.hidden;
  document.dispatchEvent(new Event("visibilitychange"));
  await sleep(80);
  assert(state() === "paused", "Visible tab must wait for explicit resume");
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  assert(state() === "poster" && document.activeElement === $("[data-tour-begin]"), "Escape must exit and return focus");
  assert(!document.querySelector(".pin-spacer"), "Exit must remove the runway");
  await launch();
  $("[data-tour-skip]").click();
  assert(document.activeElement === $("#journey-heading"), "Skip must focus the following explanation");
  assert(!document.querySelector(".pin-spacer"), "Skip must remove the runway");
  results.push({ check: "Hidden-tab pause, Escape, Skip and keyboard focus", passed: true });

  // Isolated still-sequence instance, with the browser's reduced-motion
  // media query explicitly emulated because the preview has no media API.
  const stillRoot = root.cloneNode(true);
  delete stillRoot.dataset.tourReady;
  root.replaceWith(stillRoot);
  const originalMatchMedia = window.matchMedia;
  let cleanup;
  try {
    window.matchMedia = function (query) {
      const result = originalMatchMedia.call(window, query);
      if (query.includes("prefers-reduced-motion")) Object.defineProperty(result, "matches", { value: true });
      return result;
    };
    cleanup = initFunctionTour(stillRoot);
    const q = (selector) => stillRoot.querySelector(selector);
    window.scrollTo({ top: 0, behavior: "instant" });
    await sleep(35);
    const beforeY = scrollY;
    q("[data-tour-begin]").click();
    assert(stillRoot.dataset.tourState === "still", "Reduced motion must use still scenes");
    assert(!document.querySelector(".pin-spacer"), "Reduced motion must not pin or reserve a runway");
    await sleep(120);
    assert(scrollY === beforeY, "Reduced motion must not scroll automatically");
    q("[data-tour-next]").click();
    assert(stillRoot.dataset.scene === "installation", "Next must advance the still sequence");
    q("[data-tour-previous]").click();
    assert(stillRoot.dataset.scene === "delivery", "Previous must reverse the still sequence");
    for (let i = 0; i < TOUR_SCENES.length; i++) q("[data-tour-next]").click();
    assert(stillRoot.dataset.tourState === "complete", "Still sequence must finish with a readable hold");
    assert(!q("[data-tour-privacy]").hidden, "Still closing hold needs the privacy statement");
    assert(getComputedStyle(q("[data-art=application]")).visibility === "visible", "Final still must show plant application");
    results.push({ check: "Reduced motion: still scenes, Next/Previous and no auto-scroll", passed: true });
  } finally {
    cleanup?.();
    window.matchMedia = originalMatchMedia;
    stillRoot.replaceWith(root);
  }
  return results;
}
