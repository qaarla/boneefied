---
name: Android APK integrity checks
description: Distinguish generic Info-ZIP extra-field warnings from APK entry CRC failures without modifying signed binaries.
---

If generic `unzip -t` rejects an EAS APK with zero-length extra-field warnings, independently check every archive entry's CRC before concluding the build is corrupt. Preserve the signed APK byte-for-byte.

**Why:** A finished EAS APK triggered Info-ZIP “EF block length (0 bytes) invalid” warnings, while Python `zipfile.testzip()` successfully read and CRC-checked every entry. The separately downloaded public copy also matched the staged APK's size and SHA-256 and passed the same CRC check.

**How to apply:** Use Python's standard-library ZIP reader for a full entry CRC check and confirm `AndroidManifest.xml` exists. Report any generic-tool warnings accurately. Verify the served file against the staged file by size and SHA-256. CRC checks are not cryptographic signature verification or physical-device installation evidence; do not rewrite, recompress, or resign the APK to suppress warnings.
