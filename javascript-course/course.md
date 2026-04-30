# Modern JavaScript (ES2015+): A Practical Course

A foundational course for developers who want to be comfortable with modern JavaScript before tackling TypeScript and React. By the end you will know every modern feature you need to read and write professional code. Total time: roughly 12 to 18 hours with exercises.

This course assumes you know basic programming concepts (variables, loops, functions, conditionals) but does not assume any JavaScript expertise.

---

## Lesson 0: Setup and Background

### What is JavaScript?

JavaScript is a programming language originally designed to run inside web browsers. It is now used everywhere: in browsers (frontend), on servers (Node.js), in desktop apps (Electron), and on mobile (React Native).

> **Background: What does "ES2015+" mean?**
>
> ES stands for ECMAScript, which is the official specification that JavaScript implements. ES2015 (also called ES6) was a major upgrade in 2015 that added classes, modules, arrow functions, and many other features. Every year since then has brought small additions: ES2016, ES2017, and so on. When people say "modern JavaScript", they mean the language as it has existed since 2015.

### What is Node.js?

Node.js is a runtime that lets you execute JavaScript outside the browser. You will use it to run scripts and install tools.

Install Node.js (version 18 or newer) from https://nodejs.org. Then verify:

```bash
node --version
npm --version
```

> **Background: What is npm?**
>
> npm stands for Node Package Manager. It is bundled with Node.js. It does two main things: it installs third-party libraries (called "packages") into your project, and it tracks which versions you are using in a file called `package.json`.

### Setting up a project

Create a folder and initialize it:

```bash
mkdir js-course
cd js-course
npm init -y
```

> **Background: What just happened?**
>
> The `npm init -y` command created a `package.json` file. This is a manifest that describes your project: its name, version, dependencies, and scripts. The `-y` flag accepts all defaults. You can open `package.json` in any editor to see what is in it.

Add `"type": "module"` to your `package.json` so you can use modern import syntax:

```json
{
  "name": "js-course",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js"
}
```

> **Background: What does `"type": "module"` do?**
>
> JavaScript has two module systems. The older one is CommonJS (`require` and `module.exports`). The newer one is ES Modules (`import` and `export`). Setting `"type": "module"` tells Node.js to treat `.js` files as ES Modules. This course uses ES Modules throughout because they are the modern standard.

Create `hello.js`:

```javascript
console.log("Hello, JavaScript!");
```

Run it:

```bash
node hello.js
```

If you see `Hello, JavaScript!`, you are ready.

---

## Lesson 1: let, const, and Block Scope

Modern JavaScript has three ways to declare variables: `var`, `let`, and `const`. You should almost never use `var`.

```javascript
// const: cannot be reassigned (use this by default)
const name = "Alex";
// name = "Bob"; // Error: Assignment to constant variable

// let: can be reassigned (use only when you need to change it)
let count = 0;
count = count + 1; // OK

// var: avoid in modern code
var oldStyle = "do not use this";
```

> **Background: Why avoid `var`?**
>
> The `var` keyword has surprising behavior around scoping that causes bugs. Variables declared with `var` are scoped to the entire enclosing function, regardless of where they are declared. Variables declared with `let` and `const` are scoped to the nearest `{ ... }` block, which matches what most developers expect.

Block scope example:

```javascript
if (true) {
  const message = "Inside the block";
  console.log(message); // works
}
// console.log(message); // Error: message is not defined

// Loops create a new scope per iteration with let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Logs: 0, 1, 2 (each iteration captured its own i)
```

`const` prevents reassignment but not mutation:

```javascript
const list = [1, 2, 3];
list.push(4);    // Allowed: the variable still points to the same array
console.log(list); // [1, 2, 3, 4]
// list = [];    // Error: cannot reassign the variable itself
```

**Default rule of thumb:** Use `const` everywhere. Switch to `let` only when you actually need to reassign.

**Exercise:** Write a function `countDown(start)` that uses `let` to count from `start` down to 1, logging each number. Try changing `let` to `const` and see what error you get.

