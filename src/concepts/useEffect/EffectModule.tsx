import { useEffect, useRef, useState } from 'react';
import { ConceptSection } from '../../components/ConceptSection';
import { DebugInsight } from '../../components/DebugInsight';
import { Explanation } from '../../components/Explanation';
import { FlowSteps } from '../../components/FlowSteps';
import { PlaygroundCard } from '../../components/PlaygroundCard';
import { StatGrid } from '../../components/StatGrid';
import { VerificationCard } from '../../components/VerificationCard';

const BAD_EXAMPLE_CAP = 8;

function EffectPlayground() {
  const [now, setNow] = useState(() => new Date());
  const [clockEnabled, setClockEnabled] = useState(true);
  const [mode, setMode] = useState<'once' | 'value'>('value');
  const [dependencyValue, setDependencyValue] = useState(1);
  const [effectRuns, setEffectRuns] = useState(0);
  const [cleanupRuns, setCleanupRuns] = useState(0);
  const [unrelated, setUnrelated] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [simulateBad, setSimulateBad] = useState(false);
  const [badRuns, setBadRuns] = useState(0);
  const runIdRef = useRef(0);
  const renderCount = useRef(0);
  renderCount.current += 1;

  const pushLog = (message: string) => {
    setLog((prev) => [...prev.slice(-11), message]);
  };

  useEffect(() => {
    if (!clockEnabled) {
      return;
    }
    pushLog('clock effect — interval started (every 1s)');
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      window.clearInterval(intervalId);
      pushLog('clock cleanup — interval cleared');
    };
  }, [clockEnabled]);

  useEffect(() => {
    runIdRef.current += 1;
    const runId = runIdRef.current;
    const detail = mode === 'value' ? `value = ${dependencyValue}` : 'no dependencies';
    setEffectRuns((count) => count + 1);
    pushLog(`effect run #${runId} (${detail})`);
    return () => {
      setCleanupRuns((count) => count + 1);
      pushLog(`cleanup after run #${runId}`);
    };
  }, mode === 'once' ? [mode] : [mode, dependencyValue]);

  useEffect(() => {
    if (!simulateBad || badRuns >= BAD_EXAMPLE_CAP) {
      return;
    }
    const timerId = window.setTimeout(() => {
      setBadRuns((count) => count + 1);
    }, 450);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [simulateBad, badRuns]);

  const depsText = mode === 'once' ? '[]' : '[dependencyValue]';

  return (
    <div className="playground-body">
      <FlowSteps steps={['Render', 'Effect Runs', 'External Work', 'Cleanup', 'Re-run on Dependency Change']} />
      <StatGrid
        items={[
          { label: 'Current time', value: now.toLocaleTimeString(), accent: true },
          { label: 'Render count', value: `#${renderCount.current}` },
          { label: 'Sensor effect runs', value: `${effectRuns}` },
          { label: 'Cleanup runs', value: `${cleanupRuns}` },
          { label: 'Clock interval', value: clockEnabled ? 'Running' : 'Stopped' },
          { label: 'Dependencies', value: depsText },
        ]}
      />

      <div className="panel-grid">
        <div className="panel">
          <h4>Live clock (external side effect)</h4>
          <label className="check-row" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={clockEnabled}
              onChange={(event) => setClockEnabled(event.target.checked)}
            />
            <span>Interval running — keeps the time ticking</span>
          </label>
          <p className="note-box">
            The effect creates a browser interval. When the checkbox changes, cleanup clears the old interval before
            the effect runs again — no duplicate timers.
          </p>
        </div>

        <div className="panel">
          <h4>Dependency experiment</h4>
          <div className="segmented" role="group" aria-label="Effect dependency mode">
            <button
              type="button"
              aria-pressed={mode === 'once'}
              onClick={() => setMode('once')}
            >
              Run once (mount)
            </button>
            <button
              type="button"
              aria-pressed={mode === 'value'}
              onClick={() => setMode('value')}
            >
              Run on value change
            </button>
          </div>
          <div className="btn-row">
            <button
              type="button"
              className="btn"
              disabled={mode !== 'value'}
              onClick={() => setDependencyValue((value) => value + 1)}
            >
              Change dependency value ({dependencyValue})
            </button>
            <button type="button" className="btn" onClick={() => setUnrelated((value) => value + 1)}>
              Re-render only ({unrelated})
            </button>
          </div>
          <p className="note-box">
            “Change dependency value” re-runs the effect (cleanup first). “Re-render only” re-renders the component
            but the effect stays put — dependencies did not change. Switching modes restarts the effect with its new
            configuration.
          </p>
        </div>
      </div>

      <div className="panel">
        <h4>Effect activity log (latest first)</h4>
        <ul className="log-list">
          {[...log].reverse().map((entry, index) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
          {log.length === 0 ? <li>No activity yet</li> : null}
        </ul>
      </div>

      <div className="panel">
        <h4>Safe bad example — effect that re-triggers itself</h4>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => setSimulateBad((value) => !value)}>
            {simulateBad ? 'Stop simulation' : 'Run simulation'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setSimulateBad(false);
              setBadRuns(0);
            }}
          >
            Reset
          </button>
        </div>
        <StatGrid items={[{ label: 'Simulated runs (capped at 8)', value: `${badRuns}`, accent: true }]} />
        {badRuns >= BAD_EXAMPLE_CAP ? (
          <div className="warning-box">
            <span className="warning-title">Problem detected — simulation capped at {BAD_EXAMPLE_CAP} runs</span>
            <span className="warning-body">
              This effect updates state that it depends on, so each run schedules the next one. In a real application
              this pattern creates repeated timers, duplicate API calls, stacked subscriptions, and memory leaks.
              React effects should only re-run when their dependencies genuinely change, and every external resource
              needs cleanup.
            </span>
          </div>
        ) : (
          <p className="note-box">
            The simulation is capped: it stops after {BAD_EXAMPLE_CAP} runs so your browser stays responsive. A real
            app would keep looping until something breaks.
          </p>
        )}
      </div>
    </div>
  );
}

