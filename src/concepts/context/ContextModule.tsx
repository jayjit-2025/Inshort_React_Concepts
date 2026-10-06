import { Fragment, createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ConceptSection } from '../../components/ConceptSection';
import { DebugInsight } from '../../components/DebugInsight';
import { Explanation } from '../../components/Explanation';
import { FlowSteps } from '../../components/FlowSteps';
import { PlaygroundCard } from '../../components/PlaygroundCard';
import { StatGrid } from '../../components/StatGrid';
import { VerificationCard } from '../../components/VerificationCard';

type ThemeName = 'light' | 'dark' | 'ocean';

type ThemeColors = {
  label: string;
  page: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
};

const THEMES: Record<ThemeName, ThemeColors> = {
  light: {
    label: 'Light',
    page: '#f7f8fa',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#5b6472',
    accent: '#2563eb',
    accentText: '#ffffff',
    border: '#e5e7eb',
  },
  dark: {
    label: 'Dark',
    page: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    muted: '#94a3b8',
    accent: '#38bdf8',
    accentText: '#0f172a',
    border: '#334155',
  },
  ocean: {
    label: 'Ocean',
    page: '#eef6f6',
    surface: '#ffffff',
    text: '#0f3f3f',
    muted: '#4a6a6a',
    accent: '#0d9488',
    accentText: '#ffffff',
    border: '#cfe6e4',
  },
};

type ThemeContextValue = {
  theme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('light');
  const value: ThemeContextValue = { theme, colors: THEMES[theme], setTheme };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function ConsumerBadge({ colors }: { colors: ThemeColors }) {
  return (
    <span
      className="badge"
      style={{ background: colors.surface, color: colors.accent, borderColor: colors.border }}
    >
      read via useContext
    </span>
  );
}

function DemoHeader() {
  const { theme, colors, setTheme } = useTheme();
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        padding: '0.75rem 1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: colors.text,
      }}
    >
      <div className="btn-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <strong>Header</strong>
        <ConsumerBadge colors={colors} />
      </div>
      <div className="btn-row" style={{ gap: '0.375rem' }}>
        {(Object.keys(THEMES) as ThemeName[]).map((name) => (
          <button
            type="button"
            key={name}
            aria-pressed={theme === name}
            onClick={() => setTheme(name)}
            className="btn"
            style={{
              background: theme === name ? colors.accent : colors.surface,
              color: theme === name ? colors.accentText : colors.text,
              borderColor: colors.border,
              padding: '0.25rem 0.625rem',
              fontSize: '0.8125rem',
            }}
          >
            {THEMES[name].label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DemoSidebar() {
  const { colors } = useTheme();
  const items = ['Dashboard', 'Profile', 'Settings', 'Billing'];
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        padding: '0.875rem 1rem',
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div className="btn-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <strong>Sidebar</strong>
        <ConsumerBadge colors={colors} />
      </div>
      <ul className="plain-list" style={{ color: colors.muted, fontSize: '0.875rem' }}>
        {items.map((item) => (
          <li key={item}>▸ {item}</li>
        ))}
      </ul>
    </div>
  );
}

function DemoDashboard() {
  const { theme, colors } = useTheme();
  const stats = [
    { label: 'Visitors', value: '1,204' },
    { label: 'Signups', value: '86' },
    { label: 'Theme in use', value: colors.label },
  ];
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        padding: '0.875rem 1rem',
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div className="btn-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <strong>Dashboard</strong>
        <ConsumerBadge colors={colors} />
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div
            className="stat"
            key={stat.label}
            style={{ background: colors.page, borderColor: colors.border }}
          >
            <span className="stat-label" style={{ color: colors.muted }}>
              {stat.label}
            </span>
            <span className="stat-value" style={{ color: colors.text }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
      <p style={{ color: colors.muted, fontSize: '0.8125rem' }}>
        Current context value: <code>theme = "{theme}"</code>
      </p>
    </div>
  );
}

function DemoFooter() {
  const { colors } = useTheme();
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        padding: '0.75rem 1rem',
        color: colors.muted,
        fontSize: '0.8125rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'space-between',
      }}
    >
      <span>Footer — themed like everything else</span>
      <ConsumerBadge colors={colors} />
    </div>
  );
}

