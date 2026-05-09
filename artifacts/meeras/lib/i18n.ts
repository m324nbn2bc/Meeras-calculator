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
  "home.about": "About",
  "home.intro":
    "Answer a few questions about the deceased and surviving heirs. Your data stays on your device.",
  "home.offlineBadge": "Works fully offline",
  "home.cases": "Browse Classical Scenarios",

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
    "Enter the gross estate — total assets owned. You can deduct funeral expenses, debts, and wasiyyah in the next step. This field is optional.",
  "q.estate.placeholder": "e.g. 1000000",
  "q.estate.skip": "Skip — calculate shares only",

  // ── Deductions ──
  "q.deductions.title": "Estate deductions",
  "q.deductions.help":
    "Settle these obligations in order before distributing the inheritance. All fields are optional.",
  "q.funeral.label": "Funeral & burial expenses",
  "q.funeral.help": "تجہیز و تکفین — deducted first",
  "q.debts.label": "Debts owed by the deceased",
  "q.debts.help": "قرض جو میت پر ہے — deducted from the estate",
  "q.receivables.label": "Debts owed to the deceased",
  "q.receivables.help":
    "میت کا کسی دوسرے پر قرض — added back to the estate",
  "q.wasiyyah.label": "Wasiyyah (bequest)",
  "q.wasiyyah.help": "Optional bequest — capped at 1/3 of estate after debts",
  "q.wasiyyah.capped": "Capped to 1/3",
  "deductions.gross": "Gross estate",
  "deductions.funeral": "Funeral expenses",
  "deductions.debts": "Debts owed",
  "deductions.receivables": "Receivables",
  "deductions.wasiyyah": "Wasiyyah",
  "deductions.net": "Net estate for distribution",
  "deductions.netNote": "This amount will be divided among the heirs",

  "q.gender.title": "Was the deceased male or female?",
  "q.gender.help": "This determines whether a husband or wife may inherit.",

  "q.spouse.title.male": "Did the deceased leave a wife?",
  "q.spouse.title.female": "Did the deceased leave a husband?",
  "q.spouse.help":
    "A wife inherits 1/8 with descendants, 1/4 without. A husband inherits 1/4 with descendants, 1/2 without.",
  "q.wives.title": "How many wives?",
  "q.wives.help": "Up to four wives share the spouse's portion equally.",

  "q.father.title": "Is the father alive?",
  "q.father.help":
    "The father inherits 1/6 with male descendants, 1/6 plus the remainder with only female descendants, and the entire residue if no descendants exist.",
  "q.pgf.title": "Is the paternal grandfather alive?",
  "q.pgf.help":
    "Father's father. Inherits like the father when the father is absent. Excluded if the father is alive.",
  "q.mother.title": "Is the mother alive?",
  "q.mother.help":
    "The mother inherits 1/6 with descendants or two or more siblings, otherwise 1/3 (or 1/3 of the remainder in the Umariyyatain case).",
  "q.mGranny.title": "Is the maternal grandmother alive?",
  "q.mGranny.help":
    "Mother's mother. Inherits 1/6 (shared with paternal grandmother if both alive). Excluded only by the mother.",
  "q.pGranny.title": "Is the paternal grandmother alive?",
  "q.pGranny.help":
    "Father's mother. Inherits 1/6 (shared with maternal grandmother if both alive). Excluded by mother, father, or paternal grandfather.",

  "q.sons.title": "How many sons?",
  "q.daughters.title": "How many daughters?",
  "q.children.help": "Sons receive twice the share of daughters when both are present.",
  "q.grandsons.title": "How many grandsons (son's sons)?",
  "q.granddaughters.title": "How many granddaughters (son's daughters)?",
  "q.grandchildren.help":
    "Children of a predeceased son. Excluded entirely if the deceased has a living son.",

  "q.fullBrothers.title": "How many full brothers?",
  "q.fullSisters.title": "How many full sisters?",
  "q.fullSiblings.help":
    "Same father AND same mother. Excluded by son, grandson, father, or paternal grandfather.",

  "q.consBrothers.title": "How many consanguine brothers (paternal half)?",
  "q.consSisters.title": "How many consanguine sisters (paternal half)?",
  "q.consSiblings.help":
    "Same father, different mother. Excluded by son, grandson, father, paternal grandfather, full brother, or two or more full sisters.",

  "q.uterineSibs.title": "How many uterine siblings (maternal half)?",
  "q.uterineSibs.help":
    "Same mother, different father. Excluded by any descendant, father, or paternal grandfather. Male and female share equally.",

  "q.fullNephews.title": "How many full brother's sons (nephews)?",
  "q.consNephews.title": "How many consanguine brother's sons?",
  "q.fullUncles.title": "How many full paternal uncles?",
  "q.consUncles.title": "How many consanguine paternal uncles?",
  "q.fullCousins.title": "How many full paternal uncle's sons (cousins)?",
  "q.consCousins.title": "How many consanguine paternal uncle's sons?",
  "q.extended.help":
    "Extended residuary heir. Inherits the remainder only when no closer male relative is alive.",

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
  "result.share.umariyyatan": "Mother takes 1/3 of remainder (Umariyyatain)",
  "result.share.radd": "Includes redistribution (Radd)",
  "result.share.asabahMaaGhayrihi": "Residuary with daughters (Asabah ma'a Ghayrihi)",
  "result.exclusions": "Excluded heirs",

  "heir.husband": "Husband",
  "heir.wife": "Wife",
  "heir.father": "Father",
  "heir.mother": "Mother",
  "heir.paternalGrandfather": "Paternal grandfather",
  "heir.maternalGrandmother": "Maternal grandmother",
  "heir.paternalGrandmother": "Paternal grandmother",
  "heir.son": "Son",
  "heir.daughter": "Daughter",
  "heir.grandson": "Grandson",
  "heir.granddaughter": "Granddaughter",
  "heir.fullBrother": "Full brother",
  "heir.fullSister": "Full sister",
  "heir.paternalHalfBrother": "Consanguine brother",
  "heir.paternalHalfSister": "Consanguine sister",
  "heir.maternalHalfSibling": "Uterine sibling",
  "heir.fullBrothersSon": "Full brother's son",
  "heir.paternalHalfBrothersSon": "Consanguine brother's son",
  "heir.fullPaternalUncle": "Full paternal uncle",
  "heir.paternalHalfPaternalUncle": "Consanguine paternal uncle",
  "heir.fullPaternalUnclesSon": "Full paternal uncle's son",
  "heir.paternalHalfPaternalUnclesSon": "Consanguine paternal uncle's son",

  // Reasons (short scholarly notes shown under each share)
  "reason.husband.withDesc": "1/4 — descendant exists",
  "reason.husband.noDesc": "1/2 — no descendant",
  "reason.wife.withDesc": "1/8 — descendant exists, shared equally",
  "reason.wife.noDesc": "1/4 — no descendant, shared equally",
  "reason.mother.umariyyatain": "Umariyyatain — 1/3 of the remainder after the spouse",
  "reason.mother.withDesc": "1/6 — descendant exists",
  "reason.mother.withSiblings": "1/6 — two or more siblings present",
  "reason.mother.alone": "1/3 — no descendant or multiple siblings",
  "reason.father.withMaleDesc": "1/6 — male descendant exists",
  "reason.father.withFemaleDesc": "1/6 fixed plus the remainder as Asabah",
  "reason.father.asabah": "Pure Asabah — no descendant",
  "reason.pgf.withMaleDesc": "1/6 — male descendant exists (acts as father)",
  "reason.pgf.withFemaleDesc": "1/6 fixed plus the remainder as Asabah",
  "reason.pgf.asabah": "Pure Asabah — no descendant or father",
  "reason.granny.shared": "1/6 shared — both grandmothers present",
  "reason.granny.solo": "1/6 — sole eligible grandmother",
  "reason.daughter.solo": "1/2 — sole daughter, no son",
  "reason.daughter.multiple": "2/3 shared — multiple daughters, no son",
  "reason.granddaughter.solo": "1/2 — sole granddaughter, no son or 2+ daughters",
  "reason.granddaughter.multiple": "2/3 shared — multiple granddaughters",
  "reason.granddaughter.complete": "1/6 — completes 2/3 with the single daughter",
  "reason.uterine.solo": "1/6 — sole uterine sibling",
  "reason.uterine.multiple": "1/3 shared equally regardless of gender",
  "reason.fullSister.solo": "1/2 — sole full sister",
  "reason.fullSister.multiple": "2/3 shared — multiple full sisters",
  "reason.fullSister.maaGhayrihi": "Becomes Asabah with daughters/granddaughters",
  "reason.consSister.solo": "1/2 — sole consanguine sister",
  "reason.consSister.multiple": "2/3 shared — multiple consanguine sisters",
  "reason.consSister.complete": "1/6 — completes 2/3 with the single full sister",
  "reason.consSister.maaGhayrihi": "Becomes Asabah with daughters/granddaughters",
  "reason.son.asabah": "Asabah — son with daughters in 2:1 ratio",
  "reason.grandson.asabah": "Asabah — grandson with granddaughters in 2:1 ratio",
  "reason.fullBrother.asabah": "Asabah — brother with sister in 2:1 ratio",
  "reason.consBrother.asabah": "Asabah — consanguine brother with sister in 2:1 ratio",
  "reason.fullNephew.asabah": "Asabah — extended residuary",
  "reason.consNephew.asabah": "Asabah — extended residuary",
  "reason.fullUncle.asabah": "Asabah — extended residuary",
  "reason.consUncle.asabah": "Asabah — extended residuary",
  "reason.fullCousin.asabah": "Asabah — extended residuary",
  "reason.consCousin.asabah": "Asabah — extended residuary",

  // Exclusion reasons
  "ex.pgf.byFather": "Excluded by the father",
  "ex.mGranny.byMother": "Excluded by the mother",
  "ex.pGranny.byMother": "Excluded by the mother",
  "ex.pGranny.byFather": "Excluded by the father",
  "ex.pGranny.byPGF": "Excluded by the paternal grandfather",
  "ex.granddaughter.bySon": "Excluded by the son",
  "ex.granddaughter.byTwoDaughters": "Excluded by two or more daughters (no grandson)",
  "ex.grandson.bySon": "Excluded by the son",
  "ex.uterine.byBlocker": "Excluded by descendant, father, or grandfather",
  "ex.fullSibling.byBlocker": "Excluded by son, grandson, father, or grandfather",
  "ex.consSibling.byBlocker": "Excluded by closer relative",
  "ex.asabah.byCloser": "Excluded by a closer male residuary",

  // ── Case Library ──
  "cases.title": "Classical Scenarios",
  "cases.subtitle": "Tap a case to see the engine's calculation",
  "cases.search": "Search cases…",

  "category.famous": "Famous Classical Cases",
  "category.basic": "Basic Scenarios",
  "category.umariyyatain": "Umariyyatain",
  "category.awl": "'Awl — Proportional Reduction",
  "category.radd": "Radd — Return of Surplus",
  "category.asabah": "Asabah (Residuaries)",
  "category.grandmother": "Grandmother Cases",

  "case.badge.famous": "Famous",
  "case.badge.verified": "Verified ✓",

  "case.mimbariyyah.name": "Mimbariyyah",
  "case.mimbariyyah.desc": "Wife · 2 Daughters · Father · Mother",
  "case.mimbariyyah.note":
    "One of the most celebrated 'Awl cases. Caliph 'Alī ibn Abī Ṭālib (RA) calculated it while delivering a sermon (mimbar). Fixed shares sum to 27/24, so all are scaled down proportionally. The wife famously ends up with 1/9.",

  "case.mushtarakah.name": "Mushtarakah (المشتركة)",
  "case.mushtarakah.desc": "Husband · Mother · 2 Full Brothers · 1 Uterine Sibling",
  "case.mushtarakah.desc2": "(Deceased female)",
  "case.mushtarakah.note":
    "A famous scholarly debate. In Hanafi (and the view of Ibn Mas'ūd RA), the full brothers are Asabah and inherit the residue (1/6 split among them). In the Mālikī/Shāfi'ī 'Mushtarakah' ruling, full brothers are treated as uterine siblings and share the 1/3 with them. This app shows the Hanafi result.",

  "case.umariyyatainH.name": "Umariyyatain — with Husband",
  "case.umariyyatainH.desc": "Husband · Father · Mother  (no children)",
  "case.umariyyatainH.note":
    "The first of the two 'Umariyyatain' cases, named after Caliph 'Umar ibn al-Khaṭṭāb (RA) who ruled that the mother receives 1/3 of the REMAINDER (after the husband's share), not 1/3 of the whole estate. Father receives the rest as Asabah.",

  "case.umariyyatainW.name": "Umariyyatain — with Wife",
  "case.umariyyatainW.desc": "Wife · Father · Mother  (no children)",
  "case.umariyyatainW.note":
    "The second Umariyyatain case. Wife takes 1/4, mother takes 1/3 of the remaining 3/4 (= 1/4), and father takes the rest (1/2) as Asabah. Without 'Umar's ruling, mother would get 1/3 of the total — which Zayd ibn Thābit also held — but the ruling of 'Umar is the dominant view.",

  "case.akdariyyah.name": "Akdariyyah — Hanafi View",
  "case.akdariyyah.desc": "Husband · Mother · Paternal Grandfather · Full Sister  (deceased female)",
  "case.akdariyyah.note":
    "The 'most complicated case' in Islamic inheritance. In Hanafi, the grandfather fully excludes the sister (she gets nothing). In Mālikī/Shāfi'ī, the grandfather and sister combine their shares and re-divide in a 2:1 ratio — leading to fractions like 2/27 for the sister. This is a clear Madhab-difference case; this app shows the Hanafi result.",

  "case.sonDaughter.name": "Son and Daughter Together",
  "case.sonDaughter.desc": "Wife · 1 Son · 1 Daughter",
  "case.sonDaughter.note":
    "Classic 'For the male the equivalent of the share of two females' (Qur'an 4:11). The son and daughter together inherit the residue in a 2:1 ratio after the wife's fixed share.",

  "case.fatherOnly.name": "Father Alone",
  "case.fatherOnly.desc": "Father (sole heir)",
  "case.fatherOnly.note":
    "When the father is the sole survivor he inherits the entire estate as pure Asabah. No fixed share is assigned — he simply takes the whole remainder.",

  "case.twoDaughtersParents.name": "Two Daughters with Both Parents",
  "case.twoDaughtersParents.desc": "2 Daughters · Father · Mother",
  "case.twoDaughtersParents.note":
    "Daughters get 2/3, mother 1/6, father 1/6 fixed — but father also takes Asabah (the remainder). Here the fixed shares sum to exactly 1 leaving nothing for Asabah, so father ends up with only 1/6.",

  "case.motherOnly.name": "Mother Alone",
  "case.motherOnly.desc": "Mother (sole heir)",
  "case.motherOnly.note":
    "Mother's Furudh is 1/3. Since there is no Asabah heir, Radd applies under Hanafi — the surplus 2/3 is returned to the mother, making her the sole inheritor of the full estate.",

  "case.fourWives.name": "Four Wives and a Son",
  "case.fourWives.desc": "4 Wives · 1 Son",
  "case.fourWives.note":
    "With a descendant (the son), all four wives collectively receive 1/8 of the estate, divided equally among them (1/32 each). The son inherits the remaining 7/8 as Asabah.",

  "case.siblingsOnly.name": "Siblings Only (no parents or children)",
  "case.siblingsOnly.desc": "1 Full Brother · 2 Full Sisters",
  "case.siblingsOnly.note":
    "With no male ascendants or descendants, full siblings inherit as Asabah in the 2:1 ratio. The brother gets 1/2 and each sister gets 1/4.",

  "case.awlH2DM.name": "'Awl — Husband, 2 Daughters, Mother",
  "case.awlH2DM.desc": "Husband · 2 Daughters · Mother  (deceased female)",
  "case.awlH2DM.note":
    "Fixed shares: Husband 1/4 + 2 Daughters 2/3 + Mother 1/6 = 13/12. 'Awl scales all shares down so they fit within 1. The new denominator is 13.",

  "case.awlHF2S.name": "'Awl — Husband, Full Sisters, Mother",
  "case.awlHF2S.desc": "Husband · 2 Full Sisters · Mother  (deceased female)",
  "case.awlHF2S.note":
    "Husband 1/2 + 2 Full Sisters 2/3 + Mother 1/6 = 8/6. 'Awl increases the denominator to 8. A widely-taught example in Faraid textbooks.",

  "case.awlH2DFM.name": "Mimbariyyah (detailed)",
  "case.awlH2DFM.desc": "Wife · 2 Daughters · Father · Mother",
  "case.awlH2DFM.note":
    "Same as the Mimbariyyah case. Wife 1/8 + 2 Daughters 2/3 + Father 1/6 + Mother 1/6 = 27/24. 'Awl to 27.",

  "case.raddDM.name": "Radd — Daughter and Mother",
  "case.raddDM.desc": "1 Daughter · Mother  (no Asabah)",
  "case.raddDM.note":
    "Daughter 1/2 + Mother 1/6 = 2/3, leaving 1/3 unclaimed with no Asabah. Under Hanafi Radd, the surplus returns proportionally to the quota heirs (excluding spouse). Daughter:Mother ratio is 3:1, so daughter ends up with 3/4 and mother 1/4.",

  "case.radd2DM.name": "Radd — Two Daughters and Mother",
  "case.radd2DM.desc": "2 Daughters · Mother  (no Asabah)",
  "case.radd2DM.note":
    "2 Daughters 2/3 + Mother 1/6 = 5/6, surplus 1/6 returned proportionally (4:1 ratio). Daughters end up with 4/5 collectively and mother 1/5.",

  "case.raddHD.name": "Radd — Husband and Daughter",
  "case.raddHD.desc": "Husband · Daughter  (deceased female, no Asabah)",
  "case.raddHD.note":
    "Husband 1/4 (with descendant) + Daughter 1/2 = 3/4. Surplus 1/4 with no Asabah. Under Hanafi, Radd applies only to non-spouse heirs — so the entire surplus goes back to the daughter alone. Husband keeps exactly 1/4.",

  "case.raddUterine.name": "Radd — Husband and Uterine Siblings",
  "case.raddUterine.desc": "Husband · 2 Uterine Siblings  (deceased female)",
  "case.raddUterine.note":
    "Husband 1/2 + 2 uterine siblings 1/3 = 5/6. Surplus 1/6 returned only to uterine siblings (spouse excluded from Radd). Uterine siblings end up with 1/3 + 1/6 = 1/2.",

  "case.grandsonAsabah.name": "Grandson When Son is Absent",
  "case.grandsonAsabah.desc": "Wife · Grandson · Granddaughter  (no son)",
  "case.grandsonAsabah.note":
    "The grandson steps into the son's role when no son survives. Wife gets 1/8 (descendants present) and the grandson and granddaughter share the residue 7/8 in a 2:1 ratio.",

  "case.granddaughterComplete.name": "Granddaughter Completes 2/3",
  "case.granddaughterComplete.desc": "1 Daughter · 1 Granddaughter · Mother  (no son)",
  "case.granddaughterComplete.note":
    "The single daughter takes 1/2 (her Furudh). The female descendants' cap is 2/3, so the granddaughter(s) collectively receive the remaining 1/6. Mother gets 1/6. Radd distributes the surplus proportionally.",

  "case.sisterMaaGhayrihi.name": "Full Sister Becomes Asabah with Daughter",
  "case.sisterMaaGhayrihi.desc": "1 Daughter · 1 Full Sister  (no brother)",
  "case.sisterMaaGhayrihi.note":
    "With a daughter but no son or brother, the full sister becomes 'Asabah ma'a Ghayrihi' — she acts like a residuary and takes the entire remainder (1/2) after the daughter's fixed share. A unique ruling that prevents the estate from going to Bayt al-Māl.",

  "case.consSisterComplete.name": "Consanguine Sister Completes 2/3",
  "case.consSisterComplete.desc": "1 Full Sister · 1 Consanguine Sister · Mother",
  "case.consSisterComplete.note":
    "The single full sister takes 1/2. The 'sisters cap' is 2/3, leaving 1/6 for the consanguine sister to complete it. Mother gets 1/6. Surplus returned by Radd proportionally.",

  "case.extendedUncle.name": "Only Uncle Survives (Extended Asabah)",
  "case.extendedUncle.desc": "Mother · Full Paternal Uncle",
  "case.extendedUncle.note":
    "Mother takes 1/3 (no descendants, no multiple siblings). The full paternal uncle is the sole Asabah — he inherits the remaining 2/3. Demonstrates the extended Asabah chain reaching Category 1D.",

  "case.pgfExcludesSiblings.name": "Grandfather Excludes Siblings (Hanafi)",
  "case.pgfExcludesSiblings.desc": "Wife · Paternal Grandfather · 2 Full Brothers · 1 Full Sister",
  "case.pgfExcludesSiblings.note":
    "In Hanafi, the paternal grandfather completely excludes all siblings — they inherit nothing. This differs from Mālikī, Shāfi'ī, and Ḥanbalī where the grandfather and siblings share together. Wife gets 1/4 and grandfather inherits the full residue 3/4.",

  "case.twoGrannies.name": "Two Grandmothers Share 1/6",
  "case.twoGrannies.desc": "Daughter · Maternal Grandmother · Paternal Grandmother · Full Uncle",
  "case.twoGrannies.note":
    "When both grandmothers are eligible (no mother, father, or paternal grandfather to block the paternal grandmother), they split the 1/6 grandmother's share equally — each receiving 1/12. The full uncle takes the Asabah residue.",

  "case.pgfBlocksPGranny.name": "PGF Blocks Paternal Grandmother",
  "case.pgfBlocksPGranny.desc": "Daughter · Maternal Grandmother · Paternal Grandmother · Paternal Grandfather",
  "case.pgfBlocksPGranny.note":
    "The paternal grandfather (PGF) blocks the paternal grandmother entirely. Only the maternal grandmother remains eligible, so she takes the full 1/6. PGF gets 1/6 fixed (female descendants present) plus the Asabah residue.",

  // ── Save / Share / History ──
  "result.save": "Save",
  "result.saved": "Saved!",
  "result.export": "Share / Export PDF",
  "result.exporting": "Preparing PDF…",
  "home.history": "Saved Calculations",
  "history.title": "Saved Calculations",
  "history.empty": "No saved calculations yet.",
  "history.emptyHint": "Tap \"Save\" on any result screen to keep it here.",
  "history.estate": "Estate",
  "history.delete": "Delete",

  // ── Hajb Screen ──
  "home.hajb": "Blocking Rules (Hajb)",
  "hajb.title": "Hajb — Blocking Rules",
  "hajb.subtitle":
    "Reference guide showing which heirs completely exclude others, under the Hanafi school.",
  "hajb.blocked": "Blocked",
  "hajb.blockedBy": "Blocked by",
  "hajb.group.ascendants": "Ascendants",
  "hajb.group.descendants": "Grandchildren",
  "hajb.group.siblings": "Siblings",
  "hajb.group.asabah": "Extended Residuary Chain",
  "hajb.note.pgf":
    "The grandfather inherits in place of the father. When the father is alive he is a closer ascendant and completely excludes the grandfather.",
  "hajb.note.mGranny":
    "The mother is a closer maternal ascendant. Her presence makes the maternal grandmother entirely redundant.",
  "hajb.note.pGranny":
    "Three relatives block the paternal grandmother: the mother (closer female ascendant), the father (her own son with priority), and the paternal grandfather (who replaces the father in the paternal line).",
  "hajb.note.grandson":
    "The son is a first-degree male descendant. His presence completely blocks the grandson, who steps into the son's role only when no son survives.",
  "hajb.note.granddaughter":
    "Excluded by a living son. Also excluded if two or more daughters exist with no surviving grandson — they have already filled the daughters' 2/3 cap.",
  "hajb.note.fullSiblings":
    "All four — son, grandson, father, and paternal grandfather — block full siblings entirely. No partial share remains for them.",
  "hajb.note.consSiblings":
    "Blocked by all four blockers of full siblings, plus the full brother himself. The consanguine sister is additionally excluded by two or more full sisters.",
  "hajb.note.uterineSibs":
    "Any surviving descendant (son, daughter, grandson, granddaughter) or male ascendant (father, grandfather) fully excludes all uterine siblings.",
  "hajb.note.asabahChain":
    "Priority chain: Son → Grandson → Father/PGF → Full Brother → Cons. Brother → their sons → uncles → their sons. Each group excludes all lower groups. Only the closest surviving Asabah inherits.",
  "hajb.footer":
    "All rules shown are for the Hanafi school. Shafi'i, Maliki, and Hanbali differ primarily in the Grandfather-Siblings interaction (muqasamah rule vs. full Hanafi blocking).",
};