---

## Lesson 2: Template Literals

Template literals use backticks instead of quotes and let you embed expressions:

```javascript
const name = "Maria";
const age = 30;

// Old way
const oldGreeting = "Hello, " + name + ". You are " + age + " years old.";

// Modern way
const greeting = `Hello, ${name}. You are ${age} years old.`;

console.log(greeting);
```

Multi-line strings without escape characters:

```javascript
const message = `
Dear ${name},

Thank you for signing up.

Best regards,
The Team
`;
```

You can put any expression inside `${...}`:

```javascript
const a = 5;
const b = 3;
console.log(`${a} + ${b} = ${a + b}`);   // "5 + 3 = 8"
console.log(`Even: ${a % 2 === 0}`);     // "Even: false"
```

**Exercise:** Write a function `formatUser({ name, email, role })` that returns a multi-line string introducing the user. Use template literals and call it with a sample object.

---

## Lesson 3: Arrow Functions

Arrow functions are a shorter syntax for writing functions:

```javascript
// Traditional function
function double(n) {
  return n * 2;
}

// Arrow function (full)
const double2 = (n) => {
  return n * 2;
};

// Arrow function (concise: implicit return for single expression)
const double3 = (n) => n * 2;

// Multiple parameters
const add = (a, b) => a + b;

// No parameters: empty parentheses required
const greet = () => "Hello";

// Returning an object literal: wrap in parentheses
const makeUser = (name) => ({ name, createdAt: new Date() });
```

> **Background: What is the difference between arrow functions and regular functions?**
>
> Two big differences. First, arrow functions have shorter syntax. Second, they handle the `this` keyword differently. Inside a regular function, `this` depends on how the function is called. Inside an arrow function, `this` is inherited from the surrounding code. For now, treat arrow functions as the default and reach for regular functions only when you need methods on a class or when something specifically requires `this` to bind dynamically.

Common use with array methods:

```javascript
const numbers = [1, 2, 3, 4, 5];

// Pass arrow functions as callbacks
const doubled = numbers.map((n) => n * 2);
const evens = numbers.filter((n) => n % 2 === 0);
const sum = numbers.reduce((total, n) => total + n, 0);

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(evens);   // [2, 4]
console.log(sum);     // 15
```

**Exercise:** Convert these traditional functions to arrow functions:

```javascript
function isAdult(person) {
  return person.age >= 18;
}

function fullName(user) {
  return user.firstName + " " + user.lastName;
}

function logCurrentTime() {
  console.log(new Date().toISOString());
}
```

---

## Lesson 4: Default, Rest, and Spread

### Default parameters

```javascript
const greet = (name = "stranger", greeting = "Hello") => {
  return `${greeting}, ${name}!`;
};

console.log(greet());                    // "Hello, stranger!"
console.log(greet("Maria"));             // "Hello, Maria!"
console.log(greet("Maria", "Welcome"));  // "Welcome, Maria!"
```

### Rest parameters

The `...` operator collects remaining arguments into an array:

```javascript
const sum = (...numbers) => {
  return numbers.reduce((total, n) => total + n, 0);
};

console.log(sum(1, 2, 3));        // 6
console.log(sum(1, 2, 3, 4, 5));  // 15

// Combined with regular parameters
const logWithPrefix = (prefix, ...messages) => {
  messages.forEach((m) => console.log(`[${prefix}] ${m}`));
};

logWithPrefix("INFO", "Server started", "Connected to DB");
```

### Spread operator

The same `...` operator unpacks an array or object into individual elements:

```javascript
// Arrays
const first = [1, 2, 3];
const second = [4, 5, 6];
const combined = [...first, ...second];   // [1, 2, 3, 4, 5, 6]
const copy = [...first];                   // [1, 2, 3] (independent copy)

// Adding elements
const withExtras = [0, ...first, 4];       // [0, 1, 2, 3, 4]

// Passing array elements as arguments
const numbers = [3, 1, 4, 1, 5];
console.log(Math.max(...numbers));         // 5

// Objects (ES2018)
const baseConfig = { timeout: 5000, retries: 3 };
const customConfig = { ...baseConfig, retries: 5, debug: true };
// { timeout: 5000, retries: 5, debug: true }
```

