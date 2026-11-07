"""Reconcile all published images without promoting unchecked photographs."""
import collections
import datetime
import json
import pathlib
import runpy

ROOT = pathlib.Path(__file__).resolve().parent


def load(name):
    return json.loads((ROOT / name).read_text())


def save(name, value):
    (ROOT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


extra = load("additional-reviewed-sources.json")
new_mappings = [
    {
        "assetId": "asset-muscular-atlas-abdominal-wall",
        "reason": "The previously inspected human dissection depicts all four required muscles: rectus abdominis, external oblique, internal oblique and transversus abdominis. A single layered left anterolateral field is a suitable limited real example; three separate schematic panels and identical orientation are not required.",
        "refs": [{
            "fromAssetId": "asset-muscular-atlas-abdominal-wall",
            "url": "https://lane.stanford.edu/biomed-resources/bassett/bassettView.html?bn=134-3",
            "subject": {
                "en": "Abdominal wall: all four muscles, one left anterolateral dissection",
                "es": "Pared abdominal: los cuatro músculos, una disección anterolateral izquierda",
            },
            "viewLimitations": "One left anterolateral layered dissection rather than three sequential schematic panels; complementary real anatomy, not identical artwork.",
        }],
    },
    {
        "assetId": "asset-commons-simple-cuboidal-epithelium",
        "reason": "The inspected human renal-cortex photograph shows cuboidal cells with round nuclei surrounding renal-tubule lumina. It is a specifically identified human example of the epithelial type, not a claim that the original unclassified photomicrograph has established species.",
        "refs": [{
            "fromAssetId": "asset-commons-kidney-cortex-human",
            "url": "https://commons.wikimedia.org/wiki/File:Kidney_cortex_(947_21)_Human.jpg",
            "subject": {
                "en": "Simple cuboidal epithelium: human renal tubules",
                "es": "Epitelio cúbico simple: túbulos renales humanos",
            },
            "matches": "Human renal tubules lined by cuboidal epithelial cells, with rounded nuclei and lumina, visible in the actual source-page photograph.",
            "viewLimitations": "A renal-cortex field also containing a glomerulus and vessels, not an isolated idealized epithelial strip or the identical original photograph.",
            "reinspection": "The public Commons source page was opened on 2026-11-07. Its actual 600x human renal-cortex photograph visibly resolves cuboidal tubular epithelium and round nuclei around tubular lumina. Caption identifies human kidney cortex. No photograph was downloaded or retained in the project.",
        }],
    },
]
existing = {m["assetId"] for m in extra["mappings"]}
extra["mappings"].extend(m for m in new_mappings if m["assetId"] not in existing)
save("additional-reviewed-sources.json", extra)
runpy.run_path(str(ROOT / "apply-reviewed-bluelink.py"))

records = load("references.json")
inventory = {a["id"]: a for a in load("inventory.json")["assets"]}
ledger = load("grouped-review-ledger.json")
duke = load("duke-grouped-source-metadata.json")
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
inspections = [
    ("UMich104-2 thin skin", "Skin", "Human thin skin; real tissue section opened. Does not by itself establish every epidermal stratum, elastin fibre, sensory receptor or hypodermal structure in the composite plates."),
    ("UMich107 scalp", "Skin", "Human scalp; longitudinal follicles/bulbs and sebaceous glands visible. No claim that the overview resolves the complete papilla, sebaceous duct and arrector-pili combination."),
    ("UCSF180 fingertip", "Skin", "Human thick skin with a Pacinian corpuscle; no nail apparatus in the inspected field. Rejected as a nail-section match."),
    ("0003_E spleen", "Lymphatic", "Human spleen section; red/white pulp visible. Central arteriole, marginal-zone boundary, individual sinusoids and cords were not all resolved in the overview."),
    ("0076_E adult thymus", "Lymphatic", "Human thymus; lobules, cortex and medulla visible. Hassall corpuscles and anterior chest/retrosternal placement not established by this overview."),
    ("230 adrenal", "Endocrine", "Human adrenal section with cortex and medulla; not an in-situ adrenal-on-kidney photograph and not cell-level verification of every cortical zone/chromaffin cell."),
    ("HU_62_20x ileum", "GItract", "Human ileal cross-section, villi and lymphoid tissue visible. The 2x overview does not resolve individual columnar epithelial cells, all crypt-cell types or the paired longitudinal wall view."),
    ("236a ovary", "FemaleRepro", "Human ovary: a corpus luteum and several follicular profiles visible. Does not establish a complete developmental sequence or all oocyte-wall structures at cell level."),
    ("235 ovary", "FemaleRepro", "Human ovary with cortical follicular profiles and medullary vessels. No assertion that all primordial-to-mature stages, corona radiata and zona pellucida were individually resolved."),
    ("0041_I proliferative uterus", "FemaleRepro", "Human uterine tissue with endometrial glands and myometrium visible; a low-power section, not independent verification of the perimetrium and every endometrial sublayer."),
    ("0067_I secretory uterus", "FemaleRepro", "Human secretory uterine tissue with glandular profiles and muscle visible. Useful companion to proliferative tissue; not proof that every wall layer in the composite is covered."),
]
viewer_ids = [
    "f84c55bb-3e28-453b-810a-11e80a400937",
    "a16ef7b4-afc1-496d-963b-b81bbcd15c86",
    "f957ef21-dae0-4732-b8a1-120fc1b3c7fd",
    "80e46a8b-8b01-465f-94d6-d0fb13211b04",
    "c7ea8301-d949-4c16-b60b-8d59cb56a621",
    "f28d5a55-ab2c-4156-bf96-a92e1d83b985",
    "13457083-c943-4131-93c1-13770745e0fe",
    "881b362b-0ab3-4134-b7e0-79dcd9652de8",
    "a4879405-28d7-478c-9cc0-563678d0dc97",
    "a4c22a3f-4620-40fc-9ffb-7c6a72143467",
    "292d9e92-9b75-4a6a-8603-db3a6616a0c3",
]
assert len(inspections) == len(viewer_ids)
partial_inspection_indices = {
    "asset-openstax-historical-skin-structure": [0, 1, 2],
    "asset-bvis04-epidermis-strata": [0, 2],
    "asset-bvis04-dermis-hypodermis": [0, 1, 2],
    "asset-bvis04-hair-follicle": [1],
    "asset-bvis05-spleen-pulp": [3],
    "asset-bvis05-thymus-lobule": [4],
    "asset-bvis05-adrenal-zones": [5],
    "asset-commons-simple-columnar-epithelium": [6],
    "asset-bvis06-digestive-wall-layers": [6],
    "asset-bvis06-small-intestine": [6],
    "asset-bvis06-ovary-follicle": [7, 8],
    "asset-bvis06-uterine-wall": [9, 10],
}
save("grouped-inspections.json", {
    "checkedAt": now,
    "method": "Actual public slide viewers inspected through browser screenshots; text metadata is separate. No photograph, thumbnail or screenshot is retained in the workspace or embedded in the app.",
    "observations": [{"slide": s, "dukeSubject": g, "observedAndLimitations": note,
                      "viewerUrl": "https://www.digitalscope.org/ViewerUI/?SlideId=" + viewer_ids[i]}
                     for i, (s, g, note) in enumerate(inspections)],
    "partialOnlyAssetAssociations": partial_inspection_indices,
    "additionalInspection": "Human kidney-cortex Commons photograph reopened at cell-resolving displayed size; reused for cuboidal epithelium.",
    "sourceFailures": [
        {"source": "A previously collected BlueLink embedded-image URL", "result": "Browser returned HTTP 403. No further raw-image requests or access-control workarounds attempted; this does not revoke genuine earlier source-page inspections."},
        {"source": "https://histology.medicine.umich.edu/resources/slide-list", "result": "404. Followed the site's supplied home link once; current home provides a manual, not the old slide-list collection. No manual or photographs downloaded."},
    ],
})

no_literal = {
    "asset-atlas-abdominal-quadrants": "Four quadrant boundaries are a surface-location convention, not physical specimen boundaries. This justifies no literal photograph; it does not make the underlying organs unphotographable.",
    "asset-atlas-abdominal-regions": "The nine-region grid is an imposed surface-location convention, not nine physical specimen partitions. A body photograph alone would not depict these boundaries.",
    "asset-bvis05-vessel-flow-chain": "The continuous aorta-to-vein flow chain is a process diagram across scales, not a single static anatomical specimen. Real regional vessels remain photographable.",
}
names = {
    "fully-matched": "Fully matched or retained approved real example",
    "partial": "Partial anatomical coverage",
    "no-literal-photo": "Justified no literal photograph",
    "inaccessible-unverified": "Inaccessible or unverified source evidence",
    "unmatched-after-bounded-research": "Unmatched after bounded research",
}
outcomes = []
for record in records:
    aid = record["assetId"]
    if record["status"] != "verified" and aid in partial_inspection_indices:
        record.setdefault("beforeGroupedReview", {
            "status": record["status"], "reason": record["reason"],
        })
        record["status"] = "partial"
        record["reason"] = "Partial, not approved: " + " ".join(
            inspections[i][2] for i in partial_inspection_indices[aid])
        record["finalReview"] = record["reason"]
        record["partialReviewEvidence"] = "research/boneefied-photo-references/grouped-inspections.json"
    refs = record["references"]
    inspected = [r for r in refs if r.get("organism") == "human"
                 and r.get("verification", {}).get("imageVisuallyInspected")
                 and r.get("verification", {}).get("captionChecked")]
    if record["status"] == "verified":
        outcome = "fully-matched"
    elif aid in no_literal:
        outcome = "no-literal-photo"
    elif inspected or aid in partial_inspection_indices:
        outcome = "partial"
    elif refs:
        outcome = "inaccessible-unverified"
    else:
        outcome = "unmatched-after-bounded-research"
    row = {
        "assetId": aid, "title": record["title"], "outcome": outcome,
        "reason": no_literal.get(aid, record["reason"]),
        "requiredAnatomy": inventory[aid].get("depictedLabels", []),
        "approvedCoverageKind": record.get("coverageKind") if record["status"] == "verified" else None,
        "candidateSourcePages": list(dict.fromkeys(r["url"] for r in refs)),
        "actuallyInspectedHumanCandidatePages": list(dict.fromkeys(r["url"] for r in inspected)),
        "newPartialInspectionEvidence": [
            {"slide": inspections[i][0], "viewerUrl": "https://www.digitalscope.org/ViewerUI/?SlideId=" + viewer_ids[i],
             "observedAndLimitations": inspections[i][2]} for i in partial_inspection_indices.get(aid, [])
        ],
        "runtimeLinked": record["status"] == "verified",
    }
    outcomes.append(row)

counts = dict(collections.Counter(row["outcome"] for row in outcomes))
counts = {key: counts.get(key, 0) for key in names}
assert len(outcomes) == 164 and len({r["assetId"] for r in outcomes}) == 164
assert sum(counts.values()) == 164
by_id = {row["assetId"]: row for row in outcomes}
for group, data in ledger["groups"].items():
    rows = [by_id[aid] for aid in data["assetIds"]]
    data["state"] = "accounted-with-residual-exceptions" if any(not r["runtimeLinked"] for r in rows) else "approved"
    data["attempts"] = [{
        "type": "retained-prior-research",
        "sourcePages": data["existingSources"],
        "evidencePaths": data["existingEvidence"],
        "note": "Earlier collection searches, actual inspections, failures and limitations carried forward; these are not fresh inspection claims.",
    }]
    # Metadata-only browsing is deliberately not credited as image verification.
    data["groupOutcomeCounts"] = dict(collections.Counter(r["outcome"] for r in rows))
    data["residuals"] = [{"assetId": r["assetId"], "outcome": r["outcome"], "reason": r["reason"]}
                         for r in rows if not r["runtimeLinked"]]
ledger["knownFailuresDoNotRepeat"].extend(
    x for x in load("grouped-inspections.json")["sourceFailures"]
    if x not in ledger["knownFailuresDoNotRepeat"])
ledger["newCollectionMetadata"] = {
    "evidencePath": "research/boneefied-photo-references/duke-grouped-source-metadata.json",
    "pages": [{"url": v["url"], "status": v.get("status"), "slidesListed": len(v.get("slides", [])),
               "inspection": "Metadata only; actual inspected slides are listed separately."} for v in duke.values()],
}
ledger["actualNewSlideInspectionEvidence"] = "research/boneefied-photo-references/grouped-inspections.json"
ledger["fiveOutcomeCounts"] = counts
ledger["allImagesAccountedFor"] = True
ledger["allFeasibleMatchesEstablished"] = False
ledger["coverageComplete"] = False
ledger["nativeBuildDisposition"] = "Existing authorized iOS internal IPA / Android AAB request retained; not started or resubmitted. Residual photo exceptions must be reported before treating references as satisfied. No signing changes, store submission or publication."
save("grouped-review-ledger.json", ledger)
save("five-outcome-audit.json", {
    "checkedAt": now, "total": len(outcomes), "counts": counts,
    "definitions": names,
    "important": "Accounting is not photographic coverage. Fully-matched retains approved limited real examples with their disclosed differences; only the separate direct-match count means direct matches. Remaining cases are not approved links. Metadata-only leads are not image inspections. Unmatched does not mean no equivalent exists. Further suitable human photographs may exist.",
    "allFeasibleMatchesEstablished": False,
    "records": outcomes,
})
summary = load("summary.json")
save("references.json", records)
summary["outcomes"] = {status: sum(r["status"] == status for r in records)
                       for status in ("verified", "partial", "unresolved")}
summary["fiveOutcomeCounts"] = counts
summary["allImagesAccountedFor"] = True
summary["allFeasibleMatchesEstablished"] = False
summary["groupedReviewEvidence"] = [
    "research/boneefied-photo-references/grouped-review-ledger.json",
    "research/boneefied-photo-references/grouped-inspections.json",
    "research/boneefied-photo-references/five-outcome-audit.json",
]
save("summary.json", summary)
md = [
    "# Boneefied: current photo-reference exceptions",
    "",
    "**All 164 published images are accounted for; photographic coverage is incomplete.**",
    "**This does not establish that every feasible match has been found.**",
    "",
    "Existing approvals are preserved. Two additional eligible mappings reuse inspected sources: the four abdominal-wall muscles and human cuboidal renal-tubule epithelium.",
    "New Duke slide observations support continued research but do not establish every named structure in the affected composite plates. They remain unapproved.",
    "No original instructional images, assessment gates, study progress, numbering or source credits were changed. No third-party photographs were copied into the project.",
    "",
    "| Outcome | Images |", "|---|---:|",
    *[f"| {names[key]} | {value} |" for key, value in counts.items()],
    "",
    "The approved total includes limited real examples, not just direct photographic matches. Their differences remain disclosed in the reference labels and audit.",
    "",
    "## Native builds",
    "The authorized iOS internal IPA and Android AAB request is retained, not completed, restarted or duplicated. No build, signing change, submission or publication was performed. The outstanding reference exceptions below must not be described as satisfied.",
    "",
    "## Individual outcomes",
]
for row in outcomes:
    md += [f"### {row['title']} (`{row['assetId']}`)", f"**{names[row['outcome']]}**",
           row["reason"], ""]
    if row["requiredAnatomy"]:
        md += ["Published anatomy requiring coverage: " + "; ".join(row["requiredAnatomy"]) + ".", ""]
    for url in row["candidateSourcePages"]:
        md.append(f"- {url}")
    md.append("")
(ROOT / "grouped-review-report.md").write_text("\n".join(md) + "\n")
print(json.dumps(counts, indent=2))
