/* ==========================================================================
   preview.js — render the resume into the srcdoc iframe.

   The iframe is same-origin (about:srcdoc) and inherits the parent's base URL,
   so the template stylesheets resolve as usual. Height is synced to the
   document so the pane scrolls naturally.
   ========================================================================== */

import { renderResume } from "./templates/professional.js";

/** Wrap rendered resume HTML in a standalone document. */
function buildDocument(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="/css/templates/professional.css">
<link rel="stylesheet" href="/css/print.css">
</head>
<body class="resume-doc">${bodyHtml}</body>
</html>`;
}

/**
 * @param {HTMLIFrameElement} iframe
 */
export function createPreview(iframe) {
  let observer = null;
  let loaded = false;

  function syncHeight() {
    try {
      const doc = iframe.contentDocument;
      if (!doc || !doc.body) return;
      const height = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
      if (height > 0) iframe.style.height = `${height}px`;
    } catch {
      /* not ready yet */
    }
  }

  function observe() {
    if (observer) observer.disconnect();
    const doc = iframe.contentDocument;
    if (!doc || !doc.body || typeof ResizeObserver === "undefined") return;
    observer = new ResizeObserver(syncHeight);
    observer.observe(doc.body);
    syncHeight();
  }

  iframe.addEventListener("load", () => {
    loaded = true;
    observe();
  });
  window.addEventListener("resize", syncHeight);

  return {
    /** @param {object} resume JSON-Resume document */
    render(resume) {
      const html = renderResume(resume);
      const doc = iframe.contentDocument;
      // Patch the body in place once the document (and its stylesheets) have
      // loaded — avoids a full iframe reload/flicker on every keystroke.
      if (loaded && doc && doc.body) {
        doc.body.innerHTML = html;
        syncHeight();
      } else {
        iframe.srcdoc = buildDocument(html);
      }
    },
    syncHeight,
  };
}
