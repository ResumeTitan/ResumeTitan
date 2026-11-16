/* ==========================================================================
   sections.js — the editor's section + item schema.

   One declarative list drives the accordion, the item rows, the item forms,
   and (through the template) the preview.

   Section kinds:
     - "list"   -> rows drawn from resume[section.key] (an array)
     - "single" -> one row drawn from resume.basics

   Field types (used by the form):
     - "text"      single-line input
     - "date"      month input (value = "YYYY-MM")
     - "checkbox"  boolean
     - "tags"      array of strings, edited as comma-separated text
     - "rich"      contenteditable, stores one HTML string
     - "rich-list" contenteditable, stores an array of HTML strings (bullets)
   ========================================================================== */

import { dateRange, formatDate } from "./format.js";

/** Join defined parts with a separator (defaults to " · "). */
function join(parts) {
  return parts.filter(Boolean).join(" \u00b7 ");
}

function location(basics = {}) {
  const loc = basics.location || {};
  return join([loc.city, loc.region, loc.countryCode]);
}

/**
 * Section descriptors, in display order (mirrors Teal's editor).
 */
export const SECTIONS = [
  {
    id: "contact-info",
    title: "Contact Information",
    kind: "single",
    editLabel: "Edit Contact Information",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "label", label: "Headline", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "url", label: "Website", type: "text" },
      { key: "city", path: "location.city", label: "City", type: "text" },
      { key: "region", path: "location.region", label: "State / Region", type: "text" },
      { key: "countryCode", path: "location.countryCode", label: "Country", type: "text" },
    ],
    primary: (b) => b.name,
    meta: (b) => [location(b), b.phone, b.email, b.url, (b.profiles || []).map((p) => p.network).filter(Boolean).join(", ")],
    notes: () => null,
  },
  {
    id: "target-titles",
    title: "Target Title",
    kind: "list",
    key: "targetTitles",
    itemType: "string",
    addLabel: "Add a Target Title",
    fields: [{ key: "value", label: "Target Title", type: "text", placeholder: "e.g. Senior Software Engineer" }],
    newItem: () => "",
    primary: (item) => item,
    meta: () => [],
    notes: () => null,
  },
  {
    id: "blurbs",
    title: "Professional Summary",
    kind: "single",
    editLabel: "Edit Professional Summary",
    fields: [
      { key: "summary", label: "Summary", type: "rich", placeholder: "2–3 sentences on what you do and the impact you bring." },
    ],
    primary: (b) => b.label,
    meta: () => [],
    notes: (b) => (b.summary ? { type: "rich", text: b.summary } : null),
  },
  {
    id: "work-experience",
    title: "Work Experience",
    kind: "list",
    key: "work",
    addLabel: "Add Company or Position",
    fields: [
      { key: "position", label: "Position", type: "text" },
      { key: "name", label: "Company", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "endDate", label: "End Date", type: "date" },
      { key: "endDateCurrent", label: "I currently work here", type: "checkbox" },
      { key: "highlights", label: "Additional Information", type: "rich-list", placeholder: "Add a bullet…" },
    ],
    newItem: () => ({ position: "", name: "", location: "", startDate: "", endDate: "", endDateCurrent: false, highlights: [] }),
    primary: (item) => item.position || item.name,
    meta: (item) => [item.position && item.name ? item.name : "", item.location, dateRange(item.startDate, item.endDate, item.endDateCurrent)],
    notes: (item) => (item.highlights?.length ? { type: "rich-list", items: item.highlights } : null),
  },
  {
    id: "education",
    title: "Education",
    kind: "list",
    key: "education",
    addLabel: "Add an Education or Degree",
    fields: [
      { key: "institution", label: "Institution", type: "text" },
      { key: "studyType", label: "Degree Type", type: "text", placeholder: "B.S." },
      { key: "area", label: "Field of Study", type: "text" },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "endDate", label: "End Date", type: "date" },
      { key: "score", label: "GPA / Score", type: "text" },
    ],
    newItem: () => ({ institution: "", studyType: "", area: "", startDate: "", endDate: "", score: "" }),
    primary: (item) => item.institution,
    meta: (item) => [join([item.studyType, item.area].filter(Boolean)), item.score ? `GPA ${item.score}` : "", dateRange(item.startDate, item.endDate)],
    notes: () => null,
  },
  {
    id: "skills",
    title: "Skills & Interests",
    kind: "list",
    key: "skills",
    addLabel: "Add Skills & Interests",
    fields: [
      { key: "name", label: "Category", type: "text", placeholder: "e.g. Languages" },
      { key: "keywords", label: "Skills", type: "tags", placeholder: "React, Node.js, SQL" },
    ],
    newItem: () => ({ name: "", keywords: [] }),
    primary: (item) => item.name,
    meta: (item) => [(item.keywords || []).join(", ")],
    notes: () => null,
  },
  {
    id: "certifications",
    title: "Certifications",
    kind: "list",
    key: "certificates",
    addLabel: "Add a Certification",
    fields: [
      { key: "name", label: "Certification", type: "text" },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "date", label: "Date", type: "date" },
    ],
    newItem: () => ({ name: "", issuer: "", date: "" }),
    primary: (item) => item.name,
    meta: (item) => [item.issuer, formatDate(item.date)],
    notes: () => null,
  },
  {
    id: "awards",
    title: "Awards & Scholarships",
    kind: "list",
    key: "awards",
    addLabel: "Add an Award or Scholarship",
    fields: [
      { key: "title", label: "Award", type: "text" },
      { key: "awarder", label: "Awarded By", type: "text" },
      { key: "date", label: "Date", type: "date" },
      { key: "summary", label: "Details", type: "rich", placeholder: "What was it for?" },
    ],
    newItem: () => ({ title: "", awarder: "", date: "", summary: "" }),
    primary: (item) => item.title,
    meta: (item) => [item.awarder, formatDate(item.date)],
    notes: (item) => (item.summary ? { type: "rich", text: item.summary } : null),
  },
  {
    id: "projects",
    title: "Projects",
    kind: "list",
    key: "projects",
    addLabel: "Add a Project",
    fields: [
      { key: "name", label: "Project Name", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "endDate", label: "End Date", type: "date" },
      { key: "endDateCurrent", label: "This project is ongoing", type: "checkbox" },
      { key: "description", label: "Description", type: "rich", placeholder: "Short summary of the project." },
      { key: "highlights", label: "Additional Information", type: "rich-list", placeholder: "Add a bullet…" },
    ],
    newItem: () => ({ name: "", organization: "", startDate: "", endDate: "", endDateCurrent: false, description: "", highlights: [] }),
    primary: (item) => item.name,
    meta: (item) => [item.organization, dateRange(item.startDate, item.endDate, item.endDateCurrent)],
    notes: (item) =>
      item.highlights?.length
        ? { type: "rich-list", items: item.highlights }
        : item.description
          ? { type: "rich", text: item.description }
          : null,
  },
  {
    id: "activities",
    title: "Volunteering & Leadership",
    kind: "list",
    key: "volunteer",
    addLabel: "Add Volunteering or Leadership",
    fields: [
      { key: "position", label: "Role", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "endDate", label: "End Date", type: "date" },
      { key: "summary", label: "Details", type: "rich", placeholder: "What did you do?" },
    ],
    newItem: () => ({ position: "", organization: "", startDate: "", endDate: "", summary: "" }),
    primary: (item) => item.position || item.organization,
    meta: (item) => [item.position ? item.organization : "", dateRange(item.startDate, item.endDate)],
    notes: (item) => (item.summary ? { type: "rich", text: item.summary } : null),
  },
  {
    id: "publications",
    title: "Publications",
    kind: "list",
    key: "publications",
    addLabel: "Add a Publication",
    fields: [
      { key: "name", label: "Title", type: "text" },
      { key: "publisher", label: "Publisher", type: "text" },
      { key: "releaseDate", label: "Date", type: "date" },
      { key: "url", label: "URL", type: "text" },
    ],
    newItem: () => ({ name: "", publisher: "", releaseDate: "", url: "" }),
    primary: (item) => item.name,
    meta: (item) => [item.publisher, formatDate(item.releaseDate)],
    notes: () => null,
  },
];

