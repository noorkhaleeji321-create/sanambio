import { GoogleGenAI } from '@google/genai';
import { StoreSettings, ProductOffer } from '../types/store';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionOfferId?: string;
  suggestedAction?: 'order_now' | 'view_offers' | 'view_video' | 'whatsapp';
}

/**
 * Builds the comprehensive unified Master Prompt combining:
 * 1. طبيب مقنع (Medical specialist & cartilage expert with deep anatomical reasoning)
 * 2. ناصح ومستثمر صحي (Smart financial advisor comparing natural cure vs expensive surgeries/painkillers)
 * 3. مستشار صحي ودود وإنساني (Warm Moroccan hospitality, answers greetings politely like a real human doctor)
 * 4. بائع محترف وسريع الإغلاق (Master persuasive sales closer, driving orders with trust, COD, and free shipping)
 * 5. حماية التخصص الصارم (Strict joint & spine health guardrail, never strays outside the store niche)
 */
function buildSystemPrompt(settings: StoreSettings, offers: ProductOffer[]): string {
  const customExtra = settings.aiBot?.systemPrompt || '';
  const botName = settings.aiBot?.botName || 'د. يونس';
  const botRole = settings.aiBot?.botRoleTitle || 'استشاري جراحة المفاصل والعظام وخبير الطب التكميلي بـ SanamBio';
  const offersList = offers.map(o => `- ${o.title}: السعر ${o.price} ${settings.currency} (تخفيض ${o.discountPercentage}%) ${o.freeGift ? `+ هدية: ${o.freeGift}` : ''}`).join('\n');

  return `
قواعد ملزمة وأساسية:
- أنت طبيب إنسان حقيقي ومغربي (د. يونس) يتواصل مباشرة مع زبونه/مريضه.
- ممنوع منعاً كلياً كتابة أو ذكر أي عبارات مثل: "System prompt" أو "تعليمات" أو "تحليل" أو إخراج أي تفكير داخلي بصوت عالٍ. لا تبدأ إجابتك بنقطتين عموديتين ":" أو بملاحظات تقنية أبداً!
- ادخل في صلب الحوار فوراً بالترحيب الطبي اللطيف والتطمين بالدارجة المغربية الراقية والمهذبة.

أنت الآن "${botName}" (${botRole}) - طبيب ومستشار صحي مغربي واقعي وإنساني 100% لمتجر "SanamBio - دهن ذروة سنام الجمل الصحراوي الأصلي".

⭐ هويتك الرباعية الموحدة والمتكاملة (تعمل جميعها معاً في كل رد دون استثناء):
1. 🩺 **طبيب مقنع وذو حجة علمية رصينة:**
   - تشرح أسباب الألم ببساطة علمية مفهومة (تآكل الغضروف، نقص السائل الزلالي المفصلي Synovial fluid، الاحتكاك العظمي، التهاب وانضغاط العصب الوركي بوزلوم/عرق النسا، تشنج العضلات والفقرات القطنية والعنقية).
   - توضح كيف يعالج دهن ذروة سنام الجمل الأصلي المشكلة جذرياً: غني جداً بالأحماض الدهنية الأساسية (Omega 3, 6, 9) وحمض اللينوليك بخصائص نفاذية جلدية خارقة تتغلغل مباشرة لكبسولة المفصل لتعويض السائل وتزييت المفصل ومنع الاحتكاك.
   - مدعوم بزيوت علاجية مغربية نقية: زيت الأركان، الأوكاليبتوس، الزعتر، زيت القرنفل (بمادة الأوجينول المسكنة الفورية)، وزيت الحبة السوداء.
   - طبيعي 100%، بدون كورتيزون، بدون مواد كيميائية، آمن تماماً لمرضى السكري والضغط وكبار السن والمرضعات.

2. 💡 **ناصح ومستثمر صحي حكيم:**
   - توعي الزبون بأن صحته هي رأس ماله الحقيقي ("صحتك هي رأس مالك وليست مجالاً للمجازفة").
   - تقارن بين الاستثمار في كورس طبيعي فعال مقابل إهدار آلاف الدراهم في المسكنات الكيميائية التي تدمر المعدة والكلى، أو إبر الجيل والكورتيزون المؤقتة (1500 - 3000 درهم)، أو مخاطر العمليات الجراحية المعقدة.
   - تركز بحكمة واقتناع على أن **"الباقة العائلية الاقتصادية (4 علب + علبة مجاناً بـ 399 درهم)"** هي الاستثمار الأذكى والأوفر على الإطلاق:
     * توفر كورس علاجي متواصل لمدة 3-4 أشهر لضمان التجديد الكامل للسائل والغضروف وعدم عودة الألم.
     * توفر أكثر من 600 درهم مقارنة بالعلب الفردية، وتكفي لمشاركة الوالدين أو شريك الحياة.

3. 🤝 **مستشار صحي ودود، مؤدب وإنساني:**
   - إذا كتب الزبون تحية فقط (مثل: "سلام"، "السلام عليكم"، "صباح الخير"، "مساء الخير"، "salam"، "bonjour"):
     رد عليه بأدب ودفء مغربي أصيل أولاً: رحب به ترحيباً حاراً ("وعليكم السلام ورحمة الله وبركاته، مرحباً بك أخي الكريم / أختي الفاضلة، شرفتينا... معك الدكتور يونس 🩺")، واسأله بلطف عن حال صحته وما إذا كان يعاني من ألم في المفاصل أو الركبة أو الظهر لتقديم المشورة المناسبة. لا تسرد عليه نصاً دعائياً طويلاً مفاجئاً عندما يسلم فقط!
   - تعاطف بصدق مع ألم المريض، وأشعره بأنك تتفهم معاناته في الصلاة، صعود الدرج، أو النوم.
   - استخدم الدارجة المغربية الراقية والمهذبة (أخي الكريم، للا الفاضلة، سيدي العزيز، على الراس والعين، مرحبا بك، الله يشافيك). ويفهم ويكتب أيضاً بالعربية الفصحى والفرنسية بحسب لغة الزبون.

4. ⚡ **بائع محترف وسريع الإغلاق (Master Closer):**
   - لا تترك المحادثة معلقة بدون توجيه واضح ومطمئن.
   - طمئن الزبون دائماً بعوامل الثقة القصوى:
     * التوصيل مجاني وسريع 100% لجميع مدن وقرى المغرب (خلال 24 إلى 48 ساعة).
     * الدفع عند الاستلام (COD) بعد فتح الطرد ومعاينة العلب بنفسه.
     * ضمان أصالة ورضا كامل.
   - اختم كلامك بسؤال إغلاق لطيف ومحفز: "واش نسجل ليك طلبك دابا تستافد من التوصيل المجاني والدفع بعد المعاينة؟".

5. 🛡️ **حماية التخصص الصارم (عدم الخروج عن النيتش أبداً):**
   - أنت طبيب متخصص حصرياً في صحة المفاصل، العظام، الغضاريف، آلام الظهر، ومنتجات SanamBio.
   - إذا سألك الزبون عن أي موضوع خارج هذا التخصص (مثل السياسة، الطبخ، الرياضة، السيارات، التكنولوجيا، العملات الرقمية...):
     رد عليه بلطف وابتسامة وأعد توجيه الحوار بحكمة لمجال صحة المفاصل، مثل:
     "مرحباً بك أخي العزيز! أنا هنا كطبيب ومستشار صحي مخصص فقط لمساعدتك في علاج آلام المفاصل، الركبة، والظهر بمرهم سنام الجمل SanamBio 🩺🌿. واش كتعاني نتا ولا شي حد من الأسرة من شي حريق نقدر نعاونك فيه؟"

💰 عروض المتجر المتوفرة حالياً:
${offersList}
- المخزون المتبقي: متبقي ${settings.remainingStock} باقة فقط بسعر العرض الترويجي.

${customExtra ? `\nتعليمات إضافية خاصة من الإدارة:\n${customExtra}` : ''}
`.trim();
}

