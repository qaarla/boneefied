"""Curate inspected photographic companions separately from complete comparisons.

This never changes research approval statuses or build authorization.
Only existing human photographs with actual inspection evidence, or explicitly
authored source reviews, may enter the companion catalogue.
"""
import copy
import datetime
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).parent
WORKSPACE = ROOT.parents[1]
records = json.loads((ROOT / "references.json").read_text())
by_id = {row["assetId"]: row for row in records}
review = json.loads((ROOT / "companion-selections.json").read_text())
assert set(review["selections"]).issubset(by_id)
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
basel_index = json.loads((ROOT / "basel-source-index.json").read_text())
grouped = json.loads((ROOT / "grouped-inspections.json").read_text())
browser_checks = json.loads((ROOT / "browser-link-checks.json").read_text())
unavailable = {row["url"] for row in browser_checks["destinations"]
               if row["sourcePageReachable"] is False}


def qualifies(ref):
    return (
        ref.get("organism") == "human"
        and ref.get("mediaType") in ("gross-photo", "micrograph", "diagnostic-imaging")
        and ref.get("url", "").startswith("https://")
        and ref.get("termsUrl")
        and all(ref.get("verification", {}).get(flag) is True
                for flag in ("pageOpened", "captionChecked", "imageVisuallyInspected"))
        and (WORKSPACE / ref["verification"].get("evidencePath", "")).is_file()
    )


def selected(selection):
    if "fromObservation" in selection:
        observation = grouped["observations"][selection["fromObservation"]]
        assert observation["observedAndLimitations"].startswith("Human ")
        source = {
            "url": observation["viewerUrl"], "title": observation["slide"],
            "source": "Institutional histology specimen, accessed through Duke Histology",
            "sourceName": "Duke Histology / DigitalScope",
            "creator": "Original institutional slide collection; individual photographer not separately named",
            "mediaType": "micrograph", "organism": "human", "relationship": "relevant-example",
            "matches": observation["observedAndLimitations"],
            "viewLimitations": observation["observedAndLimitations"],
            "termsUrl": "https://histology.oit.duke.edu/",
            "linkingTerms": "Original public specimen viewer linked, not copied; no reproduction licence asserted.",
            "reproductionRights": "Institutional educational material; no image reproduction is performed.",
            "verification": {
                "pageOpened": True, "captionChecked": True, "imageVisuallyInspected": True,
                "visualEvidence": observation["observedAndLimitations"],
                "evidencePath": "research/boneefied-photo-references/grouped-inspections.json",
                "checkedAt": grouped["checkedAt"], "reviewedAtFinalCheck": grouped["checkedAt"],
                "finalUrl": observation["viewerUrl"],
                "redirectNotes": "Previously inspected original public slide viewer. Historical inspection date retained; HTTP reachability is checked separately.",
            },
        }
        refs = [source]
    elif "fromAssetId" in selection:
        candidates = [ref for ref in by_id[selection["fromAssetId"]]["references"] if qualifies(ref)]
        if "url" in selection:
            candidates = [ref for ref in candidates if ref["url"] == selection["url"]]
        if "index" in selection:
            candidates = [candidates[selection["index"]]]
        assert candidates, selection
        refs = copy.deepcopy(candidates)
    else:
        source = copy.deepcopy(review["newSources"][selection["newSource"]])
        if "baselLesson" in source:
            lesson = source.pop("baselLesson")
            meta = next(row for row in basel_index if row["url"].endswith("/" + lesson))
            assert re.search(r"Origin:\s*Human\b", meta["sourceText"][:300]), lesson
            source = {
                "url": meta["url"], "title": meta["title"],
                "source": "University of Basel Histology", "sourceName": "University of Basel",
                "creator": "University of Basel; individual photographer not separately named",
                "mediaType": "micrograph", "termsUrl": meta["url"],
                "reproductionRights": "The source License section identifies University of Basel. No reproduction permission is asserted or exercised.",
                **source,
            }
        proof = source.pop("visualEvidence")
        evidence = source.pop("evidencePath", review["evidencePath"])
        assert (WORKSPACE / evidence).is_file()
        inspected = source.pop("inspectedAt", review.get("inspectedAt", now))
        source.update({
            "organism": "human", "relationship": "relevant-example",
            "linkingTerms": "Ordinary outbound original source-page link only. No photograph copying, embedding, hotlinking or reproduction.",
            "verification": {
                "pageOpened": True, "captionChecked": True, "imageVisuallyInspected": True,
                "visualEvidence": proof, "evidencePath": evidence,
                "checkedAt": inspected, "reviewedAtFinalCheck": inspected,
                "finalUrl": source["url"],
                "redirectNotes": "Original public source page inspected. Any viewer limitations are explicitly recorded in the source review.",
            },
        })
        assert qualifies(source)
        refs = [source]
    for ref in refs:
        if "subject" in selection:
            ref["subject"] = selection["subject"]
        assert ref.get("subject", {}).get("en") and ref.get("subject", {}).get("es"), selection
    return refs


