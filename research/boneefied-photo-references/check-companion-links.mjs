/**
 * Research-only source HTML checks. No photographs, builds or publishing.
 * Reuses existing dated HTTP evidence; checks new URLs only.
 * Complete-comparison approvals remain a separate count.
 */
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const records = JSON.parse(await readFile(new URL('references.json', root), 'utf8'));
const companions = JSON.parse(await readFile(new URL('photo-companions.json', root), 'utf8'));
const companionById = new Map(companions.map(row => [row.assetId, row]));
const browserReport = JSON.parse(await readFile(new URL('browser-link-checks.json', root), 'utf8'));
const browserByUrl = new Map(browserReport.destinations.map(row => [row.url, row]));
const prior = new Map();
for (const filename of ['live-link-checks.json', 'photo-companion-live-links.json']) {
  let report;
  try {
    report = JSON.parse(await readFile(new URL(filename, root), 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    continue;
  }
  for (const row of report.destinations) prior.set(row.url, row);
}
const sources = records.map(record => ({
  assetId: record.assetId, title: record.title,
  completeComparison: record.status === 'verified',
  references: record.status === 'verified' ? record.references
    : companionById.get(record.assetId)?.references ?? [],
}));
const urls = [...new Set(sources.flatMap(row => row.references.map(ref => ref.url)))];
const results = [];
for (const url of urls) {
  if (prior.has(url)) {
    results.push(prior.get(url));
    continue;
  }
  const checkedAt = new Date().toISOString();
  let result;
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(25000),
      headers: { 'User-Agent': 'Boneefied-Reference-Verification/1.0' },
    });
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) {
      await response.body?.cancel();
      result = { url, checkedAt, status: response.status, finalUrl: response.url,
        sourcePageReachable: false, reason: 'Not HTML; body cancelled. No media downloaded.' };
    } else {
      const html = await response.text();
      const title = (html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
        .replace(/\s+/g, ' ').trim();
      result = {
        url, checkedAt, status: response.status, finalUrl: response.url,
        title, sourcePageReachable: response.ok && html.length > 300
          && !/^(?:404\b|page not found\b|access denied\b|sign in\b|log in\b|just a moment\b)/i.test(title),
        reason: 'Source HTML GET with normal TLS. HTTP evidence only, not a new image inspection.',
      };
    }
  } catch (error) {
    result = { url, checkedAt, sourcePageReachable: false,
      error: String(error), cause: String(error.cause ?? ''),
      reason: 'This HTTP client could not confirm access; this does not prove the site is globally broken.' };
  }
  results.push(result);
  console.log(`${result.sourcePageReachable ? 'HTTP PASS' : 'NOT CONFIRMED'} ${url}`);
  await new Promise(resolve => setTimeout(resolve, 750));
}
const byUrl = new Map(results.map(row => [row.url, row]));
const illustrations = sources.map(row => ({
  assetId: row.assetId, title: row.title, completeComparison: row.completeComparison,
  hasInspectedCompanion: row.references.length > 0,
  hasHttpReachableCompanion: row.references.some(ref => byUrl.get(ref.url)?.sourcePageReachable),
  allListedLinksHttpReachable: row.references.length > 0
    && row.references.every(ref => byUrl.get(ref.url)?.sourcePageReachable),
  hasVerifiedWorkingCompanion: row.references.some(ref => byUrl.get(ref.url)?.sourcePageReachable
    || (browserByUrl.get(ref.url)?.sourcePageReachable && browserByUrl.get(ref.url)?.photographRendered)),
  allListedLinksVerifiedWorking: row.references.length > 0 && row.references.every(ref =>
    byUrl.get(ref.url)?.sourcePageReachable
    || (browserByUrl.get(ref.url)?.sourcePageReachable && browserByUrl.get(ref.url)?.photographRendered)),
  checks: row.references.map(ref => ({
    url: ref.url, sourcePageReachable: byUrl.get(ref.url)?.sourcePageReachable === true,
    originalImageInspectionDate: ref.verification.checkedAt,
    originalInspectionEvidence: ref.verification.evidencePath,
    browserCheck: browserByUrl.has(ref.url) ? {
      ...browserByUrl.get(ref.url), checkedAt: browserReport.checkedAt,
      evidencePath: browserReport.evidencePath,
    } : null,
  })),
}));
const report = {
  checkedAt: new Date().toISOString(),
  expectedIllustrations: 164, accountedIllustrations: illustrations.length,
  completeComparisons: sources.filter(row => row.completeComparison).length,
  illustrationsWithInspectedPhotographs: illustrations.filter(row => row.hasInspectedCompanion).length,
  illustrationsWithHttpReachablePhotographs: illustrations.filter(row => row.hasHttpReachableCompanion).length,
  illustrationsWithAllLinksHttpReachable: illustrations.filter(row => row.allListedLinksHttpReachable).length,
  all164HaveHttpReachableCompanions: illustrations.length === 164
    && illustrations.every(row => row.hasHttpReachableCompanion),
  illustrationsWithVerifiedWorkingCompanions: illustrations.filter(row => row.hasVerifiedWorkingCompanion).length,
  all164HaveVerifiedWorkingCompanions: illustrations.length === 164
    && illustrations.every(row => row.hasVerifiedWorkingCompanion),
  allListedLinksVerifiedWorking: illustrations.every(row => row.allListedLinksVerifiedWorking),
  all164CompleteAndReachable: illustrations.length === 164
    && illustrations.every(row => row.completeComparison && row.allListedLinksHttpReachable),
  buildAuthorized: false,
  methodology: 'Serial original-source HTML GETs, normal TLS, 750ms spacing. Prior dated checks retained. Explicit per-URL browser exceptions separately record a genuinely rendered source page/photo; HTTP failures remain visible, not relabeled as HTTP passes. No photographs fetched or saved.',
  limitations: 'Selected-structure companions do not mean complete coverage of an illustration. HTTP success is not fresh image inspection; missing structures remain blockers. No build, release, scheduling, submission or publishing is authorized.',
  destinations: results, illustrations,
};
await writeFile(new URL('photo-companion-live-links.json', root), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  inspected: report.illustrationsWithInspectedPhotographs,
  reachable: report.illustrationsWithHttpReachablePhotographs,
  allListedLinksReachable: report.illustrationsWithAllLinksHttpReachable,
  verifiedWorkingCompanions: report.illustrationsWithVerifiedWorkingCompanions,
  allListedLinksVerifiedWorking: report.allListedLinksVerifiedWorking,
  uniqueSourcePages: urls.length,
  failures: results.filter(row => !row.sourcePageReachable),
  completeComparisons: report.completeComparisons,
  buildAuthorized: false,
}, null, 2));
