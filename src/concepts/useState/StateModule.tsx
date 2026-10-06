import { useRef, useState } from 'react';
import { ConceptSection } from '../../components/ConceptSection';
import { DebugInsight } from '../../components/DebugInsight';
import { Explanation } from '../../components/Explanation';
import { FlowSteps } from '../../components/FlowSteps';
import { PlaygroundCard } from '../../components/PlaygroundCard';
import { StatGrid } from '../../components/StatGrid';
import { VerificationCard } from '../../components/VerificationCard';

function CounterPlayground() {
  const [count, setCount] = useState(0);
  const [lastAction, setLastAction] = useState('None yet');
  const renderCount = useRef(0);
  renderCount.current += 1;

  const increase = () => {
    setCount((current) => current + 1);
    setLastAction('Increase (+) clicked');
  };

  const decrease = () => {
    setCount((current) => current - 1);
    setLastAction('Decrease (-) clicked');
  };

  const reset = () => {
    setCount(0);
    setLastAction('Reset clicked');
  };

  return (
    <div className="playground-body">
      <FlowSteps steps={['User Action', 'State Changes', 'React Re-renders', 'UI Updates']} />
      <div className="panel">
        <div className="big-value" data-testid="count-value">
          {count}
        </div>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn" onClick={decrease}>
            Decrease (−)
          </button>
          <button type="button" className="btn btn-primary" onClick={increase}>
            Increase (+)
          </button>
          <button type="button" className="btn" onClick={reset}>
            Reset
          </button>
        </div>
        <StatGrid
          items={[
            { label: 'State', value: `count = ${count}`, accent: true },
            { label: 'Render count', value: `#${renderCount.current}` },
            { label: 'Last action', value: lastAction },
          ]}
        />
        <p className="note-box">
          Watch the render count: every state update runs the component again, and the UI shows the new state value.
        </p>
      </div>
    </div>
  );
}

export function StateModule() {
  return (
    <ConceptSection id="useState">
      <Explanation
        what="useState gives a component a piece of memory. Reading it shows the current value; calling the setter asks React to store a new value."
        why="Without state the UI could never change. State updates are what trigger React to re-render and show fresh output."
      />
      <PlaygroundCard
        title="Counter Playground"
        hint="Click the buttons and watch the state value, render count, and last action update together."
      >
        <CounterPlayground />
      </PlaygroundCard>
      <VerificationCard
        questions={[
          {
            prompt: 'The count is 4 and the learner clicks Increase (+). What happens?',
            options: [
              'React stores the new state value, re-renders the component, and the UI shows 5',
              'The browser reloads and then shows 5',
              'Only the button changes — the number updates after a refresh',
              'The component unmounts and the count is lost',
            ],
            correctIndex: 0,
            explanation:
              'A state update schedules a re-render. React runs the component again with the new state, and the returned UI displays the new value.',
          },
        ]}
      />
      <DebugInsight
        items={[
          'What data is changing?',
          'Which component owns this state (who calls useState)?',
          'What caused the update — which event handler ran?',
          'Should the UI re-render — does this state appear in the output?',
        ]}
      />
    </ConceptSection>
  );
}
