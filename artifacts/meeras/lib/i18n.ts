export type LanguageCode = "en" | "ur" | "ar";
export type MadhabId = "hanafi" | "shafii" | "maliki" | "hanbali";

export const LANGUAGES: { code: LanguageCode; label: string; rtl: boolean }[] = [
  { code: "en", label: "English", rtl: false },
  { code: "ur", label: "اردو", rtl: true },
  { code: "ar", label: "العربية", rtl: true },
];

export const MADHABS: { id: MadhabId; labelKey: string; available: boolean }[] = [
  { id: "hanafi", labelKey: "madhab.hanafi", available: true },
  { id: "shafii", labelKey: "madhab.shafii", available: false },
  { id: "maliki", labelKey: "madhab.maliki", available: false },
  { id: "hanbali", labelKey: "madhab.hanbali", available: false },
];

type Dict = Record<string, string>;

const en: Dict = {
  "app.name": "Meeras Calculator",
  "app.tagline": "Islamic Inheritance Distribution",

  "home.start": "Start Calculation",
  "home.settings": "Settings",
  "home.intro":
    "Answer a few questions about the deceased and surviving heirs. Your data stays on your device.",
  "home.offlineBadge": "Works fully offline",

  "settings.title": "Settings",
  "settings.language": "Language",
  "settings.theme": "Appearance",
  "settings.madhab": "School of thought",
  "settings.theme.system": "System",
  "settings.theme.light": "Light",
  "settings.theme.dark": "Dark",
  "settings.about": "About",
  "settings.about.body":
    "Meeras Calculator helps Muslims distribute inheritance according to Islamic law (Faraid). All calculations run on your device. Always consult a qualified scholar for complex cases.",
  "settings.unavailable": "Coming soon",

  "madhab.hanafi": "Hanafi",
  "madhab.shafii": "Shafi'i",
  "madhab.maliki": "Maliki",
  "madhab.hanbali": "Hanbali",

  "common.next": "Next",
  "common.back": "Back",
  "common.skip": "Skip",
  "common.yes": "Yes",
  "common.no": "No",
  "common.male": "Male",
  "common.female": "Female",
  "common.done": "View Result",
  "common.startOver": "Start over",
  "common.close": "Close",
  "common.of": "of",

  "wizard.step": "Step",
  "wizard.progress": "Question",

  "q.estate.title": "What is the total estate?",
  "q.estate.help":
    "Enter the net estate after funeral expenses, debts, and bequests (up to 1/3) have been settled.",
  "q.estate.placeholder": "e.g. 1000000",

  "q.gender.title": "Was the deceased male or female?",
  "q.gender.help": "This determines whether a husband or wife may inherit.",

  "q.spouse.title.male": "Did the deceased leave a wife?",
  "q.spouse.title.female": "Did the deceased leave a husband?",
  "q.spouse.help": "A wife inherits 1/8 with children, 1/4 without. A husband inherits 1/4 with children, 1/2 without.",
  "q.wives.title": "How many wives?",
  "q.wives.help": "Up to four wives share the spouse's portion equally.",

  "q.father.title": "Is the father alive?",
  "q.father.help": "The father inherits 1/6 when there are children, plus the remainder if only daughters.",
  "q.mother.title": "Is the mother alive?",
  "q.mother.help": "The mother inherits 1/6 with children or two or more siblings, otherwise 1/3.",

  "q.sons.title": "How many sons?",
  "q.daughters.title": "How many daughters?",
  "q.children.help": "Sons receive twice the share of daughters when both are present.",

  "q.fullBrothers.title": "How many full brothers?",
  "q.fullSisters.title": "How many full sisters?",
  "q.fullSiblings.help": "Full siblings inherit only if there are no children and no father.",

  "q.paternalHalfBrothers.title": "How many paternal half-brothers?",
  "q.paternalHalfSisters.title": "How many paternal half-sisters?",
  "q.paternalHalf.help": "Same father, different mother. Inherit only if no full siblings, no children, and no father.",

  "q.maternalHalf.title": "How many maternal half-siblings?",
  "q.maternalHalf.help":
    "Same mother, different father. Inherit only if there are no children and no father. They share equally regardless of gender.",

  "result.title": "Distribution",
  "result.estate": "Total estate",
  "result.heir": "Heir",
  "result.share": "Share",
  "result.amount": "Amount",
  "result.each": "each",
  "result.rules": "Rules applied",
  "result.awl": "'Awl applied — fixed shares exceed the estate, so all shares are scaled proportionally.",
  "result.radd": "Radd applied — surplus distributed back to fixed-share heirs (except spouse).",
  "result.residue": "Residue (no eligible asabah)",
  "result.noHeirs": "No eligible heirs found.",
  "result.share.fixed": "Fixed share (Furudh)",
  "result.share.asabah": "Residuary (Asabah)",
  "result.share.umariyyatan": "Mother takes 1/3 of remainder (Umariyyatan)",
  "result.share.radd": "Includes redistribution (Radd)",

  "heir.husband": "Husband",
  "heir.wife": "Wife",
  "heir.father": "Father",
  "heir.mother": "Mother",
  "heir.son": "Son",
  "heir.daughter": "Daughter",
  "heir.fullBrother": "Full brother",
  "heir.fullSister": "Full sister",
  "heir.paternalHalfBrother": "Paternal half-brother",
  "heir.paternalHalfSister": "Paternal half-sister",
  "heir.maternalHalfSibling": "Maternal half-sibling",
};

