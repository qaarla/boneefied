"""Grouped metadata review. Never downloads, stores or embeds source photographs."""
import concurrent.futures
import datetime
import hashlib
import html
import json
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
WORKSPACE = ROOT.parents[1]


def load(name):
    return json.loads((ROOT / name).read_text())


def save(name, data):
    (ROOT / name).write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def initialize():
    inventory, records = load("inventory.json"), load("references.json")
    assert {a["id"] for a in inventory["assets"]} == {r["assetId"] for r in records}
    hashes = load("original-image-hashes.json")
    for asset, item in hashes.items():
        assert hashlib.sha256((WORKSPACE / "artifacts/boneefied" / item["path"]).read_bytes()).hexdigest() == item["sha256"], asset
    if (ROOT / "grouped-review-ledger.json").exists():
        return
    groups = {}
    for asset in inventory["assets"]:
        use = next((u for u in asset["exampleUses"] if u.startswith(("gallery:", "lesson:"))), "")
        group = use.split(":")[1] if use else "cross-system"
        groups.setdefault(group, {"assetIds": [], "state": "pending", "attempts": [], "residuals": []})["assetIds"].append(asset["id"])
    for name, group in groups.items():
        rows = [r for r in records if r["assetId"] in group["assetIds"]]
        sources = sorted({p["url"] for r in rows for p in r["references"]})
        group["existingSources"] = sources
        group["existingEvidence"] = sorted({p["verification"]["evidencePath"] for r in rows for p in r["references"]})
    save("grouped-review-ledger.json", {
        "inventoryReconciledAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "scope": "Boneefied only; 164 published assets, not Contract B",
        "baseline": {"total": len(records), "verified": sum(r["status"] == "verified" for r in records),
                     "originalImageHashesConfirmed": len(hashes)},
        "policy": "Reuse inspected source photographs first. One primary collection and one different fallback per group; further queries require a named missing structure/view and a plausible new source. No result is not no equivalent.",
        "knownFailuresDoNotRepeat": [
            {"source": "Genoa histology", "outcome": "Explicit deep-link restriction; excluded, not absent anatomy"},
            {"source": "Histology Guide restricted collection", "outcome": "Excluded by existing source policy"},
            {"source": "Columbia slide66 command-line TLS", "outcome": "TLS validation failed; existing browser inspection retained; do not disable validation or repeat curl"},
            {"source": "Calisphere refreshes returning HTTP 429", "outcome": "Retain prior evidence, no repeated refresh loop"},
            {"source": "BlueLink Drive photo 1eei1xImkmeQ1POH1lGj1SNdtID2OugGd", "outcome": "Screenshot service did not render; use public university subject page, not retrying Drive"},
            {"source": "Prior individual axial-MRI Commons searches", "outcome": "No-result queries were already attempted; reuse established axial MRI, no query rewording"}
        ],
        "groups": groups
    })
    print("Reconciled once:", len(records), "published images;", len(groups), "subject groups;", sum(r["status"] == "verified" for r in records), "already approved")


def collect_duke(paths):
    filename = "duke-grouped-source-metadata.json"
    metadata = load(filename) if (ROOT / filename).exists() else {}
    def one(path):
        if path in metadata:
            return path, metadata[path]
        url = "https://histology.oit.duke.edu/" + path
        try:
            with urllib.request.urlopen(url, timeout=35) as response:
                raw = response.read().decode("latin1")
                final, status = response.url, response.status
            links = []
            for m in re.finditer(r'href="(https://www\.digitalscope\.org/ViewerUI/[^"]+)"', raw):
                before = re.sub(r"\s+", " ", html.unescape(re.sub("<[^>]+>", " ", raw[max(0, m.start()-350):m.start()])))
                after = re.sub(r"\s+", " ", html.unescape(re.sub("<[^>]+>", " ", raw[m.end():m.end()+2400])))
                if not any(p["viewer"] == m[1] for p in links):
                    links.append({"viewer": m[1], "captionContext": before[-280:], "descriptionContext": after[:1800]})
            text = re.sub(r"\s+", " ", html.unescape(re.sub("<[^>]+>", " ", raw)))
            return path, {"url": url, "finalUrl": final, "status": status, "slides": links,
                          "pageText": text, "imageInspection": "Metadata collection only; no photograph inspection implied"}
        except Exception as error:
            return path, {"url": url, "error": str(error), "doNotRepeat": True}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        metadata.update(dict(pool.map(one, paths)))
    save(filename, metadata)
    for path in paths:
        data = metadata[path]
        print("\nCOLLECTION", path, data.get("status", data.get("error")))
        for slide in data.get("slides", []):
            if "human" in slide["captionContext"].lower():
                print(slide["captionContext"][-180:], slide["viewer"])


if __name__ == "__main__":
    import sys
    initialize()
    if len(sys.argv) > 1:
        collect_duke(sys.argv[1:])
