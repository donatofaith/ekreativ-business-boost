"use client";

import { useEffect } from "react";

export default function ScrollMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll<HTMLElement>(
      ".studio-hero-copy, .studio-hero-art, .studio-section-head, .studio-work-card, .studio-reel-card, .studio-package-intro, .studio-deliverable, .studio-step, .studio-faq-lead, .studio-faq-list details, .studio-newsletter-copy, .studio-newsletter-form, .studio-close > *"
    );
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    targets.forEach((element, index) => {
      element.classList.add("studio-reveal");
      element.style.setProperty("--reveal-delay", `${(index % 5) * 70}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
