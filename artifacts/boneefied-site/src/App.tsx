import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Bookmark, ChartNoAxesColumn, Check, Copy, Crosshair, ExternalLink, HardDrive, RotateCcw, Search, Target } from 'lucide-react';
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

const tabs = [
  { number: '01', name: 'Study', detail: 'Browse learning modules by system and look up anatomy structures.', icon: BookOpen },
  { number: '02', name: 'Practice', detail: 'Answer questions to test recall, including visual questions where supported.', icon: Target },
  { number: '03', name: 'Missed', detail: 'Retry incorrect answers; a later correct recall clears the review queue.', icon: RotateCcw },
  { number: '04', name: 'Progress', detail: 'See your attempts, accuracy, and structure-level coverage on this device.', icon: ChartNoAxesColumn },
];

const coverageGroups = [
  'Cells & tissues · Integumentary',
  'Skeletal · Joints & ligaments · Muscular',
  'Nervous system & brain · Cranial & peripheral nerves · Special senses',
  'Endocrine',
  'Blood & cardiovascular · Blood vessels · Lymphatic · Respiratory',
  'Digestive · Urinary',
  'Male reproductive · Female reproductive',
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

        <section className="workflow content-section" aria-labelledby="workflow-title">
          <div className="content-heading">
            <div>
              <span className="section-kicker">The four tabs</span>
              <h2 id="workflow-title">One learning loop. Four places to go.</h2>
            </div>
            <p>Start with a system, test your recall, revisit an error, then see what has changed.</p>
          </div>
          <div className="workflow-grid">
            {tabs.map(({ number, name, detail, icon: Icon }) => (
              <div className="workflow-card" key={name}>
                <div className="workflow-top"><span>{number} / Tab</span><Icon aria-hidden="true" /></div>
                <h3>{name}</h3>
                <p>{detail}</p>
              </div>
            ))}
          </div>
          <p className="workflow-note"><span>→</span> The Missed queue tracks incorrect answers; Progress keeps the record of attempts.</p>
        </section>

        <section className="explore content-section" aria-labelledby="explore-title">
          <div className="explore-copy">
            <span className="section-kicker">Finding your place</span>
            <h2 id="explore-title">Look up a structure. Keep it close.</h2>
            <p>Study includes anatomy search by structure name or accepted alias, alongside browsing by system. Save a structure as a bookmark to come back to it locally.</p>
            <ul className="explore-points">
              <li><Search aria-hidden="true" /> Search across structure names and accepted aliases</li>
              <li><Bookmark aria-hidden="true" /> Bookmark structures on your device</li>
            </ul>
          </div>
          <div className="search-illustration" aria-label="Illustration of the Study search and bookmark flow">
            <div className="illustration-head"><span>Study / Search</span><span>01—02</span></div>
            <div className="search-field-demo"><Search aria-hidden="true" /><span>Search anatomy</span></div>
            <div className="search-result-demo">
              <div><strong>Find a structure</strong><small>By name or accepted alias</small></div>
              <span className="bookmark-demo"><Bookmark aria-hidden="true" /></span>
            </div>
            <p className="illustration-foot">A simple illustration of the flow, not an app screenshot.</p>
          </div>
        </section>

        <section className="coverage content-section" aria-labelledby="coverage-title">
          <div className="content-heading">
            <div>
              <span className="section-kicker">Explore by system</span>
              <h2 id="coverage-title">The body, in broad strokes.</h2>
            </div>
            <p>Seventeen system filters, grouped here into seven easy-to-scan territories.</p>
          </div>
          <div className="coverage-board">
            {coverageGroups.map((group, index) => (
              <div className="coverage-item" key={group}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{group}</p>
              </div>
            ))}
          </div>
          <p className="coverage-foot">Filters are an overview of topics, not a promise of equal module or visual coverage in every system.</p>
        </section>

        <section className="formats content-section" aria-labelledby="formats-title">
          <div className="formats-art" aria-hidden="true">
            <div className="format-tile visual">
              <span className="format-label">When supported</span>
              <span className="format-symbol"><Crosshair /></span>
              <strong>See it.<br />Identify it.</strong>
            </div>
            <div className="format-tile textual">
              <span className="format-label">Always legible</span>
              <span className="format-lines"><span /><span /><span /><span /></span>
              <strong>Read it.<br />Recall it.</strong>
            </div>
          </div>
          <div className="formats-copy">
            <span className="section-kicker">How the material works</span>
            <h2 id="formats-title">Visual when it helps. Text when it belongs.</h2>
            <p>Supported modules and questions can use source-linked educational images for identification, verified hotspots, and histology examples. Visual assets are not assigned to every module; the rest stays text-first.</p>
            <p className="format-rule">Questions and explanations connect back to source material, so practice is more than a right-or-wrong answer.</p>
            <div className="local-note"><HardDrive aria-hidden="true" /><p><strong>Designed for local study.</strong> Content is bundled for offline-first use, and your attempts, bookmarks, and progress are kept on your device.</p></div>
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