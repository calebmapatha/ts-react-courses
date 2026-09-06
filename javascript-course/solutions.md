# Modern JavaScript Course: Exercise Solutions

Working solutions for every exercise in the modern JavaScript course. Each
solution includes runnable code and a short note on the approach.

**(2026)** To run any solution, save it to a `.js` file in the project from
Lesson 0 and execute it with `node your-file.js`. Every solution here was run
on **Node 24.20.0** before publication. Solutions marked "needs Node 24" use
`Promise.try`, `RegExp.escape` or `Error.isError`, which Node 22 does not have.

---

## Lesson 1: countDown

```javascript
const countDown = (start) => {
  for (let i = start; i >= 1; i--) {
    console.log(i);
  }
};

countDown(5);
// 5
// 4
// 3
// 2
// 1
```

If you change `let i` to `const i`, you get an error: `Assignment to constant variable`. The loop tries to update `i` each iteration, which `const` forbids.

---

## Lesson 2: formatUser

```javascript
const formatUser = ({ name, email, role }) => `
Name: ${name}
Email: ${email}
Role: ${role}
`;

console.log(formatUser({
  name: "Maria",
  email: "maria@example.com",
  role: "Engineer",
}));
```

**Note:** The leading and trailing newlines come from the template literal preserving whitespace exactly as written. That is often what you want for a printed message.

---

## Lesson 3: Arrow function conversions

```javascript
const isAdult = (person) => person.age >= 18;

const fullName = (user) => `${user.firstName} ${user.lastName}`;

const logCurrentTime = () => console.log(new Date().toISOString());

// Test
console.log(isAdult({ age: 21 }));                            // true
console.log(fullName({ firstName: "Alex", lastName: "Lee" })); // "Alex Lee"
logCurrentTime();
```

**Note:** The single-expression form (no curly braces) implicitly returns. As soon as you need multiple statements, you have to use `{ ... }` and an explicit `return`.

---

## Lesson 4: merge

```javascript
const merge = (...objects) => {
  return objects.reduce((acc, current) => ({ ...acc, ...current }), {});
};

const result = merge(
  { a: 1, b: 2 },
  { b: 3, c: 4 },
  { d: 5 },
);
console.log(result); // { a: 1, b: 3, c: 4, d: 5 }
```

**Note:** The `reduce` walks through every object and spreads it into the accumulator. Later objects override earlier ones because they are spread later. This is a one-line shallow merge.

---

## Lesson 5: Destructuring users

```javascript
const users = [
  { id: 1, name: "Alex", email: "a@x.com", age: 30 },
  { id: 2, name: "Maria", email: "m@x.com", age: 25 },
];

const summaries = users.map(({ name, email }) => ({ name, email }));

console.log(summaries);
// [{ name: "Alex", email: "a@x.com" }, { name: "Maria", email: "m@x.com" }]
```

**Note:** The destructuring happens directly in the callback's parameter list. The arrow function returns an object literal, so the body is wrapped in parentheses to avoid being mistaken for a block.

---

## Lesson 6: groupBy

```javascript
const groupBy = (items, key) => {
  return items.reduce((acc, item) => {
    const groupKey = item[key];
    return {
      ...acc,
      [groupKey]: [...(acc[groupKey] ?? []), item],
    };
  }, {});
};

const items = [
  { type: "fruit", name: "apple" },
  { type: "veg", name: "carrot" },
  { type: "fruit", name: "banana" },
];

console.log(groupBy(items, "type"));
// {
//   fruit: [{ type: "fruit", name: "apple" }, { type: "fruit", name: "banana" }],
//   veg: [{ type: "veg", name: "carrot" }]
// }
```

**Note:** The computed key `[groupKey]` lets us use the value of `item[key]` as the property name. The nullish coalescing handles the case where this is the first item in a group.

---

## Lesson 7: Chained array methods

```javascript
const orders = [
  { item: "book", price: 20, qty: 2 },
  { item: "pen", price: 3, qty: 5 },
  { item: "lamp", price: 50, qty: 1 },
];

const expensiveItems = orders
  .filter((o) => o.price * o.qty > 30)
  .map((o) => o.item);

console.log(expensiveItems); // ["book", "lamp"]
```

**Note:** Book total is 40, pen total is 15, lamp total is 50. Only book and lamp exceed 30.

