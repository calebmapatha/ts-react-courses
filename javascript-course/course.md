# Modern JavaScript: A Practical Course

Revised for 2026. A foundational course for developers who want to be
comfortable with modern JavaScript before tackling TypeScript and React. By the
end you will know every modern feature you need to read and write professional
code. Total time: roughly 12 to 18 hours with exercises.

This course assumes you know basic programming concepts (variables, loops,
functions, conditionals) but does not assume any JavaScript expertise.

Material added or changed in the 2026 revision is marked **(2026)**. If you
worked through an earlier version of this course, those markers are the diff.

**Baseline (2026):** Node.js 24 (Active LTS), ES modules only, no build step.
Every sample in this course was run on Node 24.20.0 before publication. The
version table lives in `STACK.md` at the root of this repository.

---

## Lesson 0: Setup and Background

### What is JavaScript?

JavaScript is a programming language originally designed to run inside web
browsers. It is now used everywhere: in browsers (frontend), on servers
(Node.js), in desktop apps (Electron), on mobile (React Native), and inside
native shells (Capacitor).

> **Background: what are all those things at the end?**
>
> One language, many **runtimes**. A runtime is the program that executes your
> code, and each gives you a different set of surroundings.
>
> - **Browser.** The original. Your code can reach the page and the network.
> - **Node.js.** JavaScript outside a browser, with files, processes and
>   servers instead of a page. This course runs here.
> - **Electron.** A browser and Node bundled into a desktop application. VS
>   Code and Slack are built this way.
> - **React Native.** Your JavaScript drives real native views on a phone,
>   rather than a web page.
> - **Native shell (Capacitor).** A small native app that hosts a **WebView**,
>   a browser engine with no address bar, running your ordinary web code, plus
>   plugins for things a browser cannot reach such as the camera or
>   biometrics. To the user it is an app from the app store; inside, it is your
>   website.
>
> The language in this course is identical in all five. What changes is what is
> available around it, which is why `document` exists in a browser and
> `readFile` does not.

**(2026)** Any term these courses use without stopping to define is defined once
in [`../GLOSSARY.md`](../GLOSSARY.md).

> **Background: What does "ES2026" mean?**
>
> ES stands for ECMAScript, which is the official specification that JavaScript
> implements. ES2015 (also called ES6) was a major upgrade in 2015 that added
> classes, modules, and arrow functions. Every year since has brought a smaller
> set of additions, named by year: ES2023 added `findLast` and the non-mutating
> array methods, ES2024 added `Object.groupBy` and `Promise.withResolvers`,
> ES2025 added iterator helpers, Set operations and `RegExp.escape`. When
> people say "modern JavaScript" they mean the language as it has existed since
> 2015. This course teaches all of it, and marks anything newer than ES2022
> with **(2026)** so you know what an older runtime will not have.

### What is Node.js?

Node.js is a runtime that lets you execute JavaScript outside the browser. You
will use it to run scripts and install tools.

**(2026)** Install **Node.js 24**, the Active LTS line, from
https://nodejs.org. Then verify:

```bash
node --version   # expect v24.x.x
npm --version
```

> **Background: Which Node version should I install?**
>
> Node ships a new major version every six months. Even-numbered versions
> become "Active LTS" (long term support) each October and are supported for
> about three years. Odd-numbered versions are for trying things out and are
> never LTS. As at September 2026, Node 24 is the Active LTS line, Node 22 is
> in maintenance until April 2027, and Node 20 reached end of life on 30 April
> 2026. Node 26 becomes Active LTS at the end of October 2026. Install the
> Active LTS line unless a project tells you otherwise.

Some samples in this course need Node 24 specifically. They are marked. If you
are on Node 22, `Promise.try`, `RegExp.escape` and `Error.isError` will be
`undefined` and those samples will fail.

> **Background: What is npm?**
>
> npm stands for Node Package Manager. It is bundled with Node.js. It does two
> main things: it installs third-party libraries (called "packages") into your
> project, and it tracks which versions you are using in a file called
> `package.json`. Other package managers do the same job. Casey Journals uses
> pnpm, which is stricter about which packages a file may import; Mentisflow
> uses npm. The commands differ, the idea does not.

### Setting up a project

Create a folder and initialise it:

```bash
mkdir js-course
cd js-course
npm init -y
```

> **Background: What just happened?**
>
> The `npm init -y` command created a `package.json` file. This is a manifest
> that describes your project: its name, version, dependencies, and scripts.
> The `-y` flag accepts all defaults. You can open `package.json` in any editor
> to see what is in it.

**(2026)** Add `"type": "module"` to your `package.json`. This course is ES
modules only. There is no CommonJS anywhere in it.

```json
{
  "name": "js-course",
  "version": "1.0.0",
  "type": "module",
  "main": "src/main.js",
  "engines": { "node": ">=24" },
  "scripts": {
    "start": "node src/main.js",
    "dev": "node --watch src/main.js"
  }
}
```

> **Background (2026): What does `"type": "module"` do, and why only modules?**
>
> JavaScript has two module systems. The older one is CommonJS (`require` and
> `module.exports`). The newer one is ES Modules (`import` and `export`).
> Setting `"type": "module"` tells Node.js to treat `.js` files as ES Modules.
>
> Earlier versions of this course taught both. This one teaches only ES
> modules, because that is what every tool now assumes. Vite, Vitest, ESLint 9
> flat config, and Node itself all default to modules. Both Casey Journals
> (`packages/core/package.json`) and Mentisflow (`mentisflow/package.json`)
> declare `"type": "module"`. You will still meet CommonJS in old packages, and
> `import` can load them, but you should not write it.

### The `node:` prefix (2026)

When you import something built into Node, prefix it with `node:`.

```javascript
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";
import test from "node:test";
```

> **Background (2026): Why the prefix?**
>
> Without it, `import "fs"` is ambiguous: Node has to check whether a package
> called `fs` exists in `node_modules` first. Someone could publish one. The
> `node:` prefix says "the built-in, always" and cannot be shadowed by any
> package. It is faster to resolve and it is safer. Some newer built-ins, such
> as `node:test` and `node:sqlite`, are *only* importable with the prefix. Use
> it everywhere.

### Running your code (2026)

Create `src/main.js`:

```javascript
console.log("Hello, JavaScript.");
```

Run it:

```bash
node src/main.js
```

Three flags are worth learning now.

```bash
# Restart automatically when a file changes. No nodemon needed.
node --watch src/main.js

# Run a script from package.json without npm in the middle.
node --run dev

# Load a .env file into process.env without the dotenv package.
node --env-file=.env src/main.js
```

