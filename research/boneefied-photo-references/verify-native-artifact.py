"""Verify newly built artifacts without modifying, resigning or submitting them."""
import argparse
import base64
import hashlib
import json
from pathlib import Path
import plistlib
import subprocess
import tempfile
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument("platform", choices=["ios", "android"])
parser.add_argument("path", type=Path)
parser.add_argument("previous", type=Path)
args = parser.parse_args()


def fields(data):
    return dict(line.split(b": ", 1) for line in data.replace(b"\r\n", b"\n")
                .replace(b"\n ", b"").split(b"\n") if b": " in line)


def run(*command):
    return subprocess.run(command, check=True, capture_output=True).stdout


def certificate(archive, temp, prefix):
    name = next(name for name in archive.namelist() if name.startswith("META-INF/") and name.endswith(".RSA"))
    rsa, pem = temp / (prefix + ".rsa"), temp / (prefix + ".pem")
    rsa.write_bytes(archive.read(name))
    pem.write_bytes(run("openssl", "pkcs7", "-inform", "DER", "-in", str(rsa), "-print_certs"))
    return hashlib.sha256(run("openssl", "x509", "-in", str(pem), "-outform", "DER")).hexdigest(), rsa, name


with zipfile.ZipFile(args.path) as archive, zipfile.ZipFile(args.previous) as previous, tempfile.TemporaryDirectory() as td:
    temp = Path(td)
    assert archive.testzip() is None, "ZIP entry CRC failed"
    bundles = [name for name in archive.namelist() if name.endswith(("main.jsbundle", "index.android.bundle"))]
    assert len(bundles) == 1, bundles
    bundle = archive.read(bundles[0])
    links = json.loads((Path(__file__).parent / "photo-companion-live-links.json").read_text())
    urls = [row["url"] for row in links["destinations"]]
    missing = [url for url in urls if url.encode() not in bundle and url.encode("utf-16-le") not in bundle]
    assert not missing, f"Active source URLs missing from compiled app: {missing}"
    assert all(label.encode() in bundle for label in ["Real photo", "Microscope photo", "Medical image"])
    result = {
        "path": str(args.path), "bytes": args.path.stat().st_size,
        "sha256": hashlib.file_digest(args.path.open("rb"), "sha256").hexdigest(),
        "zipIntegrity": "All entries passed CRC",
        "compiledActiveSourceUrls": len(urls),
        "compiledCleanHyperlinkLabels": True,
        "physicalDeviceTested": False,
    }
    if args.platform == "ios":
        root = bundles[0].rsplit("/", 1)[0]
        info = plistlib.loads(archive.read(root + "/Info.plist"))
        assert info["CFBundleIdentifier"] == "com.qaarla.boneefied"
        assert info["CFBundleVersion"] == "13"
        assert info["CFBundleShortVersionString"] == "1.0.0"
        provision = temp / "provision"
        provision.write_bytes(archive.read(root + "/embedded.mobileprovision"))
        profile = plistlib.loads(run("openssl", "cms", "-verify", "-inform", "DER", "-in", str(provision), "-noverify"))
        assert profile.get("ProvisionedDevices") and not profile["Entitlements"].get("get-task-allow", False)
        assert root + "/_CodeSignature/CodeResources" in archive.namelist()
        old_profile = next(name for name in previous.namelist() if name.endswith("/embedded.mobileprovision"))
        assert archive.read(root + "/embedded.mobileprovision") == previous.read(old_profile), "Provisioning changed"
        result.update({
            "bundleIdentifier": info["CFBundleIdentifier"], "version": info["CFBundleShortVersionString"],
            "buildNumber": info["CFBundleVersion"], "distribution": "Physical-device ad hoc",
            "provisioningMatchesPrevious": True,
        })
    else:
        assert b"com.qaarla.boneefied" in archive.read("base/manifest/AndroidManifest.xml")
        assert "BundleConfig.pb" in archive.namelist()
        fingerprint, rsa, rsa_name = certificate(archive, temp, "current")
        previous_fingerprint, _, _ = certificate(previous, temp, "previous")
        assert fingerprint == previous_fingerprint, "Android signing certificate changed"
        sf_name = rsa_name.rsplit(".", 1)[0] + ".SF"
        sf = temp / "signature.sf"
        sf.write_bytes(archive.read(sf_name))
        run("openssl", "smime", "-verify", "-inform", "DER", "-in", str(rsa),
            "-content", str(sf), "-binary", "-noverify", "-out", "/dev/null")
        manifest = archive.read("META-INF/MANIFEST.MF")
        assert base64.b64encode(hashlib.sha256(manifest).digest()) == fields(archive.read(sf_name))[b"SHA-256-Digest-Manifest"]
        signed = set()
        for section in manifest.replace(b"\r\n", b"\n").split(b"\n\n"):
            attrs = fields(section)
            if b"Name" not in attrs:
                continue
            name = attrs[b"Name"].decode()
            assert base64.b64encode(hashlib.sha256(archive.read(name)).digest()) == attrs[b"SHA-256-Digest"], name
            signed.add(name)
        unsigned = {i.filename for i in archive.infolist() if not i.is_dir()} - signed - {
            "META-INF/MANIFEST.MF", rsa_name, sf_name}
        assert not unsigned, f"Unsigned payloads: {unsigned}"
        result.update({
            "packageIdentifier": "com.qaarla.boneefied",
            "jarSignatureVerified": True, "signedEntryDigestsVerified": len(signed),
            "signingCertificateSha256": fingerprint, "signingCertificateMatchesPrevious": True,
        })
    print(json.dumps(result, indent=2))
