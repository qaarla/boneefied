# BVIS04 — nervous system, senses, skin and core tissue schematics

Completed within the four-module visual scope. No release build, deployment,
publication, or unrelated content expansion was performed. Earlier visual-pack
work was preserved.

## Counts from the assembled catalog

| Module | Original plates | Annotation targets | Added questions | Module questions | Retained real specimens |
| --- | ---: | ---: | ---: | ---: | ---: |
| Nervous System | 12 | 90 | 68 | 120 | 1 |
| Special Senses | 9 | 73 | 36 | 71 | 0 |
| Integumentary System | 6 | 55 | 22 | 43 | 0 |
| Cells & Tissues | 8 | 29 | 23 | 54 | 3 |
| **Total** | **35** | **247** | **149** | **288** | **4** |

The pack has 28 new asset IDs and 7 same-ID replacements. The whole application
now has 125 catalog assets and 1,053 questions. All 1,126 canonical structures
and all 904 previous question identities, prompts, answers, options and aliases
were checked against the pre-command snapshot and preserved. Existing drawing
questions now point to truthful original-art sources; real specimen questions
retain their original image endpoints.

All 35 plates have a lesson endpoint and useful practice. The eight core tissue
plates are explicitly **teaching schematics**, not photomicrographs. New
questions include location, tissue/cell identification, and 14 functional
relationships. Both English and Spanish use the same canonical scoring IDs.

## Artwork and provenance

- Original editable SVG masters and bundled 1450 × 1000 PNGs:
  `assets/images/anatomy/bvis04-atlas/`.
- Per-plate creator, original-art notice, reference URLs, orientation,
  feature/anchor mapping, and SVG/PNG SHA-256:
  `assets/images/anatomy/bvis04-atlas/provenance.json`.
- Reproducible generator and checked-in canonical-ID contract:
  `scripts/atlas/bvis04-generate.mjs` and
  `scripts/atlas/bvis04-anatomy-contract.json`.
- No copied/traced modern illustrations, baked-in text labels, gradients,
  raster embeds, fake photomicrographs, or external rights claims on originals.

All twelve cranial nerves, four taught plexuses, and the principal taught
peripheral nerves are represented. The nail section includes nail plate, bed,
root and matrix. Final review corrected olfactory fila versus bulb/tract,
connected semicircular ducts, stapes crura/footplate, epithelial layer continuity,
and muscle/neural tissue contours.

## Genuine specimens retained unchanged

| Specimen | Creator | Exact-file license |
| --- | --- | --- |
| Simple squamous epithelium | Berkshire Community College Bioscience Image Library | CC0 1.0 |
| Simple cuboidal epithelium | Berkshire Community College Bioscience Image Library | CC0 1.0 |
| Simple columnar epithelium | Berkshire Community College Bioscience Image Library | CC0 1.0 |
| Spinal-cord cross-section | OpenStax College | CC BY 4.0 on the historical exact file |

The exact Commons file pages, license evidence, source/rights URLs, creators,
local byte sizes, SHA-256, actual dimensions, existing adaptations and
stain/magnification limits are recorded in `BVIS04_SPECIMEN_LICENSES.json`.
Current generic textbook licensing was not used as image-reuse evidence.
The app separates these real specimens from the new schematic diagrams.

## Verification and limits

- TypeScript check passed; **109 tests passed, zero failed**.
- Tests verify complete EN/ES catalog coverage, preserved content, local
  resolution, PNG dimensions, provenance hashes, unchanged specimen bytes,
  canonical annotation IDs, true distractors, and English/Spanish scoring.
- Numbered-control layout tests cover 273/343-pixel canvas widths and
  44/60-pixel controls, checking disjoint bounds inside the frame.
- One focused browser pass used the Expo **web** preview at 390 × 844 with
  Large text: all four modules rendered; lesson expansion and Recall worked;
  real microscopy remained separate; representative English/Spanish content
  showed no definite clipping or horizontal overflow.
- Spanish practice: wrong and correct dorsal-root selections graded correctly;
  a neutral tissue marker did not fill the answer and “Epitelio plano simple”
  graded correctly; the function marker did not choose an option and
  “Nervio frénico” graded correctly; “Médula espinal” graded correctly on the
  real specimen and persisted into Results.
- Browser-discovered duplicate React keys on legitimate multi-panel
  annotations were fixed using coordinate-specific identities. Post-grade
  legend numbering now matches the specific target. Wrong-answer feedback
  resolves canonical IDs to localized names rather than exposing raw IDs.
  These fixes have regression tests; a second broad browser pass was not run.
- Generator validation ended with zero problems and five placement warnings.
  These are disclosed diagnostics, not a claim of clinical certification.
- **Native iPhone/Android offline operation was not physically tested.**
  Phone-width web screenshots and local bundling do not prove native offline
  rendering or native text scaling.

Machine-readable counts and preservation evidence: `BVIS04_REPORT.json`.
