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

Do not infer visual equivalence from Resend's published badge or matching
stored HTML alone.

**Why:** The owner identified a mismatch between the approved browser sample
and the Resend template thumbnail after the template had been called ready.
They objected to being asked for samples the agent had already created.

**How to apply:** Separate browser-layout verification, saved-template
verification, dashboard-preview rendering, and delivered-email rendering.
Use existing workspace samples and the saved Resend HTML first; do not ask the
owner to resubmit samples already available. If the authenticated dashboard
preview remains unavailable, state that verification boundary rather than
dismissing the difference as a thumbnail issue or claiming it is resolved.
