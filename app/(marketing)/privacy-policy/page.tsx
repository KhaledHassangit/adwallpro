
import { useI18n } from "@/providers/LanguageProvider";

export default function PrivacyPolicyPage() {
  const { t, locale } = useI18n();

  const content =
    locale === "ar"
      ? {
          title: "سياسة الخصوصية",
          welcome: "مرحبًا بك في Adwall 🌟",
          intro:
            "نحن نؤمن بإنشاء بيئة إعلانية آمنة وموثوقة، حيث يمكن للجميع عرض خدماتهم وأعمالهم بثقة. وضعت هذه السياسة لحماية المعلنين والمستخدمين معًا، ولضمان أن تظل منصتنا مكانًا محترمًا واحترافيًا للجميع. نحن ملتزمون التزامًا كاملًا بالقوانين المحلية والدولية المعمول بها.",
          sections: [
            {
              title: "البيانات التي يقدمها المعلنون",
              content:
                "جميع البيانات التي يضعها المعلن في إعلانه (مثل الاسم التجاري، الشعار، رقم الهاتف، البريد الإلكتروني، وحسابات التواصل الاجتماعي) تعتبر معلومات عامة يوافق المعلن على نشرها للجمهور. الموقع غير مسؤول عن أي استخدام لهذه البيانات من قبل أطراف أخرى، وننصح المعلنين بوضع المعلومات التي يرغبون بمشاركتها فقط.",
            },
            {
              title: "المحتوى الممنوع",
              content:
                "لضمان بيئة آمنة للجميع، نمنع نشر أو الترويج لأي من المحتويات التالية:",
              list: [
                "المواد الإباحية أو المخلة بالآداب.",
                "الخمور أو منتجاتها.",
                "القمار أو المراهنات أو أنشطة الحظ.",
                "خطاب الكراهية أو التحريض على العنف أو التمييز.",
                "أي محتوى مسروق أو منتهك لحقوق الملكية الفكرية.",
              ],
            },
            {
              title: "حق الحذف أو الإلغاء",
              content:
                "نحتفظ بحق تعديل أو حذف أي إعلان، أو إلغاء اشتراك أي مستخدم إذا كان المحتوى مخالفًا لسياساتنا أو يضر بسمعة الموقع، مع احترام جميع الأطراف وعدم إساءة التعامل.",
            },
            {
              title: "إخلاء المسؤولية",
              content:
                "الإعلانات المنشورة تعبّر عن رأي المعلنين فقط، ولا نضمن دقتها أو صحتها. لا يتحمل الموقع أي مسؤولية عن التعاملات أو النزاعات بين المعلنين والمشترين أو بين الباحثين وأصحاب الإعلانات.",
            },
            {
              title: "التزام القوانين المحلية والدولية",
              content:
                "نلتزم بكافة القوانين واللوائح المحلية والدولية ذات الصلة بعمل الموقع، ونعمل على ضمان تطبيقها في كافة خدماتنا.",
            },
            {
              title: "تحديث سياسة الخصوصية",
              content:
                "نحتفظ بالحق في تعديل أو تحديث سياسة الخصوصية هذه في أي وقت، وذلك لمواكبة التغييرات القانونية أو تحسين خدماتنا. سيتم نشر النسخة المحدثة على الموقع مع تاريخ التحديث، ويُعتبر استمرارك في استخدام الموقع بعد هذا النشر قبولًا ضمنيًا لأي تغييرات.",
            },
            {
              title: "حقوق الملكية",
              content:
                "جميع الحقوق محفوظة © منذ تاريخ إنشاء الموقع: 2025/10 وحتى آخر تحديث بتاريخ: 2025 Adwall. يُمنع نسخ أو إعادة نشر أي جزء من المحتوى أو تصميم الموقع إلا بإذن مسبق من الإدارة.",
            },
          ],
        }
      : {
          title: "Privacy Policy",
          welcome: "Welcome to Adwall 🌟",
          intro:
            "We believe in creating a safe and trustworthy advertising environment where everyone can confidently showcase their services and businesses. This policy is designed to protect both advertisers and users, ensuring our platform remains respectful and professional for all. We fully comply with all applicable local and international laws.",
          sections: [
            {
              title: "Information Provided by Advertisers",
              content:
                "All information provided by advertisers in their ads (such as business name, logo, phone number, email, and social media accounts) is considered public information that the advertiser agrees to share. The site is not responsible for any use of this information by third parties. We advise advertisers to share only the information they are comfortable making public.",
            },
            {
              title: "Prohibited Content",
              content:
                "To maintain a safe environment for everyone, we do not allow the posting or promotion of any of the following:",
              list: [
                "Pornographic or indecent materials.",
                "Alcohol or related products.",
                "Gambling, betting, or games of chance.",
                "Hate speech, incitement to violence, or discrimination.",
                "Any stolen content or material violating intellectual property rights.",
              ],
            },
            {
              title: "Right to Delete or Cancel",
              content:
                "We reserve the right to modify or delete any ad, or cancel the subscription of any user if the content violates our policies or harms the site's reputation, always treating all parties respectfully and professionally.",
            },
            {
              title: "Disclaimer",
              content:
                "The ads posted represent only the views of the advertisers, and we do not guarantee their accuracy or truthfulness. The site is not responsible for any transactions or disputes between advertisers, buyers, researchers, or other parties.",
            },
            {
              title: "Compliance with Local and International Laws",
              content:
                "We comply with all relevant local and international laws and regulations related to our site's operation and strive to ensure their enforcement in all our services.",
            },
            {
              title: "Privacy Policy Updates",
              content:
                "We reserve the right to update or modify this privacy policy at any time to keep up with legal changes or improve our services. The updated version will be posted on the site with the update date, and your continued use of the site after posting constitutes your acceptance of the changes.",
            },
            {
              title: "Copyright",
              content:
                "All rights reserved © From the site creation date: 2025/10 to the last update date: 2025/10 Adwall. No part of the content or design of the site may be copied or republished without prior permission from the administration.",
            },
          ],
        };

  return (
    <div className="min-h-screen bg-pattern-grid ">
      <main className="pt-24">
        {/* <div className="container-premium py-8">
          <Breadcrumb
            items={[
              { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
              { label: content.title, href: "/privacy-policy" },
            ]}
          />
        </div> */}

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-bold text-primary">
                {t("privacyPolicy")}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black gradient-text mb-8">
              {content.title}
            </h1>

            <div className="text-center space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p className="text-balance font-medium text-foreground text-xl">
                {content.welcome}
              </p>
              <p className="text-balance max-w-3xl mx-auto">{content.intro}</p>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-12">
            {content.sections.map((section, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-background to-muted/30 border border-primary/10 p-8 hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />

                <div className="relative">
                  <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>

                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p className="text-balance">{section.content}</p>

                    {section.list && (
                      <ul className="space-y-2 mt-4">
                        {section.list.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <div className="text-2xl">📋</div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {locale === "ar"
                    ? "سياسة الخصوصية - Adwall"
                    : "Privacy Policy - Adwall"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {locale === "ar"
                    ? "نلتزم بحماية خصوصيتك وبناء بيئة آمنة للجميع"
                    : "We are committed to protecting your privacy and building a safe environment for everyone"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
