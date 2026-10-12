import Image from "next/image";
import "./landing.css";

const packageItems = [
  {
    number: "01",
    quantity: "ONE 60-SECOND VIDEO",
    title: "A promotional video",
    description:
      "A clear, engaging showcase for your business and offer. No on-camera appearance needed.",
    icon: "▶",
  },
  {
    number: "02",
    quantity: "FOUR BRANDED DESIGNS",
    title: "Social media creatives",
    description:
      "Four polished designs that help your business look consistent and ready to be noticed.",
    icon: "✳",
  },
  {
    number: "03",
    quantity: "ONE WHATSAPP FLYER",
    title: "An offer people can share",
    description:
      "A focused status flyer that puts your offer and next step in one easy-to-share place.",
    icon: "↗",
  },
  {
    number: "04",
    quantity: "TWO CAPTIONS",
    title: "Marketing copy that sounds like you",
    description:
      "Two persuasive captions to explain your value and invite customers to take action.",
    icon: "Aa",
  },
  {
    number: "05",
    quantity: "ONE FOCUSED PAGE",
    title: "A landing page built around your offer",
    description:
      "A clear home for your message, proof and call to action, designed to turn interest into enquiries.",
    icon: "▤",
  },
];

const workSamples = [
  {
    image: "/work/kbazz-design.webp",
    alt: "Promotional design for KBAZZ Apartments",
    name: "KBAZZ Apartments",
    category: "Hospitality · Social media design",
  },
  {
    image: "/work/aleeza-design.webp",
    alt: "Food promotion for Aleeza’s Kitchen",
    name: "Aleeza’s Kitchen",
    category: "Food · Promotional design",
  },
  {
    image: "/work/zenith-home-care.webp",
    alt: "Caregiver service promotion for Zenith Home Care",
    name: "Zenith Home Care",
    category: "Healthcare · Service promotion",
  },
  {
    image: "/work/zenith-training.webp",
    alt: "Training registration campaign for Zenith Training",
    name: "Zenith Training",
    category: "Education · Registration campaign",
  },
  {
    image: "/work/good-food.webp",
    alt: "Food social media design for Good Food, Brighter Days",
    name: "Good Food, Brighter Days",
    category: "Food · Social media design",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us what you do",
    description:
      "Message us on WhatsApp with your business, offer and the customers you want to reach.",
  },
  {
    number: "02",
    title: "Agree on the brief",
    description:
      "We confirm the scope, timing, payment and materials before creative work begins.",
  },
  {
    number: "03",
    title: "Get your boost",
    description:
      "We create your complete kit and deliver within 72 hours after we receive your onboarding materials.",
  },
];

