"""Publish only explicitly reviewed photo mappings, never inferred candidates."""
import datetime
import copy
import json
import pathlib

ROOT = pathlib.Path(__file__).parent
APP = ROOT.parents[1] / "artifacts/boneefied/content"
review = json.loads((ROOT / "bluelink-review.json").read_text())
records = json.loads((ROOT / "references.json").read_text())
by_id = {record["assetId"]: record for record in records}
now = datetime.datetime.now(datetime.timezone.utc).isoformat()

def make_reference(mapping):
    meta_path = ROOT / "source-pages" / f'bluelink-{mapping["slug"]}.json'
    meta = json.loads(meta_path.read_text())
    selected = [meta["photos"][number - 1] for number in mapping["photos"]]
    assert all("error" not in photo for photo in selected)
    assert [photo["index"] for photo in selected] == mapping["photos"]
    return {
            "url": meta["sourcePage"],
            "title": mapping["en"],
            "source": "BlueLink, University of Michigan Medical School",
            "sourceName": "Michigan BlueLink",
            "creator": review["creator"],
            "mediaType": "gross-photo",
            "organism": "human",
            "relationship": "relevant-example",
            "matches": mapping["matches"],
            "viewLimitations": mapping["limitations"],
            "termsUrl": review["terms"],
            "linkingTerms": "Ordinary public university source-page link only. Atlas requires maintaining Alsup/Fox copyright for use; no separate prohibition on ordinary linking was found on the checked atlas/about pages. No image reuse rights are asserted.",
            "reproductionRights": "Copyright B. Kathleen Alsup and Glenn M. Fox. The about page describes free educational access; no commercial reproduction licence is claimed or exercised.",
            "subject": {"en": mapping["en"], "es": mapping["es"]},
            "verification": {
                "pageOpened": True,
                "captionChecked": True,
                "imageVisuallyInspected": True,
                "visualEvidence": "Actual photos and embedded anatomical captions/copyright manually inspected in temporary comparison sheets. Specifically reviewed page image numbers: " + ", ".join(map(str, mapping["photos"])) + ".",
                "checkedAt": now,
                "reviewedAtFinalCheck": now,
                "finalUrl": meta["finalUrl"],
                "redirectNotes": "Final public university URL recorded by HTTPS retrieval; no login required.",
                "evidencePath": (ROOT / "bluelink-review.json").relative_to(ROOT.parents[1]).as_posix(),
                "sourceMetadataPath": meta_path.relative_to(ROOT.parents[1]).as_posix(),
                "inspectedImagePages": [photo["imagePage"] for photo in selected],
                "organismEvidence": review["humanDonorProvenance"],
            },
        }


for mapping in review["mappings"]:
    record = by_id[mapping["assetId"]]
    # Retain the superseded incomplete research rather than losing its evidence.
    if "previousAssessment" not in record:
        record["previousAssessment"] = {
            key: record[key] for key in ("status", "reason", "references")
        }
    record.update({
        "status": "verified",
        "coverageKind": "relevant-example",
        "reason": mapping["matches"] + " " + mapping["limitations"],
        "finalReview": mapping["matches"] + " " + mapping["limitations"],
        "references": [make_reference(source) for source in [mapping, *mapping.get("additionalSources", [])]],
    })

extra_path = ROOT / "additional-reviewed-sources.json"
extra = json.loads(extra_path.read_text()) if extra_path.exists() else {"mappings": []}
for mapping in extra["mappings"]:
    record = by_id[mapping["assetId"]]
    if "previousAssessment" not in record:
        record["previousAssessment"] = {key: copy.deepcopy(record[key]) for key in ("status", "reason", "references")}
    selected = []
    for selection in mapping["refs"]:
        if "newSource" in selection:
            ref = copy.deepcopy(extra["newSources"][selection["newSource"]])
        else:
            source = by_id[selection["fromAssetId"]]
            choices = source.get("previousAssessment", {}).get("references", source["references"])
            ref = copy.deepcopy(next(ref for ref in choices if ref["url"] == selection["url"]))
            for key in ("subject", "matches", "viewLimitations"):
                if key in selection:
                    ref[key] = selection[key]
            if "reinspection" in selection:
                ref["verification"].update({
                    "visualEvidence": selection["reinspection"],
                    "imageVisuallyInspected": True, "pageOpened": True, "captionChecked": True,
                    "checkedAt": now, "reviewedAtFinalCheck": now,
                    "evidencePath": "research/boneefied-photo-references/additional-reviewed-sources.json",
                })
        ref["relationship"] = "relevant-example"
        selected.append(ref)
    record.update({"status": "verified", "coverageKind": "relevant-example",
                   "reason": mapping["reason"], "finalReview": mapping["reason"], "references": selected})

