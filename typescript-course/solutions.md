# TypeScript Course: Exercise Solutions

Working solutions for every exercise in the TypeScript fundamentals course.
Each solution includes runnable code and a short note on the approach.

**(2026)** To run any solution, save it to a `.ts` file inside the project from
Lesson 0 and run it with `node src/your-file.ts`. There is no `ts-node` and no
build step. Node erases the types; it does not check them, so run
`npm run typecheck` (`tsc --noEmit`) separately.

Every solution here was type-checked with TypeScript 7.0.2 against the
`tsconfig.json` in Lesson 0, and every runnable one was executed on Node
24.20.0. The capstone was rebuilt from this file into a clean directory: its 17
`node:test` cases pass and `tsc --noEmit` is silent.

---

## Lesson 1: Primitive Types and Inference

```typescript
const personName: string = "Alex";
const age: number = 30;
const hasDrivingLicense: boolean = true;

console.log(`${personName}, age ${age}, license: ${hasDrivingLicense}`);

// Errors you would see if you tried wrong types:
// const wrongName: string = 42;          // Type 'number' is not assignable to type 'string'
// const wrongAge: number = "thirty";     // Type 'string' is not assignable to type 'number'
// const wrongLicense: boolean = "yes";   // Type 'string' is not assignable to type 'boolean'
```

**Note:** TypeScript would also infer these types correctly without annotations. The annotations are useful here because they make the intent explicit and produce errors on assignment.

---

## Lesson 2: Arrays, Tuples, and Readonly

```typescript
type HttpResponse = [number, string, string];

const response: HttpResponse = [200, "OK", '{"message": "Hello"}'];
const [statusCode, statusText, body] = response;

console.log(`HTTP ${statusCode} ${statusText}`);
console.log(`Body: ${body}`);

// Bonus: a readonly version that cannot be mutated
type ImmutableHttpResponse = readonly [number, string, string];
const frozen: ImmutableHttpResponse = [404, "Not Found", ""];
// frozen[0] = 500; // Error: Cannot assign to '0' because it is a read-only property
```

---

## Lesson 3: Functions

```typescript
function formatPrice(amount: number, currency: string = "ZAR"): string {
  const symbols: Record<string, string> = {
    ZAR: "R",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  };
  const symbol = symbols[currency] ?? currency;
  return `${symbol} ${amount.toFixed(2)}`;
}

console.log(formatPrice(99));           // R 99.00
console.log(formatPrice(99, "USD"));    // $ 99.00
console.log(formatPrice(1500, "EUR"));  // € 1500.00
console.log(formatPrice(50, "XYZ"));    // XYZ 50.00 (falls back to code)
```

**Note:** The `??` operator (nullish coalescing) is preferred over `||` because it only falls back on `null` or `undefined`, not on empty strings or zero.

---

## Lesson 4: Objects, Interfaces, and Type Aliases

```typescript
interface Author {
  name: string;
  email: string;
}

interface BlogPost {
  title: string;
  author: Author;
  tags: string[];
  published: boolean;
}

const post: BlogPost = {
  title: "Getting Started with TypeScript",
  author: {
    name: "Maria",
    email: "maria@example.com",
  },
  tags: ["typescript", "tutorial", "beginner"],
  published: true,
};

console.log(`"${post.title}" by ${post.author.name}`);
console.log(`Tags: ${post.tags.join(", ")}`);
```

---

## Lesson 5: Union and Literal Types

```typescript
type PaymentResult =
  | { status: "approved"; transactionId: string; amount: number }
  | { status: "declined"; reason: string }
  | { status: "pending"; estimatedCompletion: Date };

function getPaymentMessage(result: PaymentResult): string {
  switch (result.status) {
    case "approved":
      return `Payment of ${result.amount} approved. Reference: ${result.transactionId}`;
    case "declined":
      return `Payment declined. Reason: ${result.reason}`;
    case "pending":
      return `Payment is being processed. Expected by ${result.estimatedCompletion.toLocaleString()}`;
  }
}

// Test all three branches
console.log(getPaymentMessage({ status: "approved", transactionId: "TX123", amount: 99.99 }));
console.log(getPaymentMessage({ status: "declined", reason: "Insufficient funds" }));
console.log(getPaymentMessage({ status: "pending", estimatedCompletion: new Date() }));
```

**Note:** The `switch` is exhaustive. If you add a new variant to the union, TypeScript will complain about the function not handling it. That is the whole point of discriminated unions.

---

## Lesson 6: Type Narrowing and Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function getLength(value: unknown): number {
  if (isString(value)) {
    return value.length;
  }
  return 0;
}

console.log(getLength("hello"));       // 5
console.log(getLength(42));             // 0
console.log(getLength(undefined));      // 0
console.log(getLength(["a", "b"]));     // 0 (arrays have length, but the guard is strict)

// Bonus: a more flexible "has length" guard
function hasLength(value: unknown): value is { length: number } {
  return (
    value !== null &&
    typeof value === "object" &&
    "length" in value &&
    typeof (value as { length: unknown }).length === "number"
  );
}
```

---

## Lesson 7: Generics

```typescript
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const users: User[] = [
  { id: 1, name: "Alex", email: "alex@example.com", age: 28 },
  { id: 2, name: "Maria", email: "maria@example.com", age: 34 },
  { id: 3, name: "Jordan", email: "jordan@example.com", age: 41 },
];

const names = pluck(users, "name");   // string[]
const ages = pluck(users, "age");     // number[]
const ids = pluck(users, "id");       // number[]

console.log(names); // ["Alex", "Maria", "Jordan"]

