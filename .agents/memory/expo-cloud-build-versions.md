---
name: Expo cloud build versions
description: EAS builder defaults can lag a monorepo's pnpm lockfile and React Native's minimum Xcode version.
---

For Expo GitHub builds from a pnpm monorepo, inspect the full failed phase log before assuming a lockfile is missing. An older pnpm may report an incompatible existing lockfile and then say no usable lockfile exists. Similarly, a Podfile failure can be caused by an outdated Xcode image rather than invalid application pods. Pin the package manager and SDK-compatible images for both platforms when defaults lag.

**Why:** Separate cloud build attempts reached distinct failures: dependency installation rejected an existing lockfile due to pnpm version, iOS pod installation rejected the builder's Xcode version, and Android defaulted to a legacy Java 11 image that could not run the current Gradle version. Changing application dependencies would not address these causes.

**How to apply:** Compare the lockfile format with the builder's pnpm version, React Native's required Xcode with the selected iOS image, and Gradle's required Java with the selected Android image. Do not assume GitHub-triggered Android builds auto-select a modern image. Verify a replacement build passes the failed phase before concluding the fix worked.