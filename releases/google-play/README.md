# Boneefied Google Play bundle

Download the exact staged `boneefied-production.aab` through the existing
development API at `/api/download/boneefied-production.aab`. It forces an
attachment download. Verify the current public HTTPS download against the
staged file's byte size and SHA-256 before sharing that link; do not use
asset cards or preview/redirect links.

`boneefied-production.manifest.json` records the finished EAS build and the
verified file details. The signed bundle is unmodified and excluded from Git.
It is stored in this project's workspace, not served by the production app.
The existing development API also serves the exact file at
`/api/download/boneefied-production.aab`, with attachment download headers.
This route is disabled in production and works only while the development API
is running; anyone with the development URL may be able to download the bundle.

The refreshed production release is version 1.0.0, Android version code 3.
The signed app contains the Settings Privacy Policy link and local-study reset.
It has not been submitted to Google Play.

Because the binary is excluded from Git, a Git clone alone will not contain it.
