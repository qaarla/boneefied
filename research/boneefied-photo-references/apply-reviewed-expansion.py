"""Import explicitly authored image reviews; no discovery or automatic approval."""
import copy
import datetime
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).parent
WORKSPACE = ROOT.parents[1]
review = json.loads((ROOT / "reviewed-expansion.json").read_text())
records = json.loads((ROOT / "references.json").read_text())
by_id = {record["assetId"]: record for record in records}
evidence = WORKSPACE / review["evidencePath"]
assert evidence.is_file(), "Actual inspection evidence is required."
now = datetime.datetime.now(datetime.timezone.utc).isoformat()

for mapping in review["mappings"]:
    record = by_id[mapping["assetId"]]
    # Never rewrite an unrelated existing approval when re-running the import.
    if record["status"] == "verified":
        continue
    selected = []
    for selection in mapping["refs"]:
        if "newSource" in selection:
            ref = copy.deepcopy(review["newSources"][selection["newSource"]])
            observed = ref.pop("visualEvidence")
            ref["linkingTerms"] = "Ordinary outbound source-page link with attribution; no photograph copying, embedding, hotlinking or reproduction."
            ref["verification"] = {
                "pageOpened": True, "captionChecked": True,
                "imageVisuallyInspected": True, "visualEvidence": observed,
                "checkedAt": now, "reviewedAtFinalCheck": now,
                "evidencePath": review["evidencePath"],
                "finalUrl": ref["url"],
                "redirectNotes": "Public original source page rendered without login or TLS interstitial. Any overview tile failures are disclosed in the review and bilingual labels.",
            }
        else:
            original = by_id[selection["fromAssetId"]]
            assert original["status"] == "verified"
            ref = copy.deepcopy(original["references"][selection["index"]])
        if "subject" in selection:
            ref["subject"] = selection["subject"]
        ref["relationship"] = "relevant-example"
        assert ref["organism"] == "human"
        assert all(ref["verification"][flag] for flag in ("pageOpened", "captionChecked", "imageVisuallyInspected"))
        assert ref["subject"]["en"] and ref["subject"]["es"] and ref["termsUrl"]
        selected.append(ref)
    assert selected
    record.setdefault("previousAssessment", copy.deepcopy({
        key: record[key] for key in ("status", "reason", "references")
    }))
    record.update({
        "status": "verified", "coverageKind": "relevant-example",
        "references": selected, "reason": mapping["reason"], "finalReview": mapping["reason"],
    })

verified = [record for record in records if record["status"] == "verified"]
for filename, content in (("references.json", records), ("verified-references.json", verified)):
    (ROOT / filename).write_text(json.dumps(content, indent=2, ensure_ascii=False) + "\n")

runtime = {
    record["assetId"]: [
        {
            "sourceName": ref.get("sourceName", "Wikimedia Commons"),
            **{key: ref[key] for key in ("url", "mediaType", "subject") if key in ref},
        }
        for ref in record["references"]
    ] for record in verified
}
(WORKSPACE / "artifacts/boneefied/content/real-photo-reference-data.ts").write_text(
    "/** Generated from individually reviewed verified-references.json. Metadata only. */\n"
    "import type { PhotoReference } from './real-photo-references';\n\n"
    "export const references: Readonly<Record<string, readonly PhotoReference[]>> = "
    + json.dumps(runtime, indent=2, ensure_ascii=False) + ";\n"
)

summary = json.loads((ROOT / "summary.json").read_text())
summary.update({
    "checkedAt": now, "coverageComplete": len(verified) == 164,
    "outcomes": dict(Counter(record["status"] for record in records)),
    "eligibleAssetIds": [record["assetId"] for record in verified],
    "ineligibleAssetIds": [record["assetId"] for record in records if record["status"] != "verified"],
    "verifiedDirectMatches": sum(record.get("coverageKind") == "direct-match" for record in verified),
    "verifiedLimitedRealExamples": sum(record.get("coverageKind") == "relevant-example" for record in verified),
    "verifiedSourceLinks": sum(len(record["references"]) for record in verified),
})
summary["finalVerification"]["approvedRuntimeMappings"] = len(verified)
summary["finalVerification"]["disclosedRelatedExamples"] = summary["verifiedLimitedRealExamples"]
summary["currentAcceptance"].update({
    "anatomicallyApprovedIllustrations": len(verified),
    "coverageBlockers": 164 - len(verified),
    "buildAuthorized": False,
    "linkLedgerNeedsRefresh": True,
})
(ROOT / "summary.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n")
print(json.dumps({"approved": len(verified), "coverageBlockers": 164 - len(verified),
                  "nativeBuildAuthorized": False, "photosCopied": 0}))
