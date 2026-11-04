// Run in the T3 preview on the Vite /function page:
// await (await import('/tests/function-tour.browser.js')).runFunctionTourChecks()
// Exercises the normal-flow autoplay animation without taking over scrolling.
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
      if (performance.now() - start > timeout) throw new Error("Animation state timed out: " + state());
      await sleep(16);
    }
  }
  async function launch(button = "[data-tour-begin]") {
    $(button).click();
    await waitFor(() => state() === "playing");
    assert(!document.querySelector(".pin-spacer"), "Animation must not create a pinned scroll runway");
  }

  if (state() !== "poster") $("[data-tour-exit]").click();
  assert(!document.querySelector(".pin-spacer"), "Poster must have no runway");

  const beforeY = scrollY;
  await launch();
  await sleep(120);
  assert(scrollY === beforeY, "Autoplay must leave native page scrolling untouched");
  const toggle = $("[data-tour-toggle]");
  toggle.click();
  assert(state() === "paused", "Pause must stop playback");
  const pausedTime = root.dataset.tourTime;
  await sleep(120);
  assert(root.dataset.tourTime === pausedTime && scrollY === beforeY, "Paused animation must keep time and page position");
  toggle.click();
  assert(state() === "playing", "Resume must restart playback");
  $("[data-tour-exit]").click();
  results.push({ check: "Autoplay, pause/resume and native scrolling", passed: true });

  const seen = [];
  const observer = new MutationObserver(() => {
    const scene = root.dataset.scene;
    if (scene && seen.at(-1) !== scene) seen.push(scene);
  });
  observer.observe(root, { attributes: true, attributeFilter: ["data-scene"] });
  await launch();
  assert(TOUR_DURATION >= 35 && TOUR_DURATION <= 40, "Animation must fit the approved duration");
  assert(Number($("[data-tour-progress]").getAttribute("aria-valuemax")) === TOUR_DURATION, "Progress duration must come from the manifest");
  await waitFor(() => state() === "complete", TOUR_DURATION * 1000 + 3000);
  observer.disconnect();
  assert(seen.join(",") === TOUR_SCENES.map((scene) => scene.id).join(","), "All scenes must play in order: " + seen);
  assert(!document.querySelector(".pin-spacer"), "Completion must leave the document flow intact");
  assert(getComputedStyle($("[data-art=application]")).visibility === "visible", "Final hold must show fertiliser application");
  assert(getComputedStyle($("[data-art=irrigation-water]")).visibility === "visible", "Final hold must show the pouring stream");
  assert($("[data-tour-time]").textContent.endsWith("0:38"), "Displayed timing must match the measured duration");
  results.push({ check: "Eight scenes, worker foreground and pouring stream", passed: true });

  const worker = $("[data-art=field-worker]");
  const crops = $("[data-art=crop-rows]");
  assert(crops.compareDocumentPosition(worker) & Node.DOCUMENT_POSITION_FOLLOWING, "Worker must be painted after crop rows");
  $("[data-tour-replay]").click();
  await waitFor(() => state() === "playing");
  Object.defineProperty(document, "hidden", { configurable: true, value: true });
  document.dispatchEvent(new Event("visibilitychange"));
  assert(state() === "paused", "Hidden tab must pause");
  delete document.hidden;
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  assert(state() === "poster" && document.activeElement === $("[data-tour-begin]"), "Escape must exit and return focus");
  results.push({ check: "Hidden-tab pause, Escape and cleanup", passed: true });

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
    await sleep(35);
    q("[data-tour-begin]").click();
    assert(stillRoot.dataset.tourState === "still", "Reduced motion must use still scenes");
    q("[data-tour-next]").click();
    assert(stillRoot.dataset.scene === "installation", "Next must advance the still sequence");
    q("[data-tour-previous]").click();
    assert(stillRoot.dataset.scene === "delivery", "Previous must reverse the still sequence");
    for (let i = 0; i < TOUR_SCENES.length; i++) q("[data-tour-next]").click();
    assert(stillRoot.dataset.tourState === "complete", "Still sequence must finish with a readable hold");
    assert(!q("[data-tour-privacy]").hidden, "Still closing hold needs the privacy statement");
    results.push({ check: "Reduced motion still scenes", passed: true });
  } finally {
    cleanup?.();
    window.matchMedia = originalMatchMedia;
    stillRoot.replaceWith(root);
  }
  return results;
}
