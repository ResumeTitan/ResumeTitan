/* ==========================================================================
   format.js — shared display formatting for dates and ranges.

   Used by both the template renderer and the editor's section view so the
   preview and the item rows always agree.
   ========================================================================== */

/**
 * "2022-03" -> "03/2022". Empty/null/unparseable -> "".
 * Deliberately only ever emits digits and "/", so callers can interpolate the
 * result without escaping.
 */
export function formatDate(iso) {
  if (!iso) return "";
  const match = /^(\d{4})-(\d{2})/.exec(String(iso));
  return match ? `${match[2]}/${match[1]}` : "";
}

/**
 * A human date range.
 * @param {string} start
 * @param {string} end
 * @param {boolean} [current] true -> end renders as "Present"
 * @returns {string} e.g. "03/2022 – Present", "03/2022", or ""
 */
export function dateRange(start, end, current) {
  const from = formatDate(start);
  const to = current ? "Present" : formatDate(end);
  if (from && to) return `${from} \u2013 ${to}`;
  return from || to || "";
}