> **Background (2026): What replaced the tools I have read about?**
>
> Tutorials written before 2024 tell you to install `nodemon` for reloading and
> `dotenv` for environment variables. Node does both itself now. `node --watch`
> replaces `nodemon`. `--env-file` replaces `dotenv` for the common case. And
> as you will see in the TypeScript course, `node file.ts` replaces `ts-node`.
> Fewer dependencies is not a style preference. Every package you do not
> install is a package that cannot be compromised, which is a point the
> workbook returns to under supply chain security.

**Never put a real secret in a file you commit.** A `.env` file belongs in
`.gitignore`. Both Casey products keep an `.env.example` with empty values
committed and the real `.env` ignored. Copy that habit from the first day.

If you see `Hello, JavaScript.`, you are ready.

---

## Lesson 0a: The Four Building Blocks (2026)

This course says it assumes you know variables, loops, functions and
conditionals from some other language. This lesson is the ten-minute version of
that assumption, so nobody has to go and find it elsewhere. If you already
write code in any language, skim it for the JavaScript spelling and move on.

### Variables: a name for a value

```javascript
const rate = 0.15;     // a name bound to a value
let total = 0;         // the same, but you intend to change it
total = total + 100;   // changed
```

`const` and `let` are covered properly in Lesson 1. For now: **a variable is a
name you give a value so you can refer to it later.**

### Conditionals: doing one thing or another

```javascript
const age = 20;

if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teenager");
} else {
  console.log("Child");
}
```

The thing in the brackets is a **condition**: an expression that comes out true
or false. Comparison operators produce one:

```javascript
a === b   // equal, and the same type. Use this one.
a !== b   // not equal
a > b     a >= b     a < b     a <= b
```

> **Background: why `===` and not `==`?**
>
> `==` converts the two sides to a common type before comparing, and its rules
> are surprising: `0 == ""` is true, `null == undefined` is true, and
> `"1" == 1` is true. `===` compares without converting, so it means what you
> expect. Use `===` and `!==` everywhere. The only common exception is
> `value == null`, which is a deliberate idiom meaning "null or undefined".

Combine conditions with `&&` (and), `||` (or), `!` (not):

```javascript
const age = 20, hasLicence = true, isAdmin = false, isOwner = true, isBanned = false;

if (age >= 18 && hasLicence) console.log("may drive");   // both must be true
if (isAdmin || isOwner)      console.log("may edit");    // either will do
if (!isBanned)               console.log("may post");    // not banned
```

A short form for picking between two values, called the **ternary**:

```javascript
const age = 20;

const label = age >= 18 ? "Adult" : "Minor";
//            condition  ? if true : if false

console.log(label);   // "Adult"
```

> **Background: what is "truthy"?**
>
> JavaScript accepts any value where a condition is expected, not only `true`
> and `false`. Six values count as false: `false`, `0`, `""` (the empty
> string), `null`, `undefined`, and `NaN`. Everything else counts as true,
> including `"0"`, `[]` and `{}`.
>
> This trips people constantly. `if (count)` is false when `count` is zero,
> which is usually not what you meant, because zero is a real count. Lesson 9
> introduces `??`, which exists precisely to handle that.

### Loops: doing something repeatedly

```javascript
// for...of: each value in a list. Use this by default.
for (const name of ["Alex", "Maria", "Jordan"]) {
  console.log(name);
}

// while: keep going until a condition stops being true
let countdown = 3;
while (countdown > 0) {
  console.log(countdown);
  countdown = countdown - 1;
}

// The classic C-style for loop. You will read it; you will rarely write it.
for (let i = 0; i < 3; i++) {
  console.log(i);   // 0, 1, 2
}
```

`break` leaves the loop early. `continue` skips to the next turn.

```javascript
for (const n of [1, 2, 3, 4, 5]) {
  if (n === 2) continue;   // skip 2
  if (n === 4) break;      // stop entirely at 4
  console.log(n);          // 1, 3
}
```

> **Background: why so few loops in modern JavaScript?**
>
> Because most loops are really one of a handful of shapes: transform every
> item, keep the items that match, or reduce a list to one value. Lesson 7
> gives each of those a name (`map`, `filter`, `reduce`), and a named operation
> is easier to read than a loop whose purpose you have to reconstruct.
>
> Write loops when you genuinely need one: when you must stop early, when the
> work is asynchronous and must happen in order, or when there is no list.

### Functions: a named piece of behaviour

```javascript
// A declaration.
function add(a, b) {
  return a + b;
}

// The same thing as a value assigned to a name, in the arrow form.
const addAgain = (a, b) => a + b;

console.log(add(2, 3));   // 5
```

`a` and `b` are **parameters**: names for the values the function is given.
The `2` and `3` at the call site are **arguments**: the actual values.
`return` hands a value back to the caller. A function with no `return` gives
back `undefined`.

Arrow functions get a lesson of their own (Lesson 3) because they differ from
`function` in one important way beyond looking shorter.

> **Background: what does "calling" a function mean?**
>
> Writing `add` refers to the function itself, as a value you could store or
> pass somewhere. Writing `add(2, 3)` **calls** it: runs the body with those
> arguments and evaluates to whatever it returns.
>
> The distinction matters more than it looks. `setTimeout(save, 1000)` passes
> the function so the timer can call it in a second. `setTimeout(save(), 1000)`
> calls it **now** and passes the result, which is almost never what you
> wanted. This is one of the most common early bugs.

### Objects and arrays, in one breath

Two ways of holding several values, used constantly from here on.

```javascript
// An array: an ordered list, reached by position, counting from zero.
const names = ["Alex", "Maria"];
console.log(names[0]);        // "Alex"
console.log(names.length);    // 2

// An object: named fields, reached by name.
const person = { name: "Alex", age: 30 };
console.log(person.name);     // "Alex"
console.log(person["name"]);  // the same, when the name is in a variable
```

Objects nest, and so do arrays:

```javascript
const booking = {
  patient: { name: "Alex" },
  slots: ["09:00", "10:00"],
};

console.log(booking.patient.name);  // "Alex"
console.log(booking.slots[1]);      // "10:00"
```

### Printing things while you learn

```javascript
const people = [{ name: "Alex", age: 30 }, { name: "Maria", age: 25 }];
const booking = { patient: { name: "Alex" }, slots: ["09:00", "10:00"] };

console.log("how many:", people.length);
console.table(people);                      // a readable grid, for arrays of objects
console.dir(booking, { depth: null });      // the whole nested structure
```

