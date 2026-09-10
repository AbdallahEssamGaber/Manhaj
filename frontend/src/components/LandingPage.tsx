import Link from "next/link";
import Logo from "@/components/Logo";
import { universities } from "@/lib/universities";

const benefits = [
  {
    title: "مساعدة رخيصة ومركزة على مادتك",
    detail: "بجزء بسيط من تكلفة الدرس الخصوصي — إجابات مظبوطة على مادتك بالظبط، مش نت عام.",
  },
  {
    title: "متدرب على مادة كورسك الحقيقية",
    detail: "السلايدات والمذكرات والامتحانات اللي فاتت اللي دكتورك فعلاً حددهالك — مش نتايج جوجل عشوائية.",
  },
  {
    title: "متاح على طول",
    detail: "الساعة 3 الفجر قبل الفاينل، أو بين محاضرة ومحاضرة — منهج مالهوش مواعيد مكتب.",
  },
];

const sourceTypes = [
  { label: "سلايدات المحاضرات", detail: "كل سلايد دكتورك رفعه فعلاً، مش ملخص عام عن الموضوع." },
  { label: "امتحانات سابقة", detail: "أسئلة حقيقية من امتحانات نص ترم وفاينلز فعلية، متنظمة حسب المادة والسنة." },
  { label: "مستندات المنهج الرسمية", detail: "التوصيف والخطة اللي القسم بينشرها، عشان النطاق يفضل مظبوط." },
  { label: "مذكرات المحاضرات", detail: "مذكرات المعيدين، وتفريغ تسجيلات السكاشن، وأي حاجة تانية كورسك بيشاركها." },
];

const studyWays = [
  { label: "اسأل", detail: "خد إجابة واضحة مع تحديد السلايد أو الامتحان اللي جايه منه بالظبط، جوه النص." },
  { label: "فلاش كارد", detail: "قلّب في مجموعة كروت اتعملت من مادتك — كويسة تحفظ بيها المصطلحات بسرعة." },
  { label: "كويز وامتحان تجريبي", detail: "اختيار من متعدد بدرجة، أو جلسة بوقت محدد شبه الامتحان الحقيقي بالظبط." },
];

