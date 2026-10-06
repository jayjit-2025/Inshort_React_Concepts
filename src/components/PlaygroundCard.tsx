import type { ReactNode } from 'react';

type PlaygroundCardProps = {
  title: string;
  hint?: string;
  children: ReactNode;
};

export function PlaygroundCard({ title, hint, children }: PlaygroundCardProps) {
  return (
    <div className="card">
      <div className="card-title-row">
        <h3>{title}</h3>
        <span className="badge badge-accent">Interactive</span>
      </div>
      {hint ? <p className="card-hint">{hint}</p> : null}
      <div className="playground-body">{children}</div>
    </div>
  );
}