`console.log` is not cheating and it is not only for beginners. Printing the
value at the point you stopped understanding is the fastest debugging tool
there is, in any language.

**Exercise:** Write `describe(person)` taking an object like
`{ name: "Alex", age: 20 }` and returning `"Alex is an adult"` or
`"Alex is a minor"`. Then write `describeAll(people)` that loops over an array
of them and prints each. Use `const`, a ternary, and `for...of`.

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

> **Background: what is a "literal", and why a third kind of quote?**
>
> A literal is a value written directly in the source: `42`, `"hello"`,
> `[1, 2]`. JavaScript has three ways to write a string literal: single quotes,
> double quotes, and backticks. The first two are interchangeable and inert.
> Backticks make a **template literal**, which does two things the others
> cannot: it may run across several lines, and `${...}` inside it is evaluated
> and its result inserted.
>
> That insertion is called **interpolation**. The alternative is `+` between
> the pieces, which is harder to read and easy to get wrong by one space.

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
const name = "Maria";

const message = `
Dear ${name},

Thank you for signing up.

Best regards,
The Team
`;

console.log(message);
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

> **Background: what is destructuring, in one sentence?**
>
> **Pulling values out of an object or array into their own variables, in one
> step, using a pattern that mirrors the shape of the thing.**
>
> ```javascript
> const point = { x: 1, y: 2 };
>
> const x = point.x;        // without
> const y = point.y;
>
> const { x, y } = point;   // with
> ```
>
> The left-hand side is not an object being created. It is a **pattern** being
> matched against the value on the right. That is why the same syntax works for
> arrays (`const [first, second] = list`), for function parameters, and nested
> several levels deep. Once you read `{ }` on the left as "take these out of
> that", the rest of this lesson is one idea applied in five places.

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

> **Background: why does an object literal have special syntax at all?**
>
> Because three things happen so often that writing them out became noise:
> naming a property the same as the variable holding it, attaching a function
> to an object, and using a name held in a variable as the key.
>
> Each shorthand in this lesson compiles to exactly what you would have
> written; none of them adds behaviour. They exist so the shape of the object
> is visible at a glance rather than buried in repetition. That is the whole
> theme, and it is worth noticing because the same instinct produced the array
> methods in Lesson 7.

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

### at, findLast, and findLastIndex (2026)

`at` accepts a negative index, so the last element no longer needs
`arr[arr.length - 1]`.

```javascript
const scores = [10, 20, 30, 40];
console.log(scores.at(-1)); // 40
console.log(scores.at(0));  // 10
console.log("habit".at(-1)); // "t" (strings have it too)
```

`findLast` and `findLastIndex` search from the end. They are the mirror of
`find` and `findIndex`.

```javascript
const entries = [
  { day: "2026-09-01", done: true },
  { day: "2026-09-02", done: false },
  { day: "2026-09-03", done: true },
];

const lastDone = entries.findLast((e) => e.done);
console.log(lastDone.day); // "2026-09-03"
```

> **Background (2026): Why does `findLast` matter?**
>
> The old way was `[...arr].reverse().find(...)`, which copies the whole array
> and then throws the copy away. `findLast` walks backwards and stops at the
> first match. For a habit history or an audit log, where the interesting row is
> almost always near the end, this is the difference between reading three rows
> and reading three thousand.

### toSorted, toReversed, toSpliced, and with (2026)

`sort`, `reverse` and `splice` change the array in place. That is a frequent
source of bugs, especially in React, where mutating state that another
component is reading produces a screen that does not update. Four methods do
the same jobs and return a new array instead.

```javascript
const habits = ["Walk", "Read", "Stretch"];

const sorted = habits.toSorted();          // ["Read", "Stretch", "Walk"]
const reversed = habits.toReversed();      // ["Stretch", "Read", "Walk"]
const replaced = habits.with(1, "Journal"); // ["Walk", "Journal", "Stretch"]
const removed = habits.toSpliced(0, 1);    // ["Read", "Stretch"]

console.log(habits); // ["Walk", "Read", "Stretch"], untouched
```

`toSorted` takes the same comparator as `sort`:

```javascript
const orders = [
  { item: "book", cents: 24999 },
  { item: "pen", cents: 3500 },
  { item: "lamp", cents: 129900 },
];

const cheapestFirst = orders.toSorted((a, b) => a.cents - b.cents);
console.log(cheapestFirst.map((o) => o.item)); // ["pen", "book", "lamp"]
```

> **Background (2026): Why are the amounts integers?**
>
> `129900` is one thousand two hundred and ninety nine rand, held as cents.
> Money is never stored as a floating point number, because `0.1 + 0.2` is not
> `0.3` in any language that uses IEEE 754 doubles, JavaScript included. Store
> an integer number of the smallest unit and format only at the edge:
>
> ```javascript
> const rands = new Intl.NumberFormat("en-ZA", {
>   style: "currency",
>   currency: "ZAR",
> });
> console.log(rands.format(129900 / 100)); // "R 1 299,00"
> ```
>
> This course uses integer cents everywhere from here on. So does every
> production codebase worth reading.

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

### Object.groupBy and Map.groupBy (2026)

Grouping a list by some key used to be a `reduce` with an accumulator. It is
now one call.

```javascript
const tasks = [
  { title: "File the notice", list: "today" },
  { title: "Draft the letter", list: "today" },
  { title: "Renew the licence", list: "later" },
];

const byList = Object.groupBy(tasks, (task) => task.list);

console.log(Object.keys(byList));   // ["today", "later"]
console.log(byList.today.length);   // 2
console.log(byList.nothing);        // undefined
```

`Object.groupBy` returns a null-prototype object, so keys such as
`"constructor"` or `"toString"` are safe. Keys are always coerced to strings.

When you need keys that are not strings, use `Map.groupBy`:

```javascript
const done = Map.groupBy(tasks, (task) => task.list === "today");
console.log(done.get(true).length);  // 2
console.log(done.get(false).length); // 1
```

> **Background (2026): Is this really better than `reduce`?**
>
> Compare the two:
>
> ```javascript
> // Before
> const byList = tasks.reduce((acc, task) => {
>   (acc[task.list] ??= []).push(task);
>   return acc;
> }, {});
>
> // After
> const byList = Object.groupBy(tasks, (task) => task.list);
> ```
>
> The second version says what it does. The first version says how. When you
> read code six months later, "what" is the one you want. That is the whole
> argument for every method on this page.

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

