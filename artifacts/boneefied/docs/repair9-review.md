# Final visual QA — review

## Inspected

- **36 screen/text combinations**: 390px/default and 320px/2.5× text for Study home; Female Reproductive, Muscular, Skeletal, Special Senses, Cytology/Mitosis, Integumentary, Cardiovascular and Urinary modules; Acetabulum and Centrosome glossary entries; four representative image-based Practice questions; Missed, Progress and Settings.
- **22 interactive combinations / 58 viewer instances**: main module galleries, original/vector plates, retained art and baked-label vertebral-column art, filtered glossary plates, unnumbered Practice hotspots, numbered callouts, read-only image-identification targets and real histology imagery.
- **44 lesson sections** opened across Muscular, Skeletal, Cytology/Mitosis, Female Reproductive and Special Senses modules, checking the narrower nested descriptions and lesson copy at enlarged text.
- Learn/Recall show-all, hide-all and individual reveals at both text sizes; zoomed touch panning in module, glossary and Practice consumers; pinch ownership/release; reset and ordinary 1× page scrolling; four graded image-question states in an isolated QA browser.
- The entire previous source-image/target inventory: **164 plates, 1,433 targets, 875 associated hotspot questions and 6,306 geometry cases**. Image hashes and target arrangements still match the individually reviewed inventory.

## Corrected

- Enlarged long titles and anatomical words split mid-word despite no horizontal overflow. This affected navigation/module titles, Study cards, glossary titles, a Practice prompt, Progress, anatomy chips and narrow expanded lesson descriptions.
- Shared reading text now uses its measured available width and bundled Tinos advances to fit only an oversized word/token, including attached punctuation and slash-linked anatomical terms. Default-size typography is unchanged. There is no global maximum reading-font size, truncation, invented hyphenation or content rewrite; Dynamic Type remains enabled and scales once.
- This includes the parenthesized `semimembranosus` edge case: the word alone fit, but its attached opening parenthesis/comma forced a split.
- Updated four obsolete regression expectations from earlier repairs: repaired runtime versus authored coordinates, relocated legend React keys, reviewed pubis position and the intentional separately bounded native Tinos legend. The underlying uniqueness, coordinate, typography and provenance assertions remain.

## Results

- The first screen sweep found **15 mid-word breaks**. The follow-up sweep found **zero**, with **zero horizontal overflow**. Expanded lessons were checked separately, and the final punctuation refinement was confirmed across all eight Muscular lesson sections.
- Explore by system remains a **268px bounded internal scroller** in both tested text modes, with taller internal content rather than a full-page stack. Touch swipes moved the inner list without moving the page; the final system row was reachable.
- Actual localized module titles remain in the content-height header. The header owns the safe-area inset once; the reading gap stays 18px. No generic valid-module title or double top inset was introduced.
- All 58 inspected viewer instances opened with centered, fully contained source-image boxes at 1×. Painted bubbles stayed within their frames and below 44px; checked legend numbers matched markers; Tinos legends remained within their bounded reading sizes.
- Shared controls retained their alignment and existing actions. Recall reveals/hides worked, and graded target legends retained their question numbering.
- Zoomed touch drags changed image transforms while page scroll stayed unchanged. Pinching retained the page lease until final release. Scroll ownership released normally; ordinary 1× swipes scrolled when the page had available scroll range.
- Sources & rights stayed at the bottom and collapsed, including after grading. Collapsed lesson screens showed no long raw URL blocks or orphaned detailed rights sections.
- Study's last content cleared the actual dock: default bottom about **726px / dock 760px**, enlarged bottom about **572px / dock 701px**. Tested Practice final actions cleared the same dock; stack-screen final actions remained fully reachable.
- The current catalog recheck found **zero geometry problems** and **no changed source images or target coordinates**. This preserves, but does not replace, the earlier individual anatomical source review.
- **181 complete-suite tests passed**. After the final punctuation-only adjustment, the affected **27 typography/shell/rights/legend tests and typecheck passed** again. The other tested domain code was unchanged.

## Still requiring artwork work

1. **Original mitosis stages** — interphase contains a condensed X chromosome, and the upper fifth cell has only one nucleus. Coordinates cannot correct these phase-drawing limitations. The corrected lower two-nuclei telophase target remains; the fourth-cell anaphase chromatids were previously confirmed.
2. **Retained Servier pelvis / acetabulum** — the low-resolution blue joint region does not clearly distinguish socket from femoral head/cartilage. Its acetabulum target is not anatomically certified. A clearer original or otherwise approved rights-safe plate is still needed.

No artwork was redrawn, re-licensed or replaced in this pass.

## Internal-build readiness

**Yes for a clean internal visual/device-test build**, with the two artwork limitations explicitly carried forward. This is not an anatomy-release certification or a guarantee about cloud-build/signing tooling. Physical iPhone/Android safe-area behavior, native touch interception and actual system Larger Text still need testing in that internal build; phone-browser evidence is not native-device proof.

QA evidence is ignored under `generated-artifacts/repair9/`. Initial automated screenshot captures can precede Expo hydration; rendered browser checks waited for actual content and images.

No build, deploy or publishing was performed. Work stopped after this QA pass.
