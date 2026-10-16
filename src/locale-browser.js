// Language URLs are stable canonical paths: German URLs stay German and
// /en URLs stay English. No automatic redirect, no browser negotiation,
// no stored preference and no ?lang propagation.
export function initLanguageLinks() {
  const events = new AbortController();
  function cleanQuery(search) {
    const params = new URLSearchParams(search);
    params.delete("lang");
    const query = params.toString();
    return query ? `?${query}` : "";
  }
  function refreshLanguageLinks() {
    const current = new URL(window.location.href);
    const suffix = cleanQuery(current.search) + current.hash;
    document.querySelectorAll("a[data-locale-link]").forEach((link) => {
      const target = new URL(link.href, current);
      link.href = target.pathname + suffix;
    });
  }
  refreshLanguageLinks();
  // Drop a legacy ?lang parameter from the address bar without redirecting
  // or changing content; old shared links keep rendering the URL language.
  try {
    const current = new URL(window.location.href);
    if (current.searchParams.has("lang")) {
      current.searchParams.delete("lang");
      window.history.replaceState(
        window.history.state,
        "",
        current.pathname + (current.searchParams.toString() ? `?${current.searchParams}` : "") + current.hash,
      );
    }
  } catch { /* Address bar stays usable when history is unavailable. */ }
  window.addEventListener("hashchange", refreshLanguageLinks, { signal: events.signal });
  document.addEventListener(
    "click",
    (event) => {
      if (event.target.closest?.("[data-locale-link]")) refreshLanguageLinks();
    },
    { signal: events.signal },
  );
  return () => events.abort();
}
