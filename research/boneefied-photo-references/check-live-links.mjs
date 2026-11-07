/**
 * Research check only. Does not build, publish, edit approvals, or fetch photos.
 * Run: node research/boneefied-photo-references/check-live-links.mjs
 * Add --require-complete to exit unsuccessfully unless all 164 records pass.
 * --reuse-current preserves the existing checks/timestamps and tests only new URLs.
 * HTTP success is NOT a new anatomical or photographic inspection.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dir = new URL('./', import.meta.url);
const records = JSON.parse(await readFile(new URL('references.json', dir), 'utf8'));
const approved = records.filter(record => record.status === 'verified');
const urls = [...new Set(approved.flatMap(record => record.references.map(ref => ref.url)))];
let prior = new Map();
if (process.argv.includes('--reuse-current')) {
  const previous = JSON.parse(await readFile(new URL('live-link-checks.json', dir), 'utf8'));
  prior = new Map(previous.destinations.map(result => [result.url, result]));
}
const results = [];
for (const url of urls) {
  if (prior.has(url)) {
    results.push(prior.get(url));
    console.log(`${results.length}/${urls.length} REUSED (${prior.get(url).checkedAt}) ${url}`);
    continue;
  }
  const checkedAt = new Date().toISOString();
  let result;
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(30000),
      headers: { 'User-Agent': 'Boneefied-Reference-Verification/1.0' },
    });
    const type = response.headers.get('content-type') ?? '';
    if (!type.includes('text/html')) {
      await response.body?.cancel();
      result = {
        url, checkedAt, status: response.status, finalUrl: response.url,
        contentType: type, sourcePageReachable: false,
        reason: 'Destination did not return an HTML source page. No media downloaded.',
      };
    } else {
      const html = await response.text();
      const title = (html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
        .replace(/\s+/g, ' ').trim();
      const softFailure = /^(?:404\b|page not found\b|access denied\b|sign in\b|log in\b|just a moment\b)/i.test(title);
      const reachable = response.ok && !softFailure && html.length > 300;
      result = {
        url, checkedAt, status: response.status, finalUrl: response.url,
        redirected: response.redirected, contentType: type, title,
        sourcePageReachable: reachable,
        reason: reachable
          ? 'Successful HTML GET with certificate verification enabled; photograph not re-inspected.'
          : 'HTTP error, recognized error/login title, or insufficient HTML; not a verified working source.',
      };
    }
  } catch (error) {
    result = {
      url, checkedAt, sourcePageReachable: false,
      error: String(error), cause: String(error.cause ?? ''),
      reason: 'Access check failed. This alone does not establish that the destination is globally broken.',
    };
  }
  results.push(result);
  console.log(`${results.length}/${urls.length} ${result.sourcePageReachable ? 'HTTP PASS' : 'NOT CONFIRMED'} ${url}`);
  // Serial requests avoid a burst against collection providers.
  await new Promise(resolve => setTimeout(resolve, 750));
}

const byUrl = new Map(results.map(result => [result.url, result]));
const illustrations = records.map(record => {
  const priorApproval = record.status === 'verified';
  const checks = priorApproval
    ? record.references.map(ref => ({
      url: ref.url,
      sourcePageReachable: byUrl.get(ref.url)?.sourcePageReachable === true,
      originalImageInspectionDate: ref.verification?.checkedAt ?? null,
    }))
    : [];
  return {
    assetId: record.assetId, title: record.title,
    researchStatus: record.status,
    previouslyApprovedAnatomicalSet: priorApproval,
    currentlyApprovedAndHttpReachable: priorApproval && checks.length > 0
      && checks.every(check => check.sourcePageReachable),
    unresolvedCoverageReason: priorApproval ? null : record.reason,
    checks,
  };
});
const report = {
  checkedAt: new Date().toISOString(),
  method: 'Serial HTTPS GETs of approved source HTML only; normal TLS validation; no third-party photos saved. With --reuse-current, prior checks retain their original timestamps.',
  limitations: 'HTTP reachability is not photographic re-inspection, proof of every fine anatomical detail, interactive app navigation, or native-device verification.',
  expectedIllustrations: 164,
  accountedIllustrations: records.length,
  anatomicallyApprovedIllustrations: approved.length,
  approvedAndHttpReachableIllustrations: illustrations.filter(row => row.currentlyApprovedAndHttpReachable).length,
  uniqueApprovedDestinations: urls.length,
  reachableDestinations: results.filter(result => result.sourcePageReachable).length,
  all164CompleteAndReachable: records.length === 164
    && illustrations.every(row => row.currentlyApprovedAndHttpReachable),
  buildAuthorization: 'PROHIBITED. Even complete coverage requires owner review and explicit separate later authorization before any build, release, scheduling, submission, or publishing.',
  destinations: results,
  illustrations,
};
const path = new URL('live-link-checks.json', dir);
await writeFile(path, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  report: fileURLToPath(path),
  approvedAndHttpReachableIllustrations: report.approvedAndHttpReachableIllustrations,
  expectedIllustrations: 164,
  reachableDestinations: report.reachableDestinations,
  uniqueApprovedDestinations: urls.length,
  all164CompleteAndReachable: report.all164CompleteAndReachable,
}, null, 2));
if (process.argv.includes('--require-complete') && !report.all164CompleteAndReachable) process.exitCode = 1;
