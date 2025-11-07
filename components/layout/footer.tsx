"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Play } from "@/components/ui/icon";
import { useI18n } from "@/providers/lang-provider";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t } = useI18n();
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/manage")) {
    return null;
  }

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/share/17YHk9GDt1/",
      bgColor: "bg-blue-600",
      hoverGradient: "hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/adwallpro",
      bgColor: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
      hoverGradient: "hover:brightness-110",
    },
    {
      name: "TikTok",
      imageSrc: "/images/social/tiktok.png",
      href: "https://www.tiktok.com/@adwall.pro",
      bgColor: "bg-black",
      hoverGradient: "hover:brightness-110",
    },
    {
      name: "YouTube",
      icon: Play,
      href: "https://www.youtube.com/@adwallproadmin",
      bgColor: "bg-red-600",
      hoverGradient: "hover:brightness-110",
    },
    {
      name: "Snapchat",
      imageSrc: "/images/social/snapchat.webp",
      href: "https://www.snapchat.com/add/adwallpro",
      bgColor: "bg-yellow-400",
      hoverGradient: "hover:brightness-110",
    },
  ];

  return (
    <footer className=" glass">
      <div className="container py-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            {t("followUs")}
          </h3>

          <div className="flex justify-center items-center gap-8 flex-wrap">
            {socialLinks.map((social) => (
              <div
                key={social.name}
                className={cn(
                  "group perspective-1000 w-16 h-16 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300",
                  social.bgColor,
                  social.hoverGradient
                )}
              >
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  {social.icon ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <social.icon className="w-8 h-8 text-white" />
                    </div>
                  ) : (
                    <Image
                      src={social.imageSrc!}
                      alt={social.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </Link>
                <p className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
                  {social.name}
                </p>
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
