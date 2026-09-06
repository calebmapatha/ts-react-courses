# React with TypeScript Course: Exercise Solutions

Working solutions for every exercise in the React + TypeScript course. Each
solution is a complete, drop-in component.

**(2026)** To use any solution, save it to a `.tsx` file inside the project from
Lesson 0 and import it. Solutions for Lessons 1 to 16 work on either path;
Lesson 12 is Vite only, Lesson 17 and the capstone are Next.js.

Everything here was type-checked with TypeScript 5.9 and run on React 19.2 and
Node 24.20.0. The capstone was rebuilt from this file into a clean directory,
where `next build` succeeds and all 17 Vitest cases pass, and the paywall was
proved with `curl` against the running production server. The exact output is
at the end of this file.

---

## Lesson 1: Card Component

```tsx
interface CardProps {
  title: string;
  subtitle?: string;
  priority: 1 | 2 | 3;
}

const PRIORITY_COLORS: Record<1 | 2 | 3, string> = {
  1: "#dc2626", // red (highest)
  2: "#f59e0b", // amber
  3: "#16a34a", // green (lowest)
};

export function Card({ title, subtitle, priority }: CardProps) {
  return (
    <div
      style={{
        border: `2px solid ${PRIORITY_COLORS[priority]}`,
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "8px",
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ marginTop: "4px", color: "#666" }}>{subtitle}</p>}
    </div>
  );
}

// Demo usage
export function CardDemo() {
  return (
    <div>
      <Card title="Critical bug" subtitle="Server is down" priority={1} />
      <Card title="Feature request" priority={2} />
      <Card title="Documentation update" subtitle="Low urgency" priority={3} />
    </div>
  );
}
```

**Note:** The literal type `1 | 2 | 3` rejects any other number at compile time. The `Record<1 | 2 | 3, string>` ensures the lookup table covers every possible priority.

---

## Lesson 2: Modal Component

```tsx
import { ReactNode, useEffect } from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button onClick={onClose}>×</button>
        </header>
        <div style={{ marginTop: "16px" }}>{children}</div>
      </div>
    </div>
  );
}

// Demo usage
import { useState } from "react";

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal title="Confirm" isOpen={open} onClose={() => setOpen(false)}>
        <p>Are you sure you want to continue?</p>
        <button onClick={() => setOpen(false)}>Yes</button>
      </Modal>
    </>
  );
}
```

**Note:** The `e.stopPropagation()` on the inner div prevents the backdrop click from triggering when the user clicks inside the modal content.

---

## Lesson 3: Counter With High-Water Mark

```tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  const [highest, setHighest] = useState(0);

  const increment = () => {
    const next = count + 1;
    setCount(next);
    setHighest((current) => Math.max(current, next));
  };

  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Highest reached: {highest}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**Note:** Reset clears the count but preserves `highest`, since the spec says "highest value reached during the session." Using the functional updater form `setHighest((current) => ...)` is safer than reading `highest` directly.

---

## Lesson 4: Search Box With Enter and Clear

```tsx
import { useState } from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBox({ onSearch, placeholder = "Search..." }: SearchBoxProps) {
  const [query, setQuery] = useState("");

  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
      />
      <button onClick={handleClear} disabled={query.length === 0}>
        Clear
      </button>
    </div>
  );
}

// Demo usage
export function SearchDemo() {
  const [results, setResults] = useState<string>("");
  return (
    <div>
      <SearchBox onSearch={(q) => setResults(q ? `Searching: ${q}` : "")} />
      <p>{results}</p>
    </div>
  );
}
```

---

## Lesson 5: useDocumentTitle Hook

```tsx
import { useEffect } from "react";

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

// Demo usage
import { useState } from "react";

export function DocumentTitleDemo() {
  const [page, setPage] = useState("Home");
  useDocumentTitle(`${page} - My App`);

  return (
    <div>
      <p>Current page: {page}</p>
      <button onClick={() => setPage("Home")}>Home</button>
      <button onClick={() => setPage("Profile")}>Profile</button>
      <button onClick={() => setPage("Settings")}>Settings</button>
    </div>
  );
}
```

**Note:** Capturing `previous` inside the effect (not above) is important. If you captured it during render, it would always be the original title rather than whatever was there when the effect ran.

---

## Lesson 6: Todo App With useReducer

```tsx
import { useReducer, useState } from "react";

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

type TodoAction =
  | { type: "add"; text: string }
  | { type: "toggle"; id: string }
  | { type: "remove"; id: string }
  | { type: "editText"; id: string; text: string };

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "add":
      return [...state, { id: crypto.randomUUID(), text: action.text, done: false }];
    case "toggle":
      return state.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t,
      );
    case "remove":
      return state.filter((t) => t.id !== action.id);
    case "editText":
      return state.map((t) =>
        t.id === action.id ? { ...t, text: action.text } : t,
      );
  }
}

export function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim().length === 0) return;
    dispatch({ type: "add", text: input.trim() });
    setInput("");
  };

  return (
    <div>
      <h2>Todos</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="What needs doing?"
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch({ type: "toggle", id: todo.id })}
            />
            <input
              value={todo.text}
              onChange={(e) =>
                dispatch({ type: "editText", id: todo.id, text: e.target.value })
              }
              style={{ textDecoration: todo.done ? "line-through" : "none" }}
            />
            <button onClick={() => dispatch({ type: "remove", id: todo.id })}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Lesson 7: ThemeContext

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggleTheme = () =>
    setTheme((current) => (current === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Demo: a component that uses the theme
function ThemedBox() {
  const { theme, toggleTheme } = useTheme();
  const styles = {
    background: theme === "light" ? "#ffffff" : "#111111",
    color: theme === "light" ? "#000000" : "#ffffff",
    padding: "24px",
    borderRadius: "8px",
  };

  return (
    <div style={styles}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle theme</button>
    </div>
  );
}

export function ThemeDemo() {
  return (
    <ThemeProvider>
      <ThemedBox />
    </ThemeProvider>
  );
}
```

---

## Lesson 8: useDebounce Hook

```tsx
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

// Demo: search box that only fires the search 500ms after typing stops
export function DebouncedSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length === 0) return;
    console.log("Searching for:", debouncedQuery);
    // In a real app, fire your API call here
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      <p>Live value: {query}</p>
      <p>Debounced value: {debouncedQuery}</p>
    </div>
  );
}
```

---

## Lesson 9: Generic Select Component

```tsx
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getKey: (option: T) => string | number;
}