> **Background: what is a class, an instance, and `this`?**
>
> A **class** is a template. An **instance** is one thing made from it with
> `new`. `new Person("Alex", 30)` creates an empty object, runs the
> `constructor` with that object as `this`, and hands it back.
>
> `this` is the instance the method was called on. So `alex.greet()` runs
> `greet` with `this` being `alex`, which is how one method serves every
> instance: the code is shared, the data is not.
>
> A **method** is a function stored on the class. A **static** method belongs
> to the class rather than to any instance, which is why it is called as
> `Person.fromString(...)` and not `alex.fromString(...)`. Use one for a
> factory, or a helper that does not need an instance.

> **Background: do I need classes in JavaScript?**
>
> Less than you would in Java or C#. A plain object and a few functions do most
> of what a class does, with less to learn and nothing to bind.
>
> Reach for a class when you have **state plus behaviour that belong together
> and there will be several of them**: a queue, a cache, a parser, a
> connection. Reach for a plain object when it is only data. Most application
> code is the second, which is why the rest of this course uses far more
> objects than classes.
>
> Note also that a class is not a separate kind of thing underneath.
> JavaScript's inheritance works by one object delegating to another, and
> `class` is a tidier way of writing that. You do not need the underlying
> mechanism to use classes, but it explains why `this` behaves as it does.

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

### Import attributes (2026)

You can import a JSON file directly, provided you state the type.

```javascript
import fixtures from "./fixtures/habits.json" with { type: "json" };

console.log(fixtures.length);
```

> **Background (2026): Why the `with { type: "json" }`?**
>
> A module specifier such as `"./habits.json"` says where to fetch something,
> not what it is. Without a declared type, a server could answer that request
> with JavaScript, and the importer would execute it. The attribute makes the
> expectation explicit: if the resource is not JSON, the import fails rather
> than running. It is a security boundary, not a formality, which is why it is
> mandatory rather than optional.
>
> The older syntax was `assert { type: "json" }`. That spelling is deprecated.
> Write `with`.

A JSON import is frozen and read-only in effect: treat it as a fixture, not as
mutable state. If you need to change the data, copy it first with
`structuredClone(fixtures)`.

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

### Promise.withResolvers (2026)

Sometimes you need a Promise whose `resolve` and `reject` are called from
somewhere else entirely: an event listener, a callback API, a message handler.
The old pattern leaked the two functions out of the executor by hand.

```javascript
// Before
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});
```

`Promise.withResolvers()` returns all three together.

```javascript
const { promise, resolve, reject } = Promise.withResolvers();

// Somewhere else, later:
setTimeout(() => resolve("done"), 100);

console.log(await promise); // "done"
```

A realistic use: turning a one-shot event into something you can `await`.

```javascript
function once(emitter, eventName) {
  const { promise, resolve } = Promise.withResolvers();
  emitter.once(eventName, resolve);
  return promise;
}
```

### Promise.try (2026, needs Node 24)

`Promise.try(fn)` runs `fn` and always gives you a Promise back, whether `fn`
is synchronous, asynchronous, or throws immediately.

```javascript
function parseConfig(text) {
  return JSON.parse(text); // throws synchronously on bad input
}

// Without Promise.try, the throw escapes the chain:
// parseConfig("{").then(...).catch(...)  <- TypeError, .then of undefined

const result = await Promise.try(() => parseConfig("{"))
  .catch((error) => ({ error: error.message }));

console.log(result); // { error: "Expected property name or '}' ..." }
```

> **Background (2026): Why is a synchronous throw a problem?**
>
> A function that is "sometimes async" is one of the classic sources of
> unhandled errors. If it returns a Promise, `.catch` handles the failure. If
> it throws before returning, `.catch` never runs, because there is no Promise
> to attach to. `Promise.try` removes the "sometimes" and gives you one shape.
> When you write a plugin system, an adapter, or anything that calls code you
> did not write, wrap the call in `Promise.try`.

### Array.fromAsync (2026)

`Array.from` collects an iterable into an array. `Array.fromAsync` does the
same for an async iterable, and awaits each value.

```javascript
async function* pages(total) {
  for (let n = 1; n <= total; n++) {
    yield { page: n };
  }
}

const all = await Array.fromAsync(pages(3));
console.log(all); // [{ page: 1 }, { page: 2 }, { page: 3 }]

// It also awaits an array of promises, one at a time
const settled = await Array.fromAsync([
  Promise.resolve("a"),
  Promise.resolve("b"),
]);
console.log(settled); // ["a", "b"]
```

Note the difference from `Promise.all`: `Array.fromAsync` awaits **in
sequence**. Use `Promise.all` when the work is independent and should overlap,
and `Array.fromAsync` when you are draining a stream or paging an API in order.

**Exercise:** Write a function `delay(ms, value)` that returns a Promise resolving to `value` after `ms` milliseconds. Use it with `Promise.all` to wait for three different delays in parallel.

---

## Lesson 13: async/await

`async` and `await` are syntactic sugar over Promises. They let you write asynchronous code that reads like synchronous code.

> **Background: what does "asynchronous" mean, and why does JavaScript need it?**
>
> JavaScript runs your code on **one thread**. There is no second worker to
> pick up the slack, so anything that waits, a file read, a network request, a
> timer, would freeze everything else if it blocked: in a browser the page
> stops responding to clicks, and on a server nothing else gets served.
>
> So the slow things do not block. They are started, your code carries on, and
> when the result is ready the runtime comes back to the rest of your function.
> That is what **asynchronous** means here: not "in parallel", but "not waiting
> in line".
>
> A **Promise** is the object representing a result that has not arrived yet.
> `await` says "pause this function here until that Promise settles, and let
> everything else run meanwhile". `async` marks a function as one that is
> allowed to pause, and makes it return a Promise itself.

> **Background: if `await` pauses, what resumes it?**
>
> The **event loop**. Your code runs to a stopping point, then the runtime
> checks a queue of things that have become ready, a file that finished
> loading, a timer that expired, a response that arrived, and resumes whatever
> was waiting on each.
>
> Two consequences worth carrying with you. Between an `await` and the line
> after it, **other code has run**, so state you read before may have changed.
> And a slow synchronous loop still blocks everything, because it never gives
> the event loop a turn. `await` helps with waiting, not with work.

**(2026)** The examples in this lesson read from disk rather than from a
network, so that every one of them runs on your machine with nothing installed
and nobody else's server involved. Lesson 14 explains why that is the default
and shows the same shapes over HTTP.

Create `fixtures/practitioners.json`:

