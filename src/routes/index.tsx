import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";


import bazaidMark from "@/assets/bazaid-mark.png.asset.json";
import heroVideo from "@/assets/hero-ios.mp4.asset.json";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";
import navigatorCharacter from "@/assets/navigator-character-natural.webp.asset.json";
import laptopImage from "@/assets/laptop-character.png.asset.json";
import avatarMale1 from "@/assets/avatar-male-1.png";
import avatarMale2 from "@/assets/avatar-male-2.png";
import avatarMale3 from "@/assets/avatar-male-3.png";
import avatarFemale1 from "@/assets/avatar-female-1.png";
import avatarFemale2 from "@/assets/avatar-female-2.png";
import avatarFemale3 from "@/assets/avatar-female-3.png";
import infDari from "@/assets/inf-dari.png";
import infSam from "@/assets/inf-sam.png";
import infAbdullah from "@/assets/inf-abdullah.png";
import infSahab from "@/assets/inf-sahab.png";
import infMizalla from "@/assets/inf-mizalla.png";
import infMohammed from "@/assets/inf-mohammed.png";
import infRakan from "@/assets/inf-rakan.png";
import infManara from "@/assets/inf-manara.png";
import { Reveal } from "@/components/landing/Reveal";
import { SectionTitle } from "@/components/landing/SectionTitle";
import { useUiSound } from "@/lib/use-ui-sound";
import { SurpriseQuiz } from "@/components/landing/SurpriseQuiz";
import { LinkModal, LinkPreloader, type ModalLink } from "@/components/landing/LinkModal";
import { WhatsAppFloatingButton } from "@/components/landing/WhatsAppButton";
import { Volume2, VolumeX } from "lucide-react";
import {
  ACADEMY_URL,
  COURSE_URL,
  INTRO_LESSON_URL,
  NAVIGATOR_URL,
  excerpts,
  testimonials,
} from "@/lib/landing-data";

