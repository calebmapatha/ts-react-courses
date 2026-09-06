# React with TypeScript: A Practical Course

Revised for 2026. A follow-on course for developers who completed the
TypeScript fundamentals course. By the end you will be able to build, type,
test, and ship a real React application, on either of the two stacks the Casey
products actually run. Total time: roughly 18 to 24 hours with exercises.

This course assumes you have completed the TypeScript course in this series and
are comfortable with modern JavaScript. It does not assume prior React
experience, but a passing familiarity helps.

Material added or changed in the 2026 revision is marked **(2026)**.

**Baseline (2026):** React 19.2, TypeScript 5.9 (see the note in Lesson 0 on
why this course pins 5.9 and not 7), and one of two toolchains:

| Path | Stack | Which product runs it | Where it appears here |
| --- | --- | --- | --- |
| **Next.js** | Next.js 16.3, App Router, Server Components | Casey Journals (`apps/web/package.json`) | Lesson 16, and the capstone |
| **Vite** | Vite 8, React Router 7, Vitest 4 | Mentisflow (`mentisflow/package.json`) | Lessons 0 to 15, and Lesson 12 |

Both paths are here because both are real. Lessons 1 to 15 are the same on
either: components, hooks, forms, patterns and tests do not change. Lesson 16
is the Next.js path. Lesson 12 is the Vite path's routing. Read both; build the
capstone on Next.js.

The full version table is in `STACK.md` at the root of this repository.

---

## Lesson 0: Setup

### What is React?

React is a JavaScript library, created by Meta, for building user interfaces.
You describe what your interface should look like for a given state, and React
works out how to update the page when the state changes. It is the most widely
used UI library in the industry.

> **Background: What is a "library" versus a "framework"?**
>
> A library is a collection of code you call into when you need it. A framework
> calls into your code: it owns the application's structure and you fill in the
> parts. React is technically a library because it focuses on rendering. Next.js
> is a framework built on React that provides routing, server rendering and
> project structure.

> **Background: What is the DOM?**
>
> DOM stands for Document Object Model. It is the in-memory structure the
> browser uses to represent the page. When you write HTML, the browser parses it
> into a DOM tree. JavaScript can read and modify that tree, and the browser
> updates the screen. React abstracts away most direct DOM manipulation.

### Which path should I set up? (2026)

Both, eventually. Start with whichever matches what you are working on.

**Vite**, for a single-page application that talks to a backend you did not
write. Mentisflow is exactly this: React 19 on Vite 8, talking to Firebase,
wrapped in a Capacitor shell for the app stores.

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev          # http://localhost:5173
```

**Next.js**, for anything that needs server rendering: a public site that lives
on search and share previews, a paywall that must be enforced before the HTML
is written, or security headers. Casey Journals is exactly this.

```bash
npx create-next-app@latest my-app --typescript --app --no-src-dir
cd my-app
npm run dev          # http://localhost:3000
```

> **Background (2026): How do I choose, rather than guess?**
>
> Ask one question: **does anything have to be decided before the HTML is
> written?**
>
> If a paywall must withhold text, if a page must be indexable, if a
> Content-Security-Policy header must be set, if an OpenGraph image must be
> generated, then something must run on a server for each request and Next.js
> gives you that as a first-class thing.
>
> If the app is behind a login, renders nothing a crawler cares about, and
> talks to a backend that already enforces its own rules, a Vite single-page
> app is simpler and there is no server to operate. Casey Journals wrote its
> reasoning down: its predecessor was a Vite app that "needed an edge function
> just to render OG images and could not set security headers".

### What is Vite?

Vite is a build tool: a fast development server, a production bundler, and
TypeScript support with no configuration. It replaced Create React App as the
default React starter.

**(2026)** Vite 8 bundles with **Rolldown**, a Rust bundler, in place of
Rollup. For course purposes nothing changes; builds are faster.

> **Background: Why does React need a build tool at all?**
>
> React code uses two things browsers do not understand: TypeScript, which must
> have its types removed, and JSX, which must become function calls. A build
> tool transforms your source into plain JavaScript, bundles many files into
> few, and runs a development server with hot reloading.

### A note on TypeScript versions (2026)

The TypeScript course in this series teaches **TypeScript 7**. This course
pins **5.9**, because that is what Casey Journals pins (`packages/tsconfig`,
every `package.json`) and because the React ecosystem's type definitions and
editor plugins were still catching up to 7 at the time of writing.

Nothing in this course depends on the difference. The language is the same; 7
is a faster checker with stricter defaults. When your React project moves to 7,
the things that will bite are the ones Lesson 0 of the TypeScript course lists:
`types` defaulting to `[]`, and `strict` being on whether you asked or not.

### Files and extensions

```
my-app/
  app/            (Next.js) routes, layouts, server actions
  src/            (Vite) components and entry point
  tsconfig.json
  next.config.ts  or  vite.config.ts
```

> **Background: What is the difference between `.ts` and `.tsx`?**
>
> `.tsx` is required for any file containing JSX. The compiler needs the
> extension to know whether to parse the angle brackets as markup or as type
> parameters. Files with no JSX use `.ts`.

> **Background: What is JSX?**
>
> JSX is a syntax extension that lets you write markup-like code inside
> JavaScript: `const greeting = <h1>Hello</h1>`. It is not HTML. The build tool
> converts it into function calls that produce React elements. Since React 17
> those calls are inserted automatically, which is what `"jsx": "react-jsx"` in
> `tsconfig.json` selects, and it is why you no longer need
> `import React from "react"` at the top of every file.

Confirm in `tsconfig.json` that `"strict": true` and `"jsx"` is set
(`"react-jsx"` for Vite, `"preserve"` for Next.js, which does its own
transform).

**(2026)** Add `"noUncheckedIndexedAccess": true` as well. Casey Journals sets
it in `packages/tsconfig/base.json`, and it catches the single most common
React crash: reading `items[0].name` on a list that turned out to be empty.

---

## Lesson 1: Typing Function Components

A React component is just a function that returns JSX. Type it like any other function.

> **Background: What is a "component"?**
>
> A component is a reusable piece of UI. In React, a component is a function that takes some inputs (props) and returns a description of what to render. Components can be combined: a `Page` component might use `Header`, `Sidebar`, and `Footer` components. This composition is the core of how React apps are built.

```tsx
function Greeting() {
  return <h1>Hello, world</h1>;
}

export default Greeting;
```

When a component takes props, define their shape:

> **Background: What are "props"?**
>
> Props (short for "properties") are the inputs to a component, similar to function arguments. They are passed in JSX like HTML attributes: `<Greeting name="Sam" />`. Inside the component, props are received as a single object parameter. Props let you reuse the same component with different data.

```tsx
interface GreetingProps {
  name: string;
  age?: number; // optional
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      {age !== undefined && <p>You are {age} years old</p>}
    </div>
  );
}

// Usage
<Greeting name="Sam" />
<Greeting name="Sam" age={30} />
```

> **Background: What does `{age !== undefined && <p>...</p>}` do?**
>
> This is "conditional rendering". JSX inside curly braces is evaluated as a JavaScript expression. The `&&` operator returns the right side only if the left side is truthy, otherwise it returns the left side. React ignores `false`, `null`, and `undefined`, so this pattern shows the paragraph only when `age` is provided.

Avoid `React.FC` (or `React.FunctionComponent`). It used to be the standard, but modern guidance is to type props directly. It causes minor issues with generics and `children`.

**Exercise:** Build a `Card` component that takes a `title`, optional `subtitle`, and a numeric `priority` (1, 2, or 3 only). Render different border colors based on priority.

---

## Lesson 2: The Children Prop

The `children` prop holds whatever is nested inside your component. Type it with `React.ReactNode`:

> **Background: What is `children`?**
>
> When a component is used with content between its opening and closing tags, that content is automatically passed to the component as a special prop called `children`. This lets components wrap arbitrary content. A `Card` component, for instance, can render its `children` inside a styled container without knowing in advance what the content will be.

```tsx
import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