```json
[
  { "id": "p1", "name": "T. Nkosi", "profession": "psychologist", "feeCents": 95000 },
  { "id": "p2", "name": "A. Petersen", "profession": "psychiatrist", "feeCents": 180000 },
  { "id": "p3", "name": "M. van Wyk", "profession": "psychologist", "feeCents": 72000 }
]
```

```javascript
import { readFile } from "node:fs/promises";

// A function declared async always returns a Promise
async function loadPractitioners() {
  // await pauses until the Promise resolves
  const url = new URL("./fixtures/practitioners.json", import.meta.url);
  const text = await readFile(url, "utf8");
  return JSON.parse(text);
}

// Calling it returns a Promise
loadPractitioners().then((list) => console.log(list.length)); // 3
```

> **Background: `.then` and `await` are the same thing, written twice.**
>
> `loadPractitioners()` returns a Promise either way. `.then(fn)` says "run
> `fn` when it settles". `await` says "pause here until it settles, then carry
> on with the value".
>
> Use `await` in your own code: it reads top to bottom and the failing line
> appears in the stack trace. You still need to recognise `.then`, because
> library documentation is full of it.
>
> What you must not do is mix them on one call. `await x.then(...)` runs, and
> is a sign that somebody was unsure which of the two they were using.

### try/catch with async/await

Error handling looks like normal synchronous code:

```javascript
import { readFile } from "node:fs/promises";

async function loadFixture(name) {
  try {
    const url = new URL(`./fixtures/${name}.json`, import.meta.url);
    return JSON.parse(await readFile(url, "utf8"));
  } catch (error) {
    // Keep the original. See Lesson 17 on Error cause.
    throw new Error(`Could not load fixture "${name}"`, { cause: error });
  }
}

const missing = await loadFixture("does-not-exist").catch((error) => {
  console.error(error.message);          // Could not load fixture "does-not-exist"
  console.error(error.cause.code);       // ENOENT
  return null;
});
```

### Sequential vs parallel

This is a common mistake. Compare:

```javascript
const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

// Sequential: each await waits for the previous one
async function loadAllSequential() {
  const a = await wait(100, "a"); // wait
  const b = await wait(100, "b"); // wait
  const c = await wait(100, "c"); // wait
  return [a, b, c];
  // Total time: sum of all three, about 300ms
}

// Parallel: start all three, then await
async function loadAllParallel() {
  return await Promise.all([
    wait(100, "a"),
    wait(100, "b"),
    wait(100, "c"),
  ]);
  // Total time: the slowest of the three, about 100ms
}

console.time("sequential");
await loadAllSequential();
console.timeEnd("sequential"); // sequential: ~300ms

console.time("parallel");
await loadAllParallel();
console.timeEnd("parallel");   // parallel: ~100ms
```

Use parallel whenever the operations do not depend on each other.

### Top-level await (in modules)

Inside a module (file with `"type": "module"`), you can use `await` outside of an async function:

```javascript
// This works at the top level of a module file
import { readFile } from "node:fs/promises";

const url = new URL("./fixtures/practitioners.json", import.meta.url);
const practitioners = JSON.parse(await readFile(url, "utf8"));

console.log(practitioners.at(0).name); // "T. Nkosi"
```

Top-level `await` blocks the module's importers until it settles. That is fine
for a script and for reading configuration at startup. It is a poor idea in a
library, where every consumer then pays your latency at import time.

**Exercise:** Convert this Promise chain to use async/await with proper error handling:

```javascript
loadPractitioners()
  .then((list) => list.filter((p) => p.profession === "psychologist"))
  .then((psychologists) => psychologists.length)
  .then((count) => console.log(`Found ${count} psychologists`))
  .catch((error) => console.error(error));
```

---

## Lesson 14: Fetch, HTTP, and Local Fixtures

`fetch` is the built-in way to make HTTP requests. It returns a Promise. It is
the same function in the browser and in Node.

### A rule before the syntax (2026)

**Do not point a learning exercise at somebody else's server.** Earlier
versions of this course used a public placeholder API for every example. That
is a bad habit for three reasons. The endpoint can disappear, and then the
course is broken. It makes your tests depend on a network you do not control,
so a red test tells you nothing. And it sends traffic to a service that never
agreed to host a course.

So: **fixtures on disk by default, a real request only where a real request is
the point.** This is not only a teaching convenience. Both Casey products test
against fixtures for the same reasons, and Casey Legal Tools ships a mock
runner that returns fixture results so every feature can be built and verified
without calling a provider at all.

### Reading a fixture

Create `fixtures/practitioners.json`:

```json
[
  { "id": "p1", "name": "T. Nkosi", "profession": "psychologist", "feeCents": 95000 },
  { "id": "p2", "name": "A. Petersen", "profession": "psychiatrist", "feeCents": 180000 },
  { "id": "p3", "name": "M. van Wyk", "profession": "psychologist", "feeCents": 72000 }
]
```

Two ways to load it. The first reads it at runtime, so the file can change
between runs:

```javascript
import { readFile } from "node:fs/promises";

const text = await readFile(new URL("./fixtures/practitioners.json", import.meta.url), "utf8");
const practitioners = JSON.parse(text);

console.log(practitioners.length); // 3
```

The second imports it as a module, which is faster and checked once at load
time:

```javascript
import practitioners from "./fixtures/practitioners.json" with { type: "json" };
```

> **Background (2026): Why `new URL(..., import.meta.url)`?**
>
> A bare relative path such as `"./fixtures/practitioners.json"` is resolved
> against the **working directory**, which is wherever the user happened to be
> when they typed `node`. `import.meta.url` is the URL of the current module,
> so resolving against it gives you a path relative to the **file**, which is
> what you meant. In CommonJS this was `__dirname`; in modules it is this. Get
> into the habit now, because the bug it prevents only shows up when someone
> runs your script from a different folder.

### GET request

When you do need the network, the shape is this:

