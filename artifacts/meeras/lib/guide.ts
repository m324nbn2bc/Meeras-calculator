export type MadhabFilter = 'all' | 'hanafi' | 'shafii' | 'maliki' | 'hanbali';

export interface ShareScenario {
  condKey: string;
  fractionKey: string;
}

export interface MadhabNote {
  madhabs: ('hanafi' | 'shafii' | 'maliki' | 'hanbali')[];
  noteKey: string;
}

export interface GuideHeirEntry {
  heirId: string;
  arabicName: string;
  type: 'zawilFurud' | 'asabah';
  scenarios: ShareScenario[];
  blockerIds: string[];
  madhabNotes: MadhabNote[];
  hasMadhabDiff: boolean;
}

export interface TextBlock {
  titleKey: string;
  bodyKey: string;
  exampleKey?: string;
  madhabNotes?: MadhabNote[];
}

export interface LadderRung {
  priority: number;
  labelKey: string;
  heirIds: string[];
  noteKey: string;
  madhabNotes?: MadhabNote[];
}

export interface ComparisonRow {
  topicKey: string;
  hanafiKey: string;
  shafiiKey: string;
  malikiKey: string;
  hanbaliKey: string;
}

export interface GuideChapter {
  key: string;
  type?: 'heirs' | 'narrative' | 'ladder' | 'comparison';
  titleKey: string;
  descKey: string;
  entries?: GuideHeirEntry[];
  blocks?: TextBlock[];
  rungs?: LadderRung[];
  rows?: ComparisonRow[];
}

