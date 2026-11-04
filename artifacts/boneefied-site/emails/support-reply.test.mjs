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

test('app-family artwork fills the email canvas in both orientations and desktop', () => {
  assert.match(html, /html, body \{[^}]*height:100% !important/);
  assert.match(html, /min-height:100vh/);
  assert.match(html, /background-size:cover/);
  assert.match(html, /background-position:center top/);
  assert.match(html, /<body[^>]*background-image:url\('https:\/\/boneefied.com\/site\/assets\/boneefied-dark-anatomical-material.jpg'\)/);
  assert.match(html, /<table[^>]*width="100%" height="100%"[^>]*background-color:transparent/);
  assert.match(html, /<v:background fill="t">/);
  assert.match(html, /valign="top"/);
  assert.doesNotMatch(html, /#fffdf8|#f5f0e6/); // No cream panel hides the pattern.
  assert.match(html, /linear-gradient\(rgba\(17,20,19,0.68\)/);
  assert.match(html, /class="content" style="[^"]*color:#f2eadb/);
  assert.doesNotMatch(html, /class="(?:header|content|footer)"[^>]*background-color/);
});

test('content wrapper cannot mask the body pattern when table backgrounds are stripped', () => {
  const wrapper = html.match(/<table[^>]*height="100%"[^>]*>/)?.[0];
  assert.ok(wrapper);
  assert.match(wrapper, /background-color:transparent/);
  assert.doesNotMatch(wrapper, /background-image:| background="/);
  assert.match(html, /<body[^>]*background-image:linear-gradient/);
});

test('reply text and links use the light-on-dark palette over the pattern', () => {
  const reply = renderReply(input.replyText);
  assert.match(reply.replyHtml, /color:#f2eadb/);
  assert.match(reply.replyHtml, /<a [^>]*color:#e9b95d/);
  assert.doesNotMatch(reply.html, /#8a570b|#25282a/);
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
