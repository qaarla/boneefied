import type { Question } from '../content/model.ts';

/** Typed answers are strings, not choice arrays; never cast them into iterable options. */
export function optionsForQuestion(question: Question): string[] {
  return question.options ?? (Array.isArray(question.answer) ? question.answer : []);
}
