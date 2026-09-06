# Modern JavaScript, TypeScript, and React Courses

Three practical, open-source courses that take you from modern JavaScript
fundamentals through TypeScript and into production React, plus a workbook on
everything that comes after the code compiles.

**Revised September 2026.** Material added or changed in that revision is
marked **(2026)** throughout. The version baseline, and the audit of the
products these courses draw their examples from, is in
[STACK.md](./STACK.md).

---

## Baseline

Every sample in these courses was run or type-checked against these versions
before publication. Full table, with publication dates and how each was
checked, in [STACK.md](./STACK.md).

| | Version | Notes |
| --- | --- | --- |
| Node.js | **24** (Active LTS) | Runs `.ts` files directly. Node 20 reached end of life on 30 April 2026. |
| TypeScript | **7.0.2** | Native Go compiler. `strict` on by default, `target`/`module` default to `esnext`, `types` defaults to `[]`. |
| React | **19.2** | `ref` as a prop, `use()`, Actions, `useEffectEvent`, `Activity` |
| Next.js | **16.3** | App Router, Server Components, Server Actions |
| Vite | **8** | Rolldown bundler |
| Vitest | **4** | Configured from `vitest/config` |
| Zod | **4.5** | Top-level formats, one `error` option, `prettifyError` |
| React Router | **7** and **8** | Everything importable from `react-router` |
| TanStack Query | **5** | `queryOptions`, `isPending`, `gcTime` |

---

## Courses

### 1. Modern JavaScript

Every modern JavaScript feature you need before tackling TypeScript and React,
including everything added between ES2023 and ES2025.

- [Course content](./javascript-course/course.md)
- [Exercise solutions](./javascript-course/solutions.md)

**What you will learn:** **(2026)** a ten-minute primer on variables, loops,
functions and conditionals for anyone arriving from another language; `let`,
`const` and block scope; arrow functions,
template literals, destructuring; default, rest and spread; array and object
methods including **(2026)** `at`, `findLast`, `toSorted`, `with` and
`Object.groupBy`; optional chaining and nullish coalescing; classes; modules
and **(2026)** import attributes; promises and **(2026)**
`Promise.withResolvers`, `Promise.try` and `Array.fromAsync`; async/await;
`fetch` against local fixtures and a fixture server you run yourself; `Map`,
`Set` and **(2026)** the seven Set operations; iterators and **(2026)**
iterator helpers; **(2026)** `RegExp.escape`, `Error.isError`, `Error` cause
and `structuredClone`; **(2026)** a Temporal preview.

**Capstone (2026):** a Tools CLI modelled on Mentisflow's habit and task
tools, using local JSON, no dependencies, and `node:test`.

**Estimated time:** 14 to 20 hours including exercises.

### 2. TypeScript Fundamentals

The language from primitives through advanced types, rewritten for
TypeScript 7.

- [Course content](./typescript-course/course.md)
- [Exercise solutions](./typescript-course/solutions.md)

**What you will learn:** **(2026)** the TypeScript 7 defaults and the options
that were removed; running `.ts` directly with `node` and why checking is a
separate command; `verbatimModuleSyntax`, `isolatedModules` and
`erasableSyntaxOnly`; types, inference and the strict mode mindset; functions,
objects, interfaces and type aliases; discriminated unions and exhaustive
narrowing; generics and constraints; classes and modules; **(2026)** `as const`
and `satisfies` in place of enums; utility and advanced types; **(2026)** Zod 4
at the boundary; **(2026)** branded types; **(2026)** the strictness options
beyond `strict`.

**Capstone (2026):** Casey Recover, a mora interest engine modelled on the
`packages/legal-calc` carve-out in Casey Legal Tools. Branded integer cents,
validated ISO days, segmentation at every rate change, rounding once, and 17
`node:test` cases.

**Estimated time:** 12 to 18 hours including exercises.

### 3. React with TypeScript

Production React on both of the toolchains the Casey products actually run.