> **Background: Why use spread instead of methods like `concat` or `Object.assign`?**
>
> Spread syntax is shorter, immediately readable, and creates a shallow copy. The phrase "shallow copy" means it copies the top level only. If your object contains nested objects, those nested objects are still shared. For most purposes, that is what you want.

**Exercise:** Write a function `merge(...objects)` that takes any number of objects and returns a single object with all properties combined (later objects override earlier ones). Use rest and spread.

---

## Lesson 5: Destructuring

Destructuring extracts values from arrays or objects into named variables.

### Array destructuring

```javascript
const point = [10, 20];
const [x, y] = point;
console.log(x, y); // 10 20

// Skipping elements
const [first, , third] = [1, 2, 3];

// With defaults
const [a = 1, b = 2] = [10];
console.log(a, b); // 10 2

// Rest in destructuring
const [head, ...tail] = [1, 2, 3, 4];
console.log(head); // 1
console.log(tail); // [2, 3, 4]

// Swapping variables
let p = 1, q = 2;
[p, q] = [q, p];
console.log(p, q); // 2 1
```

### Object destructuring

```javascript
const user = {
  name: "Alex",
  age: 30,
  email: "alex@example.com",
};

// Pull out properties by name
const { name, age } = user;
console.log(name, age); // "Alex" 30

// Rename while destructuring
const { name: userName, email: userEmail } = user;
console.log(userName); // "Alex"

// Defaults
const { role = "user", age: years } = user;
console.log(role, years); // "user" 30

// Nested destructuring
const order = {
  id: 1,
  customer: { name: "Maria", address: { city: "Cape Town" } },
};
const {
  customer: {
    address: { city },
  },
} = order;
console.log(city); // "Cape Town"
```

### Destructuring in function parameters

This is one of the most useful patterns:

```javascript
// Without destructuring
const printUserOld = (user) => {
  console.log(`${user.name} (${user.age})`);
};

// With destructuring
const printUser = ({ name, age }) => {
  console.log(`${name} (${age})`);
};

printUser({ name: "Jordan", age: 25 });

// With defaults and rest
const setup = ({ host = "localhost", port = 3000, ...rest }) => {
  console.log(`Connecting to ${host}:${port}`);
  console.log("Other options:", rest);
};

setup({ port: 8080, debug: true, retries: 3 });
```

**Exercise:** Given an array of users, destructure inside a callback to extract just the `name` and `email` of each:

```javascript
const users = [
  { id: 1, name: "Alex", email: "a@x.com", age: 30 },
  { id: 2, name: "Maria", email: "m@x.com", age: 25 },
];

// Use map and destructuring to produce:
// [{ name: "Alex", email: "a@x.com" }, { name: "Maria", email: "m@x.com" }]
```

---

## Lesson 6: Object Enhancements

### Property shorthand

When the variable name matches the property name, you can omit the value:

```javascript
const name = "Sam";
const age = 28;

// Old way
const userOld = { name: name, age: age };

// Shorthand
const user = { name, age };
```

### Method shorthand

```javascript
// Old
const oldCounter = {
  count: 0,
  increment: function () {
    this.count += 1;
  },
};

// Shorthand
const counter = {
  count: 0,
  increment() {
    this.count += 1;
  },
};
```

### Computed property names

Use a variable as a property key with square brackets:

```javascript
const key = "score";
const value = 100;

const result = { [key]: value };
console.log(result); // { score: 100 }

// Useful for dynamic keys
const buildField = (name, value) => ({ [name]: value, [`${name}_at`]: new Date() });
console.log(buildField("created", true));
// { created: true, created_at: <date> }
```

**Exercise:** Write a function `groupBy(items, key)` that returns an object grouping items by the value of the specified key. Use computed property names.

