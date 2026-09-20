#!/usr/bin/env bash
set -uo pipefail

cd "$(dirname "$0")/.."
failures=0

run_check() {
  local label="$1"
  shift
  printf '\n== %s ==\n' "$label"
  if "$@"; then
    printf 'PASS: %s\n' "$label"
  else
    local status=$?
    printf 'FAIL: %s (exit %s)\n' "$label" "$status"
    failures=$((failures + 1))
  fi
}

run_check "Unit and catalog regression tests" pnpm test
run_check "TypeScript typecheck" pnpm run typecheck
run_check "Expo SDK dependency compatibility" env CI=1 pnpm exec expo install --check

rm -rf /tmp/boneefied-audit-export
run_check "Expo web/iOS/Android JavaScript export preflight" \
  pnpm exec expo export --platform all --output-dir /tmp/boneefied-audit-export

printf '\n== Native runtime evidence ==\n'
printf 'NOT RUN: iOS simulator/device, Android emulator/device, signed APK/IPA, haptics, and installed standalone behavior.\n'
printf 'Reason: this workspace has no native projects, emulator/simulator, signing setup, or attached device.\n'
printf 'The Expo export check only proves JavaScript/assets can be bundled for each platform.\n'

if (( failures > 0 )); then
  printf '\nAUDIT VERIFICATION FAILED: %s required check(s) failed.\n' "$failures"
  exit 1
fi

printf '\nAUDIT VERIFICATION PASSED for the checks above; native runtime evidence remains NOT RUN.\n'