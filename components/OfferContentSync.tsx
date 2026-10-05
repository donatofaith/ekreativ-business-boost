"use client";

import { useEffect } from "react";

const textReplacements: Record<string, string> = {
  "YOUR FIVE SOCIAL MEDIA DESIGNS": "SOCIAL DESIGNS + SERVICE FLYER",
  "What should the five designs promote?": "What should your four social designs and service flyer promote?",
  "You can leave any field blank and allow us to recommend the best content angle.": "Share the focus for each social design and tell us what the service flyer should promote.",
  "Design 1": "Social Design 1",
  "Design 2": "Social Design 2",
  "Design 3": "Social Design 3",
  "Design 4": "Social Design 4",
  "Design 5": "Service Flyer",
  "WHATSAPP STATUS AD": "LANDING PAGE",
  "Let's plan your WhatsApp flyer.": "Let's plan your landing page.",
  "Tell us what should be promoted and what action viewers should take.": "Tell us what the landing page should promote, the key information to include, and the action visitors should take.",
  "What should the WhatsApp Status flyer promote?": "What service or product should the landing page promote?",
  "What information must appear on it?": "What key information should appear on the landing page?",
  "What action should people take?": "What should visitors do on the landing page?",
  "Copy 1": "Marketing Copy 1",
  "Copy 2": "Marketing Copy 2",
  "✓ AI promotional video": "✓ 60s promotional video",
  "✓ 5 social media designs": "✓ 4 social media designs",
  "✓ WhatsApp status ad": "✓ Landing page + service flyer",
  "✓ 3 marketing copies": "✓ 2 marketing copies",
};

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function syncOfferContent() {
  const root = document.querySelector(".onboarding-page");
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    const raw = current.nodeValue || "";
    const key = normalize(raw);
    const replacement = textReplacements[key];

    if (replacement) {
      current.nodeValue = replacement;
    }

    current = walker.nextNode();
  }

  document.querySelectorAll(".onboarding-steps button").forEach((button) => {
    const label = normalize(button.textContent || "");
    if (label.includes("WhatsApp")) {
      button.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && normalize(node.nodeValue || "") === "WhatsApp") {
          node.nodeValue = "Landing Page";
        }
      });
    }
  });

  document.querySelectorAll("label.field").forEach((field) => {
    const label = field.querySelector(":scope > span");
    if (normalize(label?.textContent || "") === "Copy 3") {
      (field as HTMLElement).style.display = "none";
    }
  });
}

export default function OfferContentSync() {
  useEffect(() => {
    syncOfferContent();

    const observer = new MutationObserver(() => syncOfferContent());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
