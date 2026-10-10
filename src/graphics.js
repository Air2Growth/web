import { translate as t } from "./i18n.js";

export function initGraphics() {
  const lens = document.querySelector(".lab-lens");
  if (!lens) return;
  const growth = document.querySelector(".lab-growth");
  const buttons = [...document.querySelectorAll("[data-lab-state]")];
  const status = document.querySelector(".lab-status");
  const labels = {
    air: "CO₂ wird aus der Umgebungsluft nutzbar gemacht.",
    grow: "Licht, Wasser und Nährsalze lassen Biomasse entstehen.",
    harvest: "Algenbiomasse wird als organischer Dünger entnommen.",
  };
  function select(state) {
    lens.dataset.lab = state;
    growth.dataset.lab = state;
    status.textContent = t(labels[state]);
    buttons.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.labState === state),
      ),
    );
  }
  buttons.forEach((button) =>
    button.addEventListener("click", () => select(button.dataset.labState)),
  );
  lens.addEventListener(
    "pointermove",
    (event) => {
      if (document.documentElement.classList.contains("motion-off")) return;
      const rect = lens.getBoundingClientRect();
      lens.style.setProperty(
        "--lens-x",
        `${((event.clientX - rect.left) / rect.width) * 100}%`,
      );
      lens.style.setProperty(
        "--lens-y",
        `${((event.clientY - rect.top) / rect.height) * 100}%`,
      );
    },
    { passive: true },
  );
  lens.addEventListener("pointerleave", () => {
    lens.style.removeProperty("--lens-x");
    lens.style.removeProperty("--lens-y");
  });
  select("grow");
}
