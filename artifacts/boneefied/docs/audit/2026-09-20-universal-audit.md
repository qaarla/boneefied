# Boneefied universal audit — 2026-09-20

Audit version: 1  
Application version: 1.0.0  
Baseline revision: `4519a53d2179eed5d92756cce4f792772da119d7`  
Audit scope: baseline revision plus the uncommitted repairs described below

## Runtime and platform

- Host: Linux 6.18.52 x86_64 on Replit
- Node: 24.13.0
- pnpm: 10.26.1
- React: 19.2.3
- React Native: 0.86.3
- Declared application platforms: iOS, Android, web
- Expo SDK package selected by the lockfile: 57.0.22
- Expo CLI reported by `pnpm exec expo --version`: 57.0.24
- Browser verification viewport: 402 × 874
- State model: local AsyncStorage only; no account, authentication, role, backend, or server data path exists

Status meanings:

- **PASS**: directly observed at the named layer.
- **FAIL**: directly observed failure that remains unresolved.
- **BLOCKED**: required environment or hardware was unavailable.
- **NOT RUN**: out of scope or not applicable; no evidence is claimed.

## Acceptance matrix

| Area | Criterion | Status | Evidence |
|---|---|---:|---|
| Launch | Web app renders after the running Metro server finishes bundling | PASS | Fresh browser context rendered Study with no application exception. |
| Launch | Immediate preview during Metro compilation/reconnect never shows blank UI | FAIL | Blank white UI reproduced during initial 12.4 s bundle and on two Metro reconnects; recovered after the server was ready and the route was reloaded. This is development-preview evidence, not a standalone-app crash. |
| Study | Study catalog renders system list, search, modules, and navigation | PASS | Rendered browser journey. |
| Study | Cells & tissues, Integumentary, and Skeletal filters return relevant, non-empty modules | PASS | Each rendered a populated matching module and opened its detail page. |
| Search | `nucleus` returns relevant structures and allows bookmarking | PASS | Three matching results; Caudate nucleus changed to Saved. |
| Persistence | Bookmark survives navigation and browser reload | PASS | Re-entering `nucleus` after reload showed Caudate nucleus still Saved. Search text itself intentionally reset. |
| Module | Cytology / Mitosis Learn contains six ordered lesson cards | PASS | Rendered order matched Cell boundary and cytosol; Nucleus and genome; Organelles; Cell cycle and interphase; Mitotic recognition; Cytokinesis. |
| Recall | Recall hides labels and individual reveal does not award progress | PASS | Labels changed to reveal controls; individual reveal left progress unchanged. |
| Recall | Nucleus and Nucleolus controls are independently clickable | PASS | Reproduced overlap before repair; both accepted normal clicks after target repair. |
| Practice | Practice starts through rendered controls and shows eligible question count | PASS | Five-question Cytology session started. |
| Practice | Incorrect answer shows review feedback and explanation | PASS | Incorrect interphase order showed source-linked explanation. |
| Practice | Next advances to the next question | PASS | Advanced from question 1 to question 2. |
| Missed | Incorrect answer enters Missed | PASS | Missed showed one item to retry. |
| Missed | Retry opens the exact missed question as a fresh one-question session | PASS | Failed before repair by reopening question 2 of the previous session; passed after repair as question 1 of 1. |
| Missed | Correct retry removes the item | PASS | Missed returned to Nothing to review. |
| Progress | Metrics reflect submitted attempts | PASS | Attempts and accuracy changed after browser submissions. |
| Progress | Progress renders without duplicate React keys | PASS | Duplicate `skull-orientation` key reproduced before repair; absent after removing the duplicated catalog lesson. |
| Settings | Theme, text scale, and haptics persist after reload | PASS | Dark, large text, and haptics off remained selected after reload. |
| Reset | Reset presents a usable confirmation with Cancel and Reset | PASS | `Alert.alert` was a dead control on web before repair; in-app confirmation passed after repair. |
| Reset | Cancel preserves local data and preferences | PASS | Non-default preferences and bookmark remained after Cancel. |
| Reset | Confirm clears attempts, misses, bookmarks, progress, and restores defaults | PASS | Progress showed zero attempts; Missed empty; bookmark cleared; System/default text/haptics on persisted after reload. |
| Failure state | Invalid module deep link never substitutes unrelated content | PASS | Invalid ID silently rendered Cells & Tissues before repair; after repair it rendered Module unavailable and Return to Study worked. |
| Content | Published catalog references, provenance, counts, assets, task shapes, and coverage invariants | PASS | Production catalog regression suite. |
| Static checks | TypeScript typecheck | PASS | `tsc -p tsconfig.json --noEmit`. |
| Regression tests | Automated suite | PASS | 24/24 Node tests. |
| Expo preflight | Installed package patches match Expo SDK recommendations | FAIL | Five mismatches remain: Expo 57.0.22→57.0.24, constants 57.0.18→57.0.19, image-picker 57.0.17→57.0.19, location 57.0.17→57.0.19, router 57.0.21→57.0.22. No dependency update was made because no user-facing failure was attributed to these patches. |
| Export | Expo can bundle web, iOS, and Android JavaScript/assets | PASS | `expo export --platform all` produced web JS, Android Hermes bytecode, iOS Hermes bytecode, assets, and metadata. This is not an APK, IPA, installed build, or native runtime test. |
| Native | iOS simulator or physical-device execution | BLOCKED | No native iOS project, simulator, signing setup, or attached device. |
| Native | Android emulator or physical-device execution | BLOCKED | No native Android project, emulator, signing setup, or attached device. |
| Native | Haptics, touch behavior, installed standalone launch, APK/IPA | BLOCKED | Requires native runtime/build infrastructure unavailable in this workspace. |
| Offline | Launch and complete study journeys with network disabled in an installed app | BLOCKED | Browser content/state is local, but a true installed offline runtime was unavailable. |
| Accounts | Signup, signin, signout, roles, account recovery | NOT RUN | Not applicable: Boneefied has no accounts, authentication, or roles. |
| Backend | API, database, synchronization, server failure states | NOT RUN | Not applicable: study behavior and records are local-only. |