const ur: Dict = {
  "app.name": "میراث کیلکولیٹر",
  "app.tagline": "اسلامی وراثت کی تقسیم",

  "home.start": "حساب شروع کریں",
  "home.settings": "ترتیبات",
  "home.about": "ہمارے بارے میں",
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
    "میت کی کل ملکیت درج کریں۔ تجہیز، قرضے اور وصیت اگلے مرحلے میں منہا کریں۔ یہ خانہ اختیاری ہے۔",
  "q.estate.placeholder": "مثلاً 1000000",
  "q.estate.skip": "چھوڑیں — صرف حصے دیکھیں",

  // ── Deductions ──
  "q.deductions.title": "ترکہ سے کٹوتیاں",
  "q.deductions.help":
    "وراثت کی تقسیم سے پہلے یہ ذمہ داریاں ترتیب سے ادا کی جاتی ہیں۔ سب اختیاری ہیں۔",
  "q.funeral.label": "تجہیز و تکفین",
  "q.funeral.help": "کفن دفن کے اخراجات — سب سے پہلے منہا",
  "q.debts.label": "قرض جو میت پر ہے",
  "q.debts.help": "دوسروں کا قرض جو میت نے ادا کرنا تھا",
  "q.receivables.label": "میت کا کسی پر قرض",
  "q.receivables.help": "جو رقم دوسرے لوگ میت کو دیں گے — ترکہ میں شامل",
  "q.wasiyyah.label": "وصیت",
  "q.wasiyyah.help": "قرضوں کے بعد باقی ترکہ کا زیادہ سے زیادہ ایک تہائی",
  "q.wasiyyah.capped": "1/3 تک محدود",
  "deductions.gross": "کل ترکہ",
  "deductions.funeral": "تجہیز و تکفین",
  "deductions.debts": "واجب الادا قرض",
  "deductions.receivables": "وصولی",
  "deductions.wasiyyah": "وصیت",
  "deductions.net": "قابل تقسیم ترکہ",
  "deductions.netNote": "یہ رقم ورثاء میں تقسیم کی جائے گی",

  "q.gender.title": "میت مرد تھا یا عورت؟",
  "q.gender.help": "اس سے طے ہوگا کہ شوہر یا بیوی وارث بنیں گے۔",

  "q.spouse.title.male": "کیا میت نے بیوی چھوڑی ہے؟",
  "q.spouse.title.female": "کیا میت نے شوہر چھوڑا ہے؟",
  "q.spouse.help":
    "بیوی کو اولاد کے ساتھ 1/8 اور بغیر 1/4 ملتا ہے۔ شوہر کو اولاد کے ساتھ 1/4 اور بغیر 1/2 ملتا ہے۔",
  "q.wives.title": "کتنی بیویاں ہیں؟",
  "q.wives.help": "زیادہ سے زیادہ چار بیویاں حصہ برابر تقسیم کریں گی۔",

  "q.father.title": "کیا والد زندہ ہیں؟",
  "q.father.help":
    "والد کو مرد اولاد کی موجودگی میں 1/6، صرف بیٹیوں کی صورت میں 1/6 + باقی، اور اولاد نہ ہو تو پورا بقیہ ملتا ہے۔",
  "q.pgf.title": "کیا دادا زندہ ہیں؟",
  "q.pgf.help":
    "والد کے والد۔ والد کی غیر موجودگی میں ان کی جگہ وراثت پاتے ہیں۔ والد کی موجودگی میں محروم۔",
  "q.mother.title": "کیا والدہ زندہ ہیں؟",
  "q.mother.help":
    "والدہ کو اولاد یا دو یا زائد بہن بھائیوں کی موجودگی میں 1/6 ملتا ہے، ورنہ 1/3 (عمریتین کی صورت میں بقیہ کا 1/3)۔",
  "q.mGranny.title": "کیا نانی زندہ ہیں؟",
  "q.mGranny.help":
    "والدہ کی والدہ۔ 1/6 (دادی بھی زندہ ہو تو دونوں مل کر)۔ صرف والدہ کی موجودگی میں محروم۔",
  "q.pGranny.title": "کیا دادی زندہ ہیں؟",
  "q.pGranny.help":
    "والد کی والدہ۔ 1/6 (نانی بھی زندہ ہو تو دونوں مل کر)۔ والدہ، والد یا دادا کی موجودگی میں محروم۔",

  "q.sons.title": "بیٹے کتنے ہیں؟",
  "q.daughters.title": "بیٹیاں کتنی ہیں؟",
  "q.children.help": "اگر بیٹے اور بیٹیاں دونوں موجود ہوں تو بیٹے کا حصہ بیٹی سے دگنا ہوگا۔",
  "q.grandsons.title": "پوتے کتنے ہیں؟",
  "q.granddaughters.title": "پوتیاں کتنی ہیں؟",
  "q.grandchildren.help":
    "فوت شدہ بیٹے کی اولاد۔ زندہ بیٹے کی موجودگی میں مکمل طور پر محروم۔",

  "q.fullBrothers.title": "حقیقی بھائی کتنے ہیں؟",
  "q.fullSisters.title": "حقیقی بہنیں کتنی ہیں؟",
  "q.fullSiblings.help":
    "ایک ہی والدین۔ بیٹا، پوتا، والد یا دادا کی موجودگی میں محروم۔",

  "q.consBrothers.title": "علاتی بھائی (باپ شریک) کتنے ہیں؟",
  "q.consSisters.title": "علاتی بہنیں (باپ شریک) کتنی ہیں؟",
  "q.consSiblings.help":
    "ایک ہی والد، مختلف والدہ۔ بیٹا، پوتا، والد، دادا، حقیقی بھائی یا دو یا زائد حقیقی بہنوں کی موجودگی میں محروم۔",

  "q.uterineSibs.title": "اخیافی بہن بھائی کتنے ہیں؟",
  "q.uterineSibs.help":
    "ایک ہی والدہ، مختلف والد۔ کسی اولاد، والد یا دادا کی موجودگی میں محروم۔ مرد و عورت کا حصہ برابر۔",

  "q.fullNephews.title": "حقیقی بھائی کے بیٹے کتنے ہیں؟",
  "q.consNephews.title": "علاتی بھائی کے بیٹے کتنے ہیں؟",
  "q.fullUncles.title": "حقیقی چچا کتنے ہیں؟",
  "q.consUncles.title": "علاتی چچا کتنے ہیں؟",
  "q.fullCousins.title": "حقیقی چچا کے بیٹے کتنے ہیں؟",
  "q.consCousins.title": "علاتی چچا کے بیٹے کتنے ہیں؟",
  "q.extended.help":
    "بعید عصبہ۔ کوئی قریب کا مرد رشتہ دار زندہ نہ ہو تو بقیہ وراثت پاتا ہے۔",

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
  "result.share.asabahMaaGhayrihi": "بیٹیوں کے ساتھ عصبہ مع غیرہ",
  "result.exclusions": "محروم وارث",

  "heir.husband": "شوہر",
  "heir.wife": "بیوی",
  "heir.father": "والد",
  "heir.mother": "والدہ",
  "heir.paternalGrandfather": "دادا",
  "heir.maternalGrandmother": "نانی",
  "heir.paternalGrandmother": "دادی",
  "heir.son": "بیٹا",
  "heir.daughter": "بیٹی",
  "heir.grandson": "پوتا",
  "heir.granddaughter": "پوتی",
  "heir.fullBrother": "حقیقی بھائی",
  "heir.fullSister": "حقیقی بہن",
  "heir.paternalHalfBrother": "علاتی بھائی",
  "heir.paternalHalfSister": "علاتی بہن",
  "heir.maternalHalfSibling": "اخیافی بہن/بھائی",
  "heir.fullBrothersSon": "حقیقی بھائی کا بیٹا",
  "heir.paternalHalfBrothersSon": "علاتی بھائی کا بیٹا",
  "heir.fullPaternalUncle": "حقیقی چچا",
  "heir.paternalHalfPaternalUncle": "علاتی چچا",
  "heir.fullPaternalUnclesSon": "حقیقی چچا کا بیٹا",
  "heir.paternalHalfPaternalUnclesSon": "علاتی چچا کا بیٹا",

  "reason.husband.withDesc": "1/4 — اولاد موجود",
  "reason.husband.noDesc": "1/2 — اولاد نہیں",
  "reason.wife.withDesc": "1/8 — اولاد موجود، برابر تقسیم",
  "reason.wife.noDesc": "1/4 — اولاد نہیں، برابر تقسیم",
  "reason.mother.umariyyatain": "عمریتین — میاں/بیوی کے بعد بقیہ کا 1/3",
  "reason.mother.withDesc": "1/6 — اولاد موجود",
  "reason.mother.withSiblings": "1/6 — دو یا زائد بہن بھائی موجود",
  "reason.mother.alone": "1/3 — اولاد یا متعدد بہن بھائی نہیں",
  "reason.father.withMaleDesc": "1/6 — مرد اولاد موجود",
  "reason.father.withFemaleDesc": "1/6 مقررہ + بقیہ بطور عصبہ",
  "reason.father.asabah": "خالص عصبہ — اولاد نہیں",
  "reason.pgf.withMaleDesc": "1/6 — مرد اولاد موجود (والد کی جگہ)",
  "reason.pgf.withFemaleDesc": "1/6 مقررہ + بقیہ بطور عصبہ",
  "reason.pgf.asabah": "خالص عصبہ — اولاد یا والد نہیں",
  "reason.granny.shared": "1/6 مشترک — دونوں دادیاں موجود",
  "reason.granny.solo": "1/6 — اکیلی اہل دادی",
  "reason.daughter.solo": "1/2 — اکیلی بیٹی، بیٹا نہیں",
  "reason.daughter.multiple": "2/3 مشترک — متعدد بیٹیاں، بیٹا نہیں",
  "reason.granddaughter.solo": "1/2 — اکیلی پوتی",
  "reason.granddaughter.multiple": "2/3 مشترک — متعدد پوتیاں",
  "reason.granddaughter.complete": "1/6 — اکیلی بیٹی کے ساتھ 2/3 مکمل کرنے کے لیے",
  "reason.uterine.solo": "1/6 — اکیلا اخیافی",
  "reason.uterine.multiple": "1/3 برابر تقسیم، جنس کا فرق نہیں",
  "reason.fullSister.solo": "1/2 — اکیلی حقیقی بہن",
  "reason.fullSister.multiple": "2/3 مشترک — متعدد حقیقی بہنیں",
  "reason.fullSister.maaGhayrihi": "بیٹیوں/پوتیوں کے ساتھ عصبہ بنتی ہیں",
  "reason.consSister.solo": "1/2 — اکیلی علاتی بہن",
  "reason.consSister.multiple": "2/3 مشترک — متعدد علاتی بہنیں",
  "reason.consSister.complete": "1/6 — اکیلی حقیقی بہن کے ساتھ 2/3 مکمل کرنے کے لیے",
  "reason.consSister.maaGhayrihi": "بیٹیوں/پوتیوں کے ساتھ عصبہ بنتی ہیں",
  "reason.son.asabah": "عصبہ — بیٹا اور بیٹی 2:1 کی نسبت سے",
  "reason.grandson.asabah": "عصبہ — پوتا اور پوتی 2:1 کی نسبت سے",
  "reason.fullBrother.asabah": "عصبہ — بھائی اور بہن 2:1 کی نسبت سے",
  "reason.consBrother.asabah": "عصبہ — علاتی بھائی اور بہن 2:1 کی نسبت سے",
  "reason.fullNephew.asabah": "عصبہ — بعید رشتہ دار",
  "reason.consNephew.asabah": "عصبہ — بعید رشتہ دار",
  "reason.fullUncle.asabah": "عصبہ — بعید رشتہ دار",
  "reason.consUncle.asabah": "عصبہ — بعید رشتہ دار",
  "reason.fullCousin.asabah": "عصبہ — بعید رشتہ دار",
  "reason.consCousin.asabah": "عصبہ — بعید رشتہ دار",

  "ex.pgf.byFather": "والد کی موجودگی کی وجہ سے محروم",
  "ex.mGranny.byMother": "والدہ کی موجودگی کی وجہ سے محروم",
  "ex.pGranny.byMother": "والدہ کی موجودگی کی وجہ سے محروم",
  "ex.pGranny.byFather": "والد کی موجودگی کی وجہ سے محروم",
  "ex.pGranny.byPGF": "دادا کی موجودگی کی وجہ سے محروم",
  "ex.granddaughter.bySon": "بیٹے کی موجودگی کی وجہ سے محروم",
  "ex.granddaughter.byTwoDaughters": "دو یا زائد بیٹیوں کی وجہ سے محروم",
  "ex.grandson.bySon": "بیٹے کی موجودگی کی وجہ سے محروم",
  "ex.uterine.byBlocker": "اولاد، والد یا دادا کی وجہ سے محروم",
  "ex.fullSibling.byBlocker": "بیٹا، پوتا، والد یا دادا کی وجہ سے محروم",
  "ex.consSibling.byBlocker": "قریبی رشتہ دار کی وجہ سے محروم",
  "ex.asabah.byCloser": "قریبی مرد عصبہ کی وجہ سے محروم",

  // ── Save / Share / History ──
  "result.save": "محفوظ کریں",
  "result.saved": "محفوظ!",
  "result.export": "PDF شیئر کریں",
  "result.exporting": "PDF تیار ہو رہا ہے…",
  "home.history": "محفوظ حسابات",
  "history.title": "محفوظ حسابات",
  "history.empty": "ابھی تک کوئی محفوظ حساب نہیں۔",
  "history.emptyHint": "کسی بھی نتیجہ اسکرین پر 'محفوظ کریں' ٹیپ کریں۔",
  "history.estate": "ترکہ",
  "history.delete": "حذف",

  // ── Hajb Screen ──
  "home.hajb": "حجب — محرومی کے اصول",
  "hajb.title": "حجب — محرومی کے اصول",
  "hajb.subtitle": "حنفی مسلک کے مطابق کون سے وارث کسے مکمل طور پر محروم کرتے ہیں",
  "hajb.blocked": "محروم",
  "hajb.blockedBy": "کی وجہ سے محروم",
  "hajb.group.ascendants": "اجداد",
  "hajb.group.descendants": "پوتے پوتیاں",
  "hajb.group.siblings": "بہن بھائی",
  "hajb.group.asabah": "بعید عصبہ کی ترتیب",
  "hajb.note.pgf":
    "دادا، والد کی جگہ وراثت پاتا ہے۔ والد کی موجودگی میں وہ قریب تر ہونے کی وجہ سے دادا کو مکمل طور پر محروم کر دیتا ہے۔",
  "hajb.note.mGranny":
    "والدہ قریب تر ہے۔ اس کی موجودگی میں نانی کا دعویٰ ختم ہو جاتا ہے۔",
  "hajb.note.pGranny":
    "تین رشتہ دار دادی کو محروم کرتے ہیں: والدہ (قریب تر خاتون)، والد (اپنا بیٹا جو اولیٰ ہے) اور دادا (جو والد کی جگہ لیتا ہے)۔",
  "hajb.note.grandson":
    "بیٹا پہلے درجے کا مرد اولاد ہے۔ اس کی موجودگی پوتے کو مکمل طور پر محروم کر دیتی ہے۔",
  "hajb.note.granddaughter":
    "زندہ بیٹے کی موجودگی میں محروم۔ دو یا زائد بیٹیوں اور کسی پوتے کی غیر موجودگی میں بھی محروم — بیٹیاں پہلے ہی 2/3 کا حد پورا کر چکی ہیں۔",
  "hajb.note.fullSiblings":
    "یہ چاروں — بیٹا، پوتا، والد اور دادا — حقیقی بہن بھائیوں کو مکمل طور پر محروم کرتے ہیں۔",
  "hajb.note.consSiblings":
    "حقیقی بہن بھائیوں کے تمام حاجب علاتی کو بھی محروم کرتے ہیں، مزید حقیقی بھائی بھی حاجب ہے۔ علاتی بہن کو دو یا زائد حقیقی بہنیں بھی محروم کرتی ہیں۔",
  "hajb.note.uterineSibs":
    "کوئی بھی اولاد (بیٹا، بیٹی، پوتا، پوتی) یا مرد اجداد (والد یا دادا) اخیافی بہن بھائیوں کو مکمل طور پر محروم کر دیتا ہے۔",
  "hajb.note.asabahChain":
    "ترتیب: بیٹا، پوتا، والد، دادا، حقیقی بھائی، علاتی بھائی، ان کے بیٹے، چچا، ان کے بیٹے۔ قریب تر عصبہ تمام بعید عصبوں کو محروم کرتا ہے۔",
  "hajb.footer":
    "یہ تمام قواعد حنفی مسلک کے مطابق ہیں۔ شافعی، مالکی اور حنبلی خصوصاً دادا اور بہن بھائیوں کے درمیان مقاسمہ کے مسئلہ میں مختلف ہیں۔",
};

