# STACK.md: what the Casey products actually run

Recorded 6 September 2026 by reading the three product repositories that sit
beside this one. Nothing here is inferred from a product name, a README claim
alone, or general knowledge. Every row names the file the fact came from. Where
a fact could not be verified from the repository, the row says so and the
courses that depend on it carry a marked placeholder.

Repositories read, at the commit checked out on 6 September 2026:

| Repository | Path | State |
| --- | --- | --- |
| Mentisflow | `../Mentisflow` | Live product. Full application code. |
| Casey Journals | `../casey-journals` | Early build. Monorepo scaffold plus two shared packages; Phase 0 in progress. |
| Casey Legal Tools | `../casey-legal-tools` | Documentation only. No application code in the tree yet. |

---

## 1. One-table summary

| Concern | Mentisflow | Verified from | Casey Journals | Verified from | Casey Legal Tools | Verified from |
| --- | --- | --- | --- | --- | --- | --- |
| Product | Mental health booking and wellbeing, South Africa | `README.md` line 3 | Legal publishing: writing, podcasts, video | `README.md`, `CLAUDE.md` line 3 | AI legal work platform for South African practice | `README.md`, `CLAUDE.md` line 3 |
| Repository shape | Single repo: `mentisflow/` web app, `functions/` Cloud Functions, rules at root | `find` on the tree; `firebase.json` | Turborepo plus pnpm workspaces: `apps/web`, `apps/mobile`, `packages/*` | `pnpm-workspace.yaml`, `turbo.json`, `package.json` | Planned Turborepo plus pnpm; not yet on disk | `docs/engineering/ARCHITECTURE.md` "Shape"; no `package.json` exists |
| Package manager | npm | `mentisflow/package-lock.json` | pnpm 10.34.5 | `package.json` `packageManager` | pnpm (planned) | `README.md` stack table |
| Node | 20 for Cloud Functions; CI uses Node 20 | `functions/package.json` `engines.node`, `.github/workflows/ci.yml` | `>=22` declared; CI runs Node 24 | `package.json` `engines`, `.github/workflows/ci.yml` `node-version: 24` | Not verifiable: no manifest exists | not applicable |
| Language | JavaScript with JSDoc, checked by `tsc` in `checkJs` opt-in mode. No TypeScript migration. | `mentisflow/jsconfig.json` header comment; `"typecheck": "tsc -p jsconfig.json"` | TypeScript 5.9.3, strict | `packages/tsconfig/base.json`, every `package.json` | TypeScript (planned) | `docs/engineering/CONVENTIONS.md`, `README.md` |
| Web framework | React 19.2.4 on Vite 8.0.4, single page app | `mentisflow/package.json` | Next.js 16.3.4, App Router, React 19.2.3 | `apps/web/package.json`, `apps/web/app/layout.tsx` | Next.js App Router (planned) | `README.md` stack table, `docs/engineering/ARCHITECTURE.md` |
| Routing | React Router DOM 7.14.1 | `mentisflow/package.json` | Next.js App Router file routing with `typedRoutes: true` | `apps/web/next.config.ts` | Next.js App Router (planned) | `docs/engineering/ARCHITECTURE.md` |
| Styling | Tailwind CSS 3.4.19, Framer Motion 12, self-hosted Geist Sans and Fraunces | `mentisflow/package.json`, `mentisflow/tailwind.config.js`, `CLAUDE.md` design rules | Tailwind CSS 3.4.19 plus `@casey/tokens` | `apps/web/package.json`, `packages/tokens` | Tailwind plus shadcn/ui primitives, `packages/tokens` (planned) | `README.md` stack table |
| Backend | Firebase: Auth, Firestore, Storage; Cloud Functions v2 in `europe-west1` | `mentisflow/src/lib/firebase.js`, `functions/index.js`, `CLAUDE.md` | Supabase: Postgres with row-level security, Auth, Edge Functions, pg_cron, pgmq | `README.md` stack table, `packages/core/package.json` (`@supabase/supabase-js` 2.115.0) | Supabase, same list plus pgmq job queue (planned) | `README.md` stack table |
| Backend SDK version | `firebase` 12.12.0 (web), `firebase-admin` 13.10.0, `firebase-functions` 7.2.5 | `mentisflow/package.json`, `functions/package.json` | `@supabase/supabase-js` 2.115.0 | `packages/core/package.json` | Not verifiable: no manifest exists | not applicable |
| Auth | Firebase Auth: email and password, Google, Apple. App Check with reCAPTCHA v3 on web and App Attest or Play Integrity on native. | `mentisflow/src/context/AuthContext.jsx`, `mentisflow/src/lib/firebase.js`, `mentisflow/.env.example` | Supabase Auth. Task 0.3 open. TOTP MFA cited as a requirement of the operator model. | `docs/STATUS.md` task 0.3, `README.md` stack table | Supabase Auth: password with breach check, Google and Microsoft OAuth, TOTP mandatory by organisation policy, SAML for Enterprise, no SMS | `docs/decisions/0008-auth.md`, `README.md` stack table |
| Authorisation boundary | Firestore Security Rules and Storage Rules, 1043 and 139 lines, tested against the emulator | `firestore.rules`, `storage.rules`, `mentisflow/tests-rules/*.test.js` | Postgres row-level security, deny by default | `README.md` stack table, `CLAUDE.md` "Migrations are code" | Postgres row-level security through `has_org_role`; every customer table carries `org_id` | `CLAUDE.md` "Tenancy is enforced in the database", `docs/decisions/0011-tenancy.md` |
| Payments | PayFast, sandbox or live, server-side only. Not live at the time of reading: paid plans activate in demo mode without a charge. | `functions/.env.example`, `functions/src/billing.js`, `README.md` "Current status" | Paystack behind a provider-neutral billing module | `docs/decisions/0001-payment-provider.md`, `apps/web/.env.example` `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack behind a `BillingProvider` interface | `docs/decisions/0002-payment-provider.md` |
| Hosting | Vercel for the web app; Firebase for functions, rules and indexes | `mentisflow/vercel.json`, `.github/workflows/deploy-firebase.yml` header | Vercel | `apps/web/vercel.json`, `README.md` stack table | Vercel for web, Cloudflare for edge and R2 (planned) | `docs/engineering/ARCHITECTURE.md` "Hosts" |
| Mobile shell | Capacitor 8.5.0, iOS and Android, one web bundle live-updated through Capgo | `mentisflow/capacitor.config.ts`, `mentisflow/package.json`, `.github/workflows/mobile-deploy.yml` | Expo SDK 57, Expo Router 57, React Native 0.86.3, NativeWind 4.2.6, EAS | `apps/mobile/package.json` | Expo, Phase 4, not started | `docs/decisions/0016-web-primary-mobile-later.md` |
| PWA | `vite-plugin-pwa` 1.2.0 with Workbox; disabled in the mobile build | `mentisflow/vite.config.js` | Not present | No PWA dependency in `apps/web/package.json` | Not applicable | not applicable |
| Testing | Vitest 4.1.8; `@firebase/rules-unit-testing` 5.0.1 for rules tests against the emulator | `mentisflow/package.json`, `mentisflow/vitest.rules.config.js` | Vitest 4.1.11, `@testing-library/react` 16.3.3, jsdom 27.4.0; `node --test` for scripts; `pnpm test:rls` for policy tests | `apps/web/package.json`, `apps/web/vitest.config.mts`, root `package.json` scripts | Vitest plus RLS tests plus `pnpm check:no-logic` (planned) | `CLAUDE.md` "Verification gates" |
| Linting | ESLint 9.39.4 flat config, React plugins, Prettier 3.9.6 | `mentisflow/eslint.config.js`, `mentisflow/package.json` | ESLint 9.39.5 flat config via `@casey/eslint-config`, `typescript-eslint` 8.69.0, Prettier 3.9.6 | `packages/eslint-config/package.json` | Same shape (planned) | `docs/engineering/CONVENTIONS.md` |
| CI | GitHub Actions: `ci.yml` (web, mobile, config), `deploy-firebase.yml`, `mobile-deploy.yml`, `android-release.yml`, `ios-build.yml` | `.github/workflows/` | GitHub Actions: `ci.yml` running typecheck, lint, test, build, `check:config`; `status.yml` generating `docs/STATUS.md`. Actions pinned to commit SHAs. | `.github/workflows/ci.yml` | Not verifiable: no workflow files exist | not applicable |
| Compliance code | POPIA throughout: consent records at signup, an account deletion grace period, a 90-day sign-in log with no stored IP address, a server-written `adminLogs` audit trail, a client-side encrypted vault | `docs/POPIA-CHECKLIST.md`, `functions/src/signIns.js`, `functions/src/deletion.js`, `functions/src/patientIdentity.js`, `mentisflow/src/utils/vault.js` | POPIA applies; consent provenance carried on imported subscribers; server-side paywall metering; AI crawler refusal list | `CLAUDE.md`, `docs/decisions/0003`, `0013`, `0014` | POPIA and legal privilege as design constraints; break-glass grants for operator content access; documented section 72 residency basis | `docs/decisions/0007-data-residency.md`, `0018-operator-content-access.md` |
| Encryption | AES-256-GCM in the browser, key from PBKDF2-SHA-256 at 310 000 iterations, ciphertext only in Firestore and Storage | `mentisflow/src/utils/vault.js` lines 1 to 46 | Encryption functions cited as porting from the predecessor; not in the tree yet | `README.md` stack table (Backend row) | `encrypt_field` named for console-entered secrets | `docs/engineering/AI-PIPELINE.md` section 3 |
| AI usage in product | None found in the application code | No AI SDK in `mentisflow/package.json` | Anthropic API for summaries; Cloudflare Workers AI Whisper for transcripts, each behind an adapter | `README.md` stack table, `docs/decisions/0011-transcription.md` | `WorkflowRunner` interface with n8n, Anthropic and OpenAI adapters; no prompts in the repository | `docs/engineering/AI-PIPELINE.md`, `docs/decisions/0006-legal-logic-in-runners.md` |

---

## 2. What could not be verified

These are stated as unknown rather than guessed. Anywhere a course or the
workbook needs one of them, the text carries a `PLACEHOLDER` marker.

| Unverified | Why | Where it matters |
| --- | --- | --- |
| The Firestore and Cloud Storage region for Mentisflow | `CLAUDE.md` says the region "must be verified in the console". A repository cannot show a console setting. `functions/index.js` fixes only the Cloud Functions region, `europe-west1`. | Workbook Part 8, residency and cross-border transfer |
| Whether Mentisflow's PayFast integration has ever completed a live charge | `README.md` states payments run in demo mode; `functions/.env.example` defaults `PAYFAST_MODE=sandbox`. `docs/SUBSCRIPTIONS.md` records behaviours that "cannot be verified until the gateway is live". | Workbook Part 9, payments and entitlements |
| The Casey Journals database schema | `supabase/` does not exist in the tree. Task 0.2 is open and labelled `owner-review`. | Workbook Part 6, data modelling; Part 7, row-level security |
| Any Casey Legal Tools source file | The repository holds `docs/`, `scripts/`, `CLAUDE.md`, `AGENTS.md`, `IMPLEMENTATION_PLAN.md` and `README.md` only. Every stack fact for it is a plan, not an implementation. | TypeScript course capstone; workbook Parts 4 to 9 |
| The exact prescribed rate of interest used by `moraInterest` | `docs/engineering/LEGACY-CODEBASE.md` says the constant seeds `app_settings.prescribed_rate` and is operator-editable. The prototype repository was not read. | TypeScript course capstone |
| Runtime versions in production for any product | Manifests give the declared range, not what a deployed process runs. | Every "current version" claim below is npm registry data, not production data |

---

## 3. Version baseline

Read from the npm registry `dist-tags` and `time` fields, and from
`nodejs.org/dist/index.json` and the Node release schedule, on **6 September
2026**. The "published" column is the publish date of the version named in
"Current stable".

| Package or runtime | Current stable | Published | What the products pin | Notable change that affects course code |
| --- | --- | --- | --- | --- |
| Node.js (Active LTS) | **24.20.0** ("Krypton") | 2026-08-26 | Functions 20; Casey Journals CI 24 | Runs `.ts` files directly by type stripping, on by default (`process.features.typescript === 'strip'` on 24.20.0). `node --run` executes a `package.json` script. `node --watch` restarts on change. `--env-file` loads a dotenv file. Node 20 reached end of life on 2026-04-30. |
| Node.js (Current) | 26.8.1 | 2026-08-26 | none | Becomes Active LTS on 2026-10-28. Do not teach against it yet. |
| Node.js (Maintenance) | 22.23.2 ("Jod") | 2026-07-28 | none declared | Maintenance since 2025-10-21, end of life 2027-04-30. |
| TypeScript | **7.0.2** | 2026-07-08 | Mentisflow `^7.0.2`; Casey Journals `5.9.3` | The compiler is a native Go port. `strict` is on by default. `target` defaults to `esnext`, `module` to `esnext`, `moduleResolution` to `bundler`, `types` to `[]`. `target: "es5"`, `moduleResolution: "node"`, `baseUrl`, `importsNotUsedAsValues`, `preserveValueImports`, `keyofStringsOnly`, `suppressImplicitAnyIndexErrors`, `noImplicitUseStrict`, `out` and `charset` are gone. All verified by running `tsc` 7.0.2 locally; see section 4. |
| TypeScript 6 | `6.0.0-beta` on the `beta` tag | not applicable | none | The deprecation release. What 6 warned about, 7 errors on. Named here because upgrade guidance points through it. |
| React | **19.2.8** | 2026-07-21 | Mentisflow `^19.2.4`; Casey Journals `19.2.3` | `ref` is an ordinary prop on function components; `forwardRef` is no longer needed. `use()` reads a promise or context during render. Actions: `useActionState`, `useOptimistic`, `useFormStatus`. `useSyncExternalStore` for external stores. `useEffectEvent` and `<Activity>` are in the 19.2 line. React Compiler is a separate package. |
| React DOM | 19.2.8 | 2026-07-21 | same as React | not applicable |
| Vite | **8.2.2** | 2026-08-20 | Mentisflow `^8.0.4` | Rolldown is the bundler. `vitest/config` remains the import path for Vitest configuration. |
| Vitest | **5.0.0** | 2026-09-03 | Mentisflow `^4.1.8`; Casey Journals `4.1.11` | Version 5 is three days old at the time of writing; both products are on the 4 line (`V4` dist-tag `4.1.11`). Courses target 4 and name 5. `defineConfig` comes from `vitest/config`, not `vite`. |
| Zod | **4.5.4** | 2026-08-29 | Casey Journals `4.5.4` | Top-level format functions: `z.email()`, `z.uuid()`, `z.url()`, `z.iso.date()`. `{ error: ... }` replaces `{ message: ... }` and `{ invalid_type_error: ... }` as the single customisation channel, though `{ message: ... }` still works on refinements. `z.treeifyError`, `z.prettifyError`, `z.flattenError` replace `.format()` and `.flatten()`. `z.strictObject` and `z.looseObject` replace `.strict()` and `.passthrough()`. Verified by running Zod 4.5.4 locally. |
| TanStack Query | **5.102.8** | 2026-08-27 | not used by either product | `queryOptions()` gives one typed, reusable query definition. `isPending` replaces `isLoading`; `isLoading` now means "pending and fetching". `cacheTime` is `gcTime`. The object signature is the only signature. |
| React Router | **8.3.1** | 2026-08-28 | Mentisflow `react-router-dom@^7.14.1` (`version-7` tag is 7.18.3) | From version 7 everything is importable from `react-router`; `react-router-dom` is a re-export kept for compatibility. Mentisflow still imports from `react-router-dom`, so the course teaches both and says which is which. |
| Next.js | **16.3.4** | 2026-08-31 | Casey Journals `16.3.4` | App Router. `typedRoutes` is a stable `next.config.ts` option. Server Components by default; `"use client"` opts in. Server Actions with `"use server"`. Route handlers under `app/**/route.ts`. Only `NEXT_PUBLIC_`-prefixed variables reach the browser. |
| Tailwind CSS | **4.3.3** | 2026-07-16 | Both products pin `3.4.19` (the `v3-lts` dist-tag) | Version 4 configures in CSS with `@theme` rather than in `tailwind.config.js`. Both products are deliberately on the 3 LTS line, so course samples use v3 syntax and name v4. |
| Firebase JS SDK | **12.18.0** | 2026-08-19 | Mentisflow `firebase@^12.12.0` | Modular, tree-shaken API: `import { getFirestore, doc, getDoc } from 'firebase/firestore'`. |
| supabase-js | **2.115.0** | 2026-09-03 | Casey Journals `2.115.0` | Version 3 exists on the `next` tag (`3.0.0-next.29`) and is not what the product uses. |
| Capacitor | **8.5.1** | 2026-08-31 | Mentisflow `@capacitor/core@^8.5.0` | One web bundle inside a native WebView. Mentisflow's `capacitor.config.ts` freezes the plugin set; a JavaScript-only update cannot add native code. |

### Dates that matter

| Date | Event | Source |
| --- | --- | --- |
| 2026-04-30 | Node 20 end of life | `nodejs/Release` `schedule.json` |
| 2026-07-08 | TypeScript 7.0.2 published | npm registry `time` field |
| 2026-07-21 | React 19.2.8 published | npm registry `time` field |
| 2026-08-26 | Node 24.20.0 published | `nodejs.org/dist/index.json` |
| 2026-09-03 | Vitest 5.0.0 published | npm registry `time` field |
| 2026-10-20 | Node 24 enters maintenance | `nodejs/Release` `schedule.json` |
| 2026-10-28 | Node 26 becomes Active LTS | `nodejs/Release` `schedule.json` |
| 2027-04-30 | Node 22 end of life | `nodejs/Release` `schedule.json` |

---

## 4. Evidence for the TypeScript 7 claims

The TypeScript 7 row above is the one most likely to be wrong if taken from a
blog post, so each claim was run against `typescript@7.0.2` in a scratch
project on 6 September 2026. The probes and their output:

| Claim | Probe | Result |
| --- | --- | --- |
| `strict` is on by default | `tsc --noEmit probe.ts` with no `tsconfig.json`, where `probe.ts` is `function f(x) { return x; }` | `error TS7006: Parameter 'x' implicitly has an 'any' type.` |
| `target` defaults to `esnext` | Compile a file using `Set.prototype.union`, `Object.groupBy` and `RegExp.escape` with no config | Type-checks clean; emitted JavaScript is byte-for-byte the input, nothing downlevelled |
| `module` defaults to an ES module format | Compile a file using `import.meta.url` and top-level `await` with no config | Both accepted; `export` statements survive emit |
| `moduleResolution` defaults to `bundler` | Set `"module": "amd"` | `error TS5095: Option 'bundler' can only be used when 'module' is set to 'preserve', 'commonjs', or 'es2015' or later.` |
| `types` defaults to `[]` | Install `@types/node`, then compile a file using `process.env` with no `types` field | `error TS2591: Cannot find name 'process'. ... add 'node' to the types field in your tsconfig.` Adding `"types": ["node"]` makes it pass. |
| `target: "es5"` is removed | `"target": "es5"` | `error TS5108: Option 'target=ES5' has been removed.` |
| `moduleResolution: "node"` is removed | `"moduleResolution": "node"` | `error TS5108: Option 'moduleResolution=node10' has been removed.` |
| `baseUrl` is removed | `"baseUrl": "."` | `error TS5102: Option 'baseUrl' has been removed.` |
| Six older options are gone entirely | `importsNotUsedAsValues`, `preserveValueImports`, `keyofStringsOnly`, `suppressImplicitAnyIndexErrors`, `noImplicitUseStrict`, `out`, `charset` | `error TS5023: Unknown compiler option` for each |
| `erasableSyntaxOnly` rejects non-erasable syntax | Compile an `enum`, a parameter property and a value `namespace` with the flag on | `error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.` on all three |
| `tsc --init` writes the modern shape | `tsc --init` | Writes `module: nodenext`, `target: esnext`, `types: []`, `strict`, `verbatimModuleSyntax`, `isolatedModules`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUncheckedSideEffectImports`, `moduleDetection: force` |

