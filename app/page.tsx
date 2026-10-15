import Image from "next/image";
import NewsletterForm from "./NewsletterForm"; // newsletter signup component
import ScrollMotion from "./ScrollMotion"; // client-side scroll reveal animations
import "./landing.css";

const deliverables = [
  {
    number: "01",
    title: "1 promotional video (60 seconds)",
    detail: "One 60-second promotional video",
    description: "Show what you sell and why customers should care.",
    tag: "VIDEO",
  },
  {
    number: "02",
    title: "4 professional designs for your business",
    detail: "Four branded social media designs",
    description: "Ready-to-post promotional content for your business.",
    tag: "4 DESIGNS",
  },
  {
    number: "03",
    title: "1 WhatsApp status flyer",
    detail: "One WhatsApp status flyer",
    description: "Share your offer with contacts and groups.",
    tag: "FLYER",
  },
  {
    number: "04",
    title: "2 sales captions for your posts",
    detail: "Two marketing captions",
    description: "Save time deciding what to write with your posts.",
    tag: "2 CAPTIONS",
  },
  {
    number: "05",
    title: "1 sales page",
    detail: "One focused landing page",
    description: "Put your offer and order button in one place.",
    tag: "WEB PAGE",
  },
];

const workSamples = [
  { image: "/work/kbazz-design.webp", alt: "KBAZZ Apartments social media design", name: "KBAZZ Apartments", type: "Hospitality" },
  { image: "/work/aleeza-design.webp", alt: "Aleeza’s Kitchen promotional design", name: "Aleeza’s Kitchen", type: "Food & hospitality" },
  { image: "/work/zenith-home-care.webp", alt: "Zenith Home Care service promotion", name: "Zenith Home Care", type: "Healthcare" },
  { image: "/work/zenith-training.webp", alt: "Zenith Training registration campaign", name: "Zenith Training", type: "Education" },
  { image: "/work/good-food.webp", alt: "Good Food, Brighter Days social media design", name: "Good Food, Brighter Days", type: "Food & hospitality" },
];

const videoDemos = [
  {
    title: "Aleeza’s Kitchen",
    kind: "Website showcase",
    length: "40 seconds",
    poster: "/work/aleeza-design.webp",
    src: "/videos/aleeza-kitchen-showcase.mp4",
  },
  {
    title: "KBAZZ Apartments",
    kind: "Website showcase",
    length: "40 seconds",
    poster: "/work/kbazz-design.webp",
    src: "/videos/kbazz-apartments-showcase.mp4",
  },
];

const steps = [
  { number: "01", title: "Tell us what you’re selling", text: "Share your business, your offer and who you want to reach." },
  { number: "02", title: "Confirm your business details", text: "We agree on what’s included, what we need from you and when it will be ready." },
  { number: "03", title: "Receive your files and start promoting", text: "We confirm the delivery schedule with you before work begins." },
];

