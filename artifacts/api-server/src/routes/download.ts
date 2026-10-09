import { Router, type IRouter } from "express";
import { existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const router: IRouter = Router();
const filename = "boneefied-production.aab";

function getBundlePath(): string {
  let directory = dirname(fileURLToPath(import.meta.url));
  while (!existsSync(join(directory, "pnpm-workspace.yaml"))) {
    const parent = dirname(directory);
    if (parent === directory) {
      throw new Error("Workspace root not found for release download");
    }
    directory = parent;
  }
  return join(directory, "releases", "google-play", filename);
}

router.get(`/download/${filename}`, async (req, res, next) => {
  // The staged, Git-ignored bundle is workspace-only delivery, not a public
  // production storefront or a directory of arbitrary downloadable files.
  if (process.env.NODE_ENV !== "development") {
    res.status(404).json({ error: "Release download is development-only" });
    return;
  }

  try {
    const bundlePath = getBundlePath();
    const file = await stat(bundlePath);
    if (!file.isFile() || file.size === 0) {
      res.status(404).json({ error: "Staged release bundle is unavailable" });
      return;
    }

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.sendFile(
      bundlePath,
      { cacheControl: false, lastModified: false, acceptRanges: false },
      (error) => {
        if (error) {
          req.log.error({ err: error }, "Release bundle download failed");
          next(error);
        }
      },
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      res.status(404).json({ error: "Staged release bundle is unavailable" });
      return;
    }
    next(error);
  }
});

export default router;
