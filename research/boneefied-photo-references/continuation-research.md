# Continued real-photo verification

This is ongoing research, not completion proof. Current anatomical approval:
43/164, with 121 coverage blockers. Three new mappings are the standalone
columnar specimen, blood-smear schematic, and five-leukocyte comparison. No native build, release,
submission, scheduling or publishing is authorized. The owner must first review
proof of 164/164 accurate live reference sets, and then authorize a build in a
separate later message.

## Fresh reachability check

`live-link-checks.json` accounts for all 164 illustrations individually. The
checker requests only source-page HTML. The first run checked the 35 distinct
destinations used by the 40 historically approved illustration sets. It does not download photographs,
change approvals, or relabel historical image inspections as fresh.

The first fresh run confirmed 34/35 destinations by certificate-validated HTTPS
GET. That supports 39/40 historically approved sets. Columbia's slide 66
returned a self-signed-certificate-chain error in this client; its prior actual
image inspection remains historical evidence. This is an access-check failure,
not a finding that the destination is broken for everyone.

After adding the three approved Basel mappings, the ledger covers 37 distinct
destinations for 43 approved illustrations. It confirms 36 destinations and
42 illustration sets by HTTP; Columbia slide 66 remains unconfirmed. The 35
unchanged destination checks retain their original timestamps; only the two
new URLs were requested again. All 40 prior approved canonical records compare
equal to their pre-continuation checkpoint values.

The inventory validator, six focused reference/assessment-guard tests, and
non-emitting TypeScript check passed with 43 approved runtime mappings.

The remaining 121 records are coverage blockers. Having a record and a reason
does not make any of them photographically covered.

## Actual app navigation

A fresh 402×874 browser context traversed Study → Skeletal → Skeletal System →
Skull base, external (inferior) view. Clicking the actual photo control opened
the original Commons HTML page at:

https://commons.wikimedia.org/wiki/File:Cranium_-_inferior_view.jpg

The photograph rendered at natural dimensions 960×744. In Recall on the same
plate there were no photo links before revelation or after revealing only
Marker 1 (19 remained hidden). After revealing all 20 labels, the photo control
appeared with the same destination. This checks one representative journey,
not every link, graded practice, or a physical device.

## New collections and candidates

### University of Basel: explicitly human ileum

Source:
https://tales.nmc.unibas.ch/en/histology-12/verdauungsorgane-magen-darm-trakt-anatomische-mikroskopie-55/ileum-human-1-359

- Certificate-validated HTTPS GET: 200; title “Ileum, Human 1.”
- The source explicitly states organ ileum, origin human, H&E stain.
- A browser screenshot actually showed the whole-slide tissue photograph.
- The source describes enterocytes, brush border, goblet cells, wall muscle
  layers, and fixation-related contour differences. Those descriptions alone
  do not verify that each feature was seen.
- Eight static images are embedded below the overview. Direct-image screenshot
  calls did not return valid screenshot URLs. This is a screenshot-tool
  limitation, not proof that those images are inaccessible to visitors.
- Cellular detail was inspected through the actual page. Screenshot `2ja2ob`
  was viewed by the main agent; tall enterocytes, nuclei, goblet cells and a
  brush border are visible. This now supports the standalone columnar specimen.
- The browser found overview tile-loading errors but all eight static images
  loaded. The app's English/Spanish label directs learners to the static photos.
- Relevant targets: `asset-commons-simple-columnar-epithelium`,
  `asset-bvis04-epithelia-simple`, and any independently matching intestinal
  section. Do not extend coverage merely from a shared organ name.
- The single existing columnar specimen's inventory describes only a simple
  columnar photomicrograph; do not accidentally impose another composite
  intestinal-wall plate's crypt-cell and paired-section requirements on it.
- Source credit/license section names University of Basel. Ordinary outbound
  linking is distinct from reproducing its copyrighted photographs.

### Histology Guide: discovered slide URLs, access caveat

The real chapter pages yielded these slide URLs; no filename was invented:

- https://histologyguide.com/slideview/MH-016-simple-epithelia/02-slide-1.html
- https://histologyguide.com/slideview/MH-016-simple-epithelia/02-slide-2.html
- https://histologyguide.com/slideview/MH-016-simple-epithelia/02-slide-3.html
- https://histologyguide.com/slideview/MH-017-stratified-epithelia/02-slide-1.html
- https://histologyguide.com/slideview/MH-018-transitional-epithelia/02-slide-1.html
- https://histologyguide.com/slideview/MH-033hr-blood-smear/07-slide-2.html
- https://histologyguide.com/slideview/MHS-304-bone-marrow/08-slide-1.html
- https://histologyguide.com/slideview/MH-034bhr-bone-marrow-smear/08-slide-1.html
- https://histologyguide.com/slideview/MH-091-thick-skin/11-slide-1.html
- https://histologyguide.com/slideview/MH-149-pituitary/13-slide-1.html
- https://histologyguide.com/slideview/MH-151-thyroid/13-slide-1.html
- https://histologyguide.com/slideview/MH-154-parathyroid/13-slide-1.html
- https://histologyguide.com/slideview/MHS-216-adrenal/13-slide-1.html
- https://histologyguide.com/slideview/MHS-211-pancreas/13-slide-1.html
- https://histologyguide.com/slideview/MHS-400-mitosis/01-slide-1.html

