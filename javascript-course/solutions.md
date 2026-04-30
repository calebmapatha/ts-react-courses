# Modern JavaScript Course: Exercise Solutions

Working solutions for every exercise in the modern JavaScript course. Each solution includes runnable code and a short note on the approach.

To run any solution, save it to a `.js` file in the project from Lesson 0 and execute it with `node your-file.js`.

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
async function loadUserPostCount(id) {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPostsForUser(user.id);
    console.log(`Found ${posts.length} posts`);
  } catch (err) {
    console.error(err);
  }
}

loadUserPostCount(1);
```

**Note:** The error handling moved from `.catch` into a `try/catch` block. The flow is now linear and reads top to bottom, which is the main benefit of async/await over Promise chains.

---

## Lesson 14: getUserAndPosts

```javascript
async function getUserAndPosts(userId) {
  const userPromise = fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  const postsPromise = fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);

  const [userResponse, postsResponse] = await Promise.all([userPromise, postsPromise]);

  if (!userResponse.ok || !postsResponse.ok) {
    throw new Error("One or more requests failed");
  }

  const [user, posts] = await Promise.all([
    userResponse.json(),
    postsResponse.json(),
  ]);

  return { user, posts };
}

// Test
const { user, posts } = await getUserAndPosts(1);
console.log(`User: ${user.name}`);
console.log(`Posts: ${posts.length}`);
```

**Note:** Starting both fetch calls before awaiting either is what makes this parallel. If we wrote `const userResponse = await fetch(...)` first and then started the posts fetch, the posts request would not begin until after the user request finished.

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

## Capstone: Habit Tracker CLI

A complete reference implementation. Place these files in a project initialized as in Lesson 0.

**`package.json`**

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

**`src/storage.js`**

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

**`src/habits.js`**

```javascript
import { randomUUID } from "crypto";
import { loadHabits, saveHabits } from "./storage.js";

export async function addHabit(name, frequency = "daily") {
  if (!["daily", "weekly"].includes(frequency)) {
    throw new Error(`Invalid frequency: ${frequency}`);
  }

  const habits = await loadHabits();
  const habit = {
    id: randomUUID(),
    name,
    frequency,
    completions: [],
    createdAt: new Date().toISOString(),
  };

  habits.push(habit);
  await saveHabits(habits);
  return habit;
}

export async function completeHabit(name) {
  const habits = await loadHabits();
  const habit = habits.find((h) => h.name === name);
  if (!habit) return null;

  habit.completions.push(new Date().toISOString());
  await saveHabits(habits);
  return habit;
}

export async function listHabits() {
  const habits = await loadHabits();

  // Count completions in the last 7 days
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return habits.map((habit) => {
    const recent = habit.completions.filter(
      (timestamp) => new Date(timestamp).getTime() >= oneWeekAgo,
    );
    return {
      ...habit,
      completionsThisWeek: recent.length,
    };
  });
}

export async function removeHabit(name) {
  const habits = await loadHabits();
  const filtered = habits.filter((h) => h.name !== name);
  if (filtered.length === habits.length) return false;
  await saveHabits(filtered);
  return true;
}
```

**`src/cli.js`**

```javascript
import { addHabit, completeHabit, listHabits, removeHabit } from "./habits.js";

export async function runCommand(args) {
  const [command, ...rest] = args;

  switch (command) {
    case "add": {
      const [name, frequency = "daily"] = rest;
      if (!name) {
        console.error("Usage: add <name> [daily|weekly]");
        return;
      }
      const habit = await addHabit(name, frequency);
      console.log(`Added ${habit.frequency} habit: ${habit.name}`);
      break;
    }

    case "complete": {
      const [name] = rest;
      if (!name) {
        console.error("Usage: complete <name>");
        return;
      }
      const result = await completeHabit(name);
      console.log(result ? `Marked complete: ${name}` : `Habit not found: ${name}`);
      break;
    }

    case "list": {
      const habits = await listHabits();
      if (habits.length === 0) {
        console.log("No habits yet. Add one with: add <name> [daily|weekly]");
        return;
      }
      habits.forEach(({ name, frequency, completionsThisWeek }) => {
        console.log(`- ${name} (${frequency}): ${completionsThisWeek} this week`);
      });
      break;
    }

    case "remove": {
      const [name] = rest;
      if (!name) {
        console.error("Usage: remove <name>");
        return;
      }
      const ok = await removeHabit(name);
      console.log(ok ? `Removed: ${name}` : `Habit not found: ${name}`);
      break;
    }

    default:
      console.log("Commands: add <name> [daily|weekly]");
      console.log("          complete <name>");
      console.log("          list");
      console.log("          remove <name>");
  }
}
```

**`src/main.js`**

```javascript
import { runCommand } from "./cli.js";

const args = process.argv.slice(2);

try {
  await runCommand(args);
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
```

**Sample usage:**

```bash
node src/main.js add "Drink water" daily
node src/main.js add "Go for a run" weekly
node src/main.js complete "Drink water"
node src/main.js list
node src/main.js remove "Drink water"
```

This solution uses every modern JavaScript feature covered in the course: arrow functions, destructuring, default parameters, spread, modules, async/await, optional chaining, template literals, array methods, and nullish coalescing. When you build the same project in TypeScript later, the structure stays the same and types fall into place naturally.