---

## Lesson 8: pick

```javascript
const pick = (obj, keys) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key)),
  );
};

console.log(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])); // { a: 1, c: 3 }
console.log(pick({ x: 10, y: 20, z: 30 }, ["y"]));   // { y: 20 }
```

**Alternative using reduce:**

```javascript
const pick2 = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
};
```

Both are valid. The first reads more declaratively, the second is slightly faster for large objects.

---

## Lesson 9: Optional chaining for cities

```javascript
const users = [
  { name: "Alex", address: { city: "Cape Town" } },
  { name: "Maria" },
  { name: "Jordan", address: {} },
];

users.forEach((user) => {
  const city = user?.address?.city ?? "Unknown";
  console.log(`${user.name}: ${city}`);
});

// Alex: Cape Town
// Maria: Unknown
// Jordan: Unknown
```

**Note:** The optional chain `user?.address?.city` short-circuits to `undefined` if any link is null or missing. The nullish coalescing then provides the fallback.

---

## Lesson 10: Queue class

```javascript
class Queue {
  #items = [];

  enqueue(item) {
    this.#items.push(item);
  }

  dequeue() {
    return this.#items.shift();
  }

  peek() {
    return this.#items[0];
  }

  size() {
    return this.#items.length;
  }

  isEmpty() {
    return this.#items.length === 0;
  }
}

// Test
const queue = new Queue();
queue.enqueue("first");
queue.enqueue("second");
queue.enqueue("third");

console.log(queue.peek());     // "first"
console.log(queue.size());     // 3
console.log(queue.dequeue());  // "first"
console.log(queue.size());     // 2
```

**Note:** A queue is FIFO (first in, first out), unlike a stack which is LIFO. We add to the end with `push` and remove from the front with `shift`.

---

## Lesson 11: Modules split

**`math.js`**

```javascript
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

**`string.js`**

```javascript
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const reverse = (s) => [...s].reverse().join("");
```

**`index.js`**

```javascript
export * from "./math.js";
export * from "./string.js";
```

**`main.js`**

```javascript
import { add, subtract, capitalize, reverse } from "./index.js";

console.log(add(2, 3));            // 5
console.log(subtract(10, 4));      // 6
console.log(capitalize("hello"));  // "Hello"
console.log(reverse("abcdef"));    // "fedcba"
```

Run with `node main.js`.

---

## Lesson 12: delay and Promise.all

```javascript
const delay = (ms, value) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
};

const start = Date.now();

const results = await Promise.all([
  delay(500, "first"),
  delay(1000, "second"),
  delay(750, "third"),
]);

const elapsed = Date.now() - start;

console.log(results);          // ["first", "second", "third"]
console.log(`Took ${elapsed}ms`); // Roughly 1000ms (the slowest)
```

**Note:** Even though the three delays add up to 2250ms total, `Promise.all` runs them in parallel, so the total time is the duration of the slowest one. If we awaited them one by one in series instead, the total would be the sum.

---

## Lesson 13: Promise chain to async/await

```javascript
import { readFile } from "node:fs/promises";

async function loadPractitioners() {
  const url = new URL("./fixtures/practitioners.json", import.meta.url);
  return JSON.parse(await readFile(url, "utf8"));
}

async function countPsychologists() {
  try {
    const list = await loadPractitioners();
    const count = list.filter((p) => p.profession === "psychologist").length;
    console.log(`Found ${count} psychologists`);
    return count;
  } catch (error) {
    console.error("Could not count psychologists:", error.message);
    if (error.cause) console.error("  caused by:", error.cause.message);
    return 0;
  }
}

await countPsychologists(); // Found 2 psychologists
```

**Note:** Each `.then` becomes an `await` and the whole chain goes inside one
`try`. That is the point of the rewrite: with a chain, an error in step two is
caught by a `.catch` bolted onto the end and you cannot easily tell which step
failed. With `await`, the failing line is in the stack trace.

**(2026)** Note also what the `catch` does **not** do. It does not swallow the
error. It logs the message and the `cause`, and it returns a value the caller
can act on. An empty `catch {}` would have turned a missing fixture into a
count of zero, which is a lie the caller cannot detect.

---

## Lesson 14: cheapestByProfession

```javascript
import practitioners from "./fixtures/practitioners.json" with { type: "json" };