// Usage
<Card title="Welcome">
  <p>This is the body</p>
  <button>Click me</button>
</Card>
```

`ReactNode` accepts strings, numbers, JSX elements, arrays, null, undefined, and booleans. It is the most permissive child type and almost always what you want.

**Exercise:** Build a `Modal` component that takes a `title`, `isOpen` boolean, `onClose` callback, and `children`. Hide it when not open.

---

## Lesson 3: useState

`useState` infers the type from the initial value. When inference is enough, do not annotate:

> **Background: What is "state"?**
>
> State is the data that a component holds and that can change over time. When state changes, React re-renders the component to reflect the new state on screen. Examples include the current value of a text input, whether a modal is open, or a counter value. State is local to the component that owns it (unlike props, which are passed down).

> **Background: What is a "hook"?**
>
> A hook is a special function that lets a component use React features. All hook names start with `use` (like `useState`, `useEffect`, `useRef`). Hooks must be called at the top level of a component, never inside loops, conditions, or nested functions. This rule lets React track which hook is which between renders.

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // inferred as number

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

> **Background: Why does `useState` return an array?**
>
> `useState` returns a tuple: the current value and a setter function. Destructuring gives them names of your choice (`count` and `setCount` here). When you call the setter, React re-renders the component with the new value. The values are independent across components, so each `Counter` has its own count.

When the initial value cannot describe all possible states, annotate explicitly:

```tsx
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);
const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
```

For object state, prefer multiple `useState` calls or `useReducer` for complex updates.

**Exercise:** Build a counter with three buttons: increment, decrement, and reset. Add a state field that tracks the highest value reached during the session.

---

## Lesson 4: Event Handlers

React event types are namespaced. The most common ones:

> **Background: What is a "synthetic event"?**
>
> When you attach an event handler in React (like `onClick`), you receive a "synthetic event" object instead of the browser's native event. Synthetic events provide the same data but normalize differences across browsers. They are what TypeScript types like `React.MouseEvent<HTMLButtonElement>` describe.

```tsx
function Form() {
  const [value, setValue] = useState("");

  // Input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  // Form submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitted:", value);
  };

  // Button click
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Clicked at", event.clientX, event.clientY);
  };

  // Keyboard
  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") console.log("Enter pressed");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={handleChange} onKeyDown={handleKey} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

Inline handlers usually have their types inferred:

```tsx
<input onChange={(e) => setValue(e.target.value)} />
// e is correctly typed as React.ChangeEvent<HTMLInputElement>
```

The pattern `React.SomethingEvent<HTMLElementType>` covers most needs. Match the element to the event source.

**Exercise:** Build a search box that calls a `onSearch(query: string)` callback when the user presses Enter. Add a clear button with a click handler.

---

## Lesson 5: useEffect and useRef

`useEffect` does not need type annotations; the function signature is fixed.

> **Background: What is a "side effect"?**
>
> A side effect is anything a component does besides returning JSX. Examples: fetching data, setting up a timer, subscribing to a WebSocket, updating the document title. React's render function should be pure (only return JSX based on inputs), so side effects go in `useEffect`. The effect runs after React has updated the DOM.

> **Background: What is the "dependency array"?**
>
> The second argument to `useEffect` is an array of values the effect depends on. After every render, React compares the array to the previous render's array. If anything changed, React runs the effect again. An empty array `[]` means "run only once after the first render". Omitting the array means "run after every render", which is rarely what you want.

```tsx
import { useEffect, useState } from "react";

function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id); // cleanup
  }, []);

  return <p>{now.toLocaleTimeString()}</p>;
}
```

> **Background: What does the "cleanup function" do?**
>
> When a `useEffect` callback returns a function, React calls that function before running the effect again, and once more when the component is removed from the page (unmounted). Cleanup is essential for canceling timers, removing event listeners, and aborting network requests. Forgetting cleanup causes memory leaks and bugs.

`useRef` has two main forms:

> **Background: What is a "ref"?**
>
> A ref is a container that holds a mutable value across renders without triggering re-renders when it changes. The most common use is getting a direct handle on a DOM element (so you can call `.focus()` or measure its size). Refs can also store any value you want to keep between renders without causing updates: timer ids, previous values, or instance variables.

```tsx
import { useRef, useEffect } from "react";

function FocusInput() {
  // For DOM elements: provide the element type, initialize with null
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}

function Timer() {
  // For mutable values: type the value, no JSX involved
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    intervalRef.current = window.setInterval(() => console.log("tick"), 1000);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

The `?.` (optional chaining) is essential because `current` may be `null` before the element mounts.

> **Background: What does "mounting" mean?**
>
> When React first inserts a component into the DOM, the component is "mounted". When it is removed, it is "unmounted". Some operations (like reading a DOM element) only work after the component is mounted, which is why `useEffect` runs after mounting rather than during render.

### `ref` is an ordinary prop (2026)

In React 18 and earlier, a function component could not receive a `ref`. You
had to wrap it in `forwardRef`:

```tsx
// React 18. You will meet this in every codebase written before 2025.
import { forwardRef } from "react";

type Props = { label: string };

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label },
  ref,
) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

**In React 19, `ref` is just a prop.**

```tsx
type Props = {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
};

function TextField({ label, ref }: Props) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
}
```

No wrapper, no second parameter, no generic argument in the wrong order, and
the component keeps its own name in React DevTools without the
`function TextField` trick above.

> **Background (2026): Should I rewrite every `forwardRef` in my codebase?**
>
> No. `forwardRef` still works and is not going anywhere soon. Write new
> components the new way, and convert an old one when you are already editing
> it. Ecosystem-wide flag days are how projects lose weeks.

### Ref cleanup functions (2026)

A ref callback may now return a cleanup function, exactly like an effect.

```tsx
function Measured() {
  return (
    <div
      ref={(node) => {
        if (node === null) return;
        const observer = new ResizeObserver(([entry]) => {
          if (entry !== undefined) console.log(entry.contentRect.width);
        });
        observer.observe(node);
        return () => observer.disconnect();
      }}
    />
  );
}
```

Before this, React called your ref callback with `null` on unmount and you
had to handle both cases in one function. **Note the consequence:** because a
returned function is now treated as cleanup, a ref callback with an implicit
arrow-function body that happens to return something is an error. Write
`ref={(node) => { thing.current = node; }}` with braces, not
`ref={(node) => (thing.current = node)}`.

### useEffectEvent (2026)

An effect that reads a value but should not re-run when it changes is the
oldest problem with the dependency array. The old workarounds were a ref, or a
lint-rule suppression, and both were wrong in different ways.

```tsx
import { useEffect, useEffectEvent } from "react";

function ChatRoom({ roomId, theme }: { roomId: string; theme: string }) {
  // onConnected always sees the LATEST theme, but is not a dependency.
  const onConnected = useEffectEvent(() => {
    showNotification("Connected", theme);
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on("connected", () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // theme is deliberately absent, and the linter agrees

  return <h1>Welcome to {roomId}</h1>;
}
```

Without it, either `theme` is a dependency and changing the theme reconnects
the chat, or you suppress the lint rule and `theme` goes stale.