// pluck(users, "phone"); // Error: "phone" is not a key of User
```

**Note:** The `K extends keyof T` constraint is what gives you compile-time safety on the key. Without it, you could pass any string and get a runtime undefined.

---

## Lesson 8: Classes (Generic Stack)

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear(): void {
    this.items = [];
  }
}

// Usage with numbers
const numbers = new Stack<number>();
numbers.push(1);
numbers.push(2);
numbers.push(3);
console.log(numbers.peek()); // 3
console.log(numbers.size()); // 3
console.log(numbers.pop());  // 3
console.log(numbers.size()); // 2

// Usage with strings
const words = new Stack<string>();
words.push("hello");
words.push("world");
console.log(words.peek()); // "world"

// Usage with custom types
interface Task {
  id: string;
  title: string;
}
const tasks = new Stack<Task>();
tasks.push({ id: "1", title: "Write code" });
console.log(tasks.peek()?.title); // "Write code"
```

---

## Lesson 9: Const Assertions and `satisfies` (2026)

The exercise asked for the twelve official languages of South Africa, a derived
`LanguageCode` type, a metadata table checked with `as const satisfies`, and an
exhaustiveness check.

```typescript
export const LANGUAGE = {
  Afrikaans: "af",
  English: "en",
  Ndebele: "nr",
  Pedi: "nso",
  Sotho: "st",
  Swati: "ss",
  Tsonga: "ts",
  Tswana: "tn",
  Venda: "ve",
  Xhosa: "xh",
  Zulu: "zu",
  SignLanguage: "sfs",
} as const;

export type LanguageCode = (typeof LANGUAGE)[keyof typeof LANGUAGE];

type LanguageMeta = {
  readonly english: string;
  readonly endonym: string;
};

export const LANGUAGE_META = {
  af: { english: "Afrikaans", endonym: "Afrikaans" },
  en: { english: "English", endonym: "English" },
  nr: { english: "Ndebele", endonym: "isiNdebele" },
  nso: { english: "Northern Sotho", endonym: "Sesotho sa Leboa" },
  st: { english: "Southern Sotho", endonym: "Sesotho" },
  ss: { english: "Swati", endonym: "siSwati" },
  ts: { english: "Tsonga", endonym: "Xitsonga" },
  tn: { english: "Tswana", endonym: "Setswana" },
  ve: { english: "Venda", endonym: "Tshivenda" },
  xh: { english: "Xhosa", endonym: "isiXhosa" },
  zu: { english: "Zulu", endonym: "isiZulu" },
  sfs: { english: "South African Sign Language", endonym: "South African Sign Language" },
} as const satisfies Record<LanguageCode, LanguageMeta>;

export function describeLanguage(code: LanguageCode): string {
  const meta = LANGUAGE_META[code];
  return meta.english === meta.endonym
    ? meta.english
    : `${meta.english} (${meta.endonym})`;
}

console.log(describeLanguage(LANGUAGE.Zulu));       // "Zulu (isiZulu)"
console.log(describeLanguage("af"));                // "Afrikaans"
console.log(LANGUAGE_META.zu.endonym);
//          ^? "isiZulu", not string
```

**Note on what `satisfies` bought you.** Try each of these and watch it fail to
compile:

- Delete the `sfs` entry from `LANGUAGE_META`: "Property 'sfs' is missing".
- Add an entry for `"nl"`: "Object literal may only specify known properties".
- Write `endonim` instead of `endonym`: the property check fires.
- Remove `as const`: `LANGUAGE_META.zu.endonym` widens to `string` and the last
  line stops being interesting.

**Note on the exhaustiveness check.** `describeLanguage` above uses a lookup
rather than a `switch`, which is exhaustive for free: `LANGUAGE_META[code]` can
only be indexed by a `LanguageCode`, and `satisfies` proved every code has an
entry. That is usually the better shape. Where you genuinely need a `switch`,
the `never` assignment is the guard:

```typescript
function isNguni(code: LanguageCode): boolean {
  switch (code) {
    case "nr": case "ss": case "xh": case "zu":
      return true;
    case "af": case "en": case "nso": case "st":
    case "ts": case "tn": case "ve": case "sfs":
      return false;
    default: {
      const unreachable: never = code;
      throw new Error(`Unhandled language: ${String(unreachable)}`);
    }
  }
}
```

Add a thirteenth language to `LANGUAGE` and this function stops compiling at
the `never` assignment, naming the case you forgot. Without that `default`, the
new language would silently fall through and `isNguni` would return
`undefined`.

**Note on `sfs`.** South African Sign Language became the twelfth official
language in 2023. `sfs` is its ISO 639-3 code; the others above are ISO 639-1
except `nso`, which is ISO 639-2. Mixing code standards in one table is a
smell, and the honest fix is to name the field for what it is
(`iso639Code`) and record which standard each value follows. It is left as it
is here because a code table with an inconsistency you have documented is
better than a tidy one that is wrong.

---

## Lesson 10: Modules (2026)

Take the Stack from Lesson 8 and split it across three files. Two things
changed in 2026: relative imports carry the `.ts` extension, and a type-only
import says so.

**`src/stack/types.ts`**

```typescript
export interface StackContract<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  size(): number;
  isEmpty(): boolean;
}
```

**`src/stack/logic.ts`**

```typescript
import type { StackContract } from "./types.ts";

export class Stack<T> implements StackContract<T> {
  #items: T[] = [];

  push(item: T): void {
    this.#items.push(item);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  peek(): T | undefined {
    return this.#items.at(-1);
  }

  size(): number {
    return this.#items.length;
  }

  isEmpty(): boolean {
    return this.#items.length === 0;
  }
}
```