function cheapestByProfession(list) {
  const grouped = Object.groupBy(list, (p) => p.profession);

  return Object.fromEntries(
    Object.entries(grouped).map(([profession, people]) => [
      profession,
      people.toSorted((a, b) => a.feeCents - b.feeCents).at(0).name,
    ]),
  );
}

console.log(cheapestByProfession(practitioners));
// { psychologist: "M. van Wyk", psychiatrist: "A. Petersen" }
```

**Note:** `toSorted` rather than `sort`, because `sort` would reorder the array
inside `grouped`, which is a view onto the imported fixture. A JSON import is
shared across every module that imports it, so mutating it is a bug that
appears somewhere else entirely.

The same function over HTTP:

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

const overHttp = cheapestByProfession(
  await getJSON("http://localhost:3100/practitioners"),
);
console.log(overHttp);
```

**Which would you rather a test depend on?** The first. The second needs a
server running on port 3100, which means a test that fails tells you nothing
about `cheapestByProfession`: it might be the function, the server, the port,
or the network. Keep the network out of the tests for your own logic, and test
the network separately, where a failure means what it says.

---

## Lesson 15: Order counting with Map

```javascript
const orders = [
  { customerId: 1, total: 99 },
  { customerId: 2, total: 50 },
  { customerId: 1, total: 25 },
  { customerId: 3, total: 75 },
  { customerId: 1, total: 10 },
  { customerId: 2, total: 30 },
];

const counts = new Map();

for (const { customerId } of orders) {
  counts.set(customerId, (counts.get(customerId) ?? 0) + 1);
}

console.log(counts);
// Map(3) { 1 => 3, 2 => 2, 3 => 1 }

// Convert to plain object if needed
console.log(Object.fromEntries(counts));
// { "1": 3, "2": 2, "3": 1 }
```

**Note:** Using `??` instead of `||` is important here because zero is a meaningful count. Although in this case the value is `undefined` for first encounters so both would work, building the habit of `??` for nullish defaults pays off.

---

## Lesson 16: Fibonacci generator

```javascript
function* fibonacci(limit) {
  let a = 0;
  let b = 1;

  while (a <= limit) {
    yield a;
    [a, b] = [b, a + b];
  }
}

for (const n of fibonacci(100)) {
  console.log(n);
}
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
```

**Note:** The destructuring swap `[a, b] = [b, a + b]` updates both variables atomically. Without it, you would need a temporary variable. The generator pauses at each `yield`, then resumes when the consumer asks for the next value.

---

## Lesson 17: safeSearch (2026, needs Node 24)

```javascript
function safeSearch(items, term) {
  if (term === "") return items;
  const pattern = new RegExp(RegExp.escape(term), "i");
  return items.filter((item) => pattern.test(item.name));
}

const items = [
  { name: "a.b" },
  { name: "axb" },
  { name: "Contract (draft)" },
];

console.log(safeSearch(items, "a.b"));  // [ { name: "a.b" } ]
console.log(safeSearch(items, "("));    // [ { name: "Contract (draft)" } ]
```

**Note:** Without `RegExp.escape`, the term `"a.b"` becomes the pattern `a.b`,
in which `.` matches any character, so `"axb"` matches too. The term `"("`
becomes an unterminated group and `new RegExp` throws, which in a web handler
is a 500 caused by somebody typing a bracket into a search box.

**A simpler answer exists.** If you only need a case-insensitive substring
match, do not build a regular expression at all:

```javascript
const safeSearch = (items, term) =>
  items.filter((item) => item.name.toLowerCase().includes(term.toLowerCase()));
```

That is the better solution for this problem. `RegExp.escape` is for when you
genuinely need a pattern and part of it comes from outside. The general rule,
which the workbook develops under injection, is that **data must never become
code**, and the safest way to obey it is usually to avoid the code path
entirely.

---

## Lesson 18: nextWeekdaySlots (2026)

**With `Date`:**

```javascript
function nextWeekdaySlots(fromISO, count) {
  const slots = [];
  const cursor = new Date(`${fromISO}T00:00:00Z`);

  while (slots.length < count) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const weekday = cursor.getUTCDay(); // 0 Sunday, 6 Saturday
    if (weekday !== 0 && weekday !== 6) {
      slots.push(cursor.toISOString().slice(0, 10));
    }
  }
  return slots;
}

console.log(nextWeekdaySlots("2026-09-04", 3));
// [ "2026-09-07", "2026-09-08", "2026-09-09" ]
```

