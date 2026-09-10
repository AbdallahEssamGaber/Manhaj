import type { FlashcardDeck, FlashcardItem, Quiz, QuizQuestion, MockExam } from "@/types";

// Hand-authored banks for a few flagship subjects so the demo has real,
// varied content. Anything outside this list falls back to the templated
// generator below, so every subject in the curriculum stays functional.

const curatedQuiz: Record<string, QuizQuestion[]> = {
  "هياكل البيانات": [
    {
      prompt: "في شجرة البحث الثنائي (BST)، القيم الأصغر من أي عقدة بتكون فين؟",
      options: ["في الشجرة الفرعية الشمال", "في الشجرة الفرعية اليمين", "في الجذر بس", "مينفعش تكون أصغر"],
      correctIndex: 0,
      explanation: "شجرة البحث الثنائي بتحافظ على إن كل قيمة في الشجرة الشمال أصغر من العقدة، وكل قيمة في الشجرة اليمين أكبر منها.",
    },
    {
      prompt: "إيه متوسط تعقيد الوقت للبحث في شجرة BST متوازنة؟",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correctIndex: 1,
      explanation: "الشجرة المتوازنة بتنصّ مساحة البحث في كل خطوة، فبتدي متوسط وقت O(log n).",
    },
    {
      prompt: "أنهي بنية هي العمود الفقري لطابور الأولوية (priority queue)؟",
      options: ["القائمة المرتبطة", "الكومة (Heap)", "جدول التجزئة (Hash table)", "المكدس (Stack)"],
      correctIndex: 1,
      explanation: "الـ Heap بيخلي أصغر (أو أكبر) عنصر متاح في O(1)، والإضافة والحذف بياخدوا O(log n).",
    },
    {
      prompt: "إيه اللي بيحصل لشجرة BST مش متوازنة لو القيم اتضافت مرتبة؟",
      options: ["بتفضل متوازنة", "بتتحول لقائمة مرتبطة عملياً", "بتتحول لـ Heap", "بترمي خطأ"],
      correctIndex: 1,
      explanation: "الإضافة بترتيب بتخلي كل عقدة ليها ابن واحد بس، فالبحث بيبقى O(n).",
    },
    {
      prompt: "أنهي تجول (traversal) بيزور عُقد الـ BST بترتيب تصاعدي؟",
      options: ["Pre-order", "Post-order", "In-order", "Level-order"],
      correctIndex: 2,
      explanation: "الـ In-order (شمال، عقدة، يمين) بيزور القيم بترتيب تصاعدي في أي BST.",
    },
  ],
  "نظم التشغيل": [
    {
      prompt: "أنهي بنية بيانات بيستخدمها نظام التشغيل عشان يتابع حالة الـ process؟",
      options: ["جدول تخصيص الملفات (FAT)", "كتلة التحكم في العملية (PCB)", "جدول الصفحات (Page Table)", "متجه المقاطعات (Interrupt Vector)"],
      correctIndex: 1,
      explanation: "الـ PCB بيخزن عداد البرنامج والمسجلات ومعلومات الجدولة اللي محتاجها النظام عشان يعمل context switch للعملية.",
    },
    {
      prompt: "إيه اللي بيسبب حدوث context switch؟",
      options: ["متغير بيخرج من الـ scope", "مقاطعة (interrupt) أو قرار جدولة", "تحذير من الكومبايلر", "صفحة بترجع نضيفة"],
      correctIndex: 1,
      explanation: "المقاطعات، ونداءات النظام، وانتهاء الوقت المخصص من الجدولة، دي الأسباب الكلاسيكية.",
    },
    {
      prompt: "إيه هو الـ thrashing؟",
      options: ["ارتفاع حرارة المعالج", "تبديل صفحات زيادة عن اللازم بيوقف التقدم", "تعارض بين قفلين (deadlock)", "امتلاء القرص"],
      correctIndex: 1,
      explanation: "الـ thrashing بيحصل لما النظام بيقضي وقت في تبديل الصفحات أكتر من وقت التنفيذ الفعلي.",
    },
    {
      prompt: "أنهي شرط مش لازم يتحقق عشان يحصل deadlock؟",
      options: ["الاستئثار المتبادل (Mutual exclusion)", "الاحتفاظ والانتظار (Hold and wait)", "الانتزاع (Preemption)", "الانتظار الدائري (Circular wait)"],
      correctIndex: 2,
      explanation: "الـ deadlock بيحتاج عدم وجود انتزاع — يعني الموارد مينفعش تتاخد بالقوة.",
    },
    {
      prompt: "عملية wait() في الـ semaphore بتعمل إيه لما القيمة تبقى صفر؟",
      options: ["بترجع فوراً", "بتوقف (block) العملية اللي نادتها", "بتزود القيمة", "بتنهي العملية"],
      correctIndex: 1,
      explanation: "الـ wait() بتفضل واقفة لحد ما عملية تانية تنادي signal() وترفع القيمة فوق الصفر.",
    },
  ],
  "قواعد البيانات": [
    {
      prompt: "الجدول اللي في 2NF بس مش في 3NF فيه أنهي نوع اعتمادية؟",
      options: ["اعتمادية جزئية", "اعتمادية عابرة (Transitive)", "من غير اعتمادية", "اعتمادية دائرية"],
      correctIndex: 1,
      explanation: "الـ 3NF بتشيل الاعتماديات العابرة — يعني عمود مش مفتاح بيعتمد على عمود تاني مش مفتاح.",
    },
    {
      prompt: "الـ BCNF بيقوّي إيه بالمقارنة بالـ 3NF؟",
      options: ["مفيش فرق، هما نفس الحاجة", "كل مُحدِّد (determinant) لازم يكون مفتاح مرشح", "المفتاح الأجنبي بيبقى اختياري", "الجدول لازم يكون عمود واحد بس"],
      correctIndex: 1,
      explanation: "الـ BCNF بتقفل الثغرة اللي الـ 3NF مش بتغطيها: كل مُحدِّد لأي اعتمادية وظيفية لازم يكون مفتاح مرشح.",
    },
    {
      prompt: "أنهي جملة SQL بتفلتر المجموعات بعد التجميع؟",
      options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
      correctIndex: 1,
      explanation: "الـ WHERE بتفلتر الصفوف قبل التجميع؛ الـ HAVING بتفلتر المجموعات الناتجة.",
    },
    {
      prompt: "أنهي خاصية بتضمن إن المعاملة (transaction) تتم كلها أو ملهاش أي أثر؟",
      options: ["العزل (Isolation)", "الدوام (Durability)", "الذرية (Atomicity)", "التناسق (Consistency)"],
      correctIndex: 2,
      explanation: "الذرية معناها إن عمليات المعاملة إما تتنفذ كلها أو ترجع كلها.",
    },
    {
      prompt: "المفتاح الأجنبي بيفرض أنهي نوع قيود؟",
      options: ["سلامة النطاق", "السلامة المرجعية (Referential integrity)", "سلامة الكيان", "قيد الـ Null"],
      correctIndex: 1,
      explanation: "المفتاح الأجنبي بيتأكد إن الصف اللي بيتم الإشارة له موجود فعلاً في الجدول الأب.",
    },
  ],
  "هندسة البرمجيات": [
    {
      prompt: "في الـ Scrum، الغرض من الـ sprint retrospective إيه؟",
      options: ["تقدير الـ story points", "مراجعة السبرنت اللي فات عشان تحسّن الأداء", "توزيع مهام السبرنت الجاي", "عرض الشغل لأصحاب المصلحة"],
      correctIndex: 1,
      explanation: "الـ retrospective هو الاجتماع اللي الفريق بيراجع فيه اللي مشى كويس واللي مشيش، وده مختلف عن عرض الـ sprint review.",
    },
    {
      prompt: "أنهي عنصر بيمثل وحدة من الوظائف اللي المستخدم بيشوفها في الـ Agile؟",
      options: ["قصة المستخدم (User story)", "مخطط جانت", "مخطط UML", "سكريبت بناء"],
      correctIndex: 0,
      explanation: "قصص المستخدم بتوصف الميزة من وجهة نظر المستخدم، وهي الوحدة الأساسية للتخطيط في الـ Agile.",
    },
    {
      prompt: "مبدأ المسؤولية الواحدة (SRP) بيقول إيه؟",
      options: ["الكلاس لازم يكون ليه سبب واحد بس للتغيير", "الكلاس لازم يعمل كل حاجة", "الكلاسات ميتعادش استخدامها تاني", "كل method لازم تكون static"],
      correctIndex: 0,
      explanation: "الـ SRP بيخلي الكلاس مركّز على مهمة واحدة، وده بيسهّل تعديله من غير ما يأثر على حاجات تانية.",
    },
    {
      prompt: "إيه الغرض الأساسي من مراجعة الكود (code review)؟",
      options: ["إبطاء عملية الإصدار", "اكتشاف الأخطاء ونشر المعرفة قبل الدمج", "استبدال الاختبار", "توزيع اللوم"],
      correctIndex: 1,
      explanation: "المراجعة بتكتشف المشاكل بدري وبتنشر الفهم بين أعضاء الفريق.",
    },
    {
      prompt: "أنهي مستوى اختبار بيتأكد إن الموديولات اللي شغالة لوحدها بتشتغل مع بعض صح؟",
      options: ["اختبار الوحدة (Unit)", "اختبار التكامل (Integration)", "اختبار القبول (Acceptance)", "اختبار الدخان (Smoke)"],
      correctIndex: 1,
      explanation: "اختبارات التكامل بتتأكد إن الموديولات اللي عدّت اختبار الوحدة لوحدها بتشتغل صح مع بعض.",
    },
  ],
};

