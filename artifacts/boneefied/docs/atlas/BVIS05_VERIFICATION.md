# BVIS05 verification

## Exact additions

| Existing module | Original SVG/PNG plates | New questions |
| --- | ---: | ---: |
| Cardiovascular, including blood | 11 | 81 |
| Blood vessels | 11 | 56 |
| Respiratory | 7 | 71 |
| Lymphatic | 6 | 53 |
| Endocrine | 6 | 44 |
| Total | 41 | 305 |

There are 378 annotation targets over all 264 existing structures in these five modules. The new questions comprise 264 canonical-ID location questions with genuine distractor targets and 41 neutral single-marker identification questions. Artwork is integrated into existing lessons, galleries, Learn/Recall, zoom and English/Spanish question copy.

The assembled-catalog audit preserves all 1126 canonical structures, all 1053 previous question stems/scoring and all 125 previous assets. Unrelated module records remain unchanged against the pre-BVIS05 snapshot. Existing illustrated questions in scope use the new plates; genuine specimen questions remain unchanged.

## Artwork and references

All 41 full-size annotation overlays were reviewed. Corrections addressed detached capillary bridges; sealed alveolar airspaces and misplaced septum/capillary targets; a pleural-cavity target inside lung tissue; lymph-node afferents ending in follicles; and white-pulp targeting displaced onto marginal zone. The final corrected overlays were inspected again.

The final generator reports 41 plates, zero problems and 21 warnings. These are pin proximity or hint-displacement warnings, not anatomical approval. Closely spaced anatomical dots were reviewed in the art; interactive callouts are separately spread. Automated layout checks cover every plate at 273px/343px widths and 44px/60px control sizes.

Provenance distinguishes six live text-only OpenStax factual checks from bibliography not directly accessed in this run. No third-party illustrations were imported or traced. Review is not independent clinical certification.

The existing alveolar photomicrograph remains a separately identified real specimen, with Jpogi CC BY-SA 4.0 exact-file attribution and verified unchanged bytes/hash. It is also available in the respiratory exchange/histology lessons. Schematics explicitly state they are not photomicrographs.

## Checks completed

- All 114 automated tests pass.
- TypeScript type checking passes.
- Preservation audit and artwork-file provenance/hash checks pass.
- Phone-width web testing at 390×844 covered all five module routes: loaded plates, Learn/Recall, pinch zoom/reset and no horizontal page overflow.
- Expanded regional vessel and adrenal lessons loaded their additional original plates. The respiratory real specimen remained separate.
- Dense cardiovascular Learn/Recall and zoom/reset were usable at 320×844, with separated touch controls and no page-width overflow.
- A genuine incorrect heart hotspot was graded incorrect; the correct alveolus hotspot was graded correct.
- Español was selected through Settings; the Spanish pancreas identification accepted the accented answer “Páncreas.”
- No JavaScript exceptions or image-load failures were observed during the browser pass. Initial blank/loading captures settled to rendered content; development/deprecation warnings remained.

Physical iPhone/Android and native offline behavior were not tested. Phone-width web evidence does not establish native/offline behavior.

No release build, deployment or publication was performed. Scope stops at BVIS05.

Machine-readable counts: `BVIS05_REPORT.json`. Specimen evidence: `BVIS05_SPECIMEN_LICENSES.json`. Original artwork and hashes: `../../assets/images/anatomy/bvis05-atlas/provenance.json`.
