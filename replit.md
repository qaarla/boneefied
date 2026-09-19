# Boneefied

Boneefied is chiefly a comprehensive mobile human-anatomy learning app: students study systems, structures, relationships, landmarks, and recognition cues, then practice and track mastery offline.

## Run & Operate

- `pnpm --dir artifacts/boneefied run typecheck`
- `pnpm --dir artifacts/boneefied test`
- The native Expo workflow is the Boneefied runtime; use the Replit Expo preview for browser checks and Preview on your phone for device checks.

## Source and content decisions

- `artifacts/boneefied/content/canonical.ts` is the production catalog; `content/anatomy.ts` contains the reusable skeletal and organ-foundation batch.
- BIOL 250 labs and reviews prioritize course terminology and question styles but do not bound the product. The current PDF source pack is not present in this runtime; only the user-transcribed Cytology excerpts are course content.
- Every published structure, lesson, question, and asset must link to a source record. Keep drafts and coming-next systems visible but non-playable.
- Activate only individually verified, compatible source assets. Record attribution, rights URL, and source URL in `content/sources.json` and the asset record. Do not use OpenStax Anatomy & Physiology 2e because its noncommercial license is incompatible with a potentially public/commercial app.
- Preserve the approved front-facing skull/atom branding, orange/deep-charcoal palette, Tinos typography, four tabs, and local/offline persistence.
- Preserve the current Study/module/Practice layout and visual structure; expand the canonical anatomy library rather than redesigning working screens unless a usability fix requires it.
- Treat Contract B only as a loose reference for curriculum breadth, subtopics, practice depth, and topic-based progress. Do not copy its UI, cards, navigation, spacing, hierarchy, or screen structure; Boneefied's current Replit preview is the visual source of truth.

## Product architecture

- Expo Router routes are in `artifacts/boneefied/app`.
- Content models, validation, catalog, lessons, and practice logic are in `artifacts/boneefied/content`.
- `StudyContext` owns AsyncStorage-backed attempts, misses, mastery, bookmarks, preferences, and resumable sessions.
- Image assets must use static `require` mappings in React Native; never construct dynamic require paths.

## Gotchas

- No anatomy image or hotspot may be invented, mirrored, or published without source and rights verification.
- Worksheets are not answer keys. Ambiguous or partial-credit material stays unresolved.
- Image recall must not expose answer keys in quiz mode.
- Keep the bottom tab bar clear of actions at narrow phone widths and preserve safe-area padding.