companions = []
for record in records:
    if record["status"] == "verified":
        continue
    selection = review["selections"].get(record["assetId"])
    if selection is not None:
        refs = [ref for item in selection for ref in selected(item)]
    else:
        refs = copy.deepcopy([ref for ref in record["references"] if qualifies(ref)])
    excluded = [ref for ref in refs if ref["url"] in unavailable]
    refs = list({ref["url"]: ref for ref in refs if ref["url"] not in unavailable}.values())
    if refs:
        assert all(ref.get("subject", {}).get("en") and ref.get("subject", {}).get("es") for ref in refs), record["assetId"]
        companions.append({
            "assetId": record["assetId"], "title": record["title"],
            "coverage": "selected-structures", "completeComparison": False,
            "remainingCoverage": "The named photographed structures are inspected; this does not establish every subject/view in the whole illustration. See source-specific limitations.",
            "priorFullSetAssessment": record["reason"], "references": refs,
            "unavailableResearchSources": excluded,
        })

def source_name(ref):
    return ref.get("sourceName") or {
        "commons.wikimedia.org": "Wikimedia Commons",
        "lane.stanford.edu": "Stanford Bassett Collection",
        "calisphere.org": "Calisphere / USC",
        "wellcomecollection.org": "Wellcome Collection",
        "pmc.ncbi.nlm.nih.gov": "PubMed Central",
        "www.cellimagelibrary.org": "Cell Image Library",
    }.get(urlparse(ref["url"]).hostname, ref["source"])


runtime = {
    row["assetId"]: [
        {**{key: ref[key] for key in ("url", "mediaType", "subject")},
         "sourceName": source_name(ref),
         "coverage": "selected-structures"}
        for ref in row["references"]
    ] for row in companions
}
(ROOT / "photo-companions.json").write_text(json.dumps(companions, indent=2, ensure_ascii=False) + "\n")
(WORKSPACE / "artifacts/boneefied/content/real-photo-companion-data.ts").write_text(
    "/** Inspected photographs of selected structures, NOT complete-comparison approvals. Metadata only. */\n"
    "import type { PhotoReference } from './real-photo-references';\n\n"
    "export const companions: Readonly<Record<string, readonly PhotoReference[]>> = "
    + json.dumps(runtime, indent=2, ensure_ascii=False) + ";\n"
)
approved = {record["assetId"] for record in records if record["status"] == "verified"}
accompanied = approved | set(runtime)
report = {
    "checkedAt": now, "expectedIllustrations": 164,
    "completeComparisons": len(approved), "selectedStructureCompanions": len(runtime),
    "illustrationsWithInspectedPhotographs": len(accompanied),
    "missingCompanions": [{"assetId": row["assetId"], "title": row["title"]}
                          for row in records if row["assetId"] not in accompanied],
    "allIllustrationsHaveCompanions": len(accompanied) == 164,
    "allComparisonsComplete": len(approved) == 164,
    "buildAuthorized": False,
    "limitations": "A source-level verified photograph of selected structures is NOT full coverage of an entire composite illustration. Original research statuses, outstanding subjects and build prohibition remain unchanged.",
}
(ROOT / "photo-companion-coverage.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
summary = json.loads((ROOT / "summary.json").read_text())
summary["photographicCompanions"] = {
    key: report[key] for key in (
        "checkedAt", "completeComparisons", "selectedStructureCompanions",
        "illustrationsWithInspectedPhotographs", "missingCompanions",
        "allIllustrationsHaveCompanions", "allComparisonsComplete", "buildAuthorized",
    )
}
summary["photographicCompanions"]["evidence"] = "photo-companions.json"
summary["currentAcceptance"]["illustrationsWithInspectedCompanions"] = len(accompanied)
summary["currentAcceptance"]["buildAuthorized"] = False
(ROOT / "summary.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n")
print(json.dumps(report, indent=2))
