const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  green:      "1B6B3A",
  lightGreen: "D6EAD9",
  gold:       "B8860B",
  lightGold:  "FFF8DC",
  blue:       "1A3A5C",
  lightBlue:  "D6E4F0",
  purple:     "4B0082",
  lightPurple:"EDE0FF",
  red:        "8B0000",
  lightRed:   "FFE4E1",
  gray:       "555555",
  lightGray:  "F5F5F5",
  darkGray:   "333333",
  white:      "FFFFFF",
  teal:       "006666",
  lightTeal:  "D0F0EE",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const border = (color = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color });
const borders = (c) => { const b = border(c); return { top: b, bottom: b, left: b, right: b }; };
const noBorder = () => ({ style: BorderStyle.NONE, size: 0, color: "FFFFFF" });
const noBorders = () => { const b = noBorder(); return { top: b, bottom: b, left: b, right: b }; };

const h1 = (text, color = C.green) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  children: [new TextRun({ text, color, bold: true, size: 36, font: "Arial" })]
});

const h2 = (text, color = C.blue) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 300, after: 160 },
  children: [new TextRun({ text, color, bold: true, size: 28, font: "Arial" })]
});

const h3 = (text, color = C.teal) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text, color, bold: true, size: 24, font: "Arial" })]
});

const p = (text, opts = {}) => new Paragraph({
  spacing: { before: 80, after: 80 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.darkGray, ...opts })]
});

const pb = () => new Paragraph({ children: [new PageBreak()] });

const bullet = (text, ref = "bullets", color = C.darkGray) => new Paragraph({
  numbering: { reference: ref, level: 0 },
  spacing: { before: 60, after: 60 },
  children: [new TextRun({ text, font: "Arial", size: 22, color })]
});

const bullet2 = (text) => new Paragraph({
  numbering: { reference: "bullets2", level: 0 },
  spacing: { before: 40, after: 40 },
  children: [new TextRun({ text, font: "Arial", size: 20, color: C.gray })]
});

const numbered = (text) => new Paragraph({
  numbering: { reference: "numbers", level: 0 },
  spacing: { before: 80, after: 80 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.darkGray })]
});

const space = (lines = 1) => new Paragraph({
  spacing: { before: 0, after: lines * 120 },
  children: [new TextRun({ text: "" })]
});

const infoBox = (label, content, bg = C.lightBlue, accent = C.blue) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [1440, 7920],
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders: borders(accent),
          width: { size: 1440, type: WidthType.DXA },
          shading: { fill: accent, type: ShadingType.CLEAR },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 120, bottom: 120, left: 120, right: 120 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: label, bold: true, color: C.white, font: "Arial", size: 20 })]
          })]
        }),
        new TableCell({
          borders: borders(accent),
          width: { size: 7920, type: WidthType.DXA },
          shading: { fill: bg, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text: content, font: "Arial", size: 21, color: C.darkGray })]
          })]
        })
      ]
    })
  ]
});

const sectionDivider = (title, emoji = "●", bg = C.green) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders: noBorders(),
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: bg, type: ShadingType.CLEAR },
          margins: { top: 160, bottom: 160, left: 240, right: 240 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `${emoji}  ${title}  ${emoji}`, bold: true, color: C.white, font: "Arial", size: 30 })]
          })]
        })
      ]
    })
  ]
});

const twoColTable = (rows, col1W = 2800, col2W = 6560) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [col1W, col2W],
  rows: rows.map(([a, b, header]) => new TableRow({
    children: [
      new TableCell({
        borders: borders(header ? C.green : "AAAAAA"),
        width: { size: col1W, type: WidthType.DXA },
        shading: { fill: header ? C.green : C.lightGray, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 80 },
        children: [new Paragraph({
          children: [new TextRun({ text: a, bold: !!header, color: header ? C.white : C.blue, font: "Arial", size: 20 })]
        })]
      }),
      new TableCell({
        borders: borders(header ? C.green : "AAAAAA"),
        width: { size: col2W, type: WidthType.DXA },
        shading: { fill: header ? C.green : C.white, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 80 },
        children: [new Paragraph({
          children: [new TextRun({ text: b, bold: !!header, color: header ? C.white : C.darkGray, font: "Arial", size: 20 })]
        })]
      })
    ]
  }))
});

const threeColTable = (rows, w1 = 1800, w2 = 3780, w3 = 3780) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [w1, w2, w3],
  rows: rows.map(([a, b, c, isHeader]) => new TableRow({
    children: [a, b, c].map((cell, i) => new TableCell({
      borders: borders(isHeader ? C.blue : "BBBBBB"),
      width: { size: [w1,w2,w3][i], type: WidthType.DXA },
      shading: { fill: isHeader ? C.blue : (i===0 ? C.lightBlue : C.white), type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 100, right: 80 },
      children: [new Paragraph({
        children: [new TextRun({ text: cell, bold: !!isHeader, color: isHeader ? C.white : C.darkGray, font: "Arial", size: 19 })]
      })]
    }))
  }))
});

const codeBlock = (lines) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders: borders(C.gray),
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: "1E1E1E", type: ShadingType.CLEAR },
          margins: { top: 140, bottom: 140, left: 200, right: 200 },
          children: lines.map(line => new Paragraph({
            spacing: { before: 20, after: 20 },
            children: [new TextRun({ text: line, font: "Courier New", size: 18, color: "D4D4D4" })]
          }))
        })
      ]
    })
  ]
});

const alertBox = (title, text, bg, accent) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders: borders(accent),
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: bg, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 200, right: 200 },
          children: [
            new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text: title, bold: true, color: accent, font: "Arial", size: 22 })] }),
            new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text, font: "Arial", size: 21, color: C.darkGray })] })
          ]
        })
      ]
    })
  ]
});

// ─── Document Build ───────────────────────────────────────────────────────────
const children = [];

// ══════════════════════════════════════════════════════════════════════════════
// COVER PAGE
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  space(4),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: noBorders(),
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: C.green, type: ShadingType.CLEAR },
      margins: { top: 400, bottom: 400, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 },
          children: [new TextRun({ text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", font: "Arial", size: 32, color: C.lightGold, bold: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 200 },
          children: [new TextRun({ text: "In the Name of Allah, the Most Gracious, the Most Merciful", font: "Arial", size: 22, color: C.lightGold, italics: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 },
          children: [new TextRun({ text: "MEERAS CALCULATOR", font: "Arial", size: 52, color: C.white, bold: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
          children: [new TextRun({ text: "Islamic Inheritance Distribution App", font: "Arial", size: 28, color: C.lightGold, bold: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 0 },
          children: [new TextRun({ text: "Complete Technical Documentation & Development Guide", font: "Arial", size: 22, color: "CCDDCC", italics: true })] }),
      ]
    })]})],
  }),
  space(1),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2340, 2340, 2340, 2340],
    rows: [new TableRow({
      children: [
        ["Flutter + Dart", C.blue, C.lightBlue],
        ["Android + iOS + Web", C.teal, C.lightTeal],
        ["All 4 Madhabs", C.green, C.lightGreen],
        ["100% Offline", C.purple, C.lightPurple]
      ].map(([label, accent, bg]) => new TableCell({
        borders: borders(accent),
        width: { size: 2340, type: WidthType.DXA },
        shading: { fill: bg, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 100, right: 100 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: label, bold: true, color: accent, font: "Arial", size: 20 })] })]
      }))
    })]
  }),
  space(1),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 0 },
    children: [new TextRun({ text: "Version 1.0  ·  April 2026  ·  For Developers & Scholars", font: "Arial", size: 20, color: C.gray, italics: true })] }),
  pb(),
);