export function Select<T>({
  options,
  value,
  onChange,
  getLabel,
  getKey,
}: SelectProps<T>) {
  return (
    <select
      value={String(getKey(value))}
      onChange={(event) => {
        const selected = options.find(
          (option) => String(getKey(option)) === event.target.value,
        );
        if (selected !== undefined) onChange(selected);
      }}
    >
      {options.map((option) => (
        <option key={getKey(option)} value={String(getKey(option))}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

// Demo: works for both primitive options and object options
import { useState } from "react";

interface Country {
  code: string;
  name: string;
  flag: string;
}

// (2026) A readonly tuple, not an array. Under `noUncheckedIndexedAccess`,
// `countries[0]` on a plain `Country[]` is `Country | undefined` and does not
// satisfy `useState<Country>`. With `as const` the compiler knows the length,
// so index 0 is a `Country`. That is a better answer than `countries[0]!`,
// because it is true rather than asserted.
const countries = [
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
] as const satisfies readonly Country[];

export function SelectDemo() {
  const [country, setCountry] = useState<Country>(countries[0]);
  return (
    <div>
      <Select
        options={[...countries]}
        value={country}
        onChange={setCountry}
        getLabel={(c) => `${c.flag} ${c.name}`}
        getKey={(c) => c.code}
      />
      <p>You picked: {country.name}</p>
    </div>
  );
}
```

**Note:** The keys are coerced to strings for the underlying `<select>`
element, because HTML attributes are always strings. The lookup back to the
original object preserves the full type, which is the whole reason to make the
component generic rather than taking `{ label, value }` pairs.

**Note (2026): `as const satisfies readonly Country[]`.** `satisfies` checks
every entry against `Country`, so a typo in `flag` or a missing `name` fails to
compile. `as const` keeps the tuple length, which is what makes `countries[0]`
a `Country` rather than `Country | undefined` under
`noUncheckedIndexedAccess`. The `[...countries]` spread at the call site is
because `Select` takes a mutable `T[]`; widening `SelectProps` to
`readonly T[]` would remove it, and is the better fix if the component is
yours.

---

## Lesson 10: Create Event Form With Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const EventSchema = z.object({
  title: z.string().min(1, { error: "Enter a title." }).max(100),
  date: z.iso.datetime({ local: true, error: "Choose a date and a time." }),
  location: z.string().min(1, { error: "Enter a location." }),
  // (2026) Zod 4: one `error` option replaces `invalid_type_error`,
  // `required_error` and the bare-string second argument.
  maxAttendees: z
    .int({ error: "Enter a whole number of attendees." })
    .positive({ error: "There must be at least one attendee." }),
});

type EventForm = z.infer<typeof EventSchema>;

export function CreateEventForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<EventForm>({
    resolver: zodResolver(EventSchema),
  });

  const onSubmit = async (data: EventForm) => {
    console.log("Creating event:", data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create event</h2>

      <div>
        <label>Title</label>
        <input {...register("title")} />
        {errors.title && <span style={{ color: "red" }}>{errors.title.message}</span>}
      </div>

      <div>
        <label>Date</label>
        <input type="datetime-local" {...register("date")} />
        {errors.date && <span style={{ color: "red" }}>{errors.date.message}</span>}
      </div>

      <div>
        <label>Location</label>
        <input {...register("location")} />
        {errors.location && (
          <span style={{ color: "red" }}>{errors.location.message}</span>
        )}
      </div>

      <div>
        <label>Max attendees</label>
        <input type="number" {...register("maxAttendees", { valueAsNumber: true })} />
        {errors.maxAttendees && (
          <span style={{ color: "red" }}>{errors.maxAttendees.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create event"}
      </button>

      {isSubmitSuccessful && <p style={{ color: "green" }}>Event created!</p>}
    </form>
  );
}
```

Install dependencies:

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Note (2026): `z.iso.datetime({ local: true })`.** An
`<input type="datetime-local">` submits `2026-09-06T14:00`, with no timezone
offset, which is exactly what `local: true` accepts and what plain
`z.iso.datetime()` rejects. Validating the shape the input actually produces,
rather than the shape you wish it produced, is most of what boundary
validation is.

**Note (2026): consider `useActionState` instead.** Lesson 16 rebuilds this
form with a Server Action and no form library at all. React Hook Form still
earns its place on large forms with field arrays, cross-field validation and
watched values. For a form of four fields that posts once, the built-in Action
is fewer moving parts and it works before the JavaScript loads.

---

## Lesson 11: Paginated Posts With TanStack Query

**`lib/articles.ts`**

```tsx
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { z } from "zod";

const Article = z.object({
  id: z.int(),
  title: z.string(),
  standfirst: z.string(),
});

const ArticleList = z.array(Article);
export type Article = z.infer<typeof Article>;

const PAGE_SIZE = 10;

async function fetchArticles(page: number): Promise<Article[]> {
  const url = new URL("/api/articles", window.location.origin);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(PAGE_SIZE));

  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`HTTP ${response.status} loading page ${page}`);
  return ArticleList.parse(await response.json());
}

// One definition. Every caller gets the same key and the same result type.
export const articlesPage = (page: number) =>
  queryOptions({
    queryKey: ["articles", { page }] as const,
    queryFn: () => fetchArticles(page),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const ARTICLES_PAGE_SIZE = PAGE_SIZE;
```

**`PaginatedArticles.tsx`**

```tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ARTICLES_PAGE_SIZE, articlesPage } from "./lib/articles";

export function PaginatedArticles() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, isFetching } = useQuery(articlesPage(page));

  if (isPending) return <p>Loading the first page</p>;
  if (isError) return <p role="alert">Could not load articles: {error.message}</p>;

  const atLastPage = data.length < ARTICLES_PAGE_SIZE;

  return (
    <div aria-busy={isFetching}>
      <h2>Articles, page {page}</h2>
      <ul>
        {data.map((article) => (
          <li key={article.id}>
            <strong>{article.title}</strong>
            <p>{article.standfirst}</p>
          </li>
        ))}
      </ul>
      <nav>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span> Page {page} </span>
        <button onClick={() => setPage((p) => p + 1)} disabled={isFetching || atLastPage}>
          Next
        </button>
      </nav>
    </div>
  );
}
```

**Note on `isPending`.** After the `isPending` and `isError` guards, `data` is
`Article[]`, not `Article[] | undefined`, so `data.map` needs no `?.` and
`data.length` is safe. Checking `isPending` first is how you buy that
narrowing. `isLoading` in version 5 means "pending **and** fetching" and would
not have narrowed it.

**Note on `keepPreviousData`.** It stops the list flashing empty between pages.
The `error.message` is shown because a user who cannot see what failed cannot
tell you what to fix; `isFetching` drives `aria-busy` so the change is
announced rather than only drawn.

**Note on the URL.** The old solution called a public placeholder API. This one
calls `/api/articles` on the same origin, which you provide: a Route Handler on
the Next.js path, a small Express or `node:http` server on the Vite path. A
test for this component should mock `fetch` and never touch a network.

---

## Lesson 12: Three-Route App

```tsx
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Laptop", description: "15-inch laptop", price: 1500 },
  { id: 2, name: "Phone", description: "Latest model", price: 800 },
  { id: 3, name: "Headphones", description: "Noise-cancelling", price: 200 },
];

function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Browse our products from the menu above.</p>
    </div>
  );
}

function ProductList() {
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {PRODUCTS.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              {product.name} - ${product.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div>
        <h1>Product not found</h1>
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <Link to="/products">Back to products</Link>
    </div>
  );
}

function NotFound() {
  return <h1>404 - Page not found</h1>;
}

export function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "16px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "16px" }}>Home</Link>
        <Link to="/products">Products</Link>
      </nav>
      <main style={{ padding: "16px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
```

---

## Lesson 13: Compound Accordion Component

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface AccordionContextValue {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<string | null>(null);

function useAccordionContext(componentName: string) {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(`${componentName} must be used inside <Accordion>`);
  }
  return ctx;
}

function useItemContext(componentName: string) {
  const id = useContext(ItemContext);
  if (id === null) {
    throw new Error(`${componentName} must be used inside <Accordion.Item>`);
  }
  return id;
}

function Root({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <AccordionContext.Provider value={{ openId, setOpenId }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}

function Item({ id, children }: { id: string; children: ReactNode }) {
  return (
    <ItemContext.Provider value={id}>
      <div style={{ borderBottom: "1px solid #ccc" }}>{children}</div>
    </ItemContext.Provider>
  );
}

function Header({ children }: { children: ReactNode }) {
  const { openId, setOpenId } = useAccordionContext("Accordion.Header");
  const id = useItemContext("Accordion.Header");
  const isOpen = openId === id;

  return (
    <button
      onClick={() => setOpenId(isOpen ? null : id)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "12px",
        background: isOpen ? "#f0f0f0" : "transparent",
        border: "none",
        cursor: "pointer",
        fontWeight: isOpen ? "bold" : "normal",
      }}
    >
      {children} {isOpen ? "▼" : "▶"}
    </button>
  );
}

function Body({ children }: { children: ReactNode }) {
  const { openId } = useAccordionContext("Accordion.Body");
  const id = useItemContext("Accordion.Body");
  if (openId !== id) return null;
  return <div style={{ padding: "12px" }}>{children}</div>;
}

export const Accordion = Object.assign(Root, {
  Item,
  Header,
  Body,
});

// Demo usage
export function AccordionDemo() {
  return (
    <Accordion>
      <Accordion.Item id="one">
        <Accordion.Header>What is TypeScript?</Accordion.Header>
        <Accordion.Body>
          A typed superset of JavaScript that compiles to plain JavaScript.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item id="two">
        <Accordion.Header>Why use it with React?</Accordion.Header>
        <Accordion.Body>
          It catches prop and state errors at compile time and improves refactoring.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item id="three">
        <Accordion.Header>Is it hard to learn?</Accordion.Header>
        <Accordion.Body>
          The basics take a weekend if you already know JavaScript.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
```

**Note:** `Object.assign(Root, { Item, Header, Body })` is a clean way to attach the subcomponents to the parent. It also typechecks properly without needing namespace declarations.

---

## Lesson 14: Tests for the Signup Form

```tsx
// test/signup-form.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { SignupForm } from "../SignupForm";

describe("SignupForm", () => {
  test("an empty submission reports every missing field", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText(/invalid email/i)).toBeTruthy();
    expect(screen.getByText(/at least 8 characters/i)).toBeTruthy();
  });

  test("an address that is not an address is refused", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText(/invalid email/i)).toBeTruthy();
  });

  test("an age below eighteen is refused", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText(/age/i), "16");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText(/18 or older/i)).toBeTruthy();
  });

  test("a valid submission reaches the handler once, with parsed values", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<SignupForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "reader@example.com");
    await user.type(screen.getByLabelText(/password/i), "correct horse");
    await user.type(screen.getByLabelText(/age/i), "25");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledExactlyOnceWith({
        email: "reader@example.com",
        password: "correct horse",
        age: 25,
      });
    });
  });
});
```

**Note (2026): three changes from the older version of this solution.**

**`getByLabelText`, not `getByPlaceholderText`.** A placeholder is not a label:
it disappears when the field has content, screen readers treat it
inconsistently, and a form whose only labels are placeholders fails
accessibility review. Querying by label is both the better test and a check
that the label exists.

**A spy on the component's own prop, not on `console.log`.** Spying on
`console` couples the test to a debugging statement somebody will delete.
Passing `onSubmit` in makes the contract explicit and gives you
`toHaveBeenCalledExactlyOnceWith`, which catches a double submission that
`toHaveBeenCalledWith` would pass.

**No `toBeInTheDocument`.** These solutions leave out
`@testing-library/jest-dom`, so assertions use plain `expect`. `getBy*` throws
when nothing matches, so `expect(...).toBeTruthy()` is checking that the query
returned, which is what the jest-dom matcher was doing more prettily. Add the
package if your team already uses it.

**And one thing that did not change:** every query is by role, label or visible
text. Never by class name, and by test id only when nothing user-visible
identifies the element.

---

## Capstone: Casey Journal, a Tiered Publication

A complete reference implementation on Next.js 16.3, React 19.2 and Vitest 4.
Rebuilt from this file into a clean directory: `next build` succeeds, all 17
Vitest cases pass, and the paywall was proved with `curl` against the running
production server. The exact output is at the end.

Article bodies say `PLACEHOLDER`. Prices are placeholders and the page says so.
No legal copy appears anywhere in this project, because legal wording is
owner-approved in the real product and a course is not where it gets
republished.

**`package.json`**

```json
{
  "name": "casey-journal-capstone",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "16.3.4",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "zod": "4.5.4"
  },
  "devDependencies": {
    "@testing-library/react": "16.3.3",
    "@testing-library/user-event": "14.6.1",
    "@types/node": "24.10.1",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.7",
    "@vitejs/plugin-react": "6.1.1",
    "jsdom": "27.4.0",
    "typescript": "5.9.3",
    "vitest": "4.1.11"
  }
}
```

**`tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ES2024"
    ],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "allowJs": true,
    "noEmit": true,
    "incremental": true,
    "types": [
      "node"
    ],
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

