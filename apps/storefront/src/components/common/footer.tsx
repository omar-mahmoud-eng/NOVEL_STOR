"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react"

export function Footer({
  locale,
  dict,
}: {
  locale: "ar" | "en"
  dict: any
}) {
  const pathname = usePathname() || ""
  const isRtl = locale === "ar"

  const isLittleRealm = pathname.includes("/realms/little")
  const isKidsRealm = pathname.includes("/realms/kids")
  const isTeensRealm = pathname.includes("/realms/teens")
  const isFamilyHub = pathname.includes("/family-hub")

  // ==========================================
  // 1. LITTLE REALM FOOTER (Stitch L01 Footer)
  // ==========================================
  if (isLittleRealm) {
    return (
      <footer className="w-full bg-[#F6ECE0] border-t border-[#F0E7DA] py-8 sm:py-12 mt-auto text-[#50443E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-right">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#CCE9DA] flex items-center justify-center text-[#1E3E32] shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[28px]">bedtime</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#4A6458]">
                {isRtl ? "وقت الهدوء والسكينة" : "Quiet & Peaceful Time"}
              </span>
              <span className="text-xs sm:text-sm text-[#50443E] mt-0.5">
                {isRtl
                  ? "بيئة قراءة تفاعلية دافئة خالية من المشتتات مصممة لمرافقة نوم طفلك"
                  : "A warm, distraction-free co-reading sanctuary crafted for restful sleep"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1.5 text-xs text-[#50443E]">
            <span>
              {isRtl
                ? "منصة StoryVerse المخصصة للأطفال برعاية تربوية موجهة للأمهات والآباء"
                : "StoryVerse Little: Educative literature for parents and children"}
            </span>
            <div className="flex items-center gap-3 text-[11px] text-[#6D5C37] font-semibold mt-1">
              <span>{isRtl ? "إشراف وتوجيه المحتوى: آمن تماماً وبدون إعلانات" : "100% Ad-Free & Curated"}</span>
              <span>•</span>
              <span>{isRtl ? "جميع الحقوق محفوظة © ٢٠٢٦" : "© 2025 StoryVerse Little"}</span>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // ==========================================
  // 2. KIDS REALM FOOTER (Stitch K01 Footer)
  // ==========================================
  if (isKidsRealm) {
    return (
      <footer className="w-full bg-white border-t border-[#E0E2EF] shadow-[0_1px_8px_rgba(0,0,0,0.04)] py-8 mt-auto text-[#181B25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900">
                {isRtl ? "بيئة قراءة آمنة وخالية من الإعلانات" : "Safe & Ad-Free Reading Sanctuary"}
              </span>
              <span className="text-xs text-slate-500">
                {isRtl
                  ? "متوافق بالكامل مع معايير حماية خصوصية الأطفال (COPPA) وخالٍ من المحفزات المزعجة."
                  : "Fully COPPA compliant and free from addictive countdowns or stimuli."}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600">
            <Link href={`/${locale}/about#privacy`} className="hover:text-emerald-700 transition-colors">
              {isRtl ? "ميثاق خصوصية المغامر الصغير" : "Little Explorer Privacy Charter"}
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <Link href={`/${locale}/about#guidelines`} className="hover:text-emerald-700 transition-colors">
              {isRtl ? "دليل القراءة الهادئة" : "Calm Reading Guidelines"}
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-slate-400 font-normal">
              {isRtl ? "© ٢٠٢٦ عالم StoryVerse للأطفال" : "© 2025 StoryVerse Kids"}
            </span>
          </div>
        </div>
      </footer>
    )
  }

  // ==========================================
  // 3. TEENS REALM FOOTER (Stitch T01 Footer)
  // ==========================================
  if (isTeensRealm) {
    return (
      <footer className="w-full bg-[#F2F3FF] border-t border-indigo-100 py-8 sm:py-10 mt-auto text-[#101542]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-indigo-100">
            <div className="flex flex-col gap-1 max-w-xl text-right">
              <div className="flex items-center gap-2 text-indigo-700">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span className="text-sm font-bold text-slate-900">
                  {isRtl ? "بيئة قراءة آمنة وخالية من المشتتات" : "Safe & Distraction-Free Literary Space"}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRtl
                  ? "منصة مصممة بخصوصية فائقة ومطابقة لمعايير حماية القاصرين (COPPA). لا تتضمن المنصة منتديات عامة، أو خوارزميات تواصل اجتماعي، أو محتوى غير ملائم للفئة العمرية ١٣–١٧ سنة."
                  : "Platform engineered with uncompromising privacy matching COPPA. No social feeds, no addictive algorithms, and no inappropriate young adult content."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-indigo-900">
              <Link href={`/${locale}/family-hub`} className="hover:text-indigo-600 transition-colors">
                {isRtl ? "بوابة ولي الأمر" : "Guardian Portal"}
              </Link>
              <span>•</span>
              <Link href={`/${locale}/about#pledge`} className="hover:text-indigo-600 transition-colors">
                {isRtl ? "ميثاق القراءة الآمنة" : "Safety Pledge"}
              </Link>
              <span>•</span>
              <Link href={`/${locale}/terms`} className="hover:text-indigo-600 transition-colors">
                {isRtl ? "الشروط والخصوصية" : "Terms & Privacy"}
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              {isRtl
                ? "© ٢٠٢٦ StoryVerse عالم الناشئة. جميع الحقوق محفوظة للمحتوى الأدبي النقي."
                : "© 2025 StoryVerse Young Adults. All rights reserved."}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="font-semibold text-slate-700">
                {isRtl ? "مكتبة معتمدة للنشء واليافعين" : "Certified YA Sanctuary"}
              </span>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // ==========================================
  // 4. FAMILY HUB FOOTER (Stitch F01 Footer)
  // ==========================================
  if (isFamilyHub) {
    return (
      <footer className="w-full bg-[#F9F9F6] border-t border-slate-200 py-6 mt-auto text-slate-500 text-center text-xs">
        <div className="max-w-2xl mx-auto px-4">
          <p>
            {isRtl
              ? "© StoryVerse. جميع الحقوق محفوظة لمركز إدارة الأسرة والرقابة الأبوية المعتمد."
              : "© StoryVerse. All rights reserved for Certified Family Management Center."}
          </p>
        </div>
      </footer>
    )
  }

  // ==========================================
  // 5. ORIGINALS (+18) FOOTER (Stitch P01 Footer)
  // ==========================================
  return (
    <footer className="border-t border-[#4e463a]/30 bg-[#0b0e17] text-[#e0e2ef] mt-auto">
      {/* Trust Badges Bar with Google Stitch Nocturne Accents */}
      <div className="border-b border-[#4e463a]/25 bg-[#10131c]">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-start">
            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1c1f29] text-[#e6c184] flex items-center justify-center shrink-0 border border-[#4e463a]/40 shadow-xs">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#e0e2ef]">
                  {isRtl ? "توصيل النسخ الورقية" : "Express Regional Delivery"}
                </h4>
                <p className="text-xs text-[#d1c5b5] mt-0.5">
                  {isRtl ? "خيارات التوصيل حسب عنوان الطلب" : "24-48 hours directly to your door"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1c1f29] text-[#e6c184] flex items-center justify-center shrink-0 border border-[#4e463a]/40 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#e0e2ef]">
                  {isRtl ? "وصول محمي للملفات الخاصة" : "Anti-Piracy DRM Stream"}
                </h4>
                <p className="text-xs text-[#d1c5b5] mt-0.5">
                  {isRtl ? "روابط مؤقتة بعد التحقق من الترخيص" : "High-fidelity lossless streaming"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1c1f29] text-[#e6c184] flex items-center justify-center shrink-0 border border-[#4e463a]/40 shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#e0e2ef]">
                  {isRtl ? "دعم طلبات النسخ الورقية" : "Replacement Guarantee"}
                </h4>
                <p className="text-xs text-[#d1c5b5] mt-0.5">
                  {isRtl ? "تواصل مع الدعم لمراجعة الطلب" : "Instant free swap for damaged copies"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1c1f29] text-[#e6c184] flex items-center justify-center shrink-0 border border-[#4e463a]/40 shadow-xs">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#e0e2ef]">
                  {isRtl ? "الاستماع للنص المتاح" : "Cinematic Voiceover"}
                </h4>
                <p className="text-xs text-[#d1c5b5] mt-0.5">
                  {isRtl ? "بصوت الجهاز أو ملفات الراوي المتاحة" : "Full cast dramatic audio experience"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-bold text-sm text-[#e6c184] mb-3 font-serif">
              {isRtl ? "عالم StoryVerse" : "StoryVerse Universe"}
            </h5>
            <ul className="space-y-2 text-xs text-[#d1c5b5]">
              <li><Link href={`/${locale}`} className="hover:text-[#e0e2ef]">الأرشيف الرئيسي (Originals)</Link></li>
              <li><Link href={`/${locale}/realms/teens`} className="hover:text-[#e0e2ef]">عالم الناشئة (١٣-١٧ سنة)</Link></li>
              <li><Link href={`/${locale}/realms/kids`} className="hover:text-[#e0e2ef]">كوكب الأطفال (٧-١٢ سنة)</Link></li>
              <li><Link href={`/${locale}/realms/little`} className="hover:text-[#e0e2ef]">واحة البراعم (٣-٦ سنوات)</Link></li>
              <li><Link href={`/${locale}/family-hub`} className="hover:text-[#e0e2ef]">مركز الأسرة والرقابة الأبوية</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm text-[#e6c184] mb-3 font-serif">
              {isRtl ? "التجارب السردية" : "Narrative Experiences"}
            </h5>
            <ul className="space-y-2 text-xs text-[#d1c5b5]">
              <li><Link href={`/${locale}/interactive`} className="hover:text-[#e0e2ef]">الروايات التفاعلية المتشعبة</Link></li>
              <li><Link href={`/${locale}/audiobooks`} className="hover:text-[#e0e2ef]">المكتبة الصوتية والبودكاست</Link></li>
              <li><Link href={`/${locale}/atlas`} className="hover:text-[#e0e2ef]">أطلس السرد الجغرافي</Link></li>
              <li><Link href={`/${locale}/illustrated`} className="hover:text-[#e0e2ef]">الروايات المصورة الفاخرة</Link></li>
              <li><Link href={`/${locale}/salons`} className="hover:text-[#e0e2ef]">الصالونات والنوادي الأدبية</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm text-[#e6c184] mb-3 font-serif">
              {isRtl ? "المتجر والاشتراكات" : "Store & Membership"}
            </h5>
            <ul className="space-y-2 text-xs text-[#d1c5b5]">
              <li><Link href={`/${locale}/products`} className="hover:text-[#e0e2ef]">المقتنيات والصناديق الملكية</Link></li>
              <li><Link href={`/${locale}/subscriptions`} className="hover:text-[#e0e2ef]">باقات العضوية السنوية VIP</Link></li>
              <li><Link href={`/${locale}/account`} className="hover:text-[#e0e2ef]">حسابي ومكتبي الشخصية</Link></li>
              <li><Link href={`/${locale}/checkout`} className="hover:text-[#e0e2ef]">السلة وإتمام الشراء الآمن</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm text-[#e6c184] mb-3 font-serif">
              {isRtl ? "الضمان والخصوصية" : "Trust & Compliance"}
            </h5>
            <ul className="space-y-2 text-xs text-[#d1c5b5]">
              <li><Link href={`/${locale}/about#privacy`} className="hover:text-[#e0e2ef]">خصوصية الأسرة والأطفال</Link></li>
              <li><Link href={`/${locale}/about#security`} className="hover:text-[#e0e2ef]">حماية الحساب والوصول</Link></li>
              <li><Link href={`/${locale}/about#terms`} className="hover:text-[#e0e2ef]">شروط الاستخدام والخدمة</Link></li>
              <li><Link href={`/${locale}/about#contact`} className="hover:text-[#e0e2ef]">تواصل مع إدارة النشر</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#4e463a]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9a8f81] gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e6c184] text-[18px]">auto_stories</span>
            <span className="font-serif text-[#e6c184] font-bold">StoryVerse Publishing</span>
            <span>—</span>
            <span>جميع الحقوق محفوظة © ٢٠٢٦</span>
          </div>
          <p className="text-center sm:text-end">
            منصة النشر الرقمي والصوتي العربي الفاخر • مصممة وفق أحدث معايير تجربة القراءة العالمية
          </p>
        </div>
      </div>
    </footer>
  )
}
