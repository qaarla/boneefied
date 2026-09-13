# Content rules

1. Never add anatomy facts, structure names, answers, aliases, diagrams, or
   question explanations unless they are explicitly present in a supplied and
   attributable course source.
2. Every production question and structure must carry a source ID and source
   page (or an explicit null when the source has no pages); verified content
   must pass runtime validation.
3. Typed answers use only Unicode normalization, trimming, case folding,
   ordinary punctuation removal, and whitespace collapsing. Alternate terms
   must be explicitly stored in `acceptedAliases`; no fuzzy matching.
4. Hotspots use normalized x/y/radius coordinates between 0 and 1.
5. Missing or unreadable source material is recorded as blocked/unresolved, not
   silently supplemented. Blocked modules may expose navigation and empty
   architecture but cannot publish study items or start practice.
6. Brand assets are preserved byte-for-byte and are not treated as anatomy
   sources.

Automated validation functions are implemented in `content/validation.ts`.
The scaffold has no test runner configured; behavior tests remain pending
without adding dependency churn.