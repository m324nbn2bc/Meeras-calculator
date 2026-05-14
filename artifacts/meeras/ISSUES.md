# Meeras Calculator — Issues & Scalability Tracker

Track known bugs, UX issues, and technical debt here. Remove an entry once resolved.

---

## Open Issues

### UI / UX

| # | Screen | Issue | Priority |
|---|--------|-------|----------|
| U1 | `app/hajb.tsx` | Hajb screen is now orphaned — no navigation entry point after home screen button was moved to `/guide`. Screen still exists and is registered in `_layout.tsx` but unreachable by users. Either add it back to the hamburger menu or remove the route entirely. | Medium |
| U2 | `app/guide.tsx` | Guide chapter collapse state resets on every screen visit (no persistence). Consider persisting open/closed state per chapter to AsyncStorage so users don't have to re-open chapters each time. | Low |
| U3 | `app/guide.tsx` | Filter bar is sticky but uses `stickyHeaderIndices={[1]}` on the outer ScrollView. When the screen is in RTL mode (Arabic/Urdu), the horizontal filter ScrollView may clip or not align correctly on some Android devices. Needs device-level RTL testing. | Low |
| U4 | `app/result.tsx` | PDF export on web opens a `Blob` URL in a new tab, which some browsers block as a popup. Users may silently fail to see the PDF. Should add a visible fallback (e.g. download link). | Medium |
| U5 | `app/cases.tsx` | Case browser calculates all 25 scenarios live with `useMemo` — no lazy loading. On low-end devices this may cause a visible stutter when the screen first mounts. | Low |

### Data / Logic

| # | File | Issue | Priority |
|---|------|-------|----------|
| D1 | `lib/inheritance/madhabs/` | Shafi'i, Maliki, and Hanbali are registered but only partially implemented for the first tested paternal-grandfather-with-siblings rules. Settings still keeps them disabled, which is correct for now. Before enabling any school, add broader tests for descendants, spouse/mother combinations, Akdariyyah, Mushtarakah, Radd/Bayt al-Mal, Dhawil Arham, and 'Awl interactions. | High |
| D6 | `lib/inheritance/madhabs/` | The uterine-sibling-with-grandfather rule is currently marked in `/guide` for scholar review because quick references conflict with the existing handover assumption. Do not expand that behavior further until verified against a trusted fiqh source/scholar. | High |
| D2 | `lib/inheritance/` | No handling of non-Muslim heirs. A non-Muslim heir is currently treated identically to a Muslim one, giving them a share they are not entitled to under any madhab. | High |
| D3 | `lib/wizard.ts` | `WizardState` has no field for Al-Haml (pregnant widow) — estate distribution is final even when a widow may be pregnant, which violates Faraid rules in that scenario. | Medium |
| D4 | `lib/history.ts` | History is capped at 50 entries with a simple slice. If the cap is hit, the oldest entries are silently dropped. No UI notification to the user. | Low |
| D5 | `lib/inheritance/` | Bayt al-Mal (state treasury) is not surfaced when there are no eligible Asabah heirs — result screen shows "RESIDUE (NO ELIGIBLE ASABAH)" without explaining where the residue legally goes. | Low |

### i18n / Localisation

| # | File | Issue | Priority |
|---|------|-------|----------|
| I1 | `lib/i18n.ts` | Urdu and Arabic translations for Ch. 3 (ʿAwl & Radd) and Ch. 4 (Hajb ladder) are placeholder-quality — they are direct translations of the English strings and have not been reviewed by a native speaker or scholar. | Medium |
| I2 | `lib/i18n.ts` | Several guide book strings are long, especially Awl/Radd, Hajb, Matrix, Famous Cases, and Impediments. Urdu/Arabic need native-speaker and scholar review before release. | Medium |

---

## Scalability Concerns

| # | Area | Concern |
|---|------|---------|
| S1 | `lib/i18n.ts` | Single flat dictionary is already 1 500+ lines. As more guide chapters are added (Ch.5, Ch.6…) this file will become unwieldy. Consider splitting into domain files (`i18n/guide.ts`, `i18n/wizard.ts`, etc.) merged at build time. |
| S2 | `lib/guide.ts` | All guide content is hardcoded as TypeScript objects. Adding more chapters means redeploying. A future improvement is to load guide content from bundled JSON, allowing content-only updates without code changes. |
| S3 | `app/guide.tsx` | `renderMadhabNotes`, `renderNarrativeBlock`, and `renderLadderRung` are inline functions inside the component. As the guide grows they should be extracted into separate component files to keep the screen file manageable. |
| S4 | `lib/inheritance/__tests__.ts` | Engine tests are now 35/35 with the first Shafi'i/Maliki/Hanbali cross-madhab cases. As each school expands, keep adding tests before implementation and consider splitting fixtures by school once the file grows past ~50 cases. |
| S5 | `app/_layout.tsx` | All routes are flat in one Stack. Once the app grows beyond ~12 screens, consider grouping into tab navigation or a drawer so the navigation model scales. |
