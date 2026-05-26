---
name: Update UI to Modern Layout (Tailwind + shadcn)
scope: workspace
description: |
  A reproducible workflow for updating the existing UI to a modern dashboard layout
  (see attached design). Uses Tailwind CSS with centralized design tokens (CSS variables)
  and shadcn components. Prohibits arbitrary values and direct usage of Tailwind's
  color palette in component markup. All colors are defined in `src/index.css`.
tags:
  - ui
  - tailwind
  - design-tokens
  - shadcn
---

## Summary

This skill captures the step-by-step process, decisions, and acceptance criteria to
transform the legacy UI into the modern dashboard shown in the design. It standardizes
color usage via CSS design tokens (defined in `src/index.css`), maps those tokens into
`tailwind.config.js`, and requires using shadcn components or their patterns for
consistent, accessible UI.

## Intent / Output

- A clear, repeatable workflow for migrating the app UI to the modern layout.
- A list of component-level tasks and examples for replacing legacy styles with token-driven
  Tailwind classes and shadcn components.
- A short checklist to validate completeness: token coverage, no arbitrary values,
  responsive across breakpoints, and accessibility checks.

## Scope

- Workspace-scoped: apply to `/src` components and `/src/ui` primitives.
- This skill does not change backend logic; it focuses solely on visual and
  component refactor work.

## Inputs

- Design reference image (provided in conversation).
- Existing codebase and components under `/src`.
- `src/index.css` must contain the color tokens (this repo now defines them).

## Step-by-step Process

1. Audit current UI usage
   - Search for direct color usages (hex codes, Tailwind color names like `bg-gray-50`), inline styles,
     or arbitrary sizes (e.g., `w-[342px]`, `px: 17`).
   - Create a list of files that need updates (Header, Sidebar, Card, StatCard, Buttons, inputs).

2. Define and centralize design tokens
   - Ensure `src/index.css` declares CSS variables for all theme colors. (Already done.)
   - Keep token names semantic (e.g. `--color-primary`, `--color-muted`, `--color-border`).

3. Map tokens into Tailwind
   - Update `tailwind.config.js` to point color keys to `var(--color-...)` tokens.
   - Use simple keys (`primary`, `foreground`, `muted`, `surface`, `border`, etc.).

4. Migrate primitives to shadcn patterns
   - Prefer `shadcn/ui` primitives in `/src/ui` (button, input, card, select).
   - Ensure variants are driven by tokens and Tailwind classes (e.g., `bg-primary`, `text-primary-foreground`).

5. Refactor components incrementally
   - Start with global layout components: `Header.tsx`, `Sidebar.tsx`, `AdminLayout.tsx`.
   - Then refactor cards/statistics (`StatCard.tsx`, `Card.tsx`, `Dashboard.tsx`).
   - Replace hand-rolled buttons with the `Button` primitive from `/src/ui/button.tsx`.

6. Enforce no arbitrary values
   - Replace uses of arbitrary pixel/hex classes with Tailwind scale classes and tokens.
   - If a dimension falls outside Tailwind scale, add a token or extend Tailwind spacing—do not use `[...]` arbitrary values.

7. Accessibility and responsiveness
   - Check color contrast (WCAG AA) for text and interactive elements.
   - Verify keyboard navigation and ARIA roles on interactive widgets.
   - Test at common breakpoints (`sm`, `md`, `lg`, `xl`).

8. Visual verification and regression
   - Add Storybook stories for changed primitives and key screens.
   - Optionally add visual regression snapshots (Percy / Chromatic).

## Decision Points

- Color palette: Tokens live in `src/index.css`. If a new semantic color is required, add it to `:root` and `tailwind.config.js`.
- Spacing/typography: Prefer Tailwind's 4px-based scale; if needed, add named tokens in Tailwind config, not inline values.
- Component ownership: Use `/src/ui` primitives for shared behavior; specialized pages may compose primitives.

## Quality Criteria (must pass before marking done)

- No component references raw hex values or direct Tailwind color names (search for `#` or `-gray-`)
- All colors are referenced via tokens (via Tailwind keys or `var(--color-...)` where appropriate).
- No `w-[...px]`, `h-[...px]`, or other arbitrary class usage—only Tailwind scale classes or added tokens.
- Core screens match the visual reference at desktop and tablet breakpoints.
- Accessibility: interactive controls have visible focus (using `ring`) and sufficient contrast.

## Acceptance Tests / Checklist

- [ ] `src/index.css` contains the token names used in the project.
- [ ] `tailwind.config.js` maps color keys to the `--color-` tokens.
- [ ] `Header`, `Sidebar`, `Card`, and `Button` components use the token-driven classes.
- [ ] No arbitrary values present across `/src` (run a grep to verify).
- [ ] Storybook (or screenshots) created for the migrated primitives.

## Implementation Notes and Examples

1. Token usage in CSS (already applied in `src/index.css`):

```css
:root {
  --color-bg: #f5f7fa;
  --color-primary: #7c3aed;
  --color-primary-foreground: #ffffff;
  /* ... */
}
```

2. Tailwind mapping (example snippet in `tailwind.config.js`):

```js
extend: {
  colors: {
    primary: 'var(--color-primary)',
    'primary-foreground': 'var(--color-primary-foreground)',
    background: 'var(--color-bg)',
    muted: 'var(--color-muted)',
    border: 'var(--color-border)',
  }
}
```

3. Using tokens in components (preferred):

```tsx
// Use mapped keys from tailwind.config.js
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
    Action
  </button>
</div>
```

4. Avoid this (don't use arbitrary values or direct Tailwind color names):

```tsx
// Bad: direct hex and arbitrary width
<div style={{ background: "#f8fafc" }}>
  <button className="bg-[#7c3aed] w-[342px]">Action</button>
</div>
```

## Files to Update (suggested order)

- `/src/index.css` (tokens) — done
- `/tailwind.config.js` (map tokens) — done
- `/src/ui/*` primitives (`button.tsx`, `input.tsx`, `card.tsx`)
- `/src/components/Header.tsx`, `Sidebar.tsx`, `AdminLayout.tsx`
- `/src/components/StatCard.tsx`, `/src/components/Card.tsx`
- `/src/pages/Dashboard.tsx` and dashboards

## Migration Checklist (actionable)

1. Replace `bg-gray-50`, `text-gray-700`, etc. with `bg-background`, `text-muted`, etc.
2. Swap hand-rolled buttons for `/src/ui/button.tsx` that uses tokens and shadcn patterns.
3. Update card shadows, borders and spacing to use tokens and Tailwind spacing scale.
4. Add focus styles using `ring` and token-driven `--color-ring`.
5. Run `grep -R "#\|gray-" src | wc -l` to find remaining color usages.

## Example Prompts to Run This Skill

- "Migrate header and sidebar to token-driven styles using shadcn Button and Card."
- "Refactor all buttons to use /src/ui/button.tsx and remove arbitrary widths."

## Next Steps (suggested)

- Implement a storybook instance and add stories for `Button`, `Card`, `StatCard`, `Header`.
- Add visual regression tests for the dashboard main screen.
- Create a lint rule or grep script to fail CI on arbitrary classes (optional).

---

If any token names need renaming or additional semantic colors are required, update `src/index.css` first and then add the corresponding key in `tailwind.config.js` before using them in components.
