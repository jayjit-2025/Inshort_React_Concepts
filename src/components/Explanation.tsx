type ExplanationProps = {
  what: string;
  why: string;
};

export function Explanation({ what, why }: ExplanationProps) {
  return (
    <div className="explanation">
      <p>
        <strong>What it is:</strong> {what}
      </p>
      <p>
        <strong>Why it matters:</strong> {why}
      </p>
    </div>
  );
}
