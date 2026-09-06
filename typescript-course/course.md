# TypeScript: A Practical Course From Start to Finish

Revised for 2026. A hands-on course that takes you from zero to comfortable
with TypeScript. Every lesson has runnable examples and a small exercise. Work
through them in order. Total time: roughly 10 to 15 hours if you do the
exercises.

This course assumes you are comfortable with modern JavaScript (the topics
covered in the JavaScript course in this series). If you are not, work through
that course first.

Material added or changed in the 2026 revision is marked **(2026)**.

**Baseline (2026):** TypeScript 7.0.2, Node.js 24 (Active LTS), Zod 4.5.4.
Every sample was type-checked with `tsc --noEmit` against the `tsconfig.json`
this course documents, and every runnable sample was executed on Node 24.20.0.
The version table lives in `STACK.md` at the root of this repository.

Any term this course uses without stopping to define is defined once in
[`../GLOSSARY.md`](../GLOSSARY.md).

Some samples are **meant** to fail, because the error is the lesson. Those
carry a comment naming the error, like `// error TS1294`. Everything else
type-checks clean.

---

## Lesson 0: Setup (rewritten for TypeScript 7)

### What is TypeScript?

TypeScript is a language created by Microsoft that adds static types to
JavaScript. You write TypeScript, a checker verifies it, and the types are then
removed so that plain JavaScript runs in browsers or in Node.

> **Background: What does "static types" mean?**
>
> In a dynamically typed language such as JavaScript, the type of a value
> (string, number, object) is checked only when the program runs. In a
> statically typed language such as TypeScript, the types are also checked
> before it runs. Bugs such as passing a string where a number was expected are
> caught in your editor instead of in production.

> **Background (2026): Is TypeScript still a compiler?**
>
> Less than it was, and this is the single biggest change in the 2026 revision.
>
> TypeScript does two separate jobs. It **checks** types, and it **erases**
> them to produce JavaScript. Those jobs have come apart. Node 24 erases types
> itself, so `node app.ts` just runs. Vite, esbuild and Next.js all erase types
> as part of bundling. What is left for `tsc` is the checking, which is why
> almost every modern project runs it as `tsc --noEmit`.
>
> TypeScript 7, released on 8 July 2026, is a rewrite of the compiler in Go.
> Nothing about the language changed. It is the same checker, roughly ten times
> faster, and the practical consequence is that a whole-project check is fast
> enough to be a save-time habit rather than a coffee break.

### What you need (2026)

Node.js 24 (the Active LTS line) and an editor with TypeScript support. That is
all. Note what is **not** in the list:

| No longer needed | Why |
| --- | --- |
| `ts-node` | Node runs `.ts` files itself |
| `tsx` | The same |
| `nodemon` | `node --watch` |
| `dotenv` | `node --env-file=.env` |
| A `dist/` build step for scripts | Nothing is emitted at all |

### Initialise the project (2026)

```bash
mkdir ts-course && cd ts-course
npm init -y
npm pkg set type=module
npm install --save-dev typescript@7 @types/node
npm install zod
npx tsc --init
```

Two development dependencies rather than three. `ts-node` is gone.

> **Background: What is `@types/node`?**
>
> Many JavaScript libraries ship no type information. The community maintains a
> large collection of type definitions called DefinitelyTyped, published to npm
> with an `@types/` prefix. `@types/node` tells TypeScript what `process.argv`,
> `readFile` and `setTimeout` look like.
>
> **(2026)** In TypeScript 7 this package is no longer picked up automatically.
> You must list it: `"types": ["node"]`. The reason is below.

> **Background: What is `npx`?**
>
> `npx` runs a command from a package installed in your project without
> installing it globally. `npx tsc` runs your project's own compiler, which
> means your build does not depend on what happens to be installed on the
> machine.

### The tsconfig.json TypeScript 7 writes

`npx tsc --init` produces this. It is a very different file from the one
earlier versions wrote.

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
    "types": [],

    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

### The new defaults (2026)

These hold even with **no** `tsconfig.json` at all. Each was checked by running
`tsc` 7.0.2; the probes and their exact output are in `STACK.md` section 4.

| Option | Default in TypeScript 7 | What it used to be | What this means for you |
| --- | --- | --- | --- |
| `strict` | **on** | off | `function f(x) {}` is now an error out of the box. You have to opt *out* of safety, not into it. |
| `target` | `esnext` | `es5` | Nothing is downlevelled. The output is the input with the types removed. |
| `module` | `esnext` | `commonjs` | ES modules are the assumption. |
| `moduleResolution` | `bundler` | `node10` | Resolution matches what bundlers actually do. |
| `types` | `[]` | every `@types/*` in `node_modules` | Ambient types are opt-in. |

> **Background (2026): Why did `types` change, and why is it an improvement?**
>
> Previously, every `@types/*` package anywhere in `node_modules` was loaded
> into the global scope of your project. Install one package whose dependency
> pulls in `@types/jest`, and suddenly `describe` and `it` are globals in your
> production code, and TypeScript will happily let you call them. Compilation
> got slower with every install and the global scope was decided by your
> dependency tree.
>
> With `"types": []` you name what you want:
>
> ```json
> { "compilerOptions": { "types": ["node"] } }
> ```
>
> If `process` is suddenly "Cannot find name", this is why. Add `"node"`.

### Options that are gone (2026)

TypeScript 6 deprecated these. TypeScript 7 refuses them. Each error below is
the real message from `tsc` 7.0.2.

| Option | What happens now |
| --- | --- |
| `"target": "es5"` | `error TS5108: Option 'target=ES5' has been removed.` |
| `"moduleResolution": "node"` | `error TS5108: Option 'moduleResolution=node10' has been removed.` |
| `"baseUrl"` | `error TS5102: Option 'baseUrl' has been removed.` |
| `importsNotUsedAsValues` | `error TS5023: Unknown compiler option` |
| `preserveValueImports` | `error TS5023: Unknown compiler option` |
| `keyofStringsOnly` | `error TS5023: Unknown compiler option` |
| `suppressImplicitAnyIndexErrors` | `error TS5023: Unknown compiler option` |
| `noImplicitUseStrict` | `error TS5023: Unknown compiler option` |
| `out`, `charset` | `error TS5023: Unknown compiler option` |
| `module: "amd"`, `"umd"`, `"system"` | Rejected under the default `bundler` resolution |

`baseUrl` deserves a note, because a great many older projects use it for path
aliases. Use `paths` on its own instead, with each entry relative to the
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### The options worth understanding (2026)

`verbatimModuleSyntax`, `isolatedModules` and `erasableSyntaxOnly` are the
three that shape how you write code. They exist because of the split described
above: the thing that erases your types is often not `tsc`.