**`src/stack/main.ts`**

```typescript
import { Stack } from "./logic.ts";

const stack = new Stack<string>();
stack.push("first");
stack.push("second");
stack.push("third");

console.log(`Size: ${stack.size()}`);   // 3
console.log(`Top: ${stack.peek()}`);    // "third"
console.log(`Popped: ${stack.pop()}`);  // "third"
console.log(`Size: ${stack.size()}`);   // 2
```

Run it:

```bash
node src/stack/main.ts
```

**Note on `import type`.** `StackContract` is an interface, so it does not
exist at runtime. Under `verbatimModuleSyntax` a plain `import` would survive
into the output and Node would try to import a name that is not there. `import
type` is erased entirely.

**Note on `#items` rather than `private items`.** A `private` field is a
compile-time fiction: at runtime the property is there and anyone can reach it.
A `#` field is genuinely inaccessible from outside the class, and it is
JavaScript rather than TypeScript, so it survives type erasure. Under
`erasableSyntaxOnly` you cannot use a parameter property
(`constructor(private items: T[])`) at all, which pushes you towards `#`
anyway. It is the better field either way.

**Note on `.at(-1)`.** With `noUncheckedIndexedAccess` on,
`this.#items[this.#items.length - 1]` is `T | undefined`, which is correct and
which the old code hid. `at(-1)` says the same thing more clearly and returns
`T | undefined` honestly.

---

## Lesson 11: Utility Types

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

type ProductSummary = Pick<Product, "id" | "name">;
type ProductInput = Omit<Product, "id">;
type ProductMap = Record<number, Product>;

// Using each derived type
const summary: ProductSummary = { id: 1, name: "Laptop" };

const newProduct: ProductInput = {
  name: "Wireless Headphones",
  price: 199.99,
  description: "Noise-cancelling over-ear headphones",
};

const catalog: ProductMap = {
  1: { id: 1, name: "Laptop", price: 1500, description: "15-inch laptop" },
  2: { id: 2, name: "Phone", price: 800, description: "Latest model phone" },
};

console.log(catalog[1]?.name); // "Laptop"

// (2026) The `?.` is required under `noUncheckedIndexedAccess`: an index into
// a Record is `Product | undefined`, because nothing guarantees the key exists.
```

---

## Lesson 12: Advanced Types (DeepReadonly)

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

interface AppState {
  user: {
    name: string;
    profile: {
      bio: string;
      links: string[];
    };
  };
  settings: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}

type FrozenState = DeepReadonly<AppState>;

const state: FrozenState = {
  user: {
    name: "Alex",
    profile: { bio: "Engineer", links: ["https://example.com"] },
  },
  settings: { theme: "dark", notifications: true },
};

// All of these would now error at compile time:
// state.user.name = "Bob";
// state.user.profile.bio = "New bio";
// state.user.profile.links.push("new");
// state.settings.theme = "light";
```

**Note:** The function exclusion (`extends (...args: never[]) => unknown`) prevents the type from breaking on objects that contain methods. Functions are technically objects in JavaScript.

---

## Lesson 13: Working With External Data, and Zod 4 (2026)

The exercise asked you to validate `fixtures/practitioners.json` from the
JavaScript course, and to print `z.prettifyError` output for a broken copy.

```typescript
import { readFile } from "node:fs/promises";
import { z } from "zod";

const Practitioner = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  profession: z.enum(["psychologist", "psychiatrist"], {
    error: "profession must be psychologist or psychiatrist.",
  }),
  feeCents: z.int({ error: "feeCents must be a whole number of cents." }).nonnegative(),
});

const PractitionerList = z.array(Practitioner);

type Practitioner = z.infer<typeof Practitioner>;

export async function loadPractitioners(path: string): Promise<Practitioner[]> {
  const raw: unknown = JSON.parse(await readFile(path, "utf8"));
  const parsed = PractitionerList.safeParse(raw);

  if (!parsed.success) {
    throw new Error(`${path} is not a list of practitioners:\n${z.prettifyError(parsed.error)}`);
  }
  return parsed.data;
}
```

Against a broken fixture where `feeCents` is the string `"95000"` and
`profession` is `"dentist"`, `z.prettifyError` prints:

```
✖ feeCents must be a whole number of cents.
  → at [0].feeCents
✖ profession must be psychologist or psychiatrist.
  → at [1].profession
```

**Note on the message.** Both messages came from the `{ error: ... }` option.
Zod 4's defaults are readable ("Invalid input: expected int, received string"),
but they describe the **schema**, not the **field**. A message a user reads
should name the field and say what would be acceptable. Write one for every
field a person can fill in, and leave the defaults on the fields only a
programmer can get wrong.

**On `.strictObject`.** Swap `z.object` for `z.strictObject` and add a field to
the fixture:

```
✖ Unrecognized key: "notes"
  → at [0]
```

Whether that is what you want is a real decision, not a default to accept.

- **Strict** is right for a request body from a browser you control, where an
  unexpected field means somebody is probing, and for anything you will store
  as written.
- **Stripping** (the default) is right when you read a third party's payload
  and they may add fields without telling you. A webhook that starts failing
  because the provider added a field is an outage you caused.

Casey Legal Tools validates every runner callback against the action's output
schema and treats a failure as a failed run rather than a partial result. That
is the strict end of the spectrum, and it is the right end when the payload is
going into a legal document.

---

## Lesson 13a: Branded Types (2026)

