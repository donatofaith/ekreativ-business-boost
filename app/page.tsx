import ScrollReveal from "@/components/ScrollReveal";

const packageItems = [
  {
    number: "01",
    title: "AI-Powered Promotional Video",
    description:
      "A premium promotional video built around your business, offer and target audience.",
  },
  {
    number: "05",
    title: "Social Media Designs",
    description:
      "Five professional branded graphics created to promote your products, services or offers.",
  },
  {
    number: "01",
    title: "WhatsApp Status Ad",
    description:
      "A focused promotional flyer designed specifically for WhatsApp visibility and enquiries.",
  },
  {
    number: "03",
    title: "Marketing Copies",
    description:
      "Three persuasive captions or promotional copies tailored to your business goals.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us about your business",
    description:
      "Complete a short guided onboarding so we understand your business, audience and goals.",
  },
  {
    number: "02",
    title: "Share your brand materials",
    description:
      "Upload your logo, photos, product information and any existing brand assets.",
  },
  {
    number: "03",
    title: "We create your content",
    description:
      "Your information is transformed into strategic, professionally designed marketing content.",
  },
  {
    number: "04",
    title: "Receive your package",
    description:
      "Your complete Business Boost package is delivered within 72 hours after payment and materials are received.",
  },
];

export default function Home() {
  return (
    <main>
      <ScrollReveal />

      {/* HEADER */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="#" className="brand" aria-label="eKreativ Solutions home">
            <span className="brand-mark">e</span>

            <span className="brand-copy">
              <strong>ekreativ</strong>
              <small>SOLUTIONS</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#package">What You Get</a>
            <a href="#process">How It Works</a>
            <a href="#about">Why Business Boost</a>
          </nav>

          <a href="/onboarding" className="header-cta">
            Start Your Project
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid"></div>

        <div className="hero-orb hero-orb-one"></div>
        <div className="hero-orb hero-orb-two"></div>

        <div className="hero-rings" aria-hidden="true">
          <span className="hero-ring hero-ring-one"></span>
          <span className="hero-ring hero-ring-two"></span>
          <span className="hero-ring hero-ring-three"></span>
        </div>

        <div className="container hero-layout">
          <div className="hero-content">
            <div className="eyebrow">
              <span></span>
              AI BUSINESS GROWTH PACKAGE
            </div>

            <h1>
              Turn your business into a
              <span> stronger digital brand.</span>
            </h1>

            <p className="hero-description">
              Get professionally created AI-powered marketing content designed
              to improve your visibility, attract more customers and help your
              business sell better online.
            </p>

            <div className="hero-actions">
              <a href="/onboarding" className="primary-button">
                Start My Business Boost
                <span aria-hidden="true">→</span>
              </a>

              <a href="#package" className="secondary-button">
                See What You&apos;ll Get
              </a>
            </div>

            <div className="hero-trust">
              <div>
                <strong>72hrs</strong>
                <span>Delivery Timeline</span>
              </div>

              <div>
                <strong>10</strong>
                <span>Marketing Assets</span>
              </div>

              <div>
                <strong>₦50K</strong>
                <span>Complete Package</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-shell">
              <div className="visual-topbar">
                <span className="visual-dot"></span>
                <span>AI Business Boost</span>
                <span className="visual-live">LIVE</span>
              </div>

              <div className="visual-body">
                <div className="visual-heading">
                  <span>BUSINESS GROWTH</span>
                  <strong>BOOST</strong>
                </div>

                <div className="growth-card main-growth-card">
                  <div>
                    <small>Campaign Potential</small>
                    <strong>+248%</strong>
                  </div>

                  <div className="chart" aria-hidden="true">
                    <span style={{ height: "28%" }}></span>
                    <span style={{ height: "42%" }}></span>
                    <span style={{ height: "52%" }}></span>
                    <span style={{ height: "70%" }}></span>
                    <span style={{ height: "84%" }}></span>
                    <span style={{ height: "100%" }}></span>
                  </div>
                </div>

                <div className="mini-card mini-card-left">
                  <span>CONTENT</span>
                  <strong>5 Designs</strong>
                </div>

                <div className="mini-card mini-card-right">
                  <span>VIDEO</span>
                  <strong>AI Powered</strong>
                </div>

                <div className="phone-card">
                  <div className="phone-notch"></div>

                  <div className="phone-content">
                    <span>YOUR BUSINESS</span>
                    <strong>Deserves More Visibility.</strong>

                    <div className="phone-button">Boost Now</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-badge">
              <span>LIMITED OFFER</span>
              <strong>₦50,000</strong>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGE */}
      <section className="package-section" id="package">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">WHAT YOU&apos;LL GET</span>

              <h2>
                Everything you need to give your business a stronger
                <span> digital presence.</span>
              </h2>
            </div>

            <p>
              One focused package combining visual content, promotional
              materials and marketing copy for your business.
            </p>
          </div>

          <div className="package-grid">
            {packageItems.map((item) => (
              <article className="package-card" key={item.title}>
                <div className="package-number">{item.number}</div>

                <div className="package-icon">
                  <span></span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="delivery-strip">
            <div>
              <span className="delivery-icon">↗</span>

              <div>
                <small>FAST DELIVERY</small>
                <strong>Everything delivered within 72 hours</strong>
              </div>
            </div>

            <a href="/onboarding">
              Get Started
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-section" id="process">
        <div className="container">
          <div className="process-intro">
            <span className="section-label">HOW IT WORKS</span>

            <h2>
              A simple process from your idea to finished content.
            </h2>
          </div>

          <div className="process-grid">
            {steps.map((step) => (
              <article className="process-card" key={step.number}>
                <span className="process-number">{step.number}</span>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="container about-layout">
          <div className="about-copy">
            <span className="section-label">
              BUILT FOR SMALL BUSINESSES
            </span>

            <h2>
              Marketing should help your business move, not just
              <span> look good.</span>
            </h2>

            <p>
              The AI Business Boost Plan combines strategy, design and
              AI-powered production to create marketing materials that have a
              clear purpose — helping people notice your business and take
              action.
            </p>

            <div className="about-list">
              <div>
                <span>✓</span>
                Built around your actual business
              </div>

              <div>
                <span>✓</span>
                Designed with your brand identity
              </div>

              <div>
                <span>✓</span>
                Focused on enquiries, visibility and sales
              </div>
            </div>
          </div>

          <div className="price-card">
            <span className="price-label">
              LIMITED-TIME PACKAGE
            </span>

            <div className="price">
              <small>₦</small>
              <strong>50,000</strong>
            </div>

            <p>
              One complete marketing boost package for your business.
            </p>

            <ul>
              <li>AI promotional video</li>
              <li>5 social media graphics</li>
              <li>WhatsApp status ad</li>
              <li>3 marketing copies</li>
              <li>72-hour delivery</li>
            </ul>

            <a href="/onboarding">
              Start My Project
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section" id="get-started">
        <div className="container">
          <div className="cta-panel">
            <div className="cta-glow"></div>

            <div>
              <span>READY WHEN YOU ARE</span>

              <h2>
                Let&apos;s build your
                <br />
                Business Boost.
              </h2>

              <p>
                Tell us about your business and we&apos;ll use your answers to
                create a package tailored to your goals.
              </p>
            </div>

            <a href="/onboarding">
              Start Your Onboarding
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container footer-inner">
          <div className="brand footer-brand">
            <span className="brand-mark">e</span>

            <span className="brand-copy">
              <strong>ekreativ</strong>
              <small>SOLUTIONS</small>
            </span>
          </div>

          <p>Smart Tools. Better Strategies. Bigger Results.</p>

          <span>© 2026 eKreativ Solutions</span>
        </div>
      </footer>
    </main>
  );
}