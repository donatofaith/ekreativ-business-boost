import Image from "next/image";
import "./landing.css";

const deliverables = [
  {
    number: "01",
    title: "Make them stop",
    detail: "One 60-second promotional video",
    description: "A short, polished introduction to your business and the offer you want people to remember.",
    tag: "VIDEO",
  },
  {
    number: "02",
    title: "Look like the real deal",
    detail: "Four branded social media designs",
    description: "A consistent visual presence that makes every post feel unmistakably yours.",
    tag: "4 DESIGNS",
  },
  {
    number: "03",
    title: "Put the offer in their hands",
    detail: "One WhatsApp status flyer",
    description: "A clear, shareable offer with a simple next step for the people already in your network.",
    tag: "FLYER",
  },
  {
    number: "04",
    title: "Give your offer the right words",
    detail: "Two marketing captions",
    description: "Focused copy that explains what you do and makes it easier for the right people to respond.",
    tag: "2 CAPTIONS",
  },
  {
    number: "05",
    title: "Turn a click into a conversation",
    detail: "One focused landing page",
    description: "One useful place to see your offer, build confidence and take the next step.",
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
  { number: "02", title: "Lock in the brief", text: "We agree on what’s included, what we need from you and when it will be ready." },
  { number: "03", title: "Show up with confidence", text: "Your creative kit is delivered within 72 hours after your materials and brief are confirmed." },
];

export default function Home() {
  const phone = (process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "2349057831324").replace(/\D/g, "");
  const message = encodeURIComponent(
    "Hello Eximius Kreativ Solutions, I’m interested in the ₦100,000 AI Business Boost package. Please confirm the scope and how to get started."
  );
  const whatsappUrl = `https://wa.me/${phone || "2349057831324"}?text=${message}`;

  return (
    <main className="studio-page" id="top">
      <div className="studio-ribbon"><span>EXIMIUS KREATIV SOLUTIONS</span><span>ONE CREATIVE KIT · ₦100,000</span></div>

      <header className="studio-header">
        <a className="studio-wordmark" href="#top" aria-label="Eximius Kreativ Solutions home">
          <span className="studio-mark">e<span>.</span></span>
          <span><strong>eximius</strong><small>KREATIV SOLUTIONS</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">The work</a>
          <a href="#package">What you get</a>
          <a href="#steps">How it works</a>
        </nav>
        <a className="studio-nav-cta" href={whatsappUrl} target="_blank" rel="noreferrer">Let’s talk <span>↗</span></a>
      </header>

      <section className="studio-hero">
        <div className="studio-hero-copy">
          <p className="studio-eyebrow"><span className="studio-pulse" /> THE ₦100K BUSINESS BOOST</p>
          <h1>Good business.<br />Now make it <em>look</em><br /><span>the part.</span></h1>
          <p className="studio-lede">You already know your business is worth choosing. We make the first impression say it, too.</p>
          <div className="studio-hero-actions">
            <a className="studio-button studio-button-dark" href={whatsappUrl} target="_blank" rel="noreferrer">Get the full creative kit <span>↗</span></a>
            <a className="studio-scroll-link" href="#work"><span className="studio-play-mark">▶</span> Watch what we make</a>
          </div>
          <p className="studio-delivery-note">A complete package for ₦100,000 <span>·</span> Delivery within 72 hours after the brief is confirmed*</p>
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
          <div><p className="studio-eyebrow">SELECTED WORK</p><h2>Less talk.<br />Let the work speak<span>.</span></h2></div>
          <p>Browse our designs. Watch the videos.</p>
        </div>
        <div className="studio-work-grid">
          {workSamples.map((item, index) => (
            <a className={`studio-work-card studio-work-card-${index + 1}`} href={item.image} target="_blank" rel="noreferrer" key={item.name}>
              <div className="studio-work-thumb"><Image src={item.image} alt={item.alt} width={1000} height={1250} sizes="(max-width: 1020px) 44vw, 30vw" /><span aria-hidden="true">↗</span></div>
              <div className="studio-work-caption"><div><strong>{item.name}</strong><small>{item.type}</small></div><span>0{index + 1}</span></div>
            </a>
          ))}
        </div>
        <div className="studio-reel-heading"><div><p className="studio-eyebrow">PRESS PLAY</p><h3>Good work moves.</h3></div><p>Watch two of our website showcases.</p></div>
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
          <p className="studio-eyebrow">THE COMPLETE CREATIVE KIT</p>
          <h2>Five moves.<br /><em>One better first impression.</em></h2>
          <p>Each deliverable has a job. Together, they make it easier for customers to notice you, trust you and take action.</p>
          <div className="studio-price-card"><span>ONE COMPLETE PACKAGE</span><strong>₦100,000</strong><small>All five deliverables included</small><a href={whatsappUrl} target="_blank" rel="noreferrer">Let’s build yours ↗</a></div>
          <p className="studio-cost-note">*The 72-hour delivery period starts once your brief and materials are confirmed. Ad spend, domain and hosting are separate.</p>
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
        <div className="studio-section-head"><div><p className="studio-eyebrow">NO GUESSWORK</p><h2>Three steps. Then it’s yours<span>.</span></h2></div><p>We align on the details before anything gets made.</p></div>
        <div className="studio-steps-grid">
          {steps.map((step) => <article className="studio-step" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
        </div>
      </section>

      <section className="studio-faq" id="faq">
        <div className="studio-faq-lead"><p className="studio-eyebrow">BEFORE YOU SAY HELLO</p><h2>A few things<br />you might ask<span>.</span></h2><a href={whatsappUrl} target="_blank" rel="noreferrer">Ask us on WhatsApp ↗</a></div>
        <div className="studio-faq-list">
          <details><summary>Is this right for my kind of business?</summary><p>It’s built for businesses with a specific product, service or offer to promote. Tell us what you do and who you want to reach; we’ll confirm it’s a good fit before you book.</p></details>
          <details><summary>When does the 72-hour delivery start?</summary><p>Once we have your onboarding materials and have confirmed the brief. We’ll agree on the start time and schedule with you before work begins.</p></details>
          <details><summary>Are ads, domain and hosting included?</summary><p>The package includes the five creative deliverables on this page. Advertising, domain registration and hosting costs are separate and confirmed with you first.</p></details>
          <details><summary>Do I need to appear in the video?</summary><p>No. We can build it around your products, service and offer without an on-camera appearance.</p></details>
        </div>
      </section>

      <section className="studio-close">
        <p className="studio-eyebrow">YOUR BUSINESS IS READY FOR ITS CLOSE-UP</p>
        <h2>Let’s make people<br /><em>look twice.</em></h2>
        <p>One creative kit. Clear scope. A simple start on WhatsApp.</p>
        <a className="studio-button studio-button-light" href={whatsappUrl} target="_blank" rel="noreferrer">Start your business boost <span>↗</span></a>
        <div className="studio-close-orbit" aria-hidden="true">EK</div>
      </section>

      <footer className="studio-footer">
        <a className="studio-wordmark studio-wordmark-footer" href="#top"><span className="studio-mark">e<span>.</span></span><span><strong>eximius</strong><small>KREATIV SOLUTIONS</small></span></a>
        <a href="mailto:ekreativsolutions@gmail.com">ekreativsolutions@gmail.com</a>
        <span>© 2026 Eximius Kreativ Solutions</span>
      </footer>
      <div className="studio-mobile-cta"><a href={whatsappUrl} target="_blank" rel="noreferrer">Get the kit · ₦100,000 <span>↗</span></a></div>
    </main>
  );
}
