"""Replace one TLS-unconfirmed page with genuinely inspected human smooth muscle.

Keeps the old source in dated research history and never creates a new approval.
"""
import copy
import json
from pathlib import Path

root = Path(__file__).parent
review = json.loads((root / "companion-selections.json").read_text())
records = json.loads((root / "references.json").read_text())
old_url = "https://histologylab.ctl.columbia.edu/slides/slide66/"
matches = [(row, index) for row in records for index, ref in enumerate(row["references"])
           if row["status"] == "verified" and ref["url"] == old_url]
assert len(matches) <= 1
for row, index in matches:
    source = copy.deepcopy(review["newSources"]["uterine-myometrium"])
    observed = source.pop("visualEvidence")
    source.update({
        "organism": "human", "relationship": "relevant-example",
        "linkingTerms": "Ordinary original-source-page link only. No source media copied or embedded.",
        "verification": {
            "pageOpened": True, "captionChecked": True, "imageVisuallyInspected": True,
            "visualEvidence": observed, "checkedAt": review["inspectedAt"],
            "reviewedAtFinalCheck": review["inspectedAt"],
            "evidencePath": review["evidencePath"], "finalUrl": source["url"],
            "redirectNotes": "Original public slide viewer inspected at actual 20X. Transient viewer state parameter omitted.",
        },
    })
    row.setdefault("previousSourceReferences", []).append({
        "reference": copy.deepcopy(row["references"][index]),
        "replacementReason": "Old page's TLS chain could not be confirmed by the link checker. This does not assert global unavailability. New original human myometrium was actually inspected at 20X.",
    })
    row["references"][index] = source
    print("Replaced one source without changing approval status:", row["assetId"])
(root / "references.json").write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
