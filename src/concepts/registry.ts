export type ConceptMeta = {
  id: string;
  number: string;
  title: string;
  short: string;
  description: string;
  outcome: string;
  apis: string[];
};

export const CONCEPTS: ConceptMeta[] = [
  {
    id: 'useState',
    number: '01',
    title: 'State Management',
    short: 'useState',
    description: 'State is data that changes over time and whose change must be reflected in the UI.',
    outcome: 'Changing application data',
    apis: ['useState'],
  },
  {
    id: 'useEffect',
    number: '02',
    title: 'Side Effects',
    short: 'useEffect',
    description: 'Effects let a component synchronize with the world outside React: timers, APIs, subscriptions, and browser events.',
    outcome: 'Synchronizing with the outside world',
    apis: ['useEffect'],
  },
  {
    id: 'props-composition',
    number: '03',
    title: 'Props + Component Composition',
    short: 'Props',
    description: 'Props let a parent pass data to children; composition assembles small components into a larger interface.',
    outcome: 'Structuring components and data flow',
    apis: ['props', 'composition'],
  },
  {
    id: 'conditional-rendering',
    number: '04',
    title: 'Conditional Rendering',
    short: 'Conditional',
    description: "The UI should always represent the application's current state — loading, success, error, empty, or signed out.",
    outcome: 'UI reflects application state',
    apis: ['conditionals', 'JSX branches'],
  },
  {
    id: 'lists-keys',
    number: '05',
    title: 'List Rendering + Keys',
    short: 'Lists + Keys',
    description: 'Lists turn collections of data into repeated UI, and keys give React a stable identity for each item.',
    outcome: 'Collections and stable identity',
    apis: ['.map()', 'key'],
  },
  {
    id: 'events-forms',
    number: '06',
    title: 'Event Handling + Forms',
    short: 'Events + Forms',
    description: 'Events are how user actions enter the app; forms add validation, submission state, and feedback.',
    outcome: 'User actions become state changes',
    apis: ['onChange', 'onSubmit', 'useCallback', 'useMemo'],
  },
  {
    id: 'context',
    number: '07',
    title: 'Context API',
    short: 'Context',
    description: 'Context distributes genuinely shared information across the tree without passing it through every level.',
    outcome: 'Shared data across components',
    apis: ['createContext', 'Provider', 'useContext'],
  },
  {
    id: 'custom-hooks',
    number: '08',
    title: 'Custom Hooks + Performance',
    short: 'Custom Hooks',
    description: 'Custom Hooks extract reusable React logic; memoization avoids repeating work when nothing changed.',
    outcome: 'Reusable logic and performance',
    apis: ['custom hooks', 'useMemo'],
  },
];

export const CONCEPT_IDS: ReadonlySet<string> = new Set(CONCEPTS.map((concept) => concept.id));
