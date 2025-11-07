"use client";

import { UltraHero } from "@/components/home/hero";
import { UltraSlider } from "@/components/home/slider";
import { UltraFeatures } from "@/components/home/features";
import { AboutUsSection } from "@/components/home/about-us";
import { FAQSection } from "@/components/home/faq";
import { UltraCTA } from "@/components/home/cta";

export default function HomePage() {
  return (
    <div className="space-y-20 lg:space-y-32">
      <UltraHero />
      <UltraSlider />
      <UltraFeatures />
      <AboutUsSection />
      <FAQSection />
      <UltraCTA />
    </div>
  );
}