const ur: Dict = {
  "app.name": "میراث کیلکولیٹر",
  "app.tagline": "اسلامی وراثت کی تقسیم",

  "home.start": "حساب شروع کریں",
  "home.settings": "ترتیبات",
  "home.intro":
    "میت اور وارثوں کے بارے میں چند سوالات کے جوابات دیں۔ آپ کا ڈیٹا آپ کے فون پر ہی رہتا ہے۔",
  "home.offlineBadge": "مکمل آف لائن کام کرتا ہے",

  "settings.title": "ترتیبات",
  "settings.language": "زبان",
  "settings.theme": "تھیم",
  "settings.madhab": "مسلک",
  "settings.theme.system": "سسٹم",
  "settings.theme.light": "روشن",
  "settings.theme.dark": "تاریک",
  "settings.about": "تعارف",
  "settings.about.body":
    "میراث کیلکولیٹر مسلمانوں کو شریعت کے مطابق وراثت تقسیم کرنے میں مدد دیتا ہے۔ تمام حساب آپ کے فون پر ہوتا ہے۔ پیچیدہ مسائل میں اہل علم سے رجوع کریں۔",
  "settings.unavailable": "جلد آرہا ہے",

  "madhab.hanafi": "حنفی",
  "madhab.shafii": "شافعی",
  "madhab.maliki": "مالکی",
  "madhab.hanbali": "حنبلی",

  "common.next": "آگے",
  "common.back": "پیچھے",
  "common.skip": "چھوڑیں",
  "common.yes": "ہاں",
  "common.no": "نہیں",
  "common.male": "مرد",
  "common.female": "عورت",
  "common.done": "نتیجہ دیکھیں",
  "common.startOver": "دوبارہ شروع کریں",
  "common.close": "بند کریں",
  "common.of": "میں سے",

  "wizard.step": "مرحلہ",
  "wizard.progress": "سوال",

  "q.estate.title": "کل ترکہ کتنا ہے؟",
  "q.estate.help":
    "تجہیز و تکفین، قرضوں اور وصیت (ایک تہائی تک) کے بعد بچنے والی رقم درج کریں۔",
  "q.estate.placeholder": "مثلاً 1000000",

  "q.gender.title": "میت مرد تھا یا عورت؟",
  "q.gender.help": "اس سے طے ہوگا کہ شوہر یا بیوی وارث بنیں گے۔",

  "q.spouse.title.male": "کیا میت نے بیوی چھوڑی ہے؟",
  "q.spouse.title.female": "کیا میت نے شوہر چھوڑا ہے؟",
  "q.spouse.help":
    "بیوی کو اولاد کے ساتھ 1/8 اور بغیر 1/4 ملتا ہے۔ شوہر کو اولاد کے ساتھ 1/4 اور بغیر 1/2 ملتا ہے۔",
  "q.wives.title": "کتنی بیویاں ہیں؟",
  "q.wives.help": "زیادہ سے زیادہ چار بیویاں حصہ برابر تقسیم کریں گی۔",

  "q.father.title": "کیا والد زندہ ہیں؟",
  "q.father.help": "والد کو اولاد کی موجودگی میں 1/6 ملتا ہے، اور صرف بیٹیوں کی صورت میں باقی بھی۔",
  "q.mother.title": "کیا والدہ زندہ ہیں؟",
  "q.mother.help": "والدہ کو اولاد یا دو یا زائد بہن بھائیوں کی موجودگی میں 1/6 ملتا ہے، ورنہ 1/3۔",

  "q.sons.title": "بیٹے کتنے ہیں؟",
  "q.daughters.title": "بیٹیاں کتنی ہیں؟",
  "q.children.help": "اگر بیٹے اور بیٹیاں دونوں موجود ہوں تو بیٹے کا حصہ بیٹی سے دگنا ہوگا۔",

  "q.fullBrothers.title": "حقیقی بھائی کتنے ہیں؟",
  "q.fullSisters.title": "حقیقی بہنیں کتنی ہیں؟",
  "q.fullSiblings.help": "حقیقی بہن بھائی صرف اولاد اور والد کی غیر موجودگی میں وارث بنتے ہیں۔",

  "q.paternalHalfBrothers.title": "علاتی بھائی (باپ شریک) کتنے ہیں؟",
  "q.paternalHalfSisters.title": "علاتی بہنیں (باپ شریک) کتنی ہیں؟",
  "q.paternalHalf.help": "ایک ہی والد، مختلف والدہ سے۔ صرف حقیقی بہن بھائی، اولاد اور والد کی غیر موجودگی میں وارث ہیں۔",

  "q.maternalHalf.title": "اخیافی بہن بھائی (ماں شریک) کتنے ہیں؟",
  "q.maternalHalf.help":
    "ایک ہی والدہ، مختلف والد سے۔ صرف اولاد اور والد کی غیر موجودگی میں وارث، اور مرد و عورت کا حصہ برابر۔",

  "result.title": "تقسیم",
  "result.estate": "کل ترکہ",
  "result.heir": "وارث",
  "result.share": "حصہ",
  "result.amount": "رقم",
  "result.each": "فی فرد",
  "result.rules": "اطلاق شدہ اصول",
  "result.awl": "عَوْل کا اطلاق ہوا — مقررہ حصے ترکہ سے زیادہ ہیں، اس لیے سب میں نسبت سے کمی کی گئی۔",
  "result.radd": "رَدّ کا اطلاق ہوا — بچا ہوا حصہ مقررہ وارثوں (سوائے میاں/بیوی) میں دوبارہ تقسیم ہوا۔",
  "result.residue": "بقیہ (کوئی عصبہ موجود نہیں)",
  "result.noHeirs": "کوئی اہل وارث نہیں ملا۔",
  "result.share.fixed": "مقررہ حصہ (فروض)",
  "result.share.asabah": "عصبہ (بقیہ)",
  "result.share.umariyyatan": "والدہ کو بقیہ کا 1/3 (عمریتین)",
  "result.share.radd": "رَدّ شامل ہے",

  "heir.husband": "شوہر",
  "heir.wife": "بیوی",
  "heir.father": "والد",
  "heir.mother": "والدہ",
  "heir.son": "بیٹا",
  "heir.daughter": "بیٹی",
  "heir.fullBrother": "حقیقی بھائی",
  "heir.fullSister": "حقیقی بہن",
  "heir.paternalHalfBrother": "علاتی بھائی",
  "heir.paternalHalfSister": "علاتی بہن",
  "heir.maternalHalfSibling": "اخیافی بہن/بھائی",
};

