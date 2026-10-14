# Boneefied — project continuity handoff

**Snapshot:** October 14, 2026. This is a navigational handoff for the *existing* product, not a replacement design, implementation plan, release instruction, or claim of physical-device approval. Recheck the live workspace and task states before relying on snapshot values. The detailed final visual acceptance record remains [Repair 9](artifacts/boneefied/docs/repair9-review.md); do not replace it with this summary.

## Identity and product boundary

- Canonical Replit app: **Boneefied**, `198e4559-f7a5-4cab-95b5-2eae02bdc149`. Public site: **https://boneefied.com**. GitHub repository: **`qaarla/boneefied`**. Do not assume GitHub's last-seen `main` matches the Replit workspace.
- Expo owner **`qaarla1`**, slug **`boneefied`**, project ID **`1555c01d-944e-41cb-b923-d4691756ab33`**. iOS bundle identifier and Android package are both **`com.qaarla.boneefied`**. Preserve these identities and existing signing/release history.
- A comprehensive, visual-first, offline-first human-anatomy learning app **beyond BIOL 250**. The course informs terminology and question styles but does not limit scope. Build on the source-linked curriculum, original and individually rights-verified illustrations, Learn/Recall, Practice, Missed, Progress, glossary, and local study history.
- **Contract B is only a reference for curriculum breadth/depth, not for UI.** Never copy its layout or use it as a replacement app. Retain the approved front-facing skull/atom identity, Tinos, orange/deep-charcoal palette, established mobile screens, and user data.

## Where to continue

| Surface | Existing package / behavior |
| --- | --- |
| Native iOS and Android | `artifacts/boneefied/`: React Native + Expo Router. Routes in `app/`, assembled production catalog in `content/canonical.ts`, curriculum/scoring in `content/`, local state in `context/StudyContext.tsx`, Spanish copy in `locales/es/`. Expo SDK 57; native builds are not a WebView wrapping the website. |
| Development desktop-browser study experience | The **same mobile package** can render using React Native Web. This is browser compatibility, **not** a separate native desktop installer. No Electron or Tauri application was found. |
| Responsive website | `artifacts/boneefied-site/`: separate React/Vite marketing, privacy and phone-access website, routed in production under `/site/`. Do not confuse desktop viewing of this site with a full desktop study app. |
| API | `artifacts/api-server/`: Express health and controlled release-download endpoints; **not** the anatomy catalog or a cloud study-progress sync service. |

At the last production inspection, `https://boneefied.com/` redirected to `/site/`; `/site/`, `/site/privacy-policy`, `/expo`, and `/api/healthz` responded successfully. An `expo-platform: ios` request to `/manifest` returned a native manifest. Plain browser routes `/practice`, `/glossary`, and `/module/skeletal-system` returned **404**: the published domain currently serves the **marketing site, not a full interactive study web app**. The marketing site's internal-preview button was observed pointing to an **older October 8 iOS build 3**, not the latest build or current HEAD. Do not advertise that link as a current-build installation path without rechecking it. The exact Git revision of the successful public website deployment was not returned by deployment metadata.

## Curriculum and established behavior

- **Current-HEAD count at the October 14 assembled-catalog inspection:** **18 visible published modules**, **1,126 structures**, **152 lessons**, **1,595 questions**, and **164 distinct active/referenced visual plates** (153 original project plates, 11 retained). The catalog has **187 asset records**, including records not active/referenced as plates; the active plates contain **1,433 targets**. Of the questions, **886** reference an image and **875** contain hotspot coordinates. Do not conflate these measures.
- **Count provenance:** an earlier figure supplied for this handoff says **831 questions**. That is **not** the October 14 current-HEAD assembled-catalog count (1,595). Preserve it only as a prior reported count; recalculate from `content/canonical.ts` after later changes rather than silently replacing the runtime number or presenting both as simultaneous current totals.
- Study home has inline anatomy search and a **bounded internally scrolling Explore selector with 17 system filters**; 18 published modules need not correspond one-to-one with the filters. Navigation uses a **one-row four-tab dock at ordinary text sizes** and accessible adaptive reflow at Larger Text sizes. Keep genuine module titles and a single safe-area/top-inset owner.
- English and Spanish UI/content are implemented, with localized questions and canonical answer conversion. At the last key-coverage inspection, Spanish entries were present for all current modules, structures, lessons, questions, active assets, source records and 1,126 glossary meanings. **English printed inside some bitmaps remains an artwork/localization limitation**; metadata translation does not remove it.
- Tinos regular/bold, native Dynamic Type and app text preferences are established. Reading text must not clip, truncate, split words mid-word, or impose a blanket font cap. Dense numbered legends and tiny image annotations use explicit local readability exceptions; preserve the accessible full labels.
- `StudyContext` keeps bookmarks, attempts, missed items, mastery, settings, and resumable Practice sessions through **AsyncStorage**. Language is also persisted locally. Grading is deterministic, with accepted aliases and localized answer mapping; incorrect answers join Missed, and successful recall clears the active missed item while preserving attempt history. Do not erase or replace local user state.
- Content, images, questions and anatomical answer positions must have valid provenance and rights. Preserve recorded creators, license terms, source and modification credits. Original Boneefied art is distinct from retained, individually checked public-domain/CC works. Appropriately licensed **OpenStax 2013 CC BY material** may be used when actually verified; **do not use the incompatible noncommercial Anatomy & Physiology second edition** for a potentially commercial/public product. Never invent or mirror anatomy images/answers as a shortcut.

