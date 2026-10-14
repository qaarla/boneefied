import assert from 'node:assert/strict';
import test from 'node:test';
import { wholeWordFontFactor } from '../context/wholeWordFit.ts';

test('ordinary typography and sufficiently wide words stay unchanged', () => {
  assert.equal(wholeWordFontFactor('Female Reproductive System', 348, 29, true), 1);
  assert.equal(wholeWordFontFactor('Muscular System', 288, 29, true), 1);
  assert.equal(wholeWordFontFactor('Progress', 288, 32, true), 1);
  assert.equal(wholeWordFontFactor('', 200, 40, true), 1);
  assert.equal(wholeWordFontFactor('Reproductive', 0, 45, true), 1);
});

test('enlarged long words fit the measured region without rewriting or a global font cap', () => {
  for (const [text, width, size] of [['Female Reproductive System',200,45],['Integumentary System',288,72.5],['Cardiovascular',254,42.5],['Sternocleidomastoid',238,30],['Acetabulum',288,70],['Identify the anatomical structure at target 1.',288,67.5],['Progress',288,80]] as const) {
    const factor = wholeWordFontFactor(text,width,size,true);
    assert.ok(factor > 0 && factor < 1, text);
    assert.equal(wholeWordFontFactor(text,width,size*factor,true),1,text);
  }
});

test('Spanish accents retain base-letter metrics and punctuation permits normal word boundaries', () => {
  assert.equal(wholeWordFontFactor('Cardiovascular',200,55,true),wholeWordFontFactor('Cárdiovásculár',200,55,true));
  assert.equal(wholeWordFontFactor('Cytology / Mitosis',288,40,true),1);
  const compound = wholeWordFontFactor('vestibular/tympanic',232,35,false);
  assert.ok(compound < 1);
  assert.equal(wholeWordFontFactor('vestibular/tympanic',232,35*compound,false),1);
  const parenthesized = wholeWordFontFactor('(semimembranosus, soleus)',232,35,false);
  assert.ok(parenthesized < wholeWordFontFactor('semimembranosus',232,35,false));
  assert.equal(wholeWordFontFactor('(semimembranosus, soleus)',232,35*parenthesized,false),1);
});
