# TypeScript Course: Exercise Solutions

Working solutions for every exercise in the TypeScript fundamentals course. Each solution includes runnable code and a short note on the approach.

To run any solution, save it to a `.ts` file inside the project from Lesson 0 and execute it with `npx ts-node src/your-file.ts`.

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

## Lesson 9: Enums and Const Assertions

```typescript
const Day = {
  Monday: "MONDAY",
  Tuesday: "TUESDAY",
  Wednesday: "WEDNESDAY",
  Thursday: "THURSDAY",
  Friday: "FRIDAY",
  Saturday: "SATURDAY",
  Sunday: "SUNDAY",
} as const;

type Day = typeof Day[keyof typeof Day];
// Day is "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"

function isWeekend(day: Day): boolean {
  return day === Day.Saturday || day === Day.Sunday;
}

function nextDay(day: Day): Day {
  const order: Day[] = [
    Day.Monday, Day.Tuesday, Day.Wednesday, Day.Thursday,
    Day.Friday, Day.Saturday, Day.Sunday,
  ];
  const index = order.indexOf(day);
  return order[(index + 1) % 7];
}

console.log(isWeekend(Day.Monday));    // false
console.log(isWeekend(Day.Saturday));  // true
console.log(nextDay(Day.Sunday));      // "MONDAY"
```

---

## Lesson 10: Modules

Take the Stack from Lesson 8 and split it across three files.

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
import { StackContract } from "./types";

export class Stack<T> implements StackContract<T> {
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
}
```

**`src/stack/main.ts`**

```typescript
import { Stack } from "./logic";

const stack = new Stack<string>();
stack.push("first");
stack.push("second");
stack.push("third");

console.log(`Size: ${stack.size()}`);   // 3
console.log(`Top: ${stack.peek()}`);    // "third"
console.log(`Popped: ${stack.pop()}`);  // "third"
console.log(`Size: ${stack.size()}`);   // 2
```

Run with `npx ts-node src/stack/main.ts`.

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

console.log(catalog[1].name); // "Laptop"
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

## Lesson 13: Working With External Data (Zod)

```typescript
import { z } from "zod";

const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string().url(),
  rating: z.object({
    rate: z.number(),
    count: z.number(),
  }),
});

const ProductListSchema = z.array(ProductSchema);

type Product = z.infer<typeof ProductSchema>;

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return ProductListSchema.parse(data);
}

async function main() {
  try {
    const products = await fetchProducts();
    console.log(`Loaded ${products.length} products`);
    products.slice(0, 3).forEach((p) => {
      console.log(`- ${p.title}: $${p.price} (${p.rating.rate} stars)`);
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("API returned unexpected shape:", error.errors);
    } else {
      console.error("Failed to fetch:", error);
    }
  }
}

main();
```

Install Zod first: `npm install zod`.

---

## Capstone: Task Manager CLI

A complete reference implementation. Place these files in a project initialized as in Lesson 0, with `npm install zod`.

**`src/types.ts`**

```typescript
import { z } from "zod";

export const PrioritySchema = z.enum(["low", "medium", "high"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const StatusSchema = z.enum(["pending", "done"]);
export type Status = z.infer<typeof StatusSchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: PrioritySchema,
  status: StatusSchema,
  createdAt: z.string().datetime(),
});

export type Task = z.infer<typeof TaskSchema>;

export const TaskListSchema = z.array(TaskSchema);
export type TaskList = z.infer<typeof TaskListSchema>;
```

**`src/storage.ts`**

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

**`src/commands.ts`**

```typescript
import { randomUUID } from "crypto";
import { Task, TaskList, Priority, Status } from "./types";
import { loadTasks, saveTasks } from "./storage";

export async function addTask(
  title: string,
  priority: Priority = "medium",
  description?: string,
): Promise<Task> {
  const tasks = await loadTasks();
  const task: Task = {
    id: randomUUID(),
    title,
    description,
    priority,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  await saveTasks(tasks);
  return task;
}

export async function listTasks(filter?: Status): Promise<TaskList> {
  const tasks = await loadTasks();
  return filter ? tasks.filter((t) => t.status === filter) : tasks;
}

export async function completeTask(id: string): Promise<boolean> {
  const tasks = await loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return false;
  task.status = "done";
  await saveTasks(tasks);
  return true;
}

export async function deleteTask(id: string): Promise<boolean> {
  const tasks = await loadTasks();
  const next = tasks.filter((t) => t.id !== id);
  if (next.length === tasks.length) return false;
  await saveTasks(next);
  return true;
}
```

**`src/main.ts`**

```typescript
import { addTask, listTasks, completeTask, deleteTask } from "./commands";
import { PrioritySchema, StatusSchema, Priority, Status } from "./types";

function getFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "add": {
      const title = args[0];
      if (!title) {
        console.error("Title is required");
        process.exit(1);
      }
      const priorityFlag = getFlag(args, "--priority");
      const priority = priorityFlag
        ? PrioritySchema.parse(priorityFlag)
        : ("medium" as Priority);
      const task = await addTask(title, priority);
      console.log(`Added task ${task.id}: ${task.title}`);
      break;
    }
    case "list": {
      const statusFlag = getFlag(args, "--status");
      const status = statusFlag
        ? (StatusSchema.parse(statusFlag) as Status)
        : undefined;
      const tasks = await listTasks(status);
      if (tasks.length === 0) {
        console.log("No tasks found");
        break;
      }
      tasks.forEach((t) => {
        const marker = t.status === "done" ? "[x]" : "[ ]";
        console.log(`${marker} (${t.priority}) ${t.id.slice(0, 8)} ${t.title}`);
      });
      break;
    }
    case "done": {
      const id = args[0];
      if (!id) {
        console.error("Task id is required");
        process.exit(1);
      }
      const ok = await completeTask(id);
      console.log(ok ? "Task marked as done" : "Task not found");
      break;
    }
    case "delete": {
      const id = args[0];
      if (!id) {
        console.error("Task id is required");
        process.exit(1);
      }
      const ok = await deleteTask(id);
      console.log(ok ? "Task deleted" : "Task not found");
      break;
    }
    default:
      console.log("Commands: add <title> [--priority low|medium|high]");
      console.log("          list [--status pending|done]");
      console.log("          done <id>");
      console.log("          delete <id>");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Sample usage:**

```bash
npx ts-node src/main.ts add "Buy groceries" --priority high
npx ts-node src/main.ts add "Read TypeScript book" --priority low
npx ts-node src/main.ts list
npx ts-node src/main.ts list --status pending
npx ts-node src/main.ts done <paste-id-here>
npx ts-node src/main.ts delete <paste-id-here>
```

The full task ids are UUIDs. You can grab the first 8 characters from the list output but pass the full id to `done` and `delete`. As an extension, you could match by id prefix.