```javascript
const items = [
  { type: "fruit", name: "apple" },
  { type: "veg", name: "carrot" },
  { type: "fruit", name: "banana" },
];
// groupBy(items, "type") should return:
// { fruit: [...], veg: [...] }
```

---

## Lesson 7: Array Methods

Modern JavaScript has powerful built-in array methods. Knowing them well replaces most loops.

### map: transform every element

```javascript
const numbers = [1, 2, 3, 4];
const squared = numbers.map((n) => n * n);
console.log(squared); // [1, 4, 9, 16]

// On objects
const users = [
  { name: "Alex", age: 30 },
  { name: "Maria", age: 25 },
];
const names = users.map((u) => u.name); // ["Alex", "Maria"]
```

### filter: keep elements that match a condition

```javascript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4]
```

### reduce: combine elements into a single value

```javascript
const numbers = [1, 2, 3, 4];

// Sum
const total = numbers.reduce((acc, n) => acc + n, 0);

// Build an object
const counts = ["a", "b", "a", "c", "b", "a"].reduce((acc, letter) => {
  acc[letter] = (acc[letter] || 0) + 1;
  return acc;
}, {});
console.log(counts); // { a: 3, b: 2, c: 1 }
```

> **Background: How does `reduce` work?**
>
> `reduce` walks through the array, carrying an "accumulator" value forward. The first argument is a function `(acc, currentItem) => newAcc`. The second argument is the initial value of the accumulator. After visiting every element, `reduce` returns the final accumulator. It is the most flexible array method because you can build anything with it.

### find: get the first matching element

```javascript
const users = [
  { id: 1, name: "Alex" },
  { id: 2, name: "Maria" },
];
const user = users.find((u) => u.id === 2);
console.log(user); // { id: 2, name: "Maria" }
```

### some and every: boolean checks

```javascript
const ages = [22, 18, 30, 16];
console.log(ages.some((a) => a < 18));    // true (at least one)
console.log(ages.every((a) => a >= 18));  // false (not all)
```

### includes: check for a value

```javascript
const tags = ["javascript", "typescript", "react"];
console.log(tags.includes("react"));    // true
console.log(tags.includes("python"));   // false
```

### flat and flatMap

```javascript
const nested = [[1, 2], [3, 4], [5]];
console.log(nested.flat()); // [1, 2, 3, 4, 5]

const sentences = ["hello world", "foo bar"];
const words = sentences.flatMap((s) => s.split(" "));
console.log(words); // ["hello", "world", "foo", "bar"]
```

### Chaining

Methods return arrays, so you can chain them:

```javascript
const orders = [
  { item: "book", price: 20, qty: 2 },
  { item: "pen", price: 3, qty: 5 },
  { item: "lamp", price: 50, qty: 1 },
];

const totalAboveTen = orders
  .filter((o) => o.price > 10)
  .map((o) => o.price * o.qty)
  .reduce((sum, n) => sum + n, 0);

console.log(totalAboveTen); // 90
```

**Exercise:** Given the orders array above, write a single chained expression that returns the names of items where total cost (price times qty) exceeds 30.

---

## Lesson 8: Object Methods

```javascript
const user = { name: "Alex", age: 30, email: "a@x.com" };

// Object.keys: array of keys
console.log(Object.keys(user));       // ["name", "age", "email"]

// Object.values: array of values
console.log(Object.values(user));     // ["Alex", 30, "a@x.com"]

// Object.entries: array of [key, value] pairs
console.log(Object.entries(user));
// [["name", "Alex"], ["age", 30], ["email", "a@x.com"]]

// Iterate with for...of and destructuring
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

// Object.fromEntries: build an object from pairs (the inverse)
const pairs = [["a", 1], ["b", 2]];
console.log(Object.fromEntries(pairs)); // { a: 1, b: 2 }
```

A common pattern: transform an object by mapping its entries.