```javascript
async function getJSON(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} for ${url}`);
  }

  return await response.json();
}
```

> **Background: Why two awaits?**
>
> The first await (`await fetch(...)`) waits for the HTTP response headers to
> arrive. The second (`await response.json()`) waits for the body to be
> downloaded and parsed as JSON. They are separate steps because in some cases,
> such as streaming a large download, you want to handle them differently.

> **Background (2026): What is `AbortSignal.timeout`?**
>
> `fetch` waits forever by default. A request that never answers will hold your
> process open until something else kills it. `AbortSignal.timeout(5000)`
> aborts after five seconds and rejects with a `TimeoutError`. Always set one
> on a call to a service you do not control. `AbortSignal.any([...])` combines
> a timeout with a user-initiated cancellation.

### POST request

```javascript
async function createBookingRequest(baseUrl, body) {
  const response = await fetch(new URL("/booking-requests", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`HTTP ${response.status}: ${detail}`);
  }

  return await response.json();
}
```

PUT, PATCH and DELETE work the same way. Only `method` changes.

### A real server, on your own machine (2026)

If you want to practise against HTTP without depending on anyone, serve the
fixture yourself. Node has a server built in.

```javascript
// server.js
import { createServer } from "node:http";
import practitioners from "./fixtures/practitioners.json" with { type: "json" };

const server = createServer((request, response) => {
  if (request.method === "GET" && request.url === "/practitioners") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(practitioners));
    return;
  }
  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3100, () => console.log("Fixture server on http://localhost:3100"));
```

Run it with `node --watch server.js` in one terminal and call it from another:

```javascript
const practitioners = await getJSON("http://localhost:3100/practitioners");
console.log(practitioners.at(0).name); // "T. Nkosi"
```

### Handling errors honestly

```javascript
async function safeGetJSON(url) {
  try {
    return { ok: true, data: await getJSON(url) };
  } catch (error) {
    if (error.name === "TimeoutError") {
      return { ok: false, reason: "timeout", detail: `${url} did not answer in time` };
    }
    if (error instanceof TypeError) {
      return { ok: false, reason: "network", detail: error.message };
    }
    return { ok: false, reason: "http", detail: error.message };
  }
}
```

> **Background (2026): Why return a result instead of throwing?**
>
> Both are defensible. The rule that is not defensible is swallowing the error:
> an empty `catch {}` turns a failure into silence, and silence is the hardest
> bug there is. Casey Journals states this as a ground rule ("An empty `catch`
> is a bug. Record the last failure detail somewhere a human can read it") and
> Casey Legal Tools records a `last_error` on every run for the same reason.
> Whichever style you pick, the detail must survive.

**Exercise:** Using the `fixtures/practitioners.json` above, write
`cheapestByProfession(practitioners)` that returns an object mapping each
profession to the name of its cheapest practitioner. Use `Object.groupBy` and
`toSorted`. Then write the same function against the fixture server, fetching
the list over HTTP, and note which of the two you would rather have a test
depend on.

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

### Set operations (2026)

A `Set` now does the arithmetic you would expect of a set. Seven methods, all
of which take any set-like argument and none of which mutate.

```javascript
const assigned = new Set(["walk", "read", "stretch"]);
const doneToday = new Set(["read", "journal"]);

console.log([...assigned.intersection(doneToday)]);  // ["read"]
console.log([...assigned.difference(doneToday)]);    // ["walk", "stretch"]
console.log([...assigned.union(doneToday)]);
// ["walk", "read", "stretch", "journal"]
console.log([...assigned.symmetricDifference(doneToday)]);
// ["walk", "stretch", "journal"]

console.log(assigned.isSubsetOf(doneToday));   // false
console.log(assigned.isSupersetOf(new Set(["walk"])));  // true
console.log(assigned.isDisjointFrom(new Set(["swim"]))); // true
```

> **Background (2026): What is the practical use?**
>
> Permission checks and reconciliation. "Which habits were assigned but not
> done" is `assigned.difference(doneToday)`. "Does this user hold every role
> this page requires" is `userRoles.isSupersetOf(requiredRoles)`. Written with
> arrays and `filter`, both of those are quadratic and easy to get subtly
> wrong. Written with sets, they are one call and linear.
>
> A caution that matters: these are **set** operations, not permission
> decisions. Deciding what a user may see happens on the server, in Firestore
> rules or a row-level security policy. A `Set` in the browser decides what to
> draw. The workbook has a part on exactly this distinction.

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

### Iterator helpers (2026)

Generators and other iterators now carry the same methods arrays have. The
difference is that they are **lazy**: nothing is computed until something pulls
a value, and `take` stops the source.

```javascript
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

const firstFiveSquares = naturals()
  .map((n) => n * n)
  .take(5)
  .toArray();

console.log(firstFiveSquares); // [1, 4, 9, 16, 25]
```

The full set: `map`, `filter`, `take`, `drop`, `flatMap`, `reduce`, `toArray`,
`forEach`, `some`, `every`, `find`.

```javascript
const evens = naturals().filter((n) => n % 2 === 0);
console.log(evens.take(3).toArray()); // [2, 4, 6]

console.log(naturals().drop(10).take(2).toArray()); // [11, 12]
console.log(naturals().find((n) => n % 7 === 0));   // 7
```

They work on anything iterable, not just generators:

```javascript
const scores = new Map([["alex", 100], ["maria", 85], ["jordan", 92]]);

const topName = scores
  .entries()
  .filter(([, score]) => score > 90)
  .map(([name]) => name)
  .toArray();

console.log(topName); // ["alex", "jordan"]
```

> **Background (2026): When is lazy better?**
>
> `naturals().map(...).take(5)` computes five squares. Writing the same thing
> with an array is impossible, because `naturals()` never ends and
> `[...naturals()]` would hang.
>
> For a finite array that already sits in memory, array methods are usually
> faster: they are heavily optimised and involve no iterator protocol. Reach
> for helpers when the source is infinite, expensive, or streamed, and when you
> only want the first few results. Reach for array methods otherwise.

**Exercise:** Write a generator function `fibonacci(limit)` that yields Fibonacci numbers until they exceed `limit`. Iterate it with `for...of`.

---

## Lesson 17: The Smaller 2026 Additions

Four additions that do not need a lesson each, but that you will meet.

### RegExp.escape (2026, needs Node 24)

Building a regular expression out of user input without escaping it is an
injection bug. `RegExp.escape` fixes that.

```javascript
function highlight(text, term) {
  const pattern = new RegExp(RegExp.escape(term), "gi");
  return text.replace(pattern, (match) => `[${match}]`);
}

