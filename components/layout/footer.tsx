"use client";

import type { SyntheticEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useI18n } from "@/providers/LanguageProvider";

export function Footer() {
  const { t } = useI18n();
  const pathname = usePathname();

  // Determine top-level path segment and next segment. Support optional locale prefix.
  const segments = (pathname || "").split("/").filter(Boolean);
  const locales = ["en", "ar"];
  const hasLocalePrefix = locales.includes(segments[0] || "");
  const top = hasLocalePrefix ? segments[1] || "" : segments[0] || "";
  const second = hasLocalePrefix ? segments[2] || "" : segments[1] || "";

  const hideTop = ["admin", "manage", "dashboard", "user-dashboard"].includes(top);
  const hideSecond = second === "admin";

  if (hideTop || hideSecond) {
    return null;
  }

  const socialLinks = [
    {
      name: "Facebook",
      imageSrc: "/images/facebook.svg",
      href: "https://www.facebook.com/profile.php?id=61583582955103",
    },
    {
      name: "Instagram",
      imageSrc: "/images/instagram.svg",
      href: "https://www.instagram.com/adwallpro",
    },
    {
      name: "Twitter",
      imageSrc: "/images/twitter.svg",
      href: "https://x.com/adwallpro",
    },
    {
      name: "TikTok",
      imageSrc: "/images/tiktok.svg",
      href: "https://www.tiktok.com/@adwall.pro",
    },
    {
      name: "YouTube",
      imageSrc: "/images/youtube.svg",
      href: "https://www.youtube.com/@adwallproadmin",
    },
    {
      name: "Snapchat",
      imageSrc: "/images/snapchat.svg",
      href: "https://www.snapchat.com/add/adwallpro",
    },
    {
      name: "LinkedIn",
      imageSrc: "/images/linkedin.svg",
      href: "https://www.linkedin.com/in/adwall-pro-admin-121357397",
    },
  ];

  return (
    <footer className="glass">
      <div className="container py-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            {t("followUs")}
          </h3>

          <div className="flex justify-center items-center gap-8 flex-wrap">
            {socialLinks.map((social) => (
              <div
                key={social.name}
                className="group relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-white/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md rounded-full"></div>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative"
                >
                  <div className="relative w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Image
                      src={social.imageSrc}
                      alt={social.name}
                      width={32}
                      height={32}
                      className="relative z-10 w-8 h-8 object-contain transition-all duration-300 group-hover:drop-shadow-lg"
                      onError={(e: SyntheticEvent<HTMLImageElement>) => {
                        // Fallback if image doesn't load
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement as HTMLElement | null;
                        if (parent) {
                          parent.innerHTML = `<span style="color: white; font-weight: bold; font-size: 20px;">${social.name.charAt(0)}</span>`;
                        }
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
                    {social.name}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-8 border-t border-border/50">
          <div className="h-1 w-32 rounded-full bg-gradient-to-r from-primary via-secondary to-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-primary">AdWall</span>.{" "}
            {t("allRightsReserved")}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            {t("modernAdPlatform")}
          </p>
        </div>
      </div>
    </footer>
  ); 
}