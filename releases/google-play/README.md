# Boneefied Google Play bundle

Download `boneefied-production.aab` from this folder using its **⋯ → Download**
menu in Replit's Files view. Upload the `.aab` itself to the existing Google Play
entry for `com.qaarla.boneefied`; do not ZIP it or use an APK instead.

`boneefied-production.manifest.json` records the existing EAS build and the
verified file details. The signed bundle is unmodified and excluded from Git.
It is stored in this project's workspace, not served by the production app.
The existing development API also serves the exact file at
`/api/download/boneefied-production.aab`, with attachment download headers.
This route is disabled in production and works only while the development API
is running; anyone with the development URL may be able to download the bundle.

Because the binary is excluded from Git, a Git clone alone will not contain it.
