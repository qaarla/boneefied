# Shared atlas legends — review

## Scope

- Replaced the shared viewer's inline numbered list with one shared legend component.
- Tinos remains in use: compact regular structure names and an aligned bold orange number column.
- Default font/line height is **13.5/18pt**, with **3pt row spacing** and compact outer padding.
- Dense annotation scaling is bounded locally at **1.5×**, yielding **20.25/27pt** maximum font/line height. Global text, headings, captions and controls retain their existing scaling.
- Native Text keeps font scaling enabled with a local maximum. The typography helper compensates for native system multiplication so preference/system scaling is not applied twice to font size or line height.
- Long names wrap with a hanging indent. The number column stays aligned with the first line.
- Original marker numbers are assigned before filtering revealed entries; existing question-hotspot numbering and full names remain intact.
- The legend grows naturally in the existing parent scroller. No fixed height, nested scrolling, line limits or truncation were added; existing bottom-clearance padding is unchanged.
- Anatomical content, source art, marker positions, controls and scoring behavior are unchanged.

## Verification

- Typecheck and **44 focused legend/viewer/repair tests passed**.
- Real browser checks covered the Cytology/Mitosis and Female Reproductive modules at **320px and 390px**, with **1×, 1.8× and 2.5×** text scaling: **12 combinations**.
- Every rendered legend in those modules was checked for exact correspondence with its painted marker numbers, Tinos, bounded font/line height, number/name alignment, wrapping, and absence of row/control/caption overlap.
- Representative **8-entry and 25-entry** legends were checked. At default text, their heights were **181px** and **538px**. At enlarged text, the eight-entry list remained **253px**; the 25-entry list was **763–790px**, depending on wrapping.
- The long anatomy term “Suspensory ligament of ovary” wraps under its name column at narrow enlarged text, not beneath the number.
- All selected final rows were scrolled into view and remained above the browser's bottom-clearance boundary. Module routes do not display the tab dock; these checks reserve 96px when no dock exists and use the actual dock boundary if present. Existing dock-screen padding was inspected and left intact.
- Reveal all / Hide all were checked to show/hide the legend without changing its numbering.
- Successful screenshots and measured evidence are under ignored `generated-artifacts/repair7/`. Browser checks wait for each diagram's painted markers, not just the earlier legend mount.
- Verification is phone-width web evidence plus native scaling arithmetic tests, **not physical iPhone/Android-device proof**.

No production build, deployment, publishing or unrelated UI repair was performed.