const curatedCards: Record<string, FlashcardItem[]> = {
  "هياكل البيانات": [
    { front: "إيه هي شجرة البحث الثنائي (BST)؟", back: "شجرة ثنائية كل قيمة في الشجرة الشمال بتاعتها أصغر من الأب، وكل قيمة في الشجرة اليمين أكبر منه." },
    { front: "أسوأ حالة لشجرة BST مش متوازنة؟", back: "O(n) — الإضافة بترتيب بتحوّل الشجرة عملياً لقائمة مرتبطة." },
    { front: "الـ Heap بيتستخدم في إيه؟", back: "متابعة أصغر أو أكبر عنصر بكفاءة — وهو العمود الفقري لطابور الأولوية وخوارزمية heapsort." },
    { front: "الفرق بين Stack و Queue؟", back: "الـ Stack بيشتغل بنظام LIFO (آخر داخل أول خارج)؛ والـ Queue بيشتغل بنظام FIFO (أول داخل أول خارج)." },
  ],
  "نظم التشغيل": [
    { front: "إيه هي الـ process؟", back: "نسخة من برنامج بيتنفذ فعلياً: بالكود بتاعه، وعداد البرنامج، والـ stack، وقسم البيانات، والـ heap." },
    { front: "المجدول (scheduler) بيقرر إيه؟", back: "أنهي عملية جاهزة هتاخد المعالج بعد كده، ولحد إمتى." },
    { front: "إيه هو الـ deadlock؟", back: "دورة من العمليات كل واحدة مستنية مورد ممسوك من العملية اللي بعدها، فمفيش حد يقدر يكمل." },
    { front: "الفرق بين الـ Paging و الـ Segmentation؟", back: "الـ Paging بيقسّم الذاكرة لإطارات بحجم ثابت؛ والـ Segmentation بيقسّمها لوحدات منطقية بحجم متغير." },
  ],
  "قواعد البيانات": [
    { front: "إيه هو التطبيع (Normalization)؟", back: "تنظيم الجداول عشان تقلل التكرار، غالباً بالمرور بـ 1NF → 2NF → 3NF → BCNF." },
    { front: "إيه هي الاعتمادية العابرة (Transitive)؟", back: "لما عمود مش مفتاح بيعتمد على عمود تاني مش مفتاح، بدل ما يعتمد على المفتاح الأساسي مباشرة." },
    { front: "الـ ACID اختصار لإيه؟", back: "الذرية، التناسق، العزل، الدوام — الضمانات اللي بتوفرها أي معاملة." },
    { front: "الفرق بين المفتاح الأساسي والمفتاح الأجنبي؟", back: "المفتاح الأساسي بيميّز الصف بشكل فريد؛ والمفتاح الأجنبي بيشاور على مفتاح أساسي في جدول تاني." },
  ],
  "هندسة البرمجيات": [
    { front: "إيه هو الـ Agile؟", back: "منهجية تكرارية بتركز على المرونة والتعاون وأخد فيدباك مستمر من العميل." },
    { front: "الفرق بين Scrum و Kanban؟", back: "الـ Scrum بيستخدم سبرنتات بمدة ثابتة وأدوار محددة؛ والـ Kanban تدفق مستمر بيتعرض على لوحة." },
    { front: "إيه هو الـ Technical Debt؟", back: "التكلفة الضمنية لشغل إضافي بيحصل بسبب اختيار حل سريع دلوقتي بدل حل أفضل على المدى الطويل." },
    { front: "إيه هو الـ Design Pattern؟", back: "حل قابل لإعادة الاستخدام وله اسم لمشكلة تصميم شائعة — زي Singleton و Observer و Factory." },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const templateAnswers = [
  "الآلية اللي اتشرحت في محاضرة الأسبوع ده",
  "التعريف اللي موجود في مذكرة المادة",
  "العملية اللي موصوفة في القراءة المطلوبة",
  "المعادلة اللي اتقدمت في الموضوع ده",
  "المفهوم اللي الدكتور ركّز عليه في السلايد",
];

function templatedQuestion(subject: string, topic: string, n: number): QuizQuestion {
  const correct = `المقصود بيه هو ${templateAnswers[n % templateAnswers.length]} بخصوص "${topic}".`;
  const distractors = [
    `مالوش علاقة بـ "${topic}" وبيتبع وحدة تانية.`,
    `عكس اللي "${topic}" بيوصفه تماماً.`,
    `بينطبق بس برّه نطاق مادة ${subject}.`,
  ];
  const options = shuffle([correct, ...distractors]);
  return {
    prompt: `أنهي عبارة بتوصف "${topic}" في مادة ${subject} بأحسن شكل؟`,
    options,
    correctIndex: options.indexOf(correct),
    explanation: `راجع الجزء الخاص بـ "${topic}" في مادة ${subject} — ده بالظبط نوع سؤال الاسترجاع اللي بيتم اختباره.`,
  };
}

function templatedCard(subject: string, topic: string, n: number): FlashcardItem {
  const fronts = [
    `عرّف "${topic}".`,
    `ليه "${topic}" مهم في مادة ${subject}؟`,
    `اديني مثال عملي على "${topic}".`,
    `إيه الغلطة الشائعة في "${topic}"؟`,
  ];
  return {
    front: fronts[n % fronts.length],
    back: `مسحوب من مادة ${subject} بتاعتك عن "${topic}" — لما توصل الـ RAG backend الحقيقي هتاخد التعريف والمصدر الفعلي.`,
  };
}

export function generateFlashcardDeck(subject: string, topic: string, count = 6): FlashcardDeck {
  const bank = curatedCards[subject];
  const cards: FlashcardItem[] = [];
  for (let i = 0; i < count; i++) {
    cards.push(bank ? bank[i % bank.length] : templatedCard(subject, topic, i));
  }
  return { topic, cards };
}

export function generateQuiz(subject: string, topic: string, count = 5): Quiz {
  const bank = curatedQuiz[subject];
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(bank ? bank[i % bank.length] : templatedQuestion(subject, topic, i));
  }
  return { topic, questions };
}

export function generateMockExam(subject: string, topic: string, count = 8): MockExam {
  const bank = curatedQuiz[subject];
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(bank ? bank[i % bank.length] : templatedQuestion(subject, topic, i + 5));
  }
  return { topic, durationSeconds: count * 90, questions };
}
