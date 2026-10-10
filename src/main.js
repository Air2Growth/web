import "./graphics.css";
import { initGraphics } from "./graphics.js";
import "./visual-pages.css";
import "./scroll.css";
import "./mobile.css";
import "./identity.css";
import "./subpage-headers.css";
import "./faq.css";
import "./icons.css";
import "./mobile-simplify.css";
import "./design-system.css";
import { initMobileDisclosures } from "./mobile-simplify.js";
import { initScrollStories } from "./scroll.js";
import { initLanguage, translate as t } from "./i18n.js";

initLanguage();
initMobileDisclosures();

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu(returnFocus = false) {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", t("Menü öffnen"));
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  navigation.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    t(open ? "Menü schließen" : "Menü öffnen"),
  );
  if (open) navigation.querySelector("a")?.focus({ preventScroll: true });
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open"))
    closeMenu(true);
});
document.addEventListener("pointerdown", (event) => {
  if (!navigation.contains(event.target) && !menuToggle.contains(event.target))
    closeMenu();
});
document.addEventListener("focusin", (event) => {
  if (!navigation.contains(event.target) && !menuToggle.contains(event.target))
    closeMenu();
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
  document.querySelector("#process-kicker").textContent = t(step.kicker);
  document.querySelector("#process-title").textContent = t(step.title);
  document.querySelector("#process-description").textContent = t(
    step.description,
  );
  document.querySelector(".flow-label").textContent = t(step.input);
  document.querySelector(".output-label").textContent = t(step.output);
  document.querySelector(".reactor-label span").textContent = t(step.reactor);
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
      tab.dispatchEvent(
        new CustomEvent("process-select", { bubbles: true, detail: next }),
      );
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
    const topic = interest.selectedOptions[0].textContent.trim();
    const subject = `${topic} – Air2Growth ${t("Anfrage von")} ${data.get("name")}`;
    const body = `${t("Name")}: ${data.get("name")}\n${t("E-Mail")}: ${data.get("email")}\n${t("Thema")}: ${topic}\n\n${data.get("message")}`;
    const mailto = `mailto:info@air2growth.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    contactForm.querySelector(".form-status").textContent = t(
      "Ihr E-Mail-Programm wird geöffnet. Bitte senden Sie die Nachricht dort ab. Falls es sich nicht öffnet, schreiben Sie direkt an info@air2growth.com.",
    );
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();

initScrollStories(selectStep);

initGraphics();