console.log(highlight("Rate: R1,200.00 per hour", "R1,200.00"));
// "Rate: [R1,200.00] per hour"
```

Without the escape, `"R1,200.00"` would be a pattern in which `.` matches any
character, and a search term such as `"("` would throw a syntax error and take
the request down with it.

> **Background (2026): Is this really a security issue?**
>
> Yes, and it has a name: regular expression denial of service. An attacker who
> can put text into a pattern can craft input that takes exponential time to
> match, and one request then occupies a CPU for minutes. The workbook covers
> the general rule under injection: **data must never become code**. A search
> box that becomes a regular expression, a string that becomes SQL and a
> document that becomes an instruction to a model are the same bug wearing
> three hats.

### Error.isError (2026, needs Node 24)

```javascript
try {
  JSON.parse("{");
} catch (thrown) {
  if (Error.isError(thrown)) {
    console.error(thrown.name, thrown.message);
  } else {
    console.error("Something non-Error was thrown:", thrown);
  }
}
```

`instanceof Error` fails when the error crossed a boundary: a worker thread, a
different realm, a structured clone. `Error.isError` asks what the value
actually is. In a `catch` block, prefer it.

### Error cause

Available since ES2022 and under-used. When you re-throw, keep the original.

```javascript
import { readFile } from "node:fs/promises";

async function loadHabits(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(`Could not load habits from ${path}`, { cause: error });
  }
}
```

The caller sees your message; the log sees the whole chain. Losing the cause is
one of the two ways people destroy a stack trace. The other is the empty
`catch`.

### structuredClone

A deep copy, built in, no library and no `JSON.parse(JSON.stringify(x))`.

```javascript
const original = { name: "Walk", history: new Map([["2026-09-01", true]]) };
const copy = structuredClone(original);

copy.history.set("2026-09-02", true);
console.log(original.history.size); // 1
```

It handles `Map`, `Set`, `Date`, `ArrayBuffer` and cycles, which the JSON trick
does not. It cannot clone functions, DOM nodes or class identity: a clone of a
class instance comes back as a plain object.

**Exercise:** Write `safeSearch(items, term)` that filters a list of objects by
a case-insensitive match on `name`, using `RegExp.escape`. Prove it with the
term `"a.b"` that it matches the literal string `"a.b"` and not `"axb"`.

---

## Lesson 18: Temporal, a Preview (2026)

`Date` has been the worst part of JavaScript since 1995. It is mutable, it
counts months from zero, it parses inconsistently, and it has no concept of a
date without a time or a time without a zone. **Temporal** replaces it.

### Status, honestly

At the time of writing, Temporal is **not on by default in Node 24**. It is
present behind a flag:

```bash
node --harmony-temporal your-script.js
```

Browser support is partial. For production today you still use `Date`, or a
library such as `date-fns` (which is what Mentisflow does: see `date-fns` in
`mentisflow/package.json`). This lesson is a preview so that you recognise
Temporal when it lands and so you understand what problem it solves.

### The types

Temporal splits apart what `Date` conflated.

```javascript
// node --harmony-temporal

const today = Temporal.Now.plainDateISO();
console.log(today.toString()); // "2026-09-06", a date with no time and no zone

const time = Temporal.PlainTime.from("14:00");
const appointment = today.toPlainDateTime(time);
console.log(appointment.toString()); // "2026-09-06T14:00:00"

const inJohannesburg = appointment.toZonedDateTime("Africa/Johannesburg");
console.log(inJohannesburg.toString());
// "2026-09-06T14:00:00+02:00[Africa/Johannesburg]"
```

| Type | What it is | Example |
| --- | --- | --- |
| `Temporal.PlainDate` | A calendar date, no time, no zone | A person's date of birth |
| `Temporal.PlainTime` | A wall-clock time | "The practice opens at 08:00" |
| `Temporal.PlainDateTime` | Both, still no zone | A form's raw input |
| `Temporal.ZonedDateTime` | An exact instant in a named zone | A confirmed appointment |
| `Temporal.Instant` | A point on the timeline, no calendar | A log timestamp |
| `Temporal.Duration` | A length of time | "Fifty minutes" |

### Arithmetic that does not lie

```javascript
const start = Temporal.PlainDate.from("2026-01-31");
console.log(start.add({ months: 1 }).toString()); // "2026-02-28"

const consultation = Temporal.Duration.from({ minutes: 50 });
const ends = Temporal.PlainTime.from("14:00").add(consultation);
console.log(ends.toString()); // "14:50:00"

const a = Temporal.PlainDate.from("2026-09-06");
const b = Temporal.PlainDate.from("2026-12-25");
console.log(a.until(b, { largestUnit: "day" }).days); // 110
```

Every object is immutable. `add` returns a new one, exactly like `toSorted`.

> **Background (2026): Why does this matter for a South African product?**
>
> `Africa/Johannesburg` is UTC+02:00 and does not observe daylight saving, so
> local arithmetic is easy here. The moment a practitioner in Cape Town books a
> patient who is travelling in London, it is not. `ZonedDateTime` carries the
> zone identifier with the instant, so "14:00 in Johannesburg" survives being
> stored, sent and read somewhere else. A `Date` cannot express that: it is an
> instant and nothing more, and the zone is whatever the reading machine
> happens to be set to.
>
> Mentisflow sidesteps the whole problem by formatting every patient-facing
> date through one function, `utils/dateUtils.formatAppointmentWhen`, which
> always renders South African Standard Time and says so: "29 July 2026 14:00
> (SAST)". That is the pattern to copy until Temporal ships: **one formatter,
> one stated zone, never a bare `toLocaleString`**.

### What to do today

```javascript
// Format for South African users, with the zone named.
const formatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Africa/Johannesburg",
});

