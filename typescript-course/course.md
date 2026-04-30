# TypeScript: A Practical Course From Start to Finish

A hands-on course that takes you from zero to comfortable with TypeScript. Every lesson has runnable examples and a small exercise. Work through them in order. Total time: roughly 10 to 15 hours if you do the exercises.

This course assumes you are comfortable with modern JavaScript (the topics covered in the JavaScript course in this series). If you are not, work through that course first.

---

## Lesson 0: Setup

### What is TypeScript?

TypeScript is a programming language created by Microsoft that adds optional static types to JavaScript. You write TypeScript, the TypeScript compiler converts it into plain JavaScript, and the JavaScript runs in browsers or Node.js as usual.

> **Background: What does "static types" mean?**
>
> In a "dynamically typed" language like JavaScript, the type of a value (string, number, object, and so on) is only checked when the program runs. In a "statically typed" language like TypeScript, the types are also checked before the program runs. This means many bugs (like passing a string where a number was expected) are caught instantly in your editor rather than at runtime.

> **Background: What is a "compiler" or "transpiler"?**
>
> A compiler is a program that translates code from one language into another. The TypeScript compiler (called `tsc`) reads your `.ts` files and produces equivalent `.js` files that can run anywhere JavaScript runs. Because TypeScript translates to a similar language (JavaScript) rather than a low-level one, it is sometimes called a "transpiler". The two terms are interchangeable in modern usage.

### What you need

You need Node.js (version 18 or higher) and a code editor (VS Code is ideal because it has built-in TypeScript support).

### Initialize the project

```bash
mkdir ts-course && cd ts-course
npm init -y
npm install --save-dev typescript ts-node @types/node
npx tsc --init
```

> **Background: What did each of those commands do?**
>
> `mkdir` creates a folder. `cd` enters it. `npm init -y` creates a `package.json` file with default settings. `npm install --save-dev` installs three development packages: `typescript` (the compiler), `ts-node` (a tool to run TypeScript directly without compiling first), and `@types/node` (type definitions for the Node.js standard library). `npx tsc --init` creates a default `tsconfig.json` file.

> **Background: What is `@types/node`?**
>
> Many JavaScript libraries do not come with TypeScript type information. The community maintains a giant collection of type definitions called DefinitelyTyped. These are published to npm as packages prefixed with `@types/`. Installing `@types/node` tells TypeScript what built-in functions like `process.argv`, `fs.readFile`, and `setTimeout` look like. Without it, TypeScript would not know about Node.js features.

> **Background: What is `npx`?**
>
> `npx` is a tool bundled with npm that runs commands from packages without installing them globally. `npx tsc` runs the TypeScript compiler that was installed in your project. Without `npx`, you would have to type out a long path or install `tsc` globally.

### What is `tsconfig.json`?

The `tsconfig.json` file tells the TypeScript compiler how to build your project. It is the most important configuration file you will work with. It controls things like which version of JavaScript to output, where source files live, where compiled files go, and how strict the type checking should be.

Open the generated `tsconfig.json` and ensure these settings are on:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

> **Background: What does each of these compiler options mean?**
>
> - `target`: which version of JavaScript to compile down to. `ES2022` means the output uses modern JavaScript features. Older targets like `ES5` produce code that runs in older browsers but loses readability.
> - `module`: which module system to use in the output. `commonjs` is the standard for Node.js. For browser code or modern Node.js, `esnext` is also common.
> - `strict`: a master switch that turns on every strict type-checking option. Always keep this on. It catches the most bugs.
> - `esModuleInterop`: lets you import CommonJS modules using modern import syntax. Without it, some imports require awkward syntax.
> - `skipLibCheck`: skips type-checking the type definitions of your dependencies. Speeds up compilation and avoids being blocked by errors in third-party packages.
> - `outDir`: where the compiled JavaScript files will be placed.
> - `rootDir`: where TypeScript should look for source files. This keeps the project organized.

Create a `src` folder. Write `src/hello.ts`:

```typescript
const greet = (name: string): string => `Hello, ${name}!`;
console.log(greet("World"));
```

Run it:

```bash
npx ts-node src/hello.ts
```

> **Background: What does `ts-node` do?**
>
> Normally you would have to compile TypeScript to JavaScript with `npx tsc` and then run the JavaScript with `node`. `ts-node` combines both steps into one. It compiles your TypeScript file in memory and runs the result immediately. This is convenient for development and small scripts. For production builds, you typically compile once with `tsc` and run the output with `node`.

If you see `Hello, World!`, you are ready.

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

## Lesson 9: Enums and Const Assertions

Enums create named constants:

```typescript
enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

function update(status: OrderStatus) {
  console.log(status);
}
update(OrderStatus.Shipped);
```

Many TypeScript developers prefer `const` objects with `as const` over enums because they produce smaller output and behave more like plain JavaScript:

```typescript
const OrderStatus = {
  Pending: "PENDING",
  Shipped: "SHIPPED",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
} as const;

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
// OrderStatus is "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
```

> **Background: What does `as const` do?**
>
> `as const` is a "const assertion". Without it, TypeScript infers the wider type `string` for each value. With it, TypeScript infers the narrowest possible literal type ("PENDING" instead of string) and marks every property `readonly`. This is what makes the trick work: the resulting type union is precise and immutable.

