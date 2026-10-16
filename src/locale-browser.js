// This self-contained function also runs inline in <head>, before page paint.
// Keep it free of imports/closures so its source can be embedded at build time.
export function detectLocale(page) {
  const url = new URL(window.location.href);
  const valid = (value) => value === 'de' || value === 'en';
  const explicit = url.searchParams.get('lang');
  let saved = null;
  let persisted = false;
  try {
    saved = window.localStorage.getItem('air2growth-language');
    if (valid(explicit)) {
      window.localStorage.setItem('air2growth-language', explicit);
      saved = explicit;
      persisted = true;
    }
  } catch { /* Language links remain usable when storage is blocked. */ }

  let browser = 'de';
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language || 'de'];
  for (const language of languages) {
    const base = language.toLowerCase().split(/[-_]/)[0];
    if (valid(base)) { browser = base; break; }
  }
  // An English URL is an explicit choice; unprefixed URLs negotiate language.
  const locale = valid(explicit) ? explicit
    : page.locale === 'en' ? 'en' : valid(saved) ? saved : browser;
  if (locale !== page.locale) {
    url.pathname = page.paths[locale];
    window.location.replace(url.pathname + url.search + url.hash);
    return;
  }
  if (valid(explicit) && persisted) {
    url.searchParams.delete('lang');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  }
}

export function initLanguageLinks() {
  const events = new AbortController();
  function refreshLanguageLinks() {
    const current = new URL(window.location.href);
    document.querySelectorAll('a[data-locale-link]').forEach((link) => {
      const target = new URL(link.href, current);
      target.search = current.search;
      target.searchParams.set('lang', link.dataset.localeLink);
      target.hash = current.hash;
      link.href = target.pathname + target.search + target.hash;
    });
  }
  refreshLanguageLinks();
  window.addEventListener('hashchange', refreshLanguageLinks, { signal: events.signal });
  document.addEventListener('click', (event) => {
    if (event.target.closest?.('[data-locale-link]')) refreshLanguageLinks();
  }, { signal: events.signal });

  const current = new URL(window.location.href);
  const fallback = current.searchParams.get('lang');
  // If storage is unavailable, propagate the explicit choice through page links.
  if (fallback === 'de' || fallback === 'en') {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (link.hasAttribute('data-locale-link')) return;
      const target = new URL(link.href, current);
      if (target.origin !== current.origin || target.pathname.startsWith('/api/') || /\.[a-z0-9]+$/i.test(target.pathname)) return;
      target.searchParams.set('lang', fallback);
      link.href = target.pathname + target.search + target.hash;
    });
  }
  return () => events.abort();
}