console.log(formatter.format(new Date("2026-07-29T12:00:00Z")));
// "29 July 2026 at 14:00"
```

Store instants in UTC as ISO 8601 strings. Format at the edge, with an explicit
`timeZone`. Never do date arithmetic by adding milliseconds.

**Exercise:** Write `nextWeekdaySlots(fromISO, count)` returning the next
`count` weekday dates as `YYYY-MM-DD` strings, skipping Saturday and Sunday.
Write it once with `Date` and once with Temporal under `--harmony-temporal`.
Compare the two for length and for how obviously correct each one is.

---

## Capstone Project: A Tools CLI

Mentisflow, the mental health product beside this repository, ships a suite it
calls Tools: a daily check-in, a mood tracker, habits, and a sticky-note task
board. You are going to build a command-line version of the two tools that
carry no clinical data: **habits** and **daily tasks**.

### Why those two, and not mood

Mood entries and check-ins in a mental health product are **health
information**, which South Africa's Protection of Personal Information Act
treats as special personal information under section 26. It attracts extra
duties and it does not belong in a teaching exercise, a fixture file, a test,
or a repository. Habits and tasks in this capstone are deliberately generic:
"Walk for twenty minutes", "File the notice". Nothing in your fixtures should
be a real person's health, identity number, or contact details.

This is the first design constraint of the project, and it is the kind you will
meet constantly in real work: **the interesting question is often what not to
store.**

### Requirements

**Habits.**

- Add a habit with a name, a time of day (`morning`, `midday`, `evening`), and
  a **cue**: the "when X" half of a plan, such as "after I make coffee".
- Tick a habit as done for a given day.
- Show consistency as **days done out of the last 28**, never as a streak.
- Under five days of history, print "Just started" rather than a fraction.
- Group the list by time of day, in the order a day runs. Do not print an empty
  group.

**Tasks.**

- Add a task with a title, a list (`today`, `later`), and an optional due date.
- Tick a task as done. Reopen a done task.
- Roll over: any unfinished task whose scheduled date is today or earlier
  appears under Today.
- Show "n of m done today".

**Both.**

- Persist to `data/tools.json`. Load it on startup. Create it if missing.
- Ship `fixtures/tools.seed.json` so a fresh checkout has something to look at.
- Split the code across modules. No file over about 150 lines.
- No third-party dependencies at all.

### Why "consistency, not streaks"

This requirement is copied from the product, and the reason is on the record in
its `CLAUDE.md`: Lally and colleagues (2010) found that missing a single
opportunity did not materially affect habit formation, so a counter that resets
to zero tells the user something that is not true, and tells it to people who
are already struggling. A habit missed yesterday and not yet done today gets
one gentle nudge, never a red broken-streak graphic.

You are being asked to build the humane version on purpose. Requirements come
from somewhere. Ask where.

### Suggested structure

```
tools-cli/
  package.json
  data/tools.json           (written at runtime, gitignored)
  fixtures/tools.seed.json  (committed)
  src/
    main.js        entry point: parse argv, dispatch
    storage.js     load and save data/tools.json
    habits.js      add, tick, consistency, grouping
    tasks.js       add, tick, reopen, rollover, counts
    format.js      all the printing, including Intl
    dates.js       today(), lastNDays(), isWeekend()
```

### Sample `package.json`

```json
{
  "name": "tools-cli",
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "start": "node src/main.js",
    "dev": "node --watch src/main.js habits list",
    "test": "node --test"
  }
}
```

### Sample `storage.js`

```javascript
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const FILE = fileURLToPath(new URL("../data/tools.json", import.meta.url));

const EMPTY = { habits: [], ticks: [], tasks: [] };

export async function load() {
  try {
    return { ...EMPTY, ...JSON.parse(await readFile(FILE, "utf8")) };
  } catch (error) {
    if (error.code === "ENOENT") return structuredClone(EMPTY);
    throw new Error(`Could not read ${FILE}`, { cause: error });
  }
}

export async function save(state) {
  await mkdir(dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(state, null, 2) + "\n", "utf8");
}
```

Note what this does **not** do: it does not catch every error and return
`EMPTY`. A missing file is expected and handled. A permissions error or a
corrupt file is not, so it is re-thrown with its cause attached. Losing the
difference between "no data yet" and "your data is unreadable" is how people
lose data.

### Parsing arguments (2026)

Use `node:util`'s `parseArgs`. No `commander`, no `yargs`.

```javascript
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    cue: { type: "string" },
    when: { type: "string", default: "morning" },
    due: { type: "string" },
    list: { type: "string", default: "today" },
    json: { type: "boolean", default: false },
  },
});

const [group, command, ...rest] = positionals;
```

### Sample CLI usage

```bash
node src/main.js habits add "Walk for twenty minutes" --when morning --cue "after I make coffee"
node src/main.js habits tick "Walk for twenty minutes"
node src/main.js habits list

node src/main.js tasks add "File the notice" --list today --due 2026-09-10
node src/main.js tasks tick "File the notice"
node src/main.js tasks list
node src/main.js tasks list --json
```

### Expected output

```
Habits

Morning
  [x] Walk for twenty minutes      after I make coffee      Just started
Evening
  [ ] Read ten pages               after supper             19 of 28 days

Tasks · today · 1 of 3 done

  [x] File the notice              due 10 September 2026
  [ ] Renew the licence            due 30 September 2026
  [ ] Ring the printer
```

### Features you must use

Tick these off as you go. Every one is in this course.

- [ ] ES modules with the `node:` prefix on every built-in
- [ ] `Object.groupBy` for grouping habits by time of day
- [ ] `toSorted` and `with` instead of `sort` and index assignment
- [ ] `at(-1)` for the most recent entry
- [ ] `findLast` for the last tick of a habit
- [ ] A `Set` and at least one set operation for done versus assigned
- [ ] Iterator helpers with `take` for the "next up" line
- [ ] `Promise.withResolvers` or `Promise.try` somewhere the shape earns it
- [ ] Optional chaining and `??` for absent fields
- [ ] `structuredClone` rather than a JSON round trip
- [ ] `Intl.DateTimeFormat("en-ZA", ...)` for every date shown
- [ ] `Error` with `cause` on every re-throw
- [ ] An import attribute for the seed fixture
- [ ] `node --test` covering `consistency()` and `rollover()`

### Stretch goals

1. Add `--json` to every list command so the output can be piped.
2. Add a `tools export` command that writes a fixture the tests can read, and a
   `tools import` that reads one back.
3. Write the whole thing so that `data/tools.json` is never partially written:
   write to a temporary file and rename. Explain in a comment why a rename is
   atomic and a write is not.

When you finish you will have used arrow functions, destructuring, modules,
async/await, classes if you want them, `Map` and `Set`, optional chaining,
spread, template literals, and every 2026 addition in this course, on a problem
with a real shape.

---

## Where to Go Next

Once you finish this course, you are ready for the TypeScript course in this
same series. Every concept you learned here will continue to apply: TypeScript
adds types on top of modern JavaScript without changing how the language works.

After TypeScript, take the React with TypeScript course to learn modern
frontend development.

**(2026)** After all three, work through
[`../casey-workbook/workbook.md`](../casey-workbook/workbook.md). The courses
teach the language. The workbook teaches what a professional does with it:
trust boundaries, security standards, data protection engineering, operations,
payments, and building alongside AI coding agents.

### Recommended reading

- "Eloquent JavaScript" by Marijn Haverbeke (free online at eloquentjavascript.net)
- The TC39 proposals list at github.com/tc39/proposals, for what is coming next
- The Node.js API documentation at nodejs.org/api, which is the reference for every `node:` module in this course
- The MDN JavaScript Guide at developer.mozilla.org
- "You Do not Know JS Yet" by Kyle Simpson (free on GitHub)

Good luck.