**`isolatedModules`** requires every file to be transformable **on its own**,
with no knowledge of any other file. That is exactly the constraint esbuild,
SWC and Node's type stripping work under: they see one file at a time.

**`verbatimModuleSyntax`** requires you to mark type-only imports, and then
emits the rest verbatim.

```typescript
// Wrong under verbatimModuleSyntax: is Practitioner a value or a type?
// The single-file tool cannot know, so it must guess.
//   import { Practitioner, bookSession } from "./booking.ts";

// Right: the type import is erased, the value import is kept.
import type { Practitioner } from "./booking.ts";
import { bookSession } from "./booking.ts";

// Also right, and often tidier:
//   import { type Practitioner, bookSession } from "./booking.ts";
```

**`erasableSyntaxOnly`** rejects any TypeScript syntax that is not simply
deleted. Three things fail:

```typescript
// All three are errors under erasableSyntaxOnly:
enum Colour { Red, Green }                            // TS1294
class P { constructor(private readonly x: number) {} } // TS1294
namespace NS { export const a = 1; }                   // TS1294
```

Each of them **generates runtime code**. An `enum` becomes an object. A
parameter property becomes an assignment in the constructor body. A `namespace`
becomes an immediately invoked function. A tool that only deletes types cannot
produce them, so they cannot run under `node app.ts`.

> **Background (2026): Should I turn `erasableSyntaxOnly` on?**
>
> Yes, on anything new. It is not a restriction so much as a description of the
> subset of TypeScript that works everywhere. The three features it removes all
> have better replacements, which Lesson 9 covers, and every one of them was
> already discouraged before this flag existed.
>
> If you maintain an older codebase full of enums, leave it off and migrate
> gradually. Nothing breaks; you simply cannot run those files with `node`.

### Running TypeScript (2026)

Create `src/hello.ts`:

```typescript
const greet = (name: string): string => `Hello, ${name}.`;
console.log(greet("World"));
```

Run it:

```bash
node src/hello.ts
```

That is the whole story. Node 24 strips the types and runs the result. You can
check that the feature is on:

```bash
node -p "process.features.typescript"   # "strip"
```

> **Background (2026): What exactly does Node do to my file?**
>
> It **erases**, and it does not **check**. Every type annotation is replaced
> with whitespace of the same width, so the line and column numbers in a stack
> trace still point at your source and no source map is needed. That is the
> whole trick, and it is why the feature is fast and why it cannot support
> `enum`: erasing is all it does.
>
> The consequence matters: **`node app.ts` will happily run code that does not
> type-check.** Node never looks at the types. Checking is a separate command
> and it belongs in your scripts and in CI.
>
> ```bash
> node --experimental-transform-types app.ts   # also compiles enums, if you must
> ```

Add both jobs to `package.json`:

```json
{
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "start": "node src/main.ts",
    "dev": "node --watch src/main.ts",
    "typecheck": "tsc --noEmit",
    "test": "node --test"
  }
}
```

`npm run typecheck` is the one that can fail your build. Run it before every
commit. `node --run typecheck` does the same thing without npm in the middle.

### Importing with a `.ts` extension (2026)

Because Node resolves the real file on disk, imports carry the real extension:

```typescript
import { calculate } from "./interest.ts";
```

For `tsc` to accept that, add two options:

```json
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true
  }
}
```

`allowImportingTsExtensions` permits the spelling. `rewriteRelativeImportExtensions`
turns `./interest.ts` into `./interest.js` **if** you ever do emit, so the same
source works whether it is run directly or built.

> **Background (2026): Why not just write `./interest.js` as we used to?**
>
> Because it was always a lie. The file on disk is `interest.ts`, and writing
> `.js` only worked because a bundler was quietly rewriting it. Now that Node
> reads the file itself, the specifier has to name a file that exists. Writing
> what is true is a small mercy the ecosystem took twenty years to arrive at.

If you see `Hello, World.`, you are ready.

---

## Lesson 1: Primitive Types and Inference

TypeScript adds static types on top of JavaScript. The compiler often infers types for you, so you do not always need to annotate.

> **Background: What does "type inference" mean?**
>
> Inference is when TypeScript figures out the type of a value automatically based on how you use it. If you write `let count = 5`, TypeScript knows `count` is a number without you having to say so. Inference is one reason TypeScript feels lightweight: you only annotate when the compiler cannot guess, or when explicit annotations make the code clearer.

```typescript
// Explicit annotations
let username: string = "alice";
let age: number = 30;
let isAdmin: boolean = false;
let nothing: null = null;
let notDefined: undefined = undefined;

// Inference: TypeScript figures it out
let city = "Cape Town"; // inferred as string
let score = 100;        // inferred as number

// This will fail at compile time
// city = 42; // Error: Type 'number' is not assignable to type 'string'
```

The `any` type opts out of type checking. Avoid it. Use `unknown` when you genuinely do not know the type:

```typescript
let dangerous: any = "hello";
dangerous.foo.bar(); // No error, but crashes at runtime

let safe: unknown = "hello";
// safe.toUpperCase(); // Error: must narrow first
if (typeof safe === "string") {
  console.log(safe.toUpperCase()); // OK now
}
```

> **Background: Why is `any` bad and `unknown` good?**
>
> `any` turns off the type system for that value, which removes the protection TypeScript provides. `unknown` says "I do not yet know what this is", which forces you to check the type before using it. The compiler will not let you call methods on an `unknown` value until you have proven what it is.

**Exercise:** Declare variables for a person's name, age, and whether they have a driving license. Try assigning a wrong type to each and read the error message.

---

## Lesson 2: Arrays, Tuples, and Readonly

Arrays have one type:

```typescript
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["Alice", "Bob"]; // alternative syntax

numbers.push(4);
// numbers.push("five"); // Error
```

Tuples are fixed-length arrays where each position has a known type:

```typescript
const coordinate: [number, number] = [50.1, 18.4];
const userRow: [string, number, boolean] = ["Maria", 30, true];

// Destructuring
const [lat, lng] = coordinate;
```

> **Background: What is the difference between an array and a tuple?**
>
> An array can grow or shrink and every element has the same type. A tuple has a fixed length and each position has its own type. Tuples are useful when a function returns multiple related values (like `useState` in React, which we will cover later) or for representing structured data like coordinates or rows.

`readonly` prevents mutation:

```typescript
const config: readonly string[] = ["a", "b", "c"];
// config.push("d"); // Error
```

> **Background: Why use `readonly`?**
>
> `readonly` is a promise to other code that you will not change the array. This protects against accidental mutation, especially when passing arrays as function arguments. The original array still exists, but the reference cannot be used to modify it.

**Exercise:** Build a tuple type that represents an HTTP response: status code, status text, and a body string. Create one and destructure it.

---

## Lesson 3: Functions

Annotate parameters and return types:

