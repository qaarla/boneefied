---
name: Resend template updates
description: Prevent HTML-only template changes from overwriting explicit plain-text alternatives.
---

Always include the intended explicit plain-text alternative when PATCHing
Resend template HTML, then read back both fields after publishing the template.

**Why:** An HTML-only PATCH successfully preserved sender settings but
regenerated the text alternative from HTML. That replaced the dedicated
plain-text reply placeholder with the HTML reply placeholder and duplicated
some link text. Sending both HTML and text preserved the intended alternative.

**How to apply:** Treat template body updates as paired HTML/text updates.
Verify the published text, HTML, sender, reply address, subject and required
variables. Template publishing makes the template usable; it does not send an
email or authorize application deployment.
