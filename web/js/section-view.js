/* ==========================================================================
   section-view.js — renders the left editor pane.

   Builds the section accordion from the SECTIONS schema and re-renders bodies
   from state. Part 3 adds inline editing: edit / add / delete open a form in
   place (form.js), typing updates state live (so the preview follows), Cancel
   restores a snapshot, Save just closes.
   ========================================================================== */

import {
  SECTIONS,
  findSection,
  getSingle,
  getItems,
  itemTitle,
  itemMeta,
  itemNotes,
  isHidden,
  toggleHidden,
} from "./sections.js";
import { getResume, setResume, subscribe } from "./state.js";
import { buildItemForm } from "./form.js";
import { sanitizeHtml } from "./sanitize.js";

const SVG = {
  chevron:
    '<svg class="acc__chevron" viewBox="0 0 16 20" width="16" height="16" fill="none" aria-hidden="true"><path d="M2 7l6 7 6-7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  ellipsis:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
  pencil:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.4 3.6a1 1 0 0 1 3 3L7.4 18.6a2 2 0 0 1-.9.5l-2.8.8a.5.5 0 0 1-.6-.6l.8-2.9a2 2 0 0 1 .5-.8z"/><path d="m15 5 3 3"/></svg>',
  copy:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/></svg>',
  locate:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12h3"/><path d="M19 12h3"/><path d="M12 2v3"/><path d="M12 19v3"/><circle cx="12" cy="12" r="7"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
};

/** Sections expanded on first load (matches the Teal capture). */
const initiallyOpen = new Set(["projects"]);

// --- module state ---------------------------------------------------------
const sectionEls = new Map();
let root = null;
/** @type {{sectionId:string,index:number,single:boolean,isNew:boolean,snapshot:any}|null} */
let editing = null;

const clone = (value) => (value == null ? value : JSON.parse(JSON.stringify(value)));

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function setPath(obj, path, value) {
  const keys = path.split(".");
  let node = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    if (typeof node[keys[i]] !== "object" || node[keys[i]] === null) node[keys[i]] = {};
    node = node[keys[i]];
  }
  node[keys[keys.length - 1]] = value;
}

function fieldOf(section, key) {
  return section.fields.find((field) => field.key === key) || { key };
}

// --- small DOM helpers ----------------------------------------------------
function iconAction(icon, label, onClick) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "icon-btn icon-btn--sm";
  el.setAttribute("aria-label", label);
  el.title = label;
  el.innerHTML = SVG[icon];
  if (onClick) el.addEventListener("click", onClick);
  else {
    el.dataset.stub = "";
    el.title = `${label} — coming in a later part`;
  }
  return el;
}

function renderNotes(notes) {
  if (!notes) return null;
  const wrap = document.createElement("div");
  wrap.className = "item__notes";

  if (notes.type === "rich-list") {
    const ul = document.createElement("ul");
    ul.className = "notes-list";
    for (const html of notes.items) {
      const li = document.createElement("li");
      li.innerHTML = sanitizeHtml(html);
      ul.appendChild(li);
    }
    wrap.appendChild(ul);
  } else {
    const p = document.createElement("p");
    p.className = "notes-text";
    p.innerHTML = sanitizeHtml(notes.text);
    wrap.appendChild(p);
  }
  return wrap;
}

function renderMain(title, meta, notes, checkbox) {
  const main = document.createElement("div");
  main.className = "item__main";

  const heading = document.createElement("div");
  heading.className = "item__heading";
  if (checkbox) heading.appendChild(checkbox);
  const label = document.createElement("span");
  label.className = "item__title";
  label.textContent = title;
  heading.appendChild(label);
  main.appendChild(heading);

  const metaEl = document.createElement("div");
  metaEl.className = "item__meta";
  metaEl.textContent = meta.join(" \u00b7 ");
  main.appendChild(metaEl);

  const notesEl = renderNotes(notes);
  if (notesEl) main.appendChild(notesEl);
  return main;
}