**With Temporal** (run with `node --harmony-temporal`):

```javascript
function nextWeekdaySlots(fromISO, count) {
  const slots = [];
  let cursor = Temporal.PlainDate.from(fromISO);

  while (slots.length < count) {
    cursor = cursor.add({ days: 1 });
    if (cursor.dayOfWeek <= 5) {       // 1 Monday ... 7 Sunday
      slots.push(cursor.toString());
    }
  }
  return slots;
}

console.log(nextWeekdaySlots("2026-09-04", 3));
// [ "2026-09-07", "2026-09-08", "2026-09-09" ]
```

**Note:** The Temporal version is two lines shorter, but length is not the
argument. Look at what each one has to be careful about.

The `Date` version must use the UTC accessors throughout. If you write
`setDate`, `getDay` and `toISOString` in the same function, you are mixing
local time with UTC, and the result is correct in Johannesburg and wrong in
Auckland. It also mutates `cursor` in place, so the loop only works because
nothing else holds a reference to it.

The Temporal version has no zone to mix up, because a `PlainDate` has no zone.
`add` returns a new date rather than mutating. And `dayOfWeek` counts from
Monday as ISO 8601 does, so "weekday" is `<= 5` rather than two separate
comparisons against zero and six.

**(2026)** Temporal is still behind a flag in Node 24. Until it ships, the
`Date` version is what you write, and the discipline is: **UTC accessors
everywhere, format only at the edge, and one `Intl` formatter with an explicit
`timeZone`.**

---

## Capstone: A Tools CLI

A complete reference implementation, run and tested on Node 24.20.0. Twelve
`node:test` cases pass; they are at the end of this section.

Nothing here is a health record. The tools modelled are habits and daily tasks,
which are the two parts of the product's Tools suite that carry no clinical
data. Mood and check-in entries are health information under section 26 of the
Protection of Personal Information Act, and they are deliberately absent from
the fixtures, the store and the tests.

**`package.json`**

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

**`fixtures/tools.seed.json`**

```json
{
  "habits": [
    { "id": "h1", "name": "Walk for twenty minutes", "when": "morning", "cue": "after I make coffee", "createdAt": "2026-08-10" },
    { "id": "h2", "name": "Read ten pages", "when": "evening", "cue": "after supper", "createdAt": "2026-07-01" }
  ],
  "ticks": [
    { "habitId": "h1", "day": "2026-09-06" },
    { "habitId": "h2", "day": "2026-09-05" },
    { "habitId": "h2", "day": "2026-09-04" }
  ],
  "tasks": [
    { "id": "t1", "title": "File the notice", "list": "today", "due": "2026-09-10", "doneOn": "2026-09-06" },
    { "id": "t2", "title": "Renew the licence", "list": "today", "due": "2026-09-30", "doneOn": null },
    { "id": "t3", "title": "Ring the printer", "list": "today", "due": null, "doneOn": null }
  ]
}
```

**`src/dates.js`**

```javascript
// Every date in this project is an ISO calendar day, "YYYY-MM-DD", in South
// African Standard Time. There is no time-of-day anywhere, so there is no
// timezone arithmetic to get wrong.

const ZONE = "Africa/Johannesburg";

const isoParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Today in Johannesburg, as "YYYY-MM-DD". */
export function today(now = new Date()) {
  return isoParts.format(now);
}

/** The `count` most recent days ending today, newest first. */
export function lastNDays(count, from = today()) {
  const days = [];
  const base = new Date(`${from}T00:00:00Z`);
  for (let i = 0; i < count; i++) {
    const day = new Date(base);
    day.setUTCDate(day.getUTCDate() - i);
    days.push(day.toISOString().slice(0, 10));
  }
  return days;
}

const longDate = new Intl.DateTimeFormat("en-ZA", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** "2026-09-10" becomes "10 September 2026". */
export function formatDay(iso) {
  return longDate.format(new Date(`${iso}T00:00:00Z`));
}
```

**Note:** One formatter, one stated zone, defined once. `en-CA` is used for the
ISO shape because that locale formats as `YYYY-MM-DD`; `en-ZA` is used for
anything a person reads. Never build a date string by hand out of
`getFullYear()` and friends.

