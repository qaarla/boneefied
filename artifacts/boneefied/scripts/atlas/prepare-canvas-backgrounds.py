"""Background-only display copies. Never overwrite an anatomical source.

Run from the workspace root. Only border-connected, exactly white paper is
changed. Enclosed whites and every nonwhite pixel are retained. On the historic
vertebral scan, close small ink gaps before classifying paper to protect bone
interiors; this protection mask is never painted into the output.
"""
from pathlib import Path
import hashlib
import json
import subprocess
from collections import deque

WORKSPACE = Path(__file__).resolve().parents[4]
APP = WORKSPACE / "artifacts/boneefied"
OUTPUT = APP / "assets/images/anatomy/soft-canvas"
PAPER = (236, 234, 226)
SOURCES = [
    ("original-cell-overview.png", 1),
    ("original-anatomical-planes.png", 1),
    ("gray111-vertebral-column.png", 5),
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def prepare(name, closing):
    source = APP / "assets/images/anatomy" / name
    w, h = map(int, subprocess.check_output(["magick", "identify", "-format", "%w %h", str(source)]).split())
    original = subprocess.check_output(["magick", str(source), "-alpha", "off", "-depth", "8", "rgb:-"])
    pixels = [tuple(original[i:i + 3]) for i in range(0, len(original), 3)]
    # White is not a global color key: only reachable exterior paper qualifies.
    barrier = bytes(0 if p == (255, 255, 255) else 255 for p in pixels)
    if closing > 1:
        barrier = subprocess.run(
            ["magick", "-size", f"{w}x{h}", "-depth", "8", "gray:-",
             "-morphology", "Close", f"Square:{closing // 2}", "-depth", "8", "gray:-"],
            input=barrier, stdout=subprocess.PIPE, check=True).stdout
    reachable = bytearray(barrier)
    queue = deque()
    for x, y in ([(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)]
                 + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]):
        index = y * w + x
        if reachable[index] == 0:
            reachable[index] = 128
            queue.append(index)
    while queue:
        index = queue.popleft()
        x, y = index % w, index // w
        neighbors = []
        if x: neighbors.append(index - 1)
        if x + 1 < w: neighbors.append(index + 1)
        if y: neighbors.append(index - w)
        if y + 1 < h: neighbors.append(index + w)
        for other in neighbors:
            if reachable[other] == 0:
                reachable[other] = 128
                queue.append(other)
    mask = [p == (255, 255, 255) and m == 128
            for p, m in zip(pixels, reachable)]
    updated = [PAPER if change else p for p, change in zip(pixels, mask)]
    assert all(a == b for a, b in zip(pixels, updated) if a != (255, 255, 255))
    # Interior white vertebral bodies must not be reclassified as paper.
    bone_probes = []
    if name.startswith("gray111"):
        for x, y in [(150, 240), (146, 275), (150, 305), (150, 333),
                     (143, 365), (139, 400), (139, 430), (128, 460),
                     (123, 495), (113, 535), (107, 575), (96, 617),
                     (101, 650), (124, 700)]:
            if pixels[y * w + x] == (255, 255, 255):
                assert not mask[y * w + x], f"Bone interior changed at {(x, y)}"
                bone_probes.append([x, y])
    OUTPUT.mkdir(parents=True, exist_ok=True)
    destination = OUTPUT / name
    subprocess.run(["magick", "-size", f"{w}x{h}", "-depth", "8", "rgb:-",
                    "-define", "png:color-type=2", str(destination)],
                   input=bytes(channel for pixel in updated for channel in pixel), check=True)
    decoded = subprocess.check_output(["magick", str(destination), "-depth", "8", "rgb:-"])
    assert decoded == bytes(channel for pixel in updated for channel in pixel)
    return {
        "original": str(source.relative_to(APP)),
        "displayCopy": str(destination.relative_to(APP)),
        "dimensions": [w, h],
        "originalSha256": sha(source),
        "displaySha256": sha(destination),
        "backgroundPixelsChanged": sum(mask),
        "nonwhitePixelsChanged": 0,
        "enclosedOrProtectedWhitePixels": sum(p == (255, 255, 255) and not m for p, m in zip(pixels, mask)),
        "protectedBoneProbes": bone_probes,
        "classificationOnlyClosingSize": closing,
    }


def main():
    rows = [prepare(*source) for source in SOURCES]
    inventory = json.loads((WORKSPACE / "research/atlas-zoom-source-audit.json").read_text())
    originals = inventory["rows"]
    # Prove the existing scientific masters and source images stayed untouched.
    for row in originals:
        assert sha(APP / row["activeRequire"]) == row["rasterSha256"], row["id"]
        if row["vectorMaster"]:
            assert sha(APP / row["vectorMaster"]) == row["vectorSha256"], row["id"]
    report = {
        "canvas": "#ECEAE2",
        "activeIllustrations": len(originals),
        "vectorMastersUnchanged": sum(bool(r["vectorMaster"]) for r in originals),
        "protectedPhotographicSourcesUnchanged": 6,
        "method": "Global viewer paper; three background-only bitmap display copies. No overlay, global tint, recoloring of vector art or photo retouching.",
        "displayCopies": rows,
    }
    (WORKSPACE / "research/atlas-canvas-backgrounds.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
