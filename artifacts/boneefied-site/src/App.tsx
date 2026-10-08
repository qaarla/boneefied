import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Bookmark, ChartNoAxesColumn, Check, Copy, Crosshair, ExternalLink, HardDrive, RotateCcw, Search, Smartphone, Target } from 'lucide-react';
import logo from './assets/logo-rounded.png';

const BUILD_URL = 'https://expo.dev/accounts/qaarla1/projects/boneefied/builds/28cb24df-2529-4138-82f5-84fe25959cab';
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
            <a href="#support" data-testid="link-nav-support">Support</a>
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
              <h2 id="access-title">Study on your phone.</h2>
            </div>
            <p>Boneefied is available as an internal phone preview, not a public App Store or Google Play release. Choose how you’d like to get there.</p>
          </div>
          <div className="access-grid">
            <section className="access-phone" aria-labelledby="step-one">
              <div className="access-card-top"><span>01 / Phone preview</span><Smartphone aria-hidden="true" /></div>
              <h3 id="step-one">Already installed?</h3>
              <p>On your phone, tap below to open your installed Boneefied preview. Nothing opens automatically.</p>
              <a className="button access-open-button" href={APP_URL} data-testid="link-open-app">
                Open Boneefied <ArrowUpRight aria-hidden="true" />
              </a>
              <div className="access-fallback">
                <span className="access-fallback-label">If nothing opens</span>
                <p>The app may not be installed on this phone. If you have access to the internal iPhone preview, open the build page to install it. Looking for the Expo Go flow instead? Visit its separate page.</p>
                <div className="access-fallback-links">
                  <a href={BUILD_URL} target="_blank" rel="noopener noreferrer" data-testid="link-internal-preview">
                    Internal iPhone build <ExternalLink aria-hidden="true" />
                  </a>
                  <a href="/expo" data-testid="link-expo-go">
                    Expo Go page <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </div>
            </section>

            <section className="access-share" aria-labelledby="step-two">
              <div className="access-card-top"><span>02 / From your desktop</span><span className="access-share-mark" aria-hidden="true">↗</span></div>
              <h3 id="step-two">Send this page to your phone.</h3>
              <p>Scan the QR code with your phone’s camera. It opens this website, not the app; then choose a phone action above.</p>
              <div className="access-qr-area">
                <div className="qr-frame" aria-label={qrFailed ? 'QR code unavailable' : 'QR code linking to this website page'}>
                  {qrFailed ? (
                    <span className="qr-failed" data-testid="status-qr-unavailable">QR unavailable.<br />Use the link below.</span>
                  ) : (
                    <img src={qrUrl} width="132" height="132" alt="Scan to open this website page on your phone" onError={() => setQrFailed(true)} data-testid="img-landing-qr" />
                  )}
                </div>
                <span className="access-qr-caption">SCAN TO OPEN THIS PAGE<br />ON YOUR PHONE</span>
              </div>
              <div className="access-share-bottom">
                <span className="access-share-label">Or share the page link</span>
                <div className="url-row">
                  <a className="url-field" href={landingUrl} data-testid="link-landing-url" title={landingUrl} aria-label={`Open this website page: ${landingUrl}`}><span>{landingUrl}</span></a>
                  <button type="button" className="button copy-button" onClick={copyLink} aria-label={copyStatus === 'copied' ? 'Page link copied' : 'Copy page link'} data-testid="button-copy-link">
                    {copyStatus === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                    {copyStatus === 'copied' ? 'Copied' : 'Copy link'}
                  </button>
                </div>
                <span className="access-copy-status" role="status" aria-live="polite" data-testid="status-copy-link">
                  {copyStatus === 'copied' ? 'Page link copied to clipboard.' : copyStatus === 'failed' ? 'Couldn’t copy automatically. Right-click or long-press the link above to copy its address.' : ''}
                </span>
                {copyStatus === 'failed' && <span className="sr-only" data-testid="status-copy-failed">Copy failed</span>}
              </div>
            </section>
          </div>
        </section>

        <div className="about-support">
          <section className="about-copy" id="about" aria-labelledby="about-title">
            <span className="section-kicker">About Boneefied</span>
            <h2 id="about-title">A place to keep learning.</h2>
            <p>Boneefied helps anatomy learners study structures, practice recall, and return to questions they missed. Core anatomy content is bundled with the app for offline-first study.</p>
            <p>Bookmarks, attempts, and progress are kept locally on the device you use. If the app or its data is removed, your study history may no longer be available.</p>
          </section>
          <section className="support-card" id="support" aria-labelledby="support-title">
            <span className="section-kicker">Questions or feedback?</span>
            <h2 id="support-title">We’re here to help.</h2>
            <p>Having trouble with the preview, or want to share something you noticed? Send us a note.</p>
            <a className="support-email" href="mailto:help@boneefied.com" data-testid="link-support-email">help@boneefied.com <ArrowUpRight aria-hidden="true" /></a>
          </section>
        </div>
      </main>
      <footer className="footer">
        <div>
          <div className="footer-identity">
            <img src={logo} alt="" width="34" height="34" />
            <span>Boneefied</span>
          </div>
          <p className="footer-meta">Boneefied · Anatomy, practiced. &nbsp;© {new Date().getFullYear()} Boneefied.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#about" data-testid="link-footer-about">About</a>
          <a href="#support" data-testid="link-footer-support">Support</a>
          <a href="mailto:help@boneefied.com" data-testid="link-footer-contact">Contact</a>
          <a href="#main" data-testid="link-back-to-top">Back to top ↑</a>
        </nav>
      </footer>
    </div>
  );
}

export default App;