function SilhouetteAvatar({ gender }: { gender: "male" | "female" }) {
  return (
    <svg viewBox="0 0 64 64" className="size-full bg-surface-2" aria-hidden="true">
      <circle cx="32" cy="32" r="32" className="fill-muted/40" />
      {gender === "female" ? (
        <g className="fill-foreground/45">
          <path d="M32 12c-9 0-14 6-14 15 0 5 2 8 4 10-3 1-5 3-5 6v11h30V43c0-3-2-5-5-6 2-2 4-5 4-10 0-9-5-15-14-15Z" />
        </g>
      ) : (
        <g className="fill-foreground/45">
          <circle cx="32" cy="24" r="11" />
          <path d="M32 38c-9 0-16 5-16 12v4h32v-4c0-7-7-12-16-12Z" />
        </g>
      )}
    </svg>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دورة القدرات العامة | أكاديمية بازيد" },
      {
        name: "description",
        content:
          "دورة القدرات العامة من أكاديمية بازيد: شرح كمي ولفظي، ملخص قوانين، جدول متابعة يومي، ونبذات مجانية من الكتب تخليك تجتاز +95 في اختبار القدرات.",
      },
      { property: "og:title", content: "دورة القدرات العامة | أكاديمية بازيد" },
      {
        property: "og:description",
        content:
          "خطة واضحة يوم بيوم، شرح كمي ولفظي، وضمان اجتياز +95 في اختبار القدرات مع أكاديمية بازيد.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const sound = useUiSound();
  const [quizOpen, setQuizOpen] = useState(false);
  const quizShown = useRef(false);
  const secondCard = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [modalLink, setModalLink] = useState<ModalLink | null>(null);

  const openLink = (e: React.MouseEvent, url: string, title: string) => {
    e.preventDefault();
    sound.play("click");
    setModalLink({ url, title });
  };

  // تشغيل فيديو الـHero فور فتح الصفحة — بصوت، ولما يخلص نكتم الصوت
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });

    const onEnded = () => {
      video.muted = true;
      video.loop = false;
    };

    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("ended", onEnded);
    };
  }, []);



  useEffect(() => {
    const el = secondCard.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !quizShown.current) {
            quizShown.current = true;
            observer.disconnect();
            window.setTimeout(() => setQuizOpen(true), 900);
          }
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="overflow-x-hidden">
      <SurpriseQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />

      <button
        type="button"
        onClick={() => {
          sound.toggle();
          sound.play("click");
        }}
        aria-label={sound.enabled ? "كتم أصوات الموقع" : "تشغيل أصوات الموقع"}
        className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface/80 text-accent shadow-[var(--shadow-card)] backdrop-blur transition-transform hover:scale-110"
      >
        {sound.enabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
      </button>

      {/* Site header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <a
            href={ACADEMY_URL}
            onClick={(e) => openLink(e, ACADEMY_URL, "أكاديمية بازيد")}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
              <img src={bazaidMark.url} alt="شعار أكاديمية بازيد" className="h-8 w-8 object-contain" />
            </span>
            <div className="flex flex-col items-start leading-none">
              <span className="font-black text-lg tracking-tight text-foreground">أكاديمية بازيد</span>
              <span className="text-[10px] font-bold text-muted-foreground">Bazaid Academy</span>
            </div>
          </a>
          <a
            href={COURSE_URL}
            onClick={(e) => openLink(e, COURSE_URL, "الاشتراك في دورة القدرات العامة")}
            className="shine-cta rounded-xl px-5 py-2.5 text-sm font-black text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
          >
            اشترك الآن
          </a>
        </div>
      </header>

      {/* Hero video */}
      <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden">
        <video
          ref={heroVideoRef}
          className="hero-main-video absolute -top-30 bottom-auto h-[calc(100svh+7.5rem)] min-h-[calc(100svh+7.5rem)] w-full max-w-none object-cover object-[42%_top] sm:inset-0 sm:h-full sm:min-h-0 sm:object-top"
          src={heroVideo.url}
          poster={heroPoster.url}
          autoPlay
          muted={false}
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_50%,color-mix(in_oklab,var(--background)_78%,transparent)_68%,var(--background)_100%)]" />
        <div className="orb top-[10%] left-[-10%] h-56 w-56 bg-[oklch(0.62_0.13_235)]" />
        <div className="orb right-[-12%] bottom-[18%] h-64 w-64 bg-[oklch(0.66_0.14_240)]" style={{ animationDelay: "3s" }} />

        <div className="relative z-10 flex w-full flex-col items-center px-5 pt-20 pb-10 text-center sm:pb-16">
          <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-border/60 bg-background/60 px-5 py-6 backdrop-blur-md sm:px-10 sm:py-9">
            <Reveal delay={80}>
              <div className="title-shape mx-auto mb-2 inline-block px-6 py-2.5 sm:px-10 sm:py-3.5">
                <h1 className="text-center text-2xl leading-tight font-black text-foreground sm:text-4xl lg:text-5xl">
                  دورة القدرات العامة
                </h1>
              </div>
              <p className="mb-4 text-center text-lg font-black text-white sm:text-2xl drop-shadow-md">
                مع أكاديمية بازيد
              </p>
            </Reveal>
            <Reveal delay={140}>
              <h2 className="text-[2.2rem] leading-[1.15] font-black text-primary-foreground sm:text-5xl">
                فرصتك لتجتاز{" "}
                <span className="gold-gradient-text align-baseline text-[1.5em] leading-none" dir="ltr">
                  95
                </span>
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-3 text-base leading-relaxed font-medium text-foreground/85 sm:text-lg">
                من الصفر للقمة — خطة يومية جاهزة، شرح كمي ولفظي مبسّط، ومتابعة تخليك لا تؤجل.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <a
                  href={COURSE_URL}
                  onClick={(e) => openLink(e, COURSE_URL, "الاشتراك في دورة القدرات العامة")}
                  onMouseEnter={() => sound.play("hover")}
                  className="shine-cta rounded-2xl px-9 py-4 text-lg font-black text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
                >
                  احجز مقعدك في الدورة
                </a>
                <a
                  href="#intro"
                  onClick={() => sound.play("click")}
                  className="rounded-2xl border border-border bg-surface/70 px-9 py-4 text-lg font-bold backdrop-blur transition-colors hover:bg-surface-2"
                >
                  تعرف على المحتوى
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* Intro */}
      <section id="intro" className="relative mx-auto max-w-6xl overflow-hidden px-5 py-20 sm:py-28">
        <div className="orb top-10 right-[-15%] h-72 w-72 bg-[oklch(0.62_0.13_235)]" />
        <div className="orb bottom-0 left-[-18%] h-72 w-72 bg-[oklch(0.66_0.14_240)]" style={{ animationDelay: "4s" }} />
        <SectionTitle eyebrow="تعريف بالدورة">
          القدرات مو حظ <span className="gold-gradient-text">مهارة نبنيها معك خطوة بخطوة</span>
        </SectionTitle>
        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xl leading-relaxed font-medium text-foreground/85 sm:text-2xl">
            كل اللي تحتاجه للقدرات في مكان واحد: كمي ولفظي بشرح مبسّط، أمثلة محلولة، ملخص قوانين،
            واختبارات محاكية للاختبار الحقيقي.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-9 flex justify-center">
            <a
              href={INTRO_LESSON_URL}
              onClick={(e) => openLink(e, INTRO_LESSON_URL, "التعريف بالدورة")}
              className="shine-cta rounded-2xl px-10 py-4 text-lg font-black text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105 sm:text-xl"
            >
              شاهد التعريف بالدورة ←
            </a>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {[
            {
              k: "144",
              v: "درس مصوّر",
              points: [
                "كمي ولفظي",
                "مرتبة بتسلسل علمي",
                "من الأسهل للأصعب",
                "من الأكثر أهمية للأقل أهمية",
                "من الأكثر تكرار للأقل تكرار",
              ],
            },
            { k: "دعم ومتابعة", v: "على مدار الدورة", d: "المدرب معك خطوة بخطوة" },
            { k: "+95", v: "هدف الدرجة", d: "مع خطة بازيد المضمونة" },
          ].map((item, i) => (
            <Reveal key={item.v} delay={i * 120}>
              <div className="surface-card relative h-full overflow-hidden rounded-[1.75rem] p-8 text-center">
                <div className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]" />
                <p
                  className={`big-score !leading-[1.25] py-1 ${/[0-9]/.test(item.k) ? "!text-[clamp(3rem,10vw,5.5rem)]" : "!text-[clamp(2rem,6vw,3.6rem)]"}`}
                  dir={/[A-Za-z0-9+]/.test(item.k) ? "ltr" : "rtl"}
                >
                  {item.k}
                </p>
                <p className="mt-3 text-lg font-bold">{item.v}</p>
                {"points" in item ? (
                  <ul className="mt-3 space-y-2 text-center text-sm text-muted-foreground">
                    {item.points.map((p, idx) => (
                      <li key={idx} className="flex items-start justify-center gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Navigator / phone */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid items-center gap-2 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <div>
              <SectionTitle eyebrow="جدول القدرات ✅">
                لا تحتار وش تذاكر
                <br />
                <span className="gold-gradient-text block">جدولك جاهز يوم بيوم</span>
              </SectionTitle>
              <p className="mx-auto mt-5 max-w-xl px-1 text-center text-base leading-[1.9] font-bold text-muted-foreground sm:text-lg">
                جدول تفاعلي يقسّم الدورة على أيام، يعلّمك الدروس المنجزة، ويفتح اليوم التالي أول ما
                تخلص.
              </p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <a
              href={NAVIGATOR_URL}
              onClick={(e) => openLink(e, NAVIGATOR_URL, "جدول القدرات")}
              className="group block"
            >
              <img
                src={navigatorCharacter.url}
                alt="شخصية أكاديمية بازيد تعرض جدول القدرات التفاعلي على الجوال"
                loading="eager"
                className="mx-auto mt-0 h-auto w-full max-w-lg object-contain transition-transform duration-700 group-hover:scale-[1.03] lg:mt-0"
              />
            </a>
          </Reveal>
        </div>
      </section>

      {/* Excerpts / laptop cards */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 py-16 sm:py-24">
        <div className="orb top-1/3 left-[-14%] h-64 w-64 bg-[oklch(0.7_0.11_210)]" />
        <SectionTitle eyebrow="نبذات مجانية">
          جرّب المحتوى مجانًا
          <br />
          <span className="gold-gradient-text">قبل ما تدفع ريال</span>
        </SectionTitle>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {excerpts.map((item, i) => (
            <div key={item.id} ref={i === 1 ? secondCard : undefined}>
              <Reveal delay={(i % 3) * 120}>
                <a
                  href={item.url}
                  onClick={(e) => openLink(e, item.url, item.title)}
                  className="group block"
                  aria-label={item.title}
                >
                  <div className="relative overflow-hidden rounded-[1.75rem]">
                    <img
                      src={laptopImage.url}
                      alt={item.title}
                      loading="lazy"
                      className="w-full transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    {/* Match the visible blue display: title sits slightly above center. */}
                    <div className="absolute top-[36%] right-[24%] left-[23.4%] h-[30.4%] text-center">
                      <span className="absolute inset-x-2 top-[40%] -translate-y-1/2 text-[clamp(1.05rem,2.6vw,1.75rem)] leading-[1.5] font-black text-white drop-shadow-md">
                        {item.title}
                      </span>
                      <span className="absolute inset-x-0 bottom-[12%] mx-auto inline-flex w-fit items-center justify-center gap-1 rounded-full bg-white/95 px-4 py-1.5 text-[clamp(0.65rem,1.3vw,0.95rem)] leading-tight font-black text-primary shadow-md backdrop-blur-sm transition-transform group-hover:scale-105">
                        اضغط للفتح ←
                      </span>
                    </div>
                  </div>
                  <div className="surface-card -mt-6 rounded-3xl px-6 pt-8 pb-6 text-center">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.note}
                    </p>
                  </div>
                </a>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="px-5 py-16 sm:py-24">
        <Reveal>
          <div className="mx-auto w-fit max-w-5xl rounded-[3rem] bg-gradient-to-b from-gold/40 to-transparent p-[2px] shadow-[0_20px_50px_-12px_oklch(0.05_0.03_258/80%)]">
            <div
              className="relative overflow-hidden rounded-[calc(3rem-2px)] p-10 text-center sm:p-16"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.22 0.06 258), oklch(0.185 0.052 258) 50%, oklch(0.15 0.04 258))",
              }}
            >
              {/* Decorative glows */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" aria-hidden="true" />

              <div className="relative z-10 mx-auto flex w-fit items-center gap-3 rounded-full border border-white/20 bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-2.5 shadow-lg">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4.5 w-4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <p className="text-base font-black text-white">
                  ضمان بازيد الذهبي
                </p>
              </div>

              {/* Large transparent guarantee icon behind the text */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  className="h-[55%] w-[55%] max-w-sm opacity-15"
                  fill="none"
                  stroke="oklch(0.75 0.16 65)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>

              <p
                className="big-score relative z-10 mt-6 !text-[clamp(5rem,17vw,10rem)] !leading-[1.15] py-1"
                dir="ltr"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, oklch(0.95 0.08 75), oklch(0.75 0.16 65) 50%, oklch(0.65 0.18 55))",
                }}
              >
                +95
              </p>

              <div className="relative z-10 mt-6 flex flex-col items-center gap-3 sm:gap-4">
                <h2 className="text-3xl leading-tight font-black text-foreground sm:text-5xl lg:text-6xl">
                  بازيد يضمن
                </h2>
                <p className="text-2xl leading-tight font-black text-foreground/90 sm:text-4xl lg:text-5xl">
                  إذا خلصت المحتوى
                </p>
                <p className="text-2xl leading-tight font-black text-gold sm:text-4xl lg:text-5xl">
                  مستواك ودرجتك ترتفع
                </p>
                <p className="text-2xl leading-tight font-black text-gold sm:text-4xl lg:text-5xl">
                  أو فلوسك كاملة ترجع لك
                </p>
              </div>
              <p className="relative z-10 mx-auto mt-6 max-w-2xl text-base leading-relaxed font-bold text-muted-foreground sm:text-lg">
                التزم بالخطة… والباقي علينا. متابعة يومية، اختبارات محاكية، ودعم ما يتوقف لين تدخل
                الاختبار <span className="whitespace-nowrap">وانت واثق</span>.
              </p>

              <a
                href={COURSE_URL}
                onClick={(e) => { sound.play("pop"); openLink(e, COURSE_URL, "الاشتراك في دورة القدرات العامة"); }}
                className="relative z-10 mt-8 inline-block rounded-2xl bg-gold px-8 py-4 text-lg font-black text-gold-foreground shadow-[0_10px_30px_-5px_oklch(0.82_0.13_200/40%)] transition-transform hover:scale-105"
              >
                ابدأ الآن مع بازيد
              </a>

              <div
                className="absolute right-0 bottom-0 left-0 h-1.5"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, transparent, oklch(0.82 0.13 200 / 40%), transparent)",
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
        <SectionTitle eyebrow="تجارب وتعليقات الطلاب">
          نتائجهم <span className="gold-gradient-text">تتكلم قبلنا</span>
        </SectionTitle>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => {
            const avatars = t.gender === "male"
              ? [avatarMale1, avatarMale2, avatarMale3]
              : [avatarFemale1, avatarFemale2, avatarFemale3];
            const avatar = avatars[i % 3];
            return (
            <Reveal key={t.name} delay={(i % 3) * 120}>
              <figure className="surface-card flex h-full flex-col rounded-3xl p-7">
                <div className="flex items-center gap-4">
                  <img
                    src={avatar}
                    alt={t.gender === "male" ? "أفاتار طالب" : "أفاتار طالبة"}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-full border-2 border-accent/60 bg-surface-2 object-cover"
                  />
                  <div>
                    <p className="text-lg font-black">{t.name}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-secondary px-3 py-1 text-sm font-bold text-accent">
                      {t.result}
                    </span>
                  </div>
                  <div
                    className="ms-auto shrink-0 self-start text-base tracking-widest text-gold"
                    aria-label="تقييم خمس نجوم"
                  >
                    ★★★★★
                  </div>
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-foreground/90">
                  “{t.text}”
                </blockquote>

              </figure>
            </Reveal>
            );
          })}
        </div>
      </section>

      {/* Influencers */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <Reveal>
          <div className="surface-card rounded-[2.5rem] p-10 text-center sm:p-14">
            <SectionTitle eyebrow="مؤثرون تكلّموا عنّا">
              مؤثرون <span className="gold-gradient-text">ساهموا بنجاحنا</span>
            </SectionTitle>
            <p className="mx-auto mt-5 max-w-3xl leading-relaxed font-bold text-muted-foreground">
              تعرف على أبرز المؤثرين اللي ساهموا في نجاح أكاديمية بازيد. لكل مؤثر كود خصم مميز،
              والحين تقدر أنت كمان تصنع كود الخصم الخاص فيك وتصير أحد سفراء أكاديمية بازيد.
            </p>
            <InfluencerGrid />
          </div>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="px-5 pt-8 pb-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl leading-[1.2] font-black sm:text-5xl lg:text-6xl">
              جاهز لتجتاز الـ<span className="gold-gradient-text">95</span> بجدارة؟
            </h2>
            <a
              href={COURSE_URL}
              onClick={(e) => { sound.play("pop"); openLink(e, COURSE_URL, "الاشتراك في دورة القدرات العامة"); }}
              className="shine-cta mt-8 inline-block rounded-2xl px-12 py-5 text-xl font-black text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
            >
              احجز مقعدك الآن
            </a>
            <p className="mt-6 text-sm text-muted-foreground">أكاديمية بازيد — نضمن لك تحسين درجاتك</p>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-surface/40 px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
          <a
            href={ACADEMY_URL}
            onClick={(e) => openLink(e, ACADEMY_URL, "أكاديمية بازيد")}
            className="flex flex-col items-center gap-2"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <img src={bazaidMark.url} alt="شعار أكاديمية بازيد" className="h-12 w-12 object-contain" />
            </span>
            <div className="flex flex-col items-center leading-none">

              <span className="font-black text-2xl tracking-tight text-foreground">أكاديمية بازيد</span>
              <span className="text-xs font-bold text-muted-foreground">Bazaid Academy</span>
            </div>
          </a>
          <p className="text-xs text-muted-foreground">
            أكاديمية بازيد © 2026 — جميع الحقوق محفوظة
          </p>
        </div>
      </footer>

      <LinkModal link={modalLink} onClose={() => setModalLink(null)} />
      <LinkPreloader
        links={[
          { url: INTRO_LESSON_URL, title: "التعريف بالدورة" },
          { url: NAVIGATOR_URL, title: "جدول القدرات" },
          ...excerpts.map((x) => ({ url: x.url, title: x.title })),
        ]}
      />
      <WhatsAppFloatingButton />
    </main>
  );
}

const influencers = [
  { name: "ضاري", code: "ضاري", img: infDari, gender: "male" as const },
  { name: "سام", code: "sam", img: infSam, gender: "female" as const },
  { name: "د. عبدالله", code: "aa", img: infAbdullah, gender: "male" as const },
  { name: "سحاب", code: "سحاب", img: infSahab, gender: "male" as const },
  { name: "مظلة", code: "مظلة", img: infMizalla, gender: "male" as const },
  { name: "محمد", code: "m20", img: infMohammed, gender: "male" as const },
  { name: "راكان", code: "ra", img: infRakan, gender: "male" as const },
  { name: "منارة", code: "منارة", img: infManara, gender: "female" as const },
];

function InfluencerGrid() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? influencers : influencers.slice(0, 4);

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((p) => (
          <div
            key={p.name}
            className="rounded-3xl border border-border bg-surface-2/60 px-4 py-5 text-center transition-transform hover:-translate-y-1"
          >
            <div className="mx-auto size-16 overflow-hidden rounded-full border border-border bg-white shadow-md">
              {p.img ? (
                <img
                  src={p.img}
                  alt={`المؤثر ${p.name}`}
                  loading="lazy"
                  className="size-full object-cover"
                />
              ) : (
                <SilhouetteAvatar gender={p.gender} />
              )}
            </div>
            <p className="mt-3 text-lg font-black">{p.name}</p>
            <p className="mt-1 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
              كود الخصم: {p.code}
            </p>
          </div>
        ))}
      </div>
      {!showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-8 inline-block rounded-2xl border border-accent/60 bg-accent/10 px-7 py-3.5 font-bold text-accent transition-colors hover:bg-accent/20"
        >
          شاهد باقي المؤثرين ←
        </button>
      )}
    </>
  );
}
