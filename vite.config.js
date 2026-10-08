import { fileURLToPath } from "node:url";

const pages = [
  "index",
  "produkt",
  "technologie",
  "vorteile",
  "team",
  "investoren",
  "kontakt",
];

export default {
  build: {
    rolldownOptions: {
      input: Object.fromEntries(
        pages.map((page) => [
          page,
          fileURLToPath(new URL(`./${page}.html`, import.meta.url)),
        ]),
      ),
    },
  },
};
