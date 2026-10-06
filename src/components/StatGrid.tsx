type StatItem = {
  label: string;
  value: string;
  accent?: boolean;
};

type StatGridProps = {
  items: StatItem[];
};

export function StatGrid({ items }: StatGridProps) {
  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div className={item.accent ? 'stat stat-accent' : 'stat'} key={item.label}>
          <span className="stat-label">{item.label}</span>
          <span className="stat-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
