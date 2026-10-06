# React Mastery Tutorial

An interactive learning website for the **8 essential React patterns**. Every concept follows the same loop:

> **Understand → Interact → Observe → Verify → Debug**

Read a short explanation, play with a live playground that makes the React behavior visible, answer a quick verification question, and finish with a debugging checklist.

## Why this project exists

Most React resources teach syntax. This project teaches **behavior** — what actually happens when state changes, when effects run, when keys are wrong, or when context is misused.

It was built for two audiences:

1. **Beginners** who want to *see* React work instead of only reading about it.
2. **Anyone using AI coding tools** who wants a mental model for reviewing generated React code instead of blindly trusting it.

The core rule of the project:

> Don't just tell the learner what React does. Let them make React do it, observe the result, and explain why it happened.

## The 8 concepts

| # | Concept | Interactive playground demonstrates |
|---|---------|--------------------------------------|
| 01 | **useState** | Counter with live state / render-count readouts — action → state → re-render → UI |
| 02 | **useEffect** | Live clock, dependency experiments, cleanup log, capped safe "bad example" |
| 03 | **Props + Composition** | Parent-owned props editor driving UserCard / StatsCard / ActionButton |
| 04 | **Conditional Rendering** | Profile state machine (loading / success / error / empty / logged out) |
| 05 | **List Rendering + Keys** | Add / delete / reorder rows and watch state follow identity vs position |
| 06 | **Event Handling + Forms** | Controlled form with validation, submission flow, `useCallback` / `useMemo` demos |
| 07 | **Context API** | Shared theme across distant components + prop-drilling comparison |
| 08 | **Custom Hooks + Performance** | `useLocalStorage` notes that survive refresh + memoization counter |

## Key features

- **Dashboard** with all 8 concepts, progress bar, and completion status
- **Every module**: short explanation → interactive playground → verification quiz → debugging insight
- **Live runtime indicators**: render counts, effect runs, cleanup status, state readouts, item identity
- **Safe bad examples** — simulated and capped, never an uncontrolled loop or browser freeze
- **Guided navigation**: sticky nav with active-section highlighting, prev/next footers, and a final "How the 8 Concepts Connect" mental-model section
- **Progress persistence** — completion is saved to `localStorage` (using the project's own custom hook)
- **Consistent, minimal UI** — light theme, one accent color, responsive layout, accessible controls

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and builds
- Plain CSS (design tokens, no CSS framework)
- Zero runtime dependencies besides React
- [jsdom](https://github.com/jsdom/jsdom) (dev-only) for the automated smoke test

## Run locally

```bash
git clone <your-repo-url>
cd react-mastery-tutorial
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build |
| `npm run test:smoke` | Mount the app in jsdom and click through all 8 modules |

## Project structure

```text
src/
├── App.tsx                  # Shell: dashboard, sticky nav (scroll-spy), sections, mental model
├── main.tsx                 # Entry point
├── styles.css               # Global styles + design tokens
├── components/              # Reusable UI (ConceptSection, VerificationCard, Dashboard, …)
├── concepts/                # The 8 modules, one folder per concept
│   ├── registry.ts          # Single source of ordered concept metadata
│   ├── useState/
│   ├── useEffect/
│   ├── props-composition/
│   ├── conditional-rendering/
│   ├── lists-keys/
│   ├── events-forms/
│   ├── context/
│   └── custom-hooks-performance/
├── context/ProgressContext.tsx   # Completion/progress state (persisted)
├── hooks/useLocalStorage.ts      # Custom Hook — used by the app itself
└── utils/expensiveStats.ts       # Shared "expensive" calculation for useMemo demos
```

## Learning philosophy

Each module answers the same questions:

- **What is it?** — plain-language explanation
- **Why does it exist?** — the problem the feature solves
- **What happens when it runs?** — interact and observe
- **What goes wrong?** — safe, controlled bad examples
- **How do I debug it?** — a compact checklist of questions

The website itself **uses every concept it teaches**: the counter uses `useState`, the clock uses `useEffect`, the theme demo uses Context, the notes playground uses a custom Hook, and progress tracking is persisted with `useLocalStorage`.

## Screenshots

> Screenshots / GIFs will be added here once captured.

## Testing

`npm run test:smoke` mounts the real app in jsdom and drives it like a learner would: navigation, all playground interactions, quizzes, progress persistence, and localStorage behavior — **90+ checks, zero console errors**.

## Documentation

- [`PROJECT_OVERVIEW.md`](PROJECT_OVERVIEW.md) — the original project specification
- [`resources.md`](resources.md) — curated references for the concepts covered

## Future improvements

- Mini quizzes after every module and a final debugging challenge
- "Fix the AI-generated code" exercises
- Render / effect visualization tools and component-tree inspector
- React DevTools learning section
- Additional topics: `useReducer`, routing, data fetching, error boundaries, testing

## License

Built as a learning resource — free to explore and adapt for personal study.
