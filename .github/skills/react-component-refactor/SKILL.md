---
name: react-component-refactor
description: >
  Refactor complex React components into smaller, maintainable, reusable pieces.
  Trigger whenever a component is over ~300 lines, mixes data-fetching with rendering,
  has deeply nested JSX (3+ levels), repeats UI patterns, or the user says things like
  "this component is too big", "break this down", "extract a hook", "clean up this file",
  or "it's hard to maintain/test". Also trigger for performance issues like excessive
  re-renders or requests to memoize. Follows bulletproof-react architecture with
  React Query (server state), react-hook-form (forms), and Zod (validation).
argument-hint: "Path to the React component file to refactor"
user-invocable: true
---

# React Component Refactoring

Systematic workflow for decomposing a complex React component without breaking functionality.

---

## Phase 1 — Analyse

Read the **entire file** before extracting anything. Identify:

| Signal                                                  | What to extract                 |
| ------------------------------------------------------- | ------------------------------- |
| Self-contained JSX block (header, card, list item)      | → `examples/split-component.md` |
| Data fetching mixed with rendering                      | → `examples/split-component.md` |
| Filter/sort/derive logic, reusable state                | → `examples/extract-hook.md`    |
| Loading/error/empty pattern repeated 2+ places          | → `examples/extract-ui.md`      |
| Shared layout shell (sidebar, page wrapper)             | → `examples/extract-ui.md`      |
| Expensive renders, stable props, unnecessary re-renders | → `checks/memoization.md`       |

For each candidate note: which state it needs, which callbacks it calls, whether it consumes Context.

---

## Phase 2 — Plan

Prioritise in this order — hooks first (fewest JSX deps), then presentational, then containers, then shared UI.

**File placement:**
| Type | Location |
|---|---|
| Feature component | `app/features/[feature]/components/` |
| Shared UI primitive | `app/components/shared/` |
| Custom hook | `app/features/[feature]/hooks/` |
| Layout component | `app/components/layouts/` |

Co-locate tightly coupled pieces:

```
UserProfile/
  index.ts
  UserProfile.tsx
  UserProfileHeader.tsx
  useUserData.ts
```

**Prop API rule:** ≤ 8 props per component. If over, group related props into an object.

---

## Phase 3 — Implement

Extract **one thing at a time**. Load the relevant reference file, implement, verify, then move to the next.

| Task                                                      | Reference                     |
| --------------------------------------------------------- | ----------------------------- |
| Split a component or separate container from presentation | `examples/split-component.md` |
| Extract a custom hook                                     | `examples/extract-hook.md`    |
| Extract shared/utility UI                                 | `examples/extract-ui.md`      |
| Add memoization                                           | `checks/memoization.md`       |

Steps per extraction:

1. Create the file in the right location
2. Define the TypeScript interface first
3. Copy and adapt JSX — use `~/components/ui/` primitives (`Button`, `Card`, `Spinner`, etc.)
4. Add JSDoc to all exports
5. Export from `index.ts`
6. Update parent: import, replace inline code, delete dead state/functions/imports

---

## Phase 4 — Verify

After each extraction:

```bash
npm run lint
```

Check:

- [ ] Renders correctly
- [ ] All interactions work (clicks, inputs, form submit)
- [ ] Loading / error states still display
- [ ] No new console warnings
- [ ] No regressions in re-render behavior
      **Target metrics:**
- Parent: < 200 lines (aim for < 50% of original)
- Each extracted piece: < 150 lines
- Props per component: ≤ 8
- JSX nesting depth: ≤ 4 levels

---

## Phase 5 — Output

```
### 📊 Refactoring Summary
Original: `ComponentName.tsx` — X lines, N responsibilities

| File | Lines | Responsibility |
|---|---|---|
| ParentComponent.tsx | X | Orchestration |
| SubComponent.tsx | X | ... |
| hooks/useX.ts | X | ... |

### ✅ Verification
- [ ] TypeScript compiles
- [ ] All functionality preserved
- [ ] No new warnings

### 📝 Test These Scenarios
1. ...
2. ...

### 🔄 Deferred Opportunities
- ...
```

---

## When NOT to Refactor

Skip if:

- Component is < 150 lines with a single clear responsibility
- Extraction requires prop-drilling through 3+ levels (use Context instead)
- Component is scheduled for deletion or full rewrite
- Performance is acceptable and no excessive re-renders
