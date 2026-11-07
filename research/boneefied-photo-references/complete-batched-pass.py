"""One finite continuation pass; reuse evidence, never fetch source photographs."""
import collections
import copy
import datetime
import hashlib
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
WORKSPACE = ROOT.parents[1]


def load(name):
    return json.loads((ROOT / name).read_text())


def save(name, value):
    (ROOT / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n")


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


records = load("references.json")
by_id = {r["assetId"]: r for r in records}
inventory = {a["id"]: a for a in load("inventory.json")["assets"]}
audit = load("five-outcome-audit.json")
old_audit = {r["assetId"]: r for r in audit["records"]}
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
baseline_path = ROOT / "completion-pass-before.json"
if not baseline_path.exists():
    save(baseline_path.name, {
        "counts": audit["counts"],
        "approved": {r["assetId"]: digest(r) for r in records if r["status"] == "verified"},
        "approvedUrls": sorted({p["url"] for r in records if r["status"] == "verified" for p in r["references"]}),
    })
baseline = load(baseline_path.name)
assert len(baseline["approved"]) == 38
for aid, expected in baseline["approved"].items():
    assert digest(by_id[aid]) == expected, f"Existing approval changed: {aid}"


def selection(aid, url, en, es, limitations):
    source = next(p for p in by_id[aid]["references"] if p["url"] == url)
    assert source["organism"] == "human"
    assert source["verification"]["imageVisuallyInspected"]
    assert source["verification"]["captionChecked"] and source["termsUrl"]
    return {
        "fromAssetId": aid, "url": url, "subject": {"en": en, "es": es},
        "viewLimitations": limitations,
    }


new_mappings = [
    {
        "assetId": "asset-skeletal-atlas-skull-sutures",
        "reason": "Three previously inspected human specimens cover the named anatomy together: the superior vault shows frontal/parietal bones and coronal/sagittal sutures; the posterior lambda detail shows the lambdoid junction and adjoining occipital/parietal bone; the external skull base supplies temporal-bone context. Related examples, not a matched superior/posterior pair: the posterior source is explicitly a close detail and the temporal reference is an inferior view.",
        "refs": [
            selection("asset-skeletal-atlas-skull-sutures",
                      "https://commons.wikimedia.org/wiki/File:Cranium_-_neurocranium_superior_view_2.jpg",
                      "Skull vault: superior specimen",
                      "Bóveda craneal: espécimen superior",
                      "Superior vault specimen; not a whole posterior skull view or a matched donor."),
            selection("asset-skeletal-atlas-skull-sutures",
                      "https://commons.wikimedia.org/wiki/File:Cranium_-_sutura_lambdoidea_(lambda).jpg",
                      "Posterior sutures: lambda close-up",
                      "Suturas posteriores: detalle de lambda",
                      "Close detail of the sagittal/lambdoid junction, not the complete posterior contour."),
            selection("asset-skeletal-atlas-skull-base-external",
                      "https://commons.wikimedia.org/wiki/File:Cranium_-_inferior_view.jpg",
                      "Temporal bones: inferior skull context",
                      "Huesos temporales: contexto inferior del cráneo",
                      "Inferior temporal-bone context; not a posterior temporal-bone view or the identical skull."),
        ],
    },
    {
        "assetId": "asset-servier-pelvis",
        "reason": "The previously inspected frontal human pelvis depicts the sacrum and both hip bones, including iliac, pubic, ischial and acetabular regions. The separately inspected human femur supplies the missing femoral subject. These are complementary real bone examples, not a photograph of the illustrated intact pelvis with attached femora; donor and laterality are not asserted.",
        "refs": [
            selection("asset-servier-pelvis",
                      "https://commons.wikimedia.org/wiki/File:Pelvis_-_os_coxae,_os_sacrum_(frontal_view).jpg",
                      "Pelvis: frontal specimen without femora",
                      "Pelvis: espécimen frontal sin fémures",
                      "Mounted frontal pelvis with fixation wires; femora absent. The second reference is a separately photographed femur, not an attached joint."),
            selection("asset-skeletal-atlas-femur",
                      "https://commons.wikimedia.org/wiki/File:Femur_-_anterior,_posterior.jpg",
                      "Femur: separate anterior/posterior specimen",
                      "Fémur: espécimen separado anterior y posterior",
                      "Separate femur photographed in two aspects; no claim of shared donor, established side or an intact pelvic articulation."),
        ],
    },
]
extra = load("additional-reviewed-sources.json")
for mapping in new_mappings:
    if not any(m["assetId"] == mapping["assetId"] for m in extra["mappings"]):
        extra["mappings"].append(mapping)
    record = by_id[mapping["assetId"]]
    if record["status"] == "verified":
        continue
    selected = []
    for s in mapping["refs"]:
        source = next(p for p in by_id[s["fromAssetId"]]["references"] if p["url"] == s["url"])
        ref = copy.deepcopy(source)
        ref.update({"relationship": "relevant-example",
                    "subject": s["subject"], "viewLimitations": s["viewLimitations"]})
        # Retain the real historical visual-inspection date and creator/rights.
        # A successful text refresh is NOT a new photograph inspection.
        ref["metadataRefreshEvidence"] = "research/boneefied-photo-references/completion-access-checks.json"
        selected.append(ref)
    record.setdefault("previousAssessment", {
        key: copy.deepcopy(record[key]) for key in ("status", "reason", "references")
    })
    record.update(status="verified", coverageKind="relevant-example",
                  reason=mapping["reason"], finalReview=mapping["reason"], references=selected)
save("additional-reviewed-sources.json", extra)


def add_partial(aid, source_aid, url, reason):
    record = by_id[aid]
    assert record["status"] != "verified"
    source = next(p for p in by_id[source_aid]["references"] if p["url"] == url)
    assert source["organism"] == "human" and source["verification"]["imageVisuallyInspected"]
    if not any(p["url"] == url for p in record["references"]):
        record["references"].append(copy.deepcopy(source))
    record["status"] = "partial"
    record["reason"] = record["finalReview"] = reason
    record["completionPassEvidence"] = "research/boneefied-photo-references/completion-pass.json"


add_partial(
    "asset-bvis06-renal-corpuscle", "asset-commons-kidney-cortex-human",
    "https://commons.wikimedia.org/wiki/File:Kidney_cortex_(947_21)_Human.jpg",
    "Partial: the already inspected, explicitly human renal-cortex micrograph supplies a glomerular tuft and capsular space, resolving the earlier specimen-species uncertainty for this portion. Podocytes, filtration slits/membrane, macula densa, juxtaglomerular cells and the paired arteriolar arrangement remain unverified. No link is approved for the complete composite.",
)
add_partial(
    "asset-bvis04-plexus-overview", "asset-bvis04-upper-limb-nerves",
    "https://sites.google.com/a/umich.edu/bluelink/resources/bluelink/labeled-brachial-plexus-images",
    "Partial: the already inspected Michigan human brachial-plexus dissections replace reliance on an organism-unconfirmed candidate for that region. The whole-body diagram still lacks verified cervical/lumbar/sacral plexus, phrenic-nerve and spinal-cord coverage as a combined set. No complete-plate link is approved.",
)
add_partial(
    "asset-bvis04-epithelia-simple", "asset-commons-simple-cuboidal-epithelium",
    "https://commons.wikimedia.org/wiki/File:Kidney_cortex_(947_21)_Human.jpg",
    "Partial: already verified human squamous and cuboidal epithelial examples now support two of the three tissue types. The inspected low-power human ileum overview does not resolve individual columnar cells, and a basement membrane is not separately resolved across the source set. No complete three-type counterpart is approved.",
)

observations = load("grouped-inspections.json")["observations"]
new_partial_evidence = {
    "asset-bvis05-gut-lymphoid-lacteal": [observations[6]],
    "asset-bvis05-ovary-testis": [observations[7], observations[8]],
}
partial_reasons = {
    "asset-bvis05-gut-lymphoid-lacteal": "Partial: the already inspected human ileal cross-section shows the prominent aggregated lymphoid tissue relevant to Peyer patches. Appendix lymphoid tissue, villus lacteals and the intestinal lymphatic-trunk route are not established together. A Peyer-patch example is not complete coverage of this composite.",
    "asset-bvis05-ovary-testis": "Partial: the already inspected human ovarian sections include a corpus luteum and follicular profiles, so an ovarian example is established. No visually verified human testis set resolves both Sertoli and Leydig cells. The ovarian half must not be promoted to a complete ovary/testis endocrine counterpart.",
}
for aid, evidence in new_partial_evidence.items():
    record = by_id[aid]
    record.update(status="partial", reason=partial_reasons[aid], finalReview=partial_reasons[aid])
    record["completionPartialObservations"] = evidence

for aid, expected in baseline["approved"].items():
    assert digest(by_id[aid]) == expected, f"Existing approval changed: {aid}"
for aid, item in load("original-image-hashes.json").items():
    assert hashlib.sha256((WORKSPACE / "artifacts/boneefied" / item["path"]).read_bytes()).hexdigest() == item["sha256"], aid

for record in records:
    aid = record["assetId"]
    row = old_audit[aid]
    if record["status"] == "verified":
        outcome = "fully-matched"
    elif row["outcome"] == "no-literal-photo":
        outcome = row["outcome"]
    elif record.get("completionPartialObservations") or record.get("completionPassEvidence"):
        outcome = "partial"
    else:
        outcome = row["outcome"]
    row.update(outcome=outcome, runtimeLinked=record["status"] == "verified")
    if outcome != "no-literal-photo":
        row["reason"] = record["reason"]
    row["candidateSourcePages"] = list(dict.fromkeys(p["url"] for p in record["references"]))
    row["approvedCoverageKind"] = record["coverageKind"] if record["status"] == "verified" else None
    row["completionDecision"] = "Newly approved related specimen set" if aid in {
        m["assetId"] for m in new_mappings
    } else "Specificity improved; remains partial" if aid in {
        *new_partial_evidence, "asset-bvis06-renal-corpuscle",
        "asset-bvis04-plexus-overview", "asset-bvis04-epithelia-simple",
    } else "Retained existing approval" if aid in baseline["approved"] else "Retained documented exception after bounded review"
    if aid in new_partial_evidence:
        row["newPartialInspectionEvidence"] = new_partial_evidence[aid]

counts = {key: sum(r["outcome"] == key for r in audit["records"]) for key in audit["counts"]}
assert len(audit["records"]) == len(by_id) == 164 and sum(counts.values()) == 164
audit.update(checkedAt=now, counts=counts, boundedCompletionPassComplete=True)
save("five-outcome-audit.json", audit)
save("references.json", records)
verified = [r for r in records if r["status"] == "verified"]
save("verified-references.json", verified)
runtime = {
    r["assetId"]: [{k: v for k, v in {
        "url": ref["url"], "mediaType": ref["mediaType"],
        "sourceName": ref.get("sourceName", "Wikimedia Commons"), "subject": ref.get("subject"),
    }.items() if v is not None} for ref in r["references"]]
    for r in verified
}
(WORKSPACE / "artifacts/boneefied/content/real-photo-reference-data.ts").write_text(
    "/** Generated from individually reviewed verified-references.json. Metadata only. */\n"
    "import type { PhotoReference } from './real-photo-references';\n\n"
    "export const references: Readonly<Record<string, readonly PhotoReference[]>> = "
    + json.dumps(runtime, indent=2, ensure_ascii=False) + ";\n"
)

# An index of exact shared labels groups the remaining composite needs without
# inventing synonyms or claiming every listed label is individually absent.
subjects = collections.defaultdict(list)
for row in audit["records"]:
    if not row["runtimeLinked"] and row["outcome"] != "no-literal-photo":
        for label in set(inventory[row["assetId"]].get("depictedLabels", [])):
            subjects[label.casefold()].append(row["assetId"])
shared = {subject: ids for subject, ids in subjects.items() if len(ids) > 1}
new_urls = sorted({p["url"] for r in verified for p in r["references"]} - set(baseline["approvedUrls"]))
result = {
    "checkedAt": now, "complete": True,
    "scope": "One bounded reference-only completion pass; no builds, signing, submission, publication, redesign or broad features.",
    "before": baseline["counts"], "after": counts,
    "approvedDirectMatches": sum(r["coverageKind"] == "direct-match" for r in verified),
    "approvedRelatedExamples": sum(r["coverageKind"] == "relevant-example" for r in verified),
    "existingApprovedRecordsUnchanged": len(baseline["approved"]),
    "originalIllustrationHashesUnchanged": 164,
    "newlyApprovedAssetIds": [m["assetId"] for m in new_mappings],
    "newlyLinkedDistinctSourcePages": new_urls,
    "newMappings": new_mappings,
    "partialImprovements": partial_reasons | {
        aid: by_id[aid]["reason"] for aid in
        ("asset-bvis06-renal-corpuscle", "asset-bvis04-plexus-overview", "asset-bvis04-epithelia-simple")
    },
    "sharedRequiredSubjectsAmongRemainingPlates": shared,
    "researchDecisions": [
        "Reused individually inspected human specimens and existing rights/provenance, instead of restarting individual searches.",
        "Whole-skeleton/rib collection search: unrelated fossil/illustration results rejected. Bounded Commons collection browse found the Grover Krantz/Clyde photograph; actual source screenshot showed a nonstandard pose with dog occlusion, unsuitable for replacing the full instructional views. Not approved.",
        "Blood-cell topic: UEN human-anatomy chapter and CDC PHIL 15133/18908 metadata were accessible. The chapter cites all five cell photographs, but the initial rendered chapter viewport did not display them. Raw-image screenshot requests failed; original Flickr sources returned screenshot errors 403/429 and Commons cell-image screenshot requests returned 429. No retries and no blood-cell approval. These are research-inspection limitations, not proof that visitors cannot access the sources.",
        "Six selected new/existing source-page text checks succeeded; named specimen descriptions, Charles University collection attribution, creator and stated terms were retained. This is not a fresh visual inspection of every image.",
        "All other prior partial/unverified/unmatched findings were reviewed against the available inspected sources. Missing gross/microscopic views, species or anatomical detail remain explicit exceptions; no generic gallery or query URL was approved.",
    ],
    "stopReason": "The single bounded pass is complete. Further indiscriminate searches or retries would violate the requested limit; remaining exceptions are retained rather than converted into fabricated coverage.",
    "coverageComplete": False,
    "allFeasibleMatchesEstablished": False,
    "buildDisposition": "No build in this command. This reference reconciliation no longer blocks the separate already-authorized build step; remaining photo exceptions stay documented.",
}
save("completion-pass.json", result)
ledger = load("grouped-review-ledger.json")
for group in ledger["groups"].values():
    rows = [old_audit[aid] for aid in group["assetIds"]]
    group["completionPassReviewed"] = True
    group["groupOutcomeCounts"] = dict(collections.Counter(r["outcome"] for r in rows))
    group["residuals"] = [{k: r[k] for k in ("assetId", "outcome", "reason")} for r in rows if not r["runtimeLinked"]]
ledger.update(fiveOutcomeCounts=counts, boundedCompletionPassComplete=True,
              nativeBuildDisposition=result["buildDisposition"],
              completionPassEvidence="research/boneefied-photo-references/completion-pass.json")
save("grouped-review-ledger.json", ledger)
summary = load("summary.json")
summary.pop("finalVerification", None)
summary.update(
    checkedAt=now, fiveOutcomeCounts=counts,
    outcomes={status: sum(r["status"] == status for r in records) for status in ("verified", "partial", "unresolved")},
    eligibleAssetIds=[r["assetId"] for r in verified],
    ineligibleAssetIds=[r["assetId"] for r in records if r["status"] != "verified"],
    verifiedSourceLinks=sum(len(r["references"]) for r in verified),
    verifiedDirectMatches=result["approvedDirectMatches"],
    verifiedLimitedRealExamples=result["approvedRelatedExamples"],
    boundedCompletionPassComplete=True,
    completionPassEvidence="research/boneefied-photo-references/completion-pass.json",
    nativeBuildDisposition=result["buildDisposition"],
)
save("summary.json", summary)
md = [
    "# Boneefied: bounded reference completion pass",
    "",
    "**The one-pass reconciliation is complete; photographic coverage is not 100%.**",
    "The original 38 approved records and all 164 original image hashes are unchanged.",
    "",
    "| Outcome | Before | After |", "|---|---:|---:|",
    *[f"| {audit['definitions'][key]} | {baseline['counts'][key]} | {value} |"
      for key, value in counts.items()],
    "",
    f"Approved: {result['approvedDirectMatches']} direct matches and {result['approvedRelatedExamples']} disclosed related examples.",
    "",
    "## Newly linked source pages",
    *["- " + url for url in new_urls],
    "",
    "## Research and verification limits",
    *["- " + decision for decision in result["researchDecisions"]],
    "",
    "## Separate build step", result["buildDisposition"], "",
    "## All 164 individual outcomes",
]
for row in audit["records"]:
    md += [f"### {row['title']} (`{row['assetId']}`)",
           "**" + audit["definitions"][row["outcome"]] + "**",
           row["reason"], ""]
    md += ["- " + url for url in row["candidateSourcePages"]]
    md.append("")
(ROOT / "grouped-review-report.md").write_text("\n".join(md) + "\n")
print(json.dumps({"before": result["before"], "after": counts, "newUrls": new_urls}, indent=2))