export default function Home() {
  const phone = (process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "2349057831324").replace(/\D/g, "");
  const message = encodeURIComponent(
    "Hello, I’m interested in the ₦100,000 Business Boost package. How do I place my order?"
  );
  const whatsappUrl = `https://wa.me/${phone || "2349057831324"}?text=${message}`;

  return (
    <main className="studio-page" id="top">
      <ScrollMotion />
      <header className="studio-header">
        <a className="studio-wordmark studio-wordmark-image" href="#top" aria-label="Eximius Kreativ Solutions home">
          <Image src="/eximius-kreativ-logo.svg" alt="Eximius Kreativ Solutions" width={230} height={63} priority />
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Our work</a>
          <a href="#package">What you get</a>
          <a href="#steps">How to order</a>
        </nav>
        <a className="studio-nav-cta" href={whatsappUrl} target="_blank" rel="noreferrer">Order on WhatsApp <span>↗</span></a>
      </header>

      <section className="studio-hero">
        <div className="studio-hero-copy">
          <p className="studio-eyebrow"><span className="studio-pulse" /> THE BUSINESS BOOST PACKAGE</p>
          <h1>Give customers more reasons to choose your business.</h1>
          <p className="studio-lede">Get a 60-second promotional video, 4 social media designs, a WhatsApp flyer, 2 sales captions and a page where customers can view your offer and contact you — all for <strong>₦100,000.</strong></p>
          <div className="studio-hero-actions">
            <a className="studio-button studio-button-dark" href={whatsappUrl} target="_blank" rel="noreferrer">Order on WhatsApp — ₦100,000 <span>↗</span></a>
            <a className="studio-scroll-link" href="#work"><span className="studio-play-mark">▶</span> See examples of our work</a>
          </div>
          <p className="studio-delivery-note">We’ll confirm your requirements, payment terms and delivery schedule before work begins.</p>
        </div>

        <div className="studio-hero-art" aria-label="Recent creative work for Eximius clients">
          <div className="studio-art-label studio-art-label-top">GOOD IDEAS<br />DESERVE GOOD DESIGN.</div>
          <div className="studio-hero-image studio-hero-image-back"><Image src="/work/kbazz-design.webp" alt="KBAZZ Apartments promotional design" width={1000} height={1250} priority sizes="(max-width: 800px) 40vw, 260px" /></div>
          <div className="studio-hero-image studio-hero-image-front"><Image src="/work/aleeza-design.webp" alt="Aleeza’s Kitchen promotional design" width={1000} height={1250} priority sizes="(max-width: 800px) 55vw, 360px" /></div>
          <div className="studio-art-stamp"><span>YOUR NEXT</span><strong>BIG<br />LOOK</strong><span>STARTS HERE ↗</span></div>
          <div className="studio-art-label studio-art-label-bottom">SELECTED WORK<br /><b>01 — 05</b></div>
          <span className="studio-art-star" aria-hidden="true">✳</span>
        </div>
        <div className="studio-hero-footer"><span>DESIGN THAT GETS TO THE POINT</span><span>SCROLL TO SEE THE WORK ↓</span></div>
      </section>

      <section className="studio-work" id="work">
        <div className="studio-section-head studio-work-head">
          <div><p className="studio-eyebrow">SELECTED WORK</p><h2>See examples of<br />our work<span>.</span></h2></div>
          <p>Browse our designs. Watch the videos.</p>
        </div>
        <div className="studio-work-marquee" aria-label="Selected work samples">
          <div className="studio-work-track">
            {[...workSamples, ...workSamples].map((item, index) => (
              <a
                className="studio-work-card"
                href={item.image}
                target="_blank"
                rel="noreferrer"
                key={`${item.name}-${index}`}
              >
                <div className="studio-work-thumb">
                  <Image src={item.image} alt={item.alt} width={1000} height={1250} sizes="(max-width: 700px) 72vw, 300px" />
                  <span aria-hidden="true">↗</span>
                </div>
                <div className="studio-work-caption">
                  <div><strong>{item.name}</strong><small>{item.type}</small></div>
                  <span>0{(index % workSamples.length) + 1}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="studio-reel-heading"><div><p className="studio-eyebrow">PRESS PLAY</p><h3>Good work moves.</h3></div><p>These are website showcases. A sample of the included 60-second promotional video will be added when available.</p></div>
        <div className="studio-reel-grid">
          {videoDemos.map((demo, index) => (
            <article className="studio-reel-card" key={demo.title}>
              <div className="studio-video-frame">
                <video controls playsInline preload="metadata" poster={demo.poster} aria-label={`${demo.title} ${demo.kind} demo`}>
                  <source src={demo.src} type="video/mp4" />
                  Your browser does not support embedded videos.
                </video>
                <span className="studio-video-index">REEL 0{index + 1}</span>
              </div>
              <div className="studio-reel-meta"><div><strong>{demo.title}</strong><span>{demo.kind}</span></div><small>{demo.length}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-package" id="package">
        <div className="studio-package-intro">
          <p className="studio-eyebrow">THE ₦100,000 PACKAGE</p>
          <h2>Here’s what you get</h2>
          <p>Five types of promotional materials, made to help you explain your offer and make it easier for customers to contact you.</p>
          <div className="studio-price-card"><span>ONE COMPLETE PACKAGE</span><strong>₦100,000</strong><small>All five deliverables included</small><a href={whatsappUrl} target="_blank" rel="noreferrer">Order on WhatsApp ↗</a></div>
          <p className="studio-cost-note">Advertising, domain registration and hosting are not included. We’ll explain how your sales page can go live and confirm any extra or recurring costs before you order.</p>
        </div>
        <div className="studio-deliverable-list">
          {deliverables.map((item) => (
            <article className="studio-deliverable" key={item.number}>
              <span className="studio-deliverable-number">{item.number}</span>
              <div className="studio-deliverable-copy"><h3>{item.title}</h3><strong>{item.detail}</strong><p>{item.description}</p></div>
              <span className="studio-deliverable-tag">{item.tag}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-steps" id="steps">
        <div className="studio-section-head"><div><p className="studio-eyebrow">NO GUESSWORK</p><h2>How to order<span>.</span></h2></div><p>We align on the details before anything gets made.</p></div>
        <div className="studio-steps-grid">
          {steps.map((step) => <article className="studio-step" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
        </div>
      </section>

      <section className="studio-faq" id="faq">
        <div className="studio-faq-lead"><p className="studio-eyebrow">BEFORE YOU SAY HELLO</p><h2>A few things<br />you might ask<span>.</span></h2><a href={whatsappUrl} target="_blank" rel="noreferrer">Order on WhatsApp ↗</a></div>
        <div className="studio-faq-list">
          <details><summary>Is this right for my kind of business?</summary><p>It’s built for businesses with a specific product, service or offer to promote. Tell us what you do and who you want to reach; we’ll confirm it’s a good fit before you book.</p></details>
          <details><summary>When does the 72-hour delivery start?</summary><p>Once we have your onboarding materials and have confirmed the brief. We’ll agree on the start time and schedule with you before work begins.</p></details>
          <details><summary>Are ads, domain and hosting included?</summary><p>The package includes the five creative deliverables on this page. Advertising, domain registration and hosting costs are separate and confirmed with you first.</p></details>
          <details><summary>Is full payment required or can I pay a deposit?</summary><p>Please ask us on WhatsApp to confirm the payment terms before ordering.</p></details>
          <details><summary>How many rounds of changes are included?</summary><p>We’ll confirm the number of revisions before your order is placed.</p></details>
          <details><summary>What do I need to provide?</summary><p>Tell us about your business and offer. We’ll confirm the photos, logo, text and other materials needed for your order.</p></details>
          <details><summary>Does the 72-hour timeline cover drafts or final delivery?</summary><p>Please confirm the exact delivery schedule and whether it covers drafts or completed files before ordering.</p></details>
          <details><summary>How will my sales page go live?</summary><p>Domain and hosting are not included. We’ll explain publishing options and any additional or ongoing costs before you order.</p></details>
          <details><summary>Do I need to appear in the video?</summary><p>No. We can build it around your products, service and offer without an on-camera appearance.</p></details>
        </div>
      </section>

      <section className="studio-newsletter" id="newsletter">
        <div className="studio-newsletter-copy">
          <p className="studio-eyebrow">OCCASIONAL BUSINESS TIPS</p>
          <h2>Useful ideas for<br /><em>your next move.</em></h2>
          <p>Get practical marketing tips, business updates and new offers from Eximius Kreativ Solutions. No spam, and you can unsubscribe at any time.</p>
        </div>
        <NewsletterForm />
      </section>

      <section className="studio-close">
        <p className="studio-eyebrow">YOUR BUSINESS IS READY FOR ITS CLOSE-UP</p>
        <h2>Ready to promote<br /><em>your business?</em></h2>
        <p>One package. Clear details. Order directly on WhatsApp.</p>
        <a className="studio-button studio-button-light" href={whatsappUrl} target="_blank" rel="noreferrer">Order on WhatsApp <span>↗</span></a>
        <div className="studio-close-orbit" aria-hidden="true">EK</div>
      </section>

      <footer className="studio-footer studio-footer-copyright">
        <span>© 2026 Eximius Kreativ Solutions</span>
      </footer>
      <div className="studio-mobile-cta"><a href={whatsappUrl} target="_blank" rel="noreferrer">Order on WhatsApp · ₦100,000 <span>↗</span></a></div>
    </main>
  );
}
