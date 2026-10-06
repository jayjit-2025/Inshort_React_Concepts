import { useMemo, useRef, useState } from 'react';
import { ConceptSection } from '../../components/ConceptSection';
import { DebugInsight } from '../../components/DebugInsight';
import { Explanation } from '../../components/Explanation';
import { FlowSteps } from '../../components/FlowSteps';
import { PlaygroundCard } from '../../components/PlaygroundCard';
import { StatGrid } from '../../components/StatGrid';
import { VerificationCard } from '../../components/VerificationCard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { expensiveStats } from '../../utils/expensiveStats';

type Note = {
  id: string;
  text: string;
};

function NotesPlayground() {
  const notes = useLocalStorage<Note[]>('react-mastery-notes', []);
  const draft = useLocalStorage<string>('react-mastery-draft', '');
  const [newNote, setNewNote] = useState('');
  const [bump, setBump] = useState(0);
  const computeCountRef = useRef(0);

  const stats = useMemo(() => {
    computeCountRef.current += 1;
    return expensiveStats(500_000);
  }, [notes.value]);

  const addNote = () => {
    const text = newNote.trim();
    if (!text) {
      return;
    }
    notes.setValue((previous) => [...previous, { id: crypto.randomUUID(), text }]);
    setNewNote('');
  };

  const removeNote = (id: string) => {
    notes.setValue((previous) => previous.filter((note) => note.id !== id));
  };

  return (
    <div className="playground-body">
      <FlowSteps steps={['Component Uses Hook', 'useLocalStorage', 'State + Effect + Browser Storage']} />

      <div className="panel-grid">
        <div className="panel">
          <h4>Notes (persisted by the custom hook)</h4>
          <form
            className="btn-row"
            style={{ alignItems: 'flex-end' }}
            onSubmit={(event) => {
              event.preventDefault();
              addNote();
            }}
          >
            <div className="field" style={{ flex: 1, minWidth: '180px' }}>
              <label htmlFor="note-input">New note</label>
              <input
                id="note-input"
                value={newNote}
                placeholder="Learn how hooks share logic"
                onChange={(event) => setNewNote(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add note
            </button>
          </form>
          <ul className="plain-list">
            {notes.value.map((note) => (
              <li className="note-box" key={note.id}>
                <div className="btn-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{note.text}</span>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => removeNote(note.id)}
                    aria-label={`Delete note ${note.text}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {notes.value.length === 0 ? <p className="note-box">No notes yet — add one, then refresh the page.</p> : null}
          </ul>
          <div className="btn-row">
            <button type="button" className="btn" onClick={() => notes.setValue([])}>
              Clear all notes
            </button>
          </div>
          <StatGrid
            items={[
              { label: 'Notes', value: `${notes.value.length}`, accent: true },
              { label: 'Storage key', value: 'react-mastery-notes' },
              { label: 'Last storage action', value: notes.lastAction },
            ]}
          />
        </div>

        <div className="panel">
          <h4>Second consumer of the same hook</h4>
          <div className="field">
            <label htmlFor="draft-input">Persistent draft (useLocalStorage again)</label>
            <input
              id="draft-input"
              value={draft.value}
              placeholder="Type something, then refresh"
              onChange={(event) => draft.setValue(event.target.value)}
            />
          </div>
          <StatGrid
            items={[
              { label: 'Storage key', value: 'react-mastery-draft' },
              { label: 'Last storage action', value: draft.lastAction },
            ]}
          />
          <p className="note-box">
            One hook, two independent instances with different keys. Refresh the browser: both values come back
            because the hook synchronized them with localStorage.
          </p>
        </div>
      </div>

      <div className="panel">
        <h4>Component vs Custom Hook</h4>
        <pre className="code-block">{'const { value, setValue } = useLocalStorage(\'react-mastery-notes\', [])'}</pre>
        <div className="panel-grid">
          <p className="note-box">
            <strong>Reusable UI → Component:</strong> UserCard, StatGrid, and the note rows above.
          </p>
          <p className="note-box">
            <strong>Reusable React logic → Custom Hook:</strong> the reading, writing, and state sync hidden inside
            useLocalStorage.
          </p>
        </div>
        <p className="note-box">
          The components never touch localStorage themselves — the hook owns that logic, so any component can reuse
          it without duplicating a single line.
        </p>
      </div>

      <div className="panel">
        <h4>Memoization — recompute only when the notes change</h4>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => setBump((value) => value + 1)}>
            Re-render only ({bump})
          </button>
          <button type="button" className="btn" onClick={() => notes.setValue([])}>
            Change notes (clear)
          </button>
        </div>
        <StatGrid
          items={[
            { label: 'Times computed', value: `${computeCountRef.current}`, accent: true },
            { label: 'Last duration', value: `${stats.ms} ms` },
            { label: 'Checksum', value: `${stats.checksum}` },
            { label: 'Notes count', value: `${notes.value.length}` },
          ]}
        />
        <p className="note-box">
          The expensive calculation re-runs only when notes.value changes. Pressing “Re-render only” increases the
          render count but not the compute count. Memoization is an optimization — add it when there is a measured
          reason, not by default.
        </p>
      </div>
    </div>
  );
}

export function HooksModule() {
  return (
    <ConceptSection id="custom-hooks">
      <Explanation
        what="A custom Hook is a function that uses other Hooks and can be reused by any component. It packages stateful logic — like localStorage sync — away from the UI."
        why="Reusable UI becomes components; reusable React logic becomes Hooks. useMemo then keeps expensive calculations from repeating on every unrelated render."
      />
      <PlaygroundCard
        title="Notes / Storage Playground"
        hint="Add notes, refresh the page to see persistence, and watch when the memoized calculation re-runs."
      >
        <NotesPlayground />
      </PlaygroundCard>
      <VerificationCard
        questions={[
          {
            prompt: 'Which of these should become a custom Hook?',
            options: [
              'Logic that reads and writes localStorage and could be reused by several components',
              'A card layout used on two pages',
              'A one-off multiplication inside a single component',
              'The CSS rules for buttons',
            ],
            correctIndex: 0,
            explanation:
              'Custom Hooks carry reusable React logic — state, effects, subscriptions. Reusable markup becomes a component; one-off code stays where it is.',
          },
          {
            prompt: 'When should useMemo be used?',
            options: [
              'When recalculation is expensive and its dependencies rarely change',
              'For every value computed in a component',
              'Whenever a variable uses const',
              'To prevent bugs — it makes code safer',
            ],
            correctIndex: 0,
            explanation:
              'useMemo trades memory for skipped computation. Use it when the work is measurable and dependencies are stable — never as a correctness requirement or a reflex.',
          },
        ]}
      />
      <DebugInsight
        items={[
          'Is this logic duplicated across components?',
          'Does it use Hooks itself — state or effects (then it belongs in a Hook)?',
          'Would a plain function be enough (no Hooks inside)?',
          'Is memoization solving a measured problem, or just adding overhead?',
        ]}
      />
    </ConceptSection>
  );
}
