# Meeras Calculator — Handover Prompt

Reference this file at the start of any new session to pick up exactly where work left off.

---

## Project

**Meeras Calculator** — `artifacts/meeras/` — fully offline Islamic inheritance (Faraid) mobile app built with Expo Router in a pnpm monorepo at `/home/runner/workspace`. No backend; everything stays on device.

**Tech stack:** Expo ~54, React Native 0.81, Expo Router ~6, TypeScript, AsyncStorage, `expo-print`, `expo-sharing`, `react-native-safe-area-context`, `@expo/vector-icons`.

**Key commands:**
```bash
# Typecheck (must pass before any feature is "done")
cd artifacts/meeras && pnpm exec tsc --noEmit

# Engine unit tests (must stay 12/12)
cd artifacts/meeras && pnpm dlx tsx lib/inheritance/__tests__.ts

# Dev server — do NOT run pnpm dev directly, use the workflow tool instead
# Workflow name: "artifacts/meeras: expo"
```

---

## Architecture — every important file

| File | Purpose |
|---|---|
| `lib/inheritance/` | Pure-JS Faraid engine — fractions, Hanafi rules, 'Awl, Radd, Umariyyatan |
| `lib/inheritance/madhabs/hanafi.ts` | Full Hanafi implementation |
| `lib/inheritance/__tests__.ts` | 12 engine unit tests |
| `lib/wizard.ts` | WizardState type, Step definitions, `visibleSteps()`, `computeNetEstate()` |
| `lib/i18n.ts` | EN/UR/AR string dictionaries + `t(lang, key)`, `isRTL(lang)`, `LANGUAGES`, `MADHABS` |
| `lib/hajb.ts` | Hanafi blocking-rules data (9 cards, 4 groups) |
| `lib/cases.ts` | 25 classical Faraid scenario definitions |
| `lib/history.ts` | AsyncStorage save/load/delete/findByStateAndMadhab (`meeras.history.v1`, max 50 entries) |
| `contexts/SettingsContext.tsx` | `language`, `theme`, `madhab` — persisted to `meeras.settings.v1` (no currency) |
| `constants/colors.ts` | Subtle blue-slate palette — light: `#1A1F2E`/`#F7F8FA`, dark: `#E8EDF5`/`#0D1117` |
| `hooks/useColors.ts` | Theme-aware colour tokens (now includes `accent: #2563EB` / `#60A5FA`) |
| `components/` | `Counter`, `OptionRow`, `PrimaryButton`, `KeyboardAwareScrollViewCompat`, `ErrorFallback` |
| `app/_layout.tsx` | Stack navigator — registers all screens including `about` |
| `app/index.tsx` | Home screen — header with icon+name+menu dropdown (Settings → /settings, About → /about) |
| `app/wizard.tsx` | Step-by-step wizard (estate → deductions → gender → heirs) |
| `app/result.tsx` | Result screen — auto-save on load, colorful share bar, "In History" button, Share/PDF |
| `app/cases.tsx` | Classical scenario browser with search |
| `app/hajb.tsx` | Blocking Rules (Hajb) reference screen |
| `app/history.tsx` | Saved Calculations list — fixed deletion (un-nested Pressables) |
| `app/settings.tsx` | Language / Theme / Madhab settings (no currency) |
| `app/about.tsx` | **NEW** — Dedicated About screen with Faraid explanation, disclaimer, how-to, madhab status |

---

## WizardState shape

```typescript
interface WizardState {
  estate: number;          // net estate for engine (computed after deductions)
  grossEstate?: number;    // raw input from user
  funeralExpenses?: number;
  debtsOwed?: number;
  receivables?: number;
  wasiyyah?: number;       // capped to 1/3 of afterDebts
  deceasedGender: "male" | "female";
  hasSpouse: boolean;
  heirs: HeirCounts;
}
```

---

## Features implemented — DO NOT re-implement

