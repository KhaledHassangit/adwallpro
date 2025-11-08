"use client";

import { Breadcrumb } from "@/components/common/breadcrumb";
import { useI18n } from "@/providers/lang-provider";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-pattern-grid">
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

            {/* Mission Card - 修改背景和火箭图标盒子 */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-pink-500/25 border border-indigo-400/30 p-8 hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700 z-0" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400/40 to-purple-400/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-white/20">
                  <div className="text-2xl">🚀</div>
                </div>
                <h3 className="text-2xl font-bold text-indigo-400 mb-4">{t("ourMission")}</h3>
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

          {/* How It Works - 重新设计卡片背景 */}
        {/* How It Works - Transparent Background Design */}
<div className="text-center mb-16">
  <h3 className="text-3xl font-bold text-foreground mb-12">{t("howWeWork")}</h3>
  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    {/* For Advertisers */}
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-lg"></div>
      <div className="relative bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-primary/30 rounded-2xl group-hover:scale-110 transition-transform duration-300 blur-sm"></div>
            <div className="relative w-full h-full bg-primary/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/30">
              <div className="text-3xl">📢</div>
            </div>
          </div>
          
          <h4 className="text-xl font-bold text-primary mb-6">{t("forAdvertisersWork")}</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <span className="text-sm text-foreground/90">{t("chooseSquare")}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <span className="text-sm text-foreground/90">{t("addAdEasily")}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <span className="text-sm text-foreground/90">{t("beVisibleToAll")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* For Users */}
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-lg"></div>
      <div className="relative bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-cyan-500/30 rounded-2xl group-hover:scale-110 transition-transform duration-300 blur-sm"></div>
            <div className="relative w-full h-full bg-cyan-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-cyan-500/30">
              <div className="text-3xl">🔍</div>
            </div>
          </div>
          
          <h4 className="text-xl font-bold text-cyan-400 mb-6">{t("forUsersWork")}</h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/30">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              </div>
              <span className="text-sm text-foreground/90">{t("browseSquares")}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/30">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              </div>
              <span className="text-sm text-foreground/90">{t("findWhatYouNeed")}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/30">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              </div>
              <span className="text-sm text-foreground/90">{t("directContact")}</span>
            </div>
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