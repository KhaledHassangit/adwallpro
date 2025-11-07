"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, ChevronDown, ChevronUp, Sparkles, Trash2 } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Menu } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  questions: FAQQuestion[];
}

interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQCategory[] = [
  {
    id: "about",
    title: "عن الموقع والفكرة",
    icon: "💡",
    questions: [
      {
        id: "about-1",
        question: "شر هو موقع AdWallPro بالضبط؟",
        answer: "منصة ذكية للإعلانات الرقمية تتيح لأي شخص أو شركة عرض خدماته أو منتجاته بطريقة احترافية وموجهة."
      },
      {
        id: "about-2",
        question: "الموقع علمي ولا يشغل بدول محددة؟",
        answer: "الموقع علمي 🌟 ومتاح لأي مستخدم من أي دولة"
      },
      {
        id: "about-3",
        question: "شر الفرق بينكم وبين مواقع الإعلانات العادية؟",
        answer: 'نحن منصة "إعلانات ذكية" يعني الإعلانات بتعرض بناءً على الفئة والموقع الجغرافي والاهتمامات، مو بين قائمة عشوائية'
      },
      {
        id: "about-4",
        question: "هل في تطبيق خاص بالموقع؟",
        answer: "حاليًا الموقع يعمل بسلامة على الجوال، والتطبيق الرسمي قيد التطوير"
      },
      {
        id: "about-5",
        question: "شر معنى إن الموقع 'مدفوع'؟",
        answer: "يعني كل إعلان له خطة اشتراك محددة (أساسية أو مميزة) حسب المدة والميزات التي تختارها"
      },
      {
        id: "about-6",
        question: "هل في تجريب مجاني؟",
        answer: "أحيانًا نقدم عروض تجريبية مؤقتة، تابع إشعاراتنا حتى تعرف وقتها"
      },
      {
        id: "about-7",
        question: "هل الموقع يدعم أكثر من لغة؟",
        answer: "نعم، الموقع يدعم العربية والإنجليزية فقط"
      }
    ]
  },
  {
    id: "registration",
    title: "التسجيل والدخول",
    icon: "🔐",
    questions: [
      {
        id: "reg-1",
        question: "كيف أسرت بالموقع؟",
        answer: "اضغط على 'إنشاء حساب'، أدخل بياناتك واختر الدولة، بعدها فعّل حسابك وابدأ فوراً"
      },
      {
        id: "reg-2",
        question: "هل التسجيل مجاني؟",
        answer: "التسجيل نفسه مجاني، لكن نشر الإعلانات يحتاج اشتراك حسب الخطة"
      },
      {
        id: "reg-3",
        question: "نسبت كلمة السر، شر أعمال؟",
        answer: "اضغط 'نسيت كلمة المرور'، رح يوصلك رابط إعادة تعيين فوراً على بريدك الإلكتروني"
      },
      {
        id: "reg-4",
        question: "هل لازم أفعّل الحساب قبل أضيف إعلان؟",
        answer: "نعم، لازم تفعّل بريدك حتى نحافظ على جودة المستخدمين بالموقع"
      },
      {
        id: "reg-5",
        question: "فيني أفتح أكثر من حساب؟",
        answer: "ممكن، لكن ينصح تستخدم حساب واحد لكل إعلاناتك حتى تتابعها بسهولة"
      },
      {
        id: "reg-6",
        question: "شو فائدة لوحة التحكم؟",
        answer: "هي مركزك لإدارة الإعلانات، الإحصائيات، الدفع، التعديل، وكل شيء يخص حسابك"
      }
    ]
  },
  {
    id: "services",
    title: "الخدمات والإعلانات",
    icon: "🎯",
    questions: [
      {
        id: "services-1",
        question: "كيف أصيف إعلان جديد؟",
        answer: "من حسابك اضغط 'إضافة إعلان جديد'، عين التفاصيل والصور ثم اختار خطة النشر المناسبة"
      },
      {
        id: "services-2",
        question: "كم مدة الإعلان؟",
        answer: "تختلف حسب الخطة: من شهر إلى سنة كاملة، وقابلة للتجديد حسب رغبتك"
      },
      {
        id: "services-3",
        question: "فيني أصيف روابط لموقعي أو صفحتي؟",
        answer: "نعم، تقدر تضيف روابط لموقعك أو شبكاتك الاجتماعية"
      },
      {
        id: "services-4",
        question: "كيف أعرف إذا إعلاني تم قبوله؟",
        answer: "رح توصلك رسالة تأكيد بالبريد، وكمان بتشوف الحالة 'نشط' بلوحة التحكم"
      },
      {
        id: "services-5",
        question: "ليش يتم رفض إعلاني؟",
        answer: "عادة بسبب بيانات ناقصة أو محتوى غير واضح أو مخالف. بيرسلك السبب تتصله"
      },
      {
        id: "services-6",
        question: "هل ممكن أحدّث الإعلان؟",
        answer: "نعم، من لوحة التحكم بسهولة"
      },
      {
        id: "services-7",
        question: "هل الإعلانات بتتغير بنفس الترتيب للجميع؟",
        answer: "الإعلانات المميزة بتتظهر أولاً، والباقي حسب النشاط والفئة"
      }
    ]
  },
  {
    id: "support",
    title: "المساعدة والدعم",
    icon: "🛟",
    questions: [
      {
        id: "support-1",
        question: "عندي مشكلة بالدفع، شر أعمل؟",
        answer: "تواصل معنا من 'مركز الدعم' داخل حسابك، ورح نراجع المشكلة فوراً"
      },
      {
        id: "support-2",
        question: "شر طرق الدفع المتاحة؟",
        answer: "بطاقات بنكية أو Payoneer أو تحويل بنكي حسب بلدك"
      },
      {
        id: "support-3",
        question: "هل في فواتير أو إيصالات بعد الدفع؟",
        answer: "أكيد، تحصل على فاتورة رقمية تلقائياً بعد كل عملية"
      },
      {
        id: "support-4",
        question: "كيف أتواصل مع الدعم الفني؟",
        answer: 'من أيقونة "الدردشة المباشرة" أسفل الصفحة أو نموذج "اتصل بنا"'
      },
      {
        id: "support-5",
        question: "كم يستغرق الرد من الدعم؟",
        answer: "عادة أقل من 12 ساعة، وفي الحالات المستعجلة أقصر"
      }
    ]
  }
];