**Note on `lib`.** `ES2024` rather than `ES2023`, because the bookmark test
uses `Promise.withResolvers`. `lib` describes what the runtime provides;
`target` describes what the output may use. They are different questions and
the compiler asks them separately. Casey Journals pins `ES2022` for both, which
is why `toSorted` in `lib/content.ts` would not compile there without the same
bump.

**`next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
};

export default nextConfig;
```

**`vitest.config.mts`**

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["test/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: { "@": new URL(".", import.meta.url).pathname },
  },
});
```

### The domain

**`lib/content.ts`**

```ts
// The article store. In a real product this is a database behind row-level
// security; here it is a module so the capstone runs with nothing installed.
// What matters is where it is READ from, which is the server, always.

export const TIERS = ["free", "reader", "practitioner"] as const;
export type Tier = (typeof TIERS)[number];

/** How much of a tier a reader must hold to see content at that tier. */
const RANK = { free: 0, reader: 1, practitioner: 2 } as const satisfies Record<Tier, number>;

export type Article = {
  readonly slug: string;
  readonly title: string;
  readonly standfirst: string;
  readonly tier: Tier;
  readonly publishedOn: string;
  readonly author: string;
  /** Paragraphs. Never sent to a reader who has not earned them. */
  readonly body: readonly string[];
};