> **Background (2026): Is this stable?**
>
> Yes. `useEffectEvent` landed as a plain export in the React 19.2 line and is
> typed in `@types/react` (`export function useEffectEvent<T extends Function>(callback: T): T;`,
> marked `@version 19.2.0`). Verified against `react@19.2.8` and
> `@types/react@19.2.18`. If you have read older material telling you to import
> `experimental_useEffectEvent`, that advice has expired.
>
> One rule comes with it: **an effect event may only be called from inside an
> effect.** Calling one from an event handler or passing it to a child defeats
> the point, because its whole nature is that it is not reactive.

**Exercise:** Build a `useDocumentTitle(title: string)` effect that updates the browser tab title and restores the previous title on unmount.

---

## Lesson 6: useReducer

Use `useReducer` when state has multiple related fields or complex transitions. Combine it with discriminated unions for full type safety.

> **Background: What is a "reducer"?**
>
> A reducer is a function `(state, action) => newState`. It takes the current state and a description of what happened (the action), and returns the new state. Reducers must be pure: given the same inputs, always return the same output, with no side effects. This pattern centralizes all state changes in one place, which makes complex updates easier to reason about. The pattern comes from the Redux library and made it into React itself as `useReducer`.

```tsx
import { useReducer } from "react";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "remove"; id: string }
  | { type: "updateQuantity"; id: string; quantity: number }
  | { type: "clear" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add":
      return {
        ...state,
        items: [...state.items, action.item],
        total: state.total + action.item.quantity,
      };
    case "remove":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
      };
    case "updateQuantity":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i,
        ),
      };
    case "clear":
      return { items: [], total: 0 };
  }
}

function Cart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <div>
      <p>Total items: {state.total}</p>
      <button onClick={() => dispatch({ type: "clear" })}>Clear</button>
    </div>
  );
}
```

The `switch` with discriminated actions gives you exhaustive type checking. If you add a new action variant, TypeScript will complain about every reducer that does not handle it.

**Exercise:** Build a `useReducer`-based todo list with actions for `add`, `toggle`, `remove`, and `editText`.

---

## Lesson 7: Context API

Context lets you share state without passing props through every level. Type it carefully.

> **Background: What problem does "context" solve?**
>
> When data is needed by many components at different depths in the component tree, passing it as props through every level becomes tedious. This is called "prop drilling". Context lets you provide a value at one point in the tree and read it from anywhere below, without manually passing it through. Common uses: the current user, the theme, the language.

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook makes consumption type-safe and ergonomic
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

The `undefined` default and runtime check force consumers to be inside the provider. Without this guard, every consumer would have to handle a possibly-missing context.

### `<Context>` as a provider, and `use()` (2026)

Two changes.

**A context is its own provider.** `<AuthContext.Provider>` still works and is
deprecated.

```tsx
// React 19
return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>;
```

**`use()` reads a context, and it may be called conditionally.**

```tsx
import { use } from "react";

function Greeting({ signedIn }: { signedIn: boolean }) {
  if (!signedIn) return <p>Please sign in.</p>;

  // Legal. `useContext` here would break the rules of hooks.
  const { user } = use(AuthContext);
  return <p>Hello, {user?.name ?? "friend"}.</p>;
}
```

`use()` is not a hook in the usual sense: it may sit inside an `if`, inside a
loop, or after an early return. It may not be called inside a `try` block, and
it may not be called from an event handler or an effect.

**`use()` also unwraps a promise.**

```tsx
import { Suspense, use } from "react";

function Articles({ articlesPromise }: { articlesPromise: Promise<Article[]> }) {
  const articles = use(articlesPromise); // suspends until it resolves
  return <ul>{articles.map((a) => <li key={a.slug}>{a.title}</li>)}</ul>;
}

function Page({ articlesPromise }: { articlesPromise: Promise<Article[]> }) {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <Articles articlesPromise={articlesPromise} />
    </Suspense>
  );
}
```

> **Background (2026): Where does the promise come from?**
>
> Not from inside the component. Creating a promise during render creates a new
> one on every render, and the component suspends forever. The promise is
> created by a **parent that does not re-render often**, by a framework, or by a
> cache. In Next.js the natural source is a Server Component passing an
> unawaited promise down to a Client Component, which is how you stream: the
> server sends the shell immediately and the data when it arrives.
>
> For ordinary client-side fetching, keep using TanStack Query (Lesson 11).
> `use()` is a primitive, not a replacement for a cache.

**Exercise:** Build a `ThemeContext` with `theme` ("light" or "dark") and `toggleTheme`. Use it in a component that switches CSS classes.

---

## Lesson 8: Custom Hooks

Custom hooks are functions starting with `use` that call other hooks. Type them like any function.

> **Background: Why write custom hooks?**
>
> Custom hooks let you extract reusable logic that uses React features. If two components need to read from local storage and stay in sync, you can put that logic in a `useLocalStorage` hook and call it from both. The naming convention (starting with `use`) is enforced by linters and tells React this function follows the hook rules.

```tsx
import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) return initialValue;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
const [name, setName] = useLocalStorage<string>("username", "");
const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
```

> **Background: What is the function form of `useState`?**
>
> When you pass a function to `useState` (instead of a value), React only calls it on the first render. This is useful for expensive initialization, like reading from local storage. Without the function form, `localStorage.getItem` would be called on every render, even though the result is only needed once.

A pattern: return a tuple for hooks that mimic `useState`, return an object for hooks with multiple unrelated values.

```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((json: T) => {
        if (!cancelled) setData(json);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, error, loading };
}
```

Note: in real apps, use TanStack Query (Lesson 11) instead of writing fetch hooks by hand.

**Exercise:** Write a `useDebounce<T>(value: T, delay: number): T` hook that returns a debounced version of the value.

> **Background: What does "debounce" mean?**
>
> Debouncing means waiting until a value stops changing before reacting. If a user is typing in a search box, you do not want to fire a request on every keystroke. A debounce hook returns the latest value only after the user has paused typing for some delay (say, 500ms). It is a common pattern for search inputs and resize handlers.

---

## Lesson 9: Generic Components

Components can be generic, just like functions. The classic example is a list:

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyOf: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyOf }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyOf(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage with full type safety
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "a@x.com" },
  { id: 2, name: "Bob", email: "b@x.com" },
];

<List
  items={users}
  keyOf={(u) => u.id}
  renderItem={(u) => <span>{u.name}</span>} // u is correctly inferred as User
/>
```

> **Background: What is the `key` prop?**
>
> When you render a list of elements, React uses the `key` prop to identify each item across renders. This lets React tell which items were added, removed, or reordered, which makes updates fast and preserves component state correctly. Keys must be unique among siblings. A common mistake is using the array index, which fails when items are reordered. Use a stable id from your data instead.

This is the React equivalent of a typed container. You write it once, use it with any data.

**Exercise:** Build a `Select<T>` component that takes options, a value, an onChange, and a `getLabel` function. Make it work for both string options and object options.

---

## Lesson 10: Forms with react-hook-form and Zod

Hand-rolling forms with `useState` does not scale. The industry-standard combination is `react-hook-form` for state and `zod` for validation.

> **Background: Why not just use `useState` for forms?**
>
> A simple form with one or two inputs works fine with `useState`. But as forms grow (multiple fields, validation, async submission, error states, dirty tracking, reset), the boilerplate becomes overwhelming. Form libraries handle all of this and also avoid re-rendering the entire form on every keystroke, which improves performance.

```bash
npm install react-hook-form zod @hookform/resolvers
```

> **Background: What is `@hookform/resolvers`?**
>
> React Hook Form supports any validation library through "resolvers". `@hookform/resolvers/zod` is the adapter that connects Zod schemas to React Hook Form. You write your validation in Zod, plug it into the form, and errors appear automatically.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
  age: z.number().min(18, "Must be 18 or older"),
});

type SignupForm = z.infer<typeof SignupSchema>;

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    console.log("Valid data:", data);
    await new Promise((r) => setTimeout(r, 1000));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <input type="password" {...register("password")} placeholder="Password" />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <div>
        <input type="number" {...register("age", { valueAsNumber: true })} placeholder="Age" />
        {errors.age && <span>{errors.age.message}</span>}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign up"}
      </button>
    </form>
  );
}
```

