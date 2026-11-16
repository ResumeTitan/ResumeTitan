/* ==========================================================================
   sanitize.js — allow-list HTML sanitizer for rich-text fields.

   Rich fields (summary, descriptions, highlights) store HTML so bold/italic/
   list formatting survives. Before that HTML is written into the preview
   iframe (or anywhere else) it is run through here, which strips everything
   except a small set of formatting tags.
   ========================================================================== */

const ALLOWED = new Set([
  "B", "STRONG", "I", "EM", "U", "S", "BR", "P", "DIV", "SPAN",
  "UL", "OL", "LI",
]);

/** Only http(s), mailto, and tel links survive. */
function safeHref(href) {
  const value = String(href || "").trim();
  return /^(https?:|mailto:|tel:)/i.test(value) ? value : null;
}

/** Recursively rebuild `node`'s children as a list of safe nodes. */
function sanitizeChildren(node) {
  const out = [];
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      out.push(document.createTextNode(child.nodeValue));
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    if (!ALLOWED.has(child.tagName)) {
      // Unwrap: keep the text/children, drop the element itself.
      out.push(...sanitizeChildren(child));
      continue;
    }

    const el = document.createElement(child.tagName.toLowerCase());
    for (const attr of child.attributes) {
      if (child.tagName === "A" && attr.name.toLowerCase() === "href") {
        const href = safeHref(attr.value);
        if (href) {
          el.setAttribute("href", href);
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener noreferrer");
        }
      }
    }
    for (const safe of sanitizeChildren(child)) el.appendChild(safe);
    out.push(el);
  }
  return out;
}

/**
 * @param {string} html
 * @returns {string} sanitized HTML (safe to inject)
 */
export function sanitizeHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = String(html ?? "");
  const container = document.createElement("div");
  for (const node of sanitizeChildren(template.content)) container.appendChild(node);
  return container.innerHTML;
}