The corresponding `.org` blood summary viewer actually rendered stained blood
and a point-of-interest list in a screenshot. Individual leukocyte details were
not inspected. The site failed normal TLS validation in both local curl and
Node fetch; no certificate checks were disabled. Mammalian mitosis is not
established as human mitosis. None of these candidates is newly approved.
Guessed trachea and terms paths from the earlier attempt were 404s; do not reuse.

### Leeds blood teaching page: migrated route

The old `/blood/blood_wbc.php` is an actual “Page not found” page. The discovered
current route resolves with HTTPS 200:

https://histology.leeds.ac.uk/home/blood/blood_wbc/

It embeds five micrographs plus separate drawings. The author describes each
micrograph, but species is not explicitly established for each specimen and
all five photographs were not newly inspected. Relevant to the five-leukocyte
and smear composites, but not an approved complete reference set.

### University of Basel: complete human blood-cell set

https://tales.nmc.unibas.ch/en/histology-12/cardiovascular-organs-anatomical-microscopy-50/blood-smear-315

Explicitly human peripheral blood, MGG stain. Browser inspection verified seven
static photographic fields plus a separate comparison table. The main agent
viewed actual photographed neutrophils, eosinophils, basophils, lymphocytes and
monocytes, together with erythrocytes and platelets. The table was not counted
as photographic evidence. This supports two independently assessed illustrations:
the schematic smear and the five-leukocyte comparison.

The photo set uses several fields, unlike the idealized drawings. Overview
tiles failed, so the bilingual labels direct learners to the working static
photos. Full evidence: `evidence/basel-human-blood.md`. No photographs were copied
or embedded in the app.

### CDC blood micrographs

Fetched original record captions, not search snippets:

- https://phil.cdc.gov/Details.aspx?pid=30137 — lymphocyte and monocyte.
- https://phil.cdc.gov/Details.aspx?pid=15133 — erythrocytes, eosinophil,
  basophil, small lymphocyte.
- https://phil.cdc.gov/Details.aspx?pid=16847 — monocyte and lymphocyte.
- https://phil.cdc.gov/Details.aspx?pid=18908 — basophil.
- https://phil.cdc.gov/Details.aspx?pid=10614 — white blood cells, nonspecific.

These do not yet establish all five types in inspected human photographs.
No image was approved from these captions.

### Commons candidates: keep anatomy separate from titles

- https://commons.wikimedia.org/wiki/File:Human-Skeleton.jpg — actual human
  museum skeleton photo, Sklmsta, CC0. Visually inspected. Frame omits the feet
  and portions of the arms; it is not a complete whole-skeleton substitute.
- https://commons.wikimedia.org/wiki/File:Abdominal_Quadrant_Regions.jpg —
  author/metadata identify an illustration, not a real-person photograph.
- https://commons.wikimedia.org/wiki/File:WBC_precursors.JPG — caption includes
  immature granulocytes; not an inspected complete mature-human-leukocyte set.
- https://commons.wikimedia.org/wiki/File:Blood-basophil2.jpg and
  https://commons.wikimedia.org/wiki/File:Blood-eosinophil1.jpg — author
  Echinaceapallida, CC BY-SA 4.0; captions do not establish human species.
- https://commons.wikimedia.org/wiki/File:Human_Eosinophils_White_Blood_Cells_(42037940875).jpg
  — caption explicitly human, isolated cells, Julie Caldwell/Cincinnati
  Children's Hospital through NIH-NCATS. Not yet visually inspected; not a
  normal stained blood-smear field.
- https://commons.wikimedia.org/wiki/File:Muscle_Tissue.jpg — actual photo
  inspected and human-uterus caption read, but predominantly cross-sectional
  appearance does not demonstrate the target longitudinal spindle-cell view.
- https://commons.wikimedia.org/wiki/File:Human_smooth_muscle_tissue.jpg —
  actually inspected; broad gastrointestinal section, not a clear high-power
  smooth-cell comparison despite the title.
- https://commons.wikimedia.org/wiki/File:Uterus_(myometrium).JPG — actually
  inspected pink interlacing myometrial bundles; caption explicitly human,
  Jpogi, public-domain dedication. Individual spindle-cell detail needs
  closer inspection before replacing the Columbia comparator.

### Duke and Columbia

Duke's endocrine index distinguishes human pituitary, parathyroid and adrenal
from monkey/unspecified-mammal slides. The human adrenal DigitalScope viewer
rendered controls but a blank tissue area in the actual screenshot. Its caption
is not photographic proof. Do not retry the same blank viewer indefinitely.

Columbia's cuboidal/columnar chapter supplies genuine viewer links for slides
50, 101, 102, 107 and 115. The chapter text does not establish specimen species
for every example; no additional human-cellular approval follows from it.

## Still required

Individually complete and inspect the remaining reference sets, resolve the
unconfirmed destination, wire only genuinely approved sets into the existing
link registry, and repeat the changed-destination checks. Keep the owner's
164/164 acceptance threshold and separate later build authorization intact.
