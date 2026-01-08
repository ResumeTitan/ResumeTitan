# Design Tokens

This document describes the design system tokens used throughout ResumeTitan.

## Color Palette

All colors are defined as CSS custom properties in `themes/colors.css` and referenced
in `tailwind.config.ts` for utility classes.

### Brand Colors (Teal)

| Token | CSS Variable | Tailwind Class | Hex Value |
|-------|--------------|----------------|-----------|
| Main | `--color-main-green` | `bg-main-green`, `text-main-green` | `#115E59` |
| Dark | `--color-dark-green` | `bg-dark-green` | `#0e4a45` |
| Darker | `--color-darker-green` | `bg-darker-green` | `#0b3733` |
| Darkest | `--color-darkest-green` | `bg-darkest-green` | `#082421` |
| Light | `--color-light-green` | `bg-light-green` | `#80cbc4` |
| Lighter | `--color-lighter-green` | `bg-lighter-green` | `#b2dfdb` |
| Lightest | `--color-lightest-green` | `bg-lightest-green` | `#e0f2f1` |

### Semantic Colors

| Purpose | CSS Variable | Tailwind Class | Hex Value |
|---------|--------------|----------------|-----------|
| Success | `--color-success` | `bg-success`, `text-success` | `#10b981` |
| Error | `--color-error` | `bg-error`, `text-error` | `#ef4444` |
| Warning | `--color-warning` | `bg-warning`, `text-warning` | `#f59e0b` |
| Info | `--color-info` | `bg-info`, `text-info` | `#3b82f6` |

### Text Colors

| Purpose | CSS Variable | Usage |
|---------|--------------|-------|
| Primary | `--color-text-primary` | Main body text |
| Secondary | `--color-text-secondary` | Secondary text, labels |
| Muted | `--color-text-muted` | Placeholder, disabled |
| Inverse | `--color-text-inverse` | Text on dark backgrounds |

## Component Classes

Reusable component classes are defined in `components.css`.

### Buttons

| Class | Purpose | Usage |
|-------|---------|-------|
| `.btn-primary` | Main CTA button | Primary actions |
| `.btn-secondary` | Destructive/cancel | Delete, cancel |
| `.btn-add` | Add new item | Adding content |
| `.btn-save` | Save action | Form submissions |
| `.btn-remove` | Remove item | Deleting items |
| `.btn-generate` | AI generation | AI features |
| `.btn-disabled` | Disabled state | Inactive buttons |

### Forms

| Class | Purpose |
|-------|---------|
| `.form-container` | Form wrapper with border |
| `.form-section` | Green header section |
| `.form-style` | Input field styling |
| `.form-label-text` | Label typography |
| `.form-content` | White content area |
| `.form-field` | Field spacing wrapper |
| `.form-row` | Two-column grid row |

### Layout

| Class | Purpose |
|-------|---------|
| `.page-container` | Main page wrapper |
| `.page-header` | Page header section |
| `.dashboard-container` | Dashboard card wrapper |
| `.dashboard-header` | Dashboard card header |

## Resume Themes

Resume templates use CSS custom properties for theming.
Each theme defines these variables:

- `--resume-primary` - Primary accent color
- `--resume-secondary` - Secondary text color
- `--resume-accent` - Accent/highlight color
- `--resume-border` - Border color
- `--resume-bg` - Background color
- `--resume-text` - Main text color
- `--resume-text-muted` - Muted text color
- `--resume-link` - Link color

Available themes:
- `.theme-professional` - Classic black and white
- `.theme-harvard` - Harvard crimson accent
- `.theme-macchiato` - Teal with sidebar
- `.theme-stratton` - Serif, formal style
- `.theme-onepage` - Minimal, compact
- `.theme-student-classic` - Traditional academic
- `.theme-academic-modern` - Modern gradient style

## Animation Classes

Defined in `animations.css`:

| Class | Effect |
|-------|--------|
| `.animate-slideUpFadeIn` | Slide up with fade |
| `.animate-slideUp` | Slide up only |
| `.animate-fade-in-out` | Fade in then out |
| `.animate-spin` | Continuous rotation |
| `.animate-bounce` | Bounce effect |
| `.animate-shake` | Shake for errors |

Delay utilities: `.animate-delay-100`, `.animate-delay-200`, `.animate-delay-300`, `.animate-delay-500`

## Print Styles

Print-specific classes in `print.css`:

| Class | Purpose |
|-------|---------|
| `.no-print` | Hide when printing |
| `.print-only` | Show only when printing |
| `.print-no-break` | Prevent page break inside |
| `.print-break-before` | Force page break before |
| `.print-break-after` | Force page break after |

## Usage Guidelines

1. **Prefer CSS variables** for colors that may change with themes
2. **Use Tailwind utilities** for layout and spacing
3. **Use component classes** for consistent button/form styling
4. **Avoid inline styles** - use utility classes or component CSS

Example:
```svelte
<!-- Good: uses component class -->
<button class="btn-primary">Save</button>

<!-- Good: uses Tailwind + CSS variable -->
<div class="bg-main-green text-white p-4">Header</div>

<!-- Avoid: inline styles -->
<div style="background: #115E59;">Header</div>
```
