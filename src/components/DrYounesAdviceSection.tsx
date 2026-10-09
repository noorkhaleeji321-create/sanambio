import React, { useState, useRef, useEffect } from 'react';
import { Play, ShieldCheck, Heart, Droplets, Stethoscope, Video, RefreshCw, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { parseVideoUrl, formatImageUrl } from '../lib/videoUtils';

export const DrYounesAdviceSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { settings } = useStore();

  const rawVideoUrl = settings.media?.doctorVideoUrl || 'https://youtu.be/yPDfuwox5Oo';
  const parsed = parseVideoUrl(rawVideoUrl);
  
  // Use custom poster if provided, or auto YouTube thumbnail if available, or fallback image
  const rawPoster = settings.media?.doctorVideoPoster || parsed.thumbnailUrl || 'https://img.youtube.com/vi/yPDfuwox5Oo/maxresdefault.jpg';
  const posterUrl = formatImageUrl(rawPoster);
  const channelName = settings.media?.doctorChannelName || 'Dr. Younes Health';
  const subText = settings.media?.doctorSubText || 'الصحة مفهومة في 60 ثانية';

  // Handle direct video playback when user clicks play
  const handleStartVideo = () => {
    setIsPlaying(true);
    setVideoError(false);
    if (parsed.type === 'direct' && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Playback error, attempting muted playback:', err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => setVideoError(true));
        }
      });
    }
  };

  useEffect(() => {
    if (isPlaying && parsed.type === 'direct' && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback or handle restriction silently
      });
    }
  }, [isPlaying, parsed.type]);

  return (
    <section id="doctor-advice" className="-mt-[36px] py-12 px-3.5 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F9F7F1] to-white">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Section Title */}
        <div className="-mt-[34px] text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-emerald-200">
            <Stethoscope className="w-4 h-4 text-emerald-700" />
            <span>نصائح طبية موثوقة</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-1.5">
            رأي الأطباء والمختصين في دهن السنام
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            كيف يعمل الدهن الطبيعي على إعادة المرونة للغضاريف
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
          
          {/* Video Reel Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-amber-300 mb-6 lg:mb-0">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🩺</span>
                <div>
                  <span className="text-xs sm:text-sm font-black block leading-none">{channelName}</span>
                  <span className="text-[10px] sm:text-xs text-emerald-200">{subText}</span>
                </div>
              </div>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Video className="w-3 h-3" />
                <span>فيديو توضيحي ({parsed.platformLabel})</span>
              </span>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-950 flex items-center justify-center group overflow-hidden">
              
              {/* Embed Player (YouTube / Vimeo / Google Drive / Loom) */}
              {(parsed.type === 'youtube' || parsed.type === 'vimeo' || parsed.type === 'drive' || parsed.type === 'loom') ? (
                isPlaying ? (
                  <iframe
                    title="فيديو رأي الطبيب"
                    src={parsed.embedUrl}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={posterUrl}
                      alt="Doctor Video Thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/happy_active_elderly.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex flex-col items-center justify-center text-center p-4">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(true)}
                        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-2xl cursor-pointer mb-2.5 transition-transform group-hover:scale-110"
                        aria-label="تشغيل الفيديو"
                      >
                        <Play className="w-7 h-7 fill-white translate-x-0.5" />
                      </button>
                      <span className="text-white font-black text-sm sm:text-base drop-shadow-md">
                        شاهد نصائح الدكتور حول دهن المفاصل
                      </span>
                      <span className="text-amber-300 text-xs font-semibold mt-0.5">
                        اضغط للمشاهدة الآن ({parsed.platformLabel})
                      </span>
                    </div>
                  </div>
                )
              ) : (
                /* Direct Video Player (MP4 / WebM / Uploaded Data URL) */
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    controls={isPlaying}
                    autoPlay={isPlaying}
                    playsInline
                    src={parsed.directUrl || rawVideoUrl}
                    onError={() => setVideoError(true)}
                  >
                    <source src={parsed.directUrl || rawVideoUrl} type="video/mp4" />
                    <source src={parsed.directUrl || rawVideoUrl} type="video/webm" />
                    متصفحك لا يدعم تشغيل هذا الفيديو.
                  </video>

                  {/* Guaranteed Visible Poster Image on Overlay before play */}
                  {!isPlaying && (
                    <div className="absolute inset-0 z-10">
                      <img
                        src={posterUrl}
                        alt="غلاف فيديو الدكتور"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://ecowrkizfpmcpsyzvvze.supabase.co/storage/v1/object/public/store_media/images/happy_active_elderly.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex flex-col items-center justify-center text-center p-4">
                        <button
                          type="button"
                          onClick={handleStartVideo}
                          className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white flex items-center justify-center shadow-2xl cursor-pointer mb-2.5 transition-transform group-hover:scale-110"
                          aria-label="تشغيل الفيديو"
                        >
                          <Play className="w-7 h-7 fill-white translate-x-0.5" />
                        </button>
                        <span className="text-white font-black text-sm sm:text-base drop-shadow-md">
                          شاهد نصائح الدكتور حول دهن المفاصل
                        </span>
                        <span className="text-slate-200 text-xs mt-0.5">
                          بالدارجة المغربية · 60 ثانية
                        </span>
                      </div>
                    </div>
                  )}

                  {videoError && isPlaying && (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center text-white z-20">
                      <p className="text-xs sm:text-sm font-bold text-amber-300 mb-2">
                        تعذر تشغيل ملف الفيديو المباشر من هذا الرابط
                      </p>
                      <p className="text-[11px] text-slate-300 mb-3 max-w-sm">
                        تأكد من أن الرابط ينتهي بـ .mp4 أو استخدم رابط يوتيوب مباشر (YouTube) أو ارفع الفيديو من لوحة التحكم.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlaying(false);
                            setVideoError(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>إعادة المحاولة</span>
                        </button>
                        {rawVideoUrl && (
                          <a
                            href={rawVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>فتح الرابط مباشرة</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* 3 Scientific Points */}
          <div className="lg:col-span-5 space-y-3.5 text-right">
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-300/80 border-r-4 border-r-amber-600 shadow-xs hover:border-amber-400 transition-all flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">غني بالأوميغا 3 و 6 و 9 الحيوية</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  أحماض دهنية تخترق مسام الجلد وتغذي الغشاء الزلالي للغضروف لتقليل الاحتكاك.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-amber-300/80 border-r-4 border-r-emerald-600 shadow-xs hover:border-amber-400 transition-all flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">تسكين فوري بدون أدوية كيماوية</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يهدئ التورم والالتهاب الموضعي بدون أي تأثير على المعدة أو الكلى.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-amber-300/80 border-r-4 border-r-amber-500 shadow-xs hover:border-amber-400 transition-all flex items-start gap-3">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-800 shrink-0 mt-0.5">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">حرارة منشطة للدورة الدموية</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  التدليك يولد دفئاً مريحاً يرخي الأوتار المتشنجة ويعيد خفة المشي والحركة.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