const ARTICLES: readonly Article[] = [
  {
    slug: "notice-periods-in-lease-agreements",
    title: "Notice periods in lease agreements",
    standfirst: "What the Rental Housing Act requires, and what parties keep getting wrong.",
    tier: "free",
    publishedOn: "2026-08-14",
    author: "Placeholder Author",
    body: [
      "PLACEHOLDER. This paragraph stands in for editorial copy.",
      "PLACEHOLDER. A second paragraph, so the preview has something to cut.",
      "PLACEHOLDER. A third paragraph that only an entitled reader receives.",
    ],
  },
  {
    slug: "drafting-a-letter-of-demand",
    title: "Drafting a letter of demand",
    standfirst: "The parts that matter, in the order a court reads them.",
    tier: "reader",
    publishedOn: "2026-08-28",
    author: "Placeholder Author",
    body: [
      "PLACEHOLDER. This paragraph stands in for editorial copy.",
      "PLACEHOLDER. A second paragraph, so the preview has something to cut.",
      "PLACEHOLDER. A third paragraph that only an entitled reader receives.",
      "PLACEHOLDER. A fourth paragraph, likewise.",
    ],
  },
  {
    slug: "conditions-precedent-that-survive",
    title: "Conditions precedent that survive the deal",
    standfirst: "Fulfilment, waiver, and the day-count arithmetic nobody checks.",
    tier: "practitioner",
    publishedOn: "2026-09-04",
    author: "Placeholder Author",
    body: [
      "PLACEHOLDER. This paragraph stands in for editorial copy.",
      "PLACEHOLDER. A second paragraph, so the preview has something to cut.",
      "PLACEHOLDER. A third paragraph that only an entitled reader receives.",
    ],
  },
];

