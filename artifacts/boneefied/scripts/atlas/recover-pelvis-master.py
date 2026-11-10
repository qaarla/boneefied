"""Recover the existing pelvis illustration from the publisher's real vectors.

The publisher thumbnail was previously verified against the original 256x294
PNG. Automated thumbnail MSE rejected this extraction (0.0133); a side-by-side
anatomical review confirms the same drawing and all seven existing target
regions. Keep that distinction explicit, not a looser automatic match rule.
"""
import hashlib
import json
from pathlib import Path
import re
import runpy
import subprocess
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT.parents[1] / "generated-artifacts/image-resolution/servier"
ASSETS = ROOT / "assets/images/anatomy"
DECK_URL = "https://smart.servier.com/wp-content/uploads/2016/10/SMART-Bone-fractures.pptx"
DECK_SHA = "ac4c025fb10d77fdfadd53d72f8b61dab02ce14addd48213a530a8daf0781be2"


def recover():
    STAGE.mkdir(parents=True, exist_ok=True)
    deck = STAGE / "SMART-Bone-fractures.pptx"
    if not deck.exists():
        urllib.request.urlretrieve(DECK_URL, deck)
    assert hashlib.sha256(deck.read_bytes()).hexdigest() == DECK_SHA, "Publisher deck changed; review required"
    extracted = STAGE / "SMART-Bone-fractures-complete-primitives"
    if not (extracted / "slide7-group2.svg").exists():
        runpy.run_path(str(Path(__file__).with_name("servier-vector-source.py")))["extract"](deck, extracted)
    original = (extracted / "slide7-group2.svg").read_text()
    assert not re.search(r"<image\b|data:image", original), "Not a true vector master"
    box = [float(n) for n in re.search(r'viewBox="([^"]+)"', original)[1].split()]
    x, y, width, height = box
    body = original[original.index(">") + 1:original.rfind("</svg>")]
    # Preserve the OLD PNG's complete normalized coordinate frame and aspect.
    # Never substitute this group's narrower natural viewBox in the viewer.
    xml = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="294" viewBox="0 0 256 294">'
        '<title>Pelvis — original Servier Medical Art</title>'
        '<desc>CC BY 4.0. Recovered from the publisher editable source; '
        'mapped to the existing Boneefied image coordinate frame.</desc>'
        f'<g transform="scale({256/width:.14g} {294/height:.14g}) translate({-x:.14g} {-y:.14g})">'
        + body + "</g></svg>"
    )
    master = ASSETS / "servier-pelvis.svg"
    master.write_text(xml)
    # Actual vector rasterization at 10x density, not enlargement of the PNG.
    subprocess.run(["magick", "-density", "960", "-background", "white",
                    str(master), "-strip", str(ASSETS / "servier-pelvis.png")], check=True)
    proof = {
        "assetId": "asset-servier-pelvis",
        "sourcePage": "https://smart.servier.com/smart_image/pelvis-overview/",
        "publisherDeck": DECK_URL, "publisherDeckSha256": DECK_SHA,
        "sourceGroup": "slide7-group2", "license": "CC BY 4.0; existing visible attribution retained",
        "originalThumbnailSha256": "56b526821c7eb4e0f3422ce525bab00a910e3b05a363e21382510f594df29a8b",
        "originalFrame": [256, 294], "pngExport": [2560, 2940],
        "vectorSha256": hashlib.sha256(master.read_bytes()).hexdigest(),
        "pngSha256": hashlib.sha256((ASSETS / "servier-pelvis.png").read_bytes()).hexdigest(),
        "review": "Side-by-side source/candidate and seven existing anatomical target regions inspected; no target coordinates changed.",
        "automaticThumbnailMse": 0.013300434448289121,
        "automaticMatchAccepted": False,
        "manualAnatomicalMatchAccepted": True,
        "lowResolutionImageUpscaled": False,
    }
    (ASSETS / "pelvis-vector-recovery.json").write_text(json.dumps(proof, indent=2) + "\n")
    print(json.dumps(proof, indent=2))


if __name__ == "__main__":
    recover()
