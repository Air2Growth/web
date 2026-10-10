export const supportedLanguages = ["de", "en"];
export const languageStorageKey = "a2g-language";

export function isSupportedLanguage(language) {
  return supportedLanguages.includes(language);
}

// Browser preferences are ordered. Use the first language we can display,
// including regional variants such as de-AT, de-CH and en-GB.
export function detectLanguage(languages = []) {
  for (const language of languages) {
    const base = String(language).toLowerCase().split(/[-_]/)[0];
    if (isSupportedLanguage(base)) return base;
  }
  return "en";
}

export function resolveLanguage({ requested, saved, languages = [] } = {}) {
  if (isSupportedLanguage(requested)) return requested;
  if (isSupportedLanguage(saved)) return saved;
  return detectLanguage(languages);
}
