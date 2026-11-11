import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const viewer = readFileSync(new URL('../components/AnatomyImageViewer.tsx', import.meta.url), 'utf8');
const highlight = readFileSync(new URL('../components/PracticeSelectionHighlight.tsx', import.meta.url), 'utf8');

test('fitted jaw paint is plate-specific, noninteractive and lightly outlined', () => {
  assert.match(highlight, /assetId === 'asset-commons-axial-skeleton-blank' && structureId === 'mandible'/);
  assert.match(highlight, /pointerEvents="none"/);
  assert.match(highlight, /fillOpacity=\{0\.06\}/);
  assert.match(highlight, /strokeWidth=\{1\.25\} vectorEffect="non-scaling-stroke"/);
  assert.doesNotMatch(highlight, /onPress|onTouch|radius:|score/);
  assert.match(viewer, /!questionHotspotCallouts && hasFittedPracticeHighlight/);
});

test('smaller paint leaves the original hit geometry and selection handler intact', () => {
  assert.match(viewer, /onPress=\{\(\) => \{ if \(gesture\.canPress\(\)\) onHotspotPress\?\.\(hotspot\); \}\}/);
  assert.match(viewer, /disabled=\{!onHotspotPress \|\| submitted\}/);
  assert.match(viewer, /left: position\.x - position\.width \/ 2, top: position\.y - position\.height \/ 2, width: position\.width, height: position\.height/);
  assert.match(viewer, /!questionHotspotCallouts && \{ width: Math\.min\(position\.width, 20\)/);
  assert.match(viewer, /backgroundColor: 'transparent' \}\]\}/);
});

test('the fitted paint shares image containment and the existing zoom/pan scene', () => {
  assert.ok(viewer.indexOf('testID="viewer-plate"') < viewer.indexOf('<PracticeSelectionHighlight'));
  assert.match(viewer, /left=\{\(1 - containedWidth\) \* canvasSize\.width \/ 2\}/);
  assert.match(viewer, /top=\{\(1 - containedHeight\) \* layoutHeight \/ 2\}/);
  assert.match(viewer, /width=\{containedWidth \* canvasSize\.width\} height=\{containedHeight \* layoutHeight\}/);
  assert.match(viewer, /fittedHighlight \? null : feedback/);
});
