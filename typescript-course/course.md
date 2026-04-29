# TypeScript: A Practical Course From Start to Finish

A hands-on course that takes you from zero to comfortable with TypeScript. Every lesson has runnable examples and a small exercise. Work through them in order. Total time: roughly 10 to 15 hours if you do the exercises.

---

## Lesson 0: Setup

You need Node.js (version 18 or higher) and a code editor (VS Code is ideal because it has built-in TypeScript support).

Create a project folder and initialize it:

```bash
mkdir ts-course && cd ts-course
npm init -y
npm install --save-dev typescript ts-node @types/node
npx tsc --init
```

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

Create a `src` folder. Write `src/hello.ts`:

```typescript
const greet = (name: string): string => `Hello, ${name}!`;
console.log(greet("World"));
```

Run it:

```bash
npx ts-node src/hello.ts
```

If you see `Hello, World!`, you are ready.

---

## Lesson 1: Primitive Types and Inference

TypeScript adds static types on top of JavaScript. The compiler often infers types for you, so you do not always need to annotate.

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

`readonly` prevents mutation:

```typescript
const config: readonly string[] = ["a", "b", "c"];
// config.push("d"); // Error
```

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

Function types as values:

```typescript
type BinaryOp = (a: number, b: number) => number;

const subtract: BinaryOp = (a, b) => a - b;
```

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

Literal types restrict values to specific constants:

```typescript
type Direction = "north" | "south" | "east" | "west";

function move(dir: Direction) {
  console.log(`Moving ${dir}`);
}
move("north");
// move("up"); // Error
```

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

**Exercise:** Model a `PaymentResult` discriminated union with cases for `approved` (with a transaction id), `declined` (with a reason), and `pending`. Write a function that returns a user-facing message for each.

---

## Lesson 6: Type Narrowing and Guards

TypeScript narrows types based on runtime checks:

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

**Exercise:** Write a generic function `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` that extracts an array of one property from an array of objects. Test it on a list of users.

---

## Lesson 8: Classes

TypeScript classes add visibility modifiers and parameter properties:

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

The `as const` assertion makes every property `readonly` and infers the narrowest possible literal types.

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

**Exercise:** Split a previous exercise solution across three files: types in `types.ts`, logic in `logic.ts`, and a runner in `main.ts`.

---

## Lesson 11: Utility Types

TypeScript ships with built-in utility types. The most useful ones:

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

**Exercise:** Given a `Product` interface with `id`, `name`, `price`, and `description`, derive: a `ProductSummary` (just `id` and `name`), a `ProductInput` (no id), and a `ProductMap` (record from id to product).

---

## Lesson 12: Advanced Types

Mapped types transform existing types:

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
