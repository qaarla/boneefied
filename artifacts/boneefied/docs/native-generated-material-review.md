# Native app generated anatomical material

## Implementation
Scope: existing Boneefied iOS/Android app only. The approved website, other
products, study data and content catalog are unchanged. No release builds,
store submissions, dependency upgrades or deployments were performed.

Reused the corresponding website's genuinely image-generated anatomical
artwork, then graded it to the existing native light/dark palettes. These are
optimized raster derivatives, not SVG traces, line drawings or a wave motif.
The flowing fibers and branching detail are decorative, not histology claims;
no literal Z-disc or skeletal-muscle annotation was added.

Bundled assets (1024 × 1024, local `require`, no remote source):
- `assets/images/materials/boneefied-muscle-fibers-dark.webp` — 267,862 bytes.
- `assets/images/materials/boneefied-muscle-fibers-light.webp` — 241,978 bytes.

`OrganicBackground` now renders a persistent raster underlay in the existing
screen shell, including home, study/module, Practice, Missed, Progress and
Settings. Existing glossary screens also receive it. `OrganicSurface` supplies
the same material to existing compatible cards, panels, headers, classic tab
bars, atlas controls and opaque action controls. Images are square bounded
crops, never stretched into the page aspect ratio. Their sources/cache are
shared, with no scrolling animation or scroll-driven state updates.

Layers ignore touches and are hidden from accessibility. Image errors remove
only the decoration. Tinos, layout, safe-area calculations, app preferences and
Ask Naama link behavior are retained. Scientific images, their opaque canvases,
labels and hotspots are not decorated; hotspot controls explicitly opt out.
The disabled Submit label uses the existing muted-foreground token for clarity.
OS-owned native liquid-glass tab bars remain system-owned.

## Preview verification — October 17, 2026
Actual running **Expo web-rendered app preview**, not a website mockup or
installed-native capture:
- Phone: 390 × 900; tablet: 834 × 1112; light and dark; normal zoom.
- Home, skeletal study atlas, an active Practice question, glossary and
  Progress: 20 full-screen and 20 center-only captures.
- All center crops showed material; none of the checked views had horizontal
  overflow or browser page errors. Fine fibers remain visible behind the
  central surface and within compatible cards.
- Atlas zoom/reset controls were clicked successfully.
- Scientific atlas interiors, including image and markers, were pixel-identical
  with decorative layers shown/hidden, in all four viewport/theme combinations.
  A 12px border was excluded: the whole-frame comparison otherwise sees
  antialiased rounded corners against the changing exterior background.
- Deliberately blocking background image requests left home content usable and
  removed the failed decorative image.
- TypeScript check and all four focused material source/asset tests passed.

Evidence is under `generated-artifacts/native-generated-material/`.
`verification.json` records broad screen checks; whole-frame atlas booleans
there are superseded for protected scientific content by the more precise
interior checks in `protected-content-and-fallback.json`.

## Limits
Physical iPhone/Android rendering, installed-app fresh offline launch,
native memory/frame-rate profiling and OS liquid-glass rendering were **not
tested**. Bundled assets are not presented as proof of native offline behavior.
No release build was made, so existing installed builds are not updated.
Web font/icon rendering and browser-safe-area behavior are not native proof.
The environment still reports its pre-existing optional React Native DevTools
shared-library warning; Metro and the app preview serve successfully.
