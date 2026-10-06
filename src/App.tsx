import { useEffect, useState } from 'react';
import { DashboardCards, DashboardHeader } from './components/Dashboard';
import { MentalModel } from './components/MentalModel';
import { CONCEPTS } from './concepts/registry';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { ConditionalModule } from './concepts/conditional-rendering/ConditionalModule';
import { ContextModule } from './concepts/context/ContextModule';
import { EffectModule } from './concepts/useEffect/EffectModule';
import { FormModule } from './concepts/events-forms/FormModule';
import { HooksModule } from './concepts/custom-hooks-performance/HooksModule';
import { ListModule } from './concepts/lists-keys/ListModule';
import { PropsModule } from './concepts/props-composition/PropsModule';
import { StateModule } from './concepts/useState/StateModule';

function ConceptNav() {
  const { completedCount, total } = useProgress();
  const [activeId, setActiveId] = useState('dashboard');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    const trackedIds = ['dashboard', ...CONCEPTS.map((concept) => concept.id), 'mental-model'];
    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        });
        const current = trackedIds.find((id) => visibleIds.has(id));
        if (current) {
          setActiveId(current);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    trackedIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="concept-nav" aria-label="Concept navigation">
      <div className="container nav-inner">
        <a
          className={activeId === 'dashboard' ? 'nav-link is-active' : 'nav-link'}
          href="#dashboard"
          aria-current={activeId === 'dashboard' ? 'location' : undefined}
        >
          Dashboard
        </a>
        {CONCEPTS.map((concept) => (
          <a
            className={activeId === concept.id ? 'nav-link is-active' : 'nav-link'}
            href={`#${concept.id}`}
            key={concept.id}
            aria-current={activeId === concept.id ? 'location' : undefined}
          >
            <span className="nav-num">{concept.number}</span>
            {concept.short}
          </a>
        ))}
        <span className="nav-progress" aria-label={`${completedCount} of ${total} concepts completed`}>
          {completedCount} / {total}
        </span>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <>
      <DashboardHeader />
      <ConceptNav />
      <main className="container">
        <DashboardCards />
        <StateModule />
        <EffectModule />
        <PropsModule />
        <ConditionalModule />
        <ListModule />
        <FormModule />
        <ContextModule />
        <HooksModule />
        <MentalModel />
      </main>
      <footer className="site-footer">
        <div className="container">
          React Mastery Tutorial — learn by making React do it, then watching what happens.
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}

export default App;