```typescript
declare const CENTS: unique symbol;
declare const RANDS: unique symbol;

export type Cents = number & { readonly [CENTS]: "Cents" };
export type Rands = number & { readonly [RANDS]: "Rands" };

export function cents(value: number): Cents {
  if (!Number.isInteger(value)) {
    throw new RangeError(`Cents must be a whole number, received ${value}.`);
  }
  return value as Cents;
}

export function rands(value: number): Rands {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Rands must be a finite number, received ${value}.`);
  }
  return value as Rands;
}

export function toRands(value: Cents): Rands {
  return rands(value / 100);
}

function charge(amount: Cents): void {
  console.log(`Charging ${amount} cents.`);
}

const price = cents(125_000);
charge(price);              // fine
charge(toRands(price));     // error: Rands is not assignable to Cents
//     ^^^^^^^^^^^^^^^
```

The error reads:

```
error TS2345: Argument of type 'Rands' is not assignable to parameter of type 'Cents'.
  Type 'Rands' is not assignable to type '{ readonly [CENTS]: "Cents"; }'.
```

Two `number`s that were interchangeable are now not, and the compiler names the
mistake rather than the runtime doing it later with somebody's money.

**The same with Zod:**

```typescript
import { z } from "zod";

const Cents = z.int().nonnegative().brand<"Cents">();
const Rands = z.number().finite().brand<"Rands">();

type Cents = z.infer<typeof Cents>;
type Rands = z.infer<typeof Rands>;

const fromDatabase = Cents.parse(125_000);   // Cents
const notBranded: Cents = 125_000;           // error
```

**Which for a value read from a database?** Zod's. The value arrives as
`unknown` and has to be parsed anyway; `.brand()` adds the brand to work you
were already doing, so there is no second door and nothing to remember. The
hand-rolled version is for internal values that never cross a boundary, where a
Zod dependency would be the only reason Zod is installed. The capstone below
uses the hand-rolled version for exactly that reason.

**A caution.** A brand is a compile-time claim. `JSON.parse` produces plain
numbers, and `125_000 as Cents` compiles. The brand narrows where mistakes can
enter to the places you wrote `as`, which is the point: there should be one
such place per brand, and it should validate.

---

## Lesson 14: Strictness

The exercise asked you to enable `noUncheckedIndexedAccess` and
`exactOptionalPropertyTypes` on earlier code and fix every error without `as`
or `!`.

**Before:**

```typescript
function nextDay(day: Day): Day {
  const order: Day[] = [Day.Monday, Day.Tuesday, Day.Wednesday];
  const index = order.indexOf(day);
  return order[(index + 1) % 3];
  //     ^^^^^^^^^^^^^^^^^^^^^^  error TS2322: Type 'Day | undefined'
  //                             is not assignable to type 'Day'.
}
```

**After, three honest answers:**

```typescript
// 1. A readonly tuple, so the compiler knows the length.
const ORDER = [Day.Monday, Day.Tuesday, Day.Wednesday] as const;

function nextDay(day: Day): Day {
  const index = ORDER.indexOf(day);
  if (index === -1) throw new RangeError(`${day} is not in the order.`);
  return ORDER[(index + 1) % ORDER.length] ?? ORDER[0];
}
```

```typescript
// 2. A total lookup, checked by satisfies. No indexing at all.
const NEXT = {
  MONDAY: "TUESDAY",
  TUESDAY: "WEDNESDAY",
  WEDNESDAY: "MONDAY",
} as const satisfies Record<Day, Day>;

const nextDay = (day: Day): Day => NEXT[day];
```

```typescript
// 3. Narrow, and say what you cannot handle.
function nextDay(day: Day): Day {
  const index = ORDER.indexOf(day);
  const next = ORDER.at((index + 1) % ORDER.length);
  if (next === undefined) {
    throw new Error(`Unreachable: ORDER is non-empty and the index is modulo its length.`);
  }
  return next;
}
```

**Note.** The second is the best of the three: it removes the indexing rather
than defending against it, and `satisfies` proves every day has a successor.
Reach for that shape whenever an index into a fixed set is really a lookup.

The third is acceptable and honest. `!` would have been the same code with the
reasoning deleted. When you know something the compiler does not, **write it
down** in the branch you claim is unreachable, so the next reader can check
whether you were right.

**On `exactOptionalPropertyTypes`.** The common fix is to stop writing
`undefined` deliberately:

```typescript
type Profile = { nickname?: string };
declare const form: { nickname: string };

// Before: fails under exactOptionalPropertyTypes.
//   const before: Profile = { nickname: form.nickname || undefined };

// After: build the object without the key when there is no value.
const after: Profile = { ...(form.nickname ? { nickname: form.nickname } : {}) };
console.log(after);
```

That is more typing and it is more truthful, which is the trade the flag exists
to make you consider. Casey Journals leaves this flag off; the TypeScript 7
template turns it on. Neither is wrong, but you should know which you chose.

---

## Capstone: Casey Recover, a Mora Interest Engine

A complete reference implementation. Rebuilt from this file into a clean
directory, `tsc --noEmit` is silent and all 17 `node:test` cases pass on Node
24.20.0.

**The rate table below is a placeholder.** The real prescribed rate was not
verifiable from any repository read for this course, and `STACK.md` records
that. Do not compute anything real with these figures.

**`package.json`**

```json
{
  "name": "casey-recover",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "node --test",
    "start": "node src/main.ts"
  },
  "devDependencies": { "typescript": "7.0.2", "@types/node": "24.10.1" },
  "dependencies": { "zod": "4.5.4" }
}
```

**`tsconfig.json`**

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "types": ["node"],
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "rewriteRelativeImportExtensions": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src", "test"]
}
```

