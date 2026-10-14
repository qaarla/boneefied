# Sources & rights disclosure — review

## Presentation

- Modules, grouped glossary plates and Practice plates now use the same inline disclosure implementation.
- The shared module route keeps its one disclosure after lessons and before final actions. Glossary has one grouped disclosure after its learning material and before its module action. Practice has one disclosure at the bottom of the relevant plate context.
- Each disclosure starts collapsed, has a clear up/down chevron, a comfortable toggle target, Tinos, the existing palette and rounded surface, focus indication, native expanded-state semantics and web `aria-expanded`.
- Concise creator/license/modification credit remains alongside images, including Practice images before grading. Detailed source titles, filenames, source/license statements, notes, adaptation notices, and Source/Rights links stay behind the disclosure.
- Glossary definition citations were moved into the same bottom disclosure rather than removed.
- Image-kind labels, study descriptions, specimen notes, definitions, lesson material, diagram art, numbering and navigation are unchanged.
- Registered licensing records were not edited. Standalone collection also preserves supplied non-catalog plate records and additional definition sources.
- Unreferenced historical plate-context helpers are not active rendering paths and were left untouched.

## Verification

- Typecheck and **51 focused rights/legend/viewer/repair tests passed**.
- Rights tests cover every module and every registered asset, gallery-only sources, supplied non-catalog records, deduplication without mutation, complete source/link fallback, and preservation of creators, license identifiers and modification credits.
- **Eight rendered browser combinations**: Skeletal and Female Reproductive module screens, the Acetabulum glossary entry and an existing Servier elbow Practice question, each at **390px/default text** and **320px/2.5× text**.
- In every combination: exactly one collapsed disclosure; no detailed body mounted initially; inline expansion and collapse worked; expanded licensing text matched stored records; existing Source/Rights destinations activated; the toggle remained scroll-reachable above bottom clearance.
- The glossary check included third-party Servier attribution and modification notices alongside definition-source attribution. Practice was tested using its existing single-question deep link, without changing navigation or submitting an answer.
- Link verification accounts for standard browser URL serialization, such as adding a trailing slash to a bare origin. No stored destination was changed.
- The collapsed toggle measured **48px** high at default text and **104px** at 2.5× text, retaining readable wrapping and at least a 44px target.
- Screenshots and measured evidence are under ignored `generated-artifacts/repair8/`. The automated screenshot tool can capture before Expo hydration; rendered-browser checks explicitly wait for the disclosure.
- This is phone-width web verification, not physical-device certification. Existing screen and bottom-dock padding were preserved.

No production build, deployment or publishing was performed. Work stopped after the rights-disclosure repair.
