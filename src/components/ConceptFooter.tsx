import { CONCEPTS } from '../concepts/registry';
import { useProgress } from '../context/ProgressContext';

type ConceptFooterProps = {
  id: string;
};

export function ConceptFooter({ id }: ConceptFooterProps) {
  const { isCompleted, toggleComplete } = useProgress();
  const index = CONCEPTS.findIndex((concept) => concept.id === id);
  const meta = CONCEPTS[index];
  const previous = index > 0 ? CONCEPTS[index - 1] : null;
  const next = index < CONCEPTS.length - 1 ? CONCEPTS[index + 1] : null;
  const completed = isCompleted(id);

  return (
    <nav className="concept-footer" aria-label={`Navigation for ${meta.title}`}>
      <div>
        {previous ? (
          <a className="btn" href={`#${previous.id}`}>
            ← {previous.number} {previous.short}
          </a>
        ) : (
          <a className="btn" href="#dashboard">
            ↑ Dashboard
          </a>
        )}
      </div>
      <button
        type="button"
        className={completed ? 'status-chip is-done' : 'status-chip'}
        aria-pressed={completed}
        onClick={() => toggleComplete(id)}
      >
        <span className="status-dot" aria-hidden="true" />
        {completed ? 'Completed' : 'Mark as complete'}
      </button>
      <div>
        {next ? (
          <a className="btn btn-primary" href={`#${next.id}`}>
            {next.number} {next.short} →
          </a>
        ) : (
          <a className="btn btn-primary" href="#mental-model">
            How they connect →
          </a>
        )}
      </div>
    </nav>
  );
}