export const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    key: 'foundations',
    type: 'narrative',
    titleKey: 'guide.chapter.foundations',
    descKey: 'guide.chapter.foundations.desc',
    blocks: [
      {
        titleKey: 'guide.foundations.order.title',
        bodyKey: 'guide.foundations.order.body',
        exampleKey: 'guide.foundations.order.example',
      },
      {
        titleKey: 'guide.foundations.sources.title',
        bodyKey: 'guide.foundations.sources.body',
      },
      {
        titleKey: 'guide.foundations.classes.title',
        bodyKey: 'guide.foundations.classes.body',
      },
    ],
  },
  {
    key: 'zawilFurud',
    type: 'heirs',
    titleKey: 'guide.chapter.zawilFurud',
    descKey: 'guide.chapter.zawilFurud.desc',
    entries: [
      {
        heirId: 'husband',
        arabicName: 'الزوج',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.husband.c1', fractionKey: 'guide.frac.half' },
          { condKey: 'guide.husband.c2', fractionKey: 'guide.frac.quarter' },
        ],
        blockerIds: [],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
      {
        heirId: 'wife',
        arabicName: 'الزوجة',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.wife.c1', fractionKey: 'guide.frac.quarter' },
          { condKey: 'guide.wife.c2', fractionKey: 'guide.frac.eighth' },
        ],
        blockerIds: [],
        madhabNotes: [
          { madhabs: ['hanafi', 'shafii', 'hanbali'], noteKey: 'guide.diff.radd.sunni3' },
          { madhabs: ['maliki'], noteKey: 'guide.diff.radd.maliki' },
        ],
        hasMadhabDiff: true,
      },
      {
        heirId: 'father',
        arabicName: 'الأب',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.father.c1', fractionKey: 'guide.frac.sixth' },
          { condKey: 'guide.father.c2', fractionKey: 'guide.frac.sixthPlusAsabah' },
          { condKey: 'guide.father.c3', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: [],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
      {
        heirId: 'mother',
        arabicName: 'الأم',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.mother.c1', fractionKey: 'guide.frac.third' },
          { condKey: 'guide.mother.c2', fractionKey: 'guide.frac.sixth' },
          { condKey: 'guide.mother.c3', fractionKey: 'guide.frac.sixth' },
          { condKey: 'guide.mother.c4', fractionKey: 'guide.frac.thirdRemainder' },
        ],
        blockerIds: [],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
      {
        heirId: 'paternalGrandfather',
        arabicName: 'الجدّ الصحيح',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.pgf.c1', fractionKey: 'guide.frac.sixth' },
          { condKey: 'guide.pgf.c2', fractionKey: 'guide.frac.sixthPlusAsabah' },
          { condKey: 'guide.pgf.c3', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: ['father'],
        madhabNotes: [
          { madhabs: ['hanafi'], noteKey: 'guide.diff.grandfather.hanafi' },
          { madhabs: ['shafii', 'maliki', 'hanbali'], noteKey: 'guide.diff.grandfather.others' },
        ],
        hasMadhabDiff: true,
      },
      {
        heirId: 'maternalGrandmother',
        arabicName: 'الجدّة لأمّ',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.mgranny.c1', fractionKey: 'guide.frac.sixth' },
          { condKey: 'guide.mgranny.c2', fractionKey: 'guide.frac.twelfth' },
        ],
        blockerIds: ['mother'],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
      {
        heirId: 'paternalGrandmother',
        arabicName: 'الجدّة لأب',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.pgranny.c1', fractionKey: 'guide.frac.sixth' },
          { condKey: 'guide.pgranny.c2', fractionKey: 'guide.frac.twelfth' },
        ],
        blockerIds: ['mother', 'father', 'paternalGrandfather'],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
      {
        heirId: 'daughter',
        arabicName: 'البنت',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.daughter.c1', fractionKey: 'guide.frac.half' },
          { condKey: 'guide.daughter.c2', fractionKey: 'guide.frac.twoThirds' },
          { condKey: 'guide.daughter.c3', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: [],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
      {
        heirId: 'granddaughter',
        arabicName: 'بنت الابن',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.granddaughter.c1', fractionKey: 'guide.frac.half' },
          { condKey: 'guide.granddaughter.c2', fractionKey: 'guide.frac.twoThirds' },
          { condKey: 'guide.granddaughter.c3', fractionKey: 'guide.frac.sixth' },
          { condKey: 'guide.granddaughter.c4', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: ['son'],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
      {
        heirId: 'fullSister',
        arabicName: 'الأخت الشقيقة',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.fullSister.c1', fractionKey: 'guide.frac.half' },
          { condKey: 'guide.fullSister.c2', fractionKey: 'guide.frac.twoThirds' },
          { condKey: 'guide.fullSister.c3', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: ['son', 'grandson', 'father', 'paternalGrandfather'],
        madhabNotes: [
          { madhabs: ['hanafi'], noteKey: 'guide.diff.grandfather.hanafi' },
          { madhabs: ['shafii', 'maliki', 'hanbali'], noteKey: 'guide.diff.grandfather.others' },
          { madhabs: ['hanafi'], noteKey: 'guide.diff.mushtarakah.hanafi' },
          { madhabs: ['shafii', 'maliki'], noteKey: 'guide.diff.mushtarakah.others' },
        ],
        hasMadhabDiff: true,
      },
      {
        heirId: 'paternalHalfSister',
        arabicName: 'الأخت لأب',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.consSister.c1', fractionKey: 'guide.frac.half' },
          { condKey: 'guide.consSister.c2', fractionKey: 'guide.frac.twoThirds' },
          { condKey: 'guide.consSister.c3', fractionKey: 'guide.frac.sixth' },
          { condKey: 'guide.consSister.c4', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: ['son', 'grandson', 'father', 'paternalGrandfather', 'fullBrother'],
        madhabNotes: [
          { madhabs: ['hanafi'], noteKey: 'guide.diff.grandfather.hanafi' },
          { madhabs: ['shafii', 'maliki', 'hanbali'], noteKey: 'guide.diff.grandfather.others' },
        ],
        hasMadhabDiff: true,
      },
      {
        heirId: 'maternalHalfSibling',
        arabicName: 'الأخ / الأخت لأمّ',
        type: 'zawilFurud',
        scenarios: [
          { condKey: 'guide.uterine.c1', fractionKey: 'guide.frac.sixth' },
          { condKey: 'guide.uterine.c2', fractionKey: 'guide.frac.third' },
        ],
        blockerIds: ['son', 'daughter', 'grandson', 'granddaughter', 'father', 'paternalGrandfather'],
        madhabNotes: [
          { madhabs: ['hanafi'], noteKey: 'guide.diff.uterine.hanafi' },
          { madhabs: ['shafii', 'maliki', 'hanbali'], noteKey: 'guide.diff.uterine.others' },
          { madhabs: ['hanafi'], noteKey: 'guide.diff.mushtarakah.hanafi' },
          { madhabs: ['shafii', 'maliki'], noteKey: 'guide.diff.mushtarakah.others' },
        ],
        hasMadhabDiff: true,
      },
    ],
  },
  {
    key: 'asabah',
    type: 'heirs',
    titleKey: 'guide.chapter.asabah',
    descKey: 'guide.chapter.asabah.desc',
    entries: [
      {
        heirId: 'son',
        arabicName: 'الابن',
        type: 'asabah',
        scenarios: [
          { condKey: 'guide.son.c1', fractionKey: 'guide.frac.allEstate' },
          { condKey: 'guide.son.c2', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: [],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
      {
        heirId: 'grandson',
        arabicName: 'ابن الابن',
        type: 'asabah',
        scenarios: [
          { condKey: 'guide.grandson.c1', fractionKey: 'guide.frac.allEstate' },
          { condKey: 'guide.grandson.c2', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: ['son'],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
      {
        heirId: 'fullBrother',
        arabicName: 'الأخ الشقيق',
        type: 'asabah',
        scenarios: [
          { condKey: 'guide.fullBrother.c1', fractionKey: 'guide.frac.asabah' },
          { condKey: 'guide.fullBrother.c2', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: ['son', 'grandson', 'father', 'paternalGrandfather'],
        madhabNotes: [
          { madhabs: ['hanafi'], noteKey: 'guide.diff.mushtarakah.hanafi' },
          { madhabs: ['shafii', 'maliki'], noteKey: 'guide.diff.mushtarakah.others' },
          { madhabs: ['hanafi'], noteKey: 'guide.diff.grandfather.hanafi' },
          { madhabs: ['shafii', 'maliki', 'hanbali'], noteKey: 'guide.diff.grandfather.others' },
        ],
        hasMadhabDiff: true,
      },
      {
        heirId: 'paternalHalfBrother',
        arabicName: 'الأخ لأب',
        type: 'asabah',
        scenarios: [
          { condKey: 'guide.consBrother.c1', fractionKey: 'guide.frac.asabah' },
          { condKey: 'guide.consBrother.c2', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: ['son', 'grandson', 'father', 'paternalGrandfather', 'fullBrother'],
        madhabNotes: [
          { madhabs: ['hanafi'], noteKey: 'guide.diff.grandfather.hanafi' },
          { madhabs: ['shafii', 'maliki', 'hanbali'], noteKey: 'guide.diff.grandfather.others' },
        ],
        hasMadhabDiff: true,
      },
      {
        heirId: 'fullBrothersSon',
        arabicName: 'ابن الأخ فأسفل (السلسلة)',
        type: 'asabah',
        scenarios: [
          { condKey: 'guide.extended.c1', fractionKey: 'guide.frac.asabah' },
        ],
        blockerIds: ['son', 'grandson', 'father', 'paternalGrandfather', 'fullBrother', 'paternalHalfBrother'],
        madhabNotes: [],
        hasMadhabDiff: false,
      },
    ],
  },
  {
    key: 'awlRadd',
    type: 'narrative',
    titleKey: 'guide.chapter.awlRadd',
    descKey: 'guide.chapter.awlRadd.desc',
    blocks: [
      {
        titleKey: 'guide.awlRadd.awl.title',
        bodyKey: 'guide.awlRadd.awl.body',
      },
      {
        titleKey: 'guide.awlRadd.awlCases.title',
        bodyKey: 'guide.awlRadd.awlCases.body',
      },
      {
        titleKey: 'guide.awlRadd.radd.title',
        bodyKey: 'guide.awlRadd.radd.body',
        exampleKey: 'guide.awlRadd.radd.example',
        madhabNotes: [
          { madhabs: ['hanafi', 'shafii', 'hanbali'], noteKey: 'guide.diff.radd.sunni3' },
          { madhabs: ['maliki'], noteKey: 'guide.diff.radd.maliki' },
        ],
      },
    ],
  },
  {
    key: 'hajb',
    type: 'ladder',
    titleKey: 'guide.chapter.hajb',
    descKey: 'guide.chapter.hajb.desc',
    rungs: [
      {
        priority: 1,
        labelKey: 'guide.hajb.tier1.label',
        heirIds: ['husband', 'wife', 'son', 'daughter', 'father', 'mother'],
        noteKey: 'guide.hajb.tier1.note',
      },
      {
        priority: 2,
        labelKey: 'guide.hajb.tier2.label',
        heirIds: ['paternalGrandfather', 'maternalGrandmother', 'paternalGrandmother', 'grandson', 'granddaughter'],
        noteKey: 'guide.hajb.tier2.note',
      },
      {
        priority: 3,
        labelKey: 'guide.hajb.tier3.label',
        heirIds: ['fullBrother', 'fullSister'],
        noteKey: 'guide.hajb.tier3.note',
        madhabNotes: [
          { madhabs: ['hanafi'], noteKey: 'guide.diff.hajb.hanafi' },
          { madhabs: ['shafii', 'maliki', 'hanbali'], noteKey: 'guide.diff.hajb.others' },
        ],
      },
      {
        priority: 4,
        labelKey: 'guide.hajb.tier4.label',
        heirIds: ['paternalHalfBrother', 'paternalHalfSister'],
        noteKey: 'guide.hajb.tier4.note',
      },
      {
        priority: 5,
        labelKey: 'guide.hajb.tier5.label',
        heirIds: ['maternalHalfSibling'],
        noteKey: 'guide.hajb.tier5.note',
      },
      {
        priority: 6,
        labelKey: 'guide.hajb.tier6.label',
        heirIds: ['fullBrothersSon', 'paternalHalfBrothersSon', 'fullPaternalUncle', 'paternalHalfPaternalUncle', 'fullPaternalUnclesSon', 'paternalHalfPaternalUnclesSon'],
        noteKey: 'guide.hajb.tier6.note',
      },
    ],
  },
  {
    key: 'madhabMatrix',
    type: 'comparison',
    titleKey: 'guide.chapter.madhabMatrix',
    descKey: 'guide.chapter.madhabMatrix.desc',
    rows: [
      {
        topicKey: 'guide.matrix.pgfSiblings.topic',
        hanafiKey: 'guide.matrix.pgfSiblings.hanafi',
        shafiiKey: 'guide.matrix.pgfSiblings.others',
        malikiKey: 'guide.matrix.pgfSiblings.others',
        hanbaliKey: 'guide.matrix.pgfSiblings.others',
      },
      {
        topicKey: 'guide.matrix.uterinePgf.topic',
        hanafiKey: 'guide.matrix.uterinePgf.hanafi',
        shafiiKey: 'guide.matrix.uterinePgf.review',
        malikiKey: 'guide.matrix.uterinePgf.review',
        hanbaliKey: 'guide.matrix.uterinePgf.review',
      },
      {
        topicKey: 'guide.matrix.akdariyyah.topic',
        hanafiKey: 'guide.matrix.akdariyyah.hanafi',
        shafiiKey: 'guide.matrix.akdariyyah.shafiiMaliki',
        malikiKey: 'guide.matrix.akdariyyah.shafiiMaliki',
        hanbaliKey: 'guide.matrix.akdariyyah.hanbali',
      },
      {
        topicKey: 'guide.matrix.mushtarakah.topic',
        hanafiKey: 'guide.matrix.mushtarakah.hanafi',
        shafiiKey: 'guide.matrix.mushtarakah.shafiiMaliki',
        malikiKey: 'guide.matrix.mushtarakah.shafiiMaliki',
        hanbaliKey: 'guide.matrix.mushtarakah.hanafi',
      },
      {
        topicKey: 'guide.matrix.radd.topic',
        hanafiKey: 'guide.matrix.radd.hanafi',
        shafiiKey: 'guide.matrix.radd.shafii',
        malikiKey: 'guide.matrix.radd.maliki',
        hanbaliKey: 'guide.matrix.radd.hanbali',
      },
      {
        topicKey: 'guide.matrix.dhawilArham.topic',
        hanafiKey: 'guide.matrix.dhawilArham.hanafi',
        shafiiKey: 'guide.matrix.dhawilArham.shafiiMaliki',
        malikiKey: 'guide.matrix.dhawilArham.shafiiMaliki',
        hanbaliKey: 'guide.matrix.dhawilArham.hanbali',
      },
    ],
  },
  {
    key: 'famousCases',
    type: 'narrative',
    titleKey: 'guide.chapter.famousCases',
    descKey: 'guide.chapter.famousCases.desc',
    blocks: [
      {
        titleKey: 'guide.famous.umariyyatain.title',
        bodyKey: 'guide.famous.umariyyatain.body',
        exampleKey: 'guide.famous.umariyyatain.example',
      },
      {
        titleKey: 'guide.famous.akdariyyah.title',
        bodyKey: 'guide.famous.akdariyyah.body',
        exampleKey: 'guide.famous.akdariyyah.example',
        madhabNotes: [
          { madhabs: ['hanafi'], noteKey: 'guide.matrix.akdariyyah.hanafi' },
          { madhabs: ['shafii', 'maliki'], noteKey: 'guide.matrix.akdariyyah.shafiiMaliki' },
          { madhabs: ['hanbali'], noteKey: 'guide.matrix.akdariyyah.hanbali' },
        ],
      },
      {
        titleKey: 'guide.famous.mushtarakah.title',
        bodyKey: 'guide.famous.mushtarakah.body',
        exampleKey: 'guide.famous.mushtarakah.example',
        madhabNotes: [
          { madhabs: ['hanafi', 'hanbali'], noteKey: 'guide.matrix.mushtarakah.hanafi' },
          { madhabs: ['shafii', 'maliki'], noteKey: 'guide.matrix.mushtarakah.shafiiMaliki' },
        ],
      },
      {
        titleKey: 'guide.famous.mimbariyyah.title',
        bodyKey: 'guide.famous.mimbariyyah.body',
        exampleKey: 'guide.famous.mimbariyyah.example',
      },
    ],
  },
  {
    key: 'impediments',
    type: 'narrative',
    titleKey: 'guide.chapter.impediments',
    descKey: 'guide.chapter.impediments.desc',
    blocks: [
      {
        titleKey: 'guide.impediments.religion.title',
        bodyKey: 'guide.impediments.religion.body',
      },
      {
        titleKey: 'guide.impediments.murder.title',
        bodyKey: 'guide.impediments.murder.body',
      },
      {
        titleKey: 'guide.impediments.slavery.title',
        bodyKey: 'guide.impediments.slavery.body',
      },
    ],
  },
];
