import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('./', import.meta.url);
const load = name => JSON.parse(readFileSync(new URL(name, root), 'utf8'));
const inventory = load('inventory.json');
const records = load('references.json');
const expectedIds = new Set(inventory.assets.map(asset => asset.id));
const actualIds = new Set(records.map(record => record.assetId));
assert.equal(actualIds.size, records.length, 'Duplicate per-illustration records');
assert.equal(actualIds.size, expectedIds.size, 'Record count differs from published inventory');
for (const id of expectedIds) assert.ok(actualIds.has(id), `Missing record: ${id}`);

const counts = { verified: 0, partial: 0, unresolved: 0 };
for (const record of records) {
  assert.ok(expectedIds.has(record.assetId), `Unknown asset: ${record.assetId}`);
  assert.ok(record.status in counts, `Invalid outcome: ${record.assetId}`);
  counts[record.status]++;
  assert.ok(record.title && record.reason, `Missing description/outcome: ${record.assetId}`);
  assert.ok(Array.isArray(record.references), `Missing reference list: ${record.assetId}`);
  if (record.status === 'verified') assert.ok(record.references.length, `No verified page: ${record.assetId}`);
  for (const ref of record.references) {
    const url = new URL(ref.url);
    assert.ok(['https:', 'http:'].includes(url.protocol), `Not an external page: ${record.assetId}`);
    assert.ok(!/^(?:upload|thumb)\.wikimedia\.org$/.test(url.hostname), `Raw image, not source page: ${record.assetId}`);
    assert.ok(!/histologyguide\.(?:com|org)$/.test(url.hostname), 'Excluded bulk source');
    assert.ok(!/\/(?:search|Special:Search)(?:[/?]|$)/i.test(url.pathname), 'Search-result fallback');
    for (const key of ['title', 'source', 'creator', 'mediaType', 'organism', 'relationship', 'matches', 'linkingTerms', 'reproductionRights']) {
      assert.ok(typeof ref[key] === 'string' && ref[key].trim(), `${record.assetId}: missing ${key}`);
    }
    assert.equal(typeof ref.termsUrl, 'string', `${record.assetId}: missing terms-url field`);
    assert.ok(['gross-photo', 'micrograph', 'diagnostic-imaging'].includes(ref.mediaType));
    assert.ok(['human', 'unconfirmed', 'nonhuman-explicit'].includes(ref.organism));
    assert.ok(['direct-match', 'relevant-example'].includes(ref.relationship));
    assert.ok(typeof ref.viewLimitations === 'string');
    const v = ref.verification;
    assert.ok(v && typeof v.visualEvidence === 'string' && v.checkedAt);
    for (const key of ['pageOpened', 'captionChecked', 'imageVisuallyInspected']) assert.equal(typeof v[key], 'boolean');
    assert.ok(v.evidencePath && existsSync(fileURLToPath(new URL('../../' + v.evidencePath, root))), `${record.assetId}: missing evidence file ${v.evidencePath}`);
    if (record.status === 'verified') {
      assert.ok(v.pageOpened && v.captionChecked && v.imageVisuallyInspected, `${record.assetId}: incomplete verification`);
      assert.equal(ref.organism, 'human', `${record.assetId}: cannot count unconfirmed/nonhuman material as a verified human match`);
      assert.ok(ref.termsUrl, `${record.assetId}: source terms unverified`);
      assert.ok(v.finalUrl && v.redirectNotes && v.reviewedAtFinalCheck, `${record.assetId}: final destination review missing`);
      assert.notEqual(new URL(v.finalUrl).hostname, 'upload.wikimedia.org', `${record.assetId}: raw image confused with final source page`);
      if (record.coverageKind === 'relevant-example' || record.references.length > 1) {
        assert.ok(ref.subject?.en && ref.subject?.es, `${record.assetId}: named/limited view must be explicit in both languages`);
      }
    }
  }
}
console.log(JSON.stringify({ publishedAssets: expectedIds.size, records: records.length, outcomes: counts }, null, 2));
console.log('This validates record completeness and evidence flags, not anatomical correctness.');