**`src/storage.js`**

```javascript
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import seed from "../fixtures/tools.seed.json" with { type: "json" };

const FILE = fileURLToPath(new URL("../data/tools.json", import.meta.url));

const EMPTY = { habits: [], ticks: [], tasks: [] };

/**
 * Read the store. A missing file is the expected first run and seeds from the
 * fixture. Anything else is re-thrown with its cause: losing the difference
 * between "no data yet" and "your data is unreadable" is how people lose data.
 */
export async function load() {
  try {
    return { ...EMPTY, ...JSON.parse(await readFile(FILE, "utf8")) };
  } catch (error) {
    if (error.code === "ENOENT") return structuredClone(seed);
    throw new Error(`Could not read ${FILE}`, { cause: error });
  }
}

/**
 * Write the store atomically. A partial write leaves unparseable JSON on disk;
 * a rename inside one filesystem is a single directory operation, so a reader
 * sees either the old file or the new one and never half of either.
 */
export async function save(state) {
  await mkdir(dirname(FILE), { recursive: true });
  const temporary = `${FILE}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(state, null, 2) + "\n", "utf8");
  await rename(temporary, FILE);
}
```

**Note on the atomic write:** `writeFile` can be interrupted, and an
interrupted write leaves half a JSON document on disk, which the next `load`
cannot parse. Writing to a temporary file and then renaming makes the swap a
single directory operation, so a reader sees the old file or the new one and
never half of either. This is stretch goal three, and it is three lines.

**`src/habits.js`**

```javascript
import { randomUUID } from "node:crypto";
import { today, lastNDays } from "./dates.js";

export const TIMES_OF_DAY = ["morning", "midday", "evening"];

const MIN_HISTORY_DAYS = 5;
const WINDOW_DAYS = 28;

export function addHabit(state, { name, when = "morning", cue = "" }) {
  if (!TIMES_OF_DAY.includes(when)) {
    throw new Error(`Unknown time of day "${when}". Use one of: ${TIMES_OF_DAY.join(", ")}.`);
  }
  const habit = { id: randomUUID(), name, when, cue, createdAt: today() };
  return { ...state, habits: [...state.habits, habit] };
}

export function findHabit(state, name) {
  const wanted = name.toLowerCase();
  return state.habits.find((h) => h.name.toLowerCase() === wanted);
}

/** Ticking is idempotent: one habit, one day, one tick. */
export function tickHabit(state, name, day = today()) {
  const habit = findHabit(state, name);
  if (!habit) throw new Error(`No habit called "${name}".`);
  const already = state.ticks.some((t) => t.habitId === habit.id && t.day === day);
  if (already) return state;
  return { ...state, ticks: [...state.ticks, { habitId: habit.id, day }] };
}

/**
 * Consistency over a rolling 28 days, never a streak. Missing one day does not
 * materially affect habit formation (Lally et al., 2010), so a counter that
 * resets to zero tells the user something untrue, and tells it to somebody who
 * is already struggling.
 */
export function consistency(state, habit, day = today()) {
  const window = new Set(lastNDays(WINDOW_DAYS, day));
  const daysDone = new Set(
    state.ticks.filter((t) => t.habitId === habit.id).map((t) => t.day),
  );
  const hits = daysDone.intersection(window);

  const age = lastNDays(WINDOW_DAYS, day).filter((d) => d >= habit.createdAt).length;
  if (age < MIN_HISTORY_DAYS) {
    return { started: false, hits: hits.size, of: WINDOW_DAYS, label: "Just started" };
  }
  return { started: true, hits: hits.size, of: WINDOW_DAYS, label: `${hits.size} of ${WINDOW_DAYS} days` };
}

export function isDoneOn(state, habit, day = today()) {
  return state.ticks.some((t) => t.habitId === habit.id && t.day === day);
}

/**
 * One gentle nudge when a habit was missed yesterday and is not done today.
 * Never red, never a broken-streak graphic.
 */
export function needsNudge(state, habit, day = today()) {
  const [current, previous] = lastNDays(2, day);
  return !isDoneOn(state, habit, current) && !isDoneOn(state, habit, previous);
}

