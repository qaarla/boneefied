---
name: EAS build log retrieval
description: Recover finished build logs when the connected logs action times out.
---

If the connected EAS logs action times out, retrieve the finished build's
`logFiles` URLs from its build information and download those files directly
into an ignored generated-artifacts directory.

**Why:** The logs action can time out even after a successful build. Its failure
does not mean the build failed or that logs are unavailable; direct downloads
of the returned log files worked.

**How to apply:** Wait for the outstanding logs job rather than launching a
duplicate. If it returns a timeout, use the existing build information's log
files. Do not print or persist signed log URLs in memory. Preserve downloaded
logs and a filename/byte-count index; never resubmit a build just to get logs.