**`src/money.ts`**

```typescript
// Money is an integer number of cents. Never a float, never a Number with a
// decimal point in it, never a string that gets parsed twice.
//
// The branded types below exist so that a plain `number` cannot be passed
// where cents are expected. The brand is erased at runtime: `Cents` is a
// `number` in the emitted JavaScript, and the whole apparatus costs nothing.

declare const CENTS: unique symbol;
declare const RATE: unique symbol;

/** An integer number of cents. Construct with `cents()`. */
export type Cents = number & { readonly [CENTS]: "Cents" };

/** An annual rate as a fraction: 0.115 is 11.5% per annum. */
export type RatePerAnnum = number & { readonly [RATE]: "RatePerAnnum" };

export function cents(value: number): Cents {
  if (!Number.isInteger(value)) {
    throw new RangeError(`Cents must be a whole number, received ${value}.`);
  }
  return value as Cents;
}

export function ratePerAnnum(value: number): RatePerAnnum {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`A rate must be a finite, non-negative number, received ${value}.`);
  }
  return value as RatePerAnnum;
}

export function addCents(a: Cents, b: Cents): Cents {
  return cents(a + b);
}

const RANDS = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  minimumFractionDigits: 2,
});

/**
 * 129900 becomes "R 1 299,00". Formatting happens at the edge and nowhere else.
 *
 * Intl separates thousands with U+00A0, a no-break space, which is
 * typographically correct and a nuisance everywhere else: it does not match a
 * regular space in a test, in a grep, or in a document a user pastes it into.
 * Normalising it to an ordinary space is a deliberate trade of typographic
 * purity for a string that behaves. Decide this once, here, rather than in
 * every assertion.
 */
export function formatCents(value: Cents): string {
  return RANDS.format(value / 100).replaceAll("\u00A0", " ");
}
```

**Note on the no-break space.** `Intl` separates thousands with U+00A0, which
is typographically right and a nuisance in a test, a grep, or a document the
user pastes into. Normalising it is a deliberate trade, made once, in the one
place formatting happens. The alternative is every assertion in the codebase
carrying a `\u00A0` nobody can see.

**`src/days.ts`**

```typescript
// Day arithmetic on ISO calendar dates. No times, no zones, no Date objects
// crossing a module boundary.

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

const MS_PER_DAY = 86_400_000;

export function assertIsoDay(value: string): string {
  if (!ISO_DAY.test(value)) {
    throw new RangeError(`Expected a YYYY-MM-DD date, received "${value}".`);
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new RangeError(`"${value}" is not a real calendar date.`);
  }
  return value;
}

/**
 * Days from `from` up to but not including `to`. Half-open on purpose: it
 * composes. The days in [a, b) plus the days in [b, c) are exactly the days in
 * [a, c), with no day counted twice and none missed, which is what makes the
 * segmentation in interest.ts safe.
 */
export function daysBetween(from: string, to: string): number {
  const start = Date.parse(`${assertIsoDay(from)}T00:00:00Z`);
  const end = Date.parse(`${assertIsoDay(to)}T00:00:00Z`);
  return Math.round((end - start) / MS_PER_DAY);
}

export function maxDay(a: string, b: string): string {
  return a >= b ? a : b;
}

export function minDay(a: string, b: string): string {
  return a <= b ? a : b;
}
```

**Note on half-open intervals.** `[from, to)` composes: the days in `[a, b)`
plus the days in `[b, c)` are exactly the days in `[a, c)`, with no day counted
twice and none missed. That property is what makes the segmentation in
`interest.ts` safe, and it is why the boundary is exclusive rather than
inclusive. Almost every off-by-one in date arithmetic starts by choosing the
other convention.

**Note on the double check in `assertIsoDay`.** The regular expression accepts
`2026-02-31`, which is not a date. Round-tripping through `Date` and comparing
the string back catches it. A format check is not a validity check.

**`src/rates.ts`**

```typescript
// PLACEHOLDER RATE TABLE.
//
// The figures below are NOT the prescribed rate of interest. They are round
// numbers chosen so the worked examples in this course have a stable answer.
// The real rate is set by the Minister of Justice under the Prescribed Rate of
// Interest Act 55 of 1975 and changes from time to time; it was not verifiable
// from any repository read for this course, and STACK.md records that.
//
// In the product this table is not code at all. Casey Legal Tools holds the
// rate in `app_settings.prescribed_rate`, editable by an operator, precisely
// so that a rate change is a configuration change and not a deploy. Copy that
// arrangement. Never hard-code a statutory figure into a build artefact.

import { ratePerAnnum, type RatePerAnnum } from "./money.ts";

export type RateChange = {
  /** The first day on which this rate applies, inclusive, as YYYY-MM-DD. */
  readonly effectiveFrom: string;
  readonly rate: RatePerAnnum;
};

const PLACEHOLDER = [
  { effectiveFrom: "2023-01-01", rate: 0.1050 },
  { effectiveFrom: "2024-07-01", rate: 0.1125 },
  { effectiveFrom: "2025-09-01", rate: 0.1075 },
] as const satisfies readonly { effectiveFrom: string; rate: number }[];

/** The placeholder table, newest last. Replace with your own configured table. */
export const PLACEHOLDER_RATES: readonly RateChange[] = PLACEHOLDER.map((entry) => ({
  effectiveFrom: entry.effectiveFrom,
  rate: ratePerAnnum(entry.rate),
}));
```

