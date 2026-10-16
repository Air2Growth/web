// One Vite styling pipeline: Tailwind utilities, local fonts and brand tokens.
import "./styles.css";
import "./site.js";
import "./experience.js";
// Poster styles remain available when the optional animation chunk cannot load.
import "./function-tour.css";

const tour = document.querySelector<HTMLElement>("[data-function-tour]");
if (tour) {
  import("./function-tour.js").then(({ initFunctionTour }) => {
    const cleanup = initFunctionTour(tour);
    if (import.meta.hot) import.meta.hot.dispose(cleanup);
  }).catch((error) => console.error("The illustrated tour could not load; its written explanation is available below.", error));
}
