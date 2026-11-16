/* ==========================================================================
   components.js — shared header/footer without a build step.

   Usage in any page:
     <site-header></site-header>   ... page content ...   <site-footer></site-footer>
     <script type="module" src="/js/components.js"></script>

   Each custom element fetches its HTML fragment from /partials once and
   injects it (light DOM, so existing CSS keeps working). The active nav link
   is marked with aria-current="page".
   ========================================================================== */

/** Fragment cache: one network request per partial, shared across instances. */
const fragmentCache = new Map();

function loadFragment(url) {
  if (!fragmentCache.has(url)) {
    fragmentCache.set(
      url,
      fetch(url, { headers: { Accept: "text/html" } }).then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
        return res.text();
      }),
    );
  }
  return fragmentCache.get(url);
}

/** Mark the nav link matching the current path as the active one. */
function markActiveLink(root) {
  const current = normalize(location.pathname);
  for (const link of root.querySelectorAll(".site-nav a")) {
    if (normalize(new URL(link.getAttribute("href"), location.origin).pathname) === current) {
      link.setAttribute("aria-current", "page");
    }
  }
}

/** Treat "/" and "/index.html" as the same page. */
function normalize(path) {
  return path.replace(/\/index\.html$/, "/");
}

class SiteHeader extends HTMLElement {
  async connectedCallback() {
    try {
      this.innerHTML = await loadFragment("/partials/header.html");
      markActiveLink(this);
    } catch {
      // Minimal fallback so a missing partial never leaves the page stuck.
      this.innerHTML =
        '<header class="site-header"><div class="container">' +
        '<a class="brand" href="/index.html">ResumeTitan</a></div></header>';
    }
  }
}

class SiteFooter extends HTMLElement {
  async connectedCallback() {
    try {
      this.innerHTML = await loadFragment("/partials/footer.html");
    } catch {
      /* Non-critical: fail silently. */
    }
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
