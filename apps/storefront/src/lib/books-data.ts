export type StoryBookData = {
  id: string
  title: string
  handle: string
  author: {
    name: string
    bio: string
    avatar: string
  }
  narrator?: {
    name: string
    bio: string
    avatar: string
  }
  ageGroup: "kids_3_6" | "kids_7_12" | "teens_13_17" | "adults_18_plus"
  coverUrl: string
  paperbackPrice: number
  paperbackVariantId: string
  ebookPrice: number
  ebookVariantId: string
  audiobookPrice: number
  audiobookVariantId: string
  defaultVariantId: string
  isbn: string
  language: string
  pageCount: number
  audioDuration: string
  publicationDate: string
  publisher: string
  description: string
  sampleText: string[]
  hasAudioSample: boolean
  sampleAudioUrl: string
  sampleAudioDuration: string
  audioChapters: Array<{
    id: string
    title: string
    duration: string
    audioUrl: string
  }>
}

export const PUBLISHING_BOOKS: StoryBookData[] = [
  {
    id: "book_samsem_01",
    title: "مغامرة الأرنب الصغير سمسم في الغابة السحرية",
    handle: "samsem-the-bunny-adventure",
    author: {
      name: "منى السعيد",
      bio: "كاتبة متخصصة في أدب الطفل والقصص المصورة التربوية، حائزة على جوائز عربية في تعزيز الخيال الإيجابي لدى الناشئة.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    },
    narrator: {
      name: "ريم الجودر",
      bio: "فنانة صوتية ومسرحية رائدة متخصصة في حكايات الأطفال والأداء الصوتي التفاعلي المسرحي.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    ageGroup: "kids_3_6",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    paperbackPrice: 4500, // 45.00 SAR
    paperbackVariantId: "variant_01M5S1KQNT6V709RQKH2C6R0YB",
    ebookPrice: 2000, // 20.00 SAR
    ebookVariantId: "variant_01M5S1KQNTD43CFC91ATBD53P7",
    audiobookPrice: 2500, // 25.00 SAR
    audiobookVariantId: "variant_01M5S1KQNTH5VC2F2QDJ6541DP",
    defaultVariantId: "variant_01M5S1KQNT6V709RQKH2C6R0YB",
    isbn: "978-603-04-1234-1",
    language: "العربية الفصحى (مبسطة مع التشكيل الكامل)",
    pageCount: 32,
    audioDuration: "24 دقيقة",
    publicationDate: "2025-01-15",
    publisher: "دار حكايات الخيال للنشر",
    description:
      "قصة دافئة ورائعة تأخذ الأطفال الصغار في رحلة مليئة بالألوان والموسيقى مع الأرنب 'سمسم' الذي يبحث عن الجزرة الذهبية الضائعة، ويتعلم مع أصدقائه في الغابة قيمة الصدق والمشاركة وحب الطبيعة.",
    sampleText: [
      "في صبيحة يوم مشرق وجميل، استيقظ الأرنب الصغير 'سمسم' على زقزقة العصافير الملونة في غابة الصنوبر البديعة.\n\nتثاءب سمسم، ونفض عن أذنيه الطويلتين قطرات الندى الصباحي، ثم قفز بخفة نحو نافذة منزله الخشبي الصغير.",
      "قال سمسم في نفسه: 'اليوم يوم غير عادي! لقد سمعت أمي تقول إن زهور البنفسج قد تفتحت عند النبع الرقراق، وأنا أريد أن أجمع باقة عطرة لأهديها لها قبل غروب الشمس!'.\n\nوهكذا ارتدى سمسم سترته الزرقاء الجميلة، وحمل سلته الصغيرة، وانطلق يقفز بمرح عبر المروج الخضراء.",
      "وفجأة، توقف سمسم متعجبًا! خلف شجرة السنديان العتيقة، رأى وميضًا ذهبيًا ساطعًا يلمع بين أوراق الشجر المتساقطة...\n\nترى ما هذا السر العجيب الذي يختبئ في قلب الغابة؟ هل يجرؤ سمسم الصغير على الاقتراب؟",
    ],
    hasAudioSample: true,
    sampleAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    sampleAudioDuration: "02:15",
    audioChapters: [
      {
        id: "chap_samsem_01",
        title: "الفصل 1: استيقاظ سمسم وصباح الغابة السعيدة",
        duration: "08:12",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "chap_samsem_02",
        title: "الفصل 2: السر خلف شجرة السنديان العتيقة",
        duration: "07:45",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "chap_samsem_03",
        title: "الفصل 3: عودة الأصدقاء والاحتفال الكبير",
        duration: "08:03",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
    ],
  },
  {
    id: "book_star_02",
    title: "أين اختفت نجمتي الساطعة؟",
    handle: "where-did-my-shiny-star-go",
    author: {
      name: "منى السعيد",
      bio: "كاتبة متخصصة في أدب الطفل والقصص المصورة التربوية، حائزة على جوائز عربية في تعزيز الخيال الإيجابي لدى الناشئة.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    },
    narrator: {
      name: "ريم الجودر",
      bio: "فنانة صوتية ومسرحية رائدة متخصصة في حكايات الأطفال والأداء الصوتي التفاعلي المسرحي.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    ageGroup: "kids_3_6",
    coverUrl: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&q=80",
    paperbackPrice: 3800, // 38.00 SAR
    paperbackVariantId: "variant_01M5S1NRHQT0A21HGM4QQG22JK",
    ebookPrice: 1500, // 15.00 SAR
    ebookVariantId: "variant_01M5S1NRHQ67G7F1NBJCDF6HV4",
    audiobookPrice: 2000, // 20.00 SAR
    audiobookVariantId: "variant_01M5S1NRHQ1HQ61YHC0RC0N0PJ",
    defaultVariantId: "variant_01M5S1NRHQT0A21HGM4QQG22JK",
    isbn: "978-603-04-1234-2",
    language: "العربية الفصحى (مع التشكيل الكامل)",
    pageCount: 28,
    audioDuration: "18 دقيقة",
    publicationDate: "2025-02-01",
    publisher: "دار حكايات الخيال للنشر",
    description:
      "قصة ما قبل النوم الساحرة والمهدئة. في ليلة هادئة، تبحث الطفلة 'ليان' عن نجمتها الفضية التي اعتادت أن تضيء غرفتها كل مساء، لتكتشف رحلة النجوم عبر السحاب.",
    sampleText: [
      "كانت السماء الصافية ترتدي ثوبها الكحلي المرصع بالألماس اللامع، وكانت ليان الصغيرة تجلس أمام نافذتها ترقب صديقتها النجمة اللامعة 'سنا'.\n\nلكن هذه الليلة، كانت السماء تبدو فارغة وغريبة، فأين ذهبت سنا؟",
      "همست ليان لدميتها القطنية: 'لا تقلقي، سنبحث عن سنا معًا! ربما اختبأت خلف غيمة ناعمة، أو ذهبت لزيارة القمر الفضي!'.",
    ],
    hasAudioSample: true,
    sampleAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    sampleAudioDuration: "01:45",
    audioChapters: [
      {
        id: "chap_star_01",
        title: "الفصل 1: همسات المساء ونافذة ليان",
        duration: "09:10",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "chap_star_02",
        title: "الفصل 2: رقصة الغيوم الفضية",
        duration: "08:50",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
    ],
  },
  {
    id: "book_spaceship_03",
    title: "سفينة الفضاء السرية وسر كوكب الزمرد",
    handle: "secret-spaceship-emerald-planet",
    author: {
      name: "عمر اليافعي",
      bio: "روائي متخصص في الخيال العلمي والمغامرات المشوقة للناشئة والشباب، تميزت أعماله بحبكة علمية مبسطة وبناء عوالم مشوق.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    narrator: {
      name: "سامي المهدي",
      bio: "معلق صوتي إذاعي محترف ذو نبرة درامية عميقة، قدم عشرات الروايات الصوتية والوثائقيات العالمية.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    ageGroup: "kids_7_12",
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    paperbackPrice: 5500, // 55.00 SAR
    paperbackVariantId: "variant_01M5S1R0GS0V3TWV2WZMPFCMJ2",
    ebookPrice: 2500, // 25.00 SAR
    ebookVariantId: "variant_01M5S1R0GSWWPYD7J35DTFABHE",
    audiobookPrice: 3000, // 30.00 SAR
    audiobookVariantId: "variant_01M5S1R0GSZPB1TGVATF6B1ZAD",
    defaultVariantId: "variant_01M5S1R0GS0V3TWV2WZMPFCMJ2",
    isbn: "978-603-04-1234-3",
    language: "العربية الفصحى",
    pageCount: 144,
    audioDuration: "3 ساعات و 15 دقيقة",
    publicationDate: "2024-11-20",
    publisher: "أجيال المستقبل للطباعة والنشر",
    description:
      "مغامرة خيال علمي شيقة للناشئة، تبدأ عندما يكتشف ثلاثة أصدقاء سفينة استكشاف مجهولة مخبأة في قبو مرصد فلكي قديم، وتأخذهم في مهمة إنقاذ لكوكب الزمرد من عاصفة نيزكية مجهولة.",
    sampleText: [
      "لم يكن زياد يتوقع أن عطلة نهاية الأسبوع العادية ستتحول إلى أعظم مغامرة في حياته.\n\nحين انزلقت البوابة المعدنية الصدئة في قاع المرصد القديم، تردد صدى صفير إلكتروني منخفض ومبهر، وأضاءت شاشات ثلاثية الأبعاد لم يسبق لأحد في مدينته أن رأى مثلها من قبل.",
      "هتف طارق وهو يفرك عينيه: 'زياد! هل ترى ما أراه؟ هذه ليست مجرد غرفة تجارب قديمة... هذا جسر قيادة مركبة فضاء كاملة!'.",
      "وقبل أن يتمكنوا من التراجع، دوى صوت آلي هادئ من سقف المركبة: 'أهلاً بكم أيها المستكشفون الصغار. تم تحديد إحداثيات كوكب الزمرد. بدء العد التنازلي للإقلاع في ثلاث، اثنتين، واحدة...'!",
    ],
    hasAudioSample: true,
    sampleAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    sampleAudioDuration: "02:40",
    audioChapters: [
      {
        id: "chap_space_01",
        title: "الفصل 1: بوابة المرصد المهجور",
        duration: "18:30",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "chap_space_02",
        title: "الفصل 2: انطلاق نحو حزام الكويكبات",
        duration: "22:15",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
      {
        id: "chap_space_03",
        title: "الفصل 3: الهبوط على سطح الزمرد",
        duration: "25:40",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      },
    ],
  },
  {
    id: "book_seas_04",
    title: "كنز البحار السبعة والبوصلة المفقودة",
    handle: "treasure-of-the-seven-seas",
    author: {
      name: "عمر اليافعي",
      bio: "روائي متخصص في الخيال العلمي والمغامرات المشوقة للناشئة والشباب، تميزت أعماله بحبكة علمية مبسطة وبناء عوالم مشوق.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    narrator: {
      name: "سامي المهدي",
      bio: "معلق صوتي إذاعي محترف ذو نبرة درامية عميقة، قدم عشرات الروايات الصوتية والوثائقيات العالمية.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    ageGroup: "kids_7_12",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    paperbackPrice: 6000, // 60.00 SAR
    paperbackVariantId: "var_seas_paperback",
    ebookPrice: 2800, // 28.00 SAR
    ebookVariantId: "var_seas_ebook",
    audiobookPrice: 3500, // 35.00 SAR
    audiobookVariantId: "var_seas_audiobook",
    defaultVariantId: "var_seas_paperback",
    isbn: "978-603-04-1234-4",
    language: "العربية الفصحى",
    pageCount: 160,
    audioDuration: "3 ساعات و 45 دقيقة",
    publicationDate: "2024-10-10",
    publisher: "أجيال المستقبل للطباعة والنشر",
    description:
      "رحلة بحرية تاريخية آسرة تسير وراء أسطورة البوصلة العثمانية المطعمة بالياقوت التي تدل على ممر مائي سرّي بين الخلجان والجزر المنسية.",
    sampleText: [
      "كانت أمواج المحيط الهادر تضرب مقدمة السفينة الخشبية 'النورس الجريء'، والرياح تنفخ في أشرعتها البيضاء الكبيرة كأنها تدفعها نحو المجهول.\n\nأخرج القبطان الشاب بدر خريطة قديمة من جلد الغزال، تتوسطها علامة بوصلة ذهبية غائرة.",
      "قال مساعده وهو يثبت الدفة بكلتا يديه: 'يا قبطان، الدلائل تشير إلى أننا اقتربنا من خليج الدلافين الحارسة، ولكن الضباب كثيف ولا نرى علامة الشاطئ!'.",
    ],
    hasAudioSample: true,
    sampleAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    sampleAudioDuration: "02:10",
    audioChapters: [
      {
        id: "chap_seas_01",
        title: "الفصل 1: شراع النورس ينطلق",
        duration: "21:05",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "chap_seas_02",
        title: "الفصل 2: لغز الجزيرة الصخرية",
        duration: "24:18",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      },
    ],
  },
  {
    id: "book_alhambra_05",
    title: "شفرة قصر الحمراء: لغز المخطوطة الأندلسية",
    handle: "alhambra-code-andalusian-manuscript",
    author: {
      name: "د. غسان الكيلاني",
      bio: "مؤرخ وباحث وروائي في التراث الحضاري والأدب التاريخي والغموض، نُشرت له أكثر من عشر روايات حائزة على إشادة نقدية واسعة.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    },
    narrator: {
      name: "سامي المهدي",
      bio: "معلق صوتي إذاعي محترف ذو نبرة درامية عميقة، قدم عشرات الروايات الصوتية والوثائقيات العالمية.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    ageGroup: "teens_13_17",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    paperbackPrice: 7500, // 75.00 SAR
    paperbackVariantId: "variant_01M5S1SY6YGGMX9V8KA3Q9C4Q2",
    ebookPrice: 3500, // 35.00 SAR
    ebookVariantId: "variant_01M5S1SY6YZFJNSSNQNJBHS39K",
    audiobookPrice: 4500, // 45.00 SAR
    audiobookVariantId: "variant_01M5S1SY6YGMYXHYRYK8AP3SCZ",
    defaultVariantId: "variant_01M5S1SY6YGGMX9V8KA3Q9C4Q2",
    isbn: "978-603-04-1234-5",
    language: "العربية الفصحى",
    pageCount: 312,
    audioDuration: "7 ساعات و 20 دقيقة",
    publicationDate: "2024-08-14",
    publisher: "منشورات دار الفكر الإبداعي",
    description:
      "رواية غموض وتاريخ تحبس الأنفاس بين غرناطة وقرطبة ودمشق، تدور حول باحث شاب في الآثار يكتشف رسالة مخفية داخل نقوش الفسيفساء بقصر الحمراء تكشف عن خريطة لأكبر مكتبة علمية أندلسية فُقدت في القرن الخامس عشر.",
    sampleText: [
      "في بهو الأسود بقصر الحمراء، حين انسحب آخر فوج سياحي وانطفأت الأضواء الكاشفة، بقي طارق معلقًا بنظره عند التاج الرخامي للعمود الثاني عشر.\n\nلم تكن النقوش الهندسية مجرد زينة فنية كما اعتقد العالم طوال خمسمائة عام؛ بل كانت تشفيراً رياضياً دقيقاً يتطابق مع معادلات الخوارزمي في حساب المثلثات.",
      "سحب طارق مفكرته الجلدية، وقارن الرموز المنقوشة بصفحة المخطوطة المصورة التي أرسلها له جده قبل اختفائه الغامض في إشبيلية.\n\nهمس في سرّه: 'الحروف المائلة لا تشير إلى بيت الشعر المعتاد... إنها تشير إلى سرداب أسفل ساحة البركة!'.",
    ],
    hasAudioSample: true,
    sampleAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    sampleAudioDuration: "03:10",
    audioChapters: [
      {
        id: "chap_alhambra_01",
        title: "الفصل 1: ظلال بهو الأسود",
        duration: "32:10",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
      {
        id: "chap_alhambra_02",
        title: "الفصل 2: الرسالة المشفرة من إشبيلية",
        duration: "29:45",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      },
      {
        id: "chap_alhambra_03",
        title: "الفصل 3: السرداب المفقود تحت الرخام",
        duration: "35:12",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      },
    ],
  },
  {
    id: "book_baghdad_06",
    title: "أطياف بغداد القديمة: ملحمة أسرار الرافدين",
    handle: "spectres-of-ancient-baghdad",
    author: {
      name: "د. غسان الكيلاني",
      bio: "مؤرخ وباحث وروائي في التراث الحضاري والأدب التاريخي والغموض، نُشرت له أكثر من عشر روايات حائزة على إشادة نقدية واسعة.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    },
    narrator: {
      name: "سامي المهدي",
      bio: "معلق صوتي إذاعي محترف ذو نبرة درامية عميقة، قدم عشرات الروايات الصوتية والوثائقيات العالمية.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    ageGroup: "adults_18_plus",
    coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80",
    paperbackPrice: 8500, // 85.00 SAR
    paperbackVariantId: "variant_01M5S1SYE376NHJEQH5G9V5726",
    ebookPrice: 4000, // 40.00 SAR
    ebookVariantId: "variant_01M5S1SYE32WP485P4E3HHMKRG",
    audiobookPrice: 5000, // 50.00 SAR
    audiobookVariantId: "variant_01M5S1SYE3KD338YJNJ3083ZPS",
    defaultVariantId: "variant_01M5S1SYE376NHJEQH5G9V5726",
    isbn: "978-603-04-1234-6",
    language: "العربية الفصحى الأدبية",
    pageCount: 448,
    audioDuration: "11 ساعة و 40 دقيقة",
    publicationDate: "2024-05-18",
    publisher: "منشورات دار الفكر الإبداعي",
    description:
      "ملحمة روائية عميقة تسبر أغوار العصر الذهبي لبيت الحكمة في بغداد، وتتبع مصائر علماء وفلاسفة ووراقين واجهوا أعتى صراعات السلطة لحماية خلاصة المعرفة الإنسانية من الاندثار.",
    sampleText: [
      "تهادت مياه دجلة بهدوء تحت جسر القوارب العتيق، حاملة على تموجاتها الفضية انعكاس مشاعل قصر الخلد ودور الوراقين على الضفة الشرقية.\n\nكان يحيى الورّاق يمسح حبر الكركندي عن أنامله المتعبة، ويحدق في رقعة من ورق الكاغد السمرقندي النادر الذي وصل للتو مع قافلة الحرير.",
      "قال له رفيقه أبو حيان وهو يغلق صندوق الكتب المجلدة بالجلد القرطبي: 'يا يحيى، الأنباء الواردة من الشمال تنبئ بعاصفة، ووالي المدينة يطالب بتسليم فهرس خزانة دار الحكمة قبل فجر الغد!'.\n\nرفع يحيى رأسه، ونظر إلى آلاف المخطوطات المرصوفة بعناية: 'المعرفة ليست ملكاً لسلطان يا أبا حيان... المعرفة روح الخلود، ومن يبذل روحه لحفظها لا يخشى فناء الأجساد'.",
    ],
    hasAudioSample: true,
    sampleAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    sampleAudioDuration: "03:45",
    audioChapters: [
      {
        id: "chap_baghdad_01",
        title: "الفصل 1: ليلة الوراقين على ضفاف دجلة",
        duration: "44:20",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      },
      {
        id: "chap_baghdad_02",
        title: "الفصل 2: أسرار بيت الحكمة وخزانة المأمون",
        duration: "48:15",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
      },
      {
        id: "chap_baghdad_03",
        title: "الفصل 3: رسائل القوافل ومؤامرة البلاط",
        duration: "52:40",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
      },
    ],
  },
]

export function getBookByHandle(handle: string): StoryBookData | undefined {
  return PUBLISHING_BOOKS.find((b) => b.handle === handle)
}

export function getAllBooks(): StoryBookData[] {
  return PUBLISHING_BOOKS
}
