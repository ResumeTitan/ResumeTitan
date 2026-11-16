/* ==========================================================================
   form.js — the inline item form (fields + rich-text editor).

   The form is driven entirely by a section's `fields` and a small binding
   adapter, so it stays decoupled from where the values actually live (an item
   object, resume.basics, or a plain string in an array).

   Editing writes through immediately (so the preview updates live); Cancel
   restores the snapshot taken by the caller, Save just closes.
   ========================================================================== */

import { sanitizeHtml } from "./sanitize.js";

let uid = 0;

function button(text, className) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = className;
  el.textContent = text;
  return el;
}

/** Lightweight contenteditable with a bold/italic (and list) toolbar. */
function createRich(field, value, onValue) {
  const wrap = document.createElement("div");
  wrap.className = "rich";

  const editor = document.createElement("div");
  editor.className = "rich__editor";
  editor.contentEditable = "true";
  editor.setAttribute("role", "textbox");
  editor.setAttribute("aria-multiline", "true");
  editor.setAttribute("aria-label", field.label);
  editor.dataset.placeholder = field.placeholder || "";

  const multiple = field.type === "rich-list";

  function syncEmpty() {
    editor.dataset.empty = String(editor.textContent.trim() === "");
  }

  function write(next) {
    editor.replaceChildren();
    if (multiple) {
      const blocks = Array.isArray(next) ? next : [];
      if (!blocks.length) {
        editor.appendChild(document.createElement("div"));
      } else {
        for (const block of blocks) {
          const div = document.createElement("div");
          div.innerHTML = sanitizeHtml(block);
          editor.appendChild(div);
        }
      }
    } else {
      editor.innerHTML = sanitizeHtml(next || "");
    }
    syncEmpty();
  }

  function read() {
    if (multiple) {
      const blocks = Array.from(editor.childNodes)
        .map((node) => (node.nodeType === Node.ELEMENT_NODE ? node.innerHTML : node.textContent))
        .map((html) => html.trim())
        .filter(Boolean);
      onValue(blocks);
    } else {
      onValue(editor.innerHTML);
    }
    syncEmpty();
  }

  editor.addEventListener("input", read);

  const toolbar = document.createElement("div");
  toolbar.className = "rich__toolbar";
  const commands = [
    ["bold", "Bold", "B"],
    ["italic", "Italic", "I"],
  ];
  if (!multiple) commands.push(["insertUnorderedList", "Bullet list", "\u2022"]);
  for (const [command, label, text] of commands) {
    const btn = button(text, "rich__btn");
    btn.title = label;
    btn.setAttribute("aria-label", label);
    // preventDefault on mousedown keeps the caret/selection inside the editor;
    // the command runs on click so the selection is intact.
    btn.addEventListener("mousedown", (event) => event.preventDefault());
    btn.addEventListener("click", () => {
      document.execCommand(command);
      read();
    });
    toolbar.appendChild(btn);
  }

  wrap.append(toolbar, editor);
  write(value);
  return wrap;
}

/** Build one labelled control for a field. */
function createField(field, binding, onInput) {
  const id = `field-${field.key}-${++uid}`;
  const wrap = document.createElement("div");
  wrap.className = "field";
  if (field.type === "checkbox") wrap.classList.add("field--check");
  if (field.type === "rich" || field.type === "rich-list") wrap.classList.add("field--rich");
  if (field.wide) wrap.classList.add("field--wide");

  const label = document.createElement("label");
  label.className = "field__label";
  label.htmlFor = id;
  label.textContent = field.label;

  const value = binding.get(field.key);

  if (field.type === "rich" || field.type === "rich-list") {
    wrap.appendChild(label);
    wrap.appendChild(
      createRich(field, value, (next) => {
        binding.set(field.key, next);
        onInput();
      }),
    );
    return wrap;
  }

  const input = document.createElement("input");
  input.id = id;
  input.className = "field__input";
  if (field.placeholder) input.placeholder = field.placeholder;

  if (field.type === "checkbox") {
    input.type = "checkbox";
    input.checked = Boolean(value);
    input.addEventListener("change", () => {
      binding.set(field.key, input.checked);
      onInput();
    });
    // Checkbox sits to the right of its label.
    wrap.append(input, label);
    label.htmlFor = id;
    return wrap;
  }

  if (field.type === "date") {
    input.type = "month";
    input.value = value || "";
    input.addEventListener("input", () => {
      binding.set(field.key, input.value);
      onInput();
    });
  } else if (field.type === "tags") {
    input.type = "text";
    input.value = Array.isArray(value) ? value.join(", ") : value || "";
    input.addEventListener("input", () => {
      const tags = input.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      binding.set(field.key, tags);
      onInput();
    });
  } else {
    input.type = "text";
    input.value = value || "";
    input.addEventListener("input", () => {
      binding.set(field.key, input.value);
      onInput();
    });
  }

  wrap.append(label, input);
  return wrap;
}

/**
 * @param {object} section section descriptor (needs `fields`, `title`)
 * @param {object} opts
 * @param {{get:(k:string)=>any, set:(k:string,v:any)=>void}} opts.binding
 * @param {() => void} opts.onInput   called after every field change
 * @param {() => void} opts.onSave
 * @param {() => void} opts.onCancel
 * @param {() => void} [opts.onDelete]
 * @param {boolean} [opts.isNew]
 */
export function buildItemForm(section, opts) {
  const { binding, onInput, onSave, onCancel, onDelete, isNew } = opts;

  const form = document.createElement("form");
  form.className = "item-form";
  form.noValidate = true;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onSave();
  });

  const heading = document.createElement("p");
  heading.className = "item-form__heading";
  heading.textContent = isNew ? section.addLabel || `Add ${section.title}` : `Edit ${section.title}`;
  form.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "item-form__grid";
  for (const field of section.fields) grid.appendChild(createField(field, binding, onInput));
  form.appendChild(grid);

  const footer = document.createElement("div");
  footer.className = "item-form__footer";

  if (!isNew && onDelete) {
    const remove = button("Delete", "btn btn--danger btn--sm");
    remove.addEventListener("click", onDelete);
    footer.appendChild(remove);
  }

  const spacer = document.createElement("span");
  spacer.className = "item-form__spacer";
  footer.appendChild(spacer);

  const cancel = button("Cancel", "btn btn--secondary btn--sm");
  cancel.addEventListener("click", onCancel);
  const save = button("Save", "btn btn--primary btn--sm");
  save.type = "submit";
  footer.append(cancel, save);

  form.appendChild(footer);
  return form;
}
