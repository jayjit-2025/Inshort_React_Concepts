import { CONCEPTS } from '../concepts/registry';

export function MentalModel() {
  return (
    <section id="mental-model" className="concept-section" aria-labelledby="mental-model-heading">
      <header className="concept-header">
        <div className="concept-number" aria-hidden="true">
          ↗
        </div>
        <div>
          <div className="concept-badges">
            <span className="badge badge-accent">Summary</span>
          </div>
          <h2 id="mental-model-heading">How the 8 Concepts Connect</h2>
          <p className="concept-description">
            One connected mental model — not eight unrelated APIs. Each concept answers the question the previous one
            raises. Click any step to jump back to it.
          </p>
        </div>
      </header>

      <div className="mental-flow">
        {CONCEPTS.map((concept, index) => (
          <div className="mental-flow-item" key={concept.id}>
            <div className="mental-node">
              <a href={`#${concept.id}`}>
                <span className="mental-number">{concept.number}</span>
                <h3>{concept.short}</h3>
                <p>{concept.outcome}</p>
              </a>
            </div>
            {index < CONCEPTS.length - 1 ? (
              <span className="mental-arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <p className="note-box">
        State changes <strong>→</strong> effects synchronize with the outside world <strong>→</strong> props structure
        the components <strong>→</strong> rendering reflects state <strong>→</strong> lists handle collections{' '}
        <strong>→</strong> events turn user actions into state changes <strong>→</strong> context shares what is
        common <strong>→</strong> custom hooks reuse and optimize the logic.
      </p>
    </section>
  );
}