// ══════════════════════════════════════════════════════════════════════════════
// TABLE OF CONTENTS (manual)
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  h1("Table of Contents", C.green),
  space(0),
);
const tocItems = [
  ["1", "Project Overview & Goals", "3"],
  ["2", "Tech Stack & Architecture", "4"],
  ["3", "Project Setup & Folder Structure", "5"],
  ["4", "Internationalization (All-Language Support)", "7"],
  ["5", "The Calculation Engine — Module 1: Zawi al-Furudh", "9"],
  ["6", "The Calculation Engine — Module 2: Asabah Engine", "14"],
  ["7", "Madhab Differences Engine", "17"],
  ["8", "Step-by-Step UI Flow (Question Screen Logic)", "20"],
  ["9", "App Screens & Navigation", "24"],
  ["10", "State Management & Data Models", "26"],
  ["11", "Offline Storage & Performance", "28"],
  ["12", "Testing Strategy", "29"],
  ["13", "Publishing to App Stores & Web", "30"],
  ["14", "Glossary of Fiqh Terms", "31"],
];
children.push(
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [720, 7200, 1440],
    rows: tocItems.map(([num, title, page]) => new TableRow({
      children: [
        new TableCell({ borders: noBorders(), width: { size: 720, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: num, bold: true, color: C.green, font: "Arial", size: 22 })] })] }),
        new TableCell({ borders: noBorders(), width: { size: 7200, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: title, color: C.blue, font: "Arial", size: 22 })] })] }),
        new TableCell({ borders: noBorders(), width: { size: 1440, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: page, color: C.gray, font: "Arial", size: 22 })] })] }),
      ]
    }))
  }),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1: PROJECT OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 1: PROJECT OVERVIEW & GOALS", "☾"),
  space(1),
  h1("1. Project Overview & Goals", C.green),
  p("Meeras Calculator is a fully offline, multilingual mobile and web application that accurately computes Islamic inheritance (Meerath / Faraid) according to the rules of all four Sunni Madhabs (Hanafi, Maliki, Shafi'i, and Hanbali). It guides users through a smart, sequential question flow — asking only relevant questions — and delivers precise fractional shares with full scholarly justification."),
  space(0),
  h2("1.1 Core Mission"),
  alertBox("📖 Quranic Foundation",
    "\"Allah instructs you concerning your children: for the male, what is equal to the share of two females. But if there are [only] daughters, two or more, for them is two-thirds of one's estate. And if there is only one, for her is half.\" — Surah An-Nisa 4:11",
    C.lightGold, C.gold),
  space(0),
  p("The app must:"),
  bullet("Implement 100% accurate Fiqh al-Mawarith (Islamic Inheritance Law) computation"),
  bullet("Cover all 11 Primary Quota Heirs (Zawi al-Furudh) with correct exclusion (Hajb) logic"),
  bullet("Run the full Asabah Engine in strict priority order across all three categories"),
  bullet("Support all four Sunni Madhabs with clear difference indicators"),
  bullet("Work completely offline — no internet required after install"),
  bullet("Support every major world language via Flutter's i18n system"),
  bullet("Be accessible to non-scholars through plain-language guided questions"),
  space(1),
  h2("1.2 Key Differentiators vs Existing Apps"),
  twoColTable([
    ["Feature", "Meeras Calculator", true],
    ["Madhab Support", "All 4 Sunni Madhabs with difference flags"],
    ["Language Support", "All languages (Flutter i18n + ARB files)"],
    ["Internet Required", "None — fully offline"],
    ["Question Flow", "Smart adaptive — only asks relevant questions"],
    ["Hajb (Exclusion) Logic", "Full automatic exclusion engine built-in"],
    ["Asabah Engine", "All 3 categories with strict priority"],
    ["Awl (Proportional Reduction)", "Auto-applied when shares exceed 100%"],
    ["Radd (Return of Remainder)", "Applied per Madhab rules"],
    ["Quranic References", "Each share cites its Ayah/Hadith source"],
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2: TECH STACK
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 2: TECH STACK & ARCHITECTURE", "⚙"),
  space(1),
  h1("2. Tech Stack & Architecture", C.green),
  h2("2.1 Core Technology: Flutter (Dart)"),
  p("Flutter is the optimal choice for this app for the following reasons:"),
  twoColTable([
    ["Reason", "Detail", true],
    ["Single Codebase", "Android + iOS + Web from one Dart codebase — 100% code reuse"],
    ["RTL/LTR Support", "Native support for Arabic, Urdu, Farsi (RTL) and all LTR languages"],
    ["Offline-First", "No backend required; all logic runs in Dart on-device"],
    ["Performance", "Impeller render engine delivers 60-120fps, ideal for smooth UI transitions"],
    ["i18n Built-in", "flutter_localizations + intl package supports 115+ languages via ARB files"],
    ["Math Precision", "Dart's Fraction/Rational math ensures exact 1/6, 1/4, 2/3 — no float errors"],
  ]),
  space(1),
  h2("2.2 Complete Tech Stack"),
  threeColTable([
    ["Layer", "Package / Tool", "Purpose", true],
    ["Framework", "Flutter 3.x + Dart 3.x", "Cross-platform app framework"],
    ["State Mgmt", "flutter_riverpod ^2.x", "Reactive state management"],
    ["i18n", "flutter_localizations + intl", "Multi-language support"],
    ["Local Storage", "hive ^2.x + hive_flutter", "Offline case history storage"],
    ["Math", "rational ^2.x (pub.dev)", "Exact fractional arithmetic"],
    ["PDF Export", "pdf ^3.x + printing ^5.x", "Export inheritance reports"],
    ["Navigation", "go_router ^13.x", "Declarative routing"],
    ["UI", "flutter_svg + google_fonts", "Icons & Islamic typography"],
    ["Testing", "flutter_test + mockito", "Unit & widget testing"],
    ["Build", "flutter build apk/ios/web", "Platform deployment"],
  ]),
  space(1),
  h2("2.3 Why Rational Math (Not floats)?"),
  alertBox("⚠️ Critical",
    "Islamic inheritance shares are exact fractions (1/6, 1/4, 2/3, etc.). Using double/float arithmetic will produce rounding errors. The 'rational' package on pub.dev provides exact Rational number arithmetic in Dart. Every share must be computed as a Rational, then converted to a percentage only at display time.",
    C.lightRed, C.red),
  space(1),
  codeBlock([
    "// ✅ CORRECT — use Rational for exact Islamic fractions",
    "import 'package:rational/rational.dart';",
    "",
    "final Rational half    = Rational.fromInt(1, 2);  // 1/2",
    "final Rational quarter = Rational.fromInt(1, 4);  // 1/4",
    "final Rational sixth   = Rational.fromInt(1, 6);  // 1/6",
    "final Rational twoThird = Rational.fromInt(2, 3); // 2/3",
    "",
    "// ❌ WRONG — never use double for share calculations",
    "// double half = 0.5; // May cause floating point imprecision",
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3: PROJECT SETUP & FOLDER STRUCTURE
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 3: PROJECT SETUP & FOLDER STRUCTURE", "📁"),
  space(1),
  h1("3. Project Setup & Folder Structure", C.green),
  h2("3.1 Initial Project Creation"),
  p("Run the following commands to create and configure the project:"),
  codeBlock([
    "# Step 1: Create Flutter project",
    "flutter create meeras_calculator --org com.yourorg --platforms android,ios,web",
    "",
    "# Step 2: Navigate to project",
    "cd meeras_calculator",
    "",
    "# Step 3: Add all required dependencies to pubspec.yaml",
    "flutter pub add flutter_localizations --sdk=flutter",
    "flutter pub add intl",
    "flutter pub add flutter_riverpod",
    "flutter pub add rational",
    "flutter pub add hive hive_flutter",
    "flutter pub add go_router",
    "flutter pub add pdf printing",
    "flutter pub add flutter_svg",
    "",
    "# Step 4: Enable localization code generation in pubspec.yaml",
    "# Add under flutter: section:",
    "#   generate: true",
    "",
    "# Step 5: Create l10n.yaml in project root",
    "# (see Section 4 for full i18n setup)",
    "",
    "# Step 6: Run app to verify setup",
    "flutter run -d chrome  # For web",
    "flutter run            # For connected device",
  ]),
  space(1),
  h2("3.2 pubspec.yaml Configuration"),
  codeBlock([
    "name: meeras_calculator",
    "description: Islamic Inheritance Calculator — Offline, All Languages, All Madhabs",
    "version: 1.0.0+1",
    "",
    "environment:",
    "  sdk: '>=3.0.0 <4.0.0'",
    "",
    "dependencies:",
    "  flutter:",
    "    sdk: flutter",
    "  flutter_localizations:",
    "    sdk: flutter",
    "  intl: ^0.19.0",
    "  flutter_riverpod: ^2.5.1",
    "  rational: ^2.2.3",
    "  hive: ^2.2.3",
    "  hive_flutter: ^1.1.0",
    "  go_router: ^13.2.0",
    "  pdf: ^3.10.8",
    "  printing: ^5.11.0",
    "  flutter_svg: ^2.0.10",
    "",
    "flutter:",
    "  generate: true",
    "  uses-material-design: true",
    "  assets:",
    "    - assets/icons/",
    "    - assets/fonts/",
  ]),
  space(1),
  h2("3.3 Complete Folder Structure"),
  codeBlock([
    "meeras_calculator/",
    "├── lib/",
    "│   ├── main.dart                    # App entry point",
    "│   ├── app.dart                     # MaterialApp + i18n setup",
    "│   ├── router.dart                  # go_router navigation config",
    "│   │",
    "│   ├── core/",
    "│   │   ├── constants/",
    "│   │   │   ├── heir_types.dart      # Enum: all 11 + Asabah heirs",
    "│   │   │   └── madhab_types.dart    # Enum: Hanafi, Maliki, Shafii, Hanbali",
    "│   │   ├── models/",
    "│   │   │   ├── heir.dart            # Heir model with share + exclusion",
    "│   │   │   ├── estate.dart          # Estate model (total value, currency)",
    "│   │   │   └── inheritance_result.dart  # Final calculation output",
    "│   │   └── theme/",
    "│   │       └── app_theme.dart       # Colors, fonts, Islamic green theme",
    "│   │",
    "│   ├── engine/                      # THE CALCULATION CORE",
    "│   │   ├── fraction_utils.dart      # Rational math helpers",
    "│   │   ├── hajb_engine.dart         # Exclusion (Hajb) logic",
    "│   │   ├── furudh_engine.dart       # Module 1: Quota shares",
    "│   │   ├── asabah_engine.dart       # Module 2: Residuary logic",
    "│   │   ├── awl_engine.dart          # Awl (proportional reduction)",
    "│   │   ├── radd_engine.dart         # Radd (return of remainder)",
    "│   │   ├── madhab_engine.dart       # Madhab difference overrides",
    "│   │   └── inheritance_calculator.dart  # Main orchestrator",
    "│   │",
    "│   ├── ui/",
    "│   │   ├── screens/",
    "│   │   │   ├── home_screen.dart",
    "│   │   │   ├── question_flow_screen.dart  # Step-by-step questions",
    "│   │   │   ├── result_screen.dart",
    "│   │   │   ├── history_screen.dart",
    "│   │   │   ├── settings_screen.dart",
    "│   │   │   └── about_screen.dart",
    "│   │   ├── widgets/",
    "│   │   │   ├── heir_card.dart",
    "│   │   │   ├── share_pie_chart.dart",
    "│   │   │   ├── madhab_selector.dart",
    "│   │   │   ├── question_card.dart",
    "│   │   │   └── share_fraction_display.dart",
    "│   │   └── dialogs/",
    "│   │       └── explanation_dialog.dart  # Quran/Hadith source popup",
    "│   │",
    "│   ├── providers/",
    "│   │   ├── calculation_provider.dart",
    "│   │   ├── settings_provider.dart",
    "│   │   └── history_provider.dart",
    "│   │",
    "│   └── l10n/                        # All translations",
    "│       ├── app_en.arb               # English (template)",
    "│       ├── app_ar.arb               # Arabic",
    "│       ├── app_ur.arb               # Urdu",
    "│       ├── app_fr.arb               # French",
    "│       ├── app_tr.arb               # Turkish",
    "│       ├── app_id.arb               # Indonesian",
    "│       ├── app_ms.arb               # Malay",
    "│       ├── app_bn.arb               # Bengali",
    "│       └── [all other languages]",
    "│",
    "├── test/",
    "│   ├── engine/",
    "│   │   ├── furudh_engine_test.dart",
    "│   │   ├── asabah_engine_test.dart",
    "│   │   ├── awl_engine_test.dart",
    "│   │   └── radd_engine_test.dart",
    "│   └── widget/",
    "│       └── question_flow_test.dart",
    "│",
    "├── l10n.yaml                        # i18n config (project root)",
    "└── pubspec.yaml",
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 4: INTERNATIONALIZATION
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 4: INTERNATIONALIZATION — ALL LANGUAGE SUPPORT", "🌍"),
  space(1),
  h1("4. Internationalization (All-Language Support)", C.green),
  h2("4.1 Strategy Overview"),
  p("Flutter's official flutter_localizations package supports 115+ languages via ARB (Application Resource Bundle) files. These are simple JSON files stored inside lib/l10n/ — all translations are bundled at build time, making the app 100% offline."),
  space(0),
  alertBox("✅ Key Point",
    "All translation files are included in the app bundle at build time. No internet connection is needed to switch languages. Users can change the app language from the Settings screen, or the app auto-detects from the device's system locale.",
    C.lightGreen, C.green),
  space(1),
  h2("4.2 l10n.yaml Configuration (Project Root)"),
  codeBlock([
    "# l10n.yaml — place in project root (same level as pubspec.yaml)",
    "arb-dir: lib/l10n",
    "template-arb-file: app_en.arb",
    "output-localization-file: app_localizations.dart",
    "output-class: AppLocalizations",
    "nullable-getter: false",
    "preferred-supported-locales:",
    "  - en",
    "  - ar",
    "  - ur",
    "  - fr",
    "  - tr",
    "  - id",
    "  - ms",
    "  - bn",
    "  - hi",
    "  - sw",
    "  - ha",
    "  - ps",
    "  - fa",
  ]),
  space(1),
  h2("4.3 Template ARB File (app_en.arb — English)"),
  codeBlock([
    "{",
    "  \"@@locale\": \"en\",",
    "",
    "  \"appTitle\": \"Meeras Calculator\",",
    "  \"@appTitle\": { \"description\": \"App name\" },",
    "",
    "  \"startCalculation\": \"Start Calculation\",",
    "  \"selectMadhab\": \"Select Your Madhab (School of Law)\",",
    "  \"madhab_hanafi\": \"Hanafi\",",
    "  \"madhab_maliki\": \"Maliki\",",
    "  \"madhab_shafii\": \"Shafi'i\",",
    "  \"madhab_hanbali\": \"Hanbali\",",
    "",
    "  \"q_deceased_gender\": \"Is the deceased male or female?\",",
    "  \"q_has_husband\": \"Did the deceased leave a husband?\",",
    "  \"q_has_wife\": \"Did the deceased leave a wife or wives?\",",
    "  \"q_wife_count\": \"How many wives?\",",
    "  \"q_has_son\": \"Did the deceased leave a son?\",",
    "  \"q_has_daughter\": \"Did the deceased leave a daughter?\",",
    "  \"q_has_father\": \"Is the father of the deceased alive?\",",
    "  \"q_has_mother\": \"Is the mother of the deceased alive?\",",
    "  \"q_has_grandfather\": \"Is the paternal grandfather alive (father's father)?\",",
    "  \"q_has_grandmother\": \"Are any grandmothers alive?\",",
    "  \"q_has_grandson\": \"Did the deceased leave a grandson (son's son)?\",",
    "  \"q_has_granddaughter\": \"Did the deceased leave a granddaughter (son's daughter)?\",",
    "  \"q_has_full_brother\": \"Did the deceased leave a full brother?\",",
    "  \"q_has_full_sister\": \"Did the deceased leave a full sister?\",",
    "  \"q_has_paternal_brother\": \"Did the deceased leave a consanguine (paternal half) brother?\",",
    "  \"q_has_paternal_sister\": \"Did the deceased leave a consanguine (paternal half) sister?\",",
    "  \"q_has_uterine_sibling\": \"Did the deceased leave a uterine (maternal half) sibling?\",",
    "  \"q_has_full_nephew\": \"Did the deceased leave a full brother's son?\",",
    "  \"q_has_paternal_uncle\": \"Did the deceased leave a full paternal uncle?\",",
    "",
    "  \"heir_husband\": \"Husband\",",
    "  \"heir_wife\": \"Wife\",",
    "  \"heir_father\": \"Father\",",
    "  \"heir_mother\": \"Mother\",",
    "  \"heir_son\": \"Son\",",
    "  \"heir_daughter\": \"Daughter\",",
    "  \"heir_grandfather\": \"Paternal Grandfather\",",
    "  \"heir_grandmother\": \"Grandmother\",",
    "  \"heir_grandson\": \"Grandson (Son's Son)\",",
    "  \"heir_granddaughter\": \"Granddaughter (Son's Daughter)\",",
    "  \"heir_full_brother\": \"Full Brother\",",
    "  \"heir_full_sister\": \"Full Sister\",",
    "  \"heir_consanguine_brother\": \"Consanguine Brother\",",
    "  \"heir_consanguine_sister\": \"Consanguine Sister\",",
    "  \"heir_uterine_sibling\": \"Uterine Sibling\",",
    "",
    "  \"result_title\": \"Inheritance Distribution\",",
    "  \"share_label\": \"Share\",",
    "  \"fraction_label\": \"Fraction\",",
    "  \"amount_label\": \"Amount\",",
    "  \"excluded_label\": \"Excluded (Mahjub)\",",
    "  \"reason_label\": \"Reason\",",
    "  \"quran_ref_label\": \"Quranic Reference\",",
    "  \"awl_applied\": \"Awl (Proportional Reduction) Applied\",",
    "  \"radd_applied\": \"Radd (Return of Remainder) Applied\",",
    "",
    "  \"btn_yes\": \"Yes\",",
    "  \"btn_no\": \"No\",",
    "  \"btn_next\": \"Next\",",
    "  \"btn_back\": \"Back\",",
    "  \"btn_calculate\": \"Calculate Inheritance\",",
    "  \"btn_export_pdf\": \"Export as PDF\",",
    "  \"btn_new_case\": \"New Case\",",
    "  \"btn_save\": \"Save Case\",",
    "",
    "  \"settings_language\": \"App Language\",",
    "  \"settings_madhab\": \"Default Madhab\",",
    "  \"settings_theme\": \"Theme\",",
    "  \"settings_show_references\": \"Show Quranic References\",",
    "",
    "  \"about_title\": \"About Meeras Calculator\",",
    "  \"disclaimer\": \"This app provides guidance based on classical Islamic inheritance law. For large estates or complex situations, always consult a qualified Islamic scholar.\",",
    "",
    "  \"error_no_heirs\": \"No valid heirs entered. Please go back and check heir selection.\",",
    "  \"error_calculation\": \"A calculation error occurred. Please check your entries and try again.\"",
    "}",
  ]),
  space(1),
  h2("4.4 Arabic ARB Sample (app_ar.arb)"),
  codeBlock([
    "{",
    "  \"@@locale\": \"ar\",",
    "  \"appTitle\": \"حاسبة الميراث\",",
    "  \"startCalculation\": \"ابدأ الحساب\",",
    "  \"selectMadhab\": \"اختر مذهبك\",",
    "  \"q_deceased_gender\": \"هل المتوفى ذكر أم أنثى؟\",",
    "  \"btn_yes\": \"نعم\",",
    "  \"btn_no\": \"لا\",",
    "  \"heir_husband\": \"الزوج\",",
    "  \"heir_wife\": \"الزوجة\",",
    "  \"heir_father\": \"الأب\",",
    "  \"heir_mother\": \"الأم\",",
    "  \"heir_son\": \"الابن\",",
    "  \"heir_daughter\": \"البنت\"",
    "  ... (all other keys translated to Arabic)",
    "}",
  ]),
  space(1),
  h2("4.5 RTL (Right-to-Left) Language Handling"),
  p("The app must support RTL languages (Arabic, Urdu, Farsi, Hebrew). Flutter handles this automatically when the locale is RTL. Add Directionality awareness to your app:"),
  codeBlock([
    "// In app.dart",
    "MaterialApp.router(",
    "  locale: ref.watch(settingsProvider).locale,",
    "  localizationsDelegates: AppLocalizations.localizationsDelegates,",
    "  supportedLocales: AppLocalizations.supportedLocales,",
    "  // Flutter automatically flips layout for RTL locales (ar, ur, fa, he)",
    "  // No extra code needed — just use standard Flutter layout widgets",
    ");",
    "",
    "// RTL-safe text alignment — always use TextAlign.start (not .left)",
    "Text(",
    "  AppLocalizations.of(context).heir_husband,",
    "  textAlign: TextAlign.start,  // ✅ auto-flips for RTL",
    ")",
  ]),
  space(1),
  h2("4.6 Languages Priority List"),
  twoColTable([
    ["Priority", "Language — Locale Code", true],
    ["Tier 1 (Launch)", "English (en), Arabic (ar), Urdu (ur), French (fr), Turkish (tr)"],
    ["Tier 2 (Launch)", "Indonesian (id), Malay (ms), Bengali (bn), Hausa (ha), Swahili (sw)"],
    ["Tier 3 (Post-launch)", "Persian/Farsi (fa), Pashto (ps), Hindi (hi), Somali (so), Wolof (wo)"],
    ["Auto-detect", "App reads device locale → loads matching ARB file → falls back to English"],
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 5: MODULE 1 — ZAWI AL-FURUDH ENGINE
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 5: MODULE 1 — ZAWI AL-FURUDH (QUOTA HEIRS)", "☪"),
  space(1),
  h1("5. Calculation Engine — Module 1: Zawi al-Furudh", C.green),
  h2("5.1 Processing Rules"),
  alertBox("🔑 Iron Rule",
    "Module 1 ALWAYS runs first. The Husband, Wife, Father, Mother, Son, and Daughter are PRIMARY HEIRS — they are NEVER completely excluded. All 11 heirs below must be evaluated in order, with exclusion (Hajb) logic applied before any share is assigned.",
    C.lightGold, C.gold),
  space(1),
  h2("5.2 The 11 Primary Quota Heirs — Full Logic Table"),
  space(0),
  h3("Heir 1: Husband"),
  twoColTable([
    ["Condition", "Share", true],
    ["No child OR grandson exists", "1/2 (one half)"],
    ["Child OR grandson exists", "1/4 (one quarter)"],
    ["Exclusion Triggers (Hajb)", "NONE — Husband is never excluded"],
    ["Quranic Source", "Surah An-Nisa 4:12"],
  ]),
  space(0),
  h3("Heir 2: Wife (1 to 4 wives)"),
  twoColTable([
    ["Condition", "Share", true],
    ["No child OR grandson exists", "1/4 — divided equally among all wives"],
    ["Child OR grandson exists", "1/8 — divided equally among all wives"],
    ["If 2 wives", "Each gets 1/2 of wife's total share"],
    ["If 3 wives", "Each gets 1/3 of wife's total share"],
    ["If 4 wives", "Each gets 1/4 of wife's total share"],
    ["Exclusion Triggers (Hajb)", "NONE — Wife is never excluded"],
    ["Quranic Source", "Surah An-Nisa 4:12"],
  ]),
  space(0),
  h3("Heir 3: Father"),
  twoColTable([
    ["State", "Condition → Share", true],
    ["State 1", "Male descendant (son/grandson) exists → Fixed 1/6 only"],
    ["State 2", "Only female descendants (daughter/granddaughter) exist → 1/6 fixed + Asabah (takes remainder)"],
    ["State 3", "No descendants exist → Pure Asabah (inherits entire remainder after spouses)"],
    ["Exclusion Triggers (Hajb)", "NONE — Father is never excluded"],
    ["Additional Rule", "Father's presence EXCLUDES: Paternal Grandfather, Full Brother, Consanguine Brother, Full Nephew"],
    ["Quranic Source", "Surah An-Nisa 4:11"],
  ]),
  space(0),
  h3("Heir 4: Mother"),
  twoColTable([
    ["State", "Condition → Share", true],
    ["State 1 (General)", "Child, grandson, OR 2+ siblings of any type exist → Fixed 1/6"],
    ["State 2 (Umariyyatain)", "ONLY (Husband OR Wife) AND Father exist, no others → 1/3 of the REMAINDER (after spouse share)"],
    ["State 3 (Open)", "None of the above conditions → 1/3 of total estate"],
    ["Exclusion Triggers (Hajb)", "NONE — Mother is never excluded"],
    ["Note on State 2", "This is the famous 'Umariyyatain' case — ruled by Caliph Umar (RA). Mother gets 1/3 of what remains AFTER husband/wife takes their share"],
    ["Quranic Source", "Surah An-Nisa 4:11"],
  ]),
  space(0),
  h3("Heir 5: Daughter"),
  twoColTable([
    ["Condition", "Share", true],
    ["Son also present", "Becomes Asabah bi-Ghayrihi (co-residuary) — ratio 2:1 (son:daughter)"],
    ["Single daughter, no son", "1/2 (one half) fixed"],
    ["2 or more daughters, no son", "2/3 shared equally among all daughters"],
    ["Exclusion Triggers (Hajb)", "NONE — Daughter is never excluded"],
    ["Quranic Source", "Surah An-Nisa 4:11"],
  ]),
  space(0),
  h3("Heir 6: Paternal Grandfather"),
  twoColTable([
    ["Rule", "Detail", true],
    ["Base Logic", "Identical to Father's 3 states (see Heir 3 above)"],
    ["Exception", "NOT included in Mother's Umariyyatain (State 2) — Mother gets 1/3 of total, not remainder"],
    ["Exclusion 1", "EXCLUDED if Father is alive"],
    ["Exclusion 2", "EXCLUDED if a closer Paternal Grandfather is alive (i.e., father's father comes before father's father's father)"],
    ["Madhab Note", "Hanafi: Grandfather COMPLETELY excludes all siblings. Shafi'i, Maliki, Hanbali: Siblings share with Grandfather"],
  ]),
  space(0),
  h3("Heir 7: True Grandmother (Maternal & Paternal)"),
  twoColTable([
    ["Condition", "Share", true],
    ["Present (any)", "1/6 — shared equally between all grandmothers of same degree"],
    ["Maternal Grandmother", "Excluded ONLY if Mother is alive"],
    ["Paternal Grandmother", "Excluded if Mother, Father, OR Paternal Grandfather is alive"],
    ["Multiple Grandmothers", "Two grandmothers of same degree share the 1/6 equally"],
    ["Exclusion Triggers (Hajb)", "All excluded if Mother is alive; Paternal excluded if Father/Grandfather alive"],
    ["Quranic Source", "Hadith — reported by Ibn Masud (RA)"],
  ]),
  space(0),
  h3("Heir 8: Granddaughter (Son's Daughter)"),
  twoColTable([
    ["Condition", "Share", true],
    ["Son's Grandson also present (or lower male)", "Becomes Asabah bi-Ghayrihi — ratio 2:1"],
    ["Single granddaughter, no son", "1/2"],
    ["2+ granddaughters, no son", "2/3 shared"],
    ["Exactly 1 Daughter already has 1/2", "Granddaughter gets 1/6 (completing 2/3 female descendant share)"],
    ["Exclusion 1", "EXCLUDED if Son is alive"],
    ["Exclusion 2", "EXCLUDED if 2+ Daughters exist (unless paired with a male counterpart grandson)"],
  ]),
  space(0),
  h3("Heir 9: Full Sister"),
  twoColTable([
    ["Condition", "Share", true],
    ["Full Brother also present", "Asabah bi-Ghayrihi — ratio 2:1 (brother:sister)"],
    ["Daughter or Granddaughter present (no brother)", "Asabah ma'a Ghayrihi — takes remainder"],
    ["Single full sister, alone", "1/2"],
    ["2+ full sisters, no brother", "2/3 shared equally"],
    ["Excluded by", "Son, Grandson, Father, OR Paternal Grandfather being alive"],
  ]),
  space(0),
  h3("Heir 10: Consanguine (Paternal Half) Sister"),
  twoColTable([
    ["Condition", "Share", true],
    ["Consanguine Brother present", "Asabah bi-Ghayrihi — ratio 2:1"],
    ["Daughter/Granddaughter present (no brother)", "Asabah ma'a Ghayrihi — takes remainder"],
    ["Single consanguine sister, alone", "1/2"],
    ["2+ consanguine sisters, alone", "2/3 shared"],
    ["Exactly 1 Full Sister already has 1/2", "Consanguine Sister gets 1/6 to complete 2/3"],
    ["Excluded by", "Son, Grandson, Father, Paternal Grandfather, Full Brother, OR 2+ Full Sisters"],
  ]),
  space(0),
  h3("Heir 11: Uterine (Maternal Half) Sibling"),
  twoColTable([
    ["Condition", "Share", true],
    ["Single uterine sibling", "1/6"],
    ["2+ uterine siblings", "1/3 shared equally (no gender difference — male and female share equally)"],
    ["Excluded by", "Any child, grandson, Father, OR Paternal Grandfather being alive"],
    ["Quranic Source", "Surah An-Nisa 4:12"],
  ]),
  space(1),
  h2("5.3 Dart Implementation: Furudh Engine"),
  codeBlock([
    "// lib/engine/furudh_engine.dart",
    "import 'package:rational/rational.dart';",
    "import '../core/models/heir.dart';",
    "import '../core/models/inheritance_result.dart';",
    "",
    "class FurudhEngine {",
    "  InheritanceResult calculate(HeirSelection heirs, Madhab madhab) {",
    "    Map<HeirType, Rational> shares = {};",
    "    Map<HeirType, String> exclusionReasons = {};",
    "    ",
    "    final hasChild = heirs.hasSon || heirs.hasDaughter;",
    "    final hasGrandson = heirs.hasGrandson;",
    "    final hasDescendant = hasChild || hasGrandson;",
    "    final hasMaleDescendant = heirs.hasSon || heirs.hasGrandson;",
    "",
    "    // ── Heir 1: Husband ──────────────────────────────────────────────",
    "    if (heirs.hasHusband) {",
    "      shares[HeirType.husband] = hasDescendant",
    "        ? Rational.fromInt(1, 4)   // 1/4 if descendant exists",
    "        : Rational.fromInt(1, 2);  // 1/2 if no descendant",
    "    }",
    "",
    "    // ── Heir 2: Wife/Wives ────────────────────────────────────────────",
    "    if (heirs.wifeCount > 0) {",
    "      final totalWifeShare = hasDescendant",
    "        ? Rational.fromInt(1, 8)   // 1/8 if descendant exists",
    "        : Rational.fromInt(1, 4);  // 1/4 if no descendant",
    "      // Each wife gets totalWifeShare / wifeCount",
    "      shares[HeirType.wife] = totalWifeShare;  // Store total; divide at display",
    "    }",
    "",
    "    // ── Heir 3: Father ────────────────────────────────────────────────",
    "    if (heirs.hasFather) {",
    "      if (hasMaleDescendant) {",
    "        shares[HeirType.father] = Rational.fromInt(1, 6); // State 1: fixed 1/6",
    "      } else if (hasDescendant) {",
    "        shares[HeirType.father] = Rational.fromInt(1, 6); // State 2: 1/6 + asabah",
    "        // asabah remainder calculated in AsabahEngine",
    "      }",
    "      // State 3: no descendants — pure asabah (handled in AsabahEngine)",
    "    }",
    "",
    "    // ── [Continue for all 11 heirs...] ───────────────────────────────",
    "    return InheritanceResult(shares: shares, exclusions: exclusionReasons);",
    "  }",
    "}",
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 6: MODULE 2 — ASABAH ENGINE
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 6: MODULE 2 — ASABAH ENGINE (RESIDUARIES)", "⚖"),
  space(1),
  h1("6. Calculation Engine — Module 2: Asabah Engine", C.green),
  h2("6.1 Core Asabah Rule"),
  alertBox("🔑 Processing Rule",
    "The Asabah Engine runs AFTER Module 1 (Furudh). First, calculate the total of all quota shares. The REMAINDER (Estate minus Quota Shares) goes to Asabah. If Remainder = 0 (or less), Asabah heirs get nothing. If Remainder > Estate (Awl scenario), apply proportional reduction before Asabah runs.",
    C.lightBlue, C.blue),
  space(1),
  h2("6.2 Category 1: Asabah bi-Nafsihi (Independent Male Residuaries)"),
  p("Strict top-to-bottom priority. A match in a higher level INSTANTLY excludes all lower levels."),
  twoColTable([
    ["Category", "Hierarchy & Exclusion Rules", true],
    ["1A — Descendants", "Son → Excludes → Son's Son (Grandson) → Excludes → Great-grandson (and so on downward)"],
    ["1B — Ascendants", "Father → Excludes → Paternal Grandfather → Excludes → Great-grandfather"],
    ["1C — Parents' Descendants", "Full Brother → Consanguine Brother → Full Brother's Son (Nephew) → Consanguine Nephew"],
    ["1D — Grandparents' Descendants", "Full Paternal Uncle → Consanguine Paternal Uncle → Full Paternal Cousin (Uncle's Son) → Consanguine Cousin"],
    ["Iron Rule", "If Category 1A has a living heir, Categories 1B, 1C, 1D ALL receive nothing."],
    ["Note", "Uterine brothers (maternal half-brothers) are NOT Asabah — they are Quota Heirs only (1/6 or 1/3)"],
  ]),
  space(1),
  h2("6.3 Category 2: Asabah bi-Ghayrihi (Females with Males — 2:1 Rule)"),
  p("These females become residuaries ONLY when their male counterpart is present. The male:female ratio is always 2:1."),
  twoColTable([
    ["Female Heir", "Trigger (Male Counterpart Required)", true],
    ["Daughter(s)", "Son(s) present — together they share the residue 2:1"],
    ["Granddaughter(s)", "Grandson (son's son) or lower male grandson present — share 2:1"],
    ["Full Sister(s)", "Full Brother(s) present — share 2:1"],
    ["Consanguine Sister(s)", "Consanguine Brother(s) present — share 2:1"],
  ]),
  space(1),
  h2("6.4 Category 3: Asabah ma'a Ghayrihi (Sisters Acting with Daughters)"),
  p("When daughters/granddaughters are present but NO brothers exist, sisters become 'honorary' residuaries to absorb the remainder. This prevents the estate from going to Bayt al-Mal unnecessarily."),
  twoColTable([
    ["Scenario", "Rule", true],
    ["Full Sister + Daughter/Granddaughter, no Full Brother", "Full Sister becomes Asabah — takes entire remainder"],
    ["Full Sister as Asabah", "She now acts like a Full Brother — COMPLETELY EXCLUDES Consanguine siblings"],
    ["Consanguine Sister + Daughter/Granddaughter, no Full Sister or any Brother", "Consanguine Sister becomes Asabah — takes entire remainder"],
    ["Priority", "Category 3 only activates if Category 1 (all four sub-categories) have no living heir"],
  ]),
  space(1),
  h2("6.5 Awl: When Total Quota Shares Exceed 100%"),
  alertBox("📊 Awl (Proportional Reduction)",
    "If the sum of all Quota Shares exceeds 1 (100%), Awl is applied. All shares are reduced proportionally. The denominator of the total is increased until all shares fit. Example: If shares total 7/6, the denominator increases to 7 — making each share smaller by the same proportion. This was the ruling of Caliph Ali ibn Abi Talib (RA).",
    C.lightPurple, C.purple),
  space(0),
  codeBlock([
    "// lib/engine/awl_engine.dart",
    "import 'package:rational/rational.dart';",
    "",
    "class AwlEngine {",
    "  /// If total quota shares > 1, apply Awl (proportional reduction)",
    "  Map<HeirType, Rational> applyAwl(Map<HeirType, Rational> shares) {",
    "    Rational total = shares.values.fold(Rational.zero, (a, b) => a + b);",
    "    ",
    "    if (total <= Rational.one) return shares; // No Awl needed",
    "    ",
    "    // Awl: divide each share by the total (proportional reduction)",
    "    return shares.map((heir, share) => MapEntry(heir, share / total));",
    "  }",
    "}",
    "",
    "// Example: Husband=1/2, Two Daughters=2/3, Mother=1/6",
    "// Total = 1/2 + 2/3 + 1/6 = 3/6 + 4/6 + 1/6 = 8/6 > 1",
    "// Awl denominator = 8 (common denominator of all shares)",
    "// Husband gets 3/8, Two Daughters get 4/8, Mother gets 1/8",
  ]),
  space(1),
  h2("6.6 Radd: When Remainder Exists After All Shares (No Asabah)"),
  alertBox("💰 Radd (Return of Surplus)",
    "If the total quota shares are LESS than 1 and there is NO Asabah heir, the remainder is returned to the quota heirs proportionally (Radd). IMPORTANT MADHAB DIFFERENCE: Hanafi + Hanbali apply Radd to all quota heirs EXCEPT the spouse. Maliki + Shafi'i: Remainder goes to Bayt al-Mal (Islamic treasury). Modern Shafi'i/Maliki scholars accept Radd when no functional treasury exists.",
    C.lightGreen, C.green),
  space(0),
  twoColTable([
    ["Madhab", "Radd Rule", true],
    ["Hanafi", "Radd to all quota heirs EXCEPT spouse — applied automatically"],
    ["Hanbali", "Radd to all quota heirs EXCEPT spouse — same as Hanafi"],
    ["Shafi'i", "Classically: remainder to Bayt al-Mal. Modern opinion: Radd if no treasury"],
    ["Maliki", "Classically: remainder to Bayt al-Mal. Modern opinion: Radd if no treasury"],
    ["Spouse (all Madhabs)", "Spouse NEVER participates in Radd — their share is always fixed"],
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 7: MADHAB DIFFERENCES ENGINE
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 7: MADHAB DIFFERENCES ENGINE", "📚"),
  space(1),
  h1("7. Madhab Differences Engine", C.green),
  h2("7.1 Overview of Differences"),
  p("The four Sunni Madhabs agree on virtually all fundamental inheritance rules derived from clear Quranic verses. Key differences emerge in specific edge cases. The app must handle each of the following differences and flag them clearly in the UI."),
  space(1),
  h2("7.2 Key Differences Table"),
  threeColTable([
    ["Scenario", "Hanafi / Hanbali", "Maliki / Shafi'i", true],
    ["Radd (surplus after quota, no Asabah)", "Return to heirs (excl. spouse)", "Goes to Bayt al-Mal"],
    ["Grandfather + Siblings co-exist", "Grandfather FULLY excludes all siblings", "Siblings share with Grandfather"],
    ["Dhul al-Arham (distant kindred)", "Inherit if no closer heirs exist", "Do NOT inherit; goes to treasury"],
    ["Paternal Grandmother + Father", "Paternal Granny excluded by Father", "Paternal Granny excluded by Father (same)"],
    ["Mother's share reduction trigger", "Two brothers OR two sisters suffice", "Maliki: needs 2 brothers minimum"],
    ["Uterine siblings + Grandfather", "Excluded by Grandfather (same)", "Excluded by Grandfather (same)"],
    ["Simultaneous death (Mafqud)", "Assume simultaneous; neither inherits from the other", "Shafi'i: suspend distribution"],
  ]),
  space(1),
  h2("7.3 Implementing Madhab Engine in Dart"),
  codeBlock([
    "// lib/engine/madhab_engine.dart",
    "enum Madhab { hanafi, maliki, shafii, hanbali }",
    "",
    "class MadhabEngine {",
    "  /// Returns true if Radd should be applied to non-spouse heirs",
    "  bool applyRadd(Madhab madhab) {",
    "    return madhab == Madhab.hanafi || madhab == Madhab.hanbali;",
    "    // Maliki/Shafi'i: return false (classically)",
    "    // App can offer 'modern opinion' toggle in settings",
    "  }",
    "",
    "  /// Returns true if grandfather excludes siblings",
    "  bool grandfatherExcludesSiblings(Madhab madhab) {",
    "    return madhab == Madhab.hanafi; // Only Hanafi fully excludes",
    "  }",
    "",
    "  /// Returns true if Dhul al-Arham (distant kindred) can inherit",
    "  bool allowsDhulAlArham(Madhab madhab) {",
    "    return madhab == Madhab.hanafi || madhab == Madhab.hanbali;",
    "  }",
    "",
    "  /// Returns minimum siblings to reduce mother's share",
    "  int minSiblingsForMotherReduction(Madhab madhab) {",
    "    if (madhab == Madhab.maliki) return 2; // Maliki: needs 2 brothers",
    "    return 2; // Others: 2 siblings of any gender",
    "  }",
    "}",
  ]),
  space(1),
  h2("7.4 UI: Madhab Difference Flag"),
  p("Whenever a Madhab difference affects the result, the app must show a clear flag in the result screen, like:"),
  alertBox("⚠️ Madhab Difference Detected",
    "This case involves the grandfather + siblings scenario. Under your selected Madhab (Hanafi), the grandfather fully excludes all siblings. Under Maliki, Shafi'i, and Hanbali, the full brother would share with the grandfather. Tap to see all four Madhab results side-by-side.",
    C.lightGold, C.gold),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 8: STEP-BY-STEP UI QUESTION FLOW
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 8: STEP-BY-STEP QUESTION FLOW LOGIC", "❓"),
  space(1),
  h1("8. Step-by-Step UI Flow — Question Logic", C.green),
  h2("8.1 Design Principle: Smart Adaptive Questions"),
  p("The app never shows all questions at once. It uses a state machine to determine WHICH question to ask next based on previous answers. Only relevant heirs are asked about. This dramatically simplifies the experience — a simple case (husband + 2 sons) takes 4 questions; a complex case may take 10-15 questions."),
  space(1),
  h2("8.2 Question Flow State Machine"),
  twoColTable([
    ["Step #", "Question → Branch Logic", true],
    ["Step 1", "Select Madhab (Hanafi / Maliki / Shafi'i / Hanbali)"],
    ["Step 2", "Was the deceased male or female? → This determines which spouse question comes next"],
    ["Step 3", "IF deceased = Male → 'Did he leave a wife or wives?' → Ask count (1-4)\nIF deceased = Female → 'Did she leave a husband?'"],
    ["Step 4", "Is the Father alive? → YES branches skip Grandfather question"],
    ["Step 5", "Is the Mother alive?"],
    ["Step 6 (conditional)", "IF Father is NOT alive → 'Is the Paternal Grandfather alive?'"],
    ["Step 7 (conditional)", "IF Mother is NOT alive → 'Are any grandmothers alive?'"],
    ["Step 8", "Did the deceased leave a Son? → YES: daughter becomes Asabah; skip sister quota questions"],
    ["Step 9 (conditional)", "IF no Son → 'Did the deceased leave a Daughter?' → Ask count"],
    ["Step 10 (conditional)", "IF no Son → 'Did the deceased leave a Grandson (son's son)?'"],
    ["Step 11 (conditional)", "IF no Son and has Daughter or Grandson → 'Did they leave a Granddaughter (son's daughter)?'"],
    ["Step 12 (conditional)", "IF no Son, no Grandson, no Father, no Grandfather → 'Did they leave a Full Brother?'"],
    ["Step 13 (conditional)", "IF no Son, no Grandson, no Father, no Grandfather → 'Did they leave a Full Sister?'"],
    ["Step 14 (conditional)", "IF no Full Brother → 'Did they leave a Consanguine (Paternal Half) Brother?'"],
    ["Step 15 (conditional)", "IF no Full Sister (or she becomes Asabah) → 'Did they leave a Consanguine Sister?'"],
    ["Step 16 (conditional)", "IF no Son, no Grandson, no Father, no Grandfather → 'Did they leave a Uterine (Maternal Half) Sibling?'"],
    ["Step 17 (conditional)", "IF Asabah slots still unfilled → 'Did they leave a Full Paternal Uncle?'"],
    ["Step 18 (conditional)", "IF no Full Paternal Uncle → 'Did they leave a Consanguine Paternal Uncle?'"],
    ["Step 19 (optional)", "'What is the total estate value?' (leave blank to show fractions only)"],
    ["Final Step", "Review summary → CALCULATE button → Result Screen"],
  ]),
  space(1),
  h2("8.3 Dart: Question Flow State Model"),
  codeBlock([
    "// lib/ui/screens/question_flow_screen.dart",
    "// Uses Riverpod StateNotifier to track question state",
    "",
    "class QuestionFlowNotifier extends StateNotifier<QuestionFlowState> {",
    "  QuestionFlowNotifier() : super(QuestionFlowState.initial());",
    "",
    "  List<Question> get remainingQuestions {",
    "    final s = state.answers;",
    "    final questions = <Question>[];",
    "",
    "    // Always ask Madhab first",
    "    if (!s.hasAnswer(QKey.madhab)) questions.add(Question.madhab);",
    "",
    "    // Always ask deceased's gender",
    "    if (!s.hasAnswer(QKey.deceasedGender)) questions.add(Question.deceasedGender);",
    "",
    "    // Spouse question depends on deceased's gender",
    "    if (s.isMale && !s.hasAnswer(QKey.hasWife)) questions.add(Question.hasWife);",
    "    if (s.isFemale && !s.hasAnswer(QKey.hasHusband)) questions.add(Question.hasHusband);",
    "",
    "    // Parents",
    "    if (!s.hasAnswer(QKey.hasFather)) questions.add(Question.hasFather);",
    "    if (!s.hasAnswer(QKey.hasMother)) questions.add(Question.hasMother);",
    "",
    "    // Grandfather only if Father is NOT alive",
    "    if (s.fatherAlive == false && !s.hasAnswer(QKey.hasGrandfather))",
    "      questions.add(Question.hasGrandfather);",
    "",
    "    // Children",
    "    if (!s.hasAnswer(QKey.hasSon)) questions.add(Question.hasSon);",
    "    if (s.sonAlive == false && !s.hasAnswer(QKey.hasDaughter))",
    "      questions.add(Question.hasDaughter);",
    "",
    "    // Siblings only if no son, grandson, father, or grandfather",
    "    final blockedSiblings = s.sonAlive || s.grandsonAlive ||",
    "                            s.fatherAlive || s.grandfatherAlive;",
    "    if (!blockedSiblings) {",
    "      if (!s.hasAnswer(QKey.hasFullBrother)) questions.add(Question.hasFullBrother);",
    "      // ... etc.",
    "    }",
    "",
    "    return questions;",
    "  }",
    "}",
  ]),
  space(1),
  h2("8.4 Question Card UI Widget"),
  codeBlock([
    "// lib/ui/widgets/question_card.dart",
    "class QuestionCard extends StatelessWidget {",
    "  final Question question;",
    "  final Function(dynamic answer) onAnswer;",
    "",
    "  @override",
    "  Widget build(BuildContext context) {",
    "    final l10n = AppLocalizations.of(context);",
    "    return Card(",
    "      elevation: 4,",
    "      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),",
    "      child: Padding(",
    "        padding: const EdgeInsets.all(24),",
    "        child: Column(",
    "          children: [",
    "            Text(question.getLocalizedText(l10n),",
    "                 style: Theme.of(context).textTheme.headlineSmall),",
    "            const SizedBox(height: 24),",
    "            // For yes/no questions:",
    "            Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [",
    "              ElevatedButton.icon(",
    "                icon: const Icon(Icons.check_circle),",
    "                label: Text(l10n.btn_yes),",
    "                onPressed: () => onAnswer(true),",
    "                style: ElevatedButton.styleFrom(backgroundColor: Colors.green),",
    "              ),",
    "              ElevatedButton.icon(",
    "                icon: const Icon(Icons.cancel),",
    "                label: Text(l10n.btn_no),",
    "                onPressed: () => onAnswer(false),",
    "                style: ElevatedButton.styleFrom(backgroundColor: Colors.red),",
    "              ),",
    "            ]),",
    "          ],",
    "        ),",
    "      ),",
    "    );",
    "  }",
    "}",
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 9: APP SCREENS & NAVIGATION
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 9: APP SCREENS & NAVIGATION", "📱"),
  space(1),
  h1("9. App Screens & Navigation", C.green),
  h2("9.1 Screen Map"),
  twoColTable([
    ["Screen", "Description", true],
    ["Home Screen", "App name, Islamic calligraphy header, 'Start Calculation' button, language & Madhab selectors, history shortcut"],
    ["Madhab Selection", "Four cards (Hanafi, Maliki, Shafi'i, Hanbali) with region info and brief description"],
    ["Question Flow Screen", "Sequential step-by-step questions; progress bar; back button; animated transitions between questions"],
    ["Estate Value Screen", "Optional: enter total estate value (any currency); or skip to show fractions only"],
    ["Summary Screen", "Review all entered heirs before calculating; edit any answer"],
    ["Result Screen", "Full breakdown: each heir's fraction + amount; Awl/Radd applied indicator; Quranic references; pie chart"],
    ["Madhab Comparison", "Side-by-side comparison of all 4 Madhab results for the same case (activated when differences exist)"],
    ["Export Screen", "PDF export options; WhatsApp share; copy to clipboard"],
    ["History Screen", "Saved past calculations via Hive; tap to re-open; delete swipe"],
    ["Settings Screen", "Language selector, default Madhab, theme (light/dark), show/hide Quranic references"],
    ["About Screen", "App info, disclaimer, scholar consultation reminder, version"],
  ]),
  space(1),
  h2("9.2 go_router Navigation Setup"),
  codeBlock([
    "// lib/router.dart",
    "import 'package:go_router/go_router.dart';",
    "",
    "final GoRouter appRouter = GoRouter(",
    "  initialLocation: '/',",
    "  routes: [",
    "    GoRoute(path: '/',          builder: (ctx, state) => const HomeScreen()),",
    "    GoRoute(path: '/madhab',    builder: (ctx, state) => const MadhabScreen()),",
    "    GoRoute(path: '/questions', builder: (ctx, state) => const QuestionFlowScreen()),",
    "    GoRoute(path: '/estate',    builder: (ctx, state) => const EstateValueScreen()),",
    "    GoRoute(path: '/summary',   builder: (ctx, state) => const SummaryScreen()),",
    "    GoRoute(path: '/result',    builder: (ctx, state) => const ResultScreen()),",
    "    GoRoute(path: '/compare',   builder: (ctx, state) => const MadhabComparisonScreen()),",
    "    GoRoute(path: '/history',   builder: (ctx, state) => const HistoryScreen()),",
    "    GoRoute(path: '/settings',  builder: (ctx, state) => const SettingsScreen()),",
    "    GoRoute(path: '/about',     builder: (ctx, state) => const AboutScreen()),",
    "  ],",
    ");",
  ]),
  space(1),
  h2("9.3 Result Screen Features"),
  p("The result screen is the most important screen. It must show:"),
  bullet("Each heir's name (localized) + fraction (e.g., '1/4') + percentage + amount (if estate value entered)"),
  bullet("Excluded heirs listed separately with the reason for exclusion"),
  bullet("A color-coded pie chart with each heir labeled"),
  bullet("Awl/Radd applied badge (if applicable)"),
  bullet("Quran/Hadith source for each share (expandable tap)"),
  bullet("Madhab difference warning (if applicable) with link to comparison view"),
  bullet("Export to PDF button + Share button"),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 10: STATE MANAGEMENT & DATA MODELS
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 10: STATE MANAGEMENT & DATA MODELS", "🗄"),
  space(1),
  h1("10. State Management & Data Models", C.green),
  h2("10.1 Core Data Models"),
  codeBlock([
    "// lib/core/models/heir.dart",
    "enum HeirType {",
    "  husband, wife, father, mother, son, daughter,",
    "  paternalGrandfather, grandmother, grandson, granddaughter,",
    "  fullBrother, fullSister, consanguineBrother, consanguineSister,",
    "  uterineSibling, fullNephew, consanguineNephew,",
    "  fullPaternalUncle, consanguinePaternalUncle, fullCousin, consanguineCousin",
    "}",
    "",
    "class HeirResult {",
    "  final HeirType type;",
    "  final Rational share;        // Exact fraction",
    "  final bool isExcluded;",
    "  final String? exclusionReason;",
    "  final bool isAsabah;",
    "  final String? quranicRef;",
    "  final String? hadithRef;",
    "  final AsabahCategory? asabahCategory;",
    "}",
    "",
    "class InheritanceResult {",
    "  final Map<HeirType, HeirResult> heirResults;",
    "  final bool awlApplied;",
    "  final bool raddApplied;",
    "  final Rational totalShares;   // Should equal 1 after Awl/Radd",
    "  final Madhab madhab;",
    "  final Map<Madhab, Map<HeirType, Rational>>? madhabComparison;",
    "}",
    "",
    "// lib/core/models/heir_selection.dart",
    "class HeirSelection {",
    "  final Madhab madhab;",
    "  final bool deceasedIsMale;",
    "  final bool hasHusband;",
    "  final int wifeCount;         // 0-4",
    "  final bool hasFather;",
    "  final bool hasMother;",
    "  final bool hasPaternalGrandfather;",
    "  final bool hasMaternalGrandmother;",
    "  final bool hasPaternalGrandmother;",
    "  final bool hasSon;",
    "  final bool hasDaughter;",
    "  final int daughterCount;",
    "  final bool hasGrandson;",
    "  final bool hasGranddaughter;",
    "  final bool hasFullBrother;",
    "  final bool hasFullSister;",
    "  final bool hasConsanguineBrother;",
    "  final bool hasConsanguineSister;",
    "  final bool hasUterineSibling;",
    "  final bool hasFullNephew;",
    "  final bool hasConsanguineNephew;",
    "  final bool hasFullPaternalUncle;",
    "  final bool hasConsanguinePaternalUncle;",
    "  final double? estateValue;",
    "  final String? currency;",
    "}",
  ]),
  space(1),
  h2("10.2 Riverpod Providers"),
  codeBlock([
    "// lib/providers/calculation_provider.dart",
    "import 'package:flutter_riverpod/flutter_riverpod.dart';",
    "",
    "final heirSelectionProvider =",
    "  StateNotifierProvider<HeirSelectionNotifier, HeirSelection>(",
    "    (ref) => HeirSelectionNotifier(),",
    "  );",
    "",
    "final inheritanceResultProvider = Provider<AsyncValue<InheritanceResult?>>((ref) {",
    "  final selection = ref.watch(heirSelectionProvider);",
    "  if (!selection.isComplete) return const AsyncValue.data(null);",
    "  try {",
    "    final result = InheritanceCalculator().calculate(selection);",
    "    return AsyncValue.data(result);",
    "  } catch (e, st) {",
    "    return AsyncValue.error(e, st);",
    "  }",
    "});",
    "",
    "final settingsProvider =",
    "  StateNotifierProvider<SettingsNotifier, AppSettings>(",
    "    (ref) => SettingsNotifier(),",
    "  );",
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 11: OFFLINE STORAGE
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 11: OFFLINE STORAGE & PERFORMANCE", "💾"),
  space(1),
  h1("11. Offline Storage & Performance", C.green),
  h2("11.1 Offline Architecture"),
  p("The app is 100% offline. All calculation logic is pure Dart — no API calls, no backend. The only network feature is optional: checking for app updates. All data persists locally via Hive."),
  twoColTable([
    ["Data Type", "Storage Mechanism", true],
    ["Past Calculations", "Hive box: 'history' — stores HeirSelection + InheritanceResult as JSON"],
    ["User Settings", "Hive box: 'settings' — language preference, default Madhab, theme"],
    ["Translation Files", "Bundled in app binary as .arb → compiled Dart — no file system access needed"],
    ["Calculation Logic", "Pure Dart code — runs entirely on-device, no internet"],
  ]),
  space(1),
  h2("11.2 Hive Setup"),
  codeBlock([
    "// lib/main.dart",
    "import 'package:hive_flutter/hive_flutter.dart';",
    "",
    "void main() async {",
    "  WidgetsFlutterBinding.ensureInitialized();",
    "  await Hive.initFlutter();",
    "  Hive.registerAdapter(HeirSelectionAdapter());",
    "  Hive.registerAdapter(InheritanceResultAdapter());",
    "  await Hive.openBox<HeirSelection>('history');",
    "  await Hive.openBox('settings');",
    "  runApp(const ProviderScope(child: MeerasApp()));",
    "}",
  ]),
  space(1),
  h2("11.3 Performance Guidelines"),
  bullet("All calculations run synchronously in Dart — no async needed (calculation is instant)"),
  bullet("Pie chart uses Flutter's CustomPainter for smooth rendering at 60fps"),
  bullet("Question transitions use AnimatedSwitcher for smooth cross-fade"),
  bullet("Lazy-load history items (paginate Hive box results)"),
  bullet("Use const constructors everywhere possible to minimize widget rebuilds"),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 12: TESTING
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 12: TESTING STRATEGY", "🧪"),
  space(1),
  h1("12. Testing Strategy", C.green),
  h2("12.1 Unit Tests for Calculation Engine"),
  p("The calculation engine is the most critical component. It must have comprehensive unit tests covering all standard and edge cases. Test files go in test/engine/."),
  codeBlock([
    "// test/engine/furudh_engine_test.dart",
    "void main() {",
    "  group('Husband Share Tests', () {",
    "    test('Husband gets 1/2 when no descendant', () {",
    "      final selection = HeirSelection(hasHusband: true, hasSon: false, hasDaughter: false);",
    "      final result = InheritanceCalculator().calculate(selection);",
    "      expect(result.heirResults[HeirType.husband]!.share, equals(Rational.fromInt(1, 2)));",
    "    });",
    "    test('Husband gets 1/4 when son exists', () {",
    "      final selection = HeirSelection(hasHusband: true, hasSon: true);",
    "      final result = InheritanceCalculator().calculate(selection);",
    "      expect(result.heirResults[HeirType.husband]!.share, equals(Rational.fromInt(1, 4)));",
    "    });",
    "  });",
    "",
    "  group('Awl Tests', () {",
    "    test('Awl applied: Husband + 2 Daughters + Mother', () {",
    "      // Husband=1/2(3/6), Daughters=2/3(4/6), Mother=1/6(1/6) → total 8/6 > 1",
    "      // After Awl: Husband=3/8, Daughters=4/8, Mother=1/8",
    "      final selection = HeirSelection(hasHusband:true, hasDaughter:true, daughterCount:2, hasMother:true);",
    "      final result = InheritanceCalculator().calculate(selection);",
    "      expect(result.awlApplied, isTrue);",
    "      expect(result.heirResults[HeirType.husband]!.share, equals(Rational.fromInt(3, 8)));",
    "    });",
    "  });",
    "",
    "  group('Hajb (Exclusion) Tests', () {",
    "    test('Full Brother excluded when Son exists', () {",
    "      final selection = HeirSelection(hasSon: true, hasFullBrother: true);",
    "      final result = InheritanceCalculator().calculate(selection);",
    "      expect(result.heirResults[HeirType.fullBrother]!.isExcluded, isTrue);",
    "    });",
    "    test('Paternal Grandfather excluded when Father exists', () {",
    "      final selection = HeirSelection(hasFather: true, hasPaternalGrandfather: true);",
    "      final result = InheritanceCalculator().calculate(selection);",
    "      expect(result.heirResults[HeirType.paternalGrandfather]!.isExcluded, isTrue);",
    "    });",
    "  });",
    "",
    "  group('Madhab Difference Tests', () {",
    "    test('Hanafi: Grandfather excludes Full Brother', () {",
    "      final selection = HeirSelection(hasPaternalGrandfather:true, hasFullBrother:true, madhab:Madhab.hanafi);",
    "      final result = InheritanceCalculator().calculate(selection);",
    "      expect(result.heirResults[HeirType.fullBrother]!.isExcluded, isTrue);",
    "    });",
    "    test('Shafii: Grandfather shares with Full Brother', () {",
    "      final selection = HeirSelection(hasPaternalGrandfather:true, hasFullBrother:true, madhab:Madhab.shafii);",
    "      final result = InheritanceCalculator().calculate(selection);",
    "      expect(result.heirResults[HeirType.fullBrother]!.isExcluded, isFalse);",
    "    });",
    "  });",
    "}",
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 13: PUBLISHING
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 13: PUBLISHING TO APP STORES & WEB", "🚀"),
  space(1),
  h1("13. Publishing to App Stores & Web", C.green),
  h2("13.1 Build Commands"),
  codeBlock([
    "# Android (Play Store)",
    "flutter build appbundle --release",
    "# Output: build/app/outputs/bundle/release/app-release.aab",
    "",
    "# iOS (App Store)",
    "flutter build ios --release",
    "# Then open Xcode → Product → Archive → Distribute App",
    "",
    "# Web (GitHub Pages, Firebase Hosting, etc.)",
    "flutter build web --release --base-href /",
    "# Output: build/web/ — deploy this folder to any web host",
  ]),
  space(1),
  h2("13.2 App Store Listing Checklist"),
  twoColTable([
    ["Item", "Requirement", true],
    ["App Name", "Meeras Calculator — Islamic Inheritance"],
    ["Category", "Utilities / Reference"],
    ["Keywords", "Meerath, Faraid, Islamic Inheritance, Mirath, Wirasat, Islamic Law"],
    ["Age Rating", "4+ (no objectionable content)"],
    ["Privacy Policy", "Required — state: no data collected, fully offline"],
    ["Disclaimer", "Include: 'For guidance only — consult a qualified Islamic scholar for complex cases'"],
    ["Screenshots", "Arabic + English screenshots required for multilingual reach"],
    ["App Icon", "Islamic green with crescent or geometric Islamic pattern"],
    ["Web Hosting", "Deploy build/web to Firebase Hosting or GitHub Pages for free"],
  ]),
  pb()
);

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 14: GLOSSARY
// ══════════════════════════════════════════════════════════════════════════════
children.push(
  sectionDivider("SECTION 14: GLOSSARY OF FIQH TERMS", "📖"),
  space(1),
  h1("14. Glossary of Fiqh Terms", C.green),
  p("These terms appear throughout the codebase and documentation. All are Arabix technical terms from Fiqh al-Mawarith (Islamic Inheritance Law)."),
  space(0),
  twoColTable([
    ["Term", "Definition", true],
    ["Meerath / Mirath", "Inheritance — the entire system of Islamic inheritance law"],
    ["Faraid", "The ordained/fixed shares — what the Quran specifies for each heir"],
    ["Zawi al-Furudh", "Quota Heirs — the 11 heirs who receive fixed fractional shares from the Quran"],
    ["Asabah", "Residuaries — heirs who take what remains after quota shares are distributed"],
    ["Asabah bi-Nafsihi", "Independent male residuaries (sons, brothers, uncles) — Category 1"],
    ["Asabah bi-Ghayrihi", "Females who become residuaries by co-existing with their male counterpart — Category 2"],
    ["Asabah ma'a Ghayrihi", "Sisters who take the remainder when daughters are present but no brother — Category 3"],
    ["Hajb", "Blocking/Exclusion — when one heir's presence prevents another from inheriting"],
    ["Hajb Hirman", "Complete exclusion — heir is totally blocked from inheritance"],
    ["Hajb Nuqsan", "Partial exclusion — heir's share is reduced but not eliminated"],
    ["Awl", "Proportional reduction — applied when total quota shares exceed 100%"],
    ["Radd", "Return — remainder returned proportionally to quota heirs when no Asabah exists"],
    ["Umariyyatain", "Two famous cases ruled by Caliph Umar (RA) regarding Mother's 1/3 of remainder"],
    ["Madhab", "School of Islamic jurisprudence (Hanafi, Maliki, Shafi'i, Hanbali)"],
    ["Bayt al-Mal", "Islamic treasury — where surplus goes in Maliki/Shafi'i if no Radd"],
    ["Dhul al-Arham", "Distant kindred — relatives neither Quota Heirs nor Residuaries"],
    ["Mafqud", "Missing person — rules for heirs whose fate is unknown"],
    ["Wasiyyah", "Bequest — up to 1/3 of estate can be willed before inheritance distribution"],
    ["Tashih", "Correcting fractions — finding the lowest common denominator for all shares"],
    ["Asl al-Masa'la", "Base of the case — the LCM denominator used to convert all fractions"],
    ["Consanguine", "Sharing the same father but different mother (paternal half-sibling)"],
    ["Uterine", "Sharing the same mother but different father (maternal half-sibling)"],
    ["Propositius / Deceased", "The person who died — the one whose estate is being distributed"],
  ]),
  space(1),
  alertBox("⚠️ Important Disclaimer",
    "This documentation and the Meeras Calculator app provide guidance based on classical Islamic inheritance law (Fiqh al-Mawarith). The app is intended as an educational and reference tool. For large estates, complex family situations, disputed cases, or any situation where significant wealth is involved, always consult a qualified Islamic scholar (Alim) or a certified Islamic estate planning specialist. No software can replace qualified human scholarship.",
    C.lightRed, C.red),
  space(1),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: C.green, font: "Arial", size: 20 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: "وَٱللَّهُ يَعۡلَمُ وَأَنتُمۡ لَا تَعۡلَمُونَ", font: "Arial", size: 30, color: C.green, bold: true })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text: "\"And Allah knows, while you know not.\" — Surah Al-Baqarah 2:216", font: "Arial", size: 20, color: C.gray, italics: true })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 0 },
    children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", color: C.green, font: "Arial", size: 20 })]
  }),
);

// ══════════════════════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ══════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "bullets2",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "◦",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: C.darkGray } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: C.green },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: C.blue },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: C.teal },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 }
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Table({
            width: { size: 10080, type: WidthType.DXA },
            columnWidths: [7200, 2880],
            rows: [new TableRow({
              children: [
                new TableCell({ borders: noBorders(), width: { size: 7200, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Meeras Calculator — Islamic Inheritance App Documentation", font: "Arial", size: 18, color: C.gray, italics: true })] })] }),
                new TableCell({ borders: noBorders(), width: { size: 2880, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "بِسْمِ اللَّهِ", font: "Arial", size: 20, color: C.green, bold: true })] })] }),
              ]
            })]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Table({
            width: { size: 10080, type: WidthType.DXA },
            columnWidths: [5040, 5040],
            rows: [new TableRow({
              children: [
                new TableCell({ borders: noBorders(), width: { size: 5040, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Flutter + Dart  ·  Android + iOS + Web  ·  All 4 Madhabs  ·  100% Offline", font: "Arial", size: 16, color: C.gray })] })] }),
                new TableCell({ borders: noBorders(), width: { size: 5040, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
                    new TextRun({ text: "Page ", font: "Arial", size: 16, color: C.gray }),
                    new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: C.gray }),
                  ]})] }),
              ]
            })]
          })
        ]
      })
    },
    children,
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/mnt/user-data/outputs/Meeras_Calculator_Documentation.docx', buffer);
  console.log('✅ Document created successfully!');
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