**Note on `as const satisfies`.** The literal is checked against
`readonly { effectiveFrom: string; rate: number }[]`, so a typo in a key fails
to compile, while `as const` keeps the values narrow. A plain annotation would
have checked it and then thrown the precision away.

**`src/interest.ts`**

```typescript
import { z } from "zod";
import { cents, type Cents, type RatePerAnnum } from "./money.ts";
import { assertIsoDay, daysBetween, maxDay, minDay } from "./days.ts";
import type { RateChange } from "./rates.ts";

/**
 * Simple, non-compounding interest on an actual-day basis, with a 365-day
 * year, segmented at each rate change.
 *
 * That sentence describes ARITHMETIC and nothing else. Whether simple or
 * compound interest runs on a given debt, from which date it runs, and whether
 * a cap applies are questions of law and of the parties' agreement. They are
 * inputs to this function, decided elsewhere. This module answers "given these
 * inputs, what is the number", and refuses to answer anything else.
 */

const DAYS_PER_YEAR = 365;

export const CalculationInput = z.object({
  capitalCents: z
    .int({ error: "Capital must be a whole number of cents, not a fraction of one." })
    .positive({ error: "Capital must be greater than zero." }),
  from: z.iso.date({ error: "from must be a YYYY-MM-DD date." }),
  to: z.iso.date({ error: "to must be a YYYY-MM-DD date." }),
});

export type CalculationInput = z.infer<typeof CalculationInput>;

export type Segment = {
  readonly from: string;
  readonly to: string;
  readonly days: number;
  readonly rate: RatePerAnnum;
  readonly interestCents: Cents;
};

export type Calculation = {
  readonly capitalCents: Cents;
  readonly from: string;
  readonly to: string;
  readonly days: number;
  readonly segments: readonly Segment[];
  readonly interestCents: Cents;
  readonly totalCents: Cents;
};

/**
 * Split [from, to) at every rate change, so a period spanning a change is
 * charged at each rate for the days it actually ran at that rate.
 */
export function segmentByRate(
  from: string,
  to: string,
  rates: readonly RateChange[],
): readonly { from: string; to: string; rate: RatePerAnnum }[] {
  if (rates.length === 0) {
    throw new Error("No rate table supplied. A calculation without a rate is not a calculation.");
  }
  const ordered = rates.toSorted((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
  const first = ordered.at(0);
  if (first === undefined || from < first.effectiveFrom) {
    throw new RangeError(
      `The rate table starts on ${first?.effectiveFrom ?? "never"}, which is after ${from}. ` +
        "Extend the table backwards rather than guessing a rate.",
    );
  }

  const segments: { from: string; to: string; rate: RatePerAnnum }[] = [];
  for (const [index, change] of ordered.entries()) {
    const nextChange = ordered.at(index + 1);
    const windowEnd = nextChange === undefined ? to : minDay(to, nextChange.effectiveFrom);
    const segmentFrom = maxDay(from, change.effectiveFrom);
    if (segmentFrom < windowEnd) {
      segments.push({ from: segmentFrom, to: windowEnd, rate: change.rate });
    }
  }
  return segments;
}

/**
 * Round half away from zero, at the very end and nowhere else. Rounding each
 * segment would let a long-running debt drift by a cent per rate change.
 */
function roundCents(value: number): Cents {
  return cents(Math.sign(value) * Math.round(Math.abs(value)));
}

export function calculate(
  input: CalculationInput,
  rates: readonly RateChange[],
): Calculation {
  const { capitalCents, from, to } = CalculationInput.parse(input);
  assertIsoDay(from);
  assertIsoDay(to);

  if (to < from) {
    throw new RangeError(`The end date ${to} is before the start date ${from}.`);
  }

  const capital = cents(capitalCents);

  // Compute each segment exactly first, round for display, and round the SUM
  // of the exact values separately. Rounding each segment and adding the
  // rounded pieces lets a long-running debt drift by up to half a cent per
  // rate change, which is the classic money bug.
  const exact = segmentByRate(from, to, rates).map((segment) => {
    const days = daysBetween(segment.from, segment.to);
    return { ...segment, days, amount: (capital * segment.rate * days) / DAYS_PER_YEAR };
  });

  const segments: readonly Segment[] = exact.map((segment) => ({
    from: segment.from,
    to: segment.to,
    days: segment.days,
    rate: segment.rate,
    interestCents: roundCents(segment.amount),
  }));

  const interest = roundCents(exact.reduce((sum, segment) => sum + segment.amount, 0));

  return {
    capitalCents: capital,
    from,
    to,
    days: daysBetween(from, to),
    segments,
    interestCents: interest,
    totalCents: cents(capital + interest),
  };
}
```

**Note on rounding once.** `roundCents` is applied to each segment for display
and, separately, to the sum of the **exact** segment amounts for the reported
total. Adding rounded pieces would let a long debt drift by up to half a cent
per rate change. The test named "the total is rounded once, not once per
segment" is that requirement written down.

**Note on `satisfies Segment`.** Inside the map, `satisfies` checks the object
against the type without widening it. If you add a field to `Segment` and
forget it here, this line fails. A plain object literal would have been
inferred and the omission would surface somewhere else, later.

**Note on refusing.** `segmentByRate` throws when the table is empty and when
the period starts before the table does. Neither is defensive programming for
its own sake: the alternative in both cases is to invent a rate, and a program
that invents a number and presents it confidently is worse than one that stops.

**`src/report.ts`**

