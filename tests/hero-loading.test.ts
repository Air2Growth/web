import { describe, expect, test } from "bun:test";
import { scheduleHeroVideo } from "../src/hero-loading.js";

function page(hash = "") {
  const target = { contains: () => false };
  const document = Object.assign(new EventTarget(), { readyState: "loading", hidden: false, getElementById: () => hash ? target : null });
  const frames = new Map<number, FrameRequestCallback>();
  let frameId = 0;
  let finishDecode!: () => void;
  const decoded = new Promise<void>((resolve) => { finishDecode = resolve; });
  const environment = Object.assign(new EventTarget(), {
    document,
    navigator: { connection: { effectiveType: "4g", saveData: false } },
    innerHeight: 800,
    location: { hash },
    motion: { matches: false },
    matchMedia() { return this.motion; },
    requestAnimationFrame(callback: FrameRequestCallback) { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame(id: number) { frames.delete(id); },
  });
  const bounds = { top: 0, bottom: 800 };
  const hero = { contains: () => false, getBoundingClientRect: () => bounds, querySelector: () => ({ decode: () => decoded }) };
  let starts = 0;
  const cancel = scheduleHeroVideo(hero, () => { starts++; }, environment);
  const paint = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(0));
  };
  const settle = async () => { await Promise.resolve(); await Promise.resolve(); };
  return { document, environment, bounds, finishDecode, paint, settle, cancel, starts: () => starts };
}

describe("decorative hero video loading", () => {
  test("waits for the page and poster, lets content paint, then starts only once", async () => {
    const p = page();
    p.paint();
    expect(p.starts()).toBe(0);
    p.document.readyState = "complete";
    p.environment.dispatchEvent(new Event("load"));
    await p.settle();
    p.paint();
    expect(p.starts()).toBe(0);
    p.finishDecode();
    await p.settle();
    p.paint();
    expect(p.starts()).toBe(0);
    p.paint();
    expect(p.starts()).toBe(1);
    p.environment.dispatchEvent(new Event("scroll"));
    p.document.dispatchEvent(new Event("visibilitychange"));
    p.paint(); p.paint();
    expect(p.starts()).toBe(1);
    p.cancel();
  });

  test("does not fetch video for hidden tabs or when an anchor skips past the hero", async () => {
    const p = page();
    p.document.hidden = true;
    p.finishDecode();
    p.environment.dispatchEvent(new Event("load"));
    await p.settle();
    p.paint(); p.paint();
    expect(p.starts()).toBe(0);
    p.bounds.bottom = -1;
    p.document.hidden = false;
    p.document.dispatchEvent(new Event("visibilitychange"));
    p.paint(); p.paint();
    expect(p.starts()).toBe(0);
    p.bounds.bottom = 800;
    p.environment.dispatchEvent(new Event("scroll"));
    p.paint(); p.paint();
    expect(p.starts()).toBe(1);
    p.cancel();
  });

  test("waits through an initial smooth section jump and starts only on return to the hero", async () => {
    const p = page("#kontakt");
    p.finishDecode();
    p.environment.dispatchEvent(new Event("load"));
    await p.settle();
    p.paint(); p.paint();
    expect(p.starts()).toBe(0);
    p.bounds.bottom = -200;
    p.environment.dispatchEvent(new Event("scroll"));
    p.paint(); p.paint();
    expect(p.starts()).toBe(0);
    p.bounds.bottom = 800;
    p.environment.dispatchEvent(new Event("scroll"));
    p.paint(); p.paint();
    expect(p.starts()).toBe(1);
    p.cancel();
  });

  for (const preference of ["slow-2g", "2g", "3g", "saveData", "reducedMotion"]) {
    test(`keeps the still image for ${preference}`, async () => {
      const p = page();
      if (preference === "saveData") p.environment.navigator.connection.saveData = true;
      else if (preference === "reducedMotion") p.environment.motion.matches = true;
      else p.environment.navigator.connection.effectiveType = preference;
      p.finishDecode();
      p.environment.dispatchEvent(new Event("load"));
      await p.settle();
      p.paint(); p.paint();
      expect(p.starts()).toBe(0);
      p.cancel();
    });
  }

  test("cancels pending startup even when poster decoding finishes later", async () => {
    const p = page();
    p.environment.dispatchEvent(new Event("load"));
    p.cancel();
    p.finishDecode();
    await p.settle();
    p.paint(); p.paint();
    expect(p.starts()).toBe(0);
  });

  test("rechecks reduced motion before starting a queued video", async () => {
    const p = page();
    p.environment.dispatchEvent(new Event("load"));
    p.finishDecode();
    await p.settle();
    p.paint();
    p.environment.motion.matches = true;
    p.paint();
    expect(p.starts()).toBe(0);
    p.cancel();
  });
});
