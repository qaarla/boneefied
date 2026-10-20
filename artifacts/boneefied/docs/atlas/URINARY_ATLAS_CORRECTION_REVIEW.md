# Urinary atlas correction review

Date: 2026-10-19. Scope: Urinary only, correction 16/19. No EAS/native build, submission, publication, or next-system work.

## Inspected

The published union of lesson, glossary and question assets contains **8 visuals**: six urinary diagrams, one genuine kidney-cortex micrograph and one shared male-system context drawing. There are 49 urinary structures and 59 urinary visual questions.

Each before-image was opened individually. The three revised drawings were opened again after regeneration. All eight displayed visuals were exercised in the running browser at Default text/390 px and Large text/320 px.

| Visual | Source targets | Finding and disposition |
|---|---:|---|
| Urinary tract and opened bladder | 17 | Checked kidney asymmetry, renal vessels, separate ureters/urethra, detrusor, trigone and sphincters. Art and endpoints preserved. Viewer fit/pan verified. |
| Kidney section and renal lobe | 18 | Corrected minor calyces to branch independently into major collectors, rather than connecting minor calyces serially. All existing endpoints retained and checked against the revised painted regions. |
| Renal blood vessels | 11 | Moved the juxtamedullary corpuscle fully above the cortex–medulla border and reconnected its efferent route from the tuft. Existing endpoints retained. |
| Nephron and onward urine pathway | 18 | Checked proximal/distal segments, descending/ascending limbs, loop, collecting/papillary ducts and the separate onward urine route. Art/endpoints preserved. |
| Renal corpuscle and filtration barrier | 11 | Brought the distal tubule back beside the afferent arteriole; placed macula densa and juxtaglomerular cells in their facing walls; relocated the JGA highlight. Repaired only these three target coordinates. Other endpoints retained. |
| Kidney placement | 12 | Checked abdominal/retroperitoneal placement and urinary connections. Art/endpoints preserved. |
| Human kidney-cortex micrograph | 0 | Preserved the genuine specimen, scale bar, original bytes and Josef Reischig/CC BY-SA 3.0 attribution. No invented microscopic markers or stain/magnification claims. Preserved its specimen gallery and enabled its assigned urinary lesson appearances. |
| Shared male-system context | 21 | Urinary bladder context only in the urinary glossary. All source coordinates were included in the automated region check, but only the bladder is displayed in this urinary context. No reproductive-art correction or broader reproductive anatomical sign-off. |

The seven diagram sources contain **108 targets** in total: 87 on the six primary urinary diagrams, plus 21 on the shared context source. The urinary browser views expose 88 numbered targets because the shared context intentionally shows only the bladder.

## Corrections and preserved identities

- Exactly three SVG/PNG pairs changed: kidney section, renal vessels and renal corpuscle. Other source-image bytes, including the genuine micrograph, stayed unchanged.
- Exactly three anatomical endpoint coordinates moved: JGA, macula densa and juxtaglomerular cell. Structure IDs, numbering/order, panel identity and answers remain stable.
- Explicit generator repair IDs preserve every other endpoint and reject identity/order changes. Only the three corrected raster paths receive a new preview-cache revision.
- Reviewed urinary assets use centered, undistorted contain fitting and pan bounds that include external callouts, leaders and their hit targets.
- Corrected the legacy cortex hotspot's accepted machine-ID alias in English and Spanish without changing its human answer.
- Fixed a feedback crash exposed by the urinary ordered-route question. Study labels are not allocated when the viewer renders question markers instead. Repeated study labels had exceeded a frame planned for four read-only question markers.
- Canonical modules, structures and sources, unrelated assets/questions, specimen rights and the established matte presentation remain unchanged.

## Verification

### Source, identities and scoring

- Region audit: all 108 anchors belong to their expected source regions, including checks using actual painted stroke widths rather than widened picking strokes.
- Before/after identity audit: no unexpected canonical identity, question, answer or out-of-scope asset changes.
- All 59 urinary visual questions pass source mapping and scoring checks: 50 hotspot, 6 image-identification, 2 ordered-sequence and 1 histology-identification.
- Source dimensions, local image registrations, provenance hashes and specimen attribution verified.
- TypeScript passes. Six urinary regression tests pass, including the ordered-feedback regression. Previously run shared framing tests and digestive preservation tests also passed; the final question-only allocation guard does not change their study-view geometry.

### Running browser

For each of the eight visuals, at both tested text/width combinations:

- At Reset/1×, verified image centering, native aspect ratio, complete circles/leaders, correct numbering/legend mapping, no circle overlap and endpoints matching source coordinates.
- Actually pressed Zoom in and Zoom out, dispatched two-finger pinch events, dragged on both axes and exercised the pan clamps.
- Verified that image dragging did not move the surrounding page.
- Actually pressed Reset and checked its return to fitted coordinates.
- Exercised Learn/Recall, including individual label reveal where appropriate. The real specimen remains unnumbered; the glossary context remains filtered to the bladder.

Thirteen actual Practice submissions passed: genuine histology, gross/microscopic hotspots, image identification, the legacy cortex question, both ordered routes, and all three repaired JGA-related targets. The ordered-route failure was fixed and the affected question flows then passed.

Actual foreground bytes matched current local source SHA-256 values for all eight visuals.

With networking disabled, all seven primary urinary visuals still displayed matching foreground bytes. Three lesson images were observed unmounting and then reopening successfully: nephron pathway, renal corpuscle and kidney placement. The fixed gallery images, including the specimen, remained mounted; this is not a claim that they were remounted. The shared male context was hash-checked online, not reopened offline.

Evidence is under `generated-artifacts/atlas-urinary-repair/`: before/after inventories and individual images, identity diff, region/question audits, Default/Large interaction measurements, Practice results, offline measurements and actual foreground screenshots.

## Unresolved and evidence limits

- No physical iPhone/Android touch or native cold-start offline verification was available. Browser touch emulation and warm browser caches are not native-device proof.
- The short-wait automatic preview screenshot returned a blank startup frame. Longer-lived interactive browser captures show the actual urinary specimen and corrected corpuscle, with foreground hashes matching their sources. No startup/font/platform changes were made for this visual correction.
- An existing `Return to library` navigation action was unhandled when attempted from a directly opened module page during offline-test setup. This cross-module navigation issue was not changed; offline image verification used the urinary lesson controls instead.
- No additional anatomical mismatch was identified in the reviewed urinary scope. Geometry self-checks alone are not independent anatomical proof.

Stopped after Urinary.
