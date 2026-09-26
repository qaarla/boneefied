import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, ChartNoAxesColumn, Check, Copy, ExternalLink, RotateCcw, Target } from 'lucide-react';
import logo from './assets/logo-rounded.png';

const BUILD_URL = 'https://expo.dev/accounts/qaarla1/projects/boneefied/builds/237a2c87-8456-4d73-b3d1-c098befee194';
const APP_URL = 'boneefied://';

const features = [
  {
    number: '01',
    title: 'Study by system',
    description: 'Explore anatomy through learning modules and find the structures you need to know.',
    icon: BookOpen,
  },
  {
    number: '02',
    title: 'Practice recall',
    description: 'Move from reading to answering questions, so you can check what actually sticks.',
    icon: Target,
  },
  {
    number: '03',
    title: 'Return to what you missed',
    description: 'Review missed questions instead of losing track of the things that need another look.',
    icon: RotateCcw,
  },
  {
    number: '04',
    title: 'See your progress',
    description: 'Keep an eye on your learning, bookmark structures, and study with offline-ready content.',
    icon: ChartNoAxesColumn,
  },
];

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
            <img className="brand-logo" src={logo} alt="" width="37" height="37" />
            <span>Boneefied</span>
          </div>
          <nav className="topnav" aria-label="Page navigation">
            <a href="#product" data-testid="link-nav-product">The app</a>
            <a className="nav-access" href="#phone-access" data-testid="link-nav-phone-access">Get on your phone <ArrowUpRight aria-hidden="true" /></a>
          </nav>
        </header>

        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <div className="eyebrow">A study companion for anatomy learners</div>
            <h1 id="page-title">Comprehensive <em>anatomy</em> study.</h1>
            <p className="lead">Boneefied is an anatomy study app for learning structures, practicing recall, and coming back to what you missed.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#phone-access" data-testid="link-hero-phone-access">Get on your phone <ArrowRight aria-hidden="true" /></a>
              <a className="button button-outline" href="#product" data-testid="link-hero-product">Explore the app <ArrowRight aria-hidden="true" /></a>
            </div>
            <p className="hero-note">Study a little. Remember more.</p>
          </div>
          <div className="hero-art" aria-label="Boneefied skull and atom emblem on a mustard study diagram" role="img">
            <div className="art-top">
              <span className="art-label">Boneefied / Study notes</span>
              <span className="art-mark">No. 01</span>
            </div>
            <div className="art-center" aria-hidden="true">
              <span className="orbit" />
              <span className="orbit two" />
              <span className="orbit three" />
              <span className="art-dot a" />
              <span className="art-dot b" />
              <img className="art-logo" src={logo} alt="" />
            </div>
            <div className="art-bottom">
              <span className="art-foot">Observe · Recall · Review</span>
              <span>Made for the curious mind.</span>
            </div>
          </div>
        </section>

        <section className="product" id="product" aria-labelledby="product-title">
          <div className="product-intro">
            <span className="section-kicker">Inside the app</span>
            <h2 id="product-title">A better way to come back to it.</h2>
            <p>Good study is a cycle, not a straight line. Boneefied keeps the essentials close as you learn.</p>
          </div>
          <div>
            <div className="feature-list">
              {features.map(({ number, title, description, icon: Icon }) => (
                <div className="feature" key={number}>
                  <span className="feature-index">{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <Icon className="feature-icon" aria-hidden="true" />
                </div>
              ))}
            </div>
            <p className="product-foot">From first look to the next review.</p>
          </div>
        </section>

        <section className="access" id="phone-access" aria-labelledby="access-title">
          <div className="access-header">
            <div>
              <span className="section-kicker">Phone access</span>
              <h2 id="access-title">Take it with you.</h2>
            </div>
            <p>Already have Boneefied installed? Open it directly. For the internal iPhone preview, use the build link below.</p>
          </div>
          <div className="steps">
            <section className="step" aria-labelledby="step-one">
              <div className="step-number" aria-hidden="true">01 /</div>
              <div>
                <h3 id="step-one">On your phone</h3>
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
                <a className="expo-link" href="/expo" data-testid="link-expo-go">Looking for the Expo Go QR? Open the Expo Go page <ArrowUpRight size={13} aria-hidden="true" /></a>
              </div>
            </section>

            <section className="step" aria-labelledby="step-two">
              <div className="step-number" aria-hidden="true">02 /</div>
              <div>
                <div className="qr-section">
                  <div>
                    <h3 id="step-two">On another device?</h3>
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
        </section>
      </main>
      <footer className="footer">
        <span>Boneefied · Anatomy, practiced.</span>
        <a href="#main" data-testid="link-back-to-top">Back to top ↑</a>
      </footer>
    </div>
  );
}

export default App;