> **Background: What does `register` do?**
>
> `register("fieldName")` returns the props that connect an input to the form library: an `onChange` handler, an `onBlur` handler, a `ref`, and a `name`. Spreading these onto an input wires it up automatically. The library tracks the value, validates it, and reports errors without you writing per-field state code.

The schema is the single source of truth. Both the form types and the runtime validation come from it. This is the most important pattern in modern React.

**Exercise:** Build a "create event" form with title, date, location, and a "max attendees" number. Validate each field with Zod.

---

## Lesson 11: Data Fetching with TanStack Query

TanStack Query (formerly React Query) handles server state: caching, refetching, loading states, error handling, and pagination. It is what you should use for any nontrivial data fetching.

> **Background: Why is server state different from regular state?**
>
> Server state is data that lives on a server, not in your app. It can change without your app knowing (someone else updated it), it needs to be cached so you do not refetch it constantly, it must handle loading and error states, and it might be stale and need refetching. TanStack Query solves all of these problems. Trying to do this with `useState` and `useEffect` leads to a lot of buggy boilerplate.

```bash
npm install @tanstack/react-query
```

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
```

**(2026)** Two things changed in version 5, and both matter on the first line
you write.

```tsx
// lib/practitioners.ts
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

const Practitioner = z.object({
  id: z.string(),
  name: z.string(),
  profession: z.enum(["psychologist", "psychiatrist"]),
  feeCents: z.int(),
});
const PractitionerList = z.array(Practitioner);
export type Practitioner = z.infer<typeof Practitioner>;