```typescript
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}
greet("Sarah");          // OK
greet("Sarah", "Dr.");   // OK

// Default parameters
function power(base: number, exp: number = 2): number {
  return base ** exp;
}

// Rest parameters
function sum(...values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}
```

> **Background: When should I annotate the return type?**
>
> For most short functions, TypeScript will infer the return type correctly. Annotating is still useful in two cases. First, on exported public APIs, an explicit return type acts as documentation. Second, an annotation catches mistakes where you accidentally return something different from what you intended.

Function types as values:

```typescript
type BinaryOp = (a: number, b: number) => number;

const subtract: BinaryOp = (a, b) => a - b;
```

> **Background: What is a "type alias"?**
>
> The `type` keyword creates a name for a type. It does not create a new value at runtime; it only exists during compilation. Type aliases let you avoid repeating long type definitions and give meaningful names to common shapes.

Functions that never return (throw or loop forever) use `never`:

```typescript
function fail(message: string): never {
  throw new Error(message);
}
```

**Exercise:** Write a function `formatPrice` that takes a number and an optional currency code (default "ZAR"). It should return a formatted string like "R 99.00" for ZAR, "$ 99.00" for USD.

---

## Lesson 4: Objects, Interfaces, and Type Aliases

Object types describe shape:

```typescript
const user: { name: string; age: number } = {
  name: "Alex",
  age: 30,
};
```

Reusable shapes get a name. You can use either `interface` or `type`:

```typescript
interface User {
  name: string;
  age: number;
  email?: string;       // optional
  readonly id: number;  // cannot reassign after creation
}

type Product = {
  name: string;
  price: number;
};

const u: User = { name: "Alex", age: 30, id: 1 };
// u.id = 2; // Error: readonly
```

> **Background: What is the difference between `interface` and `type`?**
>
> Both describe the shape of an object. `interface` is older and is specifically designed for object shapes; it can be extended (`extends`) and merged across files. `type` is a more general feature that can describe anything, including unions, intersections, and primitives. For most cases the choice is style. A reasonable convention is `interface` for object shapes you might extend and `type` for everything else.

Interfaces can extend; types can intersect:

```typescript
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

type Timestamped = { createdAt: Date };
type LoggedUser = User & Timestamped;
```

> **Background: What does the `&` (intersection) operator mean?**
>
> An intersection type combines two types into one. A value of type `A & B` must satisfy both `A` and `B` simultaneously. It is similar to `extends` for interfaces, but it works with any types.

Rule of thumb: use `interface` for object shapes that might be extended (especially for public APIs). Use `type` for unions, intersections, primitives, and tuples.

**Exercise:** Model a `BlogPost` with a title, author (who has a name and email), tags (string array), and a published flag. Create one valid blog post.

---

## Lesson 5: Union and Literal Types

Union types let a value be one of several types:

```typescript
type ID = number | string;

function printId(id: ID) {
  console.log(`ID: ${id}`);
}
printId(101);
printId("abc-123");
```

> **Background: What is a "union type"?**
>
> The `|` operator combines types so a value can be any one of them. A function that accepts `number | string` accepts either, and TypeScript will require you to handle both cases when you use the value.

Literal types restrict values to specific constants:

```typescript
type Direction = "north" | "south" | "east" | "west";

function move(dir: Direction) {
  console.log(`Moving ${dir}`);
}
move("north");
// move("up"); // Error
```

> **Background: What is a "literal type"?**
>
> A literal type is a type whose only valid value is one specific constant. For example, the type `"north"` (with the quotes) means "the string north and nothing else". Combined with unions, literal types give you safe enums without needing the `enum` keyword.

Combine literals with unions for state machines:

```typescript
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function render(state: RequestState) {
  switch (state.status) {
    case "idle": return "Waiting...";
    case "loading": return "Loading...";
    case "success": return `Got: ${state.data}`;
    case "error": return `Failed: ${state.error}`;
  }
}
```

This pattern is called a **discriminated union**. It is one of the most useful tools in TypeScript.

> **Background: What is a "discriminated union"?**
>
> A discriminated union is a union of object types where each option has a shared field (the discriminator) with a different literal value. In the example above, `status` is the discriminator. When you check `state.status === "success"`, TypeScript narrows the type to that specific variant and lets you safely access `state.data`.

**Exercise:** Model a `PaymentResult` discriminated union with cases for `approved` (with a transaction id), `declined` (with a reason), and `pending`. Write a function that returns a user-facing message for each.

---

## Lesson 6: Type Narrowing and Guards

TypeScript narrows types based on runtime checks:

> **Background: What does "narrowing" mean?**
>
> Narrowing is when TypeScript reduces a value's possible types based on a condition. If a parameter is `string | number` and you check `typeof value === "string"`, inside the if block TypeScript knows it is a string and lets you call string methods on it.

```typescript
function describe(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // narrowed to string
  }
  return value.toFixed(2);       // narrowed to number
}

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

function handle(result: unknown) {
  if (isError(result)) {
    console.error(result.message); // safe
  }
}
```

The `value is Error` syntax is a **type predicate**. It tells TypeScript that the function checks a type at runtime.

> **Background: What is a "type predicate"?**
>
> A type predicate is a return-type annotation of the form `parameterName is SomeType`. When such a function returns true, TypeScript narrows the parameter to that type for the rest of the surrounding code. Type predicates let you write reusable type guards.

The `in` operator narrows by property:

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) animal.swim();
  else animal.fly();
}
```

**Exercise:** Write a type guard `isString(x: unknown): x is string` and use it inside a function that accepts `unknown` and returns its length if it is a string, or 0 otherwise.

---

## Lesson 7: Generics

Generics let you write reusable code that works with any type while preserving type safety.

> **Background: What is a "generic"?**
>
> A generic is a type that is parameterized over another type. Just as a function can take values as parameters, a generic function or type can take other types as parameters. The placeholder type (often called `T`) acts as a variable that gets filled in when the function or type is used. Generics let you write one piece of code that works with many types without losing type information.

```typescript
function identity<T>(value: T): T {
  return value;
}

const a = identity<string>("hello"); // string
const b = identity(42);              // number (inferred)
```

Generic data structures:

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const n = first([1, 2, 3]);       // number | undefined
const s = first(["a", "b"]);      // string | undefined
```

Constraints with `extends`:

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(value: T): T {
  console.log(value.length);
  return value;
}

logLength("hello");      // OK
logLength([1, 2, 3]);    // OK
// logLength(42);        // Error: number has no length
```

> **Background: What does `T extends X` mean in a generic?**
>
> `T extends X` is a constraint that says "T can be any type, but it must be assignable to X". This lets you use the methods and properties of X inside the generic, while still keeping T flexible.

Generic interfaces and types:

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}

const userResponse: ApiResponse<User> = {
  data: { name: "Priya", age: 30, id: 1 },
  status: 200,
};
```