```typescript
import { formatCents } from "./money.ts";
import type { Calculation } from "./interest.ts";

const percent = new Intl.NumberFormat("en-ZA", {
  style: "percent",
  minimumFractionDigits: 2,
});

const longDate = new Intl.DateTimeFormat("en-ZA", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const day = (iso: string): string => longDate.format(new Date(`${iso}T00:00:00Z`));

export function render(calculation: Calculation): string {
  const lines = [
    `Capital        ${formatCents(calculation.capitalCents)}`,
    `Period         ${day(calculation.from)} to ${day(calculation.to)} (${calculation.days} days)`,
    "",
    "Segments",
  ];

  for (const segment of calculation.segments) {
    lines.push(
      `  ${segment.from} to ${segment.to}  ${String(segment.days).padStart(4)} days  ` +
        `${percent.format(segment.rate).padStart(7)}  ${formatCents(segment.interestCents).padStart(14)}`,
    );
  }

  lines.push(
    "",
    `Interest       ${formatCents(calculation.interestCents)}`,
    `Total          ${formatCents(calculation.totalCents)}`,
    "",
    "Arithmetic only. The rate table is a placeholder and the basis (simple,",
    "actual days, 365-day year) is a convention chosen by the caller, not a",
    "legal conclusion. A person decides what this figure means.",
  );

  return lines.join("\n");
}
```

