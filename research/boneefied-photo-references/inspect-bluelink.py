"""Temporary visual comparison sheets; no external photos enter the project.

Source-page/photograph associations are retained as metadata. Images and sheets
are temporary research inspection material under /tmp, never app assets.
"""
import concurrent.futures
import html
import json
import pathlib
import re
import subprocess
import sys
import urllib.request

ROOT = pathlib.Path(__file__).parent
TEMP = pathlib.Path("/tmp/boneefied-source-inspection")
TEMP.mkdir(exist_ok=True)
BASE = "https://sites.google.com/a/umich.edu/bluelink/resources/bluelink/"


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read(), response.url


def inspect(slug):
    data, final = fetch(BASE + slug)
    text = data.decode()
    pairs = []
    for anchor in re.finditer(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>', text, re.S):
        dest = html.unescape(anchor[1])
        image = re.search(r'<img\b[^>]*src="([^"]+)"', anchor[2])
        if "drive.google.com/file/" in dest and image:
            src = html.unescape(image[1])
            if not any(item["imageUrl"] == src for item in pairs):
                pairs.append({"index": len(pairs) + 1, "imageUrl": src, "imagePage": dest})
    out = TEMP / slug
    out.mkdir(exist_ok=True)

    def thumb(item):
        target = out / f'{item["index"]:03}.jpg'
        try:
            if not target.exists():
                raw, _ = fetch(item["imageUrl"])
                target.write_bytes(raw)
            tile = out / f'{item["index"]:03}-tile.jpg'
            subprocess.run(["magick", str(target), "-auto-orient", "-thumbnail", "460x335",
                            "-background", "white", "-gravity", "center", "-extent", "460x370",
                            "-gravity", "south", "-fill", "black", "-font", "DejaVu-Sans",
                            "-pointsize", "18", "-annotate", "+0+4", str(item["index"]),
                            str(tile)], check=True, capture_output=True)
            return str(tile)
        except Exception as error:
            item["error"] = str(error)
            return None

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        tiles = list(pool.map(thumb, pairs))
    for start in range(0, len(tiles), 9):
        part = [tile for tile in tiles[start:start + 9] if tile]
        if part:
            sheet = out / f"sheet-{start // 9 + 1}.jpg"
            subprocess.run(["magick", "montage", "-font", "DejaVu-Sans", *part, "-tile", "3x", "-geometry", "+4+4",
                            str(sheet)], check=True, capture_output=True)
    meta = {"sourcePage": BASE + slug, "finalUrl": final, "photos": pairs}
    (ROOT / "source-pages" / f"bluelink-{slug}.json").write_text(json.dumps(meta, indent=2) + "\n")
    return f"{slug}: {len(pairs)} photographs; sheets in {out}"


with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for result in pool.map(inspect, sys.argv[1:]):
        print(result, flush=True)