const ar: Dict = {
  "app.name": "حاسبة الميراث",
  "app.tagline": "توزيع الميراث الإسلامي",

  "home.start": "ابدأ الحساب",
  "home.settings": "الإعدادات",
  "home.intro":
    "أجب عن بعض الأسئلة حول المتوفى والورثة. تبقى بياناتك على جهازك.",
  "home.offlineBadge": "يعمل دون إنترنت",

  "settings.title": "الإعدادات",
  "settings.language": "اللغة",
  "settings.theme": "المظهر",
  "settings.madhab": "المذهب",
  "settings.theme.system": "النظام",
  "settings.theme.light": "فاتح",
  "settings.theme.dark": "داكن",
  "settings.about": "حول التطبيق",
  "settings.about.body":
    "حاسبة الميراث تساعد المسلمين على توزيع التركة وفق الشريعة. جميع الحسابات تتم على جهازك. راجع أهل العلم في المسائل المعقدة.",
  "settings.unavailable": "قريبًا",

  "madhab.hanafi": "الحنفي",
  "madhab.shafii": "الشافعي",
  "madhab.maliki": "المالكي",
  "madhab.hanbali": "الحنبلي",

  "common.next": "التالي",
  "common.back": "السابق",
  "common.skip": "تخطٍ",
  "common.yes": "نعم",
  "common.no": "لا",
  "common.male": "ذكر",
  "common.female": "أنثى",
  "common.done": "عرض النتيجة",
  "common.startOver": "ابدأ من جديد",
  "common.close": "إغلاق",
  "common.of": "من",

  "wizard.step": "خطوة",
  "wizard.progress": "سؤال",

  "q.estate.title": "ما إجمالي التركة؟",
  "q.estate.help":
    "أدخل صافي التركة بعد تكاليف الجنازة والديون والوصايا (حتى الثلث).",
  "q.estate.placeholder": "مثال: 1000000",

  "q.gender.title": "هل المتوفى ذكر أم أنثى؟",
  "q.gender.help": "هذا يحدد أهلية الزوج أو الزوجة للميراث.",

  "q.spouse.title.male": "هل ترك المتوفى زوجة؟",
  "q.spouse.title.female": "هل تركت المتوفاة زوجًا؟",
  "q.spouse.help":
    "للزوجة الثُمن مع الفرع الوارث والربع بدونه. للزوج الربع مع الفرع الوارث والنصف بدونه.",
  "q.wives.title": "كم عدد الزوجات؟",
  "q.wives.help": "يقتسمن نصيب الزوجة بالتساوي حتى أربع.",

  "q.father.title": "هل الأب على قيد الحياة؟",
  "q.father.help": "للأب السدس مع الفرع الوارث، ويأخذ الباقي تعصيبًا مع البنات.",
  "q.mother.title": "هل الأم على قيد الحياة؟",
  "q.mother.help": "للأم السدس مع الفرع الوارث أو وجود اثنين فأكثر من الإخوة، وإلا فالثلث.",

  "q.sons.title": "كم عدد الأبناء؟",
  "q.daughters.title": "كم عدد البنات؟",
  "q.children.help": "للذكر مثل حظ الأنثيين عند اجتماعهما.",

  "q.fullBrothers.title": "كم عدد الإخوة الأشقاء؟",
  "q.fullSisters.title": "كم عدد الأخوات الشقيقات؟",
  "q.fullSiblings.help": "يرثون فقط عند انعدام الفرع الوارث والأب.",

  "q.paternalHalfBrothers.title": "كم عدد الإخوة لأب؟",
  "q.paternalHalfSisters.title": "كم عدد الأخوات لأب؟",
  "q.paternalHalf.help": "يرثون عند انعدام الإخوة الأشقاء والفرع الوارث والأب.",

  "q.maternalHalf.title": "كم عدد الإخوة لأم؟",
  "q.maternalHalf.help":
    "يرثون عند انعدام الفرع الوارث والأب، ويستوي فيهم الذكر والأنثى.",

  "result.title": "التوزيع",
  "result.estate": "إجمالي التركة",
  "result.heir": "الوارث",
  "result.share": "النصيب",
  "result.amount": "المبلغ",
  "result.each": "للفرد",
  "result.rules": "القواعد المطبقة",
  "result.awl": "تطبيق العَوْل — تجاوزت الفروض التركة فخُفّضت النِّسَب.",
  "result.radd": "تطبيق الرَّدّ — أُعيد توزيع الفائض على أصحاب الفروض دون الزوجين.",
  "result.residue": "الباقي (لا عاصب)",
  "result.noHeirs": "لا يوجد وارث مستحق.",
  "result.share.fixed": "فرض",
  "result.share.asabah": "تعصيب",
  "result.share.umariyyatan": "للأم ثلث الباقي (العمريتان)",
  "result.share.radd": "يشمل الرَّدّ",

  "heir.husband": "زوج",
  "heir.wife": "زوجة",
  "heir.father": "أب",
  "heir.mother": "أم",
  "heir.son": "ابن",
  "heir.daughter": "بنت",
  "heir.fullBrother": "أخ شقيق",
  "heir.fullSister": "أخت شقيقة",
  "heir.paternalHalfBrother": "أخ لأب",
  "heir.paternalHalfSister": "أخت لأب",
  "heir.maternalHalfSibling": "أخ/أخت لأم",
};

const dictionaries: Record<LanguageCode, Dict> = { en, ur, ar };

export function t(lang: LanguageCode, key: string): string {
  return dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
}

export function isRTL(lang: LanguageCode): boolean {
  return lang === "ur" || lang === "ar";
}
