import { useContext, useEffect, useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ConceptIdContext } from './ConceptIdContext';

export type QuizQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type VerificationCardProps = {
  questions: QuizQuestion[];
};

export function VerificationCard({ questions }: VerificationCardProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const conceptId = useContext(ConceptIdContext);
  const { markComplete } = useProgress();

  const allCorrect = questions.every(
    (question, index) => answers[index] !== null && answers[index] === question.correctIndex
  );

  useEffect(() => {
    if (conceptId !== null && allCorrect) {
      markComplete(conceptId);
    }
  }, [conceptId, allCorrect, markComplete]);

  const answerQuestion = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const retryQuestion = (questionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = null;
      return next;
    });
  };

  return (
    <div className="card">
      <div className="card-title-row">
        <h3>Concept Verification</h3>
        {allCorrect ? (
          <span className="badge badge-success">Verified</span>
        ) : (
          <span className="badge">Check yourself</span>
        )}
      </div>
      <p className="card-hint">Pick an answer and get immediate feedback.</p>
      <div className="quiz-questions">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const answered = selected !== null;
          const isCorrect = answered && selected === question.correctIndex;

          return (
            <div className="quiz-question" key={question.prompt}>
              <p className="quiz-prompt">
                {questions.length > 1 ? `${questionIndex + 1}. ` : ''}
                {question.prompt}
              </p>
              <div className="quiz-options" role="group" aria-label={question.prompt}>
                {question.options.map((option, optionIndex) => {
                  const isSelected = selected === optionIndex;
                  const marker = String.fromCharCode(65 + optionIndex);
                  let className = 'quiz-option';
                  if (answered && isSelected) {
                    className += isCorrect ? ' selected-correct' : ' selected-wrong';
                  } else if (answered) {
                    className += ' dimmed';
                  }
                  return (
                    <button
                      type="button"
                      className={className}
                      key={option}
                      onClick={() => answerQuestion(questionIndex, optionIndex)}
                      aria-pressed={isSelected}
                    >
                      <span className="option-marker" aria-hidden="true">
                        {marker}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              <div aria-live="polite">
                {answered ? (
                  <div className={isCorrect ? 'quiz-feedback correct' : 'quiz-feedback wrong'}>
                    <span className="feedback-title">{isCorrect ? 'Correct' : 'Not quite'}</span>
                    <span className="feedback-explanation">{question.explanation}</span>
                    {!isCorrect ? (
                      <button type="button" className="btn quiz-retry" onClick={() => retryQuestion(questionIndex)}>
                        Try again
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