> **Background: What does `keyof T` mean?**
>
> `keyof T` is a type that represents the union of all key names of T. For `User = { name: string; age: number }`, `keyof User` is `"name" | "age"`. This is essential for writing generic code that operates on object properties safely.

**Exercise:** Write a generic function `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` that extracts an array of one property from an array of objects. Test it on a list of users.

---

## Lesson 8: Classes

TypeScript classes add visibility modifiers and parameter properties:

> **Background: What are "visibility modifiers"?**
>
> Visibility modifiers (also called access modifiers) control whether class members can be accessed from outside the class. `public` (the default) means anyone can access. `private` means only the class itself can access. `protected` means the class and any subclasses can access. These are checked at compile time.

```typescript
class BankAccount {
  // Visibility: public (default), private, protected
  private balance: number = 0;
  readonly owner: string;

  constructor(owner: string, initialDeposit: number = 0) {
    this.owner = owner;
    this.balance = initialDeposit;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount("Jordan", 100);
account.deposit(50);
console.log(account.getBalance()); // 150
// account.balance = 99999; // Error: private
```

Shorthand parameter properties (declares and assigns in one go):

```typescript
class Point {
  constructor(public x: number, public y: number) {}
}

const p = new Point(3, 4);
console.log(p.x, p.y);
```

> **Background: What is a "parameter property"?**
>
> When you put a visibility modifier (`public`, `private`, etc.) on a constructor parameter, TypeScript automatically creates a class field with that name and assigns the parameter to it. It is purely syntactic shorthand: `constructor(public x: number)` is equivalent to declaring `public x: number;` and writing `this.x = x` inside the constructor.

Inheritance and abstract classes:

```typescript
abstract class Shape {
  abstract area(): number;

  describe(): string {
    return `This shape has area ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

> **Background: What is an "abstract class"?**
>
> An abstract class is a class that cannot be instantiated directly. It exists to be extended by other classes. An abstract class can declare abstract methods (methods without implementation) that subclasses must provide. This lets you define a contract while sharing some implementation across subclasses.

Implementing interfaces:

```typescript
interface Serializable {
  toJSON(): string;
}

class User implements Serializable {
  constructor(public name: string, public age: number) {}
  toJSON(): string {
    return JSON.stringify({ name: this.name, age: this.age });
  }
}
```

> **Background: What is the difference between `extends` and `implements`?**
>
> `extends` inherits from a parent class, including its implementation. `implements` is a contract: it says the class must provide certain methods and properties, but does not inherit any code. A class can extend at most one parent but can implement many interfaces.

**Exercise:** Build a `Stack<T>` class with `push`, `pop`, `peek`, and `size` methods. Use generics so it can hold any type.

---

## Lesson 9: Const Assertions and `satisfies` (2026, replacing enums)

Earlier versions of this course taught `enum` first and mentioned const
assertions as an alternative. That is now the wrong way round, and under
`erasableSyntaxOnly` the `enum` will not compile at all.

### Why enums went

```typescript
enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
}
```

Four problems, in ascending order of seriousness.

1. It generates runtime code. An `enum` becomes a real object in the output, so
   it cannot be erased, so `node app.ts` cannot run it and
   `erasableSyntaxOnly` rejects it (`error TS1294`).
2. Numeric enums are not type-safe. `enum Direction { Up, Down }` accepts any
   number: `takesDirection(42)` compiles.
3. Enum members are nominal. `OrderStatus.Pending` is not assignable to the
   string `"PENDING"` even though it is exactly that string at runtime, which
   makes every boundary awkward.
4. It is TypeScript-only syntax. Nothing you learn about it transfers to
   JavaScript, and no JavaScript consumer of your package can use it.

### The replacement

```typescript
export const ORDER_STATUS = {
  Pending: "PENDING",
  Shipped: "SHIPPED",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
// "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

function update(status: OrderStatus) {
  console.log(status);
}

update(ORDER_STATUS.Shipped);  // fine
update("DELIVERED");           // also fine: it is just a string
update("POSTED");              // error: not assignable to OrderStatus
```

A plain object, a derived union, no runtime cost beyond the object itself, and
the values are ordinary strings at every boundary.

> **Background: What does `as const` do?**
>
> Without it, TypeScript infers `string` for each property, and the derived
> union would collapse to `string`. `as const` is a const assertion: it infers
> the narrowest literal type for every value (`"PENDING"` rather than `string`)
> and marks every property `readonly`, recursively. That precision is what
> makes the derived union useful.

If you also want the list of values:

```typescript
export const ORDER_STATUSES = Object.values(ORDER_STATUS);
// ("CANCELLED" | "DELIVERED" | "PENDING" | "SHIPPED")[]
```

Note that this is an ordinary mutable array of the union, not a `readonly`
tuple: `Object.values` loses the order and the length. If you need the tuple,
write the list and derive the union from it instead:

```typescript
export const ORDER_STATUSES = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
```

### `satisfies` (2026)

`as const` gives you precision. It does not give you **checking**. Nothing in
the version above stops you writing `Pending: "PENIDNG"`.

`satisfies` checks a value against a type **without widening it**.

```typescript
type StatusMeta = {
  readonly label: string;
  readonly terminal: boolean;
};

export const STATUS_META = {
  PENDING: { label: "Awaiting payment", terminal: false },
  SHIPPED: { label: "On its way", terminal: false },
  DELIVERED: { label: "Delivered", terminal: true },
  CANCELLED: { label: "Cancelled", terminal: true },
} as const satisfies Record<OrderStatus, StatusMeta>;
```

That one line does three things at once:

- Every key is checked against `OrderStatus`. Add `"POSTED"` and it fails.
- Every key must be present. Forget `"CANCELLED"` and it fails.
- Every value is checked against `StatusMeta`. Misspell `terminal` and it
  fails.

And because of `as const`, the inferred type stays **narrow**:

```typescript
STATUS_META.DELIVERED.terminal;
//                    ^? true, not boolean

STATUS_META.PENDING.label;
//                  ^? "Awaiting payment", not string
```

> **Background (2026): What is the difference between `as`, `satisfies` and a
> type annotation?**
>
> ```typescript
> const a: Record<OrderStatus, StatusMeta> = { ... };  // checked, but widened
> const b = { ... } as Record<OrderStatus, StatusMeta>; // NOT checked at all
> const c = { ... } as const satisfies Record<OrderStatus, StatusMeta>; // checked AND narrow
> ```
>
> The annotation on `a` checks the value but then types the variable as the
> annotation, so `a.DELIVERED.terminal` is `boolean` and you have lost the
> detail.
>
> The `as` on `b` is an assertion. It **silences** the checker rather than
> asking it anything. It is the most over-used operator in TypeScript and every
> `as` in a codebase is a place where you told the compiler to stop helping.
>
> `satisfies` is the one you want almost every time you were reaching for `as`.

