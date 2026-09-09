"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>(
      [
        ".section-heading",
        ".process-intro",
        ".package-card",
        ".delivery-strip",
        ".process-card",
        ".about-copy",
        ".price-card",
        ".cta-panel",
      ].join(",")
    );

    revealElements.forEach((element) => {
      element.classList.add("scroll-reveal");
    });

    // Give cards a slight stagger.
    document
      .querySelectorAll<HTMLElement>(".package-card")
      .forEach((card, index) => {
        card.style.setProperty("--reveal-delay", `${index * 90}ms`);
      });

    document
      .querySelectorAll<HTMLElement>(".process-card")
      .forEach((card, index) => {
        card.style.setProperty("--reveal-delay", `${index * 100}ms`);
      });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}