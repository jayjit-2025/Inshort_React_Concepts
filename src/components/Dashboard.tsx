import { CONCEPTS } from '../concepts/registry';
import { useProgress } from '../context/ProgressContext';

export function DashboardHeader() {
  const { completedCount, total } = useProgress();
  const percent = Math.round((completedCount / total) * 100);

  return (
    <header className="site-header" id="dashboard">
      <div className="container">
        <span className="badge badge-accent">8 concepts · interactive practice</span>
        <h1>React Mastery Tutorial</h1>
        <p className="site-subtitle">
          Master the 8 essential React patterns through interactive practice. Read the short explanation, play with
          the playground, then verify what you understood.
        </p>
        <div
          className="progress-block"
          role="status"
          aria-label={`${completedCount} of ${total} concepts completed`}
        >
          <div className="progress-label">
            <span>
              <strong>
                {completedCount} / {total}
              </strong>{' '}
              concepts completed
            </span>
            <span>{percent}%</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Course progress"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={completedCount}
          >
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}

export function DashboardCards() {
  const { isCompleted } = useProgress();

  return (
    <section className="dashboard-section" aria-label="All concepts">
      <div className="card-title-row">
        <h2 className="dashboard-heading">All concepts</h2>
        <span className="badge">In order · 01 → 08</span>
      </div>
      <div className="dashboard-grid">
        {CONCEPTS.map((concept) => {
          const completed = isCompleted(concept.id);
          return (
            <a className="concept-card" href={`#${concept.id}`} key={concept.id}>
              <div className="concept-card-top">
                <span className="concept-card-number">{concept.number}</span>
                <span className={completed ? 'badge badge-success' : 'badge'}>
                  {completed ? 'Completed' : 'Not started'}
                </span>
              </div>
              <h3>{concept.title}</h3>
              <p>{concept.description}</p>
              <div className="concept-badges">
                {concept.apis.map((api) => (
                  <span className="badge" key={api}>
                    {api}
                  </span>
                ))}
              </div>
              <span className="card-action">{completed ? 'Review' : 'Start'} →</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
