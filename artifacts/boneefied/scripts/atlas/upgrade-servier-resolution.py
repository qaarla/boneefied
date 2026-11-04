"""Recover the exact existing Servier artwork from its editable vector source.

Publisher thumbnails must match our existing file's pixels. A vector candidate
must also match that thumbnail before acceptance; otherwise leave it untouched.
"""
import concurrent.futures
import hashlib
import html
import json
import math
import pathlib
import re
import runpy
import subprocess
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parents[2]
STAGE = ROOT.parents[1] / 'generated-artifacts/image-resolution/servier'
STAGE.mkdir(parents=True, exist_ok=True)
extract = runpy.run_path(str(pathlib.Path(__file__).with_name('servier-vector-source.py')))['extract']


def get(url):
    return subprocess.check_output(['curl', '-fLsS', '--retry', '1', '--max-time', '40', url], stderr=subprocess.DEVNULL)


def pixels(file, small=False):
    args = ['magick']
    if str(file).endswith('.svg'):
        args += ['-density', '9.6' if small else '96', '-background', 'white']
    args += [str(file), '-background', 'white', '-alpha', 'remove', '-trim', '+repage']
    if small:
        args += ['-resize', '80x100!']
    args += ['-depth', '8', 'rgb:-']
    return subprocess.check_output(args, stderr=subprocess.DEVNULL)


def source_page(item, local, width, height):
    try:
        page = get(item['url']).decode()
        def meta(key):
            match = re.search(r'<meta property="' + re.escape(key) + r'" content="([^"]+)"', page)
            return html.unescape(match.group(1)) if match else None
        if (meta('og:image:width'), meta('og:image:height')) != (str(width), str(height)):
            return None
        image_url = meta('og:image')
        thumbnail = STAGE / ('thumbnail-' + str(item['id']) + '.png')
        thumbnail.write_bytes(get(image_url))
        if pixels(thumbnail) != pixels(local):
            return None
        deck = re.search(r'href="([^"]+\.pptx)"', page, re.I)
        return {'page': item['url'], 'thumbnail': image_url, 'deck': html.unescape(deck.group(1))} if deck else None
    except (subprocess.CalledProcessError, UnicodeError):
        return None


queries = {
    'elbow-joint': 'elbow', 'heart-anterior': 'heart',
    'stomach-section': 'stomach', 'kidney': 'kidney',
    'thyroid-anterior': 'thyroid', 'ovary': 'ovary', 'uterus': 'uterus',
    'male-reproductive': 'reproductive system', 'lymph-node-section': 'lymph',
    'respiratory-system': 'respiratory', 'pelvis': 'pelvis',
}
records = []
proof_file = ROOT / 'assets/images/anatomy/servier-resolution.json'
previous = {r['path']: r for r in json.loads(proof_file.read_text())['records']} if proof_file.exists() else {}
for stem, query in queries.items():
    local = ROOT / f'assets/images/anatomy/servier-{stem}.png'
    old = previous.get(str(local.relative_to(ROOT)), {})
    if old.get('result') == 'upgraded-exact-vector-source' and old['after']['sha256'] == hashlib.sha256(local.read_bytes()).hexdigest():
        records.append(old)
        continue
    width, height = map(int, subprocess.check_output(['identify', '-ping', '-format', '%w %h', str(local)]).split())
    if min(width, height) >= 2000:
        records.append({'path': str(local.relative_to(ROOT)), 'result': 'already-high-resolution'})
        continue
    print('Finding exact publisher source:', stem, flush=True)
    if old.get('deck'):
        source = {key: old[key] for key in ['page', 'thumbnail', 'deck']}
    else:
        search = json.loads(get('https://smart.servier.com/wp-json/wp/v2/search?' + urllib.parse.urlencode({'search': query, 'per_page': 100})))
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            matches = list(pool.map(lambda item: source_page(item, local, width, height), search))
        source = next((match for match in matches if match), None)
    if not source:
        records.append({'path': str(local.relative_to(ROOT)), 'result': 'no-exact-publisher-source-located'})
        continue
    deck_name = pathlib.Path(urllib.parse.urlparse(source['deck']).path).name
    deck = STAGE / deck_name
    if not deck.exists():
        deck.write_bytes(get(source['deck']))
    candidates = STAGE / (deck.stem + '-complete-primitives')
    if not candidates.exists():
        extract(deck, candidates)
    expected = pixels(local, True)
    scores = []
    for candidate in candidates.glob('*.svg'):
        try:
            actual = pixels(candidate, True)
            error = sum((a-b)**2 for a, b in zip(expected, actual)) / len(expected) / 255**2
            scores.append((error, candidate))
        except subprocess.CalledProcessError:
            pass
    score, candidate = min(scores, default=(1, None))
    record = {'path': str(local.relative_to(ROOT)), **source, 'comparisonMse': score,
              'license': 'Servier Medical Art, CC BY 4.0; existing attribution retained.',
              'before': {'width': width, 'height': height, 'sha256': hashlib.sha256(local.read_bytes()).hexdigest()}}
    if score > .003:
        record['result'] = 'no-faithful-vector-match'
        records.append(record)
        print(stem, record['result'], score, flush=True)
        continue
    # Preserve the old white/transparent border and its normalized anatomical
    # coordinate frame, not just the aspect of the trimmed illustration.
    box = subprocess.check_output(['magick', str(local), '-background', 'white', '-alpha', 'remove', '-format', '%@', 'info:']).decode()
    bw, bh, bx, by = map(int, re.fullmatch(r'(\d+)x(\d+)\+(\d+)\+(\d+)', box).groups())
    scale = max(2, math.ceil(2400 / max(width, height)))
    master = local.with_suffix('.svg')
    source_svg = candidate.read_text()
    # Retain the approved vector drawing as a source master; its PNG viewport
    # registration below is documented separately.
    master.write_text(source_svg)
    subprocess.check_call(['magick', '-density', str(96 * scale), '-background', 'white', str(master),
        '-trim', '+repage', '-resize', f'{bw*scale}x{bh*scale}!',
        '-background', 'white', '-gravity', 'NorthWest', '-splice', f'{bx*scale}x{by*scale}',
        '-extent', f'{width*scale}x{height*scale}', '-strip', str(local)], stderr=subprocess.DEVNULL)
    record.update({'result': 'upgraded-exact-vector-source', 'sourceGroup': candidate.name,
                   'registration': {'contentBox': [bw, bh, bx, by], 'scale': scale},
                   'after': {'width': width*scale, 'height': height*scale, 'sha256': hashlib.sha256(local.read_bytes()).hexdigest()}})
    records.append(record)
    print(stem, record['result'], score, flush=True)

(ROOT / 'assets/images/anatomy/servier-resolution.json').write_text(json.dumps({
    'method': 'Exact publisher thumbnail pixel match, then editable vector group recovery and registered high-resolution export. No tracing or anatomical redraw.',
    'records': records,
}, indent=2) + '\n')
