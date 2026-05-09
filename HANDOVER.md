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
| `lib/i18n.ts` | EN/UR/AR string dictionaries + `t(lang, key)`, `isRTL(lang)`, `LANGUAGES`, `MADHABS` (no CURRENCIES) |
| `lib/hajb.ts` | Hanafi blocking-rules data (9 cards, 4 groups) |
| `lib/cases.ts` | 25 classical Faraid scenario definitions |
| `lib/history.ts` | AsyncStorage save/load/delete (`meeras.history.v1`, max 50 entries) |
| `contexts/SettingsContext.tsx` | `language`, `theme`, `madhab` — persisted to `meeras.settings.v1` (currency removed) |
| `constants/colors.ts` | Minimal monochrome palette — light: `#111111`/`#F8F8F8`, dark: `#F0F0F0`/`#0A0A0A` |
| `hooks/useColors.ts` | Theme-aware colour tokens |
| `components/` | `Counter`, `OptionRow`, `PrimaryButton`, `KeyboardAwareScrollViewCompat`, `ErrorFallback` |
| `app/_layout.tsx` | Stack navigator — registers all screens |
| `app/index.tsx` | Home screen — header with icon+name+menu dropdown, hero text, action buttons |
| `app/wizard.tsx` | Step-by-step wizard (estate → deductions → gender → heirs) |
| `app/result.tsx` | Result screen — deduction card, estate card, share bar, heir cards, Save + Share/PDF |
| `app/cases.tsx` | Classical scenario browser with search |
| `app/hajb.tsx` | Blocking Rules (Hajb) reference screen |
| `app/history.tsx` | Saved Calculations list screen |
| `app/settings.tsx` | Language / Theme / Madhab / About (currency section removed) |

---

## WizardState shape (as of latest build)

```typescript
interface WizardState {
  estate: number;          // net estate for engine (computed after deductions)
  grossEstate?: number;    // raw input from user
  funeralExpenses?: number;
  debtsOwed?: number;      // قرض جو میت پر ہے
  receivables?: number;    // میت کا کسی دوسرے پر قرض (added to estate)
  wasiyyah?: number;       // وصیت — capped to 1/3 of afterDebts
  deceasedGender: "male" | "female";
  hasSpouse: boolean;
  heirs: HeirCounts;
}
```

**Net estate formula (`computeNetEstate`):**
```
afterDebts = max(0, grossEstate + receivables − funeralExpenses − debtsOwed)
maxWasiyyah = afterDebts / 3
estate (net) = max(0, afterDebts − min(wasiyyah, maxWasiyyah))
```

**Old saved calculations** missing these optional fields default to 0 safely (backward-compatible).

---

## Wizard flow

```
Estate input (optional — can skip)
  ↓ if grossEstate > 0
Deductions screen (funeral, debtsOwed, receivables, wasiyyah)
  ↓ always
Gender → Spouse → (wives count) → Father → PGF → Mother → Grandmothers
  → Sons → Daughters → Grandsons → Granddaughters
  → Full/Cons/Uterine siblings → Nephews → Uncles → Cousins
  ↓
Result screen
```

---

## Features implemented — DO NOT re-implement

1. ✅ Full Hanafi engine (furudh, asabah, 'awl, radd, umariyyatan, hajb blocking)
2. ✅ Wizard — one question per screen, skip-logic predicates in `lib/wizard.ts`
3. ✅ Language switching EN / UR / AR with full RTL layout (`isRTL(lang)`)
4. ✅ Theme — system / light / dark via `useColors()`
5. ✅ PDF / Share export — `expo-print` + `expo-sharing`, styled HTML (no currency symbols, plain numbers)
6. ✅ Hajb blocking-rules reference screen
7. ✅ 25 classical scenarios browser with search + scholarly notes
8. ✅ Saved calculations history — AsyncStorage, save/delete/reopen on result screen
9. ✅ Proportional share-bar + colour-coded heir cards on result screen (neutral grey palette)
10. ✅ Madhab selector — Shafi'i / Maliki / Hanbali stubs marked "Coming soon" in settings
11. ✅ **Estate deductions** — dedicated step after estate entry (funeral expenses, debts owed by/to deceased, wasiyyah ≤ 1/3). Deduction breakdown card on result screen.
12. ✅ **Currency removed** — amounts shown as plain numbers via `Intl.NumberFormat` (no currency style). All currency state, UI, and i18n strings removed from `SettingsContext`, `settings.tsx`, `i18n.ts`, `result.tsx`, `wizard.tsx`, `history.tsx`.
13. ✅ **Minimal design** — colour palette changed to monochrome (`#111111` primary on light, `#F0F0F0` primary on dark). No dominant green. `colors.radius` reduced to 10.
14. ✅ **Home screen redesign** — proper header bar with app icon + name + hamburger menu button. Dropdown menu opens Settings and About options. Removed "Works fully offline" badge. Buttons perfectly aligned with consistent width.

---

## Remaining features to build (priority order)

### Feature A — Shafi'i / Maliki / Hanbali madhab engines
- Add real engines under `lib/inheritance/madhabs/shafii.ts`, `maliki.ts`, `hanbali.ts`
- Key differences vs Hanafi: grandfather-with-siblings (muqasamah), Akdariyyah case, uterine siblings presence of grandfather
- Wire into `lib/inheritance/index.ts` engines map
- Remove "Coming soon" gates in `app/settings.tsx` once implemented
- Add at least 5 cross-madhab test cases to `lib/inheritance/__tests__.ts`

### Feature B — Onboarding / tutorial flow
- 3–4 swipeable intro screens shown only on first launch (AsyncStorage flag `meeras.onboarded`)
- Screens: "What is Faraid?", "How the wizard works", "Scholarly disclaimer"
- Skip button + "Get started" CTA
- Register as `app/onboarding.tsx`, check flag in `app/_layout.tsx`

### Feature C — App icon + splash screen
- Replace default Expo icon with a custom crescent-and-scales SVG icon
- Configure `app.json` `icon` and `splash` fields
- Generate all required sizes for iOS / Android

### Feature D — About screen
- Currently tapping "About" in the home dropdown navigates to Settings (scrolled to the about section)
- Create a dedicated `app/about.tsx` screen with app version, scholarly disclaimer, links
- Register in `app/_layout.tsx` and update the dropdown in `app/index.tsx` to `router.push("/about")`

---

## Conventions — always follow these

- **Typecheck must pass**: `cd artifacts/meeras && pnpm exec tsc --noEmit`
- **Engine tests must stay 12/12**: `cd artifacts/meeras && pnpm dlx tsx lib/inheritance/__tests__.ts`
- All new i18n strings go in **all three dicts** (EN + UR + AR) in `lib/i18n.ts`; fallback is EN
- New screens must be registered in `app/_layout.tsx` as `<Stack.Screen>`
- Use `useColors()` for all colours — never hardcode theme colours
- Use `isRTL(language)` for layout direction on container views
- Do NOT use `pnpm dev` at workspace root — restart the workflow via the restart tool instead
- Server code convention (API server, not this app): never `console.log`, use `req.log` / `logger`
- Keep new fields in `WizardState` optional so old saved calculations stay backward-compatible
- No currency anywhere — amounts are unitless numbers formatted with `Intl.NumberFormat` (no `style: "currency"`)
