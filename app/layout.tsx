import type { Metadata } from "next";
import "./globals.css";
import "./animation-upgrades.css";

export const metadata: Metadata = {
  title: "eKreativ Solutions | AI Business Boost — ₦100,000",
  description:
    "A 60-second promotional video, four branded designs, a WhatsApp flyer, two marketing captions and a focused landing page for ₦100,000.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