/**
 * Highly comprehensive smart local medical advisor engine.
 * Ensures the bot answers every possible joint question authentically in Moroccan Darija,
 * even when offline or before configuring the API key.
 */
function getSmartFallbackResponse(userText: string, settings: StoreSettings, offers: ProductOffer[]): { text: string; actionOfferId?: string; suggestedAction?: 'order_now' | 'view_offers' | 'whatsapp' } {
  const clean = userText.trim();
  const lower = clean.toLowerCase();

  // Primary offers
  const primaryOffer = offers.find(o => o.id === 'offer-3') || offers.find(o => o.bestValue) || offers.find(o => o.popular) || offers[0] || { id: 'offer-3', title: '4 علب + علبة مجاناً', price: 399 };
  const mediumOffer = offers.find(o => o.id === 'offer-2') || offers[1] || { id: 'offer-2', title: '2 علب + هدية مجانية', price: 299 };

  // 1. Simple Greetings (سلام، الو، صباح الخير، bonjou, salut...)
  const isGreetingOnly = /^(سلام|السلام|سلام عليكم|السلام عليكم|صباح الخير|مساء الخير|الو|ألو|مرحبا|مرحباً|أهلاً|اهلين|salam|slm|salut|bonjour|bonsoir|alo|hello|hi|cv|labas|chokran)$/i.test(clean) ||
    (lower.length < 15 && (lower.includes('سلام') || lower.includes('salam') || lower.includes('bonjour') || lower.includes('مرحبا') || lower.includes('الو')));

  if (isGreetingOnly) {
    return {
      text: `وعليكم السلام ورحمة الله وبركاته 🩺 مرحباً بك أخي / أختي الفاضلة! شرفتينا وعلى الراس والعين.

معك الدكتور يونس، المستشار الطبي لخبير علاج المفاصل والغضاريف بـ **SanamBio** 🐪🌿.

صحتك وراحتك هي رأس مالك.. كيف نقدر نعاونك اليوم؟ واش كتعاني من شي ألم في الركبة، أسفل الظهر، أو عرق النسا (بوزلوم) محتاج فيه استشارة طبية دقيقة؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 2. Off-topic questions guardrail (سيارات، كورة، طبخ، برمجة، طقس...)
  const isOffTopic = lower.includes('ماتش') || lower.includes('كورة') || lower.includes('كرة') || lower.includes('سيارة') || lower.includes('موطور') || lower.includes('بيتزا') || lower.includes('طياب') || lower.includes('برمجة') || lower.includes('بيتكوين') || lower.includes('football') || lower.includes('voiture');
  if (isOffTopic) {
    return {
      text: `مرحباً بك أخي الكريم! 🩺
أنا هنا كطبيب ومستشار صحي مخصص فقط لصحة المفاصل، الغضاريف، وعلاج آلام الركبة والظهر وعرق النسا بـ **SanamBio** 🐪🌿.

واش كتعاني نتا أو شي حد من العائلة من شي حريق أو برودة في المفاصل نقدر نفيدك فيه طبياً؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 3. Knee Pain, Cartilage, Crackling (ركبة، خشونة، غضروف، طقطقة، احتكاك، genou...)
  if (lower.includes('ركبة') || lower.includes('ركابي') || lower.includes('rkba') || lower.includes('rkabi') || lower.includes('genou') || lower.includes('خشونة') || lower.includes('غضروف') || lower.includes('طقطقة') || lower.includes('احتكاك') || lower.includes('cartilage')) {
    return {
      text: `ألف سلامة عليك أخي/أختي الفاضلة! 🩺 كطبيب، كنأكد ليك أن آلام وطقطقة الركبة كتكون ناتجة عن **نقص السائل الزلالي المفصلي (Synovial Fluid)** اللي كيحمي الغضروف من الاحتكاك المباشر.

💡 **الحل العلمي بـ SanamBio**:
دهن ذروة سنام الجمل الصحراوي الطبيعي غني جداً بأحماض (أوميغا 3 و 6 و 9) بنفاذية فائقة كتخترق لداخل كبسولة الركبة، كتعوض نقص السائل وكتوقف الاحتكاك والتآكل من أول أسبوع.

💰 **نصيحتي كطبيب ومستثمر في صحتك**:
باش تقضي على الخشونة نهائياً وتتجنب الحقن الكيميائية أو العمليات المكلفة، كنصحك بـ **الباقة العائلية الاقتصادية (4 علب + علبة مجاناً بـ ${primaryOffer.price} ${settings.currency})**:
- كورس علاجي متكامل يضمن ترميم الغضروف بشكل دائم.
- توفير أكثر من 600 درهم + صابونة الأعشاب مجاناً + توصيل مجاني لباب دارك والدفع بعد المعاينة!

واش نسجل ليك هاد الباقة دابا تستافد من العرض قبل نفاد المخزون؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 4. Sciatica & Bouzelloum (بوزلوم، عرق النسا، سياتيك، تنميل، رجل...)
  if (lower.includes('بوزلوم') || lower.includes('عرق النسا') || lower.includes('سياتيك') || lower.includes('bouzelloum') || lower.includes('bouzelom') || lower.includes('sciatique') || lower.includes('تنميل') || lower.includes('عصب') || lower.includes('فخذ') || lower.includes('عرق النسا')) {
    return {
      text: `شافاك الله وعافاك! 🩺 آلام عرق النسا (بوزلوم) كتعتبر من أقسى الآلام حيت كتنتج عن انضغاط والتهاب العصب الوركي الممتد من أسفل الظهر حتى للأصابع.

مرهم **SanamBio** بخلاصة القرنفل النقي (المسكن الفوري للأعصاب)، الأوكاليبتوس، ودهن ذروة الجمل:
1️⃣ كيرخي العضلات المتشنجة حول الفقرات القطنية فورياً.
2️⃣ كيزيل الضغط على العصب الوركي وكيوقف التنميل والحرقة في الفخذ والساق.

📦 كنصحك بـ **الباقة العائلية التوفيرية (4 علب + علبة مجاناً بـ ${primaryOffer.price} ${settings.currency})** لضمان كورس علاجي مكثف يقضي على المشكل نهائياً ولا يرجع لك أبداً.

التوصيل راه بالمجان 100% لجميع مدن المغرب، وما كتخلص حتى كتوصلك الأمانة وتفتحها بيدك! واش تبغي نأكدو ليك الطلب؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 5. Back & Spine (ظهر، ضهري، فقرات، عمود فقري، سنسول، dos...)
  if (lower.includes('ظهر') || lower.includes('ضهري') || lower.includes('dher') || lower.includes('dahr') || lower.includes('dos') || lower.includes('فقرات') || lower.includes('عمود') || lower.includes('سنسول') || lower.includes('lombaires')) {
    return {
      text: `مرحباً بك أخي/أختي الكريمة! 🩺 آلام أسفل الظهر والفقرات غالباً كتجي إما من البرودة القديمة، الجلوس الطويل، أو إجهاد أربطة العمود الفقري.

التركيبة الدافئة لـ **SanamBio** كدهن ذروة الجمل الصحراوي كتنشط الدورة الدموية في منطقة الفقرات وكتعطي راحة فورية وإحساس عميق بالخفة والدفء من أول تدليك قبل النوم.

💡 استثمارك في صحة ظهرك هو استثمار في قدرتك على الحركة والعمل والصلاة براحة تامة. **باقة (4 علب + 1 مجاناً بـ ${primaryOffer.price} ${settings.currency})** أو **باقة (2 علب بـ ${mediumOffer.price} ${settings.currency})** كتوفر ليك أفضل نتيجة.

واش نسجل ليك طلبيتك دابا مع التوصيل المجاني؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 6. Neck & Shoulders (عنق، رقبة، كتف، كتاف...)
  if (lower.includes('عنق') || lower.includes('رقبة') || lower.includes('كتف') || lower.includes('اكتاف') || lower.includes('كتافي') || lower.includes('cou') || lower.includes('epaule')) {
    return {
      text: `أهلاً بك! تشنج الرقبة والأكتاف كيكون سببه الرئيسي تيبس العضلات العنقية وضغط الأعصاب بسبب الوسادة أو البرودة أو العمل على الشاشات.

تدليك خفيف بمرهم **SanamBio** لمدة 3 دقائق كيدوب هاد التشنج فورياً بفضل الزيوت الطيارة ودهن سنام الجمل الملين للأنسجة.

العرض الأنسب لك هو **باقة 2 علب بـ ${mediumOffer.price} ${settings.currency}** أو **الباقة العائلية الكبرى (4+1 مجاناً)**. الشحن مجاني والدفع بعد المعاينة!`,
      actionOfferId: mediumOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 7. Rheumatism & Cold (روماتيزم، برودة، انتفاخ، اصابع، rhumatisme...)
  if (lower.includes('روماتيزم') || lower.includes('برودة') || lower.includes('انتفاخ') || lower.includes('rhumatisme') || lower.includes('مفصل') || lower.includes('اصابع') || lower.includes('يدين')) {
    return {
      text: `أهلاً بك! البرودة والروماتيزم كيحتاجو مادة دافئة طبيعية كتطرد الرطوبة من العظام وتكبح إنزيمات الالتهاب.

دهن ذروة سنام الجمل معروف في الطب الصحراوي التكميلي بأنه أقوى مضاد طبيعي للبرودة المفصلية، وكيعيد المرونة لأصابع اليدين والركبتين بدون أي آثار جانبية.

كنصحك بكورس متواصل عبر **الباقة الاقتصادية (4 علب + علبة مجاناً بـ ${primaryOffer.price} درهم)**. واش ترغب في الاستفادة من التوصيل السريع لمدينتك؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 8. Why 4+1 Free is the best offer (علاش باقة 4 علب...)
  if (lower.includes('4 علب') || lower.includes('علاش باقة') || lower.includes('العائلية') || lower.includes('اقتصادية') || lower.includes('pourquoi 4')) {
    return {
      text: `سؤال ذكي جداً أخي/أختي الفاضلة! 🩺 كطبيب وخبير، إليك الأسباب الثلاثة علاش **باقة (4 علب + علبة مجاناً بـ 399 درهم)** هي الأكثر طلباً وذكاءً:

1️⃣ **طبياً (الشفاء التام الدائم)**: تجديد غضاريف الركبة وبناء السائل المفصلي كيحتاج من شهرين إلى 3 أشهر متواصلة. علبة واحدة كتسكن الألم لكن ما كتكملش مرحلة التجديد الشامل.
2️⃣ **اقتصادياً (أكبر توفير)**: كتاخد 5 علب بثمن 4 فقط، يعني العلبة كطيح عليك بـ 79 درهم فقط عوض 199 درهم! كتوفر أكثر من 600 درهم في جيبك.
3️⃣ **عائلياً**: علب إضافية تقدر تهديهم للوالدين أو تستعملهم العائلة كاملة.

🎁 وفوق هادشي: صابونة الأعشاب الطبيعية مجاناً + توصيل مجاني حتى للدار والدفع بعد فتح الطرد ومعاينته. واش نسجلها ليك دابا؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 9. Pricing & Offers (شحال، ثمن، سعر، prix, combien, taman, chhal...)
  if (lower.includes('ثمن') || lower.includes('شحال') || lower.includes('سعر') || lower.includes('prix') || lower.includes('combien') || lower.includes('taman') || lower.includes('chhal') || lower.includes('عروض') || lower.includes('باقة')) {
    const offersLines = offers.map(o => `⭐ **${o.title}**: بـ **${o.price} ${settings.currency}** ${o.originalPrice ? `(عوض ~~${o.originalPrice} ${settings.currency}~~)` : ''} ${o.freeGift ? `🎁 + هدية: ${o.freeGift}` : ''}`).join('\n');

    return {
      text: `مرحباً بك! إليك عروضنا الترويجية الرسمية بالمغرب اليوم:

${offersLines}

🔥 **نصيحة د. يونس الأكثر توفيراً**: باقة **${primaryOffer.title}** بـ **${primaryOffer.price} ${settings.currency}** فقط (كورس علاجي متكامل يوفر عليك آلاف الدراهم في العيادات).

🚚 التوصيل مجاني 100% لجميع مدن وقرى المغرب.
💵 الدفع عند الاستلام بعد فتح وفحص الطرد.
🛡️ ضمان الرضا الذهبي.

شنو هي الباقة اللي تناسبك باش نحجزها ليك قبل نفاد المخزون؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 10. Ingredients, Safety & Cortisone (مكونات، طبيعي، كورتيزون، سكر، طونسيو، حامل...)
  if (lower.includes('مكونات') || lower.includes('طبيعي') || lower.includes('كورتيزون') || lower.includes('مكون') || lower.includes('سكر') || lower.includes('طونسيو') || lower.includes('ضغط') || lower.includes('حامل') || lower.includes('اعراض') || lower.includes('naturel') || lower.includes('danger')) {
    return {
      text: `كنطمنك تطمين طبي تام أخي/أختي الكريمة! 🌿
مرهم **SanamBio** طبيعي 100% مستخلص بطرق تقليدية معقمة:
- المكون الأساسي: دهن ذروة سنام الجمل الصحراوي النقي (ذروة حرة).
- زيوت نباتية أصلية: الأركان المغربي، الأوكاليبتوس، القرنفل، الزعتر، والحبة السوداء.
- **خالٍ تماماً من الكورتيزون، المواد الحافظة، أو الملونات الكيميائية**.
- آمن 100% لمرضى السكري والضغط الدموي والمسنين، وليس له أي أعراض جانبية نهائياً.

صحتك في أمان تام مع ضمان الجودة والأصالة! واش تحب تطلب كورس العلاج الآن؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 11. How to use (طريقة الاستعمال، كيفاش نستعمل...)
  if (lower.includes('استعمال') || lower.includes('نستعمل') || lower.includes('طريقة') || lower.includes('كيفاش') || lower.includes('mode d\'emploi') || lower.includes('comment')) {
    return {
      text: `طريقة الاستعمال الصحيحة الموصى بها طبياً بسيطة جداً:
1️⃣ غسل المنطقة بالماء الدافئ لفتح مسام الجلد وتجفيفها بلطف.
2️⃣ وضع كمية بحجم حبة الحمص من مرهم SanamBio.
3️⃣ التدليك بحركات دائرية هادئة لمدة 2 إلى 3 دقائق حتى يتشرب الجلد المرهم تماماً.
4️⃣ تكرار العملية مرتين في اليوم (صباحاً وقبل النوم).

النتيجة كتبان من الأيام الأولى براحة فورية وخفة في الحركة! واش ترغب في طلب باقتك اليوم؟`,
      actionOfferId: mediumOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 12. Delivery, Shipping & Payment (توصيل، شحن، فوقاش، خلاص، معاينة، livraison...)
  if (lower.includes('توصيل') || lower.includes('شحن') || lower.includes('livraison') || lower.includes('فوقاش') || lower.includes('خلاص') || lower.includes('دفع') || lower.includes('معاينة') || lower.includes('ضمان')) {
    return {
      text: `معاملتنا مبنية على الثقة التامة أخي/أختي الفاضلة:
🚚 **التوصيل مجاني 100%** وسريع كيوصلك حتى لباب منزلك في أي مدينة أو قرية بالمغرب (خلال 24 إلى 48 ساعة).
📦 **المعاينة قبل الأداء**: الموزع كيعطيك الطرد، كتفتحه وتتأكد من العلب والمحتوى عاد كتخلصه نقداً.
🛡️ **ضمان الرضا**: منتج أصلي ومضمون 100%.

ما عندك حتى شي مخاطرة! واش تحب نسجل ليك طلبيتك الآن؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 13. Direct purchase intent (بغيت نشري، بغيت نطلب، سجل ليا...)
  if (lower.includes('نشري') || lower.includes('نطلب') || lower.includes('سجل') || lower.includes('commander') || lower.includes('شراء') || lower.includes('بغيت')) {
    return {
      text: `على الراس والعين أخي/أختي الكريمة! 🩺 خطوة ممتازة للاعتناء بصحتك.

باش نسجلو ليك طلبيتك فوراً ونشحنوها ليك بالمجان:
تقدر تنقر مباشرة على زر **"طلب الباقة الآن"** في الأسفل لملء اسمك ومدينتك ورقمك في ثوانٍ، أو تواصل معنا مباشرة عبر الواتساب.

واش تحب نثبت ليك **الباقة العائلية (4 علب + 1 مجاناً بـ 399 درهم)** الأكثر توفيراً؟`,
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  }

  // 14. General human doctor response
  return {
    text: `أهلاً ومرحباً بك أخي / أختي الكريمة في عيادتك واستشارتك المباشرة مع د. يونس بـ **SanamBio** 🐪🌿.

مرهم سنام الجمل هو العلاج الطبيعي الأصلي الأول بالمغرب المصمم خصيصاً للتخلص من آلام المفاصل، خشونة الركبة، عرق النسا (بوزلوم)، وآلام أسفل الظهر.

مكونات طبيعية 100% بدون أي كورتيزون، مع توصيل مجاني لباب دارك والدفع بعد المعاينة.

باش نقدر ننصحك بدقة طبية تامة: شنو هي البلاصة اللي كتعاني منها من الألم وشحال هادي وهاد الحريق معاك؟`,
    actionOfferId: primaryOffer.id,
    suggestedAction: 'order_now'
  };
}

/**
 * Sends prompt with resilient fallback model strategy based on @google/genai guidelines
 */
async function callGeminiApiWithFallback(ai: GoogleGenAI, params: Omit<Parameters<typeof ai.models.generateContent>[0], 'model'>) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
  let lastErr: any;
  for (const model of modelsToTry) {
    try {
      return await ai.models.generateContent({
        ...params,
        model,
      });
    } catch (err: any) {
      lastErr = err;
      console.warn(`Model ${model} unavailable (${err?.status || err?.message}), trying fallback model...`);
      continue;
    }
  }
  throw lastErr;
}

/**
 * Tests a given Gemini API Key against Google GenAI SDK.
 */
export async function testGeminiApiKey(apiKey: string): Promise<{ success: boolean; message: string }> {
  if (!apiKey || apiKey.trim().length === 0) {
    return { success: false, message: 'يرجى إدخال مفتاح Gemini API أولاً.' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const response = await callGeminiApiWithFallback(ai, {
      contents: 'قل كلمة واحدة فقط: متصل',
    });

    if (response && response.text) {
      return { success: true, message: 'تم فحص المفتاح بنجاح! الاتصال بـ Google Gemini نشط وجاهز.' };
    }
    return { success: true, message: 'تم التحقق من المفتاح بنجاح.' };
  } catch (err: any) {
    console.warn('Gemini test failed:', err);
    return {
      success: false,
      message: `فشل الاتصال: ${err?.message || 'تأكد من صحة المفتاح وتفعيله في Google AI Studio'}`
    };
  }
}

/**
 * Sends a prompt to Gemini 3.8 Flash using the modern @google/genai SDK,
 * falling back gracefully to the rich local doctor engine if no key or on error.
 */
export async function sendChatMessageToGemini(
  userText: string,
  history: ChatMessage[],
  settings: StoreSettings,
  offers: ProductOffer[]
): Promise<ChatMessage> {
  const apiKey = (settings.aiBot?.geminiApiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || '').trim();

  // Primary featured offer
  const primaryOffer = offers.find(o => o.id === 'offer-3') || offers.find(o => o.bestValue) || offers[0] || { id: 'offer-3' };

  // If no API key, use rich local intelligent consultant engine
  if (!apiKey) {
    const fallback = getSmartFallbackResponse(userText, settings, offers);
    return {
      id: 'bot-' + Date.now(),
      sender: 'bot',
      text: fallback.text,
      timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      actionOfferId: fallback.actionOfferId || primaryOffer.id,
      suggestedAction: fallback.suggestedAction || 'order_now'
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = buildSystemPrompt(settings, offers);

    // Build valid alternating chat contents:
    // Drop initial bot greetings that occur before any user message,
    // ensure strict alternation, and avoid duplicating the current userText.
    const pastMessages: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    const prior = history.slice(0, -1).slice(-8);

    for (const msg of prior) {
      if (pastMessages.length === 0 && msg.sender !== 'user') {
        continue;
      }
      const role = msg.sender === 'user' ? 'user' : 'model';
      if (pastMessages.length > 0 && pastMessages[pastMessages.length - 1].role === role) {
        pastMessages[pastMessages.length - 1].parts[0].text += '\n' + msg.text;
      } else {
        pastMessages.push({ role, parts: [{ text: msg.text }] });
      }
    }

    // Append the current turn
    pastMessages.push({ role: 'user', parts: [{ text: userText }] });

    const response = await callGeminiApiWithFallback(ai, {
      contents: pastMessages,
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: {
          thinkingBudget: 0
        },
        temperature: 0.7,
        maxOutputTokens: 700,
      }
    });

    let replyText = (response.text || '').trim();

    // Sanitize any leaked system instruction, thinking tags or meta comments
    replyText = replyText
      .replace(/^[:\s]*(?:System prompt|System prompt mentions|Analysis|Thought|Reasoning|Note)[^\n]*\n?/gi, '')
      .replace(/^[:\s]*\[System prompt[^\n]*\]\n?/gi, '')
      .trim();

    // If reply is empty or leaked prompt text or starts with a colon, use the local doctor engine
    if (!replyText || replyText.startsWith(':') || replyText.toLowerCase().includes('system prompt')) {
      const fallback = getSmartFallbackResponse(userText, settings, offers);
      replyText = fallback.text;
    }

    return {
      id: 'bot-' + Date.now(),
      sender: 'bot',
      text: replyText,
      timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      actionOfferId: primaryOffer.id,
      suggestedAction: 'order_now'
    };
  } catch (err: any) {
    console.warn('Gemini API call failed, using intelligent fallback:', err?.message);
    const fallback = getSmartFallbackResponse(userText, settings, offers);
    return {
      id: 'bot-' + Date.now(),
      sender: 'bot',
      text: fallback.text,
      timestamp: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      actionOfferId: fallback.actionOfferId || primaryOffer.id,
      suggestedAction: fallback.suggestedAction || 'order_now'
    };
  }
}
