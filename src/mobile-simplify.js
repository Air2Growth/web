// Optional long-form content stays expanded on desktop and opens on demand on phones.
export function initMobileDisclosures() {
  const mobile = matchMedia("(max-width: 760px)");
  const disclosures = [
    ...document.querySelectorAll("[data-mobile-disclosure]"),
  ];
  const mobileChoices = new WeakMap();
  function configure() {
    for (const disclosure of disclosures) {
      disclosure.open = mobile.matches
        ? (mobileChoices.get(disclosure) ?? false)
        : true;
    }
  }
  for (const disclosure of disclosures) {
    // Listen to user input, rather than toggle events also caused by a resize.
    disclosure
      .querySelector(":scope > summary")
      .addEventListener("click", () => {
        if (mobile.matches) mobileChoices.set(disclosure, !disclosure.open);
      });
  }
  function revealAnchor() {
    if (!location.hash) return;
    let target;
    try {
      target = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
    } catch {
      return;
    }
    const disclosure =
      target?.closest("[data-mobile-disclosure]") ??
      target?.querySelector(":scope > [data-mobile-disclosure]");
    if (disclosure) {
      mobileChoices.set(disclosure, true);
      disclosure.open = true;
      requestAnimationFrame(() => {
        const visibleTarget = target.getClientRects().length
          ? target
          : disclosure;
        visibleTarget.scrollIntoView();
      });
    }
  }
  mobile.addEventListener("change", configure);
  window.addEventListener("hashchange", revealAnchor);
  configure();
  revealAnchor();
}