### An exhaustiveness check

```typescript
function describe(status: OrderStatus): string {
  switch (status) {
    case "PENDING":   return "Awaiting payment";
    case "SHIPPED":   return "On its way";
    case "DELIVERED": return "Delivered";
    case "CANCELLED": return "Cancelled";
    default: {
      const unreachable: never = status;
      throw new Error(`Unhandled status: ${String(unreachable)}`);
    }
  }
}
```

Add a fifth status to `ORDER_STATUS` and this function stops compiling, at the
`never` assignment, naming the case you forgot. That is the whole reason to
derive the union from the object rather than writing it out twice.

**Exercise:** Model the twelve official languages of South Africa as a `const`
object keyed by ISO 639 code, derive a `LanguageCode` type from it, and add a
`LANGUAGE_META` table with an English name and an endonym for each, checked
with `as const satisfies Record<LanguageCode, LanguageMeta>`. Then write
`describeLanguage` with an exhaustiveness check and prove it fails when you
remove a case.

---

## Lesson 10: Modules

Each file is a module. Use `export` and `import`:

```typescript
// src/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

// Default export
export default function square(n: number): number {
  return n * n;
}
```

```typescript
// src/main.ts
import square, { add, PI } from "./math.ts";

console.log(add(1, 2));   // 3
console.log(square(5));   // 25
console.log(PI);          // 3.14159
```

Re-export from a barrel file:

```typescript
// src/index.ts
export * from "./math.ts";
export * from "./users.ts";
```

> **Background: What is a "barrel file"?**
>
> A barrel file is a single file that re-exports everything from a folder. Consumers can then import multiple things from the folder with one import statement instead of importing from each individual file. Barrel files keep the import surface clean as a project grows.

### Type-only imports and `.ts` extensions (2026)

Two changes to how you write an import.

**Mark type-only imports.** Under `verbatimModuleSyntax`, a plain `import`
survives into the output. If the thing you imported is a type, that leaves an
import of something that does not exist at runtime.

```typescript
import type { Task } from "./types.ts";              // erased entirely
import { createTask, type Priority } from "./tasks.ts"; // one value, one type
```

**Write the real extension.** Because Node resolves the file itself, the
specifier names the file on disk:

```typescript
import { add } from "./math.ts";
```

This needs `allowImportingTsExtensions` and `rewriteRelativeImportExtensions`
in `tsconfig.json`, both covered in Lesson 0.

> **Background (2026): What if my project uses a bundler instead?**
>
> Then extensionless imports still work, because the bundler resolves them. The
> two products beside this repository differ on exactly this: Mentisflow uses
> Vite and writes extensionless imports with an `@/` alias; a Node script or an
> edge function writes `./thing.ts`. Follow the project you are in. What does
> not change is `import type`: mark your type imports either way.

**A note on barrel files.** The `export * from "./math.ts"` pattern below is
convenient and has a real cost: a bundler often cannot tell which exports are
used, so importing one function from a barrel can pull in the whole folder.
Use barrels at the edge of a package, where the export list is the public API.
Do not use one inside a folder that only its own neighbours import from.

**Exercise:** Split a previous exercise solution across three files: types in `types.ts`, logic in `logic.ts`, and a runner in `main.ts`.

---

## Lesson 11: Utility Types

TypeScript ships with built-in utility types. The most useful ones:

> **Background: What are "utility types"?**
>
> Utility types are pre-built generic types that transform other types. They live in TypeScript's standard library and let you express common patterns (like making every field optional) without writing the transformation manually. They are essential for working with APIs and data models.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial: all fields optional (great for updates)
type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }

// Required: all fields required
type FullUser = Required<User>;

// Readonly: all fields readonly
type ImmutableUser = Readonly<User>;

// Pick: choose specific fields
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }

// Omit: exclude specific fields
type UserWithoutEmail = Omit<User, "email">;

// Record: build object types from key/value
type UsersByID = Record<number, User>;

// ReturnType and Parameters
function createUser(name: string, age: number): User {
  return { id: 1, name, email: "", age };
}
type CreatedUser = ReturnType<typeof createUser>;
type CreateUserArgs = Parameters<typeof createUser>; // [string, number]
```

> **Background: What does `typeof` do in a type context?**
>
> The `typeof` operator in a type position takes a value and produces its type. So `typeof createUser` is the function type of `createUser`. Combined with `ReturnType<>` and `Parameters<>`, this lets you derive types from functions instead of writing them out twice.

**Exercise:** Given a `Product` interface with `id`, `name`, `price`, and `description`, derive: a `ProductSummary` (just `id` and `name`), a `ProductInput` (no id), and a `ProductMap` (record from id to product).

---

## Lesson 12: Advanced Types

Mapped types transform existing types:

> **Background: What is a "mapped type"?**
>
> A mapped type loops over the keys of one type and produces a new type. The syntax `[K in keyof T]` is "for each key K in T, produce a property with that key". You can transform the value, the key, or both. Many of TypeScript's built-in utility types are implemented using mapped types.

```typescript
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; ... }
```

Conditional types:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false
```

> **Background: What is a "conditional type"?**
>
> A conditional type is a type-level if-else. The syntax `A extends B ? X : Y` means "if A is assignable to B, the result is X, otherwise Y". This is how libraries write generic types that branch based on input.

Template literal types:

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"
```

Combine them for powerful APIs:

```typescript
type RouteParams<T extends string> =
  T extends `${string}/:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof RouteParams<`/${Rest}`>]: string }
    : T extends `${string}/:${infer Param}`
    ? { [K in Param]: string }
    : {};

type Params = RouteParams<"/users/:userId/posts/:postId">;
// { userId: string; postId: string }
```

This is advanced territory. You do not need it daily, but it is useful for library authors.

**Exercise:** Write a `DeepReadonly<T>` mapped type that recursively makes every property of an object (and nested objects) readonly.

---

## Lesson 13: Working With External Data, and Zod 4 (2026)

Real code consumes JSON: from an HTTP response, from a file, from a message
queue, from a form. Validate at the boundary.

> **Background: Why "validate at the boundary"?**
>
> TypeScript types exist only while the checker is running. They are erased
> before the code runs. So at runtime, an object you received from outside your
> program could be anything at all, and TypeScript cannot help you: an
> annotation is a claim, not a check. The fix is to **validate the shape where
> the data enters** and to trust it only after that. Inside your program, the
> types you defined are then true.
>
> This is not a style preference. It is the same boundary the workbook calls a
> trust boundary, and getting it wrong is the root of a large share of the
> OWASP Top Ten.

### Hand-written validation, and why it does not scale

