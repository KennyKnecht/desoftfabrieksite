(function () {
  // Privacy modal
  const privacyModal = document.getElementById("privacy-modal");
  const openPrivacyBtns = Array.from(document.querySelectorAll("[data-open-privacy]"));
  const closePrivacyEls = Array.from(document.querySelectorAll("[data-close-privacy]"));

  function openPrivacy() {
    if (!privacyModal) return;
    privacyModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closePrivacy() {
    if (!privacyModal) return;
    privacyModal.hidden = true;
    document.body.style.overflow = "";
  }

  openPrivacyBtns.forEach(btn => btn.addEventListener("click", openPrivacy));
  closePrivacyEls.forEach(el => el.addEventListener("click", closePrivacy));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePrivacy();
  });

  const YEAR = document.getElementById("year");
  if (YEAR) YEAR.textContent = String(new Date().getFullYear());

  // Cookie consent (simple, GDPR-friendly default: no tracking scripts loaded)
  const CONSENT_KEY = "dsf_cookie_consent"; // "accepted" | "rejected"
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-reject");
  const settingsBtn = document.getElementById("cookie-settings");

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch {}
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
  }

  // Show banner only if no choice made yet
  const consent = getConsent();
  if (!consent) showBanner();

  acceptBtn?.addEventListener("click", () => {
    setConsent("accepted");
    hideBanner();
    // If you add analytics later, load them here ONLY after accept.
  });

  rejectBtn?.addEventListener("click", () => {
    setConsent("rejected");
    hideBanner();
  });

  settingsBtn?.addEventListener("click", () => {
    showBanner();
  });

  // Shrinking header on scroll (smooth interpolation)
  const topbar = document.querySelector(".topbar");
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // How many pixels of scroll until we reach "normal" size
  const SHRINK_DISTANCE = 240;

  function setVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  function onScroll() {
    const y = window.scrollY || 0;
    const t = clamp(y / SHRINK_DISTANCE, 0, 1);

    // From big (landing) -> small (current)
    setVar("--topbar-pad", `${lerp(28, 14, t)}px`);
    setVar("--logo", `${lerp(76, 48, t)}px`);
    setVar("--name", `${lerp(28, 18, t)}px`);
    setVar("--tagline", `${lerp(15, 13, t)}px`);
    setVar("--nav", `${lerp(16, 14, t)}px`);

    if (topbar) topbar.classList.toggle("is-scrolled", y > 4);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load

  // Optional: highlight active nav link on scroll
  const links = Array.from(document.querySelectorAll(".nav__link"))
    .filter(a => a.getAttribute("href")?.startsWith("#"));

  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = "#" + entry.target.id;
      const link = links.find(a => a.getAttribute("href") === id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 });

  sections.forEach(s => obs.observe(s));
})();