verified = [record for record in records if record["status"] == "verified"]
for filename, content in [("references.json", records), ("verified-references.json", verified)]:
    (ROOT / filename).write_text(json.dumps(content, indent=2, ensure_ascii=False) + "\n")

runtime = {}
for record in verified:
    runtime[record["assetId"]] = [
        {key: value for key, value in {
            "url": ref["url"],
            "mediaType": ref["mediaType"],
            "sourceName": ref.get("sourceName", "Wikimedia Commons"),
            "subject": ref.get("subject"),
        }.items() if value is not None}
        for ref in record["references"]
    ]
(APP / "real-photo-reference-data.ts").write_text(
    "/** Generated from individually reviewed verified-references.json. Metadata only. */\n"
    "import type { PhotoReference } from './real-photo-references';\n\n"
    "export const references: Readonly<Record<string, readonly PhotoReference[]>> = "
    + json.dumps(runtime, indent=2, ensure_ascii=False) + ";\n"
)
summary = json.loads((ROOT / "summary.json").read_text())
summary["checkedAt"] = now
summary["outcomes"] = {status: sum(r["status"] == status for r in records)
                       for status in ("verified", "partial", "unresolved")}
summary["eligibleAssetIds"] = [r["assetId"] for r in verified]
summary["ineligibleAssetIds"] = [r["assetId"] for r in records if r["status"] != "verified"]
summary["verifiedSourceLinks"] = sum(len(r["references"]) for r in verified)
summary["verifiedDirectMatches"] = sum(r.get("coverageKind") == "direct-match" for r in verified)
summary["verifiedLimitedRealExamples"] = sum(r.get("coverageKind") == "relevant-example" for r in verified)
summary["verifiedImagingRecords"] = sum(any(p["mediaType"] == "diagnostic-imaging" for p in r["references"]) for r in verified)
summary["referencesWithoutEstablishedTermsUrl"] = sum(not p["termsUrl"] for r in records for p in r["references"])
if "previousSourceInspectionMetrics" not in summary:
    summary["previousSourceInspectionMetrics"] = {
        key: summary.pop(key) for key in (
            "distinctCandidateSourcePages", "sourcePagesOpened", "sourcePagesWithActualImageInspection"
        ) if key in summary
    }
summary["sourceInspectionNote"] = "Historical aggregate inspection metrics are retained separately. New approval evidence names the exact inspected photos; collecting a gallery never implies all of its photos were inspected."
summary["coverageComplete"] = len(verified) == len(records)
summary["exactFullCoverage"] = summary["coverageComplete"] and all(r.get("coverageKind") == "direct-match" for r in verified)
summary["eligibilityPolicy"] = "Only individually verified mappings are linked. Named limited examples disclose complementary views, cut/reflected tissues and other material differences. Missing subjects/layers stay partial; a regional photo is not a substitute for complete composite coverage."
summary["gapFillReview"] = {
    "addedVerifiedMappings": len(review["mappings"]) + len(extra["mappings"]),
    "evidence": ["research/boneefied-photo-references/bluelink-review.json",
                 "research/boneefied-photo-references/additional-reviewed-sources.json"],
    "source": "Individually reviewed Michigan BlueLink, Commons and Columbia sources; ordinary links, not copied app photographs",
}
# Prior verification is historical; new checks must not inherit its passing flags.
if "previousVerification" not in summary:
    summary["previousVerification"] = summary.pop("finalVerification", None)
summary.pop("finalVerification", None)
summary.pop("finalCheck", None)
summary.pop("linkedDestinationHttpChecks", None)
(ROOT / "summary.json").write_text(json.dumps(summary, indent=2) + "\n")
print(json.dumps(summary["outcomes"]))