1. ✅ Full Hanafi engine (furudh, asabah, 'awl, radd, umariyyatan, hajb blocking)
2. ✅ Wizard — one question per screen, skip-logic predicates
3. ✅ Language switching EN / UR / AR with full RTL layout
4. ✅ Theme — system / light / dark via `useColors()`
5. ✅ PDF / Share export — `expo-print` + `expo-sharing`, clean HTML with disclaimer footer. Web uses `Blob` URL in new tab for print.
6. ✅ Hajb blocking-rules reference screen
7. ✅ 25 classical scenarios browser
8. ✅ Saved calculations history — AsyncStorage, delete/reopen
9. ✅ **Colorful share-bar** — 10 vivid distinct colors (blue, green, amber, red, purple, cyan, orange, pink, lime, indigo)
10. ✅ Madhab selector — Shafi'i / Maliki / Hanbali stubs "Coming soon"
11. ✅ Estate deductions — funeral, debts, receivables, wasiyyah ≤ 1/3
12. ✅ No currency — amounts are unitless numbers via `Intl.NumberFormat`
13. ✅ **Minimal color design** — subtle blue-slate palette, `accent: #2563EB` used sparingly
14. ✅ **Home screen** — icon + name header with hamburger dropdown (Settings + About)
15. ✅ **Feature D — About screen** (`/about`) — Faraid explanation, disclaimer, how-to steps, school status, offline notice
16. ✅ **History deletion fix** — delete button is a sibling `Pressable`, not nested inside card `Pressable` (fixes web event propagation)
17. ✅ **Auto-save** — results saved automatically on result screen load (non-classical cases); `findByStateAndMadhab` prevents duplicates; "In History" button (tappable, navigates to /history)

---

## Remaining features to build (priority order based on research)

### Feature A — Shafi'i / Maliki / Hanbali madhab engines *(highest priority)*
- Key Shafi'i/Hanbali/Maliki difference: **grandfather-with-siblings** (muqasamah vs. Hanafi full blocking)
- Akdariyyah case (Shafi'i: consanguine sister inherits despite grandfather)
- Shafi'i: uterine siblings not excluded by grandfather (unlike Hanafi)
- Add at least 5 cross-madhab tests per new engine
- Remove "Coming soon" gates in settings once implemented

### Feature B — Al-Haml (Unborn/Posthumous Child) special case
- If deceased wife is pregnant at time of father's death, reserve a potential heir share
- Calculate two scenarios: if child is born male, if born female — show both
- All madhabs agree on the basic rule; minor differences in holding period

### Feature C — Mafqud (Missing/Presumed Dead Heir) handling
- Add a wizard option: "Is any heir missing/presumed dead?"
- Calculate two scenarios: treating as alive vs. as dead — distribute the more conservative amount
- Very commonly requested feature in existing apps

### Feature D — About screen *(DONE ✅)*

### Feature E — Onboarding flow (first launch)
- 3–4 swipeable intro screens shown once (AsyncStorage flag `meeras.onboarded`)
- Screens: "What is Faraid?", "How the wizard works", "Scholarly disclaimer", "Multiple madhabs"

### Feature F — Multiple-scenario comparison
- Run the same heirs with 2–4 madhabs simultaneously
- Side-by-side table showing each heir's share under Hanafi vs. Shafi'i vs. Maliki vs. Hanbali
- Useful for families that span different jurisprudential traditions

### Feature G — Non-Muslim heir exclusion wizard question
- Add a step: "Are any heirs non-Muslim?"
- Clearly show them as excluded with reason: "Difference of religion (اختلاف الدين)"
- Optional: show the rule that a non-Muslim can receive up to 1/3 via wasiyyah

### Feature H — Zakat calculator companion module
- Separate section from inheritance: "Calculate Zakat"
- Nisab based on current gold (85g) or silver (595g) — let user pick
- Zakatable assets: cash, gold/silver, trade goods, agricultural produce, livestock
- Khums (Shia) as optional toggle
- Could share the same settings (language/theme) as the Faraid module

### Feature I — PDF enhancements
- Add a QR code to the PDF footer linking to the app store page
- Optional: digitally watermark the PDF with date + madhab
- Share as image (PNG) instead of PDF for simpler sharing on WhatsApp

### Feature J — App icon + splash screen
- Replace default Expo icon with a custom crescent-and-scales SVG
- Configure `app.json` icon and splash fields

---

## Conventions — always follow these

- **Typecheck must pass**: `cd artifacts/meeras && pnpm exec tsc --noEmit`
- **Engine tests must stay 12/12**: `cd artifacts/meeras && pnpm dlx tsx lib/inheritance/__tests__.ts`
- All new i18n strings go in **all three dicts** (EN + UR + AR) in `lib/i18n.ts`
- New screens registered in `app/_layout.tsx` as `<Stack.Screen>`
- Use `useColors()` for all colours; `colors.accent` for brand blue; never hardcode theme colours
- Use `isRTL(language)` for layout direction
- Do NOT use `pnpm dev` at workspace root — restart the workflow via the restart tool
- Auto-save only for user calculations (`params.state` set, no `params.caseId`)
- New WizardState fields must be optional for backward compatibility with saved calculations
- No currency anywhere — amounts are unitless numbers via `Intl.NumberFormat`
