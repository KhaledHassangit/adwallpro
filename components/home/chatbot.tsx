"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/providers/LanguageProvider";
import { MessageCircle, X, Bot, User, ChevronDown, ChevronUp, Sparkles, Trash2, } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface FAQCategory {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  questions: FAQQuestion[];
}

interface FAQQuestion {
  id: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
}

// Arabic FAQ data
const faqData: FAQCategory[] = [
  {
    id: "about",
    title: "عن الموقع والفكرة",
    titleEn: "About the Site and Concept",
    icon: "💡",
    questions: [
      { 
        id: "about-1", 
        question: "ما هو موقع AdWallPro بالضبط؟", 
        questionEn: "What exactly is AdWallPro?",
        answer: "AdWallPro هي منصة ذكية للإعلانات الرقمية تتيح لأي شخص أو شركة عرض خدماته أو منتجاته بطريقة احترافية وموجهة.",
        answerEn: "AdWallPro is a smart digital advertising platform that allows any individual or company to display their services or products in a professional and targeted manner."
      },
      { 
        id: "about-2", 
        question: "الموقع عالمي أم يشتغل في دول محددة؟", 
        questionEn: "Is the site global or does it work in specific countries?",
        answer: "الموقع عالمي ومتاح لأي مستخدم من أي دولة.",
        answerEn: "The site is global and available to any user from any country."
      },
      { 
        id: "about-3", 
        question: "ما الفرق بينكم وبين مواقع الإعلانات العادية؟", 
        questionEn: "What's the difference between you and regular advertising sites?",
        answer: "نحن منصة 'إعلانات ذكية'، تعرض الإعلانات بناءً على الفئة والموقع الجغرافي والاهتمامات، وليست مجرد قائمة عشوائية.",
        answerEn: "We are a 'smart ads' platform that displays ads based on category, geographic location, and interests, not just a random list."
      },
      { 
        id: "about-4", 
        question: "هل يوجد تطبيق خاص بالموقع؟", 
        questionEn: "Is there a dedicated app for the site?",
        answer: "حالياً، الموقع يعمل بسلاسة على الجوال، والتطبيق الرسمي قيد التطوير.",
        answerEn: "Currently, the site works smoothly on mobile, and the official app is under development."
      },
      { 
        id: "about-5", 
        question: "ما معنى أن الموقع 'مدفوع'؟", 
        questionEn: "What does it mean that the site is 'paid'?",
        answer: "يعني أن كل إعلان له خطة اشتراك محددة (أساسية أو مميزة) حسب المدة والميزات التي تختارها.",
        answerEn: "It means that each ad has a specific subscription plan (basic or premium) depending on the duration and features you choose."
      },
      { 
        id: "about-6", 
        question: "هل يوجد تجريب مجاني؟", 
        questionEn: "Is there a free trial?",
        answer: "أحياناً نقدم عروضاً تجريبية مؤقتة، تابع إشعاراتنا لتعرف وقتها.",
        answerEn: "We sometimes offer temporary trial offers, follow our notifications to know when they are available."
      },
      { 
        id: "about-7", 
        question: "هل الموقع يدعم أكثر من لغة؟", 
        questionEn: "Does the site support more than one language?",
        answer: "نعم، الموقع يدعم العربية والإنجليزية فقط.",
        answerEn: "Yes, the site supports Arabic and English only."
      }
    ]
  },
  {
    id: "registration",
    title: "التسجيل والدخول",
    titleEn: "Registration and Login",
    icon: "🔐",
    questions: [
      { 
        id: "reg-1", 
        question: "كيف أسجل في الموقع؟", 
        questionEn: "How do I register on the site?",
        answer: "اضغط على 'إنشاء حساب'، أدخل بياناتك واختر الدولة، ثم قم بتفعيل حسابك وابدأ فوراً.",
        answerEn: "Click on 'Create Account', enter your information and select your country, then activate your account and start immediately."
      },
      { 
        id: "reg-2", 
        question: "هل التسجيل مجاني؟", 
        questionEn: "Is registration free?",
        answer: "التسجيل نفسه مجاني، لكن نشر الإعلانات يحتاج اشتراكاً حسب الخطة.",
        answerEn: "Registration itself is free, but posting ads requires a subscription according to the plan."
      },
      { 
        id: "reg-3", 
        question: "نسيت كلمة المرور، ماذا أفعل؟", 
        questionEn: "I forgot my password, what should I do?",
        answer: "اضغط على 'نسيت كلمة المرور'، سيصلك رابط إعادة التعيين فوراً على بريدك الإلكتروني.",
        answerEn: "Click on 'Forgot Password', you will immediately receive a reset link on your email."
      },
      { 
        id: "reg-4", 
        question: "هل يجب أن أفعّل الحساب قبل إضافة إعلان؟", 
        questionEn: "Do I need to activate the account before adding an ad?",
        answer: "نعم، يجب تفعيل بريدك الإلكتروني للحفاظ على جودة المستخدمين في الموقع.",
        answerEn: "Yes, you must activate your email to maintain the quality of users on the site."
      },
      { 
        id: "reg-5", 
        question: "هل يمكنني فتح أكثر من حساب؟", 
        questionEn: "Can I open more than one account?",
        answer: "ممكن، لكن ننصح باستخدام حساب واحد لجميع إعلاناتك لتتمكن من متابعتها بسهولة.",
        answerEn: "It's possible, but we recommend using one account for all your ads to easily track them."
      },
      { 
        id: "reg-6", 
        question: "ما فائدة لوحة التحكم؟", 
        questionEn: "What is the benefit of the control panel?",
        answer: "هي مركزك لإدارة الإعلانات، والإحصائيات، والدفع، والتعديل، وكل ما يخص حسابك.",
        answerEn: "It's your center for managing ads, statistics, payments, modifications, and everything related to your account."
      },
      { 
        id: "reg-7", 
        question: "هل يمكنني تغيير البريد أو كلمة المرور؟", 
        questionEn: "Can I change the email or password?",
        answer: "بالتأكيد، من الإعدادات داخل لوحة التحكم.",
        answerEn: "Certainly, from the settings inside the control panel."
      },
      { 
        id: "reg-8", 
        question: "لم يصلني إيميل التفعيل، ما الحل؟", 
        questionEn: "I didn't receive the activation email, what's the solution?",
        answer: "تأكد من مجلد 'الرسائل غير المرغوب فيها' (Spam) أو تواصل معنا من الدعم الفني لتفعيله يدوياً.",
        answerEn: "Check the 'Spam' folder or contact us from technical support to activate it manually."
      },
      { 
        id: "reg-9", 
        question: "هل يتم حذف الحساب إذا لم يتم استخدامه لفترة؟", 
        questionEn: "Is the account deleted if not used for a period?",
        answer: "لا، يبقى محفوظاً، لكن نرسل تذكيراً لتحديث بياناتك كل فترة.",
        answerEn: "No, it remains saved, but we send a reminder to update your information periodically."
      }
    ]
  },
  {
    id: "services",
    title: "الخدمات والإعلانات",
    titleEn: "Services and Advertisements",
    icon: "🎯",
    questions: [
      { 
        id: "services-1", 
        question: "كيف أضيف إعلاناً جديداً؟", 
        questionEn: "How do I add a new ad?",
        answer: "من حسابك اضغط على 'إضافة إعلان جديد'، املأ التفاصيل والصور ثم اختر خطة النشر المناسبة.",
        answerEn: "From your account, click on 'Add New Ad', fill in the details and images, then choose the appropriate publishing plan."
      },
      { 
        id: "services-2", 
        question: "ما مدة الإعلان؟", 
        questionEn: "What is the duration of an ad?",
        answer: "تختلف حسب الخطة: من شهر إلى سنة كاملة، وقابلة للتجديد حسب رغبتك.",
        answerEn: "It varies according to the plan: from one month to a full year, and renewable as you wish."
      },
      { 
        id: "services-3", 
        question: "هل يمكنني إضافة روابط لموقعي أو صفحتي؟", 
        questionEn: "Can I add links to my site or page?",
        answer: "نعم، يمكنك إضافة روابط لموقعك أو شبكاتك الاجتماعية.",
        answerEn: "Yes, you can add links to your site or your social networks."
      },
      { 
        id: "services-4", 
        question: "كيف أعرف إذا تم قبول إعلاني؟", 
        questionEn: "How do I know if my ad has been accepted?",
        answer: "ستصلك رسالة تأكيد بالبريد، وستظهر الحالة 'نشط' في لوحة التحكم.",
        answerEn: "You will receive a confirmation message by email, and the status will appear as 'Active' in the control panel."
      },
      { 
        id: "services-5", 
        question: "لماذا تم رفض إعلاني؟", 
        questionEn: "Why was my ad rejected?",
        answer: "عادةً بسبب بيانات ناقصة أو محتوى غير واضح أو مخالف. سنرسل لك السبب لتعديله.",
        answerEn: "Usually due to incomplete data, unclear content, or violations. We will send you the reason to modify it."
      },
      { 
        id: "services-6", 
        question: "هل يمكنني حذف الإعلان؟", 
        questionEn: "Can I delete the ad?",
        answer: "نعم، بسهولة من لوحة التحكم.",
        answerEn: "Yes, easily from the control panel."
      },
      { 
        id: "services-7", 
        question: "هل الإعلانات تظهر بنفس الترتيب للجميع؟", 
        questionEn: "Do ads appear in the same order for everyone?",
        answer: "الإعلانات المميزة تظهر أولاً، والباقي حسب النشاط والفئة.",
        answerEn: "Premium ads appear first, and the rest according to activity and category."
      },
      { 
        id: "services-8", 
        question: "ما حجم الصور المسموح به؟", 
        questionEn: "What is the allowed image size?",
        answer: "حتى 5 ميجابايت لكل صورة.",
        answerEn: "Up to 5 megabytes for each image."
      }
    ]
  },
  {
    id: "support",
    title: "المساعدة والدعم الفني",
    titleEn: "Help and Technical Support",
    icon: "🛠️",
    questions: [
      { 
        id: "support-1", 
        question: "لدي مشكلة في الدفع، ماذا أفعل؟", 
        questionEn: "I have a payment problem, what should I do?",
        answer: "تواصل معنا من 'مركز الدعم' داخل حسابك، وسنراجع المشكلة فوراً.",
        answerEn: "Contact us from the 'Support Center' inside your account, and we will review the problem immediately."
      },
      { 
        id: "support-2", 
        question: "ما هي طرق الدفع المتاحة؟", 
        questionEn: "What are the available payment methods?",
        answer: "بطاقات بنكية، أو Payoneer، أو Wise، أو تحويل بنكي حسب بلدك.",
        answerEn: "Bank cards, or Payoneer, or Wise, or bank transfer depending on your country."
      },
      { 
        id: "support-3", 
        question: "هل توجد فواتير أو إيصالات بعد الدفع؟", 
        questionEn: "Are there invoices or receipts after payment?",
        answer: "بالتأكيد، ستحصل على فاتورة رقمية تلقائياً بعد كل عملية.",
        answerEn: "Certainly, you will automatically receive a digital invoice after every transaction."
      },
      { 
        id: "support-4", 
        question: "كيف أتواصل مع الدعم الفني؟", 
        questionEn: "How do I contact technical support?",
        answer: "من أيقونة 'الدردشة المباشرة' أسفل الصفحة أو نموذج 'اتصل بنا'.",
        answerEn: "From the 'Live Chat' icon at the bottom of the page or the 'Contact Us' form."
      },
      { 
        id: "support-5", 
        question: "كم يستغرق الرد من الدعم؟", 
        questionEn: "How long does it take for support to respond?",
        answer: "عادة أقل من 12 ساعة، وفي الحالات المستعجلة أسرع.",
        answerEn: "Usually less than 12 hours, and in urgent cases faster."
      }
    ]
  }
];

