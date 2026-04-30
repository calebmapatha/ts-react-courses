# React with TypeScript: A Practical Course

A follow-on course for developers who completed the TypeScript fundamentals course. By the end you will be able to build, type, test, and ship a real React application. Total time: roughly 15 to 20 hours with exercises.

This course assumes you have completed the TypeScript course in this series and are comfortable with modern JavaScript. It does not assume prior React experience, but a passing familiarity helps.

---

## Lesson 0: Setup

### What is React?

React is a JavaScript library, created by Meta (formerly Facebook), for building user interfaces. You describe what your interface should look like for a given state, and React figures out how to update the page when the state changes. It is the most widely used UI library in the industry.

> **Background: What is a "library" versus a "framework"?**
>
> A library is a collection of code you call into when you need it. A framework calls into your code: it owns the application's structure and you fill in the parts. React is technically a library because it focuses on rendering UI. Frameworks like Next.js are built on top of React and provide routing, server rendering, and project structure.

> **Background: What is the "DOM"?**
>
> DOM stands for Document Object Model. It is the in-memory structure that the browser uses to represent the page. When you write HTML, the browser parses it into a DOM tree. JavaScript can read and modify this tree, and the browser updates the screen. React abstracts away most direct DOM manipulation.

### What is Vite?

Vite is a build tool for modern web projects. It runs a fast development server, bundles your code for production, and supports TypeScript out of the box. It has replaced older tools like Create React App as the default starter for React projects.

> **Background: Why do React projects need a "build tool"?**
>
> React code uses two things browsers do not understand directly: TypeScript (which must be compiled to JavaScript) and JSX (which must be converted to function calls). A build tool transforms your source files into plain JavaScript that browsers can run. It also bundles many files into fewer files for faster loading and provides a development server with hot reloading (your changes appear instantly without a full page refresh).

### Create the project

The modern React + TypeScript starter is **Vite**.

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

Open `http://localhost:5173`. You should see the Vite + React welcome screen.

> **Background: What did `npm create vite@latest` do?**
>
> `npm create` is a shortcut that downloads and runs a starter package. The package generates a project folder with all the files needed for a basic React + TypeScript app. The `--template react-ts` flag tells the starter which template to use.

Look at the generated files:

```
my-app/
  src/
    App.tsx        // your first component
    main.tsx       // entry point
    vite-env.d.ts  // ambient types for Vite
  tsconfig.json
  vite.config.ts
```

> **Background: What is the difference between `.ts` and `.tsx`?**
>
> The `.tsx` extension is required for files that contain JSX (the HTML-like syntax inside React components). The compiler needs the file extension to know whether to parse JSX. Files with only TypeScript code (no JSX) use `.ts`.

> **Background: What is JSX?**
>
> JSX is a syntax extension to JavaScript that lets you write HTML-like code inside JavaScript files. It looks like this: `const greeting = <h1>Hello</h1>`. JSX is not real HTML; the build tool converts it into function calls (`React.createElement(...)`) that produce the same result. JSX makes UI code feel like writing markup while remaining real JavaScript.

Open `tsconfig.json` and confirm `"strict": true` and `"jsx": "react-jsx"` are set.

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

```tsx
// UserList.tsx
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
});
const UserListSchema = z.array(UserSchema);
type User = z.infer<typeof UserSchema>;

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) throw new Error("Failed to fetch");
  const data = await response.json();
  return UserListSchema.parse(data);
}

function UserList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

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
      const response = await fetch("https://api.example.com/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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

```bash
npm install react-router-dom
```

```tsx
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

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

`useParams` returns `Record<string, string | undefined>` by default. Annotate with the params your route expects.

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
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

> **Background: What is `jsdom`?**
>
> `jsdom` is a JavaScript implementation of the DOM that runs in Node.js. Tests need it because they run outside a real browser. With `jsdom`, your tests can render components, query elements, and simulate clicks just like in a browser.

Add to `vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
});
```

Create `src/setupTests.ts`:

```ts
import "@testing-library/jest-dom";
```

Write a test:

```tsx
// Counter.tsx
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

// Counter.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

test("increments when clicked", async () => {
  render(<Counter />);
  const button = screen.getByRole("button", { name: /count: 0/i });
  await userEvent.click(button);
  expect(screen.getByRole("button", { name: /count: 1/i })).toBeInTheDocument();
});
```

Run tests:

```bash
npx vitest
```

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

## Capstone Project: A Typed Issue Tracker

Build a multi-feature application that ties everything together.

**Features:**

1. **Auth:** Mock login form. Persist user in `localStorage` via context.
2. **Issue list:** Fetch issues from a JSON API (use `jsonplaceholder.typicode.com/todos` or a mock). Filter by status.
3. **Issue detail page:** Routed page that shows full issue with comments.
4. **Create issue form:** Validated with Zod, submits via TanStack Query mutation.
5. **Optimistic updates:** Mark an issue as done with instant UI feedback and rollback on error.
6. **Tests:** At least three component tests and one custom hook test.

> **Background: What is an "optimistic update"?**
>
> An optimistic update means changing the UI immediately as if the server request had succeeded, before it actually has. If the request fails, you roll back. This makes the app feel instant. The risk is that you have to handle the rollback carefully. TanStack Query has built-in support for this.

**Required tools:**

- Vite + React + TypeScript
- React Router for pages
- TanStack Query for data
- React Hook Form + Zod for forms
- Vitest + Testing Library for tests

**Suggested folder structure:**

```
src/
  features/
    auth/
      AuthContext.tsx
      LoginForm.tsx
    issues/
      IssueList.tsx
      IssueDetail.tsx
      CreateIssueForm.tsx
      api.ts
      schemas.ts
  shared/
    components/
      Button.tsx
      Modal.tsx
      Spinner.tsx
  App.tsx
  main.tsx
```

When you finish this, you have shipped something that mirrors what you would build at a real job. That is the goal.

---

## Where to Go Next

After the capstone, pick a depth direction:

1. **Next.js with App Router:** The most popular React meta-framework. Adds server components, server actions, and full-stack routing.
2. **Remix or React Router 7:** A different model with deep data-loading conventions.
3. **State management:** Learn Zustand or Jotai if your app has truly global client state. Most apps do not need either.
4. **Animation:** Framer Motion for production-grade animations.
5. **Component libraries:** Study Radix UI primitives and shadcn/ui to learn how serious component design works.

**Recommended reading:**

- The official React docs at react.dev (the new ones, finished in 2023)
- The official TanStack Query docs
- "Patterns.dev" by Lydia Hallie
- "Total TypeScript Pro" by Matt Pocock for advanced React TypeScript patterns

Good luck.
