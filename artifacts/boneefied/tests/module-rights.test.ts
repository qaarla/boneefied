import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { content } from '../content/canonical.ts';
import { collectModuleRights, conciseVisualCredit } from '../content/module-rights.ts';

test('all modules retain full registered sources and all lesson / Practice attribution', () => {
  for (const module of content.modules) {
    const result = collectModuleRights(content, module);
    assert.equal(new Set(result.assets.map((a) => a.id)).size, result.assets.length);
    for (const id of module.sourceIds) {
      if (content.sources.some((s) => s.id === id)) assert.ok(result.sources.some((s) => s.id === id), `${module.id}: ${id}`);
    }
    const expected = new Set([
      ...(module.lessons ?? []).flatMap((l) => l.assetIds ?? []),
      ...content.questions.filter((q) => q.moduleId === module.id).flatMap((q) => q.assetId ? [q.assetId] : []),
    ]);
    for (const asset of content.assets.filter((a) => expected.has(a.id))) {
      assert.ok(result.assets.includes(asset), asset.id);
      assert.ok(result.sources.some((s) => s.id === asset.sourceId), asset.sourceId);
    }
  }
});

test('gallery-only images include their complete metadata and source, once', () => {
  const module = content.modules[0], asset = content.assets[0];
  const result = collectModuleRights(content, module, [asset.id, asset.id]);
  assert.equal(result.assets.filter((a) => a.id === asset.id).length, 1);
  assert.equal(result.assets.find((a) => a.id === asset.id), asset);
  assert.ok(result.sources.some((s) => s.id === asset.sourceId));
});

test('concise credits keep named creators, licenses and modification indications', () => {
  const servier = conciseVisualCredit('Adapted from Servier Medical Art (https://smart.servier.com), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: labels/targets added by Boneefied.');
  assert.match(servier, /Servier Medical Art/);
  assert.match(servier, /CC BY 4.0/);
  assert.match(servier, /Annotated by Boneefied/);
  assert.doesNotMatch(servier, /https?:/);
  const gray = 'Public domain; Henry Vandyke Carter / Henry Gray, via Wikimedia Commons';
  assert.equal(conciseVisualCredit(gray), gray);
  assert.doesNotMatch(conciseVisualCredit('CC BY 4.0. Open source and rights page.'), /Open source/);
});

test('disclosure is collapsed, accessible and between lessons and final actions on the shared module route', () => {
  const module = readFileSync(new URL('../app/module/[id].tsx', import.meta.url), 'utf8');
  const disclosure = readFileSync(new URL('../components/ModuleSourcesDisclosure.tsx', import.meta.url), 'utf8');
  assert.ok(module.indexOf('<ModuleSourcesDisclosure') > module.indexOf('{lessons.map'));
  assert.ok(module.indexOf('<ModuleSourcesDisclosure') < module.indexOf('router.push(`/(tabs)/practice?'));
  assert.doesNotMatch(module, /<AdaptiveCard style=\{\[styles.sources/);
  assert.equal((module.match(/compactRights \/>/g) ?? []).length, 3);
  assert.match(disclosure, /useState\(false\)/);
  assert.match(disclosure, /accessibilityRole="button"/);
  assert.match(disclosure, /accessibilityState=\{\{ expanded \}\}/);
  assert.match(disclosure, /'aria-expanded': expanded/);
  assert.match(disclosure, /expanded &&/);
  assert.match(disclosure, /source.attributionLicenseStatus/);
  assert.match(disclosure, /asset.adaptationNote/);
  assert.doesNotMatch(disclosure, /split\(';'\)/);
});
