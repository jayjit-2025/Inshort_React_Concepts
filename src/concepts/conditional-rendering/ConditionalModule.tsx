import { useEffect, useState } from 'react';
import { ConceptSection } from '../../components/ConceptSection';
import { DebugInsight } from '../../components/DebugInsight';
import { Explanation } from '../../components/Explanation';
import { FlowSteps } from '../../components/FlowSteps';
import { PlaygroundCard } from '../../components/PlaygroundCard';
import { StatGrid } from '../../components/StatGrid';
import { VerificationCard } from '../../components/VerificationCard';

type ProfileStatus = 'loading' | 'success' | 'error' | 'empty' | 'loggedOut';

const STATUS_OPTIONS: { value: ProfileStatus; label: string }[] = [
  { value: 'loading', label: 'Loading' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
  { value: 'empty', label: 'Empty' },
  { value: 'loggedOut', label: 'Logged out' },
];

const UI_NAMES: Record<ProfileStatus, string> = {
  loading: 'Loading indicator',
  success: 'Profile card',
  error: 'Error message + retry',
  empty: 'Empty state prompt',
  loggedOut: 'Sign-in prompt',
};

function ProfileView({ status, onRetry }: { status: ProfileStatus; onRetry: () => void }) {
  if (status === 'loading') {
    return (
      <div className="child-card centered">
        <div className="big-value" style={{ fontSize: '2rem' }}>
          …
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Loading profile…</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="child-card">
        <h4>Profile card</h4>
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <span className="badge badge-accent">JD</span>
          <div>
            <strong>Jay Doe</strong>
            <br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>jay@example.com</span>
          </div>
        </div>
        <p className="note-box ok">Data loaded — rendering the real content.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="child-card">
        <h4>Error state</h4>
        <div className="warning-box">
          <span className="warning-title">Could not load profile</span>
          <span className="warning-body">The request failed. Nothing else on the screen pretends to have data.</span>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="child-card">
        <h4>Empty state</h4>
        <p style={{ color: 'var(--text-muted)' }}>No profile yet. Add your details to get started.</p>
        <div className="btn-row">
          <button type="button" className="btn">
            Complete profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="child-card">
      <h4>Signed out</h4>
      <p style={{ color: 'var(--text-muted)' }}>Sign in to view your profile.</p>
      <div className="btn-row">
        <button type="button" className="btn btn-primary">
          Sign in
        </button>
      </div>
    </div>
  );
}

function ProfilePlayground() {
  const [status, setStatus] = useState<ProfileStatus>('success');
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!retrying) {
      return;
    }
    const timerId = window.setTimeout(() => {
      setStatus('success');
      setRetrying(false);
    }, 1200);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [retrying]);

  const chooseStatus = (next: ProfileStatus) => {
    setStatus(next);
    setRetrying(false);
  };

  const retry = () => {
    setStatus('loading');
    setRetrying(true);
  };

  return (
    <div className="playground-body">
      <FlowSteps steps={['Application State', 'Conditional Rendering', 'What the User Sees']} />

      <div className="panel">
        <h4>Simulate an application state</h4>
        <div className="segmented" role="group" aria-label="Application state">
          {STATUS_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              aria-pressed={status === option.value}
              onClick={() => chooseStatus(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <StatGrid
          items={[
            { label: 'Application state', value: status, accent: true },
            { label: 'Rendered UI', value: UI_NAMES[status] },
            { label: 'States shown at once', value: 'Exactly 1' },
            { label: 'Retry in flight', value: retrying ? 'Yes' : 'No' },
          ]}
        />
      </div>

      <div className="panel">
        <h4>Rendered result</h4>
        <ProfileView status={status} onRetry={retry} />
        <p className="note-box">
          Only one branch renders. Contradictory combinations like loading + error + success are impossible because
          the UI is chosen from a single state value.
        </p>
      </div>
    </div>
  );
}

export function ConditionalModule() {
  return (
    <ConceptSection id="conditional-rendering">
      <Explanation
        what="Conditional rendering picks which UI to output based on state: an if, an early return, or a ternary in the JSX."
        why="Real apps have many possible states. Showing the wrong one — or several at once — confuses users and hides real problems."
      />
      <PlaygroundCard
        title="User Profile State Machine"
        hint="Switch the application state and watch the rendered result change. Try “Try again” from the error state."
      >
        <ProfilePlayground />
      </PlaygroundCard>
      <VerificationCard
        questions={[
          {
            prompt: 'The API request failed. Which UI should appear?',
            options: ['Loading spinner', 'Success profile card', 'Error state with a retry option', 'All of the above'],
            correctIndex: 2,
            explanation:
              'The application is in an error state, so exactly one branch renders: the error UI. Showing loading or success alongside it would be contradictory.',
          },
          {
            prompt: 'The user is not signed in. Which state matches?',
            options: ['Empty state', 'Logged out state', 'Success state', 'Error state'],
            correctIndex: 1,
            explanation:
              'Each real situation maps to one application state, and that state maps to one UI. Logged out has its own dedicated branch.',
          },
        ]}
      />
      <DebugInsight
        items={[
          'What state is the application in right now?',
          'Does the visible UI represent that state?',
          'Can contradictory states appear together?',
          'Is every branch reachable — any state with no UI?',
        ]}
      />
    </ConceptSection>
  );
}