export default function Home() {
  const phone = (process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "2349057831324").replace(
    /\D/g,
    ""
  );
  const message = encodeURIComponent(
    "Hello Eximius Kreativ Solutions, I’m interested in the ₦100,000 AI Business Boost package. Please confirm the scope and how to get started."
  );
  const whatsappUrl = `https://wa.me/${phone || "2349057831324"}?text=${message}`;

  return (
    <main className="boost-page">
      <div className="boost-topline">
        <div className="boost-wrap boost-topline-inner">
          <span>ONE COMPLETE CREATIVE KIT</span>
          <span>₦100,000 <i aria-hidden="true">·</i> 72-HOUR DELIVERY*</span>
        </div>
      </div>

      <header className="boost-header">
        <div className="boost-wrap boost-header-inner">
          <a className="boost-brand" href="#top" aria-label="Eximius Kreativ Solutions home">
            <span className="boost-brand-mark" aria-hidden="true">e</span>
            <span><strong>eximius</strong><small>KREATIV SOLUTIONS</small></span>
          </a>

          <nav className="boost-nav" aria-label="Main navigation">
            <a href="#package">The package</a>
            <a href="#work">Our work</a>
            <a href="#process">How it works</a>
            <a href="#faq">FAQs</a>
          </nav>

          <a className="boost-header-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section className="boost-hero" id="top">
        <div className="boost-wrap boost-hero-grid">
          <div className="boost-hero-copy">
            <p className="boost-kicker"><span /> AI BUSINESS BOOST PACKAGE</p>
            <h1>Your next customer is already scrolling.<br /><em>Give them a reason to stop.</em></h1>
            <p className="boost-hero-description">
              Make your business easier to notice, understand and choose with a promotional video,
              scroll-stopping designs, persuasive copy and a focused landing page.
            </p>

            <div className="boost-price-row">
              <strong>₦100,000</strong>
              <span>One complete package.<br />Everything working together.</span>
            </div>

            <div className="boost-actions">
              <a className="boost-button boost-button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                Build my business boost <span aria-hidden="true">↗</span>
              </a>
              <a className="boost-text-link" href="#work">See the work <span aria-hidden="true">↓</span></a>
            </div>

            <p className="boost-hero-note">Built around your offer. Made for the way customers browse today.</p>
          </div>

          <div className="boost-hero-art" aria-label="Examples of Eximius Kreativ Solutions design work">
            <div className="boost-art-backdrop" />
            <figure className="boost-art-main">
              <Image src="/work/aleeza-design.webp" alt="Aleeza’s Kitchen promotional design" width={1000} height={1250} priority sizes="(max-width: 760px) 70vw, 360px" />
            </figure>
            <figure className="boost-art-side">
              <Image src="/work/kbazz-design.webp" alt="KBAZZ Apartments promotional design" width={1000} height={1250} priority sizes="(max-width: 760px) 42vw, 240px" />
            </figure>
            <div className="boost-art-sticker"><span>YOUR BUSINESS,</span><strong>seen better.</strong></div>
            <div className="boost-art-caption"><span className="boost-live-dot" /> REAL WORK. REAL BUSINESSES.</div>
          </div>
        </div>
        <div className="boost-hero-bottom boost-wrap">
          <span>VIDEO</span><i /> <span>DESIGN</span><i /> <span>OFFER</span><i /> <span>LANDING PAGE</span>
          <span className="boost-hero-bottom-note">*Delivery starts after onboarding materials are received.</span>
        </div>
      </section>

      <section className="boost-package section-pad" id="package">
        <div className="boost-wrap">
          <div className="boost-section-heading">
            <div>
              <p className="boost-kicker"><span /> THE FULL PACKAGE</p>
              <h2>Five pieces.<br /><em>One stronger first impression.</em></h2>
            </div>
            <p className="boost-section-intro">
              Each part has a job: catch attention, make your offer clear and give people a simple next step.
            </p>
          </div>

          <div className="boost-package-list">
            {packageItems.map((item) => (
              <article className="boost-package-item" key={item.number}>
                <span className="boost-package-number">{item.number}</span>
                <span className="boost-package-icon" aria-hidden="true">{item.icon}</span>
                <div className="boost-package-content">
                  <p>{item.quantity}</p>
                  <h3>{item.title}</h3>
                  <span>{item.description}</span>
                </div>
                <span className="boost-package-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>

          <div className="boost-offer-bar">
            <div><span>YOUR COMPLETE BUSINESS BOOST</span><strong>All five deliverables · ₦100,000</strong></div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">Ask about your project <span aria-hidden="true">↗</span></a>
          </div>
          <p className="boost-small-note">Advertising spend, domain registration and hosting are separate. We’ll confirm the scope and any extra costs before you book.</p>
        </div>
      </section>

      <section className="boost-work section-pad" id="work">
        <div className="boost-wrap">
          <div className="boost-section-heading boost-work-heading">
            <div>
              <p className="boost-kicker"><span /> SELECTED WORK</p>
              <h2>Don’t imagine the difference.<br /><em>Take a look.</em></h2>
            </div>
            <p className="boost-section-intro">A few examples of how clear creative work can help different businesses show up with confidence.</p>
          </div>

          <div className="boost-work-grid">
            {workSamples.map((work, index) => (
              <a className={`boost-work-card boost-work-card-${index + 1}`} href={work.image} target="_blank" rel="noreferrer" key={work.name}>
                <div className="boost-work-image">
                  <Image src={work.image} alt={work.alt} width={1000} height={1250} sizes="(max-width: 700px) 90vw, (max-width: 1024px) 45vw, 31vw" />
                  <span aria-hidden="true">↗</span>
                </div>
                <div className="boost-work-meta"><strong>{work.name}</strong><span>{work.category}</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="boost-process section-pad" id="process">
        <div className="boost-wrap">
          <div className="boost-section-heading">
            <div>
              <p className="boost-kicker"><span /> EASY TO GET STARTED</p>
              <h2>From first message<br /><em>to ready-to-use creative.</em></h2>
            </div>
            <p className="boost-section-intro">We agree on the details first, so you know what’s included, what to send and when to expect delivery.</p>
          </div>

          <div className="boost-process-grid">
            {steps.map((step) => (
              <article className="boost-process-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="boost-faq section-pad" id="faq">
        <div className="boost-wrap boost-faq-grid">
          <div>
            <p className="boost-kicker"><span /> BEFORE YOU START</p>
            <h2>Good questions.<br /><em>Clear answers.</em></h2>
            <a className="boost-text-link" href={whatsappUrl} target="_blank" rel="noreferrer">Still unsure? Ask us on WhatsApp ↗</a>
          </div>

          <div className="boost-faq-list">
            <details>
              <summary>Is this package right for my business?</summary>
              <p>It’s designed for businesses with a specific product, service or offer to promote. Tell us what you do and who you want to reach; we’ll confirm the fit before you book.</p>
            </details>
            <details>
              <summary>When does the 72-hour delivery period begin?</summary>
              <p>After your onboarding materials are received and the brief is confirmed. We’ll agree on the schedule and required materials with you before work begins.</p>
            </details>
            <details>
              <summary>Are advertising, domain or hosting costs included?</summary>
              <p>The ₦100,000 covers the five creative deliverables listed above. Advertising spend, domain registration and hosting are separate and will be discussed before booking.</p>
            </details>
            <details>
              <summary>Do I need to appear in the promotional video?</summary>
              <p>No. The video can be created around your business, products, service and offer without an on-camera appearance.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="boost-close">
        <div className="boost-wrap boost-close-inner">
          <div>
            <p className="boost-kicker"><span /> YOUR NEXT MOVE</p>
            <h2>Let’s make your<br /><em>first impression count.</em></h2>
            <p>One complete creative kit for your business. Clear scope, clear price, one easy place to start.</p>
          </div>
          <div className="boost-close-card">
            <span>THE AI BUSINESS BOOST</span>
            <strong>₦100,000</strong>
            <a className="boost-button boost-button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">Start on WhatsApp <span aria-hidden="true">↗</span></a>
            <small>We’ll confirm the brief, timing and payment details together.</small>
          </div>
        </div>
      </section>

      <footer className="boost-footer">
        <div className="boost-wrap boost-footer-inner">
          <a className="boost-brand" href="#top" aria-label="Back to top">
            <span className="boost-brand-mark" aria-hidden="true">e</span>
            <span><strong>eximius</strong><small>KREATIV SOLUTIONS</small></span>
          </a>
          <a href="mailto:ekreativsolutions@gmail.com">ekreativsolutions@gmail.com</a>
          <span>© 2026 Eximius Kreativ Solutions</span>
        </div>
      </footer>

      <div className="boost-mobile-cta">
        <a href={whatsappUrl} target="_blank" rel="noreferrer">Start my boost · ₦100,000 <span aria-hidden="true">↗</span></a>
      </div>
    </main>
  );
}