const rotations = ["-rotate-2", "rotate-1", "-rotate-1"];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo size={26} />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden sm:inline-block px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors">
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 rounded-md bg-teal text-white text-sm font-medium hover:bg-teal-hover transition-colors"
            >
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-soft text-navy text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              مبني على منهجك الفعلي، مش منهج النت
            </div>
            <h1 className="font-display text-[clamp(2.4rem,5.2vw,3.75rem)] leading-[1.15] font-bold text-foreground">
              ذاكر مادتك <span className="text-teal">الحقيقية</span>. مش ملخص عنها.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted leading-relaxed max-w-lg font-reading">
              منهج بيقرا سلايداتك ومذكراتك وامتحاناتك السابقة الحقيقية — وبعدين بيجاوبك ويعمللك كويزات وتمارين على بالظبط اللي دكتورك شرحه.
            </p>

            <ul className="mt-8 space-y-3 max-w-md">
              {benefits.map((b) => (
                <li key={b.title} className="flex gap-3">
                  <svg className="mt-0.5 shrink-0 text-teal" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-foreground">
                    <span className="font-semibold">{b.title}</span>
                    <span className="text-muted"> — {b.detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/chat"
                className="px-6 py-3 rounded-md bg-teal text-white text-sm font-semibold hover:bg-teal-hover transition-colors"
              >
                ابدأ الدردشة دلوقتي
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 rounded-md border border-border text-sm font-semibold text-foreground hover:bg-surface-hover transition-colors"
              >
                سجّل حساب
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-light">مش محتاج حساب عشان تجرب — اختار جامعتك وابدأ على طول.</p>
          </div>

          {/* Product preview */}
          <div className="relative">
            <div className="rounded-xl border border-border bg-surface shadow-[0_20px_50px_-20px_oklch(0.28_0.06_258_/_0.28)] overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-border">
                {["اسأل", "فلاش كارد", "كويز"].map((label, i) => (
                  <span key={label} className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${i === 1 ? "bg-teal text-white" : "text-muted"}`}>
                    {label}
                  </span>
                ))}
              </div>
              <div className="p-4 space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft text-teal font-semibold px-3 py-1 text-[13px]">
                  <span className="w-4 h-4 rounded-full bg-teal text-white text-[9px] font-bold flex items-center justify-center">ها</span>
                  هياكل البيانات
                </span>
                <div className="rounded-lg border border-teal/25 bg-teal-soft px-4 py-3.5">
                  <span className="text-[10px] font-semibold text-teal">فلاش كارد</span>
                  <p className="text-sm leading-relaxed text-foreground mt-1 font-reading">
                    إيه هي شجرة البحث الثنائي؟ — شجرة كل قيمة شمال فيها أصغر وكل قيمة يمين فيها أكبر.
                  </p>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-lg px-3.5 py-2 bg-user-bubble text-user-bubble-text text-sm">/flashcards الأشجار الثنائية</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 hidden sm:block rounded-lg border border-border bg-surface px-3 py-2 shadow-md rotate-[4deg]">
              <p className="text-[11px] font-medium text-muted">المصدر: محاضرة 4، سلايد 12</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grounded in real material */}
      <section className="border-t border-border-light bg-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-snug font-bold text-foreground">
                كل إجابة بترجعلك لمادتك بالظبط.
              </h2>
              <p className="mt-4 text-muted leading-relaxed max-w-sm font-reading">
                أدوات الذكاء الاصطناعي التانية بتخمّن من النت المفتوح. منهج مبني على اللي دكتورك فعلاً حدده — فمش هيخترع حاجة مش في امتحانك.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {sourceTypes.map((s, i) => (
                <div key={s.label} className={i % 2 === 1 ? "sm:mt-8" : ""}>
                  <p className="font-display text-2xl font-bold text-teal/25">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">{s.label}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed font-reading">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Study modes */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-xl">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-snug font-bold text-foreground">
            ذاكر بالطريقة اللي امتحانك محتاجها.
          </h2>
          <p className="mt-4 text-muted leading-relaxed font-reading">
            بدّل بين الأوضاع من جوه نفس الشات — نفس مادة الكورس بثلاث طرق مختلفة للمذاكرة.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-5 sm:gap-6">
          {studyWays.map((m, i) => (
            <div
              key={m.label}
              className={`w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] rounded-xl border border-border bg-surface p-5 transition-transform hover:rotate-0 hover:-translate-y-1 ${rotations[i % rotations.length]}`}
            >
              <span className="inline-block text-xs font-semibold text-teal">{m.label}</span>
              <p className="mt-2 text-sm text-foreground leading-relaxed font-reading">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Universities */}
      <section className="border-t border-border-light bg-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-snug font-bold text-foreground">
              اختار جامعتك، واخد منهجك.
            </h2>
            <p className="text-sm text-muted max-w-xs font-reading">
              اختار كليتك وتخصصك وسنتك في أقل من دقيقة — من غير ما تعمل حساب.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {universities.map((uni) => (
              <div key={uni.id} className="aspect-square rounded-xl flex flex-col items-center justify-center gap-2 p-4" style={{ backgroundColor: uni.bg }} title={uni.name}>
                {uni.logo ? (
                  <img src={uni.logo} alt={uni.name} className="max-h-14 max-w-full object-contain" />
                ) : (
                  <span className="font-display text-sm sm:text-base font-bold" style={{ color: uni.text }}>
                    {uni.shortName}
                  </span>
                )}
                <span className="text-xs font-medium text-center leading-tight" style={{ color: uni.text }}>
                  {uni.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-navy">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-snug font-bold text-white max-w-lg">
              بطّل تذاكر من مادة غلط.
            </h2>
            <p className="mt-3 text-white/80 max-w-md font-reading">مجاني تماماً من غير حساب. اختار جامعتك وأول مادة في أقل من دقيقة.</p>
          </div>
          <Link
            href="/chat"
            className="shrink-0 self-start sm:self-auto px-7 py-3.5 rounded-md bg-teal text-white text-sm font-semibold hover:bg-teal-hover transition-colors"
          >
            ابدأ الدردشة دلوقتي
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={22} className="opacity-90" />
          <p className="text-xs text-muted-light">منهج — ذاكر مادة مادة، من غير ما تتوه بره منهجك الفعلي.</p>
        </div>
      </footer>
    </div>
  );
}
