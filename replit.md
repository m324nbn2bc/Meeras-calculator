# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Meeras Calculator (artifacts/meeras)

Offline Islamic inheritance (Faraid) mobile app built with Expo Router.

- **Architecture**: Pluggable madhab engines under `lib/inheritance/madhabs/` (Hanafi shipped; Shafi'i/Maliki/Hanbali stubs marked "Coming soon" in settings). Pure-JS exact-fraction math in `lib/inheritance/fractions.ts`.
- **Wizard**: One-question-per-screen flow defined in `lib/wizard.ts` with `visible(state)` predicates that skip irrelevant steps (e.g. siblings hidden when children or father present).
- **Settings**: Language (en/ur/ar with RTL), theme (system/light/dark), and madhab persisted to AsyncStorage via `contexts/SettingsContext.tsx`. `hooks/useColors.ts` reads theme from settings (not just OS).
- **i18n**: Full string dictionaries in `lib/i18n.ts` for English, Urdu, Arabic.
- **Calculation features**: Furudh (fixed shares), Asabah (residuary), 'Awl (proportional reduction), Radd (surplus redistribution excluding spouse), Umariyyatan (mother takes 1/3 of remainder with spouse + father).
- **Currency**: Selectable in settings (12 currencies: SAR, AED, USD, GBP, EUR, PKR, BDT, IDR, EGP, MYR, TRY, NGN). Stored in SettingsContext alongside language/theme/madhab. Result screen uses `Intl.NumberFormat` currency style for all monetary amounts.
- **Share bar**: Proportional multicolour horizontal bar on the result screen (between estate card and rules section) showing each heir's relative share at a glance. Each heir card also gets a matching colour accent on its left border.
- **Hajb screen** (`app/hajb.tsx`): Reference guide showing all Hanafi blocking rules grouped by Ascendants / Grandchildren / Siblings / Extended Asabah. Each card shows the blocked heir, "blocked by" pills, and a scholarly note. Accessible from home screen as "Blocking Rules (Hajb)" tertiary button. Data in `lib/hajb.ts`.
- **Classical scenarios**: 25 curated cases in `lib/cases.ts`, browsable at `app/cases.tsx`. Each case opens the result screen with a scholarly note panel. Famous cases starred.
- **No backend** — all data stays on device. The project's API server is unused by this artifact.
