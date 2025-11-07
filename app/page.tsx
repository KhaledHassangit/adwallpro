
import { UltraHeader } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UltraHero } from "@/components/home/hero";
import { UltraFeatures } from "@/components/home/features";
import { UltraCTA } from "@/components/home/cta";
import { ChatBot } from "@/components/home/chatbot";
import { CategoriesSlider } from "@/components/categories/categories-grid";

export default function HomePage() {
  // const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* <UltraHeader /> */}
      {/* <main className="space-y-20 lg:space-y-32"> */}
        <UltraHero />
        <UltraFeatures />
        <CategoriesSlider />
        <UltraCTA />
      {/* </main> */}

      <ChatBot />
    </div>
  );
}