export function listArticles(): readonly Article[] {
  return ARTICLES.toSorted((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** Does a reader holding `held` reach content at `required`? */
export function entitled(held: Tier, required: Tier): boolean {
  return RANK[held] >= RANK[required];
}

export type ArticleView =
  | { readonly kind: "full"; readonly article: Article; readonly body: readonly string[] }
  | {
      readonly kind: "preview";
      readonly article: Omit<Article, "body">;
      readonly body: readonly string[];
      readonly requiredTier: Tier;
    };

const PREVIEW_PARAGRAPHS = 1;

/**
 * THE PAYWALL. This function is the only way an article body reaches a
 * response, and it runs on the server. An unentitled reader is handed the
 * preview paragraphs and nothing else: the rest of the text never enters the
 * HTML, so it cannot be recovered by disabling JavaScript, reading the
 * payload, or editing state in a browser tool.
 *
 * A client-side gate that renders the whole article and hides it with CSS is
 * not a paywall. It is a suggestion.
 */
export function viewArticle(article: Article, held: Tier): ArticleView {
  if (entitled(held, article.tier)) {
    return { kind: "full", article, body: article.body };
  }
  const { body, ...withoutBody } = article;
  return {
    kind: "preview",
    article: withoutBody,
    body: body.slice(0, PREVIEW_PARAGRAPHS),
    requiredTier: article.tier,
  };
}
```

**Note on `viewArticle`, which is the whole exercise.** The preview branch
destructures `body` **off** the article before returning it. The returned
`article` therefore has type `Omit<Article, "body">`, and any later attempt to
render `view.article.body` in the preview case is a compile error rather than a
leak. That is a security rule expressed as a type, which is the only kind that
cannot be forgotten during a refactor.

**Note on `RANK`.** `as const satisfies Record<Tier, number>` means adding a
fourth tier to `TIERS` without ranking it fails to compile, naming the file and
the line. Without `satisfies`, `entitled` would return `NaN >= 0`, which is
`false`, and the new tier would silently see nothing.

**`lib/reader.ts`**

```ts
import { cookies } from "next/headers";
import { TIERS, type Tier } from "./content";

const TIER_COOKIE = "cj_tier";
const BOOKMARK_COOKIE = "cj_bookmarks";

function isTier(value: string | undefined): value is Tier {
  return value !== undefined && (TIERS as readonly string[]).includes(value);
}

/**
 * The reader's tier, read on the server.
 *
 * A cookie is used here because the capstone has no database. In production
 * this is a session lookup: a value the browser can edit must never decide
 * entitlement. That is the whole point of the exercise, and the comment stays
 * in the code so nobody copies this into something real.
 */
export async function readerTier(): Promise<Tier> {
  const store = await cookies();
  const value = store.get(TIER_COOKIE)?.value;
  return isTier(value) ? value : "free";
}

export async function readerBookmarks(): Promise<ReadonlySet<string>> {
  const store = await cookies();
  const raw = store.get(BOOKMARK_COOKIE)?.value ?? "";
  return new Set(raw.split(",").filter((slug) => slug !== ""));
}

export async function writeBookmarks(slugs: ReadonlySet<string>): Promise<void> {
  const store = await cookies();
  store.set(BOOKMARK_COOKIE, [...slugs].join(","), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export const TIER_COOKIE_NAME = TIER_COOKIE;
```

**Note on the cookie, again.** It is a teaching shortcut and the comment in the
file says so. `readerTier` falls back to `"free"` for any value it does not
recognise, which is why the forged-cookie `curl` below returns zero. **Fail
closed:** an unrecognised session is the lowest privilege, never an error page
and never a default of trust.

**`lib/subscribe.ts`**

```ts
import { z } from "zod";
import { TIERS } from "./content";

/** Validated on the server. The client form is a convenience, not a control. */
export const SubscribeInput = z.object({
  email: z.email({ error: "Enter an email address we can reach you at." }),
  tier: z.enum(TIERS, { error: "Choose one of the listed plans." }),
  consent: z.literal("on", {
    error: "We need your agreement before we may email you.",
  }),
});

export type SubscribeState =
  | { readonly status: "idle" }
  | { readonly status: "ok"; readonly email: string }
  | { readonly status: "error"; readonly errors: Readonly<Record<string, string>> };

export const IDLE: SubscribeState = { status: "idle" };

/** Flatten Zod issues into one message per field, which is what a form shows. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    out[key] ??= issue.message;
  }
  return out;
}
```

**Note on `fieldErrors`.** It keeps the **first** message per field (`out[key]
??= issue.message`). A form that stacks three messages under one input is
harder to act on than one that names the first thing to fix.

**`lib/format.ts`**

```ts
const LONG_DATE = new Intl.DateTimeFormat("en-ZA", {
  timeZone: "Africa/Johannesburg",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const RANDS = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  minimumFractionDigits: 0,
});

/** "2026-09-04" becomes "4 September 2026". */
export function formatDay(iso: string): string {
  return LONG_DATE.format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Money is integer cents everywhere in this app. 19900 becomes "R 199".
 * Intl uses a no-break space, normalised here so tests and copied text behave.
 */
export function formatCents(cents: number): string {
  return RANDS.format(cents / 100).replaceAll("\u00A0", " ");
}
```

### The server actions

**`app/actions.ts`**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { findArticle } from "@/lib/content";
import { readerBookmarks, writeBookmarks } from "@/lib/reader";
import { fieldErrors, IDLE, SubscribeInput, type SubscribeState } from "@/lib/subscribe";

/**
 * A Server Action is a PUBLIC ENDPOINT. Next.js gives it a URL and anybody can
 * post to it. Everything below therefore validates its own input and reads its
 * own session; nothing is trusted because a form rendered it.
 */
export async function subscribe(
  _previous: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const parsed = SubscribeInput.safeParse({
    email: formData.get("email"),
    tier: formData.get("tier"),
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error) };
  }

  // A real implementation records the consent event here: what was agreed, to
  // what wording, at what time. See the workbook on consent as events.
  await new Promise((resolve) => setTimeout(resolve, 200));

  return { status: "ok", email: parsed.data.email };
}

export async function resetSubscribe(): Promise<SubscribeState> {
  return IDLE;
}

/**
 * Toggle a bookmark. The client renders the change immediately with
 * useOptimistic; this is the server deciding what actually happened.
 */
export async function toggleBookmark(slug: string): Promise<{ bookmarked: boolean }> {
  if (findArticle(slug) === undefined) {
    throw new Error(`No article with slug "${slug}".`);
  }

  const current = new Set(await readerBookmarks());
  const bookmarked = !current.has(slug);

  if (bookmarked) current.add(slug);
  else current.delete(slug);

  await writeBookmarks(current);
  revalidatePath("/");
  return { bookmarked };
}
```

**Note on the comment at the top.** It is the most important comment in the
project. A Server Action is a public endpoint: it has a URL, and anybody can
post to it. `subscribe` validates its own input even though the form already
did. `toggleBookmark` checks that the slug names a real article, and reads the
session itself rather than accepting a user id as an argument.

**Note on `revalidatePath`.** Without it the list page would keep serving its
cached render and the bookmark would appear to revert on the next navigation.
With it, the optimistic value and the eventual real value agree, which is why
there is no flicker.

### The pages

**`app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casey Journal",
  description: "A teaching capstone modelled on a tiered legal publication.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <body>
        <main>
          <header>
            <p className="meta">
              <Link href="/">Casey Journal</Link> · <Link href="/subscribe">Subscribe</Link>
            </p>
            <hr />
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
```

**`app/page.tsx`**

```tsx
import Link from "next/link";
import { BookmarkButton } from "@/components/bookmark-button";
import { listArticles } from "@/lib/content";
import { formatDay } from "@/lib/format";
import { readerBookmarks, readerTier } from "@/lib/reader";

// This page is a Server Component. It reads the session and the article list
// on the server, and ships no data-fetching JavaScript to the browser.
export default async function HomePage() {
  const [tier, bookmarks] = await Promise.all([readerTier(), readerBookmarks()]);
  const articles = listArticles();

  return (
    <>
      <h1>Casey Journal</h1>
      <p className="meta">You are reading on the {tier} plan.</p>

      {articles.map((article) => (
        <article key={article.slug}>
          <hr />
          <h2>
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </h2>
          <p>{article.standfirst}</p>
          <p className="meta">
            {formatDay(article.publishedOn)} · {article.tier}{" "}
          </p>
          <BookmarkButton
            slug={article.slug}
            title={article.title}
            bookmarked={bookmarks.has(article.slug)}
          />
        </article>
      ))}
    </>
  );
}
```

**Note on `Promise.all`.** `readerTier()` and `readerBookmarks()` do not depend
on each other, so they are awaited together. Two sequential `await`s here would
be two round trips for no reason. This is the same lesson as the JavaScript
course's sequential-versus-parallel section, in its natural habitat.

**Note on what is not here.** No `useEffect`, no loading state, no
`QueryClientProvider`. This is a Server Component: the data is read before the
HTML exists, so there is no moment at which the page has no data. The only
JavaScript this page ships is `BookmarkButton`.

**`app/articles/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { findArticle, listArticles, viewArticle } from "@/lib/content";
import { formatDay } from "@/lib/format";
import { readerTier } from "@/lib/reader";

export function generateStaticParams() {
  return listArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findArticle(slug);
  return article === undefined
    ? { title: "Not found" }
    : { title: article.title, description: article.standfirst };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (article === undefined) notFound();

  // The entitlement decision happens here, on the server, before any body text
  // is chosen. `view.body` is what reaches the HTML and it is all that reaches
  // the HTML.
  const view = viewArticle(article, await readerTier());

  return (
    <>
      <h1>{view.article.title}</h1>
      <p className="meta">
        {formatDay(view.article.publishedOn)} · {view.article.author}
      </p>

      {view.body.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}

      {view.kind === "preview" ? (
        <div className="locked">
          <h2>The rest of this article is for {view.requiredTier} subscribers</h2>
          <p>
            The remaining paragraphs were never sent to your browser. Nothing is
            hidden here; there is nothing to reveal.
          </p>
          <p>
            <Link href="/subscribe">See the plans</Link>
          </p>
        </div>
      ) : null}
    </>
  );
}
```

**Note on the shape.** `viewArticle` is called before any body text is chosen,
and `view.body` is the only thing rendered. There is no branch in which the
full body is in scope and conditionally hidden. Compare with the version people
write first:

```tsx
// WRONG. Every paragraph is in the HTML; the CSS is the only thing stopping you.
<div className={entitled ? "" : "blurred"}>
  {article.body.map((p) => <p>{p}</p>)}
</div>
```

**Note on `generateStaticParams` with a dynamic page.** The params are
pre-computed, but the page still renders per request because it reads a cookie.
That is correct and the build output says `ƒ /articles/[slug]`. A cached render
would be served to the wrong reader, which is the bug the whole capstone is
about.

**`app/subscribe/page.tsx`**

```tsx
import { SubscribeForm } from "@/components/subscribe-form";
import { formatCents } from "@/lib/format";

// PLACEHOLDER PRICES. Casey Journals' real launch prices are a dated owner
// decision (docs/decisions/0012-launch-pricing.md) and are not reproduced here.
const PLAN_CENTS = { free: 0, reader: 19900, practitioner: 39900 } as const;

export default function SubscribePage() {
  return (
    <>
      <h1>Subscribe</h1>
      <p className="meta">
        Reader {formatCents(PLAN_CENTS.reader)} a month · Practitioner{" "}
        {formatCents(PLAN_CENTS.practitioner)} a month. Placeholder figures.
      </p>
      <SubscribeForm />
    </>
  );
}
```

**`app/api/health/route.ts`**

```ts
import { NextResponse } from "next/server";

/**
 * A Route Handler: a plain HTTP endpoint under app/. Use one when the caller
 * is not a React tree (a webhook, a health check, a feed). Use a Server Action
 * when the caller is your own form.
 */
export function GET() {
  return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
```

**`app/globals.css`**

```css
:root {
  --ink: #111111;
  --paper: #ffffff;
  --rule: #dddddd;
  --muted: #555555;
  color-scheme: light;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.6;
}

main { max-width: 42rem; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
a { color: inherit; }
hr { border: 0; border-top: 1px solid var(--rule); margin: 2rem 0; }
.meta { color: var(--muted); font-size: 0.875rem; font-family: system-ui, sans-serif; }
.locked { border: 1px solid var(--rule); padding: 1.25rem; margin-top: 2rem; }
.field { display: block; margin-bottom: 1rem; font-family: system-ui, sans-serif; }
.field input, .field select { display: block; width: 100%; padding: 0.5rem; margin-top: 0.25rem; }
.error { color: #b00020; font-size: 0.875rem; font-family: system-ui, sans-serif; }
button { font: inherit; padding: 0.5rem 1rem; cursor: pointer; }
button[aria-pressed="true"] { font-weight: bold; }
```

### The client components

**`components/subscribe-form.tsx`**

```tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribe } from "@/app/actions";
import { TIERS } from "@/lib/content";
import { IDLE, type SubscribeState } from "@/lib/subscribe";

function SubmitButton() {
  // useFormStatus reads the state of the enclosing form. It only works in a
  // CHILD of the form, which is why this is its own component.
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Subscribing" : "Subscribe"}
    </button>
  );
}

export function SubscribeForm() {
  const [state, formAction] = useActionState<SubscribeState, FormData>(subscribe, IDLE);

  if (state.status === "ok") {
    return <p role="status">Check {state.email} for a confirmation link.</p>;
  }

  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={formAction} noValidate>
      <label className="field">
        Email address
        <input
          name="email"
          type="email"
          required
          aria-invalid={errors["email"] !== undefined}
          aria-describedby={errors["email"] ? "email-error" : undefined}
        />
      </label>
      {errors["email"] ? (
        <p className="error" id="email-error">{errors["email"]}</p>
      ) : null}

      <label className="field">
        Plan
        <select name="tier" defaultValue="reader">
          {TIERS.map((tier) => (
            <option key={tier} value={tier}>{tier}</option>
          ))}
        </select>
      </label>
      {errors["tier"] ? <p className="error">{errors["tier"]}</p> : null}

      <label className="field">
        <input name="consent" type="checkbox" />
        {" "}I agree to receive the newsletter.
      </label>
      {errors["consent"] ? <p className="error">{errors["consent"]}</p> : null}

      <SubmitButton />
    </form>
  );
}
```

**Note on `SubmitButton` being a separate component.** `useFormStatus` reads
the form **above** it. Called in the same component that renders the `<form>`,
it returns `pending: false` forever. Splitting it out is not style; it is the
API.

**Note on `aria-invalid` and `aria-describedby`.** An error rendered as a red
paragraph beside an input is invisible to a screen reader unless the input
points at it. Two attributes, and the difference between a form that works for
everybody and one that does not.

**Note on `noValidate`.** The browser's own validation bubbles would fire
before the action ran, and the messages would be the browser's rather than
yours. The `required` and `type="email"` attributes stay, because they still
drive the mobile keyboard and the autofill behaviour.

**`components/bookmark-button.tsx`**

```tsx
"use client";

import { useOptimistic, useTransition } from "react";
import { toggleBookmark } from "@/app/actions";

type Props = {
  slug: string;
  title: string;
  bookmarked: boolean;
};

/**
 * The optimistic bookmark.
 *
 * `useOptimistic` gives a value that follows the real prop, except while a
 * transition is running, when it shows what you expect the answer to be.
 * React discards the optimistic value automatically when the transition ends,
 * so a failed action rolls back with no rollback code.
 */
export function BookmarkButton({ slug, title, bookmarked }: Props) {
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

**Note on where the rollback is.** There is not one. `useOptimistic` returns
the prop, except during a transition, when it returns what you set. When the
transition ends the optimistic value is dropped and the prop wins. Succeed and
the prop already agrees; fail and it snaps back. The `try`/`catch`/restore
dance that optimistic updates used to require is gone, and with it the bug
where the restore ran but a second click had already changed the value.

**Note on `aria-pressed`.** This is a toggle, not an action, so it takes
`aria-pressed` rather than changing its accessible name alone. The `aria-label`
changes too, so a screen-reader user hears what the button will do rather than
what state it is in.

### The tests

**`test/setup.ts`**

```ts
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Testing Library unmounts automatically only when a global `afterEach` exists,
// which means `globals: true`. This project keeps globals off and does it by
// hand: leftover components from a previous test are the cause of most
// "found multiple elements" failures.
afterEach(cleanup);
```

**`test/paywall.test.ts`**

```ts
import { describe, expect, test } from "vitest";
import { entitled, findArticle, listArticles, viewArticle, type Tier } from "@/lib/content";

const article = findArticle("conditions-precedent-that-survive")!;

describe("entitlement", () => {
  test("a tier reaches its own content and everything below it", () => {
    expect(entitled("practitioner", "free")).toBe(true);
    expect(entitled("practitioner", "reader")).toBe(true);
    expect(entitled("practitioner", "practitioner")).toBe(true);
  });

  test("a tier does not reach content above it", () => {
    expect(entitled("free", "reader")).toBe(false);
    expect(entitled("reader", "practitioner")).toBe(false);
  });
});

describe("the paywall withholds text rather than hiding it", () => {
  test("an entitled reader gets every paragraph", () => {
    const view = viewArticle(article, "practitioner");
    expect(view.kind).toBe("full");
    expect(view.body).toEqual(article.body);
  });

  test("an unentitled reader gets the preview and NOTHING else", () => {
    const view = viewArticle(article, "free");
    expect(view.kind).toBe("preview");
    expect(view.body).toHaveLength(1);
    expect(view.body[0]).toBe(article.body[0]);
  });

  test("the withheld paragraphs are absent from the returned value entirely", () => {
    const view = viewArticle(article, "free");
    const serialised = JSON.stringify(view);
    for (const paragraph of article.body.slice(1)) {
      expect(serialised).not.toContain(paragraph);
    }
  });

  test("a preview carries no body field on the article itself", () => {
    const view = viewArticle(article, "free");
    expect(view.kind === "preview" && "body" in view.article).toBe(false);
  });

  test("every tier is handled for every article", () => {
    const tiers: Tier[] = ["free", "reader", "practitioner"];
    for (const item of listArticles()) {
      for (const tier of tiers) {
        const view = viewArticle(item, tier);
        expect(view.body.length).toBeGreaterThan(0);
        expect(view.body.length).toBeLessThanOrEqual(item.body.length);
      }
    }
  });
});
```

**Note on the third test.** `JSON.stringify(view)` and then asserting the
withheld paragraphs are **not in the string** is the closest a unit test gets to
the real question. It would catch somebody adding `body` back onto the preview
object for convenience. It does not replace the `curl` check below, because
serialising a value in a test is not the same as rendering a page.

**`test/subscribe.test.ts`**

```ts
import { describe, expect, test } from "vitest";
import { fieldErrors, SubscribeInput } from "@/lib/subscribe";

const valid = { email: "reader@example.com", tier: "reader", consent: "on" };

describe("subscribe input", () => {
  test("accepts a complete submission", () => {
    expect(SubscribeInput.safeParse(valid).success).toBe(true);
  });

  test("refuses an address that is not an address", () => {
    const result = SubscribeInput.safeParse({ ...valid, email: "reader" });
    expect(result.success).toBe(false);
    expect(fieldErrors(result.error!)["email"]).toMatch(/email address/i);
  });

  test("refuses a plan that is not offered", () => {
    const result = SubscribeInput.safeParse({ ...valid, tier: "enterprise" });
    expect(fieldErrors(result.error!)["tier"]).toMatch(/listed plans/i);
  });

  test("refuses an unticked consent box, and says why in the user's terms", () => {
    const result = SubscribeInput.safeParse({ ...valid, consent: null });
    expect(fieldErrors(result.error!)["consent"]).toMatch(/agreement before we may email/i);
  });

  test("reports one message per field, not a list per field", () => {
    const result = SubscribeInput.safeParse({ email: "no", tier: "no", consent: null });
    const errors = fieldErrors(result.error!);
    expect(Object.keys(errors).toSorted()).toEqual(["consent", "email", "tier"]);
    for (const message of Object.values(errors)) expect(typeof message).toBe("string");
  });
});
```

**Note on asserting the message text.** The tests match the wording a user
sees, not Zod's default. That means changing the copy breaks the test, which is
the point: the message is part of the contract with the user, and a silent
change to "Invalid input: expected string" is a regression nobody would notice.

**`test/bookmark-button.test.tsx`**

```tsx
import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// The action is mocked. A Server Action cannot run in jsdom, and this test is
// about the component's behaviour, not the server's.
const toggleBookmark = vi.fn<(slug: string) => Promise<{ bookmarked: boolean }>>();
vi.mock("@/app/actions", () => ({ toggleBookmark }));

const { BookmarkButton } = await import("@/components/bookmark-button");

beforeEach(() => {
  toggleBookmark.mockReset();
  toggleBookmark.mockResolvedValue({ bookmarked: true });
});

describe("BookmarkButton", () => {
  test("announces its state to assistive technology", () => {
    render(<BookmarkButton slug="a" title="An article" bookmarked={false} />);
    const button = screen.getByRole("button", { name: "Bookmark An article" });
    expect(button.getAttribute("aria-pressed")).toBe("false");
  });

  test("an already-bookmarked article offers removal", () => {
    render(<BookmarkButton slug="a" title="An article" bookmarked={true} />);
    const button = screen.getByRole("button", { name: "Remove An article from your bookmarks" });
    expect(button.getAttribute("aria-pressed")).toBe("true");
  });

  test("clicking calls the server action once with the slug", async () => {
    const user = userEvent.setup();
    render(<BookmarkButton slug="a" title="An article" bookmarked={false} />);
    await user.click(screen.getByRole("button"));
    expect(toggleBookmark).toHaveBeenCalledExactlyOnceWith("a");
  });

  test("the label updates optimistically, while the action is still in flight", async () => {
    // Hold the action open so the transition cannot finish.
    const { promise, resolve } = Promise.withResolvers<{ bookmarked: boolean }>();
    toggleBookmark.mockReturnValue(promise);

    const user = userEvent.setup();
    render(<BookmarkButton slug="a" title="An article" bookmarked={false} />);

    // Not awaited: the click starts the transition and we look at the screen
    // before it settles.
    void user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toBe("Bookmarked");
    });

    resolve({ bookmarked: true });
  });

  test("the optimistic value is discarded when the transition ends", async () => {
    const user = userEvent.setup();
    render(<BookmarkButton slug="a" title="An article" bookmarked={false} />);

    await user.click(screen.getByRole("button"));

    // The prop never changed, because nothing re-rendered this test's tree with
    // a new value. React therefore drops the optimistic state and the button
    // returns to what the source of truth says. That is the rollback, and it is
    // free: there is no rollback code in the component.
    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toBe("Bookmark");
    });
  });
});
```

**Note on the last two tests, which are a pair.** One holds the action open
with `Promise.withResolvers` and sees the optimistic label. The other lets it
settle and sees the label return. Together they describe the whole behaviour,
and the second one is the test that documents the rollback. Written alone, the
second looks like a bug report.

### Verification

```
$ npm run typecheck && npm run build
✓ Compiled successfully
  Running TypeScript ...
  Finished TypeScript in 1651ms

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /api/health
├ ƒ /articles/[slug]
└ ○ /subscribe

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Read that table. `/subscribe` is static: it reads nothing request-scoped. `/`
and `/articles/[slug]` are dynamic because they read a cookie. `/api/health` is
dynamic because it sets `no-store`. Every one of those is the mode you wanted,
and if one were wrong this is where you would find out.

```
$ npm test

 Test Files  3 passed (3)
      Tests  17 passed (17)
```

And the acceptance test, against the running production server:

```
$ npm run start &
$ URL=http://localhost:3000/articles/conditions-precedent-that-survive

$ curl -s "$URL" | grep -o "A third paragraph" | wc -l
0

$ curl -s -H "Cookie: cj_tier=practitioner" "$URL" | grep -o "A third paragraph" | wc -l
2

$ curl -s -H "Cookie: cj_tier=superuser" "$URL" | grep -o "A third paragraph" | wc -l
0
```

Three numbers: **0, 2, 0.**

**Note on `grep -o ... | wc -l` rather than `grep -c`.** A rendered Next.js
page is effectively one long line, so `grep -c` reports the number of matching
**lines**, which is 1 whether the text appears once or twenty times. The first
draft of this section used `grep -c` and recorded "2", which was wrong: the
number came from a different command. Counting occurrences is the question you
meant to ask. A security check that measures the wrong thing is worse than no
check, because it produces a number you will believe.

The withheld text is not in the response for a reader without entitlement. It
is there for one with it. A forged tier falls back to the lowest, not the
highest. The second number is 2 rather than 1 because a Next.js page appears
twice in the HTML: once as rendered markup and once in the streamed React
payload. That is worth knowing, because it is exactly the place where a
client-side gate leaks: the payload contains everything the component was
given, whether or not the CSS drew it.

One more detail worth noticing:

```
free reader:         7956 bytes
practitioner reader: 7632 bytes
```

The free reader's page is **larger**, because the locked panel is longer than
the two paragraphs it replaced. If your unentitled page is the same size as
your entitled one, you have not built a paywall. You have built a curtain.

### What this capstone was really teaching

Not Next.js. Three things:

1. **The trust boundary is a place in the code**, and you can point at it. Here
   it is `viewArticle`, on the server, and everything else is display.
2. **A type can carry a security rule.** `Omit<Article, "body">` in the preview
   branch means the leak does not compile. Reach for that whenever a rule
   matters more than a comment can express.
3. **Verify at the boundary you care about.** Seventeen passing unit tests did
   not prove the paywall. Three `curl` commands did. Choose the check that
   answers the actual question, not the one that is easiest to write.
