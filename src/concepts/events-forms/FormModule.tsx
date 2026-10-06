import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ConceptSection } from '../../components/ConceptSection';
import { DebugInsight } from '../../components/DebugInsight';
import { Explanation } from '../../components/Explanation';
import { FlowSteps } from '../../components/FlowSteps';
import { PlaygroundCard } from '../../components/PlaygroundCard';
import { StatGrid } from '../../components/StatGrid';
import { VerificationCard } from '../../components/VerificationCard';
import { expensiveStats } from '../../utils/expensiveStats';

type SubmitRecord = {
  id: number;
  name: string;
  email: string;
  time: string;
};

type FormErrors = {
  name?: string;
  email?: string;
};

function validateForm(name: string, email: string): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) {
    errors.name = 'Name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }
  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  return errors;
}

type MemoChildProps = {
  label: string;
  note: string;
  onAction: () => void;
};

const MemoChild = memo(function MemoChild({ label, note, onAction }: MemoChildProps) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="child-card">
      <h4>{label}</h4>
      <button type="button" className="btn" onClick={onAction}>
        Count actions
      </button>
      <StatGrid
        items={[
          { label: 'Child renders', value: `#${renderCount.current}`, accent: true },
          { label: 'Handler', value: note },
        ]}
      />
    </div>
  );
});