## Repairs made from reproduced failures

1. Missed retry now creates a fresh one-question session for the selected missed item instead of resuming an unrelated active module session.
2. The duplicated Skeletal `skull-orientation` lesson was removed while preserving the pelvis asset on the original lesson.
3. Nucleus and Nucleolus recall targets were separated so both controls accept normal clicks.
4. Reset now uses an accessible in-app confirmation that works on web and preserves the same local reset semantics.
5. Invalid or unpublished module IDs now render an explicit unavailable state instead of falling back to the first real module.

Regression coverage was added for fresh missed-retry session construction, unique lesson IDs, and invalid module resolution.

## Test-quality audit

- The automated suite uses real production catalog data for provenance, counts, references, assets, supported task shapes, and content coverage.
- State/scoring tests use small deterministic fixtures. They prove pure scoring and serialization rules, not rendered UI, router behavior, AsyncStorage integration, or native behavior.
- No mock framework creates false network/backend confidence; those paths do not exist.
- Before this audit, the suite could not catch route-state reuse, React key warnings, overlapping rendered targets, web confirmation behavior, or invalid-route fallback. Browser evidence reproduced each issue before repair, and the reusable pure boundaries received regression tests where practical.
- Browser verification is evidence for the Expo web runtime only. It must not be cited as iOS or Android behavior.

## Remaining findings

1. **Expo SDK patch compatibility remains failed.** Updating dependencies was intentionally not performed because the audit did not attribute a user-facing defect to the five patch mismatches.
2. **Development preview readiness remains imperfect.** A first visit during Metro compilation or reconnect can show a blank page and a `Disconnected from Metro (1006)` warning. The app rendered after Metro was ready and reload completed.
3. **Deprecation warnings remain.** Web logs reported deprecated `shadow*` style props and `props.pointerEvents`; neither caused a failed acceptance journey.
4. **Native confidence is blocked, not passed.** Exports prove bundling only.

## Repeatable verification

From `artifacts/boneefied`:

```bash
pnpm run audit:verify
```

The command runs tests, typecheck, Expo SDK compatibility, and web/iOS/Android JavaScript export. It currently exits with status 1 because Expo SDK dependency compatibility fails. It also prints the native checks as NOT RUN so export success cannot be mistaken for native runtime verification.