```javascript
const prices = { apple: 10, banana: 20, cherry: 30 };

// Apply 10% discount to every value
const discounted = Object.fromEntries(
  Object.entries(prices).map(([key, value]) => [key, value * 0.9]),
);

console.log(discounted); // { apple: 9, banana: 18, cherry: 27 }
```

**Exercise:** Write a function `pick(obj, keys)` that returns a new object containing only the specified keys.

```javascript
pick({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { a: 1, c: 3 }
```

---

## Lesson 9: Optional Chaining and Nullish Coalescing

### Optional chaining: `?.`

Safely access a deeply nested property that might not exist:

```javascript
const user = {
  name: "Alex",
  address: { city: "Cape Town" },
};

// Old way
const country = user.address && user.address.country;

// Modern way
const countryNew = user?.address?.country;
console.log(countryNew); // undefined (no error)

// Works with method calls
const result = user?.getName?.();

// Works with array indexes
const firstFriend = user?.friends?.[0];
```

### Nullish coalescing: `??`

Provide a fallback only when the value is `null` or `undefined`:

```javascript
const userInput = null;
const value = userInput ?? "default";
console.log(value); // "default"

// Compare with the older || operator
const count = 0;
console.log(count || 10);  // 10 (because 0 is falsy)
console.log(count ?? 10);  // 0  (because 0 is not nullish)
```

> **Background: When should I use `??` instead of `||`?**
>
> Use `??` when you only want to substitute for `null` or `undefined`. Use `||` when you want to substitute for any falsy value (including `0`, `""`, and `false`). For values where zero or empty string are valid, `??` is the safer choice.

Combine both:

```javascript
const config = {
  display: { theme: null },
};

const theme = config?.display?.theme ?? "light";
console.log(theme); // "light"
```

**Exercise:** Given an array of users with optional address data, write code that lists each user's city, defaulting to "Unknown" when the city is missing or the address is missing.

```javascript
const users = [
  { name: "Alex", address: { city: "Cape Town" } },
  { name: "Maria" },
  { name: "Jordan", address: {} },
];
```

---

## Lesson 10: Classes

Classes give you a clean syntax for creating objects with shared methods.

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hi, I am ${this.name}`;
  }

  // Static methods belong to the class itself, not instances
  static fromString(text) {
    const [name, age] = text.split(",");
    return new Person(name, Number(age));
  }
}

const alex = new Person("Alex", 30);
console.log(alex.greet()); // "Hi, I am Alex"

const maria = Person.fromString("Maria,25");
console.log(maria.greet()); // "Hi, I am Maria"
```

### Inheritance with `extends`

```javascript
class Employee extends Person {
  constructor(name, age, role) {
    super(name, age); // Call the parent constructor
    this.role = role;
  }

  greet() {
    // Override the parent method
    return `${super.greet()}, and I work as a ${this.role}`;
  }
}

const dev = new Employee("Sam", 28, "developer");
console.log(dev.greet()); // "Hi, I am Sam, and I work as a developer"
```

### Private fields with `#`

```javascript
class BankAccount {
  #balance = 0; // Private: cannot be accessed outside the class

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount();
account.deposit(100);
console.log(account.getBalance()); // 100
// console.log(account.#balance); // Error: private field
```

### Getters and setters

```javascript
class Temperature {
  #celsius = 0;

  get celsius() {
    return this.#celsius;
  }

  set celsius(value) {
    if (value < -273.15) throw new Error("Below absolute zero");
    this.#celsius = value;
  }

  get fahrenheit() {
    return this.#celsius * 9 / 5 + 32;
  }
}

const t = new Temperature();
t.celsius = 25;
console.log(t.celsius);     // 25
console.log(t.fahrenheit);  // 77
```

**Exercise:** Build a `Queue` class with `enqueue`, `dequeue`, `peek`, and `size` methods. Internally use a private field for the array.

---

## Lesson 11: Modules

Modules let you split code across files. Each file is a module, and you control what is shared.

### Named exports

```javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

```javascript
// main.js
import { PI, add, multiply } from "./math.js";

