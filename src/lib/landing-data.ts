export const COURSE_URL = "https://bazaidacademy.net/courses/qudrat/";

export const INTRO_LESSON_URL =
  "https://bazaidacademy.net/courses/qudrat/lesson/%D8%AA%D8%B9%D8%B1%D9%8A%D9%81-%D8%A8%D8%A7%D9%84%D8%AF%D9%88%D8%B1%D8%A9/?page_tab=comments";

export const NAVIGATOR_URL = "https://course-navigator.bazaidacademy.net/";

export const ACADEMY_URL = "https://bazaidacademy.net";

export type Excerpt = {
  id: string;
  title: string;
  note: string;
  url: string;
};

export const excerpts: Excerpt[] = [
  {
    id: "quant-book",
    title: "نبذة من كتاب القدرات كمي",
    note: "أسلوب شرح مبسّط وأمثلة محلولة خطوة بخطوة",
    url: "https://drive.google.com/file/d/1pShBvCz3RzbMONx6-2-zGup1S5D8XxeM/view?usp=drivesdk",
  },
  {
    id: "laws-summary",
    title: "نبذة من ملخص القوانين",
    note: "كل قوانين الكمي في صفحات مركزة سهلة الحفظ",
    url: "https://drive.google.com/file/d/1DBDLpr6h76-zSu9o6F4j6s3mPJTKDfbu/view?usp=drivesdk",
  },
  {
    id: "quant-sections",
    title: "نبذة من أقسام القدرات كمي",
    note: "تقسيم كامل لأقسام الاختبار ووزن كل قسم",
    url: "https://drive.google.com/file/d/1ciEBbRrB11TsvkdLlvXpvu2fA_9pJ7MZ/view?usp=drivesdk",
  },
  {
    id: "verbal",
    title: "نبذة من اللفظي",
    note: "استراتيجيات التناظر واستيعاب المقروء والخطأ السياقي",
    url: "https://drive.google.com/file/d/15hxezDP8oemF3UCMA_PMd95l85RLEIjI/view?usp=drivesdk",
  },
  {
    id: "quant-explain",
    title: "نبذة من شرح الكمي",
    note: "درس مباشر من داخل الدورة: ترتيب العمليات الحسابية",
    url: "https://bazaidacademy.net/courses/qudrat/lesson/%D8%AA%D8%B1%D8%AA%D9%8A%D8%A8-%D8%A7%D9%84%D8%B9%D9%85%D9%84%D9%8A%D8%A7%D8%AA-%D8%A7%D9%84%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%D8%A9-4/?page_tab=comments",
  },
];

export const testimonials = [
  {
    name: "عبدالله الشمري",
    gender: "male" as const,
    result: "٩٧ في القدرات",
    text: "الدورة رتبت لي المذاكرة من الصفر، التاسك اليومي خلاني ما آجل ولا يوم. من أول أسبوع حسيت بفرق كبير في سرعة الحل.",
  },
  {
    name: "رهف العتيبي",
    gender: "female" as const,
    result: "٩٦ في القدرات",
    text: "ملخص القوانين وحده يستاهل، حفظت كل شي في يومين وكنت أرجع له قبل الاختبار مباشرة.",
  },
  {
    name: "محمد القحطاني",
    gender: "male" as const,
    result: "٩٥ في القدرات",
    text: "شرح اللفظي كان أسهل شي مريت عليه، الاستراتيجيات خلت التناظر اللفظي متعة مو مشكلة.",
  },
  {
    name: "نورة الدوسري",
    gender: "female" as const,
    result: "٩٨ في القدرات",
    text: "الدعم متواصل والمدرب يرد على كل سؤال. الاختبارات المحاكية جهزتني نفسيًا لجو الاختبار.",
  },
  {
    name: "سلطان الحربي",
    gender: "male" as const,
    result: "٩٤ في القدرات",
    text: "كنت أكره الكمي، بعد الدورة صار أعلى قسم عندي. الفضل لطريقة الشرح بالخطوات.",
  },
  {
    name: "لمى الزهراني",
    gender: "female" as const,
    result: "٩٦ في القدرات",
    text: "جدول القدرات خلاني أعرف وين واقفة بالضبط كل يوم، حسيت إني ماشية على خطة مو عشوائية.",
  },
];

export const influencers = [
  "مؤثرون في التعليم",
  "صنّاع محتوى تحصيلي",
  "سفراء أكاديمية بازيد",
  "قنوات تعليمية سعودية",
];
