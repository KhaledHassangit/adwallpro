import type React from "react";
import type { Metadata } from "next";
import { Poppins, Almarai } from "next/font/google";
import { Providers } from "../../providers/ThemeProvider";
import { GoogleOAuthProviderWrapper } from "../../providers/GoogleOAuthProvider";
import { LangProvider } from "../../providers/LanguageProvider";
import HeaderGuard from "@/components/layout/header-guard";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
  variable: "--font-almarai",
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

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale = "en" } = await params;
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${poppins.variable} ${almarai.variable} ${
        isArabic ? "ar" : "en"
      }`}
    >
      <body
        className={`antialiased ${
          isArabic ? "font-ar" : "font-en"
        }`}
      >
        <GoogleOAuthProviderWrapper>
          <Providers>
            <LangProvider initialLocale={locale as "en" | "ar"}>
              <HeaderGuard />
              {children}
              <Footer />
            </LangProvider>
          </Providers>
        </GoogleOAuthProviderWrapper>
      </body>
    </html>
  );
}