- [Course content](./react-typescript-course/course.md)
- [Exercise solutions](./react-typescript-course/solutions.md)

**What you will learn:** typing function components and props; every core hook
with type safety; **(2026)** `ref` as an ordinary prop, ref cleanup functions
and `useEffectEvent`; **(2026)** the context as its own provider and `use()`;
custom hooks and generic components; forms with React Hook Form and Zod 4;
**(2026)** TanStack Query 5; **(2026)** React Router 7 from `react-router`;
component patterns; **(2026)** Vitest 4 and testing an optimistic update;
project structure; **(2026)** React 19 Actions, `useActionState`,
`useFormStatus`, `useOptimistic`, `useSyncExternalStore`, `Activity` and the
React Compiler; **(2026)** a full lesson on Next.js and the App Router.

**Capstone (2026):** Casey Journal, a tiered publication on Next.js 16 whose
paywall is enforced on the server, with a Server Action form, optimistic
bookmarks, 17 Vitest cases, and a `curl` proof that no withheld text reaches an
unentitled reader.

**Estimated time:** 18 to 24 hours including exercises.

### 0. The learning hub and the interactive test (2026)

A static site holding all of the above, plus a test over it.

- [`site/`](./site/) · open `site/index.html`, or deploy the folder anywhere

Seventy-six questions across nine topics, drawn at random and split evenly
between straightforward and harder. Most of the harder ones are scenarios: a
stolen laptop, a paywall that leaks, a webhook that grants twice, a
cancellation that cannot reach the payment gateway. The reasoning appears after
every answer, right or wrong.

Progress is kept in the browser. No account, no cookies, no tracking, no build
step. Deployment instructions are in [`site/README.md`](./site/README.md).

### 4. The Casey Workbook (2026)

Ten parts on what a professional does with the language: architecture,
security, data protection, operations, payments, and building alongside AI.

- [Workbook](./casey-workbook/workbook.md) · [PDF](./casey-workbook/workbook.pdf)
- [Worked answers](./casey-workbook/solutions.md) · [PDF](./casey-workbook/solutions.pdf)

| Part | Title |
| --- | --- |
| 0 | Setting up to work |
| 1 | JavaScript in anger |
| 2 | TypeScript that carries meaning |
| 3 | React that ships |
| 4 | Architecture: trust boundaries, the BaaS concept map, data modelling, webhooks and idempotency, environments, delivery shells, decision records |
| 5 | Security standards: OWASP Top 10:2025 mapped to controls and to checks, authorisation in the database, secrets, injection, supply chain, logging and alerting, exceptional conditions, edge protections, STRIDE, reviewing AI-generated code |
| 6 | Data protection engineering: POPIA's eight conditions mapped to GDPR and to controls, data inventory, minimisation, consent as events, retention and deletion, data subject rights, encryption, the breach runbook |
| 7 | Operations: review, CI/CD, testing layers, observability, backups and restore drills, performance and accessibility, cost, documentation and agent instructions |
| 8 | Payments and entitlements: provider-agnostic checkout, the webhook, derived entitlements, what cancelling means, failing loudly |
| 9 | Building with AI: the model as an untrusted component, prompt injection as injection, typed human approval gates, eval sets, working with coding agents |

Products appear only as worked examples. It ends with a time estimate table,
three pacing schedules, shortcuts, and a transferable skills matrix.

**Estimated time:** 60 hours, of which 13 is reading.

---

## Recommended path

JavaScript, then TypeScript, then React, then the workbook. Each course assumes
the previous one.

If you already know modern JavaScript well, skim the first course but read the
sections marked **(2026)**: `at`, `findLast`, the non-mutating array methods,
`Object.groupBy`, Set operations and iterator helpers are all newer than most
material you will have read.

If you know TypeScript from before 2026, **read Lesson 0 of the TypeScript
course anyway.** The defaults changed.

Do the exercises as you go. They are designed to take 15 to 30 minutes each.
Reading without practising is the slowest way to learn.