```typescript
type Practitioner = {
  id: string;
  name: string;
  profession: "psychologist" | "psychiatrist";
  feeCents: number;
};

function isPractitioner(value: unknown): value is Practitioner {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate["id"] === "string" &&
    typeof candidate["name"] === "string" &&
    (candidate["profession"] === "psychologist" || candidate["profession"] === "psychiatrist") &&
    typeof candidate["feeCents"] === "number" &&
    Number.isInteger(candidate["feeCents"])
  );
}
```

That works, and it is written twice: once as a type and once as a check.
Nothing keeps the two in step. Add a field to the type and the guard silently
stops checking it, and a `value is Practitioner` predicate is a **promise you
made**, not one the compiler verified.

### Zod: write the schema, derive the type

```bash
npm install zod
```

> **Background: What is Zod?**
>
> Zod lets you define a schema once and get two things from it: a runtime
> validator, and a TypeScript type inferred from that validator. The type
> cannot drift from the check, because there is only one definition. It is what
> Casey Journals uses (`zod` 4.5.4 in `packages/core/package.json`).

```typescript
import { z } from "zod";

const Practitioner = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  profession: z.enum(["psychologist", "psychiatrist"]),
  feeCents: z.int().nonnegative(),
});

type Practitioner = z.infer<typeof Practitioner>;
// { id: string; name: string; profession: "psychologist" | "psychiatrist"; feeCents: number }
```

### What changed in Zod 4 (2026)

If you have seen Zod before, five things moved. All of the following was
verified against Zod 4.5.4.

**1. String formats are top-level functions.**

```typescript
import { z } from "zod";

// Zod 3
z.string().email();
z.string().uuid();
z.string().datetime();

// Zod 4
z.email();
z.uuid();
z.iso.datetime();
z.iso.date();      // "2026-09-06"
```

The old spellings still work but are deprecated. The new ones are shorter and
each is its own schema type rather than a refinement stacked on `string`.

**2. `error` replaces `message`, `invalid_type_error` and `required_error`.**

```typescript
import { z } from "zod";

// Zod 3 (no longer compiles under Zod 4: TS2769, no overload matches)
// z.string({ required_error: "Name is required", invalid_type_error: "Name must be text" });

// Zod 4
z.string({ error: "Name must be text" });
z.string().min(1, { error: "Name is required" });
```

`error` also takes a function, which is how you write a message that depends on
the input:

```typescript
import { z } from "zod";

z.int({ error: (issue) => `Expected a whole number, received ${typeof issue.input}.` });
```

**3. Error formatting has new names.**

```typescript
import { z } from "zod";

const Practitioner = z.object({ name: z.string().min(1), feeCents: z.int() });
declare const input: unknown;

const result = Practitioner.safeParse(input);

if (!result.success) {
  console.log(z.prettifyError(result.error));  // human-readable, multi-line
  console.log(z.treeifyError(result.error));   // nested, mirrors the object
  console.log(z.flattenError(result.error));   // { formErrors, fieldErrors }
  console.log(result.error.issues);            // the raw list
}
```

`.format()` and `.flatten()` are replaced by `z.treeifyError` and
`z.flattenError`.

**4. Object strictness is chosen by the constructor.**

```typescript
import { z } from "zod";

const shape = { name: z.string() };

// Zod 3
z.object(shape).strict();
z.object(shape).passthrough();

// Zod 4
z.strictObject(shape);   // unknown keys are an error
z.looseObject(shape);    // unknown keys are kept
z.object(shape);         // unknown keys are stripped (the default)
```

**5. `z.record` takes both a key and a value schema.**

```typescript
import { z } from "zod";

z.record(z.string(), z.number());
```

### Parsing, safely

```typescript
import { z } from "zod";
import { readFile } from "node:fs/promises";

const PractitionerList = z.array(Practitioner);

type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export async function loadPractitioners(path: string): Promise<Result<Practitioner[]>> {
  let raw: unknown;
  try {
    raw = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    return { ok: false, error: `Could not read ${path}: ${(error as Error).message}` };
  }

  const parsed = PractitionerList.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: z.prettifyError(parsed.error) };
  }
  return { ok: true, value: parsed.data };
}
```

Note `raw: unknown`, not `raw: any`. `JSON.parse` returns `any`, which turns
off type checking for everything downstream. Annotating the variable `unknown`
forces you through the schema before you can touch it. Make that a habit: every
value crossing into your program starts life as `unknown`.

> **Background (2026): `parse` or `safeParse`?**
>
> `parse` throws a `ZodError`. `safeParse` returns a discriminated union you
> narrow with `if (!result.success)`.
>
> Use `safeParse` for anything a user or a network can cause: a form, a request
> body, a webhook. The failure is expected and you owe the caller a message.
> Use `parse` for things that are your own fault if they fail: your own fixture
> files, your own configuration at startup. There, a throw at boot is better
> than a wrong value at midnight.

### The other direction: validating what you send

Schemas are not only for input.

```typescript
import { z } from "zod";

const CreateBooking = z.object({
  practitionerId: z.uuid(),
  startsAt: z.iso.datetime(),
  feeCents: z.int().positive(),
});

export async function createBooking(baseUrl: string, body: z.input<typeof CreateBooking>) {
  const payload = CreateBooking.parse(body); // fail here, not at the far end
  const response = await fetch(new URL("/bookings", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<unknown>;
}
```

`z.input` and `z.output` differ whenever a schema transforms. `z.infer` is
`z.output`.

**Exercise:** Using the `fixtures/practitioners.json` file from the JavaScript
course, write a `Practitioner` schema in Zod 4, load and validate the file, and
print `z.prettifyError` output for a deliberately broken copy where `feeCents`
is the string `"95000"` and `profession` is `"dentist"`. Then add
`.strictObject` and see what happens when the fixture gains a field nobody
asked for.

---

## Lesson 13a: Branded Types (2026)

Zod checks shape. Branded types check **meaning**.

### The problem

```typescript
function refund(userId: string, orderId: string) { /* ... */ }

refund(orderId, userId); // compiles. Both are strings.
```

Both arguments are `string`, so nothing stops you swapping them, and the bug is
invisible in review. The same applies to every pair of identifiers, and, worse,
to money:

```typescript
function charge(amount: number) { /* ... */ }

charge(125000);    // cents? rands? Nobody knows.
charge(1250.00);   // this compiles too
```

### The technique

Attach a phantom property that exists only in the type.

```typescript
declare const CENTS: unique symbol;

export type Cents = number & { readonly [CENTS]: "Cents" };

export function cents(value: number): Cents {
  if (!Number.isInteger(value)) {
    throw new RangeError(`Cents must be a whole number, received ${value}.`);
  }
  return value as Cents;
}
```

Now:

