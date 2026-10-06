import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { wordParts, searchWordParts, wordPartCopy } from '../content/word-parts.ts';
import { content } from '../content/canonical.ts';
import { createAnatomySearchIndex, searchAnatomy } from '../content/search.ts';

test('word-part catalog has unique IDs, bilingual meanings, examples, and all three categories', () => {
  assert.ok(wordParts.length >= 180);
  assert.equal(new Set(wordParts.map((part) => part.id)).size, wordParts.length);
  assert.deepEqual(new Set(wordParts.map((part) => part.kind)), new Set(['prefix', 'root', 'suffix']));
  for (const part of wordParts) {
    for (const language of ['en', 'es'] as const) {
      const copy = wordPartCopy(part, language);
      assert.ok(copy.meaning.length > 2, part.id);
      assert.ok(copy.example.length > 15, part.id);
      assert.ok(copy.kind, part.id);
    }
    assert.ok(searchWordParts(part.form, 'en', wordParts.length).some((match) => match.id === part.id), part.form);
    for (const alias of part.aliases) {
      assert.ok(searchWordParts(alias, 'en', wordParts.length).some((match) => match.id === part.id), alias);
    }
  }
});

test('prefixes, roots and suffixes work with punctuation, plain forms, case, and aliases', () => {
  for (const [query, form] of [
    ['peri-', 'peri-'], ['PERI', 'peri-'], ['cardi/o', 'cardi/o'], ['cardio', 'cardi/o'],
    ['cardi', 'cardi/o'], ['-itis', '-itis'], ['itis', '-itis'], ['-ar', '-ar'],
    ['acetabul/o', 'acetabul/o'], ['an-', 'a-'], ['hem/o', 'hemat/o'], ['-ology', '-logy'],
  ]) {
    assert.equal(searchWordParts(query)[0]?.form, form, query);
  }
  assert.ok(searchWordParts('-al').every((part) => part.kind === 'suffix'));
  assert.ok(searchWordParts('peri-').every((part) => part.kind !== 'suffix'));
});

test('meaning search works in both languages and unknown parts produce no invented definition', () => {
  assert.ok(searchWordParts('kidney').some((part) => part.form === 'nephr/o'));
  assert.ok(searchWordParts('riñón', 'es').some((part) => part.form === 'nephr/o'));
  assert.ok(searchWordParts('inflammation').some((part) => part.form === '-itis'));
  assert.ok(searchWordParts('inflamación', 'es').some((part) => part.form === '-itis'));
  assert.deepEqual(searchWordParts('qzxqzxqzx'), []);
  assert.deepEqual(searchWordParts(''), []);
  assert.deepEqual(searchWordParts('cardi/o', 'en', 0), []);
  assert.equal(searchWordParts('a', 'en', 3).length <= 3, true);
});

test('confusable roots have separate meanings and context caveats', () => {
  assert.equal(searchWordParts('ile/o')[0]?.form, 'ile/o');
  assert.equal(searchWordParts('ili/o')[0]?.form, 'ili/o');
  assert.match(searchWordParts('myel/o')[0]!.meaning, /Spinal cord or bone marrow/);
  assert.match(searchWordParts('-oma')[0]!.meaning, /not automatically cancer/);
  assert.match(searchWordParts('-itis')[0]!.meaning, /does not by itself specify the cause/);
});

test('word parts do not fabricate structure matches or alter practice answers', () => {
  const index = createAnatomySearchIndex(content);
  assert.ok(!searchAnatomy(index, 'peri-').some((match) => match.term?.en === 'peri'));
  assert.ok(!content.structures.find((structure) => structure.id === 'acetabulum')!.acceptedAliases.includes('acetabul/o'));
  const implementation = readFileSync(new URL('../content/word-parts.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(implementation, /\b(?:fetch|axios|XMLHttpRequest)\s*\(/);
});
