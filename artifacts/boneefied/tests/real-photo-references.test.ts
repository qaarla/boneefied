import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { canShowPhotoReferences, photoReferenceDescription, photoReferenceLabel, photoReferencesForAsset, tryOpenPhotoReference } from '../content/real-photo-references.ts';

const research = new URL('../../../research/boneefied-photo-references/', import.meta.url);
const records = JSON.parse(readFileSync(new URL('references.json', research), 'utf8'));
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('all 164 inventory illustrations have a named photographic companion without claiming all comparisons complete', () => {
  assert.equal(records.length, 164);
  assert.equal(new Set(records.map((row: { assetId: string }) => row.assetId)).size, 164);
  for (const record of records) {
    assert.ok(photoReferencesForAsset(record.assetId).length > 0, record.assetId);
  }
  const coverage = JSON.parse(readFileSync(new URL('photo-companion-coverage.json', research), 'utf8'));
  assert.equal(coverage.illustrationsWithInspectedPhotographs, 164);
  assert.equal(coverage.allIllustrationsHaveCompanions, true);
  assert.equal(coverage.buildAuthorized, false);
  assert.equal(coverage.allComparisonsComplete,
    records.every((row: { status: string }) => row.status === 'verified'));
});

test('selected-structure companions require actual human-image inspection evidence and original page links', () => {
  const companions = JSON.parse(readFileSync(new URL('photo-companions.json', research), 'utf8'));
  for (const row of companions) {
    assert.equal(row.completeComparison, false);
    assert.equal(row.coverage, 'selected-structures');
    for (const ref of row.references) {
      assert.equal(ref.organism, 'human');
      assert.equal(ref.verification.pageOpened, true);
      assert.equal(ref.verification.captionChecked, true);
      assert.equal(ref.verification.imageVisuallyInspected, true);
      assert.ok(ref.verification.checkedAt);
      assert.ok(existsSync(new URL(`../../../${ref.verification.evidencePath}`, import.meta.url)));
      assert.ok(ref.subject.en && ref.subject.es && ref.termsUrl);
      assert.ok(ref.url.startsWith('https://'));
      assert.doesNotMatch(ref.url, /^https:\/\/(?:upload\.wikimedia\.org|cdn\.ncbi\.nlm\.nih\.gov)\//);
    }
  }
});

test('runtime references equal approved comparisons or explicitly reviewed selected-structure companions', () => {
  const eligible = JSON.parse(readFileSync(new URL('verified-references.json', research), 'utf8'));
  const companionRows = JSON.parse(readFileSync(new URL('photo-companions.json', research), 'utf8'));
  const companionById = new Map(companionRows.map((row: { assetId: string }) => [row.assetId, row]));
  assert.equal(eligible.length, records.filter((record: { status: string }) => record.status === 'verified').length);
  assert.ok(eligible.length > 0);
  for (const record of records) {
    const references = photoReferencesForAsset(record.assetId);
    if (record.status !== 'verified') {
      const companion = companionById.get(record.assetId) as { completeComparison: boolean; references: { url: string; mediaType: string }[] } | undefined;
      if (!companion) {
        assert.equal(references.length, 0, record.assetId);
        continue;
      }
      assert.equal(companion.completeComparison, false);
      assert.deepEqual(references.map(({ url, mediaType }) => ({ url, mediaType })),
        companion.references.map(({ url, mediaType }) => ({ url, mediaType })));
      assert.ok(references.every(ref => ref.coverage === 'selected-structures'));
      assert.ok(references.every(ref => photoReferenceDescription(ref, 'en').includes('Selected structures only')));
      assert.ok(references.every(ref => photoReferenceDescription(ref, 'es').includes('Solo estructuras seleccionadas')));
      continue;
    }
    assert.deepEqual(references.map(({ url, mediaType }) => ({ url, mediaType })),
      record.references.map(({ url, mediaType }: { url: string; mediaType: string }) => ({ url, mediaType })));
    references.forEach((reference, index) => {
      assert.equal(reference.sourceName, record.references[index].sourceName ?? 'Wikimedia Commons');
      assert.ok(reference.sourceName.trim());
    });
    if (references.length > 1) {
      assert.equal(new Set(references.map((reference) => reference.subject?.en)).size, references.length);
      assert.equal(new Set(references.map((reference) => reference.subject?.es)).size, references.length);
      assert.ok(references.every((reference) => reference.subject?.en && reference.subject?.es));
    }
    if (record.coverageKind === 'relevant-example') {
      assert.ok(references.every((reference) => reference.subject?.en && reference.subject?.es));
      references.forEach((reference, index) => assert.deepEqual(reference.subject, record.references[index].subject));
    }
  }
  assert.deepEqual(photoReferencesForAsset(undefined), []);
  assert.deepEqual(photoReferencesForAsset('unlisted'), []);
  assert.deepEqual(photoReferencesForAsset('toString'), []);
});

test('practice is fail-closed until submission/reveal, even if all local marker labels were toggled', () => {
  assert.equal(canShowPhotoReferences('practice', false, false), false);
  assert.equal(canShowPhotoReferences('practice', false, true), false);
  assert.equal(canShowPhotoReferences('practice', true, false), true);
  assert.equal(canShowPhotoReferences('practice', true, true), true);
});

test('learning is available; active/partially answered Recall is hidden; full reveal enables the option', () => {
  assert.equal(canShowPhotoReferences('learn', false, false), true);
  assert.equal(canShowPhotoReferences('recall', false, false), false);
  assert.equal(canShowPhotoReferences('recall', false, true), true);
  assert.equal(canShowPhotoReferences('recall', true, false), true);
});

test('English and Spanish keep hyperlinks short and move source, named views and limits into separate context', () => {
  const gross = photoReferencesForAsset('asset-skeletal-atlas-skull-base-external')[0]!;
  const micro = photoReferencesForAsset('asset-commons-kidney-cortex-human')[0]!;
  assert.equal(photoReferenceLabel(gross, 'en'), 'Real photo');
  assert.equal(photoReferenceLabel(gross, 'es'), 'Foto real');
  assert.equal(photoReferenceLabel({ ...gross, subject: undefined }, 'en'), 'Real photo');
  assert.equal(photoReferenceLabel(micro, 'en'), 'Microscope photo');
  assert.equal(photoReferenceLabel(micro, 'es'), 'Foto al microscopio');
  const imaging = { ...gross, mediaType: 'diagnostic-imaging' as const };
  assert.equal(photoReferenceLabel(imaging, 'en'), 'Medical image');
  assert.equal(photoReferenceLabel(imaging, 'es'), 'Imagen médica');
  assert.equal(photoReferenceDescription(gross, 'en'), `${gross.subject!.en} · Wikimedia Commons`);
  assert.equal(photoReferenceDescription(gross, 'es'), `${gross.subject!.es} · Wikimedia Commons`);
  assert.equal(photoReferenceDescription({ ...gross, subject: undefined }, 'en'), 'Wikimedia Commons');
  assert.match(photoReferenceDescription({ ...gross, subject: { en: 'Anterior view', es: 'Vista anterior' } }, 'es'), /Vista anterior/);
  assert.match(photoReferenceDescription({ ...gross, coverage: 'selected-structures' }, 'en'), /^Selected structures only · /);
  assert.match(photoReferenceDescription({ ...gross, coverage: 'selected-structures' }, 'es'), /^Solo estructuras seleccionadas · /);
});

test('outbound open uses the exact URL, catches failures and allows a subsequent retry', async () => {
  const url = photoReferencesForAsset('asset-commons-kidney-cortex-human')[0]!.url;
  const attempts: string[] = [];
  assert.equal(await tryOpenPhotoReference(url, async (destination) => {
    attempts.push(destination); throw new Error('No browser');
  }), false);
  assert.equal(await tryOpenPhotoReference(url, async (destination) => { attempts.push(destination); }), true);
  assert.deepEqual(attempts, [url, url]);
  assert.equal(await tryOpenPhotoReference('javascript:alert(1)', async () => assert.fail('must not open')), false);
});

test('one shared footer covers learning, lessons, glossary and submitted practice without a route/state mutation', () => {
  const viewer = read('../components/AnatomyImageViewer.tsx');
  const module = read('../app/(tabs)/(study)/module/[id].tsx');
  const glossary = read('../app/(tabs)/(study)/glossary/[id].tsx');
  const practice = read('../app/(tabs)/practice.tsx');
  const links = read('../components/PhotoReferenceLinks.tsx');
  assert.equal((module.match(/photoReferenceMode=\{mode\}/g) ?? []).length, 3);
  assert.match(glossary, /photoReferenceMode="learn"/);
  assert.match(practice, /revealLabels=\{disabled\}/);
  assert.match(viewer, /photoReferenceMode = 'practice'/);
  assert.match(viewer, /photoReferenceMode, revealLabels \|\| submitted/);
  assert.ok(viewer.indexOf('<PhotoReferenceLinks') > viewer.indexOf('{caption ?'));
  assert.match(links, /accessibilityRole="link"/);
  assert.match(links, /photoReferenceDescription\(reference, language\)/);
  assert.match(links, /styles\.description/);
  assert.match(links, /minHeight: 44/);
  assert.match(links, /href: reference.url/);
  assert.match(links, /Linking.openURL\(destination\)/);
  assert.match(links, /failedUrl === reference.url/);
  assert.match(links, /navigator.onLine === false/);
  assert.doesNotMatch(links, /useRouter|router\.|WebView|fetch\(|AsyncStorage|useEffect|AppState/);
});