async function fetchPractitioners(): Promise<Practitioner[]> {
  const response = await fetch("/api/practitioners", {
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return PractitionerList.parse(await response.json());
}

// ONE definition of this query. Key and function travel together, typed.
export const practitionersQuery = () =>
  queryOptions({
    queryKey: ["practitioners"] as const,
    queryFn: fetchPractitioners,
    staleTime: 60_000,
  });
```

```tsx
// PractitionerList.tsx
import { useQuery } from "@tanstack/react-query";
import { practitionersQuery } from "./lib/practitioners";

function PractitionerList() {
  const { data, isPending, isError, error } = useQuery(practitionersQuery());

  if (isPending) return <p>Loading</p>;
  if (isError) return <p>Could not load practitioners: {error.message}</p>;

  return (
    <ul>
      {data.map((practitioner) => (
        <li key={practitioner.id}>{practitioner.name}</li>
      ))}
    </ul>
  );
}
```

> **Background (2026): What is `queryOptions` for?**
>
> It ties a key to its function and its result type in one exported value. Every
> caller then gets the same key and the same type: `useQuery`, a prefetch, an
> `invalidateQueries`, a `setQueryData`. Before it, the key was a bare array
> repeated at each call site, and a typo produced a second cache entry rather
> than an error.
>
> ```tsx
> queryClient.invalidateQueries({ queryKey: practitionersQuery().queryKey });
> queryClient.setQueryData(practitionersQuery().queryKey, next); // `next` is typed
> ```

> **Background (2026): `isPending`, not `isLoading`.**
>
> In version 5, `isPending` means "there is no data yet". `isLoading` now means
> "pending **and** fetching", which is a narrower thing and not what most code
> wanted. Note also that after the `isPending` and `isError` guards, `data` is
> narrowed to `Practitioner[]` rather than `Practitioner[] | undefined`, so the
> `data?.map` of the old code becomes `data.map`. Getting that narrowing is the
> practical reason to check `isPending` first.
>
> Two other renames from version 4: `cacheTime` is `gcTime`, and the positional
> signature (`useQuery(key, fn)`) is gone. There is one signature and it takes
> an object.

> **Background: What is the `queryKey`?**
>
> The query key is an array that uniquely identifies a query in the cache. Two components using `["users"]` share the same cached data and stay in sync. Including parameters in the key (`["user", userId]`) makes each set of parameters its own cache entry. When the key changes, TanStack Query refetches.

Mutations for writes:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newUser: { name: string; email: string }) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<unknown>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practitionersQuery().queryKey });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ name: "New", email: "n@x.com" })}
      disabled={mutation.isPending}
    >
      Create user
    </button>
  );
}
```

> **Background: What does "invalidate" mean?**
>
> Invalidating a query marks its cached data as stale and triggers a refetch. After creating a user, you invalidate the user list so it refetches and shows the new entry. This keeps the UI in sync with the server without manually managing state.

**Exercise:** Build a paginated list of posts using `useQuery` with a `page` parameter. Add a "next page" and "previous page" button.

---

## Lesson 12: Routing with React Router

> **Background: What is "routing" in a single-page app?**
>
> A traditional website has many HTML pages and the server returns a different one for each URL. A single-page app (SPA) loads once and uses JavaScript to swap content based on the URL. Routing libraries listen for URL changes, pick the matching component, and render it without a full page reload. This is what makes SPAs feel fast.

**(2026)** This is the **Vite path**. If you are building on Next.js, routing
is the file system and Lesson 16 covers it; skip to there and come back when
you meet a single-page app.

```bash
npm install react-router
```

> **Background (2026): `react-router` or `react-router-dom`?**
>
> From version 7, everything is exported from **`react-router`**.
> `react-router-dom` still exists and re-exports the same things, so nothing
> breaks, but new code should import from `react-router`.
>
> Mentisflow is on `react-router-dom@^7.14.1` and imports from
> `react-router-dom` throughout, which is correct for that codebase: a
> repository-wide import rewrite is churn with no user-visible effect. Follow
> the project you are in. Know which is which.
>
> Version 8 is the current release; version 7 is what the product pins. The
> API in this lesson is the same on both.

```tsx
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserDetail() {
  const { id } = useParams<{ id: string }>();
  // id is string | undefined
  if (!id) return <p>No user id</p>;
  return <p>User {id}</p>;
}
```

> **Background: What does `:id` mean in a route path?**
>
> Path segments starting with a colon are dynamic parameters. The route `/users/:id` matches `/users/1`, `/users/42`, and so on, and makes the value available via `useParams()`. This is how you build pages that work for many records using a single component.

`useParams` returns `Record<string, string | undefined>` by default. Annotate
with the params your route expects.

**(2026)** Two things worth knowing beyond the basics.

**Lazy routes and code splitting.** A route that is rarely visited should not be
in the first bundle:

```tsx
import { lazy, Suspense } from "react";

const Admin = lazy(() => import("./pages/Admin"));

<Route
  path="/admin"
  element={
    <Suspense fallback={<p>Loading</p>}>
      <Admin />
    </Suspense>
  }
/>;
```

**A route is not a permission.** Hiding `/admin` from the menu and omitting the
route hides the door. It does not lock it: the JavaScript that would render the
page is in the bundle, and anybody can call the API the page calls. Every route
guard you write is a convenience for honest users. The rule the workbook states
at length: **the server decides, the client displays.**

**Exercise:** Build a small app with three routes: a home page, a list of products, and a product detail page that reads the id from the URL.

---

## Lesson 13: Component Patterns

### Compound components

A parent that exposes a set of related child components. Useful for building flexible UI primitives.

> **Background: What is the value of compound components?**
>
> Without compound components, configurable UI elements often grow into giant prop lists ("`tabs={[{label, content, disabled, ...}]}`"). Compound components flip this: instead of describing the UI in props, the consumer composes it with JSX. This gives more flexibility (you can put extra elements between tabs, conditionally render them, and so on) while keeping internal state shared.

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab must be inside Tabs");
  return (
    <button
      role="tab"
      aria-selected={ctx.active === id}
      onClick={() => ctx.setActive(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabPanel must be inside Tabs");
  if (ctx.active !== id) return null;
  return <div role="tabpanel">{children}</div>;
}

// Attach as static properties
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab id="profile">Profile</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="profile">Profile content</Tabs.Panel>
  <Tabs.Panel id="settings">Settings content</Tabs.Panel>
</Tabs>
```

### Polymorphic components (the `as` prop)

A component that can render as different elements while keeping correct prop types. This is advanced and rarely needed, but UI libraries use it heavily.

```tsx
import { ElementType, ComponentPropsWithoutRef } from "react";

type ButtonProps<E extends ElementType> = {
  as?: E;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<E>, "as" | "children">;

function Button<E extends ElementType = "button">({
  as,
  children,
  ...rest
}: ButtonProps<E>) {
  const Component = as || "button";
  return <Component {...rest}>{children}</Component>;
}

<Button>Click</Button>
<Button as="a" href="/about">About</Button> // href is correctly typed
```

**Exercise:** Build a compound `Accordion` with `Accordion`, `Accordion.Item`, `Accordion.Header`, and `Accordion.Body`. Only one item should be open at a time.

---

## Lesson 14: Testing with Vitest and React Testing Library

> **Background: What are Vitest and React Testing Library?**
>
> Vitest is a test runner: it finds your test files, runs them, and reports the results. React Testing Library is a set of utilities for rendering components in a fake DOM and querying them like a user would (by visible text, role, or label). Together they let you write tests that exercise your components from the outside, the same way a user would.

```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

**(2026)** `@testing-library/jest-dom` is optional now and is left out here. Its
matchers (`toBeInTheDocument`, `toBeDisabled`) read nicely but they are a second
assertion vocabulary to learn, and every one of them has a plain equivalent.
Add it if your team already uses it.

> **Background: What is `jsdom`?**
>
> `jsdom` is a JavaScript implementation of the DOM that runs in Node.js. Tests need it because they run outside a real browser. With `jsdom`, your tests can render components, query elements, and simulate clicks just like in a browser.

**(2026)** Configure Vitest in its own file, importing `defineConfig` from
**`vitest/config`**, not from `vite`:

```ts
// vitest.config.mts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["test/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
```

> **Background (2026): Why `vitest/config` and not `vite`?**
>
> `defineConfig` from `vite` does not know about the `test` key, so the
> `/// <reference types="vitest" />` comment above the old sample existed to
> paper over that. Importing from `vitest/config` types the `test` key
> properly and the reference comment goes away. Casey Journals does exactly
> this in `apps/web/vitest.config.mts`.
>
> Note also that `globals` is **not** set. Import `describe`, `test` and
> `expect` explicitly. Implicit globals are convenient and they hide which
> runner a file needs, which is exactly the confusion that made Jest and Vitest
> files indistinguishable in mixed codebases.

Create `test/setup.ts`:

```ts
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Testing Library unmounts automatically only when a global `afterEach` exists,
// which means `globals: true`. With globals off, do it by hand. Leftover
// components from a previous test are the cause of most "found multiple
// elements" failures.
afterEach(cleanup);
```

Write a test:

```tsx
// Counter.tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

```tsx
// test/counter.test.tsx
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "../Counter";

test("increments when clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "Count: 0" }));

  expect(screen.getByRole("button").textContent).toBe("Count: 1");
});
```

Run them:

```bash
npx vitest run     # once, for CI
npx vitest         # watch mode, for working
```

> **Background (2026): `userEvent.setup()`, and why the name is an exact string.**
>
> `userEvent.setup()` per test is the documented form: it installs its own
> clipboard and pointer state, and it fails loudly rather than sharing state
> between tests.
>
> The accessible name is asserted exactly, `"Count: 0"`, rather than with a
> case-insensitive regular expression. A regular expression will match a button
> you did not mean, and the failure message is worse. Reach for one only when
> the text genuinely varies.

### Testing an optimistic update (2026)

An optimistic value is visible only **while the action is in flight**. A test
that awaits the action sees the value after React has already discarded it.

```tsx
test("the label updates optimistically, while the action is still in flight", async () => {
  // Hold the action open so the transition cannot finish.
  const { promise, resolve } = Promise.withResolvers<{ bookmarked: boolean }>();
  toggleBookmark.mockReturnValue(promise);

  const user = userEvent.setup();
  render(<BookmarkButton slug="a" title="An article" bookmarked={false} />);

  void user.click(screen.getByRole("button")); // not awaited, deliberately

  await waitFor(() => {
    expect(screen.getByRole("button").textContent).toBe("Bookmarked");
  });

  resolve({ bookmarked: true });
});
```

If you await the click instead, the button reads `"Bookmark"` again, because
the prop never changed and React dropped the optimistic state. **That is not a
failing test; that is the rollback working.** It is worth a test of its own.

Test by behavior, not implementation. Query elements the way users do (by role, label, or text), not by class name or test id where avoidable.

**Exercise:** Write tests for the signup form from Lesson 10. Test that invalid input shows errors and valid input submits successfully.

---

## Lesson 15: Project Structure

For a real app, organize by feature, not by file type. Bad:

```
src/
  components/
  hooks/
  utils/
  types/
```

Good:

```
src/
  features/
    auth/
      components/
      hooks/
      api.ts
      types.ts
      schemas.ts
    posts/
      components/
      hooks/
      api.ts
      types.ts
  shared/
    components/   // Button, Card, Modal
    hooks/        // useDebounce, useLocalStorage
    lib/          // utility functions
  App.tsx
  main.tsx
```

Each feature folder owns everything for that feature. Shared code lives at the top level. This scales from a small app to a hundred-thousand-line codebase without restructuring.

---

## Lesson 16: React 19 Actions (2026)

React 19 gives forms and mutations first-class support. Three hooks, and a
convention: a function passed to `<form action>` is an **Action**, and React
manages its pending state, its errors and the transition around it.

### `useActionState`

```tsx
import { useActionState } from "react";

type State =
  | { status: "idle" }
  | { status: "ok"; email: string }
  | { status: "error"; errors: Record<string, string> };

const IDLE: State = { status: "idle" };

async function subscribe(_previous: State, formData: FormData): Promise<State> {
  const email = String(formData.get("email") ?? "");
  if (!email.includes("@")) {
    return { status: "error", errors: { email: "Enter an email address." } };
  }
  await sendToServer(email);
  return { status: "ok", email };
}

function SubscribeForm() {
  const [state, formAction, pending] = useActionState(subscribe, IDLE);

  if (state.status === "ok") {
    return <p role="status">Check {state.email} for a confirmation link.</p>;
  }

  return (
    <form action={formAction}>
      <label>
        Email address
        <input name="email" type="email" required />
      </label>
      {state.status === "error" ? <p className="error">{state.errors["email"]}</p> : null}
      <button type="submit" disabled={pending}>
        {pending ? "Subscribing" : "Subscribe"}
      </button>
    </form>
  );
}
```

Note what is **absent**: no `useState` for the loading flag, no `useState` for
the error, no `onSubmit` handler, no `event.preventDefault()`. React tracks the
pending state and holds the returned value.

Note also that the form works before the JavaScript loads. A `<form action>`
with real `name` attributes posts as a form, which is what makes this a
progressive enhancement rather than a rewrite of one.

> **Background (2026): Why does the action take the previous state?**
>
> The signature is `(previousState, formData) => newState`, which is a reducer.
> That gives you the "attempt three of three" case for free, and it is why the
> state can be a discriminated union rather than a bag of booleans.

### `useFormStatus`

`useActionState` gives the pending flag to the component that owns the form.
When a **child** needs it, such as a shared submit button, `useFormStatus`
reads it from the enclosing form.

```tsx
import { useFormStatus } from "react-dom";

// Note: it reads the form ABOVE it, so it must be a child of that form.
// Calling it in the same component as the <form> returns pending: false.
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Working" : children}</button>;
}
```

It is imported from **`react-dom`**, not `react`.

### `useOptimistic`

Show the result you expect while the request is in flight, and let React undo
it if the request does not deliver.

```tsx
"use client";

import { useOptimistic, useTransition } from "react";

export function BookmarkButton({
  slug,
  title,
  bookmarked,
}: {
  slug: string;
  title: string;
  bookmarked: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [shown, setShown] = useOptimistic(bookmarked);

  return (
    <button
      type="button"
      aria-pressed={shown}
      aria-label={shown ? `Remove ${title} from your bookmarks` : `Bookmark ${title}`}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          setShown(!shown);
          await toggleBookmark(slug);
        });
      }}
    >
      {shown ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
```

> **Background (2026): Where is the rollback code?**
>
> There is none, and that is the feature. `useOptimistic` returns a value that
> **follows the prop**, except while a transition is running, when it returns
> what you set. When the transition ends, the optimistic value is discarded and
> the prop wins again.
>
> So if the action succeeded and the server sent back new data, the prop is
> already the new value and nothing flickers. If the action failed, the prop
> never changed, and the button snaps back on its own. The pattern this
> replaces was: copy state, apply the change, keep the old copy, restore it in
> a `catch`. That code is where optimistic updates went wrong.
>
> The corollary catches people in tests: **the optimistic value only exists
> during the transition.** See Lesson 14 on how to test it.

`setShown` must be called **inside** the transition. Called outside, React
throws: an optimistic update with no action to be optimistic about is a plain
`useState` that will never be reconciled.

### `useSyncExternalStore`

For subscribing to something outside React: a browser API, a store from another
library, a WebSocket.

```tsx
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Server rendering has no window. The third argument is what the server says.
function getServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

> **Background (2026): Why not `useState` and `useEffect`?**
>
> Because of tearing. With concurrent rendering, React may render part of a
> tree, pause, and finish later. If an external value changes in between, an
> effect-based subscription can leave two components in the same render showing
> different values. `useSyncExternalStore` tells React the value is external so
> it can read it consistently.
>
> The third argument matters for anything server-rendered. Without it, a value
> read from `window` produces one thing on the server and another in the
> browser, and you get a hydration mismatch. Mentisflow's reduced-motion,
> theme, and safe-area readings are all this shape.

### `<Activity>` (2026)

Keep a subtree alive but hidden, without unmounting it.

```tsx
import { Activity } from "react";

function Tabs({ current }: { current: "list" | "map" }) {
  return (
    <>
      <Activity mode={current === "list" ? "visible" : "hidden"}>
        <ArticleList />
      </Activity>
      <Activity mode={current === "map" ? "visible" : "hidden"}>
        <PractitionerMap />
      </Activity>
    </>
  );
}
```

A hidden `Activity` keeps its state (scroll position, form input, a loaded map)
and its effects are torn down, so timers and subscriptions do not run. Switching
back restores it. Conditional rendering throws the state away; `display: none`
keeps the effects running.

`mode` takes `"visible"` or `"hidden"` and defaults to `"visible"`. An optional
`name` shows the boundary in React DevTools.

Verified against `react@19.2.8` and `@types/react@19.2.18`, where `Activity` is
a plain export marked `@version 19.2.0`. Older material calls it
`unstable_Activity`; that spelling is gone.

### The React Compiler (2026)

The React Compiler is a build-time optimiser that inserts memoisation for you.
Where you would have written `useMemo`, `useCallback` and `memo` by hand, it
works out what depends on what and caches accordingly.

```bash
npm install -D babel-plugin-react-compiler
```

```ts
// vite.config.ts
plugins: [react({ babel: { plugins: [["babel-plugin-react-compiler", {}]] } })],
```

```ts
// next.config.ts
const nextConfig: NextConfig = { reactCompiler: true };
```

> **Background (2026): Should I turn it on, and do I stop writing `useMemo`?**
>
> Turn it on for a new project and measure. It is a separate package on its own
> release cadence, not part of React itself, so check its current status before
> adopting it in something that must not break.
>
> You do stop writing `useMemo` and `useCallback` for **performance**. You do
> not stop writing them where the identity of a value is part of the contract:
> a dependency array of an effect, a key into a cache, a value handed to a
> non-React library.
>
> The compiler only works on code that follows the rules of hooks and does not
> mutate props or state. Run the ESLint plugin first: what it flags is what the
> compiler will refuse to optimise, and each of those is a real bug in waiting.

**Exercise:** Rewrite the signup form from Lesson 10 with `useActionState`,
validating with a Zod schema on submit and returning one message per field.
Then add a `<SubmitButton>` child using `useFormStatus`, and compare the two
versions for how many pieces of state you had to declare yourself.

---

## Lesson 17: Next.js and the App Router (2026)

Everything so far runs in a browser. This lesson is about the half that does
not.

Casey Journals runs Next.js 16.3 with the App Router (`apps/web/package.json`,
`apps/web/next.config.ts`). This lesson covers what you need to build the
capstone on it.

### The mental model

**Every component in `app/` is a Server Component unless it says otherwise.**

A Server Component runs on the server, once, and never in the browser. It can
read a database, read a cookie, read a secret. It sends **rendered output**, not
code, so nothing it imports is in the browser bundle.

A Client Component is what you have been writing all along. It runs in the
browser, it can hold state, and it can attach event handlers.

```tsx
// app/page.tsx: a Server Component. No directive needed.
import { listArticles } from "@/lib/content";

export default async function HomePage() {
  const articles = listArticles();   // runs on the server
  return <ul>{articles.map((a) => <li key={a.slug}>{a.title}</li>)}</ul>;
}
```

```tsx
// components/counter.tsx: a Client Component.
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

> **Background (2026): What does `"use client"` actually mean?**
>
> It is not "this component is interactive". It is **a boundary**. The file
> carrying the directive, and everything it imports, is compiled into the
> browser bundle.
>
> Two consequences people get wrong:
>
> 1. You do not put `"use client"` on every file. Put it at the **top of the
>    interactive leaf**, as far down the tree as you can. Everything above it
>    stays on the server.
> 2. A Server Component may **render** a Client Component, but not the reverse
>    through an import. It can pass one through as `children`, which is the
>    standard way to put server-rendered content inside a client-side layout.

### What you may pass across the boundary

Props from a Server Component to a Client Component are **serialised**. So they
may be: strings, numbers, booleans, `null`, `undefined`, plain objects, arrays,
`Date`, `Map`, `Set`, promises, and Server Action references.

They may **not** be: functions (other than Server Actions), class instances,
`Symbol`s, or anything with methods.

```tsx
// This throws at build time.
<ClientThing onSave={() => db.save()} />

// This works: a Server Action is a reference the client may call.
<ClientThing onSave={saveAction} />
```

> **Background (2026): Why the restriction?**
>
> Because the props are put into the HTML and read back in the browser. A
> function cannot survive that trip. The rule is a good one to internalise
> beyond React: **anything that crosses a process boundary must be data.**

### Routing is the file system

```
app/
  layout.tsx              wraps everything below
  page.tsx                /
  subscribe/page.tsx      /subscribe
  articles/
    [slug]/page.tsx       /articles/anything
  api/health/route.ts     GET /api/health
  not-found.tsx           the 404
  loading.tsx             the Suspense fallback for this segment
  error.tsx               the error boundary for this segment ("use client")
```

**(2026)** Dynamic params are a **promise**, and so are `searchParams` and
`cookies()` and `headers()`. Await them.

```tsx
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (article === undefined) notFound();
  return <h1>{article.title}</h1>;
}
```

Turn on `typedRoutes` in `next.config.ts` and `<Link href="/artcles/x">` becomes
a type error rather than a 404 somebody finds in production.

### Rendering and caching

This is the part people find hardest, so here is the whole model in one table.

| Mode | When | How you get it |
| --- | --- | --- |
| **Static** | Rendered at build, served from the edge | The default, when nothing dynamic is read |
| **Dynamic** | Rendered per request | Automatic once you read `cookies()`, `headers()`, or `searchParams` |
| **Revalidated** | Static, rebuilt on a timer | `export const revalidate = 3600` |
| **On-demand** | Static, rebuilt when you say so | `revalidatePath()` / `revalidateTag()` in an action |
| **Streamed** | Shell first, slow parts as they arrive | `<Suspense>` around the slow part |

```tsx
export const revalidate = 3600;          // rebuild at most hourly
export const dynamic = "force-dynamic";  // never cache; use sparingly
```

The `next build` output tells you which each route got: `○` for static, `ƒ` for
dynamic. Read it. A route you expected to be static appearing as dynamic means
something in it read a request-scoped value.

> **Background (2026): Why does reading a cookie change everything?**
>
> Because a page whose output depends on the request cannot be rendered once and
> shared. This is not Next.js being fussy; it is the only correct answer. The
> capstone's article page reads the reader's tier from a cookie, so it is
> dynamic, and the build output says `ƒ /articles/[slug]`. That is the paywall
> working: a cached page would be served to the wrong reader.

### Server Actions

```tsx
// app/actions.ts
"use server";

export async function subscribe(previous: State, formData: FormData): Promise<State> {
  const parsed = SubscribeInput.safeParse({
    email: formData.get("email"),
    tier: formData.get("tier"),
  });
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error) };
  }
  await recordSubscription(parsed.data);
  revalidatePath("/");
  return { status: "ok", email: parsed.data.email };
}
```

> **Background (2026): The single most important thing in this lesson.**
>
> **A Server Action is a public HTTP endpoint.** Next.js gives it a URL and
> anybody on the internet can post to it, with any body, in any order, at any
> rate. That it is only called from your form is a fact about your UI, not
> about the endpoint.
>
> So every action does all of this, every time, itself:
>
> 1. **Validate its own input.** The form's `required` attribute and its Zod
>    schema on the client are for the user's benefit.
> 2. **Read its own session.** Never take the user id from an argument.
> 3. **Check its own authorisation.** "Only admins see this button" is not a
>    check.
> 4. **Be safe to call twice.** Networks retry.
>
> Casey Legal Tools writes this down as a fixed order of checks in
> `docs/security/SECURITY.md` section 4, and its `CLAUDE.md` says "Order of
> checks is fixed. Do not rearrange." That is what the rule looks like once a
> team has been bitten by it.

### Route Handlers

```ts
// app/api/health/route.ts
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
```

Use a Route Handler when the caller is **not** a React tree: a webhook from a
payment provider, a health check, an RSS or podcast feed, an OpenGraph image.
Use a Server Action when the caller is your own form. Both are public; both
validate.

### Environment variables

```ts
// Server only. Available in Server Components, actions, route handlers.
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public. INLINED INTO THE BROWSER BUNDLE AT BUILD TIME.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

