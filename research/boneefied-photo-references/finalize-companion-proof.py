"""Write a readable per-illustration proof without conflating limited/full sets."""
import json
from pathlib import Path

root = Path(__file__).parent
records = json.loads((root / "references.json").read_text())
companions = {row["assetId"]: row for row in json.loads((root / "photo-companions.json").read_text())}
links = json.loads((root / "photo-companion-live-links.json").read_text())
approved_links = json.loads((root / "live-link-checks.json").read_text())
checks = {row["assetId"]: row for row in links["illustrations"]}
summary = json.loads((root / "summary.json").read_text())
assert len(records) == 164
assert links["all164HaveVerifiedWorkingCompanions"] is True
assert links["allListedLinksVerifiedWorking"] is True

summary["currentAcceptance"].update({
    "approvedAndHttpReachableIllustrations": approved_links["approvedAndHttpReachableIllustrations"],
    "distinctApprovedDestinations": approved_links["uniqueApprovedDestinations"],
    "httpConfirmedDestinations": approved_links["reachableDestinations"],
    "unconfirmedDestination": None,
    "linkLedgerNeedsRefresh": False,
    "illustrationsWithInspectedCompanions": 164,
    "illustrationsWithVerifiedWorkingCompanions": 164,
    "allActiveCompanionLinksVerifiedWorking": True,
    "companionLiveVerificationLedger": "research/boneefied-photo-references/photo-companion-live-links.json",
    "buildAuthorized": False,
})
summary["photographicCompanions"].update({
    "illustrationsWithVerifiedWorkingCompanions": 164,
    "allActiveLinksVerifiedWorking": True,
    "uniqueSourcePages": len(links["destinations"]),
    "liveEvidence": "photo-companion-live-links.json",
    "browserExceptions": "browser-link-checks.json",
    "readableProof": "companion-proof.md",
})
summary["finalVerification"].update({
    "typecheck": "passed; tsc --noEmit, not a native build",
    "focusedTests": {"passed": 8, "failed": 0},
    "originalApprovedRecordsPreserved": "Approval statuses preserved. One TLS-unconfirmed smooth-muscle URL replaced by actually inspected human myometrium at 20X; original source retained in previousSourceReferences.",
    "approvedRuntimeMappings": 47,
    "selectedStructureRuntimeMappings": 117,
    "totalRuntimeMappings": 164,
    "representativeDestinations": "All active source URLs have dated HTTP or individually rendered browser evidence in photo-companion-live-links.json. HTTP-client exceptions retain their failures separately; they are not fabricated HTTP passes.",
    "newCandidateLimit": "Only actual inspected human photographs enter companions. Selected-structure examples do not approve a whole composite. Unknown-species, uninspected and currently unavailable photographs are excluded.",
    "browser": "Public app preview rendered after restart. New source pages and clinical/microscope panels were individually inspected; CLI exceptions checked individually in a normal browser. Existing Recall/practice guards passed focused tests. No claim of every native-device interaction.",
    "externalPhotosAddedToProject": 0,
    "finalReport": "research/boneefied-photo-references/companion-proof.md",
})
(root / "summary.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n")

lines = [
    "# Boneefied photographic companion proof",
    "",
    f"Link report: {links['checkedAt']}",
    "",
    "**164/164 illustrations have inspected real-image companions with verified working active source links.**",
    "",
    "**Only 47 comparison sets are complete; 117 remain explicitly selected-structure examples.**",
    "A photograph can be genuine and useful without covering every subject, view, layer or cell type in a schematic.",
    "This report is NOT 164/164 complete-comparison approval and does NOT authorize any native build, release, scheduling, submission or publishing.",
    "",
    "Original illustrations, markers, questions, study progress and provenance are unchanged.",
    "Photographs are linked at their original source pages, not copied, embedded, cached or hotlinked.",
    "English/Spanish labels distinguish selected structures and actual diagnostic imaging.",
    "Recall and graded practice keep references hidden until the existing complete-reveal/submission boundary.",
    "",
    "## Verification methods",
    "",
    "- Image inspection evidence and dates: `photo-companions.json` and `verified-references.json`.",
    "- Complete-set approvals: `references.json`; missing full-set subjects remain blockers.",
    "- Source HTTP results: `live-link-checks.json` and `photo-companion-live-links.json`.",
    "- Individually rendered browser exceptions: `browser-link-checks.json`; CLI errors remain visible.",
    "- A blank Calisphere item and rate-limited Wellcome proximal-tubule item are excluded from active companions.",
    "- Old TLS-unconfirmed Columbia smooth-muscle source replaced by genuinely inspected human myometrium at 20X.",
    "- Eight focused tests and the non-emitting TypeScript check passed. Physical devices were not tested.",
    "",
    "## Every published illustration",
    "",
    "| Illustration | Comparison status | Named original-source references | Active links |",
    "|---|---|---|---|",
]
for record in records:
    complete = record["status"] == "verified"
    refs = record["references"] if complete else companions[record["assetId"]]["references"]
    names = []
    for ref in refs:
        label = ref.get("subject", {}).get("en") or ref["title"]
        label = label.replace("|", "\\|").replace("\n", " ")
        names.append(f"[{label}]({ref['url']})")
    status = "Complete set" if complete else "**Selected structures only; incomplete set**"
    title = record["title"].replace("|", "\\|")
    assert checks[record["assetId"]]["allListedLinksVerifiedWorking"]
    lines.append(f"| {title} | {status} | {'<br>'.join(names)} | Verified HTTP/browser |")
(root / "companion-proof.md").write_text("\n".join(lines) + "\n")
print(json.dumps({
    "illustrationsWithWorkingCompanions": 164,
    "completeComparisons": 47,
    "selectedStructureExamples": 117,
    "activeSourcePages": len(links["destinations"]),
    "allActiveLinksVerified": True,
    "nativeBuildAuthorized": False,
}, indent=2))
