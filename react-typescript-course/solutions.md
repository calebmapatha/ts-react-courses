# React with TypeScript Course: Exercise Solutions

Working solutions for every exercise in the React + TypeScript course. Each solution is a complete, drop-in component.

To use any solution, save it to a `.tsx` file inside the Vite project from Lesson 0 and import it from `App.tsx`.

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

const countries: Country[] = [
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
];

export function SelectDemo() {
  const [country, setCountry] = useState<Country>(countries[0]);
  return (
    <div>
      <Select
        options={countries}
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

**Note:** The keys are coerced to strings for the underlying `<select>` element because HTML attributes are always strings. The lookup back to the original object preserves the full type.

---

## Lesson 10: Create Event Form With Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const EventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  maxAttendees: z
    .number({ invalid_type_error: "Must be a number" })
    .int("Must be a whole number")
    .positive("Must be greater than zero"),
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

---

## Lesson 11: Paginated Posts With TanStack Query

```tsx
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

const PostListSchema = z.array(PostSchema);
type Post = z.infer<typeof PostSchema>;

async function fetchPosts(page: number, limit: number = 10): Promise<Post[]> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`,
  );
  if (!response.ok) throw new Error("Failed to fetch posts");
  return PostListSchema.parse(await response.json());
}

export function PaginatedPosts() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page, limit),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Loading first page...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div>
      <h2>Posts (page {page})</h2>
      {isFetching && <p>Refreshing...</p>}
      <ul>
        {data?.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 12px" }}>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={isFetching || (data?.length ?? 0) < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

**Note:** `keepPreviousData` prevents the page from flashing empty during page transitions. The `Next` button is disabled when the current page returned fewer items than the limit, which signals there are no more pages.

---

## Lesson 12: Three-Route App

```tsx
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

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
// SignupForm.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { SignupForm } from "./SignupForm";

describe("SignupForm", () => {
  test("shows validation errors for empty submission", async () => {
    render(<SignupForm />);
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  test("shows error for invalid email format", async () => {
    render(<SignupForm />);
    await userEvent.type(screen.getByPlaceholderText(/email/i), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  test("shows error when age is below 18", async () => {
    render(<SignupForm />);
    await userEvent.type(screen.getByPlaceholderText(/age/i), "16");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/18 or older/i)).toBeInTheDocument();
  });

  test("submits successfully with valid input", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<SignupForm />);

    await userEvent.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText(/password/i), "secret123");
    await userEvent.type(screen.getByPlaceholderText(/age/i), "25");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Valid data:",
        expect.objectContaining({
          email: "test@example.com",
          password: "secret123",
          age: 25,
        }),
      );
    });

    consoleSpy.mockRestore();
  });
});
```

**Note:** Tests query by user-visible attributes (role, placeholder, text) rather than test ids or class names. This makes them resilient to refactors and closer to how a real user interacts with the form.

---

## Capstone: Issue Tracker (Scaffolding)

A complete issue tracker is beyond the scope of a single solution file, but the skeleton below shows how the pieces fit together. Build it out by combining the patterns from earlier lessons.

**Folder structure:**

```
src/
  features/
    auth/
      AuthContext.tsx       // From Lesson 7 pattern
      LoginForm.tsx         // From Lesson 10 pattern
    issues/
      api.ts                // fetch + Zod parsing
      schemas.ts            // Issue, Comment Zod schemas
      IssueList.tsx         // From Lesson 11 pattern (paginated)
      IssueDetail.tsx       // Routed page (from Lesson 12)
      CreateIssueForm.tsx   // From Lesson 10 pattern
  shared/
    components/
      Modal.tsx             // From Lesson 2
      Spinner.tsx
  App.tsx                   // From Lesson 12 pattern
  main.tsx                  // QueryClientProvider wrapper
```

**`src/features/issues/schemas.ts`**

```typescript
import { z } from "zod";

export const IssueStatusSchema = z.enum(["open", "in_progress", "closed"]);
export type IssueStatus = z.infer<typeof IssueStatusSchema>;

export const IssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: IssueStatusSchema,
  createdAt: z.string(),
  authorId: z.string(),
});

export type Issue = z.infer<typeof IssueSchema>;
export const IssueListSchema = z.array(IssueSchema);

export const CreateIssueSchema = IssueSchema.omit({
  id: true,
  createdAt: true,
  authorId: true,
  status: true,
});
export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
```

**`src/features/issues/api.ts`**

```typescript
import { Issue, IssueListSchema, CreateIssueInput, IssueSchema } from "./schemas";

const BASE = "https://your-api.example.com";

export async function fetchIssues(): Promise<Issue[]> {
  const response = await fetch(`${BASE}/issues`);
  if (!response.ok) throw new Error("Failed to load issues");
  return IssueListSchema.parse(await response.json());
}

export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  const response = await fetch(`${BASE}/issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to create issue");
  return IssueSchema.parse(await response.json());
}

export async function updateIssueStatus(id: string, status: Issue["status"]): Promise<Issue> {
  const response = await fetch(`${BASE}/issues/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update issue");
  return IssueSchema.parse(await response.json());
}
```

**`src/features/issues/IssueList.tsx`** (with optimistic update)

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchIssues, updateIssueStatus } from "./api";
import { Issue } from "./schemas";

export function IssueList() {
  const queryClient = useQueryClient();

  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: fetchIssues,
  });

  const closeIssue = useMutation({
    mutationFn: (id: string) => updateIssueStatus(id, "closed"),
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["issues"] });
      const previous = queryClient.getQueryData<Issue[]>(["issues"]);
      queryClient.setQueryData<Issue[]>(["issues"], (old) =>
        old?.map((issue) =>
          issue.id === id ? { ...issue, status: "closed" } : issue,
        ),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      // Rollback on failure
      if (context?.previous) {
        queryClient.setQueryData(["issues"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  if (isLoading) return <p>Loading issues...</p>;

  return (
    <ul>
      {issues?.map((issue) => (
        <li key={issue.id}>
          <strong>[{issue.status}]</strong> {issue.title}
          {issue.status !== "closed" && (
            <button onClick={() => closeIssue.mutate(issue.id)}>
              Close
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
```

The optimistic update pattern is the key piece. It updates the cache immediately so the UI feels instant, then rolls back if the mutation fails.

The remaining components (LoginForm, CreateIssueForm, IssueDetail, AuthContext) follow the patterns already shown in their respective lesson solutions. Wire them together with React Router and a QueryClientProvider at the top of the app.