> **Background (2026): The prefix is the whole rule.**
>
> Only variables named `NEXT_PUBLIC_*` reach the browser, and they reach it as
> **literal text substituted into the bundle**. There is no runtime lookup and
> no way to change one without rebuilding.
>
> Therefore: **nothing secret ever carries the prefix.** Both Casey repositories
> state this as a ground rule in `CLAUDE.md` and both `.env.example` files
> repeat it on the line above the secret. Vite has the identical rule with a
> different prefix, `VITE_*`, which is why Mentisflow's Firebase configuration
> is public and its PayFast passphrase is in the Cloud Functions environment
> instead.
>
> A related trap: a secret read in a file that is imported by a Client
> Component is a secret in the bundle. Keep server-only modules server-only, and
> consider the `server-only` package, which makes the mistake a build error.

### Middleware, or the proxy

A single file at the project root runs before every matching request. Use it
for the small set of things that must happen before routing: security headers,
a redirect, a cheap authentication check.

```ts
// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

Keep it small and keep it cheap. It runs on every request, so a database call
here is a database call on every request. Casey Journals uses it for headers and
for refusing known AI crawlers (`packages/core/src/crawlers.ts`, decision 0014);
the entitlement decision is not there, it is in the page, next to the data.

### Deployment

```bash
npm run build     # next build
npm run start     # next start, the production server
```

Vercel is the reference host and both Casey products use it. What matters more
than the host is what the build output tells you: which routes are static,
which are dynamic, and how large the client bundle is. Read it on every build.

**Exercise:** Create a Next.js app with three routes: `/` listing three items
from a module, `/items/[id]` showing one, and `/api/items` returning the list as
JSON. Add a `not-found.tsx`. Then read the `next build` output and explain, in
one sentence each, why every route got the rendering mode it got. Now add
`cookies()` to the list page and read the output again.

---

## Capstone Project: Casey Journal, a Tiered Publication (2026)

Casey Journals is a legal publishing platform: writing, podcasts and video by
lawyers, for readers who need to stay current with the law. Its paywall
decision is on the record and it is unusually strict
(`docs/decisions/0013-paywall-enforcement.md`):

> The server never sends unentitled content; preview only for anonymous
> readers; per-account server-side meter; crawlers verified by DNS;
> `noarchive`; three active sessions per account. **Never add a client-side
> gate.**

You are going to build a small version of that, on Next.js 16 with the App
Router, and prove with `curl` that it holds.

### What you build

1. **A list page** at `/` showing every article with its tier and publication
   date, and the reader's current plan.
2. **An article page** at `/articles/[slug]` that renders the whole article to
   an entitled reader and **one preview paragraph plus a locked panel** to
   everybody else.
3. **A subscribe form** at `/subscribe`, built with `useActionState` and a
   Server Action, validated with Zod on the server, one error message per
   field, and a `useFormStatus` submit button.
4. **Optimistic bookmarks** on the list page: `useOptimistic` plus a Server
   Action, with no rollback code.
5. **A route handler** at `/api/health`.
6. **Tests** with Vitest 4 and Testing Library, covering the paywall, the
   validation, and the optimistic button.

### The rule this capstone is really about

**The withheld paragraphs must never enter the response.**

Not hidden with CSS. Not rendered and covered by an overlay. Not sent in a
`__NEXT_DATA__` payload for a component to filter. **Absent.**

There is one function that decides, it runs on the server, and it is the only
path from an article to a response body:

```ts
export function viewArticle(article: Article, held: Tier): ArticleView {
  if (entitled(held, article.tier)) {
    return { kind: "full", article, body: article.body };
  }
  const { body, ...withoutBody } = article;
  return {
    kind: "preview",
    article: withoutBody,           // note: the body is not on this object
    body: body.slice(0, 1),
    requiredTier: article.tier,
  };
}
```

The `article` in the preview branch has had `body` destructured **off** it. If
somebody later renders `{view.article.title}` and a colleague adds
`{view.article.body}`, it does not compile. That is the type system carrying a
security rule, which is the best place to put one.

### Proving it

This is the acceptance test, and it is not a unit test. Build, start, and ask
the server:

```bash
npm run build
npm run start &

