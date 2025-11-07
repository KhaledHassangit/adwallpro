"use client";

import { useI18n } from "@/providers/lang-provider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Users,
  Shield,
  Target,
  Sparkles,
  CheckCircle,
} from "@/components/ui/icon";

export function AboutUsSection() {
  const { t, locale } = useI18n();

  const features = [
    {
      icon: Building2,
      titleAr: "للمعلنين",
      titleEn: "For Advertisers",
      descAr:
        "اختر المربع الذي يناسبك، أضف إعلانك بسهولة، وكن مرئيًا للجميع في بيئة منظمة واحترافية.",
      descEn:
        "Choose the square that suits you, add your ad easily, and be visible to everyone in an organized and professional environment.",
    },
    {
      icon: Users,
      titleAr: "للمستخدمين",
      titleEn: "For Users",
      descAr:
        "تصفح المربعات لتجد العروض والخدمات التي تبحث عنها بسرعة وأمان، مع ضمان خلو المنصة من أي محتوى ضار أو مخالف.",
      descEn:
        "Browse the squares to find the offers and services you're looking for quickly and safely, with the guarantee that the platform is free of any harmful or violating content.",
    },
    {
      icon: Shield,
      titleAr: "الأمان والثقة",
      titleEn: "Safety & Trust",
      descAr:
        "نلتزم بالقوانين المحلية والدولية، ونعمل بروح الشفافية والاحترام لضمان منصة آمنة وموثوقة للجميع.",
      descEn:
        "We comply with local and international laws, and work with a spirit of transparency and respect to ensure a safe and reliable platform for everyone.",
    },
    {
      icon: Target,
      titleAr: "الهدف والرؤية",
      titleEn: "Goal & Vision",
      descAr:
        "كل مربع له قيمة، وكل إعلان له فرصة، وكل فرصة يمكن أن تتحول إلى نجاح.",
      descEn:
        "Every square has value, every ad has an opportunity, and every opportunity can turn into success.",
    },
  ];

  return (
    <section
      id="about-us-section"
      className="py-20 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-8">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {t("aboutUsTitle")}
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-black mb-8">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {t("aboutUsTitle")}
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p className="text-balance">{t("aboutUsIntro")}</p>
            <p className="text-balance">{t("aboutUsPhilosophy")}</p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                <p className="font-semibold text-primary mb-2">
                  {t("forAdvertisersTitle")}:
                </p>
                <p className="text-sm">{t("aboutUsAdvertisers")}</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/5 to-transparent border border-purple-600/10">
                <p className="font-semibold text-purple-600 mb-2">
                  {t("forUsersTitle")}:
                </p>
                <p className="text-sm">{t("aboutUsUsers")}</p>
              </div>
            </div>

            <p className="text-balance font-medium text-foreground">
              {t("aboutUsConclusion")}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const title = locale === "ar" ? feature.titleAr : feature.titleEn;
            const desc = locale === "ar" ? feature.descAr : feature.descEn;

            return (
              <Card
                key={index}
                className="group h-full bg-gradient-to-br from-background to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                    <div className="relative w-16 h-16 mx-auto bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-balance text-sm">
                    {desc}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-primary">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      {t("guaranteed")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