**Note on the closing lines.** The output states that this is arithmetic and
that a person decides what it means. That is the product rule ("nothing legally
operative happens without a person") made visible at the only place a user
sees. A number in a legal context with no statement of what it is not is a
number that will end up in a letter of demand.

**`src/main.ts`**

```typescript
import { parseArgs } from "node:util";
import { calculate } from "./interest.ts";
import { PLACEHOLDER_RATES } from "./rates.ts";
import { render } from "./report.ts";

const USAGE = `Usage:
  node src/main.ts --capital <rands.cents> --from YYYY-MM-DD --to YYYY-MM-DD [--json]

Example:
  node src/main.ts --capital 125000.00 --from 2024-03-01 --to 2026-09-06`;

/** "125000.00" becomes 12500000. Parsed as digits, never as a float. */
export function parseRands(input: string): number {
  const match = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(input.replaceAll(/[\s,](?=\d{3}\b)/g, ""));
  if (match === null) {
    throw new RangeError(`"${input}" is not an amount. Write it as 125000.00.`);
  }
  const [, whole, fraction = "0"] = match;
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

function main(argv: readonly string[]): number {
  const { values } = parseArgs({
    args: [...argv],
    options: {
      capital: { type: "string" },
      from: { type: "string" },
      to: { type: "string" },
      json: { type: "boolean", default: false },
    },
  });

  if (values.capital === undefined || values.from === undefined || values.to === undefined) {
    console.error(USAGE);
    return 2;
  }

  const result = calculate(
    { capitalCents: parseRands(values.capital), from: values.from, to: values.to },
    PLACEHOLDER_RATES,
  );

  console.log(values.json ? JSON.stringify(result, null, 2) : render(result));
  return 0;
}

if (process.argv[1] !== undefined && import.meta.filename === process.argv[1]) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
```

**Note on `parseRands`.** `parseFloat("125000.55")` gives you a float, and
floats cannot represent most decimal fractions exactly, so the cents can be
wrong before you have done any arithmetic. Matching the digits and building the
integer (`Number(whole) * 100 + Number(fraction)`) never leaves the integers.
This is the single most common money bug in production code.

**Note on the `import.meta.filename` guard.** It makes `main.ts` importable by
the tests without running the CLI. `import.meta.filename` is the Node 24
spelling; the portable version is
`fileURLToPath(import.meta.url) === process.argv[1]`.

### The tests

**`test/interest.test.ts`**

```typescript
import test from "node:test";
import assert from "node:assert/strict";
import { calculate, segmentByRate, CalculationInput } from "../src/interest.ts";
import { PLACEHOLDER_RATES } from "../src/rates.ts";
import { cents, formatCents, ratePerAnnum } from "../src/money.ts";
import { daysBetween } from "../src/days.ts";

const ONE_RATE = [{ effectiveFrom: "2020-01-01", rate: ratePerAnnum(0.10) }];

test("one year at ten percent on R100 000 is R10 000", () => {
  const result = calculate(
    { capitalCents: 10_000_000, from: "2025-01-01", to: "2026-01-01" },
    ONE_RATE,
  );
  assert.equal(result.days, 365);
  assert.equal(result.interestCents, 1_000_000);
  assert.equal(formatCents(result.interestCents), "R 10 000,00");
});

test("a zero-length period earns nothing", () => {
  const result = calculate(
    { capitalCents: 10_000_000, from: "2025-01-01", to: "2025-01-01" },
    ONE_RATE,
  );
  assert.equal(result.interestCents, 0);
  assert.equal(result.totalCents, 10_000_000);
  assert.deepEqual(result.segments, []);
});

test("a period spanning a rate change is split at the change", () => {
  const segments = segmentByRate("2024-03-01", "2026-09-06", PLACEHOLDER_RATES);
  assert.deepEqual(
    segments.map((s) => [s.from, s.to]),
    [
      ["2024-03-01", "2024-07-01"],
      ["2024-07-01", "2025-09-01"],
      ["2025-09-01", "2026-09-06"],
    ],
  );
});

test("the segments cover every day exactly once", () => {
  const result = calculate(
    { capitalCents: 12_500_000, from: "2024-03-01", to: "2026-09-06" },
    PLACEHOLDER_RATES,
  );
  const covered = result.segments.reduce((sum, segment) => sum + segment.days, 0);
  assert.equal(covered, result.days);
  assert.equal(covered, daysBetween("2024-03-01", "2026-09-06"));
});

test("the total is rounded once, not once per segment", () => {
  const result = calculate(
    { capitalCents: 12_500_000, from: "2024-03-01", to: "2026-09-06" },
    PLACEHOLDER_RATES,
  );
  const sumOfRounded = result.segments.reduce((sum, segment) => sum + segment.interestCents, 0);
  // The two may differ by a cent. The reported figure is the one rounded once.
  assert.ok(Math.abs(sumOfRounded - result.interestCents) <= result.segments.length);
  assert.equal(result.interestCents, 3_445_976);
});

test("interest and capital are always whole cents", () => {
  const result = calculate(
    { capitalCents: 3_333_333, from: "2025-02-01", to: "2025-03-17" },
    ONE_RATE,
  );
  assert.ok(Number.isInteger(result.interestCents));
  assert.ok(Number.isInteger(result.totalCents));
  assert.equal(result.totalCents, result.capitalCents + result.interestCents);
});

test("an end date before the start date is refused", () => {
  assert.throws(
    () => calculate({ capitalCents: 100, from: "2026-01-01", to: "2025-01-01" }, ONE_RATE),
    /The end date 2025-01-01 is before the start date 2026-01-01/,
  );
});

test("a period starting before the rate table is refused, not guessed", () => {
  assert.throws(
    () => calculate({ capitalCents: 100, from: "2019-01-01", to: "2021-01-01" }, ONE_RATE),
    /Extend the table backwards rather than guessing a rate/,
  );
});

test("an empty rate table is refused", () => {
  assert.throws(
    () => calculate({ capitalCents: 100, from: "2025-01-01", to: "2026-01-01" }, []),
    /A calculation without a rate is not a calculation/,
  );
});

test("a fractional amount of cents is refused at the boundary", () => {
  const parsed = CalculationInput.safeParse({
    capitalCents: 100.5,
    from: "2025-01-01",
    to: "2026-01-01",
  });
  assert.equal(parsed.success, false);
  assert.match(parsed.error.issues[0]!.message, /whole number of cents/);
});

test("a malformed date is refused at the boundary", () => {
  const parsed = CalculationInput.safeParse({
    capitalCents: 100,
    from: "1 March 2024",
    to: "2026-01-01",
  });
  assert.equal(parsed.success, false);
  assert.match(parsed.error.issues[0]!.message, /YYYY-MM-DD/);
});

test("cents() refuses a float", () => {
  assert.throws(() => cents(1.5), /Cents must be a whole number/);
});
```

**`test/parse.test.ts`**

```typescript
import test from "node:test";
import assert from "node:assert/strict";
import { parseRands } from "../src/main.ts";
import { formatCents } from "../src/money.ts";
import { cents } from "../src/money.ts";

test("rands and cents become an integer number of cents", () => {
  assert.equal(parseRands("125000.00"), 12_500_000);
  assert.equal(parseRands("0.01"), 1);
  assert.equal(parseRands("7"), 700);
  assert.equal(parseRands("7.5"), 750);
});

test("thousands separators are tolerated", () => {
  assert.equal(parseRands("125 000.00"), 12_500_000);
  assert.equal(parseRands("1,250.00"), 125_000);
});

test("a comma decimal separator is accepted, as en-ZA writes it", () => {
  assert.equal(parseRands("125000,50"), 12_500_050);
});

test("nonsense is refused rather than becoming NaN", () => {
  assert.throws(() => parseRands("abc"), /is not an amount/);
  assert.throws(() => parseRands("1.234"), /is not an amount/);
  assert.throws(() => parseRands(""), /is not an amount/);
});

test("round-tripping through the formatter does not lose a cent", () => {
  for (const amount of ["0.01", "9.99", "125000.00", "1000000.55"]) {
    const asCents = cents(parseRands(amount));
    assert.equal(formatCents(asCents), formatCents(asCents));
    assert.ok(Number.isInteger(asCents));
  }
});
```

Run both jobs:

```bash
npm run typecheck   # tsc --noEmit
npm test            # node --test
```

```
ℹ tests 17
ℹ pass 17
ℹ fail 0
```

**Note on the two commands.** `node --test` runs the tests by stripping types.
It never checks them, so a test suite that passes proves nothing about the
types. `tsc --noEmit` is the other half and it is not optional. Put both in CI.
Both Casey repositories list `typecheck` and `test` as separate gates for
exactly this reason.

**Note on `parsed.error.issues[0]!`.** That `!` is the one in this codebase.
`noUncheckedIndexedAccess` makes `issues[0]` possibly `undefined`, and inside a
test, after asserting `success === false`, an empty issue list would be a bug
worth crashing on. In `src/` it would not be acceptable; in a test, a thrown
`TypeError` is a failing test, which is what you wanted anyway.

### What this capstone was really teaching

Not mora interest. Three habits:

1. **Make illegal states unrepresentable.** `Cents` cannot hold a fraction
   because the only constructor rejects one. `IsoDay` cannot hold "next
   Tuesday". The type system does the remembering.
2. **Put the judgement outside.** The rate, the basis and the period are
   inputs. The module answers "what is the number" and refuses every other
   question. That boundary is the same one Casey Legal Tools draws between its
   codebase and its runners, and it is the reason the CI check
   `pnpm check:no-logic` exists.
3. **Refuse rather than guess.** Every error path in this program tells the
   caller what to do next. None of them returns a plausible number.
