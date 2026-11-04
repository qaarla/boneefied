# Boneefied support replies

This is a manual-reply design for **help@boneefied.com**, not an autoresponder,
marketing automation, account-email system, or new support application.

## Real Resend template

- Name: **Boneefied — help support reply**
- Alias: `boneefied-help-reply`
- Resend template ID: `ddb36c1c-d2fc-4b88-aef2-0acf7857f646`
- Created, enabled for use, and read back from Resend on 2026-11-03
  (America/Los_Angeles); saved HTML and plain text matched the local sources.
- From: `Boneefied Support <help@boneefied.com>`
- Reply-To: `help@boneefied.com`
- Required variables: `REPLY_SUBJECT`, `REPLY_HTML`, `REPLY_TEXT`
- The existing approved logo is served from the already-published site, using
  its small 180px PNG rather than the 1MB original. No website publish is needed.
- Tinos is used where clients support the web font; Georgia/Times are fallbacks.
- The full email canvas uses the existing hosted dark anatomical-fiber artwork
  shared with the app's material family. It covers desktop, mobile portrait,
  and mobile landscape layouts. The reference's pattern-behind-text treatment
  is used: no cream card or opaque header/footer hides the artwork. Warm light
  text and gold links sit over a darkened pattern for readability.
  The email body owns the background; its full-height content table remains
  transparent so a stripped table background cannot mask the pattern.
  A plain URL declaration and Outlook VML provide image fallbacks, with
  charcoal when remote images are blocked. Email clients control their own
  surrounding interface and may ignore viewport-height CSS; this cannot paint
  outside the email's message area or guarantee full-screen client rendering.

The template must be published **inside Resend** to be usable. Publishing a
Resend template does not send an email or publish the website/mobile app.
When updating HTML through Resend, include the explicit plain-text source in
the same PATCH: an HTML-only update regenerates text from HTML and replaces
the intended `REPLY_TEXT` alternative. Read back both fields after enabling.

## Sending a manual reply later

Received messages can be inspected in Resend's **Emails → Receiving** page.
Resend's receiving dashboard is not a complete conventional email client;
creating this template does not automatically add a Reply button or forward
incoming messages to a personal inbox.

When the owner explicitly asks for a particular reply to be sent, retrieve the
original received message and prepare the approved reply with
`prepareSupportReply` from `support-reply.mjs`. Supply the customer's address,
original subject, original RFC `Message-ID`, prior `References` if available,
and the owner's reply text. Use the RFC message identifier, not Resend's UUID.
Respect the original Reply-To address when one is present.

The helper creates an API payload only; it never sends anything. It preserves
the support sender, reply address, subject, original message reference and
plain-text content. It escapes user-provided HTML and links HTTPS/HTTP URLs.
Missing reply content and header-injection attempts fail explicitly.

For long replies beyond Resend's template-variable limit, explicitly select
`mode: 'inline'`: the same branded HTML and complete plain text are returned.
No text is silently shortened. The selected payload can then be sent through
the existing authorized Resend integration, with a unique idempotency key,
**only after the owner authorizes that specific send**.

## Inbox sender logo is separate

The body logo does not configure the inbox avatar. Existing SPF/DKIM and
DMARC enforcement must be preserved. Default BIMI is not configured.
Configuring BIMI requires DNS-management access, a compliant logo hosted over
HTTPS, and recipient-specific verification; Gmail requires a VMC or CMC.
No certificates or paid services are purchased by this setup.

## Checks

Run `node --test artifacts/boneefied-site/emails/support-reply.test.mjs`.
Browser previews establish phone/desktop layout only, not Gmail/Outlook
rendering, actual delivery, inbox-logo display, or received-message threading.
