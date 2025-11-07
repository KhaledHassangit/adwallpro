import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils"; // أو استخدم clsx لو مش عندك cn

interface LogoProps {
  t: (k: string) => string;
  showSubtitle?: boolean;
  imageClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const Logo = ({
  t,
  showSubtitle = true,
  imageClassName,
  titleClassName,
  subtitleClassName,
}: LogoProps) => {
  return (
    <Link href="/" className="group flex items-center gap-3 sm:gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity duration-300" />
        <div
          className={cn(
            "relative h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 overflow-hidden rounded-2xl group-hover:ring-primary-300 transition-all duration-300",
            imageClassName
          )}
        >
          <Image
            src="/images/adwell-logo.jpg"
            alt="AdWallPro Logo"
            fill
            className="object-cover transition-transform duration-500"
          />
        </div>
      </div>

      <div className="hidden sm:block">
        <h1
          className={cn(
            "text-xl sm:text-2xl lg:text-3xl font-bold gradient-text",
            titleClassName
          )}
        >
          AdWallPro
        </h1>

        {showSubtitle && (
          <p
            className={cn(
              "text-xs sm:text-sm text-muted-foreground -mt-0.5 font-medium",
              subtitleClassName
            )}
          >
            {t("modernAdWall")}
          </p>
        )}
      </div>
    </Link>
  );
};

export default Logo;
