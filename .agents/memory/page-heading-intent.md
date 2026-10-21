---
name: Page heading placement
description: Owner's centered heading treatment and Dynamic Island clearance requirement.
---

Center page headings, section headings, system subtitles, module counts, and lesson heading/subtitle blocks. Remove the small uppercase system-code label above module titles (the owner's example was “CELL”). Keep reading paragraphs, anatomical annotations, and lists in their existing reading alignment.

**Why:** The owner supplied a dark-mode iPhone screenshot of Cells & Tissues with the header too close to the Dynamic Island and requested moving it down, removing the top-left CELL label, and centering headers/subheaders “for everything.”

**How to apply:** Preserve the real window's top safe area across headerless nested navigators, then add a comfortable reading gap. Do not treat a nested navigator's zero local top inset as proof that the device has no notch. Keep the persistent dock and atlas geometry unchanged. Browser screenshots do not establish physical iPhone clearance.

Centering alone does not satisfy the placement requirement: headings and subtitles must have visible breathing room below the Dynamic Island.

**Why:** The owner supplied another framed preview showing Muscular System still overlapped by the island after centering, and specifically asked whether the downloaded app would look cramped too. A desktop browser inside a phone frame can report zero hardware safe-area inset even while the surrounding frame draws an island.

**How to apply:** Verify that framed phone previews reserve notch space separately from the reading gap. Keep simulated preview measurements distinct from real native insets, and never claim physical-device verification from a web screenshot.
