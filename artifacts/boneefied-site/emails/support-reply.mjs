import { readFileSync } from 'node:fs';

export const alias = 'boneefied-help-reply';
export const from = 'Boneefied Support <help@boneefied.com>';
export const html = readFileSync(new URL('./support-reply.html', import.meta.url), 'utf8');
export const text = '{{{REPLY_TEXT}}}\n\nBoneefied Support\nhelp@boneefied.com\n\nReply to this email to continue the conversation.\nhttps://boneefied.com/site/';

// This module prepares content only. It has no network or email-send operation.
export const templateDefinition = {
  name: 'Boneefied — help support reply',
  alias,
  from,
  subject: '{{{REPLY_SUBJECT}}}',
  reply_to: ['help@boneefied.com'],
  html,
  text,
  variables: ['REPLY_SUBJECT', 'REPLY_HTML', 'REPLY_TEXT'].map(key => ({ key, type: 'string' })),
};

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function renderLine(line) {
  let offset = 0;
  let rendered = '';
  for (const match of line.matchAll(/https?:\/\/[^\s<>"']+/g)) {
    rendered += escapeHtml(line.slice(offset, match.index));
    // Keep sentence punctuation visible without making it part of the link.
    const url = match[0].replace(/[.,;!?]+$/, '');
    rendered += `<a href="${escapeHtml(url)}" style="color:#e9b95d;text-decoration:underline;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(url)}</a>`;
    rendered += escapeHtml(match[0].slice(url.length));
    offset = match.index + match[0].length;
  }
  return rendered + escapeHtml(line.slice(offset));
}

export function renderReply(replyText) {
  if (typeof replyText !== 'string' || !replyText.trim()) throw new Error('A non-empty support reply is required.');
  // Preserve the original plain text; normalize line endings only in HTML.
  const replyHtml = replyText.replace(/\r\n?/g, '\n').split(/\n\n+/)
    .map(paragraph => `<p style="margin:0 0 14px;color:#f2eadb;font-size:17px;line-height:26px;">${paragraph.split('\n').map(renderLine).join('<br>')}</p>`)
    .join('\n');
  return {
    html: html.replace('{{{REPLY_HTML}}}', () => replyHtml),
    text: text.replace('{{{REPLY_TEXT}}}', () => replyText),
    replyHtml,
  };
}

function singleLine(value, name) {
  if (typeof value !== 'string' || /[\r\n]/.test(value)) throw new Error(`${name} must be a single line.`);
  return value;
}

function messageId(value) {
  singleLine(value, 'Message-ID');
  if (!/^<[^<>\s]+>$/.test(value)) throw new Error('Use the original RFC Message-ID, including angle brackets, not the Resend email UUID.');
  return value;
}

export function prepareSupportReply({ to, originalSubject, originalMessageId, references = [], replyText, mode = 'template' }) {
  singleLine(to, 'Recipient');
  if (!/^[^\s<>@,;]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(to)) throw new Error('One valid recipient address is required.');
  singleLine(originalSubject, 'Original subject');
  const subject = /^re:/i.test(originalSubject) ? originalSubject : `Re: ${originalSubject || '(no subject)'}`;
  const parent = messageId(originalMessageId);
  if (!Array.isArray(references)) throw new Error('References must be an array of original RFC Message-IDs.');
  const referenceHeader = [...new Set([...references.map(messageId), parent])].join(' ');
  if (referenceHeader.length > 900) throw new Error('Thread references exceed the safe header length; review the original headers instead of truncating.');
  const rendered = renderReply(replyText);
  const payload = {
    from,
    to: [to],
    reply_to: ['help@boneefied.com'],
    subject,
    headers: { 'In-Reply-To': parent, References: referenceHeader },
  };
  if (mode === 'inline') return { ...payload, html: rendered.html, text: rendered.text };
  if (mode !== 'template') throw new Error('Mode must be template or inline.');
  const variables = { REPLY_SUBJECT: subject, REPLY_HTML: rendered.replyHtml, REPLY_TEXT: replyText };
  for (const [key, value] of Object.entries(variables)) {
    if (value.length > 2000) throw new Error(`${key} exceeds the Resend template variable limit. Use explicit mode: "inline" to keep the full reply with the same branding.`);
  }
  return { ...payload, template: { id: alias, variables } };
}
