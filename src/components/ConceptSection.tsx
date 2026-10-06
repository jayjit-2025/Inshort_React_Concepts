import type { ReactNode } from 'react';
import { CONCEPTS } from '../concepts/registry';
import { ConceptFooter } from './ConceptFooter';
import { ConceptIdContext } from './ConceptIdContext';

type ConceptSectionProps = {
  id: string;
  children: ReactNode;
};

export function ConceptSection({ id, children }: ConceptSectionProps) {
  const meta = CONCEPTS.find((concept) => concept.id === id);
  if (!meta) {
    throw new Error(`Unknown concept id "${id}" — add it to src/concepts/registry.ts`);
  }

  return (
    <section id={meta.id} className="concept-section" aria-labelledby={`${meta.id}-heading`}>
      <ConceptIdContext.Provider value={meta.id}>
        <header className="concept-header">
          <div className="concept-number" aria-hidden="true">
            {meta.number}
          </div>
          <div>
            <div className="concept-badges">
              {meta.apis.map((api) => (
                <span className="badge badge-accent" key={api}>
                  {api}
                </span>
              ))}
            </div>
            <h2 id={`${meta.id}-heading`}>{meta.title}</h2>
            <p className="concept-description">{meta.description}</p>
          </div>
        </header>
        <div className="concept-body">{children}</div>
        <ConceptFooter id={meta.id} />
      </ConceptIdContext.Provider>
    </section>
  );
}