> **Background: Why prefer `as const` over `enum`?**
>
> Enums are a TypeScript-specific feature that compiles to extra runtime code. Const assertions produce zero runtime overhead because they compile to plain objects. Const assertions also work better with tree-shaking and modern JavaScript tooling. Enums still have valid use cases, but for string-keyed sets of constants, const assertions are the modern default.

**Exercise:** Model the days of the week using `as const` and derive a `Day` type from it.

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
import square, { add, PI } from "./math";

console.log(add(1, 2));   // 3
console.log(square(5));   // 25
console.log(PI);          // 3.14159
```

Re-export from a barrel file:

```typescript
// src/index.ts
export * from "./math";
export * from "./users";
```

> **Background: What is a "barrel file"?**
>
> A barrel file is a single file that re-exports everything from a folder. Consumers can then import multiple things from the folder with one import statement instead of importing from each individual file. Barrel files keep the import surface clean as a project grows.

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

## Lesson 13: Working With External Data

Real-world code consumes JSON from APIs. Validate at the boundary.

> **Background: Why "validate at the boundary"?**
>
> TypeScript types only exist at compile time. They are erased before the code runs. So at runtime, an object you receive from an external API could be anything; TypeScript cannot help. The fix is to validate the shape of incoming data at the boundary (where it enters your program) and only trust it after validation. Inside your program, you can rely on the types you defined.

```typescript
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function fetchPost(id: number): Promise<Post> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data: unknown = await response.json();
  return validatePost(data);
}

function validatePost(value: unknown): Post {
  if (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "title" in value &&
    "body" in value &&
    "userId" in value
  ) {
    return value as Post;
  }
  throw new Error("Invalid post data");
}
```

For production, use a runtime validation library like **Zod**:

```bash
npm install zod
```

> **Background: What is Zod?**
>
> Zod is a popular library that lets you define a schema and use it both for runtime validation and for deriving TypeScript types. Instead of duplicating a type definition and a validator, you write the schema once and Zod gives you both. This is the modern standard pattern for data validation in TypeScript.

```typescript
import { z } from "zod";

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

type Post = z.infer<typeof PostSchema>; // type is generated from schema

async function fetchPost(id: number): Promise<Post> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const data = await response.json();
  return PostSchema.parse(data); // throws if invalid
}
```

This pattern (schema-first, type-inferred) is the modern standard.

**Exercise:** Use Zod to validate a list of products from any public API of your choice.

---

## Lesson 14: tsconfig and Strictness

Open `tsconfig.json` and learn what each option does:

```json
{
  "compilerOptions": {
    "strict": true,                       // master switch for strict checks
    "noImplicitAny": true,                // no untyped values
    "strictNullChecks": true,             // null and undefined are distinct
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true    // strictest optional handling
  }
}
```

> **Background: What does `strictNullChecks` actually change?**
>
> Without it, `null` and `undefined` are valid values of every type, which means you can call methods on values that might not exist. With it, `null` and `undefined` are separate types that must be handled explicitly. This is the single most valuable check TypeScript offers and the reason `strict` mode catches so many real bugs.

Always enable `strict: true` on new projects. It saves hours of debugging.

---

## Capstone Project: Typed Task Manager CLI

Build a command-line task manager that ties everything together.

**Requirements:**

- Add a task with a title, optional description, and priority (low, medium, high).
- List all tasks, filtered by status (pending or done).
- Mark a task as done.
- Delete a task.
- Save tasks to a JSON file and load them on startup.
- Validate the loaded data with Zod.

**Starter structure:**

```
task-cli/
  src/
    types.ts       // Task interface, Priority type, Status type
    storage.ts     // load and save to JSON file
    commands.ts    // add, list, complete, delete
    main.ts        // command-line entry point
  tasks.json
  tsconfig.json
  package.json
```

**Sample `types.ts`:**

```typescript
import { z } from "zod";

export const PrioritySchema = z.enum(["low", "medium", "high"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: PrioritySchema,
  status: z.enum(["pending", "done"]),
  createdAt: z.string().datetime(),
});

export type Task = z.infer<typeof TaskSchema>;

export const TaskListSchema = z.array(TaskSchema);
export type TaskList = z.infer<typeof TaskListSchema>;
```

**Sample `storage.ts`:**

```typescript
import { promises as fs } from "fs";
import { TaskListSchema, TaskList } from "./types";

const FILE = "tasks.json";

export async function loadTasks(): Promise<TaskList> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return TaskListSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: TaskList): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(tasks, null, 2));
}
```

Implement `commands.ts` and `main.ts` yourself. Use `process.argv` to parse simple commands like:

```bash
npx ts-node src/main.ts add "Buy groceries" --priority high
npx ts-node src/main.ts list --status pending
npx ts-node src/main.ts done <task-id>
```

When you finish this, you have built a fully typed, validated, persisted application. That is the bar for production-quality TypeScript.

---

## Where to Go Next

After the capstone, pick one direction:

1. **Frontend:** Learn TypeScript with React. The combination is industry standard.
2. **Backend:** Build a REST API with Express or Fastify in TypeScript, or jump straight to NestJS.
3. **Library author:** Study the TypeScript handbook on advanced types and write a small open-source utility.
4. **Full stack:** Learn Next.js or Remix, both TypeScript-first.

**Recommended reading:**

- The official TypeScript Handbook at typescriptlang.org/docs/handbook
- "Effective TypeScript" by Dan Vanderkam
- "Total TypeScript" by Matt Pocock (free essentials course online)

Good luck.
