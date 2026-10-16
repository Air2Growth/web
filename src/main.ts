// One Vite styling pipeline: Tailwind utilities, local fonts and brand tokens.
import "./styles.css";
import { initLanguageLinks } from "./locale-browser.js";
import "./site.js";
import "./experience.js";
// Poster styles remain available when the optional animation chunk cannot load.
import "./function-tour.css";
import "./supporters.css";

const cleanupLanguages = initLanguageLinks();
if (import.meta.hot) import.meta.hot.dispose(cleanupLanguages);

const supporters = document.querySelector<HTMLElement>("[data-supporters]");
if (supporters) {
  import("./supporters.js").then(({ initSupporters }) => {
    const cleanup = initSupporters(supporters);
    if (import.meta.hot) import.meta.hot.dispose(cleanup);
  }).catch((error) => console.error("The logo animation could not load; the complete supporter list remains visible.", error));
}

const tour = document.querySelector<HTMLElement>("[data-function-tour]");
if (tour) {
  import("./function-tour.js").then(({ initFunctionTour }) => {
    const cleanup = initFunctionTour(tour);
    if (import.meta.hot) import.meta.hot.dispose(cleanup);
  }).catch((error) => console.error("The illustrated tour could not load; its written explanation is available below.", error));
}
