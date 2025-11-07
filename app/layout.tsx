import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import HeaderGuard from "@/components/layout/header-guard";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-outfit",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "AdWallPro - منصة الإعلانات العصري",
    template: "%s | AdWallPro",
  },
  description:
    "AdWallPro – المنصة الذكية التي تجمع المعلنين والباحثين عن أفضل العروض في مكان واحد. أطلق حملاتك الإعلانية بسهولة، أو اكتشف العروض والخدمات التي تناسبك بثقة وسلاسة. تجربة سريعة وموثوقة لكل من يعلن ويبحث عن الفرصة المثالية.",
  generator: "v0.app",
  icons: {
    icon: "/images/adwell-logo.jpg",
    shortcut: "/images/adwell-logo.jpg",
    apple: "/images/adwell-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${outfit.variable} ${plusJakartaSans.variable}`}
    >
      <body className={`${outfit.className} font-sans antialiased`}>
        <Providers>
          <HeaderGuard />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
