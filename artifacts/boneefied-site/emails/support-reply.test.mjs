import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, renderReply, prepareSupportReply, templateDefinition } from './support-reply.mjs';

const input = {
  to: 'customer@example.com',
  originalSubject: 'Question about study progress',
  originalMessageId: '<incoming@example.com>',
  replyText: 'Hello,\n\nThank you for getting in touch. Your code is AB-123.\nhttps://boneefied.com/site/?a=1&b=2',
};

test('real template is support-only with explicit sender and required content', () => {
  assert.equal(templateDefinition.alias, 'boneefied-help-reply');
  assert.equal(templateDefinition.from, 'Boneefied Support <help@boneefied.com>');
  assert.deepEqual(templateDefinition.reply_to, ['help@boneefied.com']);
  assert.ok(templateDefinition.variables.every(variable => !('fallback_value' in variable)));
  assert.match(html, /max-width:600px/);
  assert.match(html, /max-width: 620px/);
  assert.match(html, /Tinos,Georgia/);
  assert.match(html, /https:\/\/boneefied.com\/site\/apple-touch-icon.png/);
});

test('plain text, codes, links and multiline replies survive rendering', () => {
  const rendered = renderReply(input.replyText);
  assert.ok(rendered.text.startsWith(input.replyText));
  assert.match(rendered.html, /AB-123/);
  assert.match(rendered.html, /href="https:\/\/boneefied.com\/site\/\?a=1&amp;b=2"/);
  assert.ok(!rendered.html.includes('{{{'));
});

test('text cannot inject HTML; literal variable-looking text is retained', () => {
  const rendered = renderReply('<script>alert("no")</script>\n{{{REPLY_TEXT}}} $&');
  assert.match(rendered.html, /&lt;script&gt;/);
  assert.ok(!rendered.html.includes('<script>'));
  assert.ok(rendered.html.includes('{{{REPLY_TEXT}}} $&amp;'));
});

test('reply headers, recipient and original subject are preserved', () => {
  const result = prepareSupportReply({ ...input, references: ['<earlier@example.com>'] });
  assert.equal(result.subject, 'Re: Question about study progress');
  assert.equal(result.headers['In-Reply-To'], input.originalMessageId);
  assert.equal(result.headers.References, '<earlier@example.com> <incoming@example.com>');
  assert.deepEqual(result.to, [input.to]);
  assert.equal(result.template.variables.REPLY_TEXT, input.replyText);
  assert.equal(prepareSupportReply({ ...input, originalSubject: 'Re: Already a reply' }).subject, 'Re: Already a reply');
});

test('blank replies and injected addresses or headers fail before sending', () => {
  assert.throws(() => renderReply(' '), /non-empty/);
  assert.throws(() => prepareSupportReply({ ...input, to: 'x@example.com\nBcc: y@example.com' }), /single line/);
  assert.throws(() => prepareSupportReply({ ...input, originalSubject: 'Hello\r\nBcc: x@example.com' }), /single line/);
  assert.throws(() => prepareSupportReply({ ...input, originalMessageId: 'resend-email-uuid' }), /RFC Message-ID/);
});

test('long replies are never silently truncated', () => {
  const replyText = 'A'.repeat(2300);
  assert.throws(() => prepareSupportReply({ ...input, replyText }), /inline/);
  const result = prepareSupportReply({ ...input, replyText, mode: 'inline' });
  assert.ok(result.text.startsWith(replyText));
  assert.ok(result.html.includes(replyText));
  assert.equal(result.template, undefined);
});
