"use client";

import { useEffect, useState } from "react";

const reviews = [
  { name: "Zenit", type: "Business promotion package", initial: "Z", quote: "I really love everything in the package! The designs, video and landing page are so on point. This is really worth the price." },
  { name: "Tolu Food Brands", type: "Brand design", initial: "T", quote: "Ah, this is clean. You really got the colors I wanted. I love it." },
  { name: "Naya Bites", type: "Promotional video", initial: "N", quote: "This is really nice 🔥 The video captures what my food business is about perfectly. I can’t wait to post it." },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % reviews.length), 5500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const review = reviews[active];

  return (
    <section className="studio-testimonials" id="reviews" aria-label="Client reviews">
      <div className="studio-testimonials-inner">
        <div className="studio-testimonials-heading">
          <p className="studio-eyebrow">THEY SAID IT BEST</p>
          <h2>What our clients say<span>.</span></h2>
        </div>
        <div className="studio-testimonial-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }} aria-live="polite">
          <article key={review.name} className="studio-testimonial-slide">
            <div className="studio-testimonial-topline">
              <span className="studio-testimonial-quote-mark" aria-hidden="true">“</span>
              <span className="studio-testimonial-stars" aria-label="5 out of 5 stars">★★★★★</span>
            </div>
            <blockquote>{review.quote}</blockquote>
            <div className="studio-testimonial-author">
              <span className="studio-testimonial-avatar" aria-hidden="true">{review.initial}</span>
              <span className="studio-testimonial-author-text"><strong>{review.name}</strong><small>{review.type}</small></span>
              <span className="studio-testimonial-count">{String(active + 1).padStart(2, "0")} <i>/</i> {String(reviews.length).padStart(2, "0")}</span>
            </div>
          </article>
        </div>
        <div className="studio-testimonial-controls" aria-label="Choose a client review">
          <div className="studio-testimonial-dots">{reviews.map((item, index) => <button key={item.name} type="button" className={index === active ? "studio-testimonial-dot is-active" : "studio-testimonial-dot"} onClick={() => setActive(index)} aria-label={`Show review from ${item.name}`} aria-pressed={index === active} />)}</div>
          <div className="studio-testimonial-arrows">
            <button type="button" onClick={() => setActive((active + reviews.length - 1) % reviews.length)} aria-label="Previous review">←</button>
            <button type="button" onClick={() => setActive((active + 1) % reviews.length)} aria-label="Next review">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