URL=http://localhost:3000/articles/conditions-precedent-that-survive

# A reader with no session
curl -s "$URL" | grep -o "A third paragraph" | wc -l
# 0

# A practitioner
curl -s -H "Cookie: cj_tier=practitioner" "$URL" | grep -o "A third paragraph" | wc -l
# 2

# A forged tier
curl -s -H "Cookie: cj_tier=superuser" "$URL" | grep -o "A third paragraph" | wc -l
# 0
```

Note `grep -o ... | wc -l` rather than `grep -c`. A rendered Next.js page is
effectively one long line, so `grep -c` counts **lines containing** the text
and would report 1 where the text appears twice. Counting occurrences is the
question you meant to ask, and getting this wrong is the sort of measurement
error that makes a security check say what you hoped rather than what is true.

Those three numbers are the deliverable. A test that renders a component in
jsdom cannot produce them, because the question is not "what does the component
show" but "what did the server send".

> **Background (2026): About the cookie.**
>
> The reference solution reads the reader's tier from a cookie, because the
> capstone has no database. **A value the browser can edit must never decide
> entitlement in production.** In a real system that is a session lookup, and
> in Casey Journals it is a server-side check per account with a request meter
> behind it. The comment saying so stays in the reference code, so nobody
> copies the shortcut into something real. Note that the third `curl` above
> tests exactly this: an unknown value falls back to the lowest tier rather
> than to an error or, worse, to trust.

### Structure

```
casey-journal/
  app/
    layout.tsx
    page.tsx                     the list, a Server Component
    globals.css
    actions.ts                   "use server"
    subscribe/page.tsx
    articles/[slug]/page.tsx
    api/health/route.ts
  components/
    bookmark-button.tsx          "use client", useOptimistic
    subscribe-form.tsx           "use client", useActionState
  lib/
    content.ts                   articles, tiers, viewArticle
    reader.ts                    session reads (cookies)
    subscribe.ts                 the Zod schema
    format.ts                    Intl for dates and money
  test/
    setup.ts
    paywall.test.ts
    subscribe.test.ts
    bookmark-button.test.tsx
  next.config.ts
  tsconfig.json
  vitest.config.mts
