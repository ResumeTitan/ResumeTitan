/* ==========================================================================
   editor.js — bootstraps the builder shell.

   Owns: tab switching (with URL-hash routing so back/forward works), the
   resizable split, the "coming soon" content for the four non-Content tabs,
   and wiring state -> live preview. Section editing lives in section-view.js.
   ========================================================================== */

import { loadResume, subscribe } from "./state.js";
import { createPreview } from "./preview.js";
import { mountSectionView } from "./section-view.js";

const SPLIT_MIN = 30;
const SPLIT_MAX = 70;
const SPLIT_STEP = 2;

const CHECK_SVG =
  '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><path d="M3 8.5 6.2 12 13 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Intentional "coming soon" content for the tabs outside the locked scope. */
const STUB_TABS = {
  design: {
    tagline: "Control how your resume looks — without touching the content.",
    features: [
      "Switch between resume themes and layouts",
      "Choose fonts, sizes, and line spacing",
      "Set accent colors and section spacing",
      "Reorder sections to match the job",
    ],
  },
  analysis: {
    tagline: "Score your resume and get a checklist of fixes.",
    features: [
      "Spot missing or thin sections",
      "Flag inconsistent dates and formatting",
      "Check ATS-friendliness and readability",
      "Apply suggested fixes in one click",
    ],
  },
  matching: {
    tagline: "See how well your resume matches a specific job.",
    features: [
      "Paste a job description to target",
      "Review keyword overlap and gaps",
      "Get tailored bullet suggestions",
      "Track your match score over time",
    ],
  },
  cover: {
    tagline: "Draft a cover letter that reuses your best material.",
    features: [
      "Generate a draft from a job description",
      "Pull in highlights from your resume",
      "Edit with the same rich-text tools",
      "Export alongside your resume",
    ],
  },
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/** Show one tab panel and sync aria state across the strip. */
function initTabs() {
  const tabs = Array.from(document.querySelectorAll('#builder-tabs [role="tab"]'));
  const strip = document.getElementById("builder-tabs");
  const names = tabs.map((tab) => tab.dataset.tab);
  const nameSet = new Set(names);

  function select(name) {
    const target = nameSet.has(name) ? name : names[0];
    for (const tab of tabs) {
      const active = tab.dataset.tab === target;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) panel.hidden = !active;
    }
  }

  // Setting the hash creates a history entry, so back/forward move between tabs.
  function activate(name) {
    const target = nameSet.has(name) ? name : names[0];
    if (location.hash.slice(1) === target) select(target);
    else location.hash = target;
  }

  for (const tab of tabs) {
    tab.addEventListener("click", () => activate(tab.dataset.tab));
  }

  strip.addEventListener("keydown", (event) => {
    const i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      next.focus();
      activate(next.dataset.tab);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next = event.key === "Home" ? tabs[0] : tabs[tabs.length - 1];
      next.focus();
      activate(next.dataset.tab);
    }
  });

  window.addEventListener("hashchange", () => select(location.hash.slice(1)));

  // Normalize the initial hash so the address bar always reflects the tab.
  const initial = location.hash.slice(1);
  const start = nameSet.has(initial) ? initial : names[0];
  if (initial !== start) history.replaceState(null, "", `#${start}`);
  select(start);
}

/** Fill each stub panel with a "coming soon" state and tag its tab. */
function renderStubPanels() {
  for (const [name, config] of Object.entries(STUB_TABS)) {
    const panel = document.getElementById(`panel-${name}`);
    const tab = document.querySelector(`#builder-tabs [data-tab="${name}"]`);
    if (!panel || !tab) continue;

    if (!tab.querySelector(".tab__soon")) {
      tab.appendChild(el("span", "tab__soon", "Soon"));
    }

    const title = tab.querySelector("span:not([class])")?.textContent || name;
    const glyph = tab.querySelector(".tab__icon")?.cloneNode(true);
    if (glyph) glyph.setAttribute("class", "coming-soon__glyph");

    const iconWrap = el("div", "coming-soon__icon");
    if (glyph) iconWrap.appendChild(glyph);

    const pill = el("span", "coming-soon__pill", "Coming soon");
    const heading = el("h2", "coming-soon__title", title);
    const tagline = el("p", "coming-soon__tagline text-muted", config.tagline);

    const list = el("ul", "coming-soon__list");
    list.setAttribute("role", "list");
    for (const feature of config.features) {
      const item = el("li", "coming-soon__item");
      const check = el("span", "coming-soon__check");
      check.innerHTML = CHECK_SVG;
      item.append(check, el("span", null, feature));
      list.appendChild(item);
    }

    const card = el("div", "coming-soon");
    card.append(iconWrap, pill, heading, tagline, list);
    panel.replaceChildren(card);
  }
}

/** Drag (or arrow-key) the divider between the editor and preview. */
function initSplit() {
  const split = document.getElementById("split");
  const handle = document.getElementById("split-handle");
  if (!split || !handle) return;

  const clamp = (pct) => Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, pct));
  let dragging = false;

  function apply(pct) {
    const value = clamp(pct);
    split.style.setProperty("--split", `${value}%`);
    handle.setAttribute("aria-valuenow", String(Math.round(value)));
  }

  function pctFromPointer(clientX) {
    const rect = split.getBoundingClientRect();
    if (!rect.width) return 55;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  handle.addEventListener("pointerdown", (event) => {
    dragging = true;
    handle.dataset.dragging = "true";
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  handle.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    apply(pctFromPointer(event.clientX));
  });

  function end() {
    dragging = false;
    handle.dataset.dragging = "false";
  }
  handle.addEventListener("pointerup", end);
  handle.addEventListener("pointercancel", end);

  handle.addEventListener("keydown", (event) => {
    const current = Number(handle.getAttribute("aria-valuenow")) || 55;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      apply(current - SPLIT_STEP);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      apply(current + SPLIT_STEP);
    }
  });
}

async function boot() {
  initTabs();
  renderStubPanels();
  initSplit();

  const preview = createPreview(document.getElementById("preview-iframe"));
  subscribe((resume) => {
    if (resume) preview.render(resume);
  });

  mountSectionView(document.getElementById("editor-pane"));

  try {
    await loadResume();
  } catch (error) {
    console.error("[editor] failed to load resume", error);
  }
}

boot();
