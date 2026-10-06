import { useState } from 'react';
import { ConceptSection } from '../../components/ConceptSection';
import { DebugInsight } from '../../components/DebugInsight';
import { Explanation } from '../../components/Explanation';
import { FlowSteps } from '../../components/FlowSteps';
import { PlaygroundCard } from '../../components/PlaygroundCard';
import { StatGrid } from '../../components/StatGrid';
import { VerificationCard } from '../../components/VerificationCard';

type Status = 'online' | 'away' | 'offline';

type UserCardProps = {
  name: string;
  title: string;
  status: Status;
};

function UserCard({ name, title, status }: UserCardProps) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="child-card">
      <h4>UserCard</h4>
      <div className="btn-row" style={{ alignItems: 'center' }}>
        <span className="badge badge-accent">{initials || '?'}</span>
        <div>
          <strong>{name}</strong>
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{title}</span>
        </div>
      </div>
      <span className={status === 'online' ? 'badge badge-success' : 'badge badge-warn'}>status: {status}</span>
      <p className="note-box">
        receives props → <code>name</code>, <code>title</code>, <code>status</code>
      </p>
    </div>
  );
}

type StatsCardProps = {
  label: string;
  value: number;
};

function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="child-card">
      <h4>StatsCard</h4>
      <div className="big-value" style={{ fontSize: '2.25rem', padding: '0.25rem 0' }}>
        {value}
      </div>
      <p className="centered" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        {label}
      </p>
      <p className="note-box">
        receives props → <code>label</code>, <code>value</code>
      </p>
    </div>
  );
}

type ActionButtonProps = {
  label: string;
  onAction: () => void;
};

function ActionButton({ label, onAction }: ActionButtonProps) {
  return (
    <div className="child-card">
      <h4>ActionButton</h4>
      <button type="button" className="btn btn-primary btn-large" onClick={onAction}>
        {label}
      </button>
      <p className="note-box">
        receives props → <code>label</code>, <code>onAction</code>
      </p>
    </div>
  );
}

function CompositionPlayground() {
  const [name, setName] = useState('Ada Lovelace');
  const [title, setTitle] = useState('Frontend Engineer');
  const [status, setStatus] = useState<Status>('online');
  const [taskValue, setTaskValue] = useState(12);
  const [buttonLabel, setButtonLabel] = useState('Send Message');
  const [actionMessage, setActionMessage] = useState('Try the button below each card.');

  return (
    <div className="playground-body">
      <FlowSteps steps={['Dashboard (owner)', 'Props', 'Child Components']} />

      <div className="panel">
        <h4>Props editor — this is the parent's state</h4>
        <div className="field-row">
          <div className="field">
            <label htmlFor="props-name">Name</label>
            <input id="props-name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="props-title">Title</label>
            <input id="props-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="props-status">Status</label>
            <select
              id="props-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as Status)}
            >
              <option value="online">online</option>
              <option value="away">away</option>
              <option value="offline">offline</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="props-value">Tasks completed</label>
            <input
              id="props-value"
              type="number"
              value={taskValue}
              onChange={(event) => setTaskValue(Number(event.target.value))}
            />
          </div>
          <div className="field">
            <label htmlFor="props-label">Button label</label>
            <input id="props-label" value={buttonLabel} onChange={(event) => setButtonLabel(event.target.value)} />
          </div>
        </div>
      </div>

      <div className="panel">
        <h4>Dashboard (parent) → composes three children</h4>
        <div className="panel-grid">
          <UserCard name={name} title={title} status={status} />
          <StatsCard label="Tasks completed" value={taskValue} />
          <ActionButton
            label={buttonLabel}
            onAction={() => setActionMessage(`“${buttonLabel}” sent to ${name}`)}
          />
        </div>
        <p className="note-box" aria-live="polite">
          {actionMessage}
        </p>
        <StatGrid
          items={[
            { label: 'Data owner', value: 'Dashboard (parent)', accent: true },
            { label: 'Prop direction', value: 'Parent → Child' },
            { label: 'Children', value: '3 components' },
          ]}
        />
        <p className="note-box">
          Edit the props above: the parent's state changes, new values travel down, and each child updates — the
          child components themselves never change.
        </p>
      </div>
    </div>
  );
}

export function PropsModule() {
  return (
    <ConceptSection id="props-composition">
      <Explanation
        what="Props are read-only inputs a parent gives a child. The child renders whatever it receives; the parent decides the values."
        why="Data flows in one direction, so it is easy to trace. Reusable components like UserCard or ActionButton can be composed anywhere."
      />
      <PlaygroundCard
        title="Component Builder"
        hint="Edit the props in the parent's editor and watch every child update without touching the child components."
      >
        <CompositionPlayground />
      </PlaygroundCard>
      <VerificationCard
        questions={[
          {
            prompt: 'UserCard displays a name. Where does that value actually live?',
            options: [
              'In the Dashboard (parent) component — UserCard only receives a copy',
              'Inside UserCard — each child keeps its own copy of the data',
              'In the browser until the page is refreshed',
              'In a database that UserCard reads from',
            ],
            correctIndex: 0,
            explanation:
              'Props flow downward: the parent owns the state and passes values down. The child renders what it receives.',
          },
          {
            prompt: 'Which direction does a prop travel?',
            options: [
              'From child up to parent',
              'From parent down to child',
              'Both directions at the same time',
              'Between sibling components without a parent',
            ],
            correctIndex: 1,
            explanation:
              'Props travel parent → child. Children cannot push props back up; they call callback functions the parent passed down instead.',
          },
        ]}
      />
      <DebugInsight
        items={[
          'Where does this data come from?',
          'Which component owns it — who holds the state?',
          'Is it being passed through components that never use it?',
          'Could the child receive less data and derive the rest itself?',
        ]}
      />
    </ConceptSection>
  );
}
