import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { applyAttempt, createPracticeSession } from '../content/study.ts';
import { createStudyStorage, decodeStoredState, initialStoredState, STUDY_STORAGE_KEY, StudyLoadError } from '../context/studyStorage.ts';

function savedState() {
  const attempted = applyAttempt({ attempts: [], missed: [], mastery: [] }, {
    id: 'attempt-original', questionId: 'question-historical', structureId: 'humerus',
    correct: false, answer: 'student original answer', createdAt: '2026-10-20T12:00:00.000Z',
  });
  return {
    ...initialStoredState(), ...attempted, bookmarks: ['humerus'],
    sessions: [{
      ...createPracticeSession('skeletal-system', ['question-historical'], 'practice', '2026-10-20T12:00:00.000Z', 'session-original'),
      draft: { questionId: 'question-historical', answer: ['raw', 'unsubmitted'] },
    }],
    preferences: { theme: 'dark' as const, textScale: 'large' as const, haptics: false, defaultCount: 20 },
  };
}

function fixture(raw: string | null) {
  const fake = {
    raw, readFails: false, writeFails: false, reads: 0, writes: [] as string[],
    storage: {
      getItem: async (key: string) => {
        assert.equal(key, '@boneefied/study-state-v1');
        fake.reads++;
        if (fake.readFails) throw new Error('simulated read failure');
        return fake.raw;
      },
      setItem: async (key: string, value: string) => {
        assert.equal(key, '@boneefied/study-state-v1');
        fake.writes.push(value);
        if (fake.writeFails) throw new Error('simulated write failure');
        fake.raw = value;
      },
    },
  };
  return { fake, gate: createStudyStorage(fake.storage) };
}

test('failed read leaves original progress untouched and all saves blocked', async () => {
  const original = JSON.stringify(savedState());
  const { fake, gate } = fixture(original);
  fake.readFails = true;
  await assert.rejects(gate.load(), error => error instanceof StudyLoadError && error.kind === 'read');
  assert.equal(await gate.save(initialStoredState()), false);
  assert.equal(await gate.save(initialStoredState()), false, 'manual save retry cannot bypass loading');
  assert.deepEqual(fake.writes, []);
  assert.equal(fake.raw, original);
});

const invalidPayloads: [string, string][] = [
  ['empty string', ''],
  ['malformed JSON', '{bad'],
  ['JSON null', 'null'],
  ['array instead of record', '[]'],
  ['scalar', '"not a state"'],
  ['empty object', '{}'],
  ['missing core field', '{"attempts":[],"missed":[]}'],
  ['wrong core field', '{"attempts":{},"missed":[],"mastery":[]}'],
  ['invalid attempt', JSON.stringify({ ...savedState(), attempts: [{ id: 'broken' }] })],
  ['invalid missed item', JSON.stringify({ ...savedState(), missed: [{ questionId: 'broken' }] })],
  ['invalid mastery', JSON.stringify({ ...savedState(), mastery: [{ structureId: 'broken' }] })],
  ['invalid bookmarks', JSON.stringify({ ...savedState(), bookmarks: [42] })],
  ['invalid session', JSON.stringify({ ...savedState(), sessions: [{ id: 'broken' }] })],
  ['invalid draft', JSON.stringify({ ...savedState(), sessions: [{ ...savedState().sessions[0], draft: { questionId: 'q', answer: 42 } }] })],
  ['invalid preference', JSON.stringify({ ...savedState(), preferences: { theme: 'unknown' } })],
];
for (const [label, raw] of invalidPayloads) {
  test(`${label}: invalid payload never authorizes any write or changes original bytes`, async () => {
    const { fake, gate } = fixture(raw);
    await assert.rejects(gate.load(), error => error instanceof StudyLoadError && error.kind === 'invalid');
    assert.equal(await gate.save(initialStoredState()), false);
    await assert.rejects(gate.load(), StudyLoadError, 'Retry Load must not silently reset invalid data');
    assert.equal(await gate.save(savedState()), false);
    assert.equal(fake.raw, raw);
    assert.deepEqual(fake.writes, []);
  });
}

test('genuine missing record (null only) permits safe first-launch initialization', async () => {
  const { fake, gate } = fixture(null);
  assert.equal(await gate.save(initialStoredState()), false, 'no saving before even a first-launch read');
  const loaded = await gate.load();
  assert.deepEqual(loaded, initialStoredState());
  assert.equal(fake.writes.length, 0, 'loading alone never writes');
  assert.equal(await gate.save(loaded), true);
  assert.deepEqual(JSON.parse(fake.raw!), initialStoredState());
});

test('valid progress, drafts, bookmarks and preferences restore accurately before any write', async () => {
  const original = savedState();
  const { fake, gate } = fixture(JSON.stringify(original));
  assert.equal(await gate.save(initialStoredState()), false);
  const loaded = await gate.load();
  assert.deepEqual(loaded, original);
  assert.equal(fake.writes.length, 0);
  await gate.save(loaded);
  assert.deepEqual(JSON.parse(fake.raw!), original);
});