```

### Rules for the build

- **No content, real or invented.** Article bodies are paragraphs that say
  `PLACEHOLDER`. Author names are `Placeholder Author`. Do not write legal
  copy, and do not paste any: legal wording is owner-approved in the real
  product and it is not yours to improvise.
- **Prices are placeholders too**, and marked as such on the page. Casey
  Journals' launch prices are a dated owner decision and a course is not
  where they get republished.
- **Money is integer cents**, formatted with
  `Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" })`.
- **Dates are ISO strings**, formatted with
  `Intl.DateTimeFormat("en-ZA", { timeZone: "Africa/Johannesburg" })`.
- **`"use client"` goes on the two leaf components and nowhere else.** If you
  find yourself adding it to a page, work out what is really interactive and
  push the boundary down.
- **The subscribe action validates its own input**, even though the form
  already did.

### Features you must use

- [ ] Server Components as the default, `"use client"` only on leaves
- [ ] An `async` page component reading `await params`
- [ ] `generateStaticParams` and `generateMetadata`
- [ ] A Server Action for the form and another for the bookmark
- [ ] `useActionState` with a discriminated union state
- [ ] `useFormStatus` in a child of the form
- [ ] `useOptimistic` inside `startTransition`, with no rollback code
- [ ] A Route Handler returning JSON with `Cache-Control: no-store`
- [ ] Zod 4 with `{ error: ... }` messages, one per field
- [ ] `as const satisfies` on the tier ranking
- [ ] `aria-pressed` and a meaningful `aria-label` on the toggle
- [ ] Vitest 4 configured from `vitest/config`, with an explicit `cleanup`
- [ ] The three `curl` numbers above, in your commit message

### Stretch goals

1. **A read meter.** Allow three full articles a month to a signed-out reader,
   counted **on the server** per session. Then explain in a comment why a
   counter in `localStorage` would be worthless.
2. **`middleware.ts`** setting `X-Content-Type-Options`, `Referrer-Policy` and
   a Content-Security-Policy, and refusing a list of crawler user agents. Then
   read the workbook on why a user-agent check is a courtesy and DNS
   verification is a control.
3. **Streaming.** Wrap the list in `<Suspense>` and pass an unawaited promise
   from the Server Component into a Client Component that calls `use()`. Watch
   the shell arrive before the data.
4. **A podcast feed** at `/api/feed.xml` as a Route Handler, with correct
   `Content-Type` and a `revalidate`.

### Building it on Vite instead

If your project is a single-page app, the capstone still works and the paywall
does not. Say so out loud rather than pretending otherwise: with no server of
your own, the entitlement decision belongs to the API, and the React app can
only ask for what it is allowed and render what comes back.

That is exactly how Mentisflow works. Its Firestore Security Rules are 1043
lines and they are the boundary; the React app renders what the rules let it
read. If you build the Vite version, build it against a small API that enforces
the tier, and treat the client as a display.

---

## Where to Go Next

**(2026)** The next thing is
[`../casey-workbook/workbook.md`](../casey-workbook/workbook.md). This course
taught you to build the screen. The workbook is about everything that decides
whether the screen may show what it shows: trust boundaries, security
standards, data protection engineering, operations, payments, and working with
AI coding agents.

After that, pick a depth direction:

1. **The other path.** If you built the capstone on Next.js, build something
   small on Vite with React Router, or the reverse. Knowing where the seam is
   between them is worth more than depth in either.
2. **React Native with Expo.** Casey Journals' mobile app is Expo Router with
   NativeWind, sharing `packages/core` with the web app. The components differ;
   the hooks do not.
3. **State management.** Zustand or Jotai, if you have genuinely global client
   state. Most applications do not: server state belongs to TanStack Query or
   to the server, and the rest is usually local.
4. **Animation.** Framer Motion, which is what Mentisflow uses, including a
   shared `layoutId` element that glides between navigation tabs. Respect
   `prefers-reduced-motion` from the first line, through
   `useSyncExternalStore` as in Lesson 16.
5. **Component libraries.** Radix UI primitives and shadcn/ui, to see how the
   compound and polymorphic patterns of Lesson 13 look at full size.

**Recommended reading:**

- The official React docs at react.dev, which are the reference for every hook
  in Lesson 16
- The Next.js App Router documentation, particularly the caching and rendering
  pages, which are the part everyone gets wrong
- The official TanStack Query docs, especially the version 5 migration guide
- "Patterns.dev" by Lydia Hallie
- The Web Content Accessibility Guidelines, which is the only item on this list
  that is not optional

Good luck.
