"""Index public source-page metadata, never photographs or image bytes."""
import concurrent.futures
import html
import json
import re
import sys
import time
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin

BASE = "https://tales.nmc.unibas.ch"
ROOT = Path(__file__).parent


def get(url):
    request = urllib.request.Request(url, headers={"User-Agent": "Boneefied-reference-research/1.0"})
    return urllib.request.urlopen(request, timeout=30).read().decode()


class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.ignore = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.ignore += 1
        if tag in ("p", "div", "h1", "h2", "h3", "li", "br", "td"):
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.ignore = max(0, self.ignore - 1)

    def handle_data(self, data):
        if not self.ignore:
            self.parts.append(data)


def extract(url, title):
    try:
        source = get(url)
        main = re.search(r'<main\b[^>]*>([\s\S]*?)</main>', source)
        if main:
            source = main.group(1)
        parser = Text()
        parser.feed(source)
        lines = [" ".join(line.split()) for line in "".join(parser.parts).splitlines()]
        text = "\n".join(line for line in lines if line)
        # The menu repeats every lesson before the specimen's own page content.
        start = text.find("Species")
        if start < 0:
            start = text.rfind(title)
        article = text[max(start, 0):]
        end = article.find("Authors")
        if end >= 0:
            article = article[:end]
        return {"url": url, "title": title, "sourceText": article[:24000],
                "metadataOnly": True, "imageInspected": False}
    except Exception as error:
        return {"url": url, "title": title, "error": str(error),
                "metadataOnly": True, "imageInspected": False}
    finally:
        time.sleep(.4)


if "--compact" in sys.argv:
    path = ROOT / "basel-source-index.json"
    records = json.loads(path.read_text())
    for record in records:
        text = record.get("sourceText", "")
        start = text.find("\nSpecimen Details:")
        if start < 0:
            start = text.find("\nOrgan:")
        if start >= 0:
            record["sourceText"] = text[start:].split("\nDownloads")[0].strip()
        record["title"] = re.sub(r"\s+Text$", "", record["title"])
    path.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
    print("Compacted", len(records), "existing metadata records without network requests.")
    sys.exit()

source = get(BASE + "/en/histology-12/")
links = {}
for path, label in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', source, re.S):
    if path.startswith("/en/histology-12/") and len(path.strip("/").split("/")) == 4:
        title = " ".join(html.unescape(re.sub("<[^>]*>", " ", label)).split())
        title = re.sub(r"^\d+\.\d+\s+", "", title)
        title = re.sub(r"\s+Text$", "", title)
        links[urljoin(BASE, path)] = title

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    records = list(pool.map(lambda item: extract(*item), links.items()))
output = ROOT / "basel-source-index.json"
output.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
for record in records:
    print(record["title"], "|", record.get("sourceText", record.get("error", ""))[:180])
print("Source-page metadata indexed:", len(records), "Photographs downloaded: 0")
