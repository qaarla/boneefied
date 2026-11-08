/** Omit authoring-tool metadata only; never rewrite visible SVG geometry. */
export function renderableAtlasXml(xml: string): string {
  return xml
    .replace(/<metadata\b[^>]*>[\s\S]*?<\/metadata\s*>/g, '')
    .replace(/<(?:sodipodi:namedview|inkscape:perspective)\b[^>]*\/>/g, '')
    .replace(/<sodipodi:namedview\b[^>]*>[\s\S]*?<\/sodipodi:namedview\s*>/g, '')
    .replace(/\s+(?:(?:inkscape|sodipodi):[\w-]+|xmlns:(?!xlink\b)[\w-]+|data-[\w-]+)\s*=\s*(?:"[^"]*"|'[^']*')/g, '');
}