const ar: Dict = {
  "app.name": "حاسبة الميراث",
  "app.tagline": "توزيع الميراث الإسلامي",

  "home.start": "ابدأ الحساب",
  "home.settings": "الإعدادات",
  "home.about": "حول التطبيق",
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
    "أدخل إجمالي ما تركه المتوفى. يمكنك خصم مصاريف التجهيز والديون والوصية في الخطوة التالية. هذا الحقل اختياري.",
  "q.estate.placeholder": "مثال: 1000000",
  "q.estate.skip": "تخطَّ — عرض الحصص فقط",

  // ── Deductions ──
  "q.deductions.title": "التنزيلات من التركة",
  "q.deductions.help":
    "تُسوَّى هذه الالتزامات بالترتيب قبل توزيع الميراث. جميعها اختيارية.",
  "q.funeral.label": "مصاريف التجهيز والتكفين",
  "q.funeral.help": "تُخصم أولًا من التركة",
  "q.debts.label": "الديون على الميت",
  "q.debts.help": "ما أوجبه الميت لغيره — يُخصم من التركة",
  "q.receivables.label": "الديون للميت",
  "q.receivables.help": "ما يجب على غيره للميت — يُضاف إلى التركة",
  "q.wasiyyah.label": "الوصية",
  "q.wasiyyah.help": "لا تجاوز ثلث التركة بعد الديون",
  "q.wasiyyah.capped": "محدودة بالثلث",
  "deductions.gross": "إجمالي التركة",
  "deductions.funeral": "مصاريف التجهيز",
  "deductions.debts": "الديون الواجبة",
  "deductions.receivables": "الديون للميت",
  "deductions.wasiyyah": "الوصية",
  "deductions.net": "صافي التركة للتوزيع",
  "deductions.netNote": "هذا المبلغ يُوزَّع على الورثة",

  "q.gender.title": "هل المتوفى ذكر أم أنثى؟",
  "q.gender.help": "هذا يحدد أهلية الزوج أو الزوجة للميراث.",

  "q.spouse.title.male": "هل ترك المتوفى زوجة؟",
  "q.spouse.title.female": "هل تركت المتوفاة زوجًا؟",
  "q.spouse.help":
    "للزوجة الثُمن مع الفرع الوارث والربع بدونه. للزوج الربع مع الفرع الوارث والنصف بدونه.",
  "q.wives.title": "كم عدد الزوجات؟",
  "q.wives.help": "يقتسمن نصيب الزوجة بالتساوي حتى أربع.",

  "q.father.title": "هل الأب على قيد الحياة؟",
  "q.father.help":
    "للأب السدس مع الفرع الذكر، السدس مع البنات + الباقي تعصيبًا، أو كل الباقي إذا لم يوجد فرع وارث.",
  "q.pgf.title": "هل الجد لأب على قيد الحياة؟",
  "q.pgf.help":
    "أبو الأب. يرث كالأب عند انعدامه. محجوب بالأب.",
  "q.mother.title": "هل الأم على قيد الحياة؟",
  "q.mother.help":
    "للأم السدس مع الفرع الوارث أو وجود اثنين فأكثر من الإخوة، وإلا الثلث (أو ثلث الباقي في العمريتين).",
  "q.mGranny.title": "هل الجدة لأم على قيد الحياة؟",
  "q.mGranny.help":
    "أم الأم. لها السدس (يقتسمن مع الجدة لأب إن وجدتا). محجوبة فقط بالأم.",
  "q.pGranny.title": "هل الجدة لأب على قيد الحياة؟",
  "q.pGranny.help":
    "أم الأب. لها السدس (يقتسمن مع الجدة لأم). محجوبة بالأم أو الأب أو الجد لأب.",

  "q.sons.title": "كم عدد الأبناء؟",
  "q.daughters.title": "كم عدد البنات؟",
  "q.children.help": "للذكر مثل حظ الأنثيين عند اجتماعهما.",
  "q.grandsons.title": "كم عدد أبناء الابن؟",
  "q.granddaughters.title": "كم عدد بنات الابن؟",
  "q.grandchildren.help":
    "أولاد ابن متوفى. محجوبون كليًا بوجود ابن حي.",

  "q.fullBrothers.title": "كم عدد الإخوة الأشقاء؟",
  "q.fullSisters.title": "كم عدد الأخوات الشقيقات؟",
  "q.fullSiblings.help":
    "من الأبوين. محجوبون بالابن أو ابن الابن أو الأب أو الجد لأب.",

  "q.consBrothers.title": "كم عدد الإخوة لأب؟",
  "q.consSisters.title": "كم عدد الأخوات لأب؟",
  "q.consSiblings.help":
    "من الأب فقط. محجوبون بالابن أو الجد أو الأب أو الأخ الشقيق أو شقيقتين فأكثر.",

  "q.uterineSibs.title": "كم عدد الإخوة لأم؟",
  "q.uterineSibs.help":
    "من الأم فقط. محجوبون بأي فرع وارث أو الأب أو الجد لأب. الذكر والأنثى سواء.",

  "q.fullNephews.title": "كم عدد أبناء الأخ الشقيق؟",
  "q.consNephews.title": "كم عدد أبناء الأخ لأب؟",
  "q.fullUncles.title": "كم عدد الأعمام الأشقاء؟",
  "q.consUncles.title": "كم عدد الأعمام لأب؟",
  "q.fullCousins.title": "كم عدد أبناء العم الشقيق؟",
  "q.consCousins.title": "كم عدد أبناء العم لأب؟",
  "q.extended.help":
    "عاصب بعيد. يرث الباقي إذا لم يوجد عاصب أقرب منه.",

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
  "result.share.asabahMaaGhayrihi": "عصبة مع البنات",
  "result.exclusions": "المحجوبون",

  "heir.husband": "زوج",
  "heir.wife": "زوجة",
  "heir.father": "أب",
  "heir.mother": "أم",
  "heir.paternalGrandfather": "جد لأب",
  "heir.maternalGrandmother": "جدة لأم",
  "heir.paternalGrandmother": "جدة لأب",
  "heir.son": "ابن",
  "heir.daughter": "بنت",
  "heir.grandson": "ابن الابن",
  "heir.granddaughter": "بنت الابن",
  "heir.fullBrother": "أخ شقيق",
  "heir.fullSister": "أخت شقيقة",
  "heir.paternalHalfBrother": "أخ لأب",
  "heir.paternalHalfSister": "أخت لأب",
  "heir.maternalHalfSibling": "أخ/أخت لأم",
  "heir.fullBrothersSon": "ابن الأخ الشقيق",
  "heir.paternalHalfBrothersSon": "ابن الأخ لأب",
  "heir.fullPaternalUncle": "عم شقيق",
  "heir.paternalHalfPaternalUncle": "عم لأب",
  "heir.fullPaternalUnclesSon": "ابن العم الشقيق",
  "heir.paternalHalfPaternalUnclesSon": "ابن العم لأب",

  "reason.husband.withDesc": "1/4 — يوجد فرع وارث",
  "reason.husband.noDesc": "1/2 — لا فرع وارث",
  "reason.wife.withDesc": "1/8 — يوجد فرع وارث، يقتسمن بالتساوي",
  "reason.wife.noDesc": "1/4 — لا فرع وارث، يقتسمن بالتساوي",
  "reason.mother.umariyyatain": "العمريتان — ثلث الباقي بعد الزوجين",
  "reason.mother.withDesc": "1/6 — يوجد فرع وارث",
  "reason.mother.withSiblings": "1/6 — اثنان فأكثر من الإخوة",
  "reason.mother.alone": "1/3 — لا فرع وارث ولا جمع من الإخوة",
  "reason.father.withMaleDesc": "1/6 — يوجد فرع ذكر",
  "reason.father.withFemaleDesc": "1/6 فرضًا + الباقي تعصيبًا",
  "reason.father.asabah": "تعصيب خالص — لا فرع وارث",
  "reason.pgf.withMaleDesc": "1/6 — يوجد فرع ذكر (يقوم مقام الأب)",
  "reason.pgf.withFemaleDesc": "1/6 فرضًا + الباقي تعصيبًا",
  "reason.pgf.asabah": "تعصيب خالص — لا فرع وارث ولا أب",
  "reason.granny.shared": "1/6 مشترك — جدتان موجودتان",
  "reason.granny.solo": "1/6 — جدة واحدة مستحقة",
  "reason.daughter.solo": "1/2 — بنت واحدة بلا ابن",
  "reason.daughter.multiple": "2/3 مشترك — بنات بلا ابن",
  "reason.granddaughter.solo": "1/2 — بنت ابن واحدة",
  "reason.granddaughter.multiple": "2/3 مشترك — بنات ابن متعددات",
  "reason.granddaughter.complete": "1/6 — تكملة الثلثين مع البنت الواحدة",
  "reason.uterine.solo": "1/6 — أخ/أخت لأم واحد",
  "reason.uterine.multiple": "1/3 بالتساوي بين الذكور والإناث",
  "reason.fullSister.solo": "1/2 — أخت شقيقة واحدة",
  "reason.fullSister.multiple": "2/3 مشترك — أخوات شقيقات",
  "reason.fullSister.maaGhayrihi": "تصبح عاصبة مع البنات",
  "reason.consSister.solo": "1/2 — أخت لأب واحدة",
  "reason.consSister.multiple": "2/3 مشترك — أخوات لأب",
  "reason.consSister.complete": "1/6 — تكملة الثلثين مع الأخت الشقيقة",
  "reason.consSister.maaGhayrihi": "تصبح عاصبة مع البنات",
  "reason.son.asabah": "تعصيب — للذكر مثل حظ الأنثيين",
  "reason.grandson.asabah": "تعصيب — لابن الابن مثل حظ الأنثيين",
  "reason.fullBrother.asabah": "تعصيب — للأخ مثل حظ الأختين",
  "reason.consBrother.asabah": "تعصيب — للأخ لأب مثل حظ الأختين",
  "reason.fullNephew.asabah": "تعصيب — عاصب بعيد",
  "reason.consNephew.asabah": "تعصيب — عاصب بعيد",
  "reason.fullUncle.asabah": "تعصيب — عاصب بعيد",
  "reason.consUncle.asabah": "تعصيب — عاصب بعيد",
  "reason.fullCousin.asabah": "تعصيب — عاصب بعيد",
  "reason.consCousin.asabah": "تعصيب — عاصب بعيد",

  "ex.pgf.byFather": "محجوب بالأب",
  "ex.mGranny.byMother": "محجوبة بالأم",
  "ex.pGranny.byMother": "محجوبة بالأم",
  "ex.pGranny.byFather": "محجوبة بالأب",
  "ex.pGranny.byPGF": "محجوبة بالجد لأب",
  "ex.granddaughter.bySon": "محجوبة بالابن",
  "ex.granddaughter.byTwoDaughters": "محجوبة باثنتين فأكثر من البنات",
  "ex.grandson.bySon": "محجوب بالابن",
  "ex.uterine.byBlocker": "محجوب بالفرع الوارث أو الأب أو الجد",
  "ex.fullSibling.byBlocker": "محجوب بالابن أو ابن الابن أو الأب أو الجد",
  "ex.consSibling.byBlocker": "محجوب بأقرب منه",
  "ex.asabah.byCloser": "محجوب بعاصب أقرب",

  // ── Save / Share / History ──
  "result.save": "حفظ",
  "result.saved": "تم الحفظ!",
  "result.export": "مشاركة / تصدير PDF",
  "result.exporting": "جارٍ تجهيز الـ PDF…",
  "home.history": "الحسابات المحفوظة",
  "history.title": "الحسابات المحفوظة",
  "history.empty": "لا توجد حسابات محفوظة بعد.",
  "history.emptyHint": "اضغط على 'حفظ' في شاشة النتائج لحفظها هنا.",
  "history.estate": "التركة",
  "history.delete": "حذف",

  // ── Hajb Screen ──
  "home.hajb": "الحجب — قواعد الحرمان",
  "hajb.title": "الحجب",
  "hajb.subtitle": "مرجع يوضح من يحجب من في المذهب الحنفي",
  "hajb.blocked": "محجوب",
  "hajb.blockedBy": "محجوب بـ",
  "hajb.group.ascendants": "الأصول",
  "hajb.group.descendants": "الأحفاد",
  "hajb.group.siblings": "الإخوة والأخوات",
  "hajb.group.asabah": "سلسلة العصبات البعيدة",
  "hajb.note.pgf":
    "الجد يقوم مقام الأب. وجود الأب يحجب الجد حجبًا كاملًا لأن الأب أقرب درجة.",
  "hajb.note.mGranny":
    "الأم أقرب من الجدة لأم. وجودها يحجب الجدة لأم حجبًا كاملًا.",
  "hajb.note.pGranny":
    "تحجبها ثلاثة: الأم (أقرب إناثًا)، الأب (ابنها وأولى منها)، والجد لأب (يقوم مقام الأب).",
  "hajb.note.grandson":
    "الابن فرع وارث مباشر. وجوده يحجب ابن الابن حجبًا كاملًا.",
  "hajb.note.granddaughter":
    "تُحجب بالابن. وكذلك إذا وُجدت بنتان فأكثر ولا ابن ابن، لأنهن استوفَيْن الثلثين.",
  "hajb.note.fullSiblings":
    "هؤلاء الأربعة — الابن، ابن الابن، الأب، الجد لأب — يحجبون الإخوة الأشقاء حجبًا كاملًا.",
  "hajb.note.consSiblings":
    "يحجبهم ما يحجب الأشقاء، ويضاف إليه الأخ الشقيق. والأخت لأب تُحجب أيضًا بأختين شقيقتين فأكثر.",
  "hajb.note.uterineSibs":
    "أي فرع وارث (ابن، بنت، ابن ابن، بنت ابن) أو أصل ذكر (أب، جد) يحجب الإخوة لأم حجبًا كاملًا.",
  "hajb.note.asabahChain":
    "ترتيب العصبات: ابن، ابن ابن، أب، جد، أخ شقيق، أخ لأب، أبناؤهم، أعمام، أبناء أعمام. الأقرب يحجب الأبعد.",
  "hajb.footer":
    "جميع القواعد وفق المذهب الحنفي. يختلف الشافعي والمالكي والحنبلي في مسألة الجد مع الإخوة (المقاسمة مقابل الحجب الكامل).",
};

const dictionaries: Record<LanguageCode, Dict> = { en, ur, ar };

export function t(lang: LanguageCode, key: string): string {
  return dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
}

export function isRTL(lang: LanguageCode): boolean {
  return lang === "ur" || lang === "ar";
}
