---
name: Atlas zoom source quality
description: Source-export checks alone do not establish sharp rendering in the actual zoom viewer.
---

Trace the actual displayed source and zoom rendering before calling an atlas
sharpness issue repaired. An SVG elsewhere in the repository, or a larger PNG
export, is not proof that the viewer uses vectors or preserves native texture
resolution. Never upscale or sharpen a small raster and call it recovered detail.

**Why:** The user reported visible blur after an earlier export-resolution
repair. The active viewer still transformed a raster rather than rendering the
available master. The user specifically requires demonstrated zoom rendering
and an honest statement of sources that cannot be improved.

**How to apply:** Use authentic registered masters, preserve annotation
coordinates, exercise the actual zoom and pan path, and distinguish browser
evidence and native JavaScript compilation from physical iOS/Android visual
verification. Raster-only originals have finite detail; report specific limits
instead of repeatedly attempting speculative replacements.
