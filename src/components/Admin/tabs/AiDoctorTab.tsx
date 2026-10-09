import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { testGeminiApiKey } from '../../../lib/geminiBot';
import {
  Bot,
  Key,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Stethoscope,
  Users,
  TrendingUp
} from 'lucide-react';

export const AiDoctorTab: React.FC = () => {
  const { settings, updateSettings, saveAllSettingsToSupabase } = useStore();
  
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiTestStatus, setGeminiTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showApiKeyText, setShowApiKeyText] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleTestGeminiKey = async () => {
    const key = settings.aiBot?.geminiApiKey || '';
    setIsTestingGemini(true);
    setGeminiTestStatus(null);
    try {
      const res = await testGeminiApiKey(key);
      setGeminiTestStatus(res);
    } catch (e: any) {
      setGeminiTestStatus({ success: false, message: e.message || 'حدث خطأ أثناء الاتصال' });
    } finally {
      setIsTestingGemini(false);
    }
  };

  const handleSaveAiSettings = async () => {
    setIsSavingSettings(true);
    const ok = await saveAllSettingsToSupabase();
    setIsSavingSettings(false);
    if (ok) {
      setSaveSuccessMsg('تم حفظ وتشفير إعدادات الذكاء الاصطناعي في Supabase بنجاح! ✅');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-5 rounded-2xl border border-emerald-500/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Bot className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <span>روبوت الذكاء الاصطناعي الطبي والمبيعات (AI Doctor & Closer)</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30">
                Gemini 3.7 Flash ⚡
              </span>
            </h3>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              مستشار طبي ذكي يجمع بين خبرة استشاري المفاصل وعقلية المستثمر وبراعة البائع المحترف لإقناع أي زائر بالشراء فوراً.
            </p>
          </div>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 shrink-0">
          <span className="text-xs font-bold text-slate-300">تشغيل الروبوت في المتجر:</span>
          <button
            type="button"
            onClick={() => updateSettings({
              aiBot: {
                ...(settings.aiBot || {
                  botName: 'د. يونس & مستشار سنام بيو',
                  botRoleTitle: 'استشاري طبي وخبير علاج المفاصل والمبيعات',
                  geminiApiKey: '',
                  welcomeMessage: 'مرحباً بك! أنا المستشار الطبي لخبير المفاصل سنام بيو...',
                  tone: 'persuasive_doctor',
                  suggestedQuestions: []
                }),
                enabled: settings.aiBot?.enabled === false ? true : false
              }
            })}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              settings.aiBot?.enabled !== false
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            {settings.aiBot?.enabled !== false ? 'مفعل 🟢' : 'معطل 🔴'}
          </button>
        </div>
      </div>

      {/* 1. Gemini API Key Configuration Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-600" />
            <h4 className="font-black text-sm text-slate-900">مفاتيح Google Gemini API وحفظها المشفر في Supabase</h4>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
            سحابي ومحفوظ لجميع الزوار
          </span>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
            <span>مفتاح Gemini API الخاص بك (Custom API Key):</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-bold text-[11px]"
            >
              <span>احصل على مفتاح مجاني من Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <div className="relative flex items-center">
            <input
              type={showApiKeyText ? 'text' : 'password'}
              dir="ltr"
              value={settings.aiBot?.geminiApiKey || ''}
              onChange={(e) => updateSettings({
                aiBot: {
                  ...(settings.aiBot || {
                    enabled: true,
                    botName: 'د. يونس & مستشار سنام بيو',
                    botRoleTitle: 'استشاري طبي وخبير علاج المفاصل والمبيعات',
                    welcomeMessage: 'مرحباً بك!',
                    tone: 'persuasive_doctor',
                    suggestedQuestions: []
                  }),
                  geminiApiKey: e.target.value.trim()
                }
              })}
              placeholder="AIzaSy..."
              className="w-full pl-20 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-mono bg-slate-50 text-slate-900"
            />
            <button
              type="button"
              onClick={() => setShowApiKeyText(!showApiKeyText)}
              className="absolute left-3 text-slate-500 hover:text-slate-800 p-1 cursor-pointer"
              title={showApiKeyText ? 'إخفاء المفتاح' : 'إظهار المفتاح'}
            >
              {showApiKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            💡 يتم حفظ هذا المفتاح بأمان في جدول <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800">store_settings</code> على Supabase، ويستخدم نموذج الذكاء الاصطناعي السريع <strong className="text-slate-800">gemini-3.7-flash</strong> لتقديم استشارات فورية ومقنعة للزبائن.
          </p>
        </div>

        {/* Test Button & Result */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleTestGeminiKey}
            disabled={isTestingGemini}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black px-4 py-2 rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingGemini ? 'animate-spin' : ''}`} />
            <span>{isTestingGemini ? 'جار اختبار المفتاح...' : '⚡ فحص واختبار مفتاح Gemini الآن'}</span>
          </button>

          {geminiTestStatus && (
            <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 font-bold ${
              geminiTestStatus.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {geminiTestStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{geminiTestStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Bot Identity & Tone Settings */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h4 className="font-black text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>شخصية المستشار الطبي وأسلوب الإقناع والبيع (Sales Persona)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1">اسم الروبوت / المستشار المعروض للزبون:</label>
            <input
              type="text"
              value={settings.aiBot?.botName || ''}
              onChange={(e) => updateSettings({
                aiBot: {
                  enabled: true,
                  botRoleTitle: 'استشاري طبي وخبير علاج المفاصل والمبيعات',
                  geminiApiKey: '',
                  welcomeMessage: 'مرحباً بك أخي / أختي الفاضلة! أنا المستشار الطبي لخبير المفاصل سنام بيو...',
                  tone: 'persuasive_doctor',
                  suggestedQuestions: [],
                  ...(settings.aiBot || {}),
                  botName: e.target.value
                }
              })}
              placeholder="مثال: د. يونس & مستشار سنام بيو"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">الصفة واللقب المهني الفرعي:</label>
            <input
              type="text"
              value={settings.aiBot?.botRoleTitle || ''}
              onChange={(e) => updateSettings({
                aiBot: {
                  enabled: true,
                  botName: 'د. يونس & مستشار سنام بيو',
                  geminiApiKey: '',
                  welcomeMessage: 'مرحباً بك أخي / أختي الفاضلة! أنا المستشار الطبي لخبير المفاصل سنام بيو...',
                  tone: 'persuasive_doctor',
                  suggestedQuestions: [],
                  ...(settings.aiBot || {}),
                  botRoleTitle: e.target.value
                }
              })}
              placeholder="مثال: استشاري طبي وخبير علاج المفاصل والمبيعات"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        {/* Unified Master Persona Display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-bold text-slate-800">
              الشخصية الموحدة والشاملة للروبوت (مفعلة تلقائياً وتجمع كل المزايا):
            </label>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
              ✓ كافة الأدوار مدمجة معاً كطبيب إنسان حقيقي
            </span>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl border border-emerald-500/30 shadow-md">
            <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-700/80">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-black text-sm text-emerald-300">
                  د. يونس — الشخصية الهجينة الذكية (طبيب مقنع + ناصح مستثمر + ودود وإنساني + بائع محترف)
                </h5>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  لا تحتاج لاختيار دور واحد؛ الروبوت مبرمج ليتصرف كإنسان طبيب مغربي حقيقي يجمع بين الخبرة الطبية والود وحسن الإغلاق.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/20">
                <span className="font-black text-emerald-400 block mb-1 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>1. طبيب مقنع وعلمي</span>
                </span>
                <p className="text-slate-300 text-[10.5px] leading-relaxed">
                  يفهم تفاصيل تآكل الغضروف، نقص السائل الزلالي، وبوزلوم، ويفسر قوة امتصاص دهن ذروة الجمل الصحراوي.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/20">
                <span className="font-black text-amber-400 block mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>2. ناصح ومستثمر صحي</span>
                </span>
                <p className="text-slate-300 text-[10.5px] leading-relaxed">
                  يقنع الزبون بأن شراء باقة (4+1 مجاناً) استثمار رابح يوفر عليه آلاف الدراهم في العمليات والحقن الضارة.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/20">
                <span className="font-black text-blue-400 block mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>3. مستشار ودود وإنساني</span>
                </span>
                <p className="text-slate-300 text-[10.5px] leading-relaxed">
                  يرد على "سلام" بلطف وترحاب مغربي راقٍ، يتعاطف مع ألم المريض ويستمع إليه باهتمام قبل تقديم المشورة.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/20">
                <span className="font-black text-teal-400 block mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>4. بائع سريع الإغلاق</span>
                </span>
                <p className="text-slate-300 text-[10.5px] leading-relaxed">
                  يطمئن الزبون بالتوصيل المجاني والدفع عند الاستلام بعد المعاينة، ويقفل الطلب بسؤال مباشر ومريح.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-emerald-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>حماية التخصص (Niche): مبرمج لعدم الخروج عن صحة المفاصل وSanamBio تحت أي ظرف.</span>
              </span>
              <span className="font-bold text-amber-300">نشط لجميع الزوار</span>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">رسالة الترحيب الافتتاحية في الدردشة:</label>
          <textarea
            rows={3}
            value={settings.aiBot?.welcomeMessage || ''}
            onChange={(e) => updateSettings({
              aiBot: {
                enabled: true,
                botName: 'د. يونس & مستشار سنام بيو',
                botRoleTitle: 'استشاري طبي وخبير علاج المفاصل والمبيعات',
                geminiApiKey: '',
                tone: 'persuasive_doctor',
                suggestedQuestions: [],
                ...(settings.aiBot || {}),
                welcomeMessage: e.target.value
              }
            })}
            placeholder="مرحباً بك أخي / أختي الفاضلة! أنا المستشار الطبي لخبير المفاصل سنام بيو..."
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
          />
        </div>

        {/* Extra Training Directives */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">
            تعليمات وملاحظات إضافية لتدريب الذكاء الاصطناعي (Custom AI Directives):
          </label>
          <textarea
            rows={3}
            value={settings.aiBot?.systemPrompt || ''}
            onChange={(e) => updateSettings({
              aiBot: {
                enabled: true,
                botName: 'د. يونس & مستشار سنام بيو',
                botRoleTitle: 'استشاري طبي وخبير علاج المفاصل والمبيعات',
                geminiApiKey: '',
                welcomeMessage: '',
                tone: 'persuasive_doctor',
                suggestedQuestions: [],
                ...(settings.aiBot || {}),
                systemPrompt: e.target.value
              }
            })}
            placeholder="مثال: ركز على أن التوصيل خلال 24 ساعة للدار البيضاء والرباط ومراكش، ووضح أن المنتج مناسب أيضاً للرياضيين بعد التمارين..."
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* Save All Button Card */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="font-black text-xs text-emerald-950">حفظ إعدادات الروبوت في Supabase</p>
          <p className="text-[11px] text-emerald-800">
            عند الحفظ يتم تحديث بيانات المساعد ومفتاح Gemini فورياً لجميع الزوار على صفحة المتجر.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAiSettings}
          disabled={isSavingSettings}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSavingSettings ? 'animate-spin' : ''}`} />
          <span>{isSavingSettings ? 'جار الحفظ في Supabase...' : '💾 حفظ التعديلات في Supabase الآن'}</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}
    </div>
  );
};
