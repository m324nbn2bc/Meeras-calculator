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

## Bug fixes applied — DO NOT re-introduce

| Bug | Root cause | Fix |
|---|---|---|
| History delete button not working on web | `Alert.alert` on React Native Web doesn't reliably fire `onPress` callbacks | `handleDelete` now calls `window.confirm()` on `Platform.OS === "web"`, `Alert.alert` on native |
| Counter shows default 1 but wizard sends 0 wives | `step.read()` returns `s.heirs.wife ?? 1` (display default) but state has `heirs.wife = undefined` until user taps +/−. `goNextWithCurrentState` passed raw state to engine. | `goNextWithCurrentState` now runs `step.apply(state, Number(step.read(state)))` for all `count` steps before advancing, committing the displayed default into state |

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

## Web research summary — competing apps & gaps (May 2026)

Researched 12 queries across App Store/Play Store reviews, scholarly Faraid references, and Islamic finance app landscapes.

**Top competing apps:** Faraid by Emrah Demirci (iOS/Android), iFaraid Calculator, Al-Mwareeth, Faraid.net, Hitung Waris Islam.

**Key gaps found across all competitors:**
- Almost none handle Mafqud (missing heir) — huge real-world demand
- Very few handle Al-Haml (unborn child) at all
- No app offers a true multi-madhab comparison table
- Zakat is often a separate app entirely; users want it bundled
- PDF sharing is poorly implemented — users share WhatsApp images instead
- Non-Muslim heir exclusion is rarely explicitly surfaced in the UI

---

## Remaining features to build (priority order based on research)

