"use client";

import { Breadcrumb } from "@/components/common/breadcrumb";
import { useI18n } from "@/providers/lang-provider";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-pattern-grid ">
      <main className="pt-24">
        {/* <div className="container-premium py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
            ]}
          />
        </div> */}

        {/* من نحن Section */}
        <div className="max-w-6xl mx-auto mb-20 px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-bold text-primary">{t("ourStory")}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black gradient-text mb-4">{t("whoAreWe")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("modernAdPlatformDesc")}</p>
          </div>

          {/* Main Content Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Vision Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-primary/40 border border-primary/20 p-8 hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700 z-0" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl">🎯</div>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{t("ourVision")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("visionDesc")}</p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/20 to-secondary/40 border border-secondary/20 p-8 hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700 z-0" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl">🚀</div>
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">{t("ourMission")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("missionDesc")}</p>
              </div>
            </div>

            {/* Values Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/20 to-green-500/40 border border-green-500/20 p-8 hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700 z-0" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-green-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl">💎</div>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">{t("ourValues")}</h3>
                <p className="text-muted-foreground leading-relaxed">{t("valuesDesc")}</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-12">{t("howWeWork")}</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* For Advertisers */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20 group-hover:border-primary/30 transition-all duration-300">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-3xl">📢</div>
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-4">{t("forAdvertisersWork")}</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{t("chooseSquare")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{t("addAdEasily")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{t("beVisibleToAll")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Users */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20 group-hover:border-secondary/30 transition-all duration-300">
                  <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-3xl">🔍</div>
                  </div>
                  <h4 className="text-xl font-bold text-secondary mb-4">{t("forUsersWork")}</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      <span>{t("browseSquares")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      <span>{t("findWhatYouNeed")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      <span>{t("directContact")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <div className="text-2xl">✨</div>
              <div>
                <p className="text-lg font-bold text-foreground">{t("everySquareHasValue")}</p>
                <p className="text-sm text-muted-foreground">{t("everyAdHasChance")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