console.log(add(1, 2));     // 3
console.log(multiply(2, 3)); // 6
console.log(PI);             // 3.14159
```

### Default exports

Each file can have one default export:

```javascript
// logger.js
export default function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}
```

```javascript
// main.js
import log from "./logger.js"; // No braces for default imports

log("Hello");
```

### Mixing default and named

```javascript
// user.js
export default class User { /* ... */ }
export const MAX_AGE = 150;
export function isAdult(user) { /* ... */ }
```

```javascript
// main.js
import User, { MAX_AGE, isAdult } from "./user.js";
```

### Namespace import

```javascript
import * as math from "./math.js";

console.log(math.add(1, 2));
console.log(math.PI);
```

### Re-exports (barrel files)

```javascript
// index.js
export * from "./math.js";
export * from "./user.js";
export { default as log } from "./logger.js";
```

> **Background: Why do imports include `.js` extensions?**
>
> When you set `"type": "module"` in `package.json`, Node.js follows the official ES Modules specification, which requires file extensions. Bundlers like Vite and Webpack often let you skip the extension, but native Node.js does not. When in doubt, include the extension.

**Exercise:** Split a project into three files: `math.js` exporting `add` and `subtract`, `string.js` exporting `capitalize` and `reverse`, and `index.js` re-exporting everything. Test it from a `main.js`.

---

## Lesson 12: Promises

A Promise represents a value that will be available later. It is JavaScript's main tool for asynchronous operations: network calls, timers, file I/O.

> **Background: What does "asynchronous" mean?**
>
> JavaScript runs code one statement at a time. But some operations take time (loading a file, calling an API) and we do not want to freeze the program waiting. Asynchronous code lets you start an operation and continue with other work, then react when the operation finishes. A Promise is the object that represents that "I will tell you when I am done" contract.

### Creating and using Promises

A Promise has three states: pending, fulfilled (resolved), or rejected.

```javascript
const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(`Waited ${ms}ms`), ms);
  });

wait(1000).then((result) => console.log(result));
```

### Chaining with `.then` and `.catch`

```javascript
const fetchUser = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id < 0) reject(new Error("Invalid id"));
      else resolve({ id, name: "Alex" });
    }, 100);
  });

fetchUser(1)
  .then((user) => {
    console.log("Got user:", user);
    return user.id * 2;
  })
  .then((doubledId) => {
    console.log("Doubled id:", doubledId);
  })
  .catch((error) => {
    console.error("Failed:", error.message);
  })
  .finally(() => {
    console.log("Done (runs whether success or failure)");
  });
```

### Promise.all: wait for all

```javascript
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [1, 2, 3]
});

// If ANY promise rejects, the whole thing rejects
Promise.all([Promise.resolve(1), Promise.reject(new Error("oops"))])
  .catch((err) => console.error(err.message)); // "oops"
```

### Promise.allSettled: wait for all, get all results

```javascript
Promise.allSettled([
  Promise.resolve("first"),
  Promise.reject(new Error("second failed")),
  Promise.resolve("third"),
]).then((results) => {
  results.forEach((result) => {
    if (result.status === "fulfilled") console.log("OK:", result.value);
    else console.log("ERR:", result.reason.message);
  });
});
```

### Promise.race: first to finish wins

```javascript
const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
const fetchData = () => new Promise((resolve) => setTimeout(() => resolve("data"), 2000));

Promise.race([fetchData(), timeout(1000)])
  .then((data) => console.log(data))
  .catch((err) => console.error(err.message)); // "timeout"
```

**Exercise:** Write a function `delay(ms, value)` that returns a Promise resolving to `value` after `ms` milliseconds. Use it with `Promise.all` to wait for three different delays in parallel.

---

## Lesson 13: async/await

`async` and `await` are syntactic sugar over Promises. They let you write asynchronous code that reads like synchronous code.

```javascript
// Function declared with async always returns a Promise
async function fetchUser(id) {
  // await pauses until the Promise resolves
  const response = await fetch(`https://api.example.com/users/${id}`);
  const user = await response.json();
  return user;
}

