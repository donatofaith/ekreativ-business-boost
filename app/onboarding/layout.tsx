import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Onboarding | eKreativ Solutions",
  description: "Private project onboarding for confirmed eKreativ Solutions clients.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
