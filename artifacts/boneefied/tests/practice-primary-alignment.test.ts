import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const screen = readFileSync(new URL('../app/(tabs)/practice.tsx', import.meta.url), 'utf8');

test('typed recall and image identification have distinct bilingual accessible names while graded feedback stays unchanged', () => {
  const input = screen.match(/<TextInput testID="typed-answer"[\s\S]*?returnKeyType="done" \/>/)?.[0];
  assert.ok(input);
  assert.match(input, /locale\.t\(question\.taskType === 'typed-recall' \? 'practice\.typedRecallAnswer' : 'practice\.imageIdentificationAnswer'\)/);
  assert.match(input, /disabled \? locale\.t\(scoreAnswer\(value\) \? 'practice\.correctTypedAnswer' : 'practice\.incorrectTypedAnswer'\)/);
  const messages = readFileSync(new URL('../locales/es/ui-practice-progress.ts', import.meta.url), 'utf8');
  assert.match(messages, /'practice\.typedRecallAnswer': \{ en: 'Typed recall answer', es: 'Respuesta escrita de memoria' \}/);
  assert.match(messages, /'practice\.imageIdentificationAnswer': \{ en: 'Image identification answer', es: 'Respuesta de identificación por imagen' \}/);
});

test('Start, Resume, and Retry share centered, inset primary styling at every text size', () => {
  const buttons = [...screen.matchAll(/<AdaptiveButton\b[\s\S]*?<\/AdaptiveButton>/g)].map((match) => match[0]);
  for (const label of ['practice.start', 'practice.resumeSavedSession', 'practice.retryModule']) {
    const button = buttons.find((markup) => markup.includes(`locale.t('${label}')`));
    assert.ok(button, `${label}: primary button must exist`);
    assert.match(button, /style=\{\[styles\.primaryContent, \{ backgroundColor: colors\.primary \}\]\}/);
    assert.match(button, /styles\.reflowRetryText/);
    assert.doesNotMatch(button, /shouldReflow/);
    assert.match(button, /color: colors\.primaryForeground, fontWeight: '700'/);
  }
  const compact = screen.replace(/\s/g, '');
  assert.match(compact, /primaryContent:\{minHeight:48,borderRadius:12,alignItems:'center',justifyContent:'center',paddingHorizontal:16\}/);
  assert.match(compact, /reflowRetryText:\{paddingVertical:12,textAlign:'center',flexShrink:1\}/);
});

test('setup and focused practice share card, heading, and CTA dimensions', () => {
  const setup = screen.slice(screen.indexOf("if (phase === 'setup')"), screen.indexOf("if (phase === 'results')"));
  assert.equal([...setup.matchAll(/<AdaptiveCard style=\{\[styles\.panel,/g)].length, 2);
  assert.equal([...setup.matchAll(/<Heading style=\{\[styles\.panelTitle,/g)].length, 2);
  const focused = setup.match(/<AdaptiveButton testID="start-focused-practice"[\s\S]*?<\/AdaptiveButton>/)?.[0];
  assert.ok(focused);
  assert.match(focused, /styles\.primaryContent/);
  assert.match(focused, /borderWidth: 1, borderColor: colors\.primary/);
  assert.match(focused, /styles\.reflowRetryText/);
  assert.match(focused, /color: colors\.primary, fontWeight: '700'/);
  assert.match(focused, /onPress=\{startFocused\} disabled=\{!underpracticed\.length\}/);
  assert.match(setup, /\[3, 5, pool\.length\]/);
  assert.match(setup, /borderColor: count === Math\.min\(n, pool\.length\) \? colors\.primary : colors\.border/);
});

test('eligibility copy describes available questions without developer wording', () => {
  const messages = readFileSync(new URL('../locales/es/ui-practice-progress.ts', import.meta.url), 'utf8');
  assert.match(messages, /'practice\.eligibleQuestions': \{ en: 'Questions available: \{count\}\.', es: 'Preguntas disponibles: \{count\}\.' \}/);
  assert.doesNotMatch(messages, /No duplicate padding/);
});
