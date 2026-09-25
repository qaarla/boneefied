import { useState } from 'react';
import { ArrowUpRight, Check, Copy, ExternalLink } from 'lucide-react';
import logo from './assets/logo-rounded.png';

const BUILD_URL = 'https://expo.dev/accounts/qaarla1/projects/boneefied/builds/237a2c87-8456-4d73-b3d1-c098befee194';
const APP_URL = 'boneefied://';

function App() {
  const [qrFailed, setQrFailed] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const landingUrl = typeof window !== 'undefined'
    ? new URL(import.meta.env.BASE_URL, window.location.origin).href
    : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=264x264&margin=8&data=${encodeURIComponent(landingUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(landingUrl);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }

  return (
    <div className="site-shell">
      <main className="site-main" id="main">
        <header className="topbar">
          <div className="brand" aria-label="Boneefied">
            <img className="brand-logo" src={logo} alt="" width="36" height="36" />
            <span>Boneefied</span>
          </div>
          <span className="topbar-tag">Anatomy study app</span>
        </header>

        <section className="intro" aria-labelledby="page-title">
          <div className="eyebrow">Meet Boneefied</div>
          <h1 id="page-title">Anatomy takes practice.</h1>
          <p className="lead">Boneefied is an anatomy study app for learners. Open it on your phone to get started.</p>
        </section>

        <div className="steps">
          <section className="step" aria-labelledby="step-one">
            <div className="step-number" aria-hidden="true">01</div>
            <div>
              <h2 id="step-one">On your phone</h2>
              <p>Already have Boneefied installed? Open the app. If you’re part of the internal iPhone preview, use the build link below to install it first.</p>
              <div className="action-row">
                <a className="button button-primary" href={APP_URL} data-testid="link-open-app">
                  Open app <ArrowUpRight aria-hidden="true" />
                </a>
                <a className="button button-outline" href={BUILD_URL} target="_blank" rel="noopener noreferrer" data-testid="link-internal-preview">
                  Internal iPhone preview <ExternalLink aria-hidden="true" />
                </a>
              </div>
              <p className="subnote">The Open app button works only if Boneefied is installed. The preview is an internal iPhone build, not an App Store release.</p>
            </div>
          </section>

          <section className="step" aria-labelledby="step-two">
            <div className="step-number" aria-hidden="true">02</div>
            <div className="qr-section">
              <div>
                <h2 id="step-two">On another device?</h2>
                <p>Scan this code with your phone to open this page there. From your phone, you can open the installed app or visit the internal preview link above.</p>
              </div>
              <div className="qr-frame" aria-label={qrFailed ? 'QR code unavailable' : 'QR code for this page'}>
                {qrFailed ? (
                  <span className="qr-failed" data-testid="status-qr-unavailable">QR unavailable.<br />Use the link below.</span>
                ) : (
                  <img src={qrUrl} width="132" height="132" alt="Scan to open this page on your phone" onError={() => setQrFailed(true)} data-testid="img-landing-qr" />
                )}
              </div>
            </div>
            <div style={{ gridColumn: '2' }}>
              <div className="url-row">
                <a className="url-field" href={landingUrl} data-testid="link-landing-url" title={landingUrl}><span>{landingUrl}</span></a>
                <button type="button" className="button copy-button" onClick={copyLink} data-testid="button-copy-link">
                  {copyStatus === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  {copyStatus === 'copied' ? 'Copied' : 'Copy link'}
                </button>
              </div>
              {copyStatus === 'failed' && <p className="subnote" role="status" data-testid="status-copy-failed">Couldn’t copy automatically. Open or select the link above to share it.</p>}
            </div>
          </section>
        </div>
      </main>
      <footer className="footer">
        <span>Boneefied · Anatomy, practiced.</span>
        <span>Built for learning on your phone.</span>
      </footer>
    </div>
  );
}

export default App;