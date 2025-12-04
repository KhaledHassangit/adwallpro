"use client";

import { useState } from "react";
import { useI18n } from "@/providers/LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, HelpCircle, Sparkles } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function FAQSection() {
  const { t, locale } = useI18n();
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      questionAr: "ما هو AdWall؟",
      questionEn: "What is AdWall?",
      answerAr:
        "AdWall هو نظام إعلاني يسمح للشركات والأفراد بعرض إعلاناتهم على لوحة إعلانية تفاعلية بطريقة منظمة وسهلة الإدارة.",
      answerEn:
        "AdWall is an advertising platform that lets businesses and individuals display ads on an interactive board in an organized, easy-to-manage way.",
    },
    {
      questionAr: "كيف أضيف إعلانًا جديدًا؟",
      questionEn: "How do I add a new ad?",
      answerAr:
        "سجل دخولك إلى لوحة التحكم ثم اضغط على 'أضف إعلان'، املأ التفاصيل واختر المربع المناسب ثم أرسل للمراجعة.",
      answerEn:
        "Sign in to your dashboard, click 'Add Ad', fill in the details, choose a slot and submit for review.",
    },
    {
      questionAr: "هل الخدمة مجانية أم مدفوعة؟",
      questionEn: "Is the service free or paid?",
      answerAr:
        "نقدم خيارات مجانية ومدفوعة. الإعلانات المجانية قد تحتاج لموافقة يدوية، بينما توفر الخطط المدفوعة مزايا إضافية.",
      answerEn:
        "We offer free and paid options. Free listings may require manual approval, while paid plans include extra features.",
    },
    {
      questionAr: "كم يستغرق تفعيل أو الموافقة على الإعلان؟",
      questionEn: "How long does ad activation/approval take?",
      answerAr:
        "عادةً تتم عملية المراجعة خلال 24-48 ساعة؛ قد تختلف المدة حسب حجم الطلبات أو إذا كان هناك حاجة لمعلومات إضافية.",
      answerEn:
        "Ads are usually reviewed within 24–48 hours; times may vary depending on volume or if additional information is requested.",
    },
    {
      questionAr: "كيف أتواصل مع الدعم إذا واجهت مشكلة؟",
      questionEn: "How do I contact support if I have an issue?",
      answerAr:
        "يمكنك التواصل مع فريق الدعم عبر نموذج الاتصال على الموقع أو البريد الإلكتروني المخصص للدعم، وسنوافيك بالرد سريعًا.",
      answerEn:
        "You can reach support via the contact form on the site or the support email; the team will respond as soon as possible.",
    },
  ];



  return (
    <section className="py-20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <HelpCircle className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-bold text-primary">
              {t("faqTitle")}
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-black gradient-text mb-4">
            {t("faqTitle")}
          </h2>
          <p className="text-xl text-muted-foreground">{t("faqSubtitle")}</p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          {faqs.map((faq, index) => {
            const isOpen = openItems.includes(index);
            const question = locale === "ar" ? faq.questionAr : faq.questionEn;
            const answer = locale === "ar" ? faq.answerAr : faq.answerEn;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-background to-muted/30 border border-primary/10 p-6 hover:shadow-xl transition-all duration-500"
              >
                {/* الزخرفة الخفيفة */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700" />

                <div className="relative z-10">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between text-lg font-semibold text-foreground"
                  >
                    <span>{question}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-primary transition-transform duration-300",
                        isOpen ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {/* الإجابة */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500 ease-in-out",
                      isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4 mt-4" />
                    <p className="text-muted-foreground leading-relaxed">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{t("faqHaveAnotherQuestion")}</span>
            <Link
              className="text-primary font-medium hover:underline"
              href="mailto:adwallproadman10@gmail.com"

            >
              {t("faqContactUs")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}