/** Look up a section descriptor by id. */
export function findSection(id) {
  return SECTIONS.find((section) => section.id === id);
}

/** The object backing a "single" section (only resume.basics uses this). */
export function getSingle(resume = {}) {
  return resume.basics || {};
}

/** The array backing a list section (never undefined). */
export function getItems(resume = {}, section) {
  const list = resume[section.key];
  return Array.isArray(list) ? list : [];
}

/** Bold title for an item row. */
export function itemTitle(section, item) {
  return section.primary(item) || "(untitled)";
}

/** Meta segments for an item row (already filtered + trimmed). */
export function itemMeta(section, item) {
  return (section.meta(item) || []).map((part) => part && String(part).trim()).filter(Boolean);
}

/** Notes block for an item row, or null. */
export function itemNotes(section, item) {
  return section.notes(item) || null;
}

/** Whether a list item is excluded from the resume. */
export function isHidden(item) {
  return item?._hidden === true;
}

/** Flip a list item's hidden flag in place. Returns the same resume object. */
export function toggleHidden(resume, sectionId, index) {
  const section = findSection(sectionId);
  if (!section || section.kind !== "list") return resume;
  const item = getItems(resume, section)[index];
  if (item && typeof item === "object") item._hidden = !isHidden(item);
  return resume;
}
