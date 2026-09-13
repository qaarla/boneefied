# Boneefied architecture

The app is an offline-first Expo Router client. `content/canonical.ts` is the
single source of truth for source records, modules, structures, assets,
questions, and pathways. `content/model.ts` keeps the schema strongly typed;
`content/validation.ts` checks IDs, provenance references, normalized hotspot
coordinates, and answer normalization.

`StudyContext` persists attempts, the missed queue, and structure-level mastery
records through AsyncStorage. Incorrect answers add to the queue; successful
recall removes the active queue item while retaining the historical attempt.
Mastery uses deterministic New, Learning, Needs Review, Strong, and Mastered
states rather than a spaced-repetition algorithm.

The reusable anatomy viewer accepts normalized (0..1) hotspot coordinates and
supports the future image, caption, label reveal, pan, and zoom surface without
coupling coordinates to device pixels. There are currently no production assets
or hotspots to render.