```typescript
function charge(amount: Cents) { /* ... */ }

charge(cents(125_000));  // fine
charge(125_000);         // error: number is not assignable to Cents
charge(1250.00 as Cents); // compiles, and is why `as` is a smell
```

`declare const CENTS: unique symbol` produces no output at all: `declare` means
"this exists somewhere, do not emit it". `Cents` is a `number` at runtime, so
arithmetic works and `JSON.stringify` produces a plain number. The whole
apparatus costs nothing.

> **Background (2026): Why a `unique symbol` rather than a string property?**
>
> ```typescript
> type Cents = number & { __brand: "Cents" };  // the older spelling
> ```
>
> That works, but `__brand` is a real property name, so two brands written by
> two different libraries with the same string collide, and somebody can
> construct one by hand. A `unique symbol` declared in your module is unique to
> your module, and because it is `declare`d there is no runtime symbol to
> access.

### Where the brand comes from

The point of the constructor function is that it is **the only way in**. Every
brand should have exactly one such door, and the validation lives there:

```typescript
declare const ISO_DAY: unique symbol;
export type IsoDay = string & { readonly [ISO_DAY]: "IsoDay" };

export function isoDay(value: string): IsoDay {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new RangeError(`Expected YYYY-MM-DD, received "${value}".`);
  }
  return value as IsoDay;
}
```

The single `as` inside the constructor is the price. Everywhere else in the
codebase, an `IsoDay` is an `IsoDay` because it came through this function.

### Zod does this for you

```typescript
import { z } from "zod";

const Cents = z.int().nonnegative().brand<"Cents">();
type Cents = z.infer<typeof Cents>;

const value = Cents.parse(125_000);  // Cents
const bad: Cents = 125_000;          // error
```

Use Zod's brand when the value arrives from outside and needs parsing anyway.
Use the hand-rolled version when the brand is internal and you want no
dependency, which is what the capstone does.

### When not to brand

Branding every string is misery. Brand where a mix-up is **plausible and
expensive**: money, identifiers of different kinds that travel together, dates
in different formats, values that have been validated versus values that have
not (`SafeHtml` versus `string` is a classic, and the workbook returns to it
under injection).

**Exercise:** Brand `Cents` and `Rands` separately. Write
`toRands(value: Cents): Rands` and prove that passing a `Rands` to a function
expecting `Cents` fails to compile. Then write the same pair with Zod's
`.brand()` and decide which you prefer for a value read from a database.

---

## Lesson 14: Strictness, Revisited (2026)

`strict: true` is now the default, so this lesson is about what lies **beyond**
strict. These options are not in `strict` and each one catches a real class of
bug.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true
  }
}
```

### `noUncheckedIndexedAccess`

The most valuable of the lot, and the one most likely to make an existing
codebase go red.

```typescript
const names = ["Alex", "Maria"];

const first = names[0];
//    ^? string | undefined      with the flag
//    ^? string                  without it

console.log(first.toUpperCase()); // error with the flag. And rightly:
                                  // names[5] is undefined at runtime.
```

Without it, TypeScript pretends every index is in range, which is a lie about
arrays and a bigger lie about records:

```typescript
const feesByCode: Record<string, number> = { psy: 95000 };
const fee = feesByCode["dentist"];
//    ^? number | undefined       with the flag. It is undefined at runtime.
```

Turn it on, then handle the `undefined`:

```typescript
const first = names.at(0) ?? "nobody";
const [head] = names;
if (head !== undefined) { /* ... */ }
```

Both Casey Journals (`packages/tsconfig/base.json`) and the TypeScript 7
`tsc --init` template enable it.

### `exactOptionalPropertyTypes`

```typescript
type Profile = { nickname?: string };

const a: Profile = {};                  // fine: absent
const b: Profile = { nickname: undefined }; // error with the flag
```

Without the flag these are the same type. They are not the same thing:
`"nickname" in a` is `false`, `"nickname" in b` is `true`, and `Object.keys`
tells them apart. That difference matters the moment the object becomes a
database update, where absent means "leave it alone" and `undefined` may mean
"set it to null".

Casey Journals deliberately leaves this one **off**
(`"exactOptionalPropertyTypes": false` in `packages/tsconfig/base.json`) while
the TypeScript 7 template turns it on. That is a legitimate disagreement: it is
noisy on code that was not written with it. Know what it does and make the
choice deliberately.

### `noImplicitOverride`

```typescript
class Base { greet() { return "hello"; } }

class Child extends Base {
  greet() { return "hi"; }          // error with the flag
  override greet() { return "hi"; } // correct
}
```

The bug it catches is renaming `greet` on the base class and silently leaving
an orphaned method on the child that nothing calls any more.

### Where strictness belongs

Turn every one of these on for a **new** project on the first day. On an
existing project, turn on one at a time, fix the fallout, and commit each
separately. What you must not do is turn `strict` off to make a build pass:
that is not fixing anything, it is switching off the smoke alarm.

> **Background (2026): What about `any`?**
>
> `strict` does not ban `any`; it bans **implicit** `any`. An explicit `any` is
> still allowed, and it is a hole through every guarantee on this page: values
> flow out of an `any` untyped in every direction.
>
> Reach for `unknown` instead. `unknown` accepts anything and lets you do
> nothing with it until you narrow, which is exactly the discipline the
> boundary needs. Then turn on the lint rule
> (`@typescript-eslint/no-explicit-any`) so the remaining `any` is a decision
> somebody had to write a comment about.

**Exercise:** Take any file you wrote earlier in this course, enable
`noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`, and fix every
error without using `as` or `!`. Where you cannot, write a one-line comment
explaining what the compiler knows that you do not, or what you know that it
does not.

---

## Capstone Project: Casey Recover, a Mora Interest Engine

Casey Legal Tools, the legal-work platform beside this repository, holds a rule
that shapes its whole architecture: **the legal reasoning is not in the
codebase.** Prompts, playbooks, checklists and legal knowledge live in the
owner's workflow runners. The application owns inputs, dispatch, results and
exports.

There is one carve-out, and it is stated in that repository's `CLAUDE.md`:

> Deterministic statutory arithmetic (court-day counting, mora interest,
> Companies Act voting thresholds as numbers) is allowed in
> `packages/legal-calc` with tests, because it is arithmetic, not know-how.

You are going to build that package. It is an ideal TypeScript capstone,
because the whole job is making illegal states unrepresentable in a domain
where a wrong number has consequences.

### What mora interest is, in one paragraph, carefully

When a debt is overdue, interest may run on it. In South Africa the rate is the
prescribed rate set under the Prescribed Rate of Interest Act 55 of 1975, which
changes from time to time. Your program's job is to answer one question:
**given a capital amount, a period, and a table of rates, what is the number?**

Your program's job is **not** to decide whether interest runs, from what date,
at what rate, on what basis, or subject to what cap. Those are legal questions.
They are inputs, decided by a person.

That line is the design constraint, and holding it is most of the exercise.

### A warning about the rate

**The rate table in the reference solution is a placeholder.** The real
prescribed rate could not be verified from any repository read for this course,
and `STACK.md` records that. Do not treat the numbers as authoritative and do
not compute anything real with them.

In the product the rate is not code at all: it lives in
`app_settings.prescribed_rate`, editable by an operator, so that a rate change
is a configuration change rather than a deploy. That is the arrangement to
copy. A statutory figure baked into a build artefact is a bug waiting for a
government gazette.

### Requirements

**Domain**

- Money is an integer number of cents, branded as `Cents`. A plain `number`
  must not be assignable to it, and the constructor must reject a fraction.
- A rate is a fraction per annum, branded as `RatePerAnnum`.
- Dates are `YYYY-MM-DD` strings, validated. No `Date` object crosses a module
  boundary.

**Calculation**

- Simple, non-compounding interest, actual days, 365-day year. Say so, in a
  comment, as a **convention the caller chose** and not a legal conclusion.
- Split the period at every rate change, so a period spanning a change is
  charged at each rate for the days it actually ran.
- Round **once**, at the end, on the sum of the exact segment amounts. Never
  round each segment and add the rounded pieces.
- Refuse rather than guess: an empty rate table, a period starting before the
  table begins, or an end date before the start date are all errors with
  messages that say what to do.

**Boundary**

- Validate the input with a Zod 4 schema.
- Parse rands-and-cents input as digits, never with `parseFloat`.
- Format every amount through `Intl.NumberFormat("en-ZA", ...)`, in one place.

**Verification**

- `tsc --noEmit` clean under the strict options from Lesson 14.
- Tests with `node:test`, covering at minimum: a whole year at a round rate, a
  zero-length period, a period spanning two rate changes, that the segments
  cover every day exactly once, that the result is always whole cents, and
  every refusal path.
- Run the whole thing with `node src/main.ts`. No build step, no `ts-node`.

### Structure

```
casey-recover/
  package.json
  tsconfig.json
  src/
    money.ts      Cents, RatePerAnnum, the Intl formatter
    days.ts       ISO day validation and day counting
    rates.ts      the PLACEHOLDER rate table, as const satisfies
    interest.ts   segmentByRate and calculate
    report.ts     rendering
    main.ts       parseArgs entry point
  test/
    interest.test.ts
    parse.test.ts
