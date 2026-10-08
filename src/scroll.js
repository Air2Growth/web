export function initScrollStories(selectStep) {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const suitable = matchMedia("(min-width: 761px) and (min-height: 650px)");
  let preference = null;
  try {
    preference = localStorage.getItem("a2g-motion");
  } catch {}
  let disabled = preference === "off" || reduced.matches;
  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "motion-toggle";
  document.body.append(toggle);
  const scenes = [...document.querySelectorAll("[data-scene]")];
  const tech = document.querySelector("#technologie");
  tech?.classList.add("story-tech");
  let enabled = false,
    scheduled = false;
  const clamp = (value) => Math.min(1, Math.max(0, value));
  function sceneProgress(scene) {
    const rect = scene.getBoundingClientRect();
    const sticky =
      scene.querySelector(".scene-sticky") || scene.firstElementChild;
    return clamp(-rect.top / Math.max(1, rect.height - sticky.offsetHeight));
  }
  function frame(scene, index) {
    const img = scene.querySelector(".scroll-model");
    if (!img || Number(img.dataset.frame) === index) return;
    img.dataset.frame = index;
    img.src = `/images/machine-frames/${String(index).padStart(3, "0")}.png`;
    scene.querySelector(".model-angle").textContent = `${index * 10}°`;
    scene.querySelector(".model-range").value = index;
  }
  function showChapter(scene, index) {
    if (scene.dataset.active === String(index)) return;
    scene.dataset.active = index;
    scene.querySelectorAll("[data-chapter]").forEach((chapter, i) => {
      chapter.hidden = enabled && i !== index;
    });
    scene
      .querySelectorAll("[data-chapter-go]")
      .forEach((button, i) =>
        button.setAttribute("aria-pressed", String(i === index)),
      );
  }
  function update() {
    scheduled = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max) : 0})`;
    if (!enabled) return;
    for (const scene of scenes) {
      const p = sceneProgress(scene);
      scene.style.setProperty("--scene-progress", p);
      showChapter(scene, Math.min(2, Math.floor(p * 3)));
      if (scene.dataset.scene === "model")
        frame(scene, Math.min(35, Math.round(p * 35)));
    }
    if (tech) {
      const index = Math.min(5, Math.floor(sceneProgress(tech) * 6));
      if (tech.dataset.scrollStep !== String(index)) {
        tech.dataset.scrollStep = index;
        selectStep(index);
      }
    }
  }
  function queue() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }
  function configure() {
    enabled = !disabled && !reduced.matches && suitable.matches;
    root.classList.toggle("has-scroll-scenes", enabled);
    root.classList.toggle("motion-off", disabled || reduced.matches);
    toggle.disabled = reduced.matches;
    toggle.textContent = reduced.matches
      ? "Reduzierte Bewegung"
      : disabled
        ? "Animationen einschalten"
        : "Animationen ausschalten";
    toggle.setAttribute("aria-pressed", String(!disabled && !reduced.matches));
    for (const scene of scenes) {
      scene.querySelectorAll("[data-chapter]").forEach((chapter) => {
        chapter.hidden = false;
      });
      delete scene.dataset.active;
      scene.style.setProperty(
        "--scene-progress",
        enabled ? sceneProgress(scene) : 1,
      );
      showChapter(
        scene,
        enabled ? Math.min(2, Math.floor(sceneProgress(scene) * 3)) : 0,
      );
    }
    if (tech) delete tech.dataset.scrollStep;
    queue();
  }
  toggle.addEventListener("click", () => {
    disabled = !disabled;
    preference = disabled ? "off" : "on";
    try {
      localStorage.setItem("a2g-motion", disabled ? "off" : "on");
    } catch {}
    configure();
  });
  reduced.addEventListener("change", () => {
    disabled = reduced.matches || preference === "off";
    configure();
  });
  suitable.addEventListener("change", configure);
  for (const scene of scenes) {
    scene.querySelectorAll("[data-chapter-go]").forEach((button, i) => {
      button.addEventListener("click", () => {
        if (enabled) {
          const travel =
            scene.offsetHeight -
            scene.querySelector(".scene-sticky").offsetHeight;
          scrollTo({
            top:
              scrollY +
              scene.getBoundingClientRect().top +
              travel * ((i + 0.1) / 3),
            behavior: "smooth",
          });
        } else {
          scene.querySelector(`[data-chapter="${i}"]`).scrollIntoView({
            behavior: disabled ? "instant" : "smooth",
            block: "center",
          });
        }
      });
    });
    scene
      .querySelector(".model-range")
      ?.addEventListener("input", (event) =>
        frame(scene, Number(event.target.value)),
      );
    const model = scene.querySelector(".scroll-model");
    if (model) {
      // Preload the actual CAD rotation views only near the product scene.
      const loader = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          for (let i = 0; i < 36; i++) {
            const image = new Image();
            image.src = `/images/machine-frames/${String(i).padStart(3, "0")}.png`;
          }
          loader.disconnect();
        },
        { rootMargin: "500px" },
      );
      loader.observe(scene);
    }
  }
  tech?.addEventListener("process-select", (event) => {
    if (!enabled) return;
    const travel = tech.offsetHeight - tech.firstElementChild.offsetHeight;
    scrollTo({
      top:
        scrollY +
        tech.getBoundingClientRect().top +
        travel * ((event.detail + 0.1) / 6),
      behavior: "smooth",
    });
  });
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    if (!disabled) element.classList.add("reveal-pending");
    observer.observe(element);
  });
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  configure();
}