function FormPlayground() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [records, setRecords] = useState<SubmitRecord[]>([]);
  const [actionCount, setActionCount] = useState(0);
  const [bump, setBump] = useState(0);
  const [range, setRange] = useState(600_000);
  const nextRecordIdRef = useRef(1);
  const timerRef = useRef<number | null>(null);
  const computeCountRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const stableHandler = useCallback(() => {
    setActionCount((count) => count + 1);
  }, []);

  const plainHandler = () => {
    setActionCount((count) => count + 1);
  };

  const result = useMemo(() => {
    computeCountRef.current += 1;
    return expensiveStats(range);
  }, [range]);

  const updateName = (value: string) => {
    setName(value);
    setErrors((prev) => ({ ...prev, name: undefined }));
    if (status === 'success') {
      setStatus('idle');
    }
  };

  const updateEmail = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: undefined }));
    if (status === 'success') {
      setStatus('idle');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(name, email);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setStatus('submitting');
    timerRef.current = window.setTimeout(() => {
      const record: SubmitRecord = {
        id: nextRecordIdRef.current,
        name: name.trim(),
        email: email.trim(),
        time: new Date().toLocaleTimeString(),
      };
      nextRecordIdRef.current += 1;
      setRecords((prev) => [record, ...prev]);
      setStatus('success');
      setName('');
      setEmail('');
      timerRef.current = null;
    }, 900);
  };

  return (
    <div className="playground-body">
      <FlowSteps steps={['User Action', 'Event Handler', 'State Update', 'Re-render', 'Updated UI']} />

      <div className="panel">
        <h4>Controlled form</h4>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-row">
            <div className="field">
              <label htmlFor="form-name">Name</label>
              <input
                id="form-name"
                value={name}
                placeholder="Ada Lovelace"
                aria-invalid={errors.name ? true : undefined}
                onChange={(event) => updateName(event.target.value)}
              />
              {errors.name ? <span className="field-error">{errors.name}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="form-email">Email</label>
              <input
                id="form-email"
                type="email"
                value={email}
                placeholder="ada@example.com"
                aria-invalid={errors.email ? true : undefined}
                onChange={(event) => updateEmail(event.target.value)}
              />
              {errors.email ? <span className="field-error">{errors.email}</span> : null}
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: '0.875rem', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting…' : 'Submit'}
            </button>
            <span className="badge">form state: {status}</span>
          </div>
        </form>
        <div aria-live="polite">
          {status === 'submitting' ? (
            <p className="note-box">Submitting — the button is disabled so the user cannot double-submit.</p>
          ) : null}
          {status === 'success' ? (
            <p className="note-box ok">Submission saved — fields cleared and the record list updated.</p>
          ) : null}
        </div>
        <StatGrid
          items={[
            { label: 'name (state)', value: name ? `"${name}"` : '""', accent: true },
            { label: 'email (state)', value: email ? `"${email}"` : '""', accent: true },
            { label: 'Records', value: `${records.length}` },
          ]}
        />
      </div>

      <div className="panel">
        <h4>Submitted records</h4>
        {records.length === 0 ? (
          <p className="note-box">No submissions yet — the empty state renders instead of a list.</p>
        ) : (
          <ul className="plain-list">
            {records.map((record) => (
              <li className="note-box" key={record.id}>
                <strong>
                  #{record.id} {record.name}
                </strong>{' '}
                — {record.email} <span className="badge">saved {record.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h4>useCallback — stable references</h4>
          <div className="btn-row">
            <button type="button" className="btn" onClick={() => setBump((value) => value + 1)}>
              Re-render parent ({bump})
            </button>
            <span className="badge">actions: {actionCount}</span>
          </div>
          <MemoChild label="Plain handler" note="new reference each render" onAction={plainHandler} />
          <MemoChild label="useCallback handler" note="same reference" onAction={stableHandler} />
          <p className="note-box">
            Both buttons work identically. Re-render the parent: the plain-handler child re-renders (new function
            reference), the useCallback child does not. That stability only matters when the handler is passed to a
            memoized child — plain handlers are fine everywhere else.
          </p>
        </div>

        <div className="panel">
          <h4>useMemo — skip repeated calculation</h4>
          <div className="btn-row">
            <button
              type="button"
              className="btn"
              onClick={() => setRange((value) => value + 300_000)}
            >
              Change range ({range.toLocaleString()})
            </button>
            <button type="button" className="btn" onClick={() => setBump((value) => value + 1)}>
              Re-render only
            </button>
          </div>
          <StatGrid
            items={[
              { label: 'Times computed', value: `${computeCountRef.current}`, accent: true },
              { label: 'Last duration', value: `${result.ms} ms` },
              { label: 'Checksum', value: `${result.checksum}` },
              { label: 'Re-renders', value: `${bump}` },
            ]}
          />
          <p className="note-box">
            The calculation re-runs only when its dependency (range) changes. Re-renders from other state reuse the
            memoized value. This is an optimization — the code would be correct without it.
          </p>
        </div>
      </div>
    </div>
  );
}

export function FormModule() {
  return (
    <ConceptSection id="events-forms">
      <Explanation
        what="An event handler runs when the user acts. In a controlled form the input value comes from state: the handler updates state, React re-renders, and the input shows the new value."
        why="This single loop powers every interaction. useCallback stabilizes function references and useMemo caches expensive results — both are optimizations, never requirements."
      />
      <PlaygroundCard
        title="Form Playground"
        hint="Type, trigger validation, submit, then explore the useCallback and useMemo panels."
      >
        <FormPlayground />
      </PlaygroundCard>
      <VerificationCard
        questions={[
          {
            prompt: 'The user types a character into the name input. Which sequence matches React’s flow?',
            options: [
              'Event handler → state update → re-render → updated UI',
              'Re-render → state update → event handler → updated UI',
              'State update → browser refresh → event handler',
              'Event handler edits the DOM directly with no re-render',
            ],
            correctIndex: 0,
            explanation:
              'The onChange handler fires, setState stores the new value, React re-renders, and the input — whose value comes from state — displays the character.',
          },
          {
            prompt: 'When is useCallback actually useful?',
            options: [
              'When a stable function reference matters, such as a handler passed to a memoized child',
              'For every event handler, always',
              'When the function is only used once',
              'To make validation run faster',
            ],
            correctIndex: 0,
            explanation:
              'useCallback prevents a function from getting a new identity each render. That pays off only when something depends on identity (like React.memo). Otherwise it adds overhead for no benefit.',
          },
        ]}
      />
      <DebugInsight
        items={[
          'What event fired, and which handler is attached to it?',
          'Which state changed as a result?',
          'Can the user trigger the operation twice while it is submitting?',
          'Is validation handled before the async work starts?',
        ]}
      />
    </ConceptSection>
  );
}
