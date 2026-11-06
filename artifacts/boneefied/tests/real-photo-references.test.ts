import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { canShowPhotoReferences, photoReferenceLabel, photoReferencesForAsset, tryOpenPhotoReference } from '../content/real-photo-references.ts';

const research = new URL('../../../research/boneefied-photo-references/', import.meta.url);
const records = JSON.parse(readFileSync(new URL('references.json', research), 'utf8'));
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('the runtime allowlist equals every verified research mapping, including exact pages and media', () => {
  const eligible = JSON.parse(readFileSync(new URL('verified-references.json', research), 'utf8'));
  assert.equal(eligible.length, records.filter((record: { status: string }) => record.status === 'verified').length);
  assert.ok(eligible.length > 0);
  for (const record of records) {
    const references = photoReferencesForAsset(record.assetId);
    if (record.status !== 'verified') {
      assert.equal(references.length, 0, record.assetId);
      continue;
    }
    assert.deepEqual(references.map(({ url, mediaType }) => ({ url, mediaType })),
      record.references.map(({ url, mediaType }: { url: string; mediaType: string }) => ({ url, mediaType })));
    assert.ok(references.every((reference) => reference.sourceName === 'Wikimedia Commons'));
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

test('English and Spanish distinguish photos, microscope photos and imaging, with named comparison views', () => {
  const gross = photoReferencesForAsset('asset-skeletal-atlas-skull-base-external')[0]!;
  const micro = photoReferencesForAsset('asset-commons-kidney-cortex-human')[0]!;
  assert.equal(photoReferenceLabel(gross, 'en'), 'See real photo · Wikimedia Commons');
  assert.equal(photoReferenceLabel(gross, 'es'), 'Ver foto real · Wikimedia Commons');
  assert.equal(photoReferenceLabel(micro, 'en'), 'See real photo (microscope) · Wikimedia Commons');
  assert.equal(photoReferenceLabel(micro, 'es'), 'Ver foto real (microscopio) · Wikimedia Commons');
  const imaging = { ...gross, mediaType: 'diagnostic-imaging' as const };
  assert.match(photoReferenceLabel(imaging, 'en'), /^See medical imaging/);
  assert.match(photoReferenceLabel(imaging, 'es'), /^Ver imagen médica/);
  assert.match(photoReferenceLabel({ ...gross, subject: { en: 'Anterior view', es: 'Vista anterior' } }, 'es'), /Vista anterior/);
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
  assert.match(links, /minHeight: 44/);
  assert.match(links, /href: reference.url/);
  assert.match(links, /Linking.openURL\(destination\)/);
  assert.match(links, /failedUrl === reference.url/);
  assert.match(links, /navigator.onLine === false/);
  assert.doesNotMatch(links, /useRouter|router\.|WebView|fetch\(|AsyncStorage|useEffect|AppState/);
});
