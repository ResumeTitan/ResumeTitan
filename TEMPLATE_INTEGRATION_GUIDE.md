# Template Integration Guide - Design Tokens

This guide explains how resume templates can optionally consume design tokens for enhanced customization.

## Overview

Templates **do not need to be modified** to work with the Design Tokens system. However, templates can optionally consume CSS variables to provide users with fine-grained control over typography, spacing, colors, and formatting.

## Available CSS Variables

### Page Layout
```css
--page-margin-x        /* e.g., "54px" */
--page-margin-y        /* e.g., "54px" */
--page-columns         /* e.g., "1" or "2" */
--column-ratio         /* e.g., "40% 60%" */
--column-gutter        /* e.g., "24px" */
```

### Typography
```css
--font-body-size           /* e.g., "10.5pt" */
--line-height              /* e.g., "1.15" */
--heading-scale            /* e.g., "1.2" */
--body-weight              /* e.g., "400" */
--heading-weight           /* e.g., "600" */
--heading-letter-spacing   /* e.g., "0" or "0.025em" */
```

### Spacing
```css
--section-gap      /* e.g., "16px" */
--item-gap         /* e.g., "8px" */
--bullet-gap       /* e.g., "3px" */
--bullet-indent    /* e.g., "20px" */
```

### Style
```css
--accent-color       /* e.g., "#2563eb" */
--text-color         /* e.g., "#1f2937" */
--link-decoration    /* e.g., "none" or "underline" */
```

### Formatting
```css
--bullet-char          /* e.g., "\"•\"" */
--date-layout          /* e.g., "right" */
--header-layout        /* e.g., "one_line" */
--contact-separator    /* e.g., "pipe" */
--skills-layout        /* e.g., "chips" */
--skills-columns       /* e.g., "2" */
```

## Example: Basic Integration

### Before (hardcoded values)
```css
.resume-section {
  margin-bottom: 16px;
}

.resume-heading {
  font-size: 12.6pt; /* 10.5pt × 1.2 */
  font-weight: 600;
  color: #2563eb;
}

.resume-body {
  font-size: 10.5pt;
  line-height: 1.15;
  color: #1f2937;
}
```

### After (token-aware with fallbacks)
```css
.resume-section {
  margin-bottom: var(--section-gap, 16px);
}

.resume-heading {
  font-size: calc(var(--font-body-size, 10.5pt) * var(--heading-scale, 1.2));
  font-weight: var(--heading-weight, 600);
  letter-spacing: var(--heading-letter-spacing, 0);
  color: var(--accent-color, #2563eb);
}

.resume-body {
  font-size: var(--font-body-size, 10.5pt);
  line-height: var(--line-height, 1.15);
  font-weight: var(--body-weight, 400);
  color: var(--text-color, #1f2937);
}
```

## Example: Bullet Points

```css
.resume-bullet-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.resume-bullet-item {
  margin-bottom: var(--bullet-gap, 3px);
  padding-left: var(--bullet-indent, 20px);
  position: relative;
}

.resume-bullet-item::before {
  content: var(--bullet-char, '•');
  position: absolute;
  left: 0;
  color: var(--accent-color, #2563eb);
}

/* Hanging indent support */
.resume-bullet-item.hanging-indent {
  text-indent: calc(-1 * var(--bullet-indent, 20px));
  padding-left: var(--bullet-indent, 20px);
}
```

## Example: ATS Mode

Templates can conditionally hide decorative elements when ATS mode is active:

```svelte
<script>
  export let resume;

  // Check if ATS mode is active
  $: atsMode = resume.designTokens?.accessibility?.atsMode || false;
</script>

<style>
  .resume-icon {
    /* Icons visible by default */
  }

  /* Hide icons in ATS mode */
  :global(.ats-mode) .resume-icon {
    display: none;
  }

  .resume-background {
    background: linear-gradient(to right, #f3f4f6, #ffffff);
  }

  /* Remove backgrounds in ATS mode */
  :global(.ats-mode) .resume-background {
    background: transparent !important;
  }
</style>

<div class="resume-content">
  {#if !atsMode}
    <div class="resume-icon">📋</div>
  {/if}

  <div class="resume-background">
    <!-- content -->
  </div>
</div>
```

## Example: Two-Column Layout

```css
.resume-container {
  display: grid;
  grid-template-columns: var(--column-ratio, 40% 60%);
  gap: var(--column-gutter, 24px);
}

/* Single column mode */
.resume-container[data-columns="1"] {
  grid-template-columns: 1fr;
}
```

## Example: Skills Section

