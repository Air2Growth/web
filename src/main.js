import "./graphics.css";
import { initGraphics } from "./graphics.js";
import "./visual-pages.css";
import "./scroll.css";
import { initScrollStories } from "./scroll.js";
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Menü öffnen");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  navigation.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Menü schließen" : "Menü öffnen",
  );
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.matchMedia("(min-width: 961px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const steps = [
  {
    kicker: "Schritt 01 / Luftansaugung",
    title: "Umgebungsluft ist der Ausgangspunkt.",
    description: "Ventilatoren bringen Umgebungsluft zum CO₂-Filter.",
    input: "Luft",
    output: "Filter",
    reactor: "Luftansaugung",
  },
  {
    kicker: "Schritt 02 / CO₂-Bindung",
    title: "Ein Filter macht CO₂ nutzbar.",
    description: "Ein Sorbens bindet das CO₂ aus der Luft.",
    input: "Luft",
    output: "CO₂",
    reactor: "CO₂-Bindung",
  },
  {
    kicker: "Schritt 03 / Regeneration",
    title: "Vom Filter in die Nährlösung.",
    description: "Die Nährlösung löst CO₂ aus dem Filter.",
    input: "Filter",
    output: "Lösung",
    reactor: "Regeneration",
  },
  {
    kicker: "Schritt 04 / Algenversorgung",
    title: "Der Rohstoff erreicht die Algen.",
    description: "CO₂ und Nährsalze erreichen die Mikroalgen.",
    input: "Lösung",
    output: "Algen",
    reactor: "Algenversorgung",
  },
  {
    kicker: "Schritt 05 / Wachstum",
    title: "Mit Licht entsteht neue Biomasse.",
    description: "Mit Licht und Wasser entsteht durch Photosynthese Biomasse.",
    input: "Licht",
    output: "Biomasse",
    reactor: "Photosynthese",
  },
  {
    kicker: "Schritt 06 / Ernte",
    title: "Vom Reaktor zurück aufs Feld.",
    description: "Die Algenbiomasse wird als organischer Dünger entnommen.",
    input: "Biomasse",
    output: "Dünger",
    reactor: "Ernte",
  },
];
const tabs = [...document.querySelectorAll("[data-step]")];
const panel = document.querySelector("#process-panel");
function selectStep(index, focus = false) {
  const step = steps[index];
  if (!panel || !step) return;
  tabs.forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", `tab-${index}`);
  panel.dataset.active = index;
  document.querySelector("#process-kicker").textContent = step.kicker;
  document.querySelector("#process-title").textContent = step.title;
  document.querySelector("#process-description").textContent = step.description;
  document.querySelector(".flow-label").textContent = step.input;
  document.querySelector(".output-label").textContent = step.output;
  document.querySelector(".reactor-label span").textContent = step.reactor;
  if (focus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    selectStep(index);
    tab.dispatchEvent(
      new CustomEvent("process-select", { bubbles: true, detail: index }),
    );
  });
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = (index + 1) % tabs.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectStep(next, true);
    }
  });
});

// The contact form belongs only to the dedicated contact page.
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const interest = contactForm.querySelector("#contact-interest");
  const requestedTopic = new URLSearchParams(window.location.search).get(
    "thema",
  );
  if ([...interest.options].some((option) => option.value === requestedTopic)) {
    interest.value = requestedTopic;
  }
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = `${data.get("interest")} – Air2Growth Anfrage von ${data.get("name")}`;
    const body = `Name: ${data.get("name")}\nE-Mail: ${data.get("email")}\nThema: ${data.get("interest")}\n\n${data.get("message")}`;
    const mailto = `mailto:info@air2growth.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    contactForm.querySelector(".form-status").textContent =
      "Ihr E-Mail-Programm wird geöffnet. Bitte senden Sie die Nachricht dort ab. Falls es sich nicht öffnet, schreiben Sie direkt an info@air2growth.com.";
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();

initScrollStories(selectStep);

initGraphics();