/** Grouped by time of day, in the order a day runs. Empty groups are dropped. */
export function groupByTimeOfDay(habits) {
  const grouped = Object.groupBy(habits, (h) => h.when);
  return TIMES_OF_DAY
    .map((when) => [when, grouped[when] ?? []])
    .filter(([, list]) => list.length > 0);
}

/** The next habit not yet done today, in day order. Lazy: it stops at the first. */
export function nextUp(state, day = today()) {
  return groupByTimeOfDay(state.habits)
    .values()
    .flatMap(([, list]) => list)
    .filter((habit) => !isDoneOn(state, habit, day))
    .take(1)
    .toArray()
    .at(0);
}
```

**Note on `consistency`:** the intersection of "days this habit was ticked" and
"the last 28 days" is one call, `daysDone.intersection(window)`, because both
are `Set`s. Written with arrays and `filter`, it is a nested loop.

**Note on `nextUp`:** the chain uses iterator helpers and ends in `take(1)`, so
it stops at the first habit that is not done. On a list of five habits that
saves nothing measurable. It is written this way because it is the shape that
keeps working when the list is long or the source is a stream, and because the
alternative, `.flat().find(...)`, builds an intermediate array to throw away.

**`src/tasks.js`**

```javascript
import { randomUUID } from "node:crypto";
import { today } from "./dates.js";

export const LISTS = ["today", "later"];

export function addTask(state, { title, list = "today", due = null }) {
  if (!LISTS.includes(list)) {
    throw new Error(`Unknown list "${list}". Use one of: ${LISTS.join(", ")}.`);
  }
  const task = { id: randomUUID(), title, list, due, doneOn: null };
  return { ...state, tasks: [...state.tasks, task] };
}

function replaceTask(state, index, next) {
  return { ...state, tasks: state.tasks.with(index, next) };
}

export function tickTask(state, title, day = today()) {
  const index = state.tasks.findIndex((t) => t.title.toLowerCase() === title.toLowerCase());
  if (index === -1) throw new Error(`No task called "${title}".`);
  return replaceTask(state, index, { ...state.tasks[index], doneOn: day });
}

export function reopenTask(state, title) {
  const index = state.tasks.findLastIndex((t) => t.title.toLowerCase() === title.toLowerCase());
  if (index === -1) throw new Error(`No task called "${title}".`);
  return replaceTask(state, index, { ...state.tasks[index], doneOn: null });
}

/**
 * Roll over: an unfinished task whose due date is today or earlier belongs
 * under Today, whatever list it was parked in. It never falls silently into
 * the backlog.
 */
export function rollover(tasks, day = today()) {
  return tasks.map((task) => {
    const overdue = task.doneOn === null && task.due !== null && task.due <= day;
    return overdue ? { ...task, list: "today" } : task;
  });
}

export function forList(state, list, day = today()) {
  return rollover(state.tasks, day)
    .filter((task) => task.list === list)
    .toSorted((a, b) => (a.due ?? "9999-99-99").localeCompare(b.due ?? "9999-99-99"));
}

export function counts(tasks, day = today()) {
  const done = tasks.filter((t) => t.doneOn === day).length;
  return { done, of: tasks.length };
}
```

**Note:** every function returns a new state. `with` replaces one element,
`toSorted` orders without mutating, and spread rebuilds the object. This is not
ceremony: `rollover` is called on every render, and a version that mutated
would gradually rewrite the stored `list` field of every overdue task, which is
not what "show it under Today" means.

**`src/format.js`**

```javascript
import { formatDay } from "./dates.js";
import { consistency, groupByTimeOfDay, isDoneOn, needsNudge } from "./habits.js";
import { counts } from "./tasks.js";

const box = (done) => (done ? "[x]" : "[ ]");
const pad = (text, width) => text.padEnd(width, " ");

export function renderHabits(state, day) {
  const lines = ["Habits", ""];
  for (const [when, habits] of groupByTimeOfDay(state.habits)) {
    lines.push(when.at(0).toUpperCase() + when.slice(1));
    for (const habit of habits) {
      const done = isDoneOn(state, habit, day);
      lines.push(
        `  ${box(done)} ${pad(habit.name, 30)} ${pad(habit.cue, 24)} ${consistency(state, habit, day).label}`.trimEnd(),
      );
      if (needsNudge(state, habit, day)) {
        lines.push(`      Missed yesterday. Doing it today is the whole trick.`);
      }
    }
  }
  if (state.habits.length === 0) lines.push("  Nothing yet. Add one with: habits add \"name\"");
  return lines.join("\n");
}