```svelte
<script>
  export let resume;

  $: skillsLayout = resume.designTokens?.formatting?.skillsLayout || 'CHIPS';
  $: skillsColumns = resume.designTokens?.formatting?.skillsColumns || 2;
</script>

<style>
  .skills-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .skill-chip {
    background: var(--accent-color, #2563eb);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85em;
  }

  .skills-comma {
    display: inline;
  }

  .skills-categorized {
    display: grid;
    grid-template-columns: repeat(var(--skills-columns, 2), 1fr);
    gap: var(--item-gap, 8px);
  }

  /* ATS mode: force comma-separated */
  :global(.ats-mode) .skills-chips,
  :global(.ats-mode) .skills-categorized {
    display: inline;
  }

  :global(.ats-mode) .skill-chip {
    background: transparent;
    color: var(--text-color, #000);
    padding: 0;
    border-radius: 0;
  }
</style>

{#if skillsLayout === 'CHIPS'}
  <div class="skills-chips">
    {#each resume.skills as skill}
      <span class="skill-chip">{skill.name}</span>
    {/each}
  </div>
{:else if skillsLayout === 'COMMA'}
  <div class="skills-comma">
    {resume.skills.map(s => s.name).join(', ')}
  </div>
{:else if skillsLayout === 'CATEGORIZED'}
  <div class="skills-categorized">
    {#each resume.skills as skill}
      <div>
        <strong>{skill.name}:</strong> {skill.keywords.join(', ')}
      </div>
    {/each}
  </div>
{/if}
```

## Data Attributes

The resume container element has these data attributes:

```html
<div
  class="resume-container"
  data-ats-mode="true"
  data-disable-icons="true"
  data-disable-backgrounds="true"
>
```

You can use these in CSS selectors:

```css
/* Hide when ATS mode is active */
.decorative-element {
  display: block;
}

[data-ats-mode="true"] .decorative-element {
  display: none;
}

/* Conditional styling based on data attributes */
[data-disable-icons="true"] .icon {
  display: none;
}

[data-disable-backgrounds="true"] .fancy-background {
  background: transparent !important;
}
```

## Best Practices

### 1. Always Provide Fallbacks
```css
/* GOOD: Fallback value ensures template works without tokens */
font-size: var(--font-body-size, 10.5pt);

/* BAD: No fallback - template breaks if tokens not set */
font-size: var(--font-body-size);
```

### 2. Use Semantic Variable Names
```css
/* GOOD: Semantic usage */
.section-title {
  color: var(--accent-color);
}

/* BAD: Using text color for accents */
.section-title {
  color: var(--text-color);
}
```

### 3. Respect ATS Mode
```css
/* Ensure critical content is visible in ATS mode */
:global(.ats-mode) .resume-content {
  color: #000;
  background: #fff;
}

/* Hide decorative elements */
:global(.ats-mode) .decoration {
  display: none;
}
```

### 4. Test with Different Token Values
- Test with minimum values (9pt font, tight spacing)
- Test with maximum values (12pt font, airy spacing)
- Test with ATS mode enabled
- Test print output

### 5. Progressive Enhancement
Templates should work **without** consuming tokens. Tokens are an enhancement, not a requirement.

## Migration Strategy

### Phase 1: Core Spacing (Quick Win)
Start by replacing hardcoded spacing with CSS variables:
```css
.resume-section { margin-bottom: var(--section-gap, 16px); }
.resume-item { margin-bottom: var(--item-gap, 8px); }
```

### Phase 2: Typography
Replace font sizes and weights:
```css
.resume-body {
  font-size: var(--font-body-size, 10.5pt);
  line-height: var(--line-height, 1.15);
}
```

### Phase 3: Colors
Replace hardcoded colors:
```css
.resume-heading { color: var(--accent-color, #2563eb); }
.resume-text { color: var(--text-color, #1f2937); }
```

### Phase 4: ATS Mode
Add conditional styling for ATS compatibility:
```css
:global(.ats-mode) .decorative { display: none; }
```

## Complete Template Example

See [client/src/lib/components/resume/templates/professional/Resume.svelte](client/src/lib/components/resume/templates/professional/Resume.svelte) for a complete example of a token-aware template.

## Questions?

If you have questions about integrating design tokens into your template, refer to:
- [DESIGN_TOKENS_IMPLEMENTATION.md](./DESIGN_TOKENS_IMPLEMENTATION.md) - Full system documentation
- [client/src/lib/types/designTokens.ts](client/src/lib/types/designTokens.ts) - Type definitions
- [client/src/lib/config/designTokenDefaults.ts](client/src/lib/config/designTokenDefaults.ts) - Default values
