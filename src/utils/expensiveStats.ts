export type ExpensiveResult = {
  checksum: number;
  ms: number;
};

export function expensiveStats(size: number): ExpensiveResult {
  const start = performance.now();
  let checksum = 0;
  for (let i = 0; i < size; i++) {
    checksum += Math.sqrt(i) * (i % 7 === 0 ? 1 : 0.5);
  }
  return {
    checksum: Math.round(checksum),
    ms: Math.round((performance.now() - start) * 100) / 100,
  };
}