## How to use the solutions

Every exercise has a working solution. Try the exercise first. Reading a
solution before attempting the problem robs you of most of the benefit.

When you do look, do not copy. Read it, close the tab, and rewrite it from
scratch.

The workbook's solutions are different in kind: many of its exercises are
audits of your own system, so the answers give the **method**, a worked example,
and the traps, rather than a single correct answer.

## Prerequisites

- Some programming experience in any language. **(2026)** You no longer need
  to arrive knowing variables, loops, functions and conditionals: JavaScript
  Lesson 0a covers all four in about ten minutes, in JavaScript's spelling,
  including the traps (`===` versus `==`, truthiness, calling a function
  versus passing it).
- **Node.js 24** or newer (`node --version`)
- A code editor with TypeScript support
- `git` and `curl`

Some workbook exercises want Docker or the Firebase emulators. Each says so,
and each has an alternative that does not.

The JavaScript course assumes no prior JavaScript. The TypeScript course
assumes the JavaScript course. The React course assumes both. The workbook
assumes all three.

## Repository structure

```
ts-react-courses/
├── README.md                       (this file)
├── STACK.md                        (2026) the verified stack of the three
│                                   products, the version baseline, and what
│                                   could not be verified
├── GLOSSARY.md                     (2026) every term the courses use in
│                                   passing, defined once
├── LICENSE
├── javascript-course/
│   ├── course.md
│   └── solutions.md
├── typescript-course/
│   ├── course.md
│   └── solutions.md
├── react-typescript-course/
│   ├── course.md
│   └── solutions.md
├── casey-workbook/                 (2026)
│   ├── workbook.md
│   ├── workbook.pdf
│   ├── solutions.md
│   └── solutions.pdf
└── site/                           (2026) the static learning hub
    ├── index.html                  the hub, with progress tracking
    ├── test.html                   the interactive test
    ├── questions.js                76 questions, 38 easy and 38 hard
    ├── read/                       the courses, rendered from the markdown
    └── README.md                   how to run and deploy it
```

## How the 2026 revision was verified

Claims in teaching material expire, so each was checked rather than recalled.

| Claim | How it was checked |
| --- | --- |
| Current versions | The npm registry `dist-tags` and `time` fields, and `nodejs.org/dist/index.json`, read on 2026-09-06 |
| TypeScript 7 defaults and removals | Running `tsc` 7.0.2 against probe files. The probes and their exact output are in [STACK.md](./STACK.md) section 4. |
| Node feature availability | Running Node 24.20.0 and 22.22.2 |
| JavaScript samples | Executed on Node 24.20.0 |
| TypeScript samples | `tsc --noEmit` in isolation against the documented `tsconfig.json` |
| React samples | Type-checked against React 19.2.8 and `@types/react` 19.2.18 |
| Each capstone | Rebuilt from `solutions.md` into a clean directory, then built and tested |
| The React paywall | `curl` against the running production server, counting occurrences of withheld text |
| Product facts | Read from the repositories, with the file recorded per fact |

Three drafting errors were caught this way and corrected: `Activity` and
`useEffectEvent` are plain exports in React 19.2 rather than prefixed;
`grep -c` counts lines rather than occurrences, so a recorded figure came from
a different command than the one printed; and `Object.values` on a `const`
object infers an array of the union rather than a tuple.

Where something could not be verified, [STACK.md](./STACK.md) says so and the
courses carry a marked placeholder. Nothing was invented to fill a gap.

## Contributing

Improvements are welcome. If you spot an error, find a clearer explanation, or
want to add an exercise, open an issue or a pull request.

Two conventions if you do. Mark new or changed material with **(2026)** or the
year of your revision. And verify version claims against the registry rather
than against memory, because everything in the baseline table above will be
wrong eventually.

## Licence

MIT. See [LICENSE](./LICENSE) for the full text. You are free to use, modify,
share and teach from this material, including for commercial training, as long
as you keep the licence notice intact.
