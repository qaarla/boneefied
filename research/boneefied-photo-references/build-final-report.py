"""Generate the source-only audit document; no application or external image IO."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).parent
records = json.loads((ROOT / "references.json").read_text())
summary = json.loads((ROOT / "summary.json").read_text())
approved = [r for r in records if r["status"] == "verified"]
unlinked = [r for r in records if r["status"] != "verified"]
unresolved = [r for r in records if r["status"] == "unresolved"]
assert len(records) == summary["scope"]["publishedReachableAssets"]
counts = {status: sum(r["status"] == status for r in records) for status in ("verified", "partial", "unresolved")}
assert counts == summary["outcomes"]
links = sum(len(r["references"]) for r in approved)

def esc(value):
    return html.escape(str(value), quote=True)

def link(url, label):
    return f'<a href="{esc(url)}" target="_blank" rel="noopener noreferrer">{esc(label)}</a>'

def table(headers, rows):
    head = "".join(f"<th>{esc(h)}</th>" for h in headers)
    body = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in row) + "</tr>" for row in rows)
    return f'<div class="table-wrap"><table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>'

historical_qa = [
    "TypeScript check passed, all six focused photo-reference tests passed, and the complete-record/evidence validator passed for 164 unique published assets.",
    "All ten final linked source pages returned HTTP 200 HTML with zero HTTP redirects. The exact page, actual photograph, caption, creator and file-specific terms were checked; raw image URLs are not app destinations.",
    "At 402×874 with Text Large, English and Spanish anterior/posterior link rows were distinct, wrapped without clipping and measured 312×54 pixels. Link controls were below the image, outside its gesture surface.",
    "Browser Zoom in changed scale 1 to 1.5, dragging changed translation, and Reset restored translation zero and scale 1. Opening a representative source preserved the expanded lesson, scale 1.5 and nested scrollTop 9939 on return.",
    "In Spanish Recall, the link was absent initially and after revealing 1 of 20 labels; it appeared only after all 20 labels were revealed.",
    "The alveolar sample used the explicit Spanish microscope label. Offline, tapping opened no popup and showed the localized retry message while the local image and zoom controls remained available. Reconnecting and retrying opened the source page and cleared the alert without losing route/scroll. A blocked-window.open simulation produced the same recoverable error.",
    "Practice limit: the available browser session started with a text-only question. No answer was submitted or progress reset. Eligible-image Practice protection and submitted/revealed feedback are covered by unit/source guards, not by this browser pass.",
    "Physical-device limit: Expo automation reported no connected device target. Native-device opening, return-state and offline behavior were not tested. No simulator, EAS/release build, deployment or publication was started.",
    "All 164 original instructional-image SHA-256 hashes match the baseline. No source photographs remain under research or were imported into Boneefied. No question/scoring/progress, artwork, numbering, caption, settings implementation, website or unrelated appearance changes were made. Browser-only test settings were restored.",
    "The browser interaction used the earlier anterior-scapula candidate. The final allowlist instead uses Anatomist90's inspected natural-bone photograph; the final page was independently visited and HTTP-checked, and the final runtime-to-registry mapping passed tests. This literal URL replacement was not a second browser interaction run.",
]

qa = [
    "Current verification is recorded in summary.json under finalVerification. The report generator does not run checks or manufacture passing results.",
    "The runtime allowlist is generated from the approved central records only. Partial and unresolved candidates are not linked.",
    "Source images were inspected as temporary research evidence, not imported into the app. Named comparisons disclose view differences; image quality, numbering, questions and progress are preserved.",
    "Prior browser interaction checks are historical, not a fresh test of every new destination. Assessment availability logic is unchanged; focused tests check its fail-closed behavior.",
    "No physical-device opening test, native build, submission, publication or deployment was performed for this update.",
]
intro = [
    "Full per-image link coverage has not been achieved.",
    "The catalog contains 187 assets. The published denominator is 164 instructional images across 18 modules: 158 diagrams and 6 existing histology images. The 23 unreferenced/superseded catalog entries are excluded.",
    f"Every published image has an individual assessed record. {len(approved)} images have approved links: {summary['verifiedDirectMatches']} direct matches and {summary['verifiedLimitedRealExamples']} limited real examples, comprising {links} named source-page links.",
    f"{len(unlinked)} images remain unlinked: {counts['partial']} partial and {len(unresolved)} unresolved. A partial candidate is not a verified counterpart. No guessed, search-result or uninspected fallback is shown in the app.",
    "Human gross specimens, microscopy and explicitly labeled medical imaging are distinguished. Multi-subject plates use named complementary references rather than claiming one photograph covers all views. Donor identity and unstated laterality are not invented.",
    "Michigan BlueLink donor photographs are ordinary university source-page links, not copied commercial app assets. University/creator attribution and reproduction boundaries are recorded per reference. Newly approved sources and historical inspection metrics are kept separate.",
    "This audit supersedes the earlier eight-image snapshot. Current references.json and verified-references.json are authoritative. Historical area files are used only to classify asset IDs, never as current outcome totals. The validator checks completeness/evidence flags, not anatomical correctness.",
]

approved_rows = []
for r in approved:
    source_cells = []
    for p in r["references"]:
        label = p.get("subject", {}).get("en", p["title"])
        source_cells.append(link(p["url"], label) + "<br>" + esc(p["creator"]) + " · " + link(p["termsUrl"], "Source terms"))
    kind = "Direct match" if r["coverageKind"] == "direct-match" else "Named limited real example"
    approved_rows.append([esc(r["title"]) + f'<small>{esc(r["assetId"])}</small>', esc(kind), "<p>" + "</p><p>".join(source_cells) + "</p>"])

area_rows = []
for area, name in [
    ("skeletal", "Skeleton / positioning / foundations"),
    ("muscular", "Gross muscular anatomy"),
    ("neuro", "Neural / special senses"),
    ("micro", "Microscopy / skin / blood / endocrine"),
    ("visceral", "Visceral gross anatomy"),
]:
    historical_ids = {r["assetId"] for r in json.loads((ROOT / f"final-{area}-results.json").read_text())}
    group = [r for r in records if r["assetId"] in historical_ids]
    area_rows.append([esc(name), str(len(group))] + [str(sum(r["status"] == s for r in group)) for s in ["verified", "partial", "unresolved"]])

representatives = [
    ("Bone", lambda r: r["assetId"] == "asset-skeletal-atlas-scapula"),
    ("Muscle", lambda r: r["assetId"] == "asset-muscular-atlas-posterior-arm"),
    ("Organ", lambda r: r["assetId"] == "asset-bvis06-kidney-section"),
    ("Nerve", lambda r: r["assetId"] == "asset-bvis04-upper-limb-nerves"),
    ("Vessel", lambda r: r["assetId"] == "asset-bvis05-coronary-anterior"),
    ("Histology", lambda r: r["assetId"] == "asset-commons-alveolar-sac"),
]
representative_rows = []
for kind, predicate in representatives:
    r = next(r for r in records if predicate(r))
    p = next(p for p in r["references"] if p["verification"]["imageVisuallyInspected"])
    representative_rows.append([esc(kind), esc(r["title"]) + f'<small>{esc(r["status"])}; species: {esc(p["organism"])}</small>', esc(p["matches"]) + "<br>" + link(p["url"], "Inspected source page"), esc(p["viewLimitations"])])

corrections = [
    "The upper-arm biceps candidate was removed from forearm coverage. Coronary-heart and kidney illustrations, and a BodyParts3D scapula render, were rejected as specimen photographs.",
    "The muscle-tissue plate now has separately reviewed human skeletal, cardiac and smooth-muscle examples. A single islet or blood photograph still does not cover an entire multi-subject plate. Genoa deep links and the restricted Histology Guide collection remain excluded.",
    "Unconfirmed human species, uninspected images and missing terms remain ineligible. The OpenStax spinal-cord organism remains unconfirmed. Different donors and absent printed labels are not themselves mismatches; materially missing subjects, layers and views cannot be silently ignored.",
    "Ordinary linking is not reproduction permission. No photos, thumbnails, source quotations, frames, new photo galleries or raw-image destinations were imported into the app.",
]

sections = [
    '<p class="eyebrow">BONEEFIED · CURRENT REFERENCE INVENTORY</p><h1>Real-photo references: inventory audit</h1>',
    f'<p class="status"><strong>Full coverage has not been achieved.</strong><br>{len(approved)} of {len(records)} images have approved links. {len(unlinked)} remain unlinked: {counts["partial"]} partial and {len(unresolved)} unresolved.</p>',
    "".join(f"<p>{esc(t)}</p>" for t in intro[1:]),
    f'<nav aria-label="Report sections"><a href="#approved">Approved links</a><a href="#checks">Verification limits</a><a href="#unresolved">{len(unresolved)} unresolved</a><a href="#unlinked">All {len(unlinked)} unlinked</a></nav>',
    f'<h2 id="approved">{len(approved)} instructional images have approved links</h2>',
    table(["Illustration", "Coverage", "Source page, creator and terms"], approved_rows),
    "<h2>Review-area totals</h2>",
    table(["Area", "Images", "Approved", "Partial", "Unresolved"], area_rows),
    "<h2>Inspected evidence across the requested subject types</h2><p>These source checks illustrate evidence and its limits. They do not replace individual records or make partial plates eligible.</p>",
    table(["Subject", "Illustration assessed", "Inspected scope", "Limit"], representative_rows),
    '<h2 id="checks">Browser checks and explicit verification limits</h2><ul>' + "".join(f"<li>{esc(t)}</li>" for t in qa) + "</ul>",
    "<h2>Corrections and source boundaries</h2><ul>" + "".join(f"<li>{esc(t)}</li>" for t in corrections) + "</ul>",
    f'<h2 id="unresolved">All {len(unresolved)} unresolved illustrations</h2>',
    table(["Illustration", "Individual reason"], [[esc(r["title"]), esc(r["reason"])] for r in unresolved]),
    f'<h2 id="unlinked">All {len(unlinked)} unlinked illustrations, including partial cases</h2><p>Partial means useful but insufficient candidates were found. Unresolved means no qualifying candidate set was established. Neither means a suitable photograph cannot exist.</p>',
    table(["Illustration and asset ID", "Outcome", "Individual reason"], [[esc(r["title"]) + f'<small>{esc(r["assetId"])}</small>', esc(r["status"]), esc(r["reason"])] for r in unlinked]),
    "<footer>Static audit snapshot: tables only, with no scripts, images, remote runtime or data requests. Source links open only when selected. Authoritative assessments and written evidence are under research/boneefied-photo-references.</footer>",
]
css = """*{box-sizing:border-box}body{margin:0;background:#f8f6f1;color:#242723;font:16px/1.55 Georgia,serif}main{max-width:1160px;margin:auto;padding:36px 22px 70px}h1{font-size:34px;line-height:1.15;max-width:760px}h2{font-size:25px;margin:40px 0 14px}p,li{max-width:86ch}a{color:#85451c;overflow-wrap:anywhere}a:focus-visible{outline:3px solid #85451c;outline-offset:3px}.status{border-left:5px solid #9a4826;padding:14px 18px;background:#eee4d9}.eyebrow{color:#555d55;font:12px system-ui,sans-serif;letter-spacing:.1em}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;background:#fff;font-size:14px}th,td{padding:13px 12px;vertical-align:top;text-align:left;border:1px solid #d8d8cf;overflow-wrap:anywhere}thead th{background:#e8e9df}small{display:block;color:#61695e;font:11px/1.5 system-ui,sans-serif;margin-top:6px}td p{margin:0 0 12px}nav{display:flex;gap:16px;flex-wrap:wrap;margin:24px 0}li{margin:10px 0}footer{margin-top:36px;color:#5c655a;font-size:13px}@media(max-width:600px){main{padding:22px 14px 48px}h1{font-size:28px}th,td{padding:10px 9px}table{min-width:620px}}@media print{body{background:white}main{padding:0}nav{display:none}table{font-size:10px}.table-wrap{overflow:visible}tr{break-inside:avoid}h2{break-after:avoid}}"""
document = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Boneefied real-photo reference audit</title><style>' + css + "</style></head><body><main>" + "".join(sections) + "</main></body></html>"
assert len(document.encode()) < 5_242_880
(ROOT / "final-report.html").write_text(document)

def mdcell(value):
    return str(value).replace("|", "/").replace("\n", " ")

md = ["# Boneefied real-photo references — inventory audit", "", f"Registry updated: {summary['checkedAt']}.", ""] + intro
md += ["", "## Approved illustrations", ""]
for r in approved:
    md += [f"### {r['title']} — {r['coverageKind']}", r["reason"]]
    md += [f"- {p['url']} — {p['creator']}; terms: {p['termsUrl']}" for p in r["references"]]
md += ["", "## Browser checks and limits", ""] + ["- " + t for t in qa]
md += ["", "## Corrections and source boundaries", ""] + ["- " + t for t in corrections]
md += ["", f"## All {len(unresolved)} unresolved illustrations", "", "| Illustration | Individual reason |", "|---|---|"]
md += [f"| {mdcell(r['title'])} | {mdcell(r['reason'])} |" for r in unresolved]
md += ["", f"## All {len(unlinked)} unlinked illustrations", "", "| Illustration / asset ID | Status | Individual reason |", "|---|---|---|"]
md += [f"| {mdcell(r['title'])} / {r['assetId']} | {r['status']} | {mdcell(r['reason'])} |" for r in unlinked]
(ROOT / "final-report.md").write_text("\n".join(md) + "\n")
print(json.dumps({"approved": len(approved), "unlinked": len(unlinked), "unresolved": len(unresolved), "htmlBytes": len(document.encode())}))
