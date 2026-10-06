type DebugInsightProps = {
  items: string[];
};

export function DebugInsight({ items }: DebugInsightProps) {
  return (
    <div className="card">
      <div className="card-title-row">
        <h3>Debugging Insight</h3>
        <span className="badge">Mental model</span>
      </div>
      <p className="card-hint">Ask yourself these questions when something behaves unexpectedly.</p>
      <ul className="debug-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