Node feature availability was checked the same way on Node 24.20.0:

| Feature | Node 24.20.0 | Node 22.22.2 |
| --- | --- | --- |
| `Object.groupBy`, `Promise.withResolvers`, `Set.prototype.union`, iterator helpers, `Array.prototype.toSorted`, `Array.fromAsync` | present | present |
| `Promise.try`, `RegExp.escape`, `Error.isError`, `Float16Array` | present | absent |
| `Temporal` | present behind `--harmony-temporal` only | absent |
| `Math.sumPrecise`, `Uint8Array.fromBase64` | absent | absent |
| Direct `.ts` execution | `process.features.typescript === 'strip'` | not by default |

This is why the JavaScript course teaches to **Node 24** and marks `Promise.try`,
`RegExp.escape` and `Error.isError` as needing it, and why `Temporal` is a
preview rather than a lesson.

---

## 5. What the courses take from each product

Products are worked examples. No lesson requires access to a product
repository, and no product code is copied.

| Course | Anchor product | What it borrows | What it does not borrow |
| --- | --- | --- | --- |
| JavaScript | Mentisflow | The shape of the Tools suite: daily check-in, mood, habits with cues, sticky-note tasks. The capstone is a local CLI over JSON fixtures. | Firebase, any real patient data, the design system |
| TypeScript | Casey Legal Tools | The idea of a deterministic statutory calculator kept apart from legal reasoning, and money in integer cents. The capstone is a mora interest engine tested with `node:test`. | Any legal wording, any prompt, any rate treated as authoritative |
| React | Casey Journals for the Next.js path, Mentisflow for the Vite path | A tiered publication with a server-enforced paywall, a subscribe form, optimistic bookmarks. | Supabase, Paystack, real article text, the editorial design system |

Both React paths exist because both are real here: Casey Journals runs Next.js
16 App Router, and Mentisflow runs React 19 on Vite 8 with React Router. A
course that taught only one would be wrong about one of the two products a
reader is likely to work on.
