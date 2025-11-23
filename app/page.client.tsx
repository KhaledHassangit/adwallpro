
"use client";

import { UltraHero } from "@/components/home/hero";
import { UltraFeatures } from "@/components/home/features";
import { UltraCTA } from "@/components/home/cta";
import { ChatBot } from "@/components/home/chatbot";
import { CategoriesSlider } from "@/components/categories/categories-grid";

export default function HomeClient() {
  return (
    <div className="min-h-screen">
      <UltraHero />
      <UltraFeatures />
      <CategoriesSlider />
      <UltraCTA />
      <ChatBot />
    </div>
  );
}