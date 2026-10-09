import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, Sparkles, CheckCircle2, 
  ShoppingBag, PhoneCall, RefreshCw, ShieldAlert, HeartHandshake,
  ChevronDown, Flame, Stethoscope, ArrowDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ChatMessage, sendChatMessageToGemini } from '../lib/geminiBot';
import { formatWhatsAppUrl } from '../lib/contactUtils';

export const AiDoctorChatBot: React.FC = () => {
  const { settings, offers, setSelectedOfferId } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultWelcomeMessage = 'السلام عليكم ورحمة الله وبركاته 🩺 مرحباً بك أخي / أختي الفاضلة!\nمعك الدكتور يونس، المستشار الطبي لخبير علاج المفاصل والغضاريف بـ SanamBio 🐪🌿.\n\nصحتك وراحتك هي رأس مالك.. كيف نقدر نعاونك اليوم؟ واش كتعاني من شي ألم في المفاصل (الركبة، الظهر، بوزلوم...)، أو باغي استشارة على أفضل باقة مناسبة لحالتك؟';

  const defaultSuggestedQuestions = [
    'السلام عليكم دكتور، بغيت استشارة طبية 🩺',
    'عندي خشونة وألم حاد في الركبة والغضروف 🦵',
    'كنعاني من عرق النسا (بوزلوم) وأسفل الظهر ⚡',
    'علاش باقة 4 علب + علبة مجاناً هي الأفضل لعلاج المفاصل؟ 🔥',
    'شحال ثمن العروض وكيفاش نستافد من التوصيل المجاني؟ 🏷️'
  ];

  const currentWelcome = settings.aiBot?.welcomeMessage && !settings.aiBot.welcomeMessage.includes('الباقة العائلية الاقتصادية (4 علب + علبة مجاناً)')
    ? settings.aiBot.welcomeMessage
    : defaultWelcomeMessage;

  const botConfig = {
    enabled: settings.aiBot?.enabled !== false,
    botName: settings.aiBot?.botName || 'د. يونس',
    botRoleTitle: settings.aiBot?.botRoleTitle || 'استشاري جراحة المفاصل والعظام وخبير الطب التكميلي بـ SanamBio',
    welcomeMessage: currentWelcome,
    suggestedQuestions: (settings.aiBot?.suggestedQuestions && settings.aiBot.suggestedQuestions.length > 0)
      ? settings.aiBot.suggestedQuestions
      : defaultSuggestedQuestions
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'bot',
      text: botConfig.welcomeMessage,
      timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      actionOfferId: 'offer-3',
      suggestedAction: 'order_now'
    }
  ]);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  if (botConfig.enabled === false) {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await sendChatMessageToGemini(text, [...messages, userMsg], settings, offers);
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.warn('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOrderAction = (offerId?: string) => {
    if (offerId) {
      setSelectedOfferId(offerId);
    }
    setIsOpen(false);
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
      orderForm.scrollIntoView({ behavior: 'smooth' });
      // Add temporary highlight effect
      orderForm.classList.add('ring-4', 'ring-emerald-500', 'transition-all', 'duration-500');
      setTimeout(() => {
        orderForm.classList.remove('ring-4', 'ring-emerald-500');
      }, 2000);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: botConfig.welcomeMessage || 'مرحباً بك مجدداً! 🩺 كيف نقدر نعاونك اليوم بخصوص صحة المفاصل أو الاستفسار عن باقات SanamBio؟',
        timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
        actionOfferId: 'offer-3',
        suggestedAction: 'order_now'
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button - Clean, professional square launcher, no obstructive popups */}
      <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 flex flex-col items-end pointer-events-auto select-none">
        {/* Compact 3D Square Launcher Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-emerald-600 via-teal-700 to-emerald-900 text-white rounded-2xl shadow-[0_10px_25px_rgba(5,150,105,0.45),0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(5,150,105,0.65)] border-2 border-emerald-300/70 hover:border-amber-400 transform hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer p-0"
            aria-label="استشارة فورية مع خبير سنام بيو"
          >
            {/* Online pulsing green indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-400 border-2 border-emerald-950"></span>
            </span>

            {/* Moving Bot Emoji */}
            <div className="text-2xl sm:text-3xl leading-none drop-shadow-md select-none transform transition-transform group-hover:scale-110">
              <span className="inline-block animate-bounce [animation-duration:1.6s]">🤖</span>
            </div>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-rose-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                1
              </span>
            )}
          </button>
        )}
      </div>

      {/* Main Chat Modal Window */}
      {isOpen && (
        <div 
          className="fixed bottom-20 sm:bottom-6 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[410px] max-w-lg h-[580px] max-h-[85vh] bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-emerald-500/40 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-4 border-b border-emerald-500/30 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>{botConfig.botName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </h3>
                <p className="text-[11px] text-emerald-200/80 font-medium">
                  {botConfig.botRoleTitle}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-300 font-semibold">متاح ومستعد للرد الفوري ⚡</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="إعادة بدء المحادثة"
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="إعادة بدء المحادثة"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="إغلاق"
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="إغلاق الدردشة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Special Banner */}
          <div className="bg-amber-500/15 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-[11px] text-amber-200">
            <div className="flex items-center gap-1.5 font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>عرض اليوم: توصيل مجاني + الدفع عند الاستلام بعد المعاينة</span>
            </div>
            <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md font-black text-[10px]">
              متبقي {settings.remainingStock} علبة
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-start' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'mr-auto bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-br-xs shadow-md font-medium'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-xs shadow-md'
                }`}>
                  {/* Message formatted lines */}
                  <div className="whitespace-pre-line text-[12.5px] leading-relaxed">
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={idx} className="font-black text-emerald-300 mt-1 mb-0.5">{line.replace(/\*\*/g, '')}</p>;
                      }
                      return <p key={idx} className="my-0.5">{line}</p>;
                    })}
                  </div>

                  {/* Action CTA Button inside Bot Message */}
                  {msg.sender === 'bot' && msg.suggestedAction === 'order_now' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex flex-col gap-2">
                      <button
                        onClick={() => handleOrderAction(msg.actionOfferId || 'offer-2')}
                        className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>طلب مرهم سنام بيو الآن (الدفع عند الاستلام)</span>
                        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                      </button>

                      {settings.whatsappNumber && (
                        <a
                          href={formatWhatsAppUrl(
                            settings.whatsappNumber,
                            'السلام عليكم، بغيت نستفسر على مرهم سنام الجمل SanamBio'
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                          <span>تحدث مع خبير عبر الواتساب مباشرة</span>
                        </a>
                      )}
                    </div>
                  )}

                  <span className="block text-[10px] text-slate-400 text-left mt-1.5 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2.5 text-slate-400">
                <div className="w-7 h-7 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700 px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-emerald-400">د. يونس يجهز الاستشارة الطبية...</span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {botConfig.suggestedQuestions?.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="whitespace-nowrap bg-slate-800/90 hover:bg-emerald-800/50 hover:border-emerald-500 text-slate-300 hover:text-white text-[11px] font-medium px-2.5 py-1.5 rounded-xl border border-slate-700 transition-all shrink-0 active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب استفسارك أو أين يتركز الألم لديك..."
                className="flex-1 bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl outline-hidden font-medium"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-md transition-all shrink-0 active:scale-95"
                aria-label="إرسال"
              >
                <Send className="w-4 h-4 transform -rotate-90" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1 font-medium">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>استشارة فورية مدعومة بالذكاء الاصطناعي (Gemini 3.7 Flash)</span>
              </span>
              <span>الدفع عند الاستلام 100%</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