test('successful Retry Load restores original progress after an I/O failure, without an empty queued write', async () => {
  const original = savedState();
  const { fake, gate } = fixture(JSON.stringify(original));
  fake.readFails = true;
  await assert.rejects(gate.load(), StudyLoadError);
  assert.equal(await gate.save(initialStoredState()), false);
  fake.readFails = false;
  const loaded = await gate.load();
  assert.deepEqual(loaded, original);
  await gate.save(loaded);
  assert.equal(fake.reads, 2);
  assert.deepEqual(fake.writes.map(raw => JSON.parse(raw)), [original]);
});

test('invalid record can be retried after recovery without this loader modifying its original bytes', async () => {
  const { fake, gate } = fixture('{bad');
  await assert.rejects(gate.load(), StudyLoadError);
  assert.equal(fake.raw, '{bad');
  assert.equal(fake.writes.length, 0);
  fake.raw = JSON.stringify(savedState()); // Simulates an external restoration, not an app reset.
  assert.deepEqual(await gate.load(), savedState());
  assert.equal(fake.writes.length, 0);
});

test('legacy three-array study records restore with optional defaults and no loss of progress', async () => {
  const { attempts, missed, mastery } = savedState();
  const legacy = { attempts, missed, mastery };
  const { fake, gate } = fixture(JSON.stringify(legacy));
  const loaded = await gate.load();
  assert.deepEqual(loaded, { ...initialStoredState(), ...legacy });
  await gate.save(loaded);
  assert.deepEqual(JSON.parse(fake.raw!).attempts, attempts);
});

test('legacy sessions without drafts and partial preferences remain supported; extension fields survive', () => {
  const state = savedState();
  const { draft: _draft, ...legacySession } = state.sessions[0];
  const loaded = decodeStoredState(JSON.stringify({
    ...state, sessions: [legacySession], preferences: { theme: 'dark' }, legacyExtension: { preserved: true },
  }));
  assert.deepEqual(loaded.sessions, [legacySession]);
  assert.deepEqual(loaded.preferences, { ...initialStoredState().preferences, theme: 'dark' });
  assert.deepEqual((loaded as unknown as { legacyExtension: unknown }).legacyExtension, { preserved: true });
});

test('writes remain blocked while a read is pending, including concurrent manual retries', async () => {
  let resolve!: (raw: string | null) => void;
  let reads = 0;
  const writes: string[] = [];
  const gate = createStudyStorage({
    getItem: () => { reads++; return new Promise(r => { resolve = r; }); },
    setItem: async (_key, value) => { writes.push(value); },
  });
  const loading = gate.load();
  const duplicate = gate.load();
  assert.equal(loading, duplicate, 'concurrent load requests share one read');
  assert.equal(await gate.save(initialStoredState()), false);
  assert.equal(reads, 1);
  resolve(JSON.stringify(savedState()));
  assert.deepEqual(await loading, savedState());
  assert.deepEqual(writes, []);
});

test('write-failure retry saves loaded state, does not retry reading, and the queue remains usable', async () => {
  const original = savedState();
  const { fake, gate } = fixture(JSON.stringify(original));
  const loaded = await gate.load();
  fake.writeFails = true;
  await assert.rejects(gate.save(loaded), /write failure/);
  assert.deepEqual(JSON.parse(fake.raw!), original);
  fake.writeFails = false;
  await gate.save(loaded);
  assert.equal(fake.reads, 1);
  assert.deepEqual(JSON.parse(fake.raw!), original);
});

test('serialized writes retain their order and persist the latest state', async () => {
  const { fake, gate } = fixture(null);
  const loaded = await gate.load();
  const updated = { ...loaded, bookmarks: ['humerus'] };
  await Promise.all([gate.save(loaded), gate.save(updated)]);
  assert.deepEqual(fake.writes.map(raw => JSON.parse(raw).bookmarks), [[], ['humerus']]);
  assert.deepEqual(JSON.parse(fake.raw!).bookmarks, ['humerus']);
});

test('provider and root use guarded storage, keep recovery separate, and expose Retry Load instead of a blank screen', () => {
  const provider = readFileSync(new URL('../context/StudyContext.tsx', import.meta.url), 'utf8');
  const root = readFileSync(new URL('../app/_layout.tsx', import.meta.url), 'utf8');
  const recovery = readFileSync(new URL('../components/StudyStorageRecovery.tsx', import.meta.url), 'utf8');
  assert.equal(STUDY_STORAGE_KEY, '@boneefied/study-state-v1');
  assert.doesNotMatch(provider, /AsyncStorage\.(setItem|removeItem|clear)/);
  assert.match(provider, /if \(!hydrated\) return;[\s\S]*?storage\.save\(state\)/);
  assert.match(provider, /setState\(loaded\);[\s\S]*?status: 'ready'/);
  assert.match(root, /if \(!hydrated\) return <StudyStorageRecovery error=\{loadError\} onRetry=\{retryLoad\}/);
  assert.match(root, /\(hydrated \|\| loadError\) && localeHydrated/);
  assert.match(recovery, /testID="study-retry-load"[\s\S]*?onPress=\{onRetry\}/);
  assert.doesNotMatch(recovery, /retrySave|resetLocalState/);
});
