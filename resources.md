# Resources

Curated references for the concepts this project covers. When in doubt, the official docs are the source of truth.

## React

- [React Official Documentation](https://react.dev/) — the primary reference for everything in this project
  - [Learn React](https://react.dev/learn) — tutorial path used to structure the learning flow
  - [Describing the UI](https://react.dev/learn/describing-the-ui) — components, JSX, conditional rendering, lists and keys
  - [Adding Interactivity](https://react.dev/learn/adding-interactivity) — event handling, state, re-renders
  - [Escape Hatches](https://react.dev/learn/escape-hatches) — effects, refs, performance patterns
- [React Reference](https://react.dev/reference/react) — API documentation for `useState`, `useEffect`, `useContext`, `memo`, and more
- [Rules of React](https://react.dev/reference/rules) — why hooks must be called unconditionally and in the same order

## TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) — types, narrowing, and generics used throughout the codebase
- [TypeScript + React](https://react.dev/learn/typescript) — official guide for typing components, props, and events

## Hooks

- [Hook API references](https://react.dev/reference/react/hooks) — `useState`, `useEffect`, `useContext`, `useMemo`, `useCallback`
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) — the basis for the `useLocalStorage` module
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) — when effects are (and are not) the right tool
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects) — dependencies, cleanup, and external systems

## Performance

- [`useMemo`](https://react.dev/reference/react/useMemo) — when memoization is (and is not) worth it
- [`useCallback`](https://react.dev/reference/react/useCallback) — stable function references for memoized children
- [`React.memo`](https://react.dev/reference/react/memo) — skipping re-renders when props are unchanged
- [React Compiler](https://react.dev/learn/react-compiler) — background on automatic memoization (future reading)

## Additional learning

- [Vite Guide](https://vite.dev/guide/) — dev server, builds, and project configuration
- [MDN Web Docs](https://developer.mozilla.org/) — HTML, CSS, DOM events, and `localStorage`
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) — used by the `useLocalStorage` custom Hook

## Topics to study next

These match the project's future extensions:

- [`useReducer`](https://react.dev/reference/react/useReducer) — richer state transitions
- [React Router](https://reactrouter.com/) — multi-page applications
- [Fetching Data](https://react.dev/learn/fetching-data) — data loading patterns and async effects
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) — graceful failure handling
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) — testing components the way users interact
