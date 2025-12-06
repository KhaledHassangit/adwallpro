// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Poppins, Almarai } from "next/font/google";
import { Suspense } from "react";
import { Providers } from "../providers/ThemeProvider";
import { GoogleOAuthProviderWrapper } from "../providers/GoogleOAuthProvider";
import HeaderGuard from "@/components/layout/header-guard";
import { Footer } from "@/components/layout/footer";
import "./globals.css";
import Loading from "@/components/loading";

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
            className={`${poppins.variable} ${almarai.variable}`}
        >
            <body className="antialiased">
                <GoogleOAuthProviderWrapper>
                    <Providers>
                        <Suspense fallback={<Loading />}>
                            <HeaderGuard />
                            {children}
                            <Footer />
                        </Suspense>
                    </Providers>
                </GoogleOAuthProviderWrapper>
            </body>
        </html>
    );
}