// Calling it returns a Promise
fetchUser(1).then((user) => console.log(user));
```

### try/catch with async/await

Error handling looks like normal synchronous code:

```javascript
async function fetchUserSafe(id) {
  try {
    const response = await fetch(`https://api.example.com/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    return null;
  }
}
```

### Sequential vs parallel

This is a common mistake. Compare:

```javascript
// Sequential: each await waits for the previous one
async function loadAllSequential() {
  const a = await fetchUser(1); // wait
  const b = await fetchUser(2); // wait
  const c = await fetchUser(3); // wait
  return [a, b, c];
  // Total time: sum of all three
}

// Parallel: start all three, then await
async function loadAllParallel() {
  const [a, b, c] = await Promise.all([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3),
  ]);
  return [a, b, c];
  // Total time: the slowest of the three
}
```

Use parallel whenever the operations do not depend on each other.

### Top-level await (in modules)

Inside a module (file with `"type": "module"`), you can use `await` outside of an async function:

```javascript
// This works inside a module file
const response = await fetch("https://api.example.com/data");
const data = await response.json();
console.log(data);
```

**Exercise:** Convert this Promise chain to use async/await with proper error handling:

```javascript
fetchUser(1)
  .then((user) => fetchPostsForUser(user.id))
  .then((posts) => posts.length)
  .then((count) => console.log(`Found ${count} posts`))
  .catch((err) => console.error(err));
```

---

## Lesson 14: Fetch and HTTP

`fetch` is the modern built-in way to make HTTP requests. It returns a Promise.

### GET request

```javascript
async function getPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const posts = await response.json();
  return posts;
}

const posts = await getPosts();
console.log(`Loaded ${posts.length} posts`);
console.log(posts[0]);
```

> **Background: Why two awaits?**
>
> The first await (`await fetch(...)`) waits for the HTTP response headers to arrive. The second (`await response.json()`) waits for the body to be downloaded and parsed as JSON. They are separate steps because in some cases (like streaming) you might want to handle them differently.

### POST request

```javascript
async function createPost(post) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return await response.json();
}

const newPost = await createPost({
  title: "Hello",
  body: "World",
  userId: 1,
});

console.log(newPost);
```

### Other methods

PUT, PATCH, and DELETE work the same way, just change `method`:

```javascript
await fetch("https://api.example.com/items/1", {
  method: "DELETE",
});
```

### Handling errors

```javascript
async function safeFetch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Network error or bad URL:", error.message);
    } else {
      console.error("Request failed:", error.message);
    }
    return null;
  }
}
```

**Exercise:** Write an async function `getUserAndPosts(userId)` that fetches a user from `jsonplaceholder.typicode.com/users/{id}` and their posts from `jsonplaceholder.typicode.com/posts?userId={id}` in parallel, and returns an object with both.

---

## Lesson 15: Map and Set

### Map: a key-value store

`Map` is like an object but with two key advantages: keys can be any type (not just strings), and the order is guaranteed.

```javascript
const userScores = new Map();

userScores.set("alex", 100);
userScores.set("maria", 85);
userScores.set("jordan", 92);

console.log(userScores.get("alex"));     // 100
console.log(userScores.has("sam"));      // false
console.log(userScores.size);            // 3

userScores.delete("maria");

// Iterate
for (const [name, score] of userScores) {
  console.log(`${name}: ${score}`);
}

// Build from pairs
const fromPairs = new Map([["a", 1], ["b", 2]]);
```

### Set: a unique value collection

```javascript
const tags = new Set();
tags.add("javascript");
tags.add("typescript");
tags.add("javascript"); // Duplicate ignored

console.log(tags.size);           // 2
console.log(tags.has("react"));    // false

// Common pattern: deduplicate an array
const numbers = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(numbers)];
console.log(unique); // [1, 2, 3, 4]

// Iterate
for (const tag of tags) {
  console.log(tag);
}
```

> **Background: When to use Map vs object, and Set vs array?**
>
> Use a `Map` when you need keys that are not strings, when you frequently add and remove keys, or when iteration order matters. Use a regular object for a fixed structure where keys are known. Use a `Set` when you need uniqueness or fast "is this in here?" checks. Use an array when order and indexed access matter, or when items can repeat.

**Exercise:** Given an array of orders, use a `Map` to count how many orders each customer made. Each order looks like `{ customerId: 1, total: 99 }`.

---

## Lesson 16: Iterators and for...of

The `for...of` loop iterates over the values of any iterable (arrays, strings, Maps, Sets, and more).

```javascript
// Arrays
for (const item of ["a", "b", "c"]) {
  console.log(item);
}

// Strings
for (const char of "hello") {
  console.log(char);
}

// Maps
const scores = new Map([["alex", 100], ["maria", 85]]);
for (const [name, score] of scores) {
  console.log(`${name}: ${score}`);
}

// Object.entries gives you an iterable
const user = { name: "Alex", age: 30 };
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}
```

### entries, keys, values on arrays

```javascript
const items = ["a", "b", "c"];

for (const [index, value] of items.entries()) {
  console.log(`${index}: ${value}`);
}
```

### Generator functions (briefly)

A generator is a function that can pause and resume. You will rarely write one yourself, but it is useful to recognize them.

```javascript
function* range(start, end) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

for (const n of range(1, 5)) {
  console.log(n); // 1, 2, 3, 4
}
```

The `*` after `function` makes it a generator. The `yield` keyword produces the next value. Generators are mostly used by libraries to build custom iterables.

**Exercise:** Write a generator function `fibonacci(limit)` that yields Fibonacci numbers until they exceed `limit`. Iterate it with `for...of`.

---

## Capstone Project: Habit Tracker CLI

Build a command-line habit tracker that exercises every modern JavaScript feature you have learned.

### Requirements

- Add a habit (name and frequency: daily or weekly).
- Mark a habit as completed for today.
- List all habits showing how many times each has been completed this week.
- Remove a habit.
- Save data to a `habits.json` file. Load it on startup.
- Use modules to split the code into multiple files.

### Suggested structure

```
habit-tracker/
  src/
    storage.js       // load and save habits.json
    habits.js        // add, complete, list, remove logic
    cli.js           // parse process.argv and call functions
    main.js          // entry point
  habits.json
  package.json
```

### Sample `package.json`

```json
{
  "name": "habit-tracker",
  "version": "1.0.0",
  "type": "module",
  "main": "src/main.js",
  "scripts": {
    "start": "node src/main.js"
  }
}
```

### Sample `storage.js`

```javascript
import { promises as fs } from "fs";

const FILE = "habits.json";

export async function loadHabits() {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    return JSON.parse(text);
  } catch {
    return [];
  }
}

export async function saveHabits(habits) {
  await fs.writeFile(FILE, JSON.stringify(habits, null, 2));
}
```

### Sample CLI usage

```bash
node src/main.js add "Drink water" daily
node src/main.js add "Go for a run" weekly
node src/main.js list
node src/main.js complete "Drink water"
node src/main.js remove "Drink water"
```

When you finish, you have built something practical using arrow functions, destructuring, modules, async/await, promises, classes (optionally), Map or Set, optional chaining, spread, and template literals. That covers everything modern JavaScript developers use daily.

---

## Where to Go Next

Once you finish this course, you are ready for the TypeScript course in this same series. Every concept you learned here will continue to apply: TypeScript adds types on top of modern JavaScript without changing how the language works.

After TypeScript, take the React with TypeScript course to learn modern frontend development.

### Recommended reading

- "Eloquent JavaScript" by Marijn Haverbeke (free online at eloquentjavascript.net)
- The MDN JavaScript Guide at developer.mozilla.org
- "You Do not Know JS Yet" by Kyle Simpson (free on GitHub)

Good luck.
