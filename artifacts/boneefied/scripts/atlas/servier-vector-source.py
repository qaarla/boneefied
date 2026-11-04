"""Extract editable Servier PowerPoint vector groups, not thumbnail pixels.

This intentionally supports only the DrawingML primitives present in the
approved source sets and raises for unsupported artwork rather than dropping it.
Run against a downloaded source deck; output is staging for visual comparison,
not automatically accepted artwork.
"""
import html
import pathlib
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}
THEME = {'dk1': '000000', 'lt1': 'FFFFFF', 'tx1': '000000', 'bg1': 'FFFFFF'}


def local(element):
    return element.tag.rsplit('}', 1)[-1]


def color(element, default='none'):
    if element is None:
        return default
    value = element.find('a:srgbClr', NS)
    if value is not None:
        return '#' + value.get('val')
    value = element.find('a:sysClr', NS)
    if value is not None:
        return '#' + value.get('lastClr')
    value = element.find('a:schemeClr', NS)
    if value is not None and value.get('val') in THEME:
        return '#' + THEME[value.get('val')]
    raise ValueError('Unsupported nonliteral color')


def transform(element, group=False):
    if element is None:
        return ''
    off = element.find('a:off', NS)
    ext = element.find('a:ext', NS)
    x, y = float(off.get('x')), float(off.get('y'))
    w, h = float(ext.get('cx')), float(ext.get('cy'))
    transforms = [f'translate({x} {y})']
    if element.get('rot') or element.get('flipH') or element.get('flipV'):
        transforms += [f'translate({w/2} {h/2})',
                       f'rotate({float(element.get("rot", 0))/60000})',
                       f'scale({-1 if element.get("flipH") == "1" else 1} {-1 if element.get("flipV") == "1" else 1})',
                       f'translate({-w/2} {-h/2})']
    if group:
        child_off = element.find('a:chOff', NS)
        child_ext = element.find('a:chExt', NS)
        transforms += [f'scale({w/float(child_ext.get("cx"))} {h/float(child_ext.get("cy"))})',
                       f'translate({-float(child_off.get("x"))} {-float(child_off.get("y"))})']
    return ' '.join(transforms)


def render(element, group_scale=1):
    kind = local(element)
    if kind == 'grpSp':
        xf = element.find('p:grpSpPr/a:xfrm', NS)
        ext, child_ext = xf.find('a:ext', NS), xf.find('a:chExt', NS)
        next_scale = group_scale * (float(ext.get('cx')) / float(child_ext.get('cx')) * float(ext.get('cy')) / float(child_ext.get('cy'))) ** .5
        return f'<g transform="{transform(xf, True)}">' + ''.join(
            render(child, next_scale) for child in element if local(child) in ['grpSp', 'sp', 'pic']) + '</g>'
    if kind == 'pic':
        raise ValueError('Group contains raster pictures')
    props = element.find('p:spPr', NS)
    xf = props.find('a:xfrm', NS)
    if xf is None:
        raise ValueError('Missing shape transform')
    ext = xf.find('a:ext', NS)
    width, height = float(ext.get('cx')), float(ext.get('cy'))
    solid = props.find('a:solidFill', NS)
    if props.find('a:gradFill', NS) is not None:
        raise ValueError('Gradient fill requires explicit support')
    fill = color(solid)
    line = props.find('a:ln', NS)
    stroke = color(line.find('a:solidFill', NS)) if line is not None else 'none'
    # DrawingML line widths stay in physical EMUs even inside a group whose
    # child coordinates use a smaller local coordinate system.
    stroke_width = float(line.get('w', 12700)) / group_scale if line is not None else 0
    geometry = props.find('a:custGeom', NS)
    paths = []
    if geometry is not None:
        for path in geometry.findall('a:pathLst/a:path', NS):
            commands = []
            for command in path:
                name = local(command)
                points = [f'{float(p.get("x"))},{float(p.get("y"))}' for p in command.findall('a:pt', NS)]
                if name in ['moveTo', 'lnTo', 'cubicBezTo', 'quadBezTo']:
                    commands.append({'moveTo': 'M', 'lnTo': 'L', 'cubicBezTo': 'C', 'quadBezTo': 'Q'}[name] + ' '.join(points))
                elif name == 'close':
                    commands.append('Z')
                else:
                    raise ValueError('Unsupported path command ' + name)
            pw, ph = float(path.get('w', width)), float(path.get('h', height))
            path_fill = 'none' if path.get('fill') == 'none' else fill
            path_stroke = 'none' if path.get('stroke') == '0' else stroke
            paths.append(f'<path transform="scale({width/pw} {height/ph})" d="{" ".join(commands)}" fill="{path_fill}" stroke="{path_stroke}" stroke-width="{stroke_width * pw/width}" stroke-linejoin="round"/>')
    else:
        preset = props.find('a:prstGeom', NS)
        name = preset.get('prst') if preset is not None else None
        if name == 'ellipse':
            paths.append(f'<ellipse cx="{width/2}" cy="{height/2}" rx="{width/2}" ry="{height/2}" fill="{fill}" stroke="{stroke}" stroke-width="{stroke_width}"/>')
        elif name == 'rect':
            paths.append(f'<rect width="{width}" height="{height}" fill="{fill}" stroke="{stroke}" stroke-width="{stroke_width}"/>')
        elif name == 'line':
            paths.append(f'<path d="M0,0 L{width},{height}" fill="none" stroke="{stroke}" stroke-width="{stroke_width}"/>')
        else:
            raise ValueError('Unsupported preset ' + str(name))
    return f'<g transform="{transform(xf)}">' + ''.join(paths) + '</g>'


def extract(deck, output):
    output.mkdir(parents=True, exist_ok=True)
    count = 0
    with zipfile.ZipFile(deck) as archive:
        theme = ET.fromstring(archive.read('ppt/theme/theme1.xml'))
        for entry in theme.findall('.//a:clrScheme/*', NS):
            if len(entry):
                THEME[local(entry)] = entry[0].get('val') or entry[0].get('lastClr')
        THEME.update({'tx1': THEME['dk1'], 'bg1': THEME['lt1'], 'tx2': THEME.get('dk2', '000000'), 'bg2': THEME.get('lt2', 'FFFFFF')})
        for name in archive.namelist():
            if not name.startswith('ppt/slides/slide') or not name.endswith('.xml'):
                continue
            root = ET.fromstring(archive.read(name))
            tree = root.find('p:cSld/p:spTree', NS)
            # Top-level illustration groups exclude slide titles and captions.
            for i, group in enumerate(tree.findall('p:grpSp', NS)):
                xf = group.find('p:grpSpPr/a:xfrm', NS)
                off, ext = xf.find('a:off', NS), xf.find('a:ext', NS)
                x, y, w, h = [float(v) for v in [off.get('x'), off.get('y'), ext.get('cx'), ext.get('cy')]]
                try:
                    drawing = render(group)
                except ValueError as error:
                    print(name, i, 'SKIPPED:', error)
                    continue
                svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="{1600*h/w}" viewBox="{x} {y} {w} {h}"><title>Servier Medical Art source group</title><desc>CC BY 4.0; extracted from the publisher’s editable PowerPoint. Not redrawn.</desc>{drawing}</svg>'
                (output / f'{pathlib.Path(name).stem}-group{i}.svg').write_text(svg)
                count += 1
    print('Extracted', count, 'vector candidates')


if __name__ == '__main__':
    extract(pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]))