export function EffectModule() {
  return (
    <ConceptSection id="useEffect">
      <Explanation
        what="useEffect runs code after a component renders. The dependency array decides when it re-runs, and the returned cleanup function runs before the next execution and on unmount."
        why="Rendering must stay pure. Anything touching the outside world belongs in an effect — with cleanup, or resources pile up."
      />
      <PlaygroundCard
        title="Live Clock / Effect Playground"
        hint="Experiment with dependencies, watch cleanup run, and try the capped bad example."
      >
        <EffectPlayground />
      </PlaygroundCard>
      <VerificationCard
        questions={[
          {
            prompt: 'The mode is “Run on value change” and the dependency value changes from 1 to 2. What happens?',
            options: [
              'Cleanup runs first, then the effect runs again with the new value',
              'Nothing — effects only run once on mount',
              'The component unmounts and the clock stops',
              'The effect runs again but cleanup never happens',
            ],
            correctIndex: 0,
            explanation:
              'React compares dependencies between renders. When they differ it runs the cleanup from the previous run, then executes the effect again.',
          },
          {
            prompt: 'You press “Re-render only” so unrelated state changes. Does the sensor effect run again?',
            options: [
              'Yes — every re-render runs every effect',
              'No — its dependencies did not change',
              'Yes, but only the cleanup function runs',
              'No — effects never re-run after mount',
            ],
            correctIndex: 1,
            explanation:
              'Effects re-run only when a value in the dependency array changes. An unrelated state update re-renders the component but leaves the effect untouched.',
          },
        ]}
      />
      <DebugInsight
        items={[
          'Why is this effect running right now?',
          'What are its dependencies — did any of them change?',
          'Can a state change inside the effect trigger it again?',
          'Does the external work (timer, subscription, request) need cleanup?',
        ]}
      />
    </ConceptSection>
  );
}