// --- rows -----------------------------------------------------------------
function renderItem(section, item, index) {
  const li = document.createElement("li");
  li.className = "item";
  li.dataset.index = String(index);
  if (isHidden(item)) li.dataset.hidden = "true";

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "check";
  check.checked = !isHidden(item);
  check.setAttribute("aria-label", `${itemTitle(section, item)} included`);
  check.addEventListener("change", () => {
    setResume(toggleHidden(getResume(), section.id, index));
  });

  const main = renderMain(itemTitle(section, item), itemMeta(section, item), itemNotes(section, item), check);

  const actions = document.createElement("div");
  actions.className = "item__actions";
  actions.append(
    iconAction("pencil", `Edit ${section.title}`, () => startEdit(section.id, index)),
    iconAction("copy", `Duplicate ${section.title}`),
    iconAction("locate", "Scroll to item in preview"),
    iconAction("trash", `Delete ${section.title}`, () => removeItem(section.id, index)),
  );

  li.append(main, actions);
  return li;
}

function renderSingle(section) {
  const basics = getSingle(getResume() || {});
  const main = renderMain(section.primary(basics) || section.title, itemMeta(section, basics), itemNotes(section, basics), null);
  const row = document.createElement("div");
  row.className = "item item--single";
  row.append(main);
  return row;
}

function emptyState(section) {
  const p = document.createElement("p");
  p.className = "item-list__empty text-muted";
  p.textContent = section.addLabel ? `Nothing yet — ${section.addLabel.toLowerCase()}.` : "Nothing yet.";
  return p;
}

// --- editing --------------------------------------------------------------
function makeBinding(section, index) {
  const resume = getResume();

  if (section.kind === "single") {
    const basics = resume.basics || (resume.basics = {});
    return {
      get: (key) => getPath(basics, fieldOf(section, key).path || key),
      set: (key, value) => setPath(basics, fieldOf(section, key).path || key, value),
    };
  }

  const items = getItems(resume, section);
  if (section.itemType === "string") {
    return { get: () => items[index], set: (_key, value) => { items[index] = value; } };
  }

  const item = items[index];
  return {
    get: (key) => getPath(item, fieldOf(section, key).path || key),
    set: (key, value) => setPath(item, fieldOf(section, key).path || key, value),
  };
}

function buildForm(section, index) {
  const single = section.kind === "single";
  const binding = makeBinding(section, index);

  const form = buildItemForm(section, {
    binding,
    isNew: editing?.isNew,
    onInput: () => setResume(getResume()),
    onSave: () => closeEdit(),
    onCancel: () => cancelEdit(),
    onDelete: single ? undefined : () => removeItem(section.id, index),
  });

  if (single) return form;

  const li = document.createElement("li");
  li.className = "item item--editing";
  li.appendChild(form);
  return li;
}

function focusForm(form) {
  const target = form.querySelector(".rich__editor, input, textarea");
  target?.focus();
}

function closeEdit() {
  const previous = editing;
  editing = null;
  if (previous) renderSection(findSection(previous.sectionId));
}

function cancelEdit() {
  const current = editing;
  if (!current) return;
  const section = findSection(current.sectionId);
  const resume = getResume();

  if (current.isNew && !current.single) {
    getItems(resume, section).splice(current.index, 1);
  } else if (current.single) {
    resume.basics = current.snapshot;
  } else {
    getItems(resume, section)[current.index] = current.snapshot;
  }

  editing = null;
  setResume(resume);
}

function startEdit(sectionId, index) {
  const section = findSection(sectionId);
  const resume = getResume();
  if (editing) closeEdit();

  const single = section.kind === "single";
  editing = {
    sectionId,
    index: single ? -1 : index,
    single,
    isNew: false,
    snapshot: clone(single ? getSingle(resume) : getItems(resume, section)[index]),
  };

  ensureOpen(sectionId);
  renderSection(section);
  focusForm(sectionEls.get(sectionId).querySelector(".item-form"));
}

function addItem(sectionId) {
  const section = findSection(sectionId);
  const resume = getResume();
  if (editing) closeEdit();

  const items = getItems(resume, section);
  items.push(section.newItem());
  editing = { sectionId, index: items.length - 1, single: false, isNew: true, snapshot: null };

  setResume(resume); // preview updates; refresh is a no-op while editing
  ensureOpen(sectionId);
  renderSection(section);
  focusForm(sectionEls.get(sectionId).querySelector(".item-form"));
}