const contactInfo = {
  email: "mahmudadwallpro@gmail.com",
  facebook: "https://www.facebook.com/share/1a66tVz9jP/",
  instagram: "https://www.instagram.com/adwallpro",
  tiktok: "https://www.tiktok.com/@adwall.pro",
  phone: "+1234567890",
};

const quickActions = [
  { icon: "💳", text: "خطط الأسعار", query: "شر خطط الأسعار" },
  { icon: "🚀", text: "كيف أبدأ", query: "كيف أبدأ استخدام الموقع" },
  { icon: "📞", text: "اتصل بنا", query: "طرق التواصل" },
  { icon: "🔧", text: "مشكلة تقنية", query: "عندي مشكلة في الموقع" },
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "مرحباً! أنا مساعد AdWallPro الذكي 🤖\n\nأنا هنا لمساعدتك في أي استفسار حول المنصة. اختر أحد الأقسام أدناه أو اكتب سؤالك مباشرة!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showFAQ, setShowFAQ] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  const sendQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    setIsTyping(true);

    // البحث في الأسئلة الشائعة
    for (const category of faqData) {
      for (const q of category.questions) {
        if (q.question.toLowerCase().includes(message) || message.includes(q.question.toLowerCase())) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setIsTyping(false);
          return q.answer;
        }
      }
    }

    // ردود ذكية على أسئلة عامة
    if (message.includes("مرحبا") || message.includes("اهلا") || message.includes("السلام")) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsTyping(false);
      return "مرحباً بك! 😊\nأنا مساعد AdWallPro الذكي، كيف يمكنني مساعدتك اليوم؟";
    }

    if (message.includes("شكرا") || message.includes("مشكور") || message.includes("تمام")) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsTyping(false);
      return "العفو! 😊\nسعيد لأنني استطعت مساعدتك!\nهل لديك أي أسئلة أخرى؟";
    }

    if (message.includes("تواصل") || message.includes("اتصال") || message.includes("رابط")) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsTyping(false);
      return `📞 **طرق التواصل معنا:**\n\n📧 البريد الإلكتروني: ${contactInfo.email}\n📘 فيسبوك: ${contactInfo.facebook}\n📸 إنستغرام: ${contactInfo.instagram}\n📞 الهاتف: ${contactInfo.phone}\n\nنحن هنا لمساعدتك! 🚀`;
    }

    if (message.includes("خطة") || message.includes("سعر") || message.includes("دفع")) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsTyping(false);
      return `💳 **خطط الأسعار:**\n\n• **الخطة الأساسية:** مناسبة للمشاريع الصغيرة\n• **الخطة المميزة:** ميزات متقدمة وإظهار مميز\n• **الخطة الاحترافية:** أفضل الميزات وأقصى ظهور\n\nللتسعير التفصيلي، تفضل بزيارة صفحة الخطط على موقعنا! 🎯`;
    }

    // رد افتراضي
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsTyping(false);
    return `🤔 لم أجد إجابة محددة لسؤالك، لكنني هنا لمساعدتك!\n\nيمكنك:\n• اختيار سؤال من القائمة بالأعلى\n• التواصل مع الدعم الفني مباشرة\n• زيارة مركز المساعدة على موقعنا\n\nكيف يمكنني مساعدتك بشكل أفضل؟ 💫`;
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");

    const response = await getBotResponse(currentInput);
    const botMessage: Message = {
      id: Date.now() + 1,
      text: response,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "مرحباً! أنا مساعد AdWallPro الذكي 🤖\n\nأنا هنا لمساعدتك في أي استفسار حول المنصة. اختر أحد الأقسام أدناه أو اكتب سؤالك مباشرة!",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    setShowFAQ(true);
  };

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
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

      {/* نافذة البوت */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-80 h-[500px] animate-in slide-in-from-bottom duration-300">
          <Card className="h-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm flex flex-col rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">مساعد AdWallPro</h3>
                    <p className="text-xs opacity-90 flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                      متصل الآن
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={toggleFAQ}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200"
                    title={showFAQ ? "إخفاء الأسئلة" : "إظهار الأسئلة"}
                  >
                    <Menu className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    onClick={clearChat}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200"
                    title="مسح المحادثة"
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
                {/* الإجراءات السريعة والأسئلة الشائعة - تظهر في البداية */}
                {showFAQ && (
                  <div className="space-y-4">
                    {/* الإجراءات السريعة */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 text-center font-medium">⚡ إجراءات سريعة</p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => sendQuickAction(action.query)}
                            className="flex items-center gap-2 p-2 text-xs text-gray-700 bg-white/80 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 hover:scale-105"
                          >
                            <span className="text-sm">{action.icon}</span>
                            <span>{action.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* الأسئلة الشائعة */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 text-center font-medium">📚 الأسئلة الشائعة</p>
                      
                      <div className="space-y-2">
                        {faqData.map((category) => (
                          <div key={category.id} className="border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                            <button
                              onClick={() => toggleCategory(category.id)}
                              className="w-full px-3 py-3 text-right text-sm font-medium text-gray-700 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-base">{category.icon}</span>
                                <span>{category.title}</span>
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
                                    onClick={() => sendQuestion(q.question, q.answer)}
                                    className="w-full text-right text-xs text-gray-600 p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-start gap-2"
                                  >
                                    <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                                    <span className="flex-1">{q.question}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* الرسائل - تظهر بعد الأقسام */}
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
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* مؤشر الكتابة */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 max-w-[80%] flex-row">
                      <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="rounded-2xl px-4 py-3 text-sm bg-white text-gray-800 shadow-sm border border-gray-100">
                        <div className="flex space-x-1 items-center">
                          <span className="text-xs text-gray-500 mr-2">يكتب...</span>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* منطقة الإدخال - ثابتة في الأسفل */}
              <div className="p-3 border-t border-gray-200 bg-white/95 backdrop-blur-sm flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب سؤالك هنا..."
                    className="flex-1 text-sm rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AdWallPro Assistant 🤖 - دائماً هنا لمساعدتك
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}