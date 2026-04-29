# TypeScript and React Courses

Two practical, open-source courses that take you from zero TypeScript knowledge to building production React applications. Designed for developers who already know JavaScript and want to level up.

## Courses

### 1. TypeScript Fundamentals

A hands-on course covering the language from primitives through advanced types, with a CLI capstone project.

- [Course content](./typescript-course/course.md)
- [Exercise solutions](./typescript-course/solutions.md)

**What you will learn:**

- Types, inference, and the strict mode mindset
- Functions, objects, interfaces, and type aliases
- Discriminated unions and exhaustive narrowing
- Generics and constraints
- Classes, modules, and project structure
- Utility types and advanced types (mapped, conditional, template literals)
- Working with external APIs using Zod for runtime validation
- Capstone: a fully typed task manager CLI

**Estimated time:** 10 to 15 hours including exercises.

### 2. React with TypeScript

A follow-on course that builds on the fundamentals to teach modern, production-grade React development.

- [Course content](./react-typescript-course/course.md)
- [Exercise solutions](./react-typescript-course/solutions.md)

**What you will learn:**

- Typing function components and props
- All the core hooks with type safety (useState, useEffect, useRef, useReducer, useContext)
- Custom hooks and generic components
- Forms with React Hook Form and Zod
- Server state with TanStack Query
- Routing with React Router
- Component patterns (compound, polymorphic)
- Testing with Vitest and React Testing Library
- Capstone: a typed issue tracker with optimistic updates

**Estimated time:** 15 to 20 hours including exercises.

## Recommended Path

Work through the TypeScript course first, in order, doing the exercises as you go. The exercises are designed to take 15 to 30 minutes each. After the capstone, move on to the React course.

If you already know TypeScript well, you can skim the first course and jump straight to React.

## How to Use the Solutions

Each lesson exercise has a working solution in the `solutions.md` file. Try the exercise yourself first. Reading a solution before attempting the problem will rob you of most of the benefit.

When you do look at a solution, do not just copy it. Read it, close the tab, and rewrite it from scratch. That is where the learning happens.

## Prerequisites

- Comfortable with modern JavaScript (ES2015+: arrow functions, destructuring, modules, async/await, promises)
- Node.js 18 or higher installed
- A code editor (VS Code recommended for built-in TypeScript support)
- For the React course: a basic understanding of how React works (components, props, state)

If you are not yet comfortable with JavaScript fundamentals, learn those first. The official MDN guide is excellent.

## Repository Structure

```
ts-react-courses/
├── README.md                       (this file)
├── LICENSE
├── .gitignore
├── typescript-course/
│   ├── course.md                   (lessons and exercises)
│   └── solutions.md                (working solutions)
└── react-typescript-course/
    ├── course.md
    └── solutions.md
```

## Contributing

Improvements are welcome. If you spot an error, find a clearer explanation, or want to add an extra exercise, open an issue or pull request.

## License

MIT. See [LICENSE](./LICENSE) for full text. You are free to use, modify, share, and teach from this material, including for commercial training, as long as you keep the license notice intact.