```

### `tsconfig.json`

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

### Expected output

```
$ node src/main.ts --capital 125000.00 --from 2024-03-01 --to 2026-09-06

Capital        R 125 000,00
Period         1 March 2024 to 6 September 2026 (919 days)

Segments
  2024-03-01 to 2024-07-01   122 days   10,50%      R 4 386,99
  2024-07-01 to 2025-09-01   427 days   11,25%     R 16 451,20
  2025-09-01 to 2026-09-06   370 days   10,75%     R 13 621,58

Interest       R 34 459,76
Total          R 159 459,76

Arithmetic only. The rate table is a placeholder and the basis (simple,
actual days, 365-day year) is a convention chosen by the caller, not a
legal conclusion. A person decides what this figure means.
```

### The five hard parts

1. **Half-open intervals.** Count days from `from` up to but **not including**
   `to`. Half-open composes: `[a, b)` plus `[b, c)` is exactly `[a, c)`, with
   no day counted twice and none missed. Closed intervals do not compose and
   every off-by-one in date arithmetic starts there.
2. **Rounding once.** Compute each segment exactly, round for display, and
   round the **sum of the exact values** separately for the reported total.
   Adding rounded pieces lets a long-running debt drift by up to half a cent
   per rate change.
3. **Refusing to guess.** If the period begins before the earliest rate in the
   table, there is no rate. Throwing with "extend the table backwards rather
   than guessing a rate" is the correct behaviour. Silently using the earliest
   known rate is how a program tells a confident lie.
4. **Parsing money.** `parseFloat("125000.00")` gives you a float, and floats
   cannot represent most decimal fractions. Match the digits with a regular
   expression and build the integer: `Number(whole) * 100 + Number(fraction)`.
5. **Saying what the number is not.** The output carries a line stating that
   this is arithmetic and that a person decides what it means. That is the
   product rule ("nothing legally operative happens without a person") made
   visible at the only place a user sees.

### Features you must use

- [ ] Branded types with a `unique symbol`, and one constructor per brand
- [ ] `as const satisfies` on the rate table
- [ ] `import type` for every type-only import
- [ ] `.ts` extensions on relative imports
- [ ] A Zod 4 schema with `z.int`, `z.iso.date` and `{ error: ... }` messages
- [ ] `satisfies` on the segment objects, so a missing field is an error
- [ ] A discriminated result or a typed throw, never a silent fallback
- [ ] `noUncheckedIndexedAccess` on, and no `!` used to get around it
- [ ] `node:util` `parseArgs`, no CLI library
- [ ] `Intl.NumberFormat("en-ZA")` for money, `Intl.DateTimeFormat("en-ZA")`
      for dates
- [ ] Zero `any`, and every `as` either inside a brand constructor or absent

### Stretch goals

1. Add a court-day counter: days excluding weekends and a configurable list of
   public holidays supplied as data. Note that the holiday list is data for the
   same reason the rate table is.
2. Add `--json` output and a `--rates <file>` flag that loads a rate table from
   JSON, validated with Zod. Refuse a table with overlapping or unsorted dates.
3. Add a property-based check: for a thousand random periods, assert that the
   sum of segment days equals the total days and that the total is always
   `capital + interest`.

---

## Where to Go Next

After the capstone, take the React with TypeScript course in this series, then
work through [`../casey-workbook/workbook.md`](../casey-workbook/workbook.md).

**(2026)** Other directions, if you want them:

1. **Frontend:** React with TypeScript is the industry standard, and it is the
   next course here.
2. **Backend:** A Next.js route handler, a Supabase edge function, or a
   Firebase Cloud Function. All three are TypeScript-first and all three appear
   in the products this course draws on.
3. **Library author:** Read the handbook on conditional and mapped types, then
   write something small with `isolatedDeclarations` turned on.
4. **Domain modelling:** Extend the capstone. Court days, Companies Act
   thresholds and day-count conventions are a deep, well-specified, testable
   problem, and the discipline of keeping the arithmetic separate from the
   judgement is worth more than any type-level trick.

**Recommended reading:**

- The official TypeScript Handbook at typescriptlang.org/docs/handbook
- The TypeScript release notes, which are the only reliable record of what
  changed in 6 and 7
- "Effective TypeScript" by Dan Vanderkam
- "Total TypeScript" by Matt Pocock (free essentials course online)
- The Zod documentation at zod.dev, and its version 4 migration notes

Good luck.