### Feature A — Shafi'i / Maliki / Hanbali madhab engines *(highest priority — #1 user complaint on all competing apps)*
- **The key difference**: Grandfather-with-siblings case. Hanafi: grandfather **fully blocks** all siblings. Shafi'i/Maliki/Hanbali: use **muqasamah** — grandfather and siblings share together; grandfather takes whichever is better: equal share with siblings OR 1/3 of total estate.
- **Akdariyyah case** (unique to Maliki/Shafi'i): a consanguine sister inherits alongside grandfather even though normally grandfather would exclude her. Grandfather takes half, wife gets 1/4, mother gets 1/6, consanguine sister gets remainder via 'asabah with grandfather.
- **Uterine siblings**: Hanafi excludes them when grandfather present; Shafi'i/Maliki/Hanbali do not.
- Implementation: add `lib/inheritance/madhabs/shafii.ts`, `maliki.ts`, `hanbali.ts`. Each extends or overrides Hanafi rules for the grandfather dispute. Remove "Coming soon" gates in `app/settings.tsx` once done.
- Add ≥ 5 cross-madhab unit tests per new engine in `lib/inheritance/__tests__.ts`.

### Feature B — Al-Haml (Unborn/Posthumous Child)
- **Rule (all madhabs agree)**: if a widow is pregnant at time of death, the estate cannot be fully distributed until the child is born. Reserve the maximum possible share (assume twin boys — the worst case for other heirs). After birth, recalculate and redistribute.
- **Wizard change**: add a yes/no step after the spouse question — "Is any widow pregnant?" (only shown if deceased is male and has wife). If yes, show two distributions: "If child is born male" and "If child is born female".
- **Minor madhab differences**: Hanafi holds the estate in reserve for 2 years (maximum gestation). Maliki uses 4 years. Shafi'i/Hanbali use 4 years. All agree on the twin-male reserve rule.

### Feature C — Mafqud (Missing/Presumed Dead Heir)
- **Rule**: missing person is *assumed alive for their own estate* and *assumed dead for others' estates*. Dual-presumption logic.
- **Wizard change**: add a "Is any heir missing or presumed dead?" yes/no step near the end of heirs entry. If yes, show which heir(s) are missing. Calculate two distributions side by side: (1) treating missing heir as alive — other heirs receive the lesser amount; (2) treating as dead — other heirs receive more. Hold the disputed portion in a "reserve" pool.
- **Holding period**: Hanafi = 90 years from birth (when he would have reached unnatural old age). Maliki = 4 years after disappearance. Shafi'i = judge decides. Hanbali = 4 years.

### Feature D — About screen *(DONE ✅)*

### Feature E — Onboarding flow (first launch)
- 3–4 swipeable intro screens shown once. Store flag `meeras.onboarded` in AsyncStorage.
- Screen 1: "What is Faraid?" with Quranic verse (An-Nisa 4:11). Screen 2: "How to use — 3 steps" (Enter estate → Answer questions → See shares). Screen 3: "Scholarly disclaimer" (prominent, cannot be skipped). Screen 4: "Choose your madhab" (pre-selects from device locale).
- Check flag in `app/_layout.tsx`; if not set, redirect to `/onboarding` before showing home.

### Feature F — Multi-madhab comparison mode
- After completing the wizard, user can tap "Compare madhabs" on the result screen.
- Runs the same `heirs` through all 4 engines (requires Feature A to be done first).
- Shows a table: rows = heirs, columns = Hanafi / Shafi'i / Maliki / Hanbali, cells = share amount + fraction.
- Highlight cells that differ between madhabs.

### Feature G — Non-Muslim heir exclusion wizard question
- Add a step near the end: "Are any heirs non-Muslim?" If yes, ask which ones.
- Show excluded heirs on the result screen with reason label: "Excluded — difference of religion (اختلاف الدين)".
- Scholarly note: Prophet's hadith — "A Muslim does not inherit from a non-Muslim and a non-Muslim does not inherit from a Muslim" (Bukhari/Muslim). Non-Muslim can still receive up to 1/3 via wasiyyah (bequest) — add a note to that effect.

### Feature H — Zakat calculator companion module
- **Formula**: Zakatable wealth × 2.5% if wealth ≥ nisab AND held for full hawl (lunar year = 354 days).
- **Nisab**: 85g gold OR 595g silver — use whichever is lower in current market. Let user enter current gold/silver price per gram, or use a hardcoded approximate.
- **Zakatable assets**: cash/bank balances, gold/silver jewelry held as investment, trade goods at market value, agricultural produce (10% or 5% depending on irrigation), livestock (separate schedules).
- **Implementation**: new screen `app/zakat.tsx`, accessible from home screen. Separate from Faraid — no wizard, just input fields for each asset category with running total. Share the same `SettingsContext` for language/theme.

### Feature I — PDF enhancements
- Share as image (screenshot of result screen) for easier WhatsApp sharing — use `react-native-view-shot` + `expo-sharing`.
- Add QR code to PDF footer linking to Play Store / App Store once published.
- Watermark: add date of calculation and madhab name to the PDF header.

### Feature J — App icon + splash screen
- Replace default Expo icon with a custom SVG: scales of justice + crescent moon motif in the accent blue.
- Update `app.json` `icon` field (1024×1024 PNG) and `splash.image` field.
- Dark mode icon: white version of the same icon on dark background.

### Feature K — Divorced wife / multiple marriages edge cases
- A divorced wife in her `iddah` (waiting period) at time of husband's death **does inherit** under Hanafi (to prevent disinheritance via strategic divorce during terminal illness).
- A wife divorced with final irrevocable talaq (`talaq ba'in`) **does not inherit**.
- Add an "irrevocable divorce" flag to the spouse step to handle this correctly.

### Feature L — Bayt al-Mal (state treasury) display
- Currently when there are no eligible heirs the result shows "RESIDUE (NO ELIGIBLE ASABAH)".
- This residue should go to **Bayt al-Mal** (the Islamic public treasury) — label it clearly with a scholarly note explaining this rule.

### Feature M — Faraid Reference Guide screen *(A'immah Arba'ah)*
- **Entry point**: a "Reference Guide" button in the hamburger menu on the home screen, alongside Settings and About.
- **Purpose**: a built-in scholarly encyclopedia — works like a book/article that documents heirs, their shares, and conditions according to all four madhabs. Content is **static reference data** and can be built before the Shafi'i/Maliki/Hanbali calculation engines (Feature A) are complete.
- **Top filter bar** (sticky at top of screen):
  - Buttons: `A'immah Arba'ah (All 4)` | `Hanafi` | `Shafi'i` | `Maliki` | `Hanbali`
  - Tap "All 4" → every heir card shows a row for each madhab side by side for instant comparison.
  - Tap a specific madhab → cards collapse to show only that school's rules.
- **Three collapsible sections**:
  1. **Zawil Furud (Fixed-Share Heirs)** — all 12 Quranic heirs; for each: name (EN/UR/AR), fixed share fraction (1/2, 1/4, 1/6, 1/8, 1/3, 2/3), and the conditions under which they receive that share. Where madhabs differ, show a highlighted "Madhab Note" chip/banner on the card.
  2. **Asabah (Residuary Heirs)** — list residuary heirs in priority order with conditions.
  3. **Disputed Cases** — the scholarly high-value section: grandfather + siblings (the major inter-madhab dispute), Akdariyyah case, uterine siblings with grandfather, 'Awl (proportional reduction) and Radd (return) differences between schools.
- **Each heir card shows**: name in EN / UR / AR, share fraction(s), condition(s), and a "Madhab differs" banner when relevant (visible in All 4 mode or when switching between madhabs reveals a difference).
- **New screen**: `app/guide.tsx`
- **New i18n strings**: all reference content headings and labels in all three languages (EN + UR + AR) in `lib/i18n.ts`
- **New data file**: `lib/guide.ts` — typed static data structures for all heir entries, conditions, and per-madhab notes
- Register screen in `app/_layout.tsx` as `<Stack.Screen name="guide" />`
- Add "Reference Guide" entry to the hamburger dropdown in `app/index.tsx`

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