const contactInfoAr = {
  email: "mahmudadwallpro@gmail.com",
  facebook: "https://www.facebook.com/share/1a66tVz9jP/",
  instagram: "https://www.instagram.com/adwallpro",
  tiktok: "https://www.tiktok.com/@adwall.pro",
  phone: "+1234567890",
};

const contactInfoEn = { ...contactInfoAr };

export function ChatBot() {
  const { locale } = useI18n();
  const isArabic = locale === "ar";

  const initialBotMessage: Message = {
    id: 1,
    text: isArabic
      ? "مرحباً! أنا مساعد AdWallPro الذكي 🤖\n\nأنا هنا لمساعدتك في أي استفسار حول المنصة. اختر أحد الأقسام أدناه للإجابة على أسئلتك الشائعة!"
      : "Hello! I'm the AdWallPro assistant 🤖\n\nI'm here to help with any questions about the platform. Choose a category below to see frequently asked questions!",
    isBot: true,
    timestamp: new Date(),
  };

  // localized content picks
  const contactInfo = isArabic ? contactInfoAr : contactInfoEn;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset initial bot greeting when locale changes
  useEffect(() => {
    setMessages([initialBotMessage]);
  }, [locale]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const sendQuestion = (question: string, answer: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: question,
      isBot: false,
      timestamp: new Date(),
    };

    const botMessage: Message = {
      id: Date.now() + 1,
      text: answer,
      isBot: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
  };

  const clearChat = () => {
    setMessages([initialBotMessage]);
  };

  return (
    <>
      {/* زر فتح البوت */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
            size="icon"
          >
            <MessageCircle className="h-6 w-6 text-white" />
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping group-hover:animate-none"></div>
          </Button>
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>
      )}

      {isOpen && (
        <div dir={isArabic ? "rtl" : "ltr"} className="fixed bottom-6 left-6 z-50 w-80 h-[500px] animate-in slide-in-from-bottom duration-300">
          <Card className="h-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm flex flex-col rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className={isArabic ? "text-right" : "text-left"}>
                    <h3 className="font-bold text-sm">{isArabic ? "مساعد AdWallPro" : "AdWallPro Assistant"}</h3>
                    <p className="text-xs opacity-90 flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                      {isArabic ? "متصل الآن" : "Online now"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={clearChat}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200"
                    title={isArabic ? "مسح المحادثة" : "Clear conversation"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* المنطقة الرئيسية مع السكرول الشامل */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* محتوى الشات كله مع سكرول شامل */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/80 to-white/60"
              >
                {/* الأسئلة الشائعة */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 text-center font-medium">
                    {isArabic ? "📚 الأسئلة الشائعة" : "📚 Frequently Asked Questions"}
                  </p>
                  
                  <div className="space-y-2">
                    {faqData.map((category) => (
                      <div key={category.id} className="border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full px-3 py-3 text-sm font-medium text-gray-700 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{category.icon}</span>
                            <span>{isArabic ? category.title : category.titleEn}</span>
                          </div>
                          {expandedCategories.has(category.id) ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        
                        {expandedCategories.has(category.id) && (
                          <div className="border-t border-gray-100 px-3 py-2 space-y-1 bg-gray-50/30">
                            {category.questions.map((q) => (
                              <button
                                key={q.id}
                                onClick={() => sendQuestion(
                                  isArabic ? q.question : q.questionEn,
                                  isArabic ? q.answer : q.answerEn
                                )}
                                className={`w-full text-xs text-gray-600 p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-start gap-2 ${
                                  isArabic ? 'text-right flex-row-reverse' : 'text-left flex-row'
                                }`}
                              >
                                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                                <span className="flex-1">
                                  {isArabic ? q.question : q.questionEn}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* الرسائل */}
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`flex items-start gap-2 max-w-[85%] ${
                          message.isBot ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                            message.isBot
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {message.isBot ? (
                            <Bot className="h-3.5 w-3.5" />
                          ) : (
                            <User className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                            message.isBot
                              ? "bg-white text-gray-800 shadow-sm border border-gray-100"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                          } ${isArabic ? 'text-right' : 'text-left'}`}
                        >
                          {message.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-gray-200 bg-white/95 backdrop-blur-sm flex-shrink-0">
                <p className="text-xs text-gray-500 text-center">
                  {isArabic ? "AdWallPro Assistant 🤖 - دائماً هنا لمساعدتك" : "AdWallPro Assistant 🤖 - always here to help"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}