export function renderTasks(tasks, list, day) {
  const { done, of } = counts(tasks, day);
  const lines = [`Tasks · ${list} · ${done} of ${of} done`, ""];
  for (const task of tasks) {
    const due = task.due === null ? "" : `due ${formatDay(task.due)}`;
    lines.push(`  ${box(task.doneOn !== null)} ${pad(task.title, 30)} ${due}`.trimEnd());
  }
  if (tasks.length === 0) lines.push("  Nothing on this list.");
  return lines.join("\n");
}
```

**Note:** all printing lives here and nowhere else. Every module above returns
data. That separation is what makes `--json` a four-line change rather than a
rewrite, and it is why the tests never have to parse output.

**`src/main.js`**

```javascript
import { parseArgs } from "node:util";
import { load, save } from "./storage.js";
import { today } from "./dates.js";
import { addHabit, tickHabit, nextUp } from "./habits.js";
import { addTask, tickTask, reopenTask, forList } from "./tasks.js";
import { renderHabits, renderTasks } from "./format.js";

const USAGE = `Usage:
  habits add <name> [--when morning|midday|evening] [--cue "after I ..."]
  habits tick <name>
  habits list
  tasks  add <title> [--list today|later] [--due YYYY-MM-DD]
  tasks  tick <title>
  tasks  reopen <title>
  tasks  list [--list today|later] [--json]`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    cue: { type: "string", default: "" },
    when: { type: "string", default: "morning" },
    due: { type: "string" },
    list: { type: "string", default: "today" },
    json: { type: "boolean", default: false },
  },
});

const [group, command, ...rest] = positionals;
const subject = rest.join(" ");
const day = today();

const handlers = {
  "habits add": (state) => addHabit(state, { name: subject, when: values.when, cue: values.cue }),
  "habits tick": (state) => tickHabit(state, subject, day),
  "tasks add": (state) => addTask(state, { title: subject, list: values.list, due: values.due ?? null }),
  "tasks tick": (state) => tickTask(state, subject, day),
  "tasks reopen": (state) => reopenTask(state, subject),
};

async function main() {
  const key = `${group} ${command}`;
  const state = await load();

  if (key === "habits list") {
    console.log(renderHabits(state, day));
    const next = nextUp(state, day);
    if (next) console.log(`\nNext up: ${next.name}`);
    return 0;
  }

  if (key === "tasks list") {
    const tasks = forList(state, values.list, day);
    if (values.json) {
      console.log(JSON.stringify(tasks, null, 2));
      return 0;
    }
    console.log(renderTasks(tasks, values.list, day));
    return 0;
  }

  const handler = handlers[key];
  if (!handler) {
    console.error(USAGE);
    return 2;
  }
  if (subject === "") {
    console.error(`"${key}" needs a name. \n\n${USAGE}`);
    return 2;
  }

  await save(handler(state));
  console.log(`Done: ${key} "${subject}"`);
  return 0;
}

