import type { Question } from './model';

/** Scoring keeps canonical IDs; visible hotspot feedback uses localized names. */
export function formatAnswerForDisplay(
  question: Pick<Question, 'taskType'>,
  localizedAnswer: string | readonly string[],
  structureName: (id: string) => string,
): string {
  const display = (value: string) => question.taskType === 'hotspot' || question.taskType === 'ordered-sequence' ? structureName(value) : value;
  return typeof localizedAnswer === 'string'
    ? display(localizedAnswer)
    : localizedAnswer.map(display).join(question.taskType === 'ordered-sequence' ? ' → ' : ' · ');
}