function ThemeDemo() {
  const { theme, colors } = useTheme();
  return (
    <div
      className="panel"
      style={{
        background: colors.page,
        borderColor: colors.border,
        color: colors.text,
        gap: '0.75rem',
      }}
    >
      <div className="btn-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: colors.text, margin: 0 }}>Mini app with shared theme</h4>
        <span
          className="badge badge-accent"
          style={{ background: colors.accent, color: colors.accentText, borderColor: colors.accent }}
        >
          theme = {theme}
        </span>
      </div>
      <DemoHeader />
      <div className="panel-grid">
        <DemoSidebar />
        <DemoDashboard />
      </div>
      <DemoFooter />
      <StatGrid
        items={[
          { label: 'State owner', value: 'ThemeProvider (useState)', accent: true },
          { label: 'Distribution', value: 'Context Provider' },
          { label: 'Consumers', value: 'Header, Sidebar, Dashboard, Footer' },
        ]}
      />
      <p
        className="note-box"
        style={{ background: colors.surface, borderColor: colors.border, color: colors.muted }}
      >
        Switch the theme in the header: four distant components update together because they all read the same
        context — no prop was drilled through Header or Sidebar to reach them.
      </p>
    </div>
  );
}

function DiagramComparison() {
  const [view, setView] = useState<'drill' | 'context'>('drill');
  const chain = ['App', 'Header', 'Sidebar', 'Action'];
  const consumers = ['Header', 'Sidebar', 'Dashboard', 'Footer'];

  return (
    <div className="panel">
      <h4>Prop drilling vs Context</h4>
      <div className="segmented" role="group" aria-label="Comparison view">
        <button type="button" aria-pressed={view === 'drill'} onClick={() => setView('drill')}>
          Prop drilling
        </button>
        <button type="button" aria-pressed={view === 'context'} onClick={() => setView('context')}>
          Context
        </button>
      </div>
      {view === 'drill' ? (
        <div className="btn-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
          {chain.map((node, index) => (
            <Fragment key={node}>
              <span className={index === 0 ? 'badge badge-accent' : 'badge'}>{node}</span>
              {index < chain.length - 1 ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  — theme →
                </span>
              ) : null}
            </Fragment>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="badge badge-accent" style={{ alignSelf: 'flex-start' }}>
            ThemeProvider (holds the state)
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
            ↓ value reaches every consumer directly
          </span>
          <div className="btn-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
            {consumers.map((node, index) => (
              <Fragment key={node}>
                <span className="badge">{node} (useContext)</span>
                {index < consumers.length - 1 ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>·</span>
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      )}
      <p className="note-box">
        {view === 'drill'
          ? 'Drilling: the theme prop must pass through Header and Sidebar even though neither of them uses it.'
          : 'Context: the provider holds the value, and any consumer below it reads it directly — intermediate components are uninvolved.'}
      </p>
    </div>
  );
}

export function ContextModule() {
  return (
    <ConceptSection id="context">
      <Explanation
        what="A Provider stores a value; any component below it can read that value with useContext, no matter how deep."
        why="It solves prop drilling for data the whole tree needs — theme, current user, language. Context distributes state; it does not replace it."
      />
      <PlaygroundCard
        title="Theme Playground"
        hint="Switch the theme and watch four distant components update at once, then compare drilling vs context."
      >
        <div className="playground-body">
          <FlowSteps steps={['State in Provider', 'Context', 'Any Consumer Reads It']} />
          <ThemeProvider>
            <ThemeDemo />
          </ThemeProvider>
          <DiagramComparison />
        </div>
      </PlaygroundCard>
      <VerificationCard
        questions={[
          {
            prompt: 'When is Context the right tool?',
            options: [
              'For genuinely shared data such as theme, current user, or language',
              'To replace every piece of local state',
              'For a text input inside a single form',
              'To make components render faster automatically',
            ],
            correctIndex: 0,
            explanation:
              'Context suits data many components across the tree actually need. Local data should stay local — Context for everything becomes a hidden global soup.',
          },
          {
            prompt: 'Where is the real theme state stored?',
            options: [
              'Inside the Context object itself',
              'In the component that owns the Provider (its useState)',
              'In every consumer that reads it',
              'In the browser DOM',
            ],
            correctIndex: 1,
            explanation:
              'Context is only the delivery mechanism. The state lives in the provider component’s useState; the context just hands that value to consumers.',
          },
        ]}
      />
      <DebugInsight
        items={[
          'Does this data genuinely need to be shared by many components?',
          'Where is the real state stored — who owns the useState?',
          'Is Context being overused when props or local state would do?',
          'How many consumers actually read this value?',
        ]}
      />
    </ConceptSection>
  );
}