process.exitCode = await main().catch((error) => {
  console.error(error.message);
  if (error.cause) console.error("  caused by:", error.cause.message);
  return 1;
});
```

**Note on `parseArgs`:** it is in `node:util` and it handles `--flag value`,
`--flag=value`, booleans and positionals. For a CLI of this size you do not
need `commander` or `yargs`. One fewer dependency is one fewer thing that can
be compromised in a supply chain attack, which is a point the workbook makes at
length.

**Note on `process.exitCode`:** setting it rather than calling `process.exit()`
lets pending output flush. `process.exit()` in the middle of a write truncates
it, which produces the maddening bug where a script works when piped to a
terminal and loses its last line when piped to a file.

### The tests

**`test/habits.test.js`**

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { consistency, groupByTimeOfDay, needsNudge } from "../src/habits.js";

const habit = { id: "h1", name: "Walk", when: "morning", cue: "", createdAt: "2026-01-01" };

function stateWithTicks(days) {
  return { habits: [habit], ticks: days.map((day) => ({ habitId: "h1", day })), tasks: [] };
}

test("consistency counts days inside the 28-day window", () => {
  const state = stateWithTicks(["2026-09-06", "2026-09-05", "2026-08-01"]);
  const result = consistency(state, habit, "2026-09-06");
  assert.equal(result.hits, 2, "2026-08-01 is outside the window");
  assert.equal(result.label, "2 of 28 days");
});

test("a habit younger than five days says Just started", () => {
  const fresh = { ...habit, createdAt: "2026-09-04" };
  const state = { habits: [fresh], ticks: [{ habitId: "h1", day: "2026-09-06" }], tasks: [] };
  assert.equal(consistency(state, fresh, "2026-09-06").label, "Just started");
});

test("consistency never resets to zero after one miss", () => {
  const state = stateWithTicks(["2026-09-04", "2026-09-03", "2026-09-02"]);
  assert.equal(consistency(state, habit, "2026-09-06").hits, 3);
});

test("the nudge fires only after two missed days", () => {
  const yesterdayDone = stateWithTicks(["2026-09-05"]);
  assert.equal(needsNudge(yesterdayDone, habit, "2026-09-06"), false);

  const bothMissed = stateWithTicks(["2026-09-01"]);
  assert.equal(needsNudge(bothMissed, habit, "2026-09-06"), true);
});

test("grouping drops empty times of day and keeps day order", () => {
  const habits = [
    { id: "a", name: "A", when: "evening", cue: "", createdAt: "2026-01-01" },
    { id: "b", name: "B", when: "morning", cue: "", createdAt: "2026-01-01" },
  ];
  assert.deepEqual(groupByTimeOfDay(habits).map(([when]) => when), ["morning", "evening"]);
});
```

**`test/tasks.test.js`**

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { rollover, counts, tickTask, reopenTask } from "../src/tasks.js";

const tasks = [
  { id: "t1", title: "Overdue", list: "later", due: "2026-09-01", doneOn: null },
  { id: "t2", title: "Future", list: "later", due: "2026-12-01", doneOn: null },
  { id: "t3", title: "Done and overdue", list: "later", due: "2026-09-01", doneOn: "2026-09-02" },
];

test("an unfinished overdue task rolls into today", () => {
  const rolled = rollover(tasks, "2026-09-06");
  assert.equal(rolled.find((t) => t.id === "t1").list, "today");
});

test("a future task stays where it is", () => {
  assert.equal(rollover(tasks, "2026-09-06").find((t) => t.id === "t2").list, "later");
});

test("a finished task never rolls over", () => {
  assert.equal(rollover(tasks, "2026-09-06").find((t) => t.id === "t3").list, "later");
});

test("rollover does not mutate its input", () => {
  rollover(tasks, "2026-09-06");
  assert.equal(tasks[0].list, "later");
});

test("counts reports what was finished today, not in total", () => {
  assert.deepEqual(counts(tasks, "2026-09-02"), { done: 1, of: 3 });
  assert.deepEqual(counts(tasks, "2026-09-06"), { done: 0, of: 3 });
});

test("ticking then reopening returns the original task", () => {
  const state = { habits: [], ticks: [], tasks };
  const ticked = tickTask(state, "Overdue", "2026-09-06");
  assert.equal(ticked.tasks[0].doneOn, "2026-09-06");
  assert.equal(reopenTask(ticked, "Overdue").tasks[0].doneOn, null);
});

test("an unknown title is an error, not a silent no-op", () => {
  const state = { habits: [], ticks: [], tasks };
  assert.throws(() => tickTask(state, "Nope"), /No task called "Nope"/);
});
```

Run them:

```bash
node --test
```

```
ℹ tests 12
ℹ pass 12
ℹ fail 0
```

**Note on what is tested:** the two functions with real logic, `consistency`
and `rollover`, plus the error paths. Nothing tests `format.js`, because
asserting on the exact spacing of output is a test that fails every time
somebody adjusts a column and never fails when the logic is wrong. Test what
can be wrong in an interesting way.

Note especially the test named "consistency never resets to zero after one
miss". That test is the requirement. If somebody later "fixes" `consistency`
into a streak counter, that test goes red and the review conversation happens.
A rule that matters should have a test with its name on it.

---

## Where the exercises came from

The habit rules in this capstone are copied from a real product's rules file,
including the citation for why streaks were rejected. When you meet a
requirement that seems oddly specific, it usually is: somebody decided it, for
a reason, on a date. Finding out which is part of the job.