function removeItem(sectionId, index) {
  const section = findSection(sectionId);
  const resume = getResume();
  getItems(resume, section).splice(index, 1);
  editing = null;
  setResume(resume); // triggers a full re-render
}

// --- section bodies -------------------------------------------------------
function renderBody(sectionEl, section) {
  const body = sectionEl.querySelector(".acc__body");
  body.replaceChildren();

  const editingHere = editing && editing.sectionId === section.id;

  if (section.kind === "single") {
    body.appendChild(editingHere ? buildForm(section) : renderSingle(section));
    return;
  }

  const items = getItems(getResume() || {}, section);
  if (!items.length && !editingHere) {
    body.appendChild(emptyState(section));
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "item-list";
  ul.setAttribute("role", "list");
  items.forEach((item, index) => {
    ul.appendChild(editingHere && editing.index === index ? buildForm(section, index) : renderItem(section, item, index));
  });
  body.appendChild(ul);
}

function renderSection(section) {
  const sectionEl = sectionEls.get(section.id);
  if (sectionEl) renderBody(sectionEl, section);
}

function ensureOpen(sectionId) {
  const sectionEl = sectionEls.get(sectionId);
  if (!sectionEl || sectionEl.dataset.state === "open") return;
  sectionEl.dataset.state = "open";
  sectionEl.querySelector(".acc__toggle").setAttribute("aria-expanded", "true");
  sectionEl.querySelector(".acc__body").hidden = false;
}

// --- shell ----------------------------------------------------------------
function buildSection(section) {
  const sectionEl = document.createElement("div");
  sectionEl.className = "acc";
  sectionEl.dataset.section = section.id;

  const open = initiallyOpen.has(section.id);
  sectionEl.dataset.state = open ? "open" : "closed";

  const bodyId = `section-body-${section.id}`;
  const toggleId = `section-toggle-${section.id}`;

  const head = document.createElement("h3");
  head.className = "acc__head";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.id = toggleId;
  toggle.className = "acc__toggle";
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-controls", bodyId);
  toggle.innerHTML = SVG.chevron;
  const title = document.createElement("span");
  title.textContent = section.title;
  toggle.appendChild(title);

  const actions = document.createElement("div");
  actions.className = "acc__actions";
  if (section.kind === "single") {
    actions.appendChild(iconAction("pencil", section.editLabel, () => startEdit(section.id, -1)));
  } else {
    if (section.addLabel) actions.appendChild(iconAction("plus", section.addLabel, () => addItem(section.id)));
    actions.appendChild(iconAction("ellipsis", `${section.title} Actions`));
  }

  head.append(toggle, actions);

  const body = document.createElement("div");
  body.className = "acc__body";
  body.id = bodyId;
  body.role = "region";
  body.setAttribute("aria-labelledby", toggleId);
  body.hidden = !open;

  toggle.addEventListener("click", () => {
    const nowOpen = sectionEl.dataset.state !== "open";
    sectionEl.dataset.state = nowOpen ? "open" : "closed";
    toggle.setAttribute("aria-expanded", String(nowOpen));
    body.hidden = !nowOpen;
  });

  sectionEl.append(head, body);
  sectionEls.set(section.id, sectionEl);
  return sectionEl;
}

/** Re-render every section body from state. */
function rerenderAll() {
  for (const section of SECTIONS) renderSection(section);
}

/**
 * Mount the section accordion into `mount` and keep it in sync with state.
 * @param {HTMLElement} mount
 */
export function mountSectionView(mount) {
  root = mount;
  sectionEls.clear();
  root.replaceChildren();

  const frag = document.createDocumentFragment();
  for (const section of SECTIONS) frag.appendChild(buildSection(section));
  root.appendChild(frag);

  subscribe(() => {
    // While a form is open we leave the pane alone (typing must not blow away
    // the caret); the preview still updates via its own subscription.
    if (!getResume() || editing) return;
    rerenderAll();
  });
}