## Visual repairs and acceptance limits

The nine completed atlas/Explore passes remain part of the current workspace:

1. Responsive marker paint/numeral sizing with independent 44px/60px touch targets.
2. Dense-plate bubble placement, protected anatomy and leader-line cleanup.
3. Page scroll at centered 1× versus viewer-owned zoomed pan and pinch.
4. Centered, contained diagram framing.
5. **49 displayed anatomical endpoints corrected across 19 diagrams**, preserving scoring IDs and source art.
6. Shared, centered, responsive Tinos atlas controls.
7. Compact, readable, correctly numbered Tinos legends.
8. Collapsed bottom **Sources & rights** disclosures without stripping required credit.
9. Final phone-width visual QA, including enlarged text, bounded Explore scrolling, actual module titles/top spacing, dock clearance and nested lessons.

Evidence and precise limits: [Repair 1–4](artifacts/boneefied/docs/atlas/), [Repair 5](artifacts/boneefied/docs/repair5-review.md), [Repair 6](artifacts/boneefied/docs/repair6-review.md), [Repair 7](artifacts/boneefied/docs/repair7-review.md), [Repair 8](artifacts/boneefied/docs/repair8-review.md), and **[Repair 9](artifacts/boneefied/docs/repair9-review.md)**. The latest *recorded* checks were **181 complete-suite tests passing**, then **27 affected tests and typecheck passing** after the final punctuation refinement; **36 screen/text combinations**, **58 viewer instances**, **44 expanded lessons** and **6,306 geometry cases** with zero reported geometry problems. These are browser, code and geometry checks, **not new physical-iPhone/Android approval or fresh tests in this handoff**.

The two still-unapproved and **not started** art proposals were **#37**, correct the original mitosis interphase chromatin and fifth-cell nucleus drawing, and **#38**, resolve the retained pelvis's ambiguous acetabular socket versus femoral head/cartilage. Its acetabulum target is **not anatomically certified**. Neither is resolved by moving a marker; **do not execute either without user approval**. Recheck their live task state before treating these snapshot task numbers as current.

## Git, builds and releases: separate facts

- At the October 14 inspection, Replit `main` was clean at **`5199cf51df064c3bbf842dc14028076f66f71dae`**, **14 commits after** the last confirmed/cached GitHub `main` revision **`9aee657d4c23d2ffcb67efb9559821aee56ea721`** (October 9). The push/current remote state was **not independently confirmed**. Do not overwrite, reset or assume the old mirror contains these repairs.
- Latest verified **finished** EAS records (October 13), all app version **1.0.0**, build/version code **4**, source **`7484bc88a3992d3ebe117c197ca9bb00623de9e5`**:
  - iOS internal IPA (`preview`): **`4943ad4f-b1cd-44ff-bce9-399dbc2de08a`**.
  - Android internal APK (`preview`): **`1c97e31f-8688-49e4-85c0-2689736365f0`**.
  - Android store-format AAB (`production`): **`504db4f4-c3ed-4b64-bfcc-9b829ff858f8`**.
- These binaries **predate October 14 visual repairs**. A finished build is not physical-device QA, store acceptance, or evidence of a current-HEAD binary. No current-HEAD rebuild, store publication, or physical-device approval was verified. The October 13 staged AAB and its *previously recorded* integrity are described in `releases/google-play/boneefied-production.manifest.json` and `releases/google-play/README.md`; the API's AAB/APK download endpoint is development-only, not a production store.
- **Historical manifest trap:** `releases/google-play/boneefied-production.manifest.json` at **current HEAD records version code 4**, October 13 build `504db4f4…`. The *same tracked path in Git history at `3eaf945`* records **version code 2**, build `8f089617…`; the intermediate history at `d67197a` records **code 3**, build `b8469a19…`. The ignored `generated-artifacts/aab-delivery/boneefied-oct09.manifest.json` also records code **3**. Never treat a historical code-2 manifest, code-3 archive, or shared filename as the current code-4 release. Prefer build ID, source SHA, actual bytes and current release manifest over filenames or version number alone.

## Rules on resuming

1. Inspect the **live Replit workspace**, current Git HEAD/working tree, project tasks, current artifact routing, and assembled catalog **before** changing anything. Records above are a dated handoff, not a command to resume a task. Compare the remote only when authorized; an older GitHub mirror is not the source of truth for newer workspace changes.
2. Preserve existing code, routes, content, original art and rights data, local user state, dependency pins, commits, released binaries and working screens. Work in this product rather than scaffolding a replacement or copying Contract B. Separate **implemented**, **browser/geometry verified**, **native-device verified**, **built**, **published**, and **store-submitted** in every status report.
3. For future UI work, start with existing components and the actual latest Repair 9 review; preserve normal-size four-tab navigation and enlarged-text accessibility. For new curriculum/art, verify educational correctness and rights before adding targets or answers. Do not quietly “fix” the two unapproved artwork proposals.
4. If later specifically asked for a mobile build, consult the existing user-provided **EAS Build Commands** runbook before selecting a workflow. Require a fresh source revision and explicit user direction for publishing/submission; never infer that an older successful code-4 build includes current repairs.
