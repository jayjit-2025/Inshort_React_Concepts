type FlowStepsProps = {
  steps: string[];
};

export function FlowSteps({ steps }: FlowStepsProps) {
  return (
    <ol className="flow-steps" aria-label="React flow">
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  );
}
