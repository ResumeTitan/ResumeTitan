/* ==========================================================================
   state.js — single in-memory resume document + tiny pub/sub.

   The resume is shaped exactly like the stored JSON-Resume document, so saving
   is one PUT and the template renderer consumes it unchanged. Part 1 only
   loads the mock; later parts mutate it through setResume().
   ========================================================================== */

let resume = null;
const subscribers = new Set();

/** Current resume document (may be null before load). */
export function getResume() {
  return resume;
}

/** Replace the resume document and notify subscribers. */
export function setResume(next) {
  resume = next;
  for (const fn of subscribers) fn(resume);
  return resume;
}

/**
 * Subscribe to resume changes. Calls back immediately with the current value.
 * @returns {() => void} unsubscribe
 */
export function subscribe(fn) {
  subscribers.add(fn);
  fn(resume);
  return () => subscribers.delete(fn);
}

/**
 * Load a resume document. Defaults to the static mock until the API exists.
 * @param {string} url
 */
export async function loadResume(url = "/mock/resume.json") {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Failed to load resume: ${res.status}`);
  return setResume(await res.json());
}
