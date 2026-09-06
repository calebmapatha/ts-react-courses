# Glossary

Every term these courses use in passing, defined once. Added September 2026
after a review found terms introduced without explanation, such as "native
shells (Capacitor)".

Definitions are short on purpose. Where a term has a full lesson or workbook
section, it is named.

---

## Running code

**Runtime**: the program that executes your code. A browser is one. Node.js is
another. The language is the same; what is available around it is not, which is
why `document` exists in a browser and `readFile` does not.

**Node.js**: a runtime that executes JavaScript outside a browser. Used for
servers, build tools and command-line programs. *JavaScript course, Lesson 0.*

**Thread**: one sequence of instructions executing. JavaScript gives your code
a single thread, which is why slow work must not block. *JavaScript course,
Lesson 13.*

**Event loop**: the mechanism that resumes paused work when a result arrives.
*JavaScript course, Lesson 13.*

**REPL**: read, evaluate, print, loop. An interactive prompt where you type an
expression and see its value. Type `node` with no arguments to get one.

---

## Tools around the code

**Package**: someone else's code, published so you can install it. **npm** is
both the registry they are published to and the command that installs them.
**pnpm** and **yarn** are alternative commands for the same registry; pnpm is
stricter about which packages a file may import.

**Dependency**: a package your project needs. A **transitive dependency** is a
package your dependency needs. You end up running all of them.

**Lockfile**: `package-lock.json` or `pnpm-lock.yaml`. Records the exact
version of every package installed, so two machines get identical code. Commit
it. *Workbook, Part 5.6.*

**Bundler**: a tool that takes your many source files and produces a few files
a browser can load efficiently, resolving imports and removing what is unused.
**Vite** and **webpack** are bundlers. *React course, Lesson 0.*

**Tree shaking**: a bundler dropping code nothing imports. Why a barrel file
that re-exports a whole folder can quietly enlarge your bundle.

**Transpiler**: a compiler whose output is another high-level language.
Removing types from TypeScript to produce JavaScript is transpiling.
*TypeScript course, Lesson 0.*

**Minification**: making the output smaller by shortening names and removing
whitespace. **Source maps** map the minified output back to your source so a
stack trace still points at a line you wrote.

**Hot reload** (also HMR, hot module replacement): the development server
replacing a changed module in the running page without a full refresh, so you
keep your state.

**Linter**: a tool that reads your code and reports patterns known to cause
bugs. **ESLint** is the usual one. A **formatter** such as **Prettier** only
changes layout. Different jobs; run both.

**CI** (continuous integration): a service that runs your checks on every
change, on a machine that is not yours. **CD** is the same pipeline deploying
the result. *Workbook, Part 7.2.*

**Monorepo**: one repository holding several related projects that share code.
**Turborepo** is a tool for running and caching tasks across one.

---

## The web

**DOM** (Document Object Model): the browser's in-memory representation of the
page, as a tree of nodes. JavaScript changes the DOM; the browser redraws.
React does this for you. *React course, Lesson 0.*

**JSX**: the markup-like syntax inside React components. Not HTML; a build
tool converts it into function calls. *React course, Lesson 0.*

**Render**: producing the output for a given state. **Server rendering** does
it on a server and sends HTML. **Client rendering** does it in the browser
with JavaScript. **Hydration** is the browser attaching behaviour to
server-rendered HTML that is already on screen.

**Bundle**: the JavaScript the browser downloads. Anything in it is readable
by anyone, which is why no secret may be in it. *Workbook, Part 3.1.*

**SPA** (single-page application): one page that swaps its content with
JavaScript instead of loading new documents. Mentisflow is one.

**PWA** (progressive web app): a website that can be installed like an app,
using a **service worker**: a script the browser keeps running in the
background that can serve cached files, including when offline. A service
worker can serve stale code forever if you have no way to unregister it.
*Workbook, Part 4.6.*

**WebView**: a browser engine embedded inside a native app, with no address
bar. How a web page runs inside an app from an app store.

**Native shell**: a small native app whose entire job is to host a WebView
running your web code, plus **plugins** giving that code access to native
features a browser cannot reach: the camera, biometrics, push notifications,
the filesystem.

**Capacitor**: the tool that builds such a shell for iOS and Android from a
web project. Mentisflow uses one: the same React bundle that serves the website
runs inside the app. The catch is that the plugin set is fixed at the moment
the shell is built, so a JavaScript-only update cannot add native capability.
*Workbook, Part 4.6.*

**OTA** (over the air): updating the JavaScript inside an installed app
without going through app-store review. Fast, and bounded by the frozen plugin
set above.

**Expo**: a framework for building genuinely native apps with React. Different
approach from a native shell: real native views, not a WebView. Casey Journals
uses Expo.

**CDN** (content delivery network): servers in many places holding copies of
your files, so a request is answered near the user.

---

## Backend

**BaaS** (backend as a service): a hosted backend: database, authentication,
file storage and a place to run server code, without operating servers.
*Workbook, Part 4.2, has a concept map across the two below.*

**Firebase**: Google's BaaS. **Firestore** is its document database, and
**Security Rules** is the language its authorisation is written in. Mentisflow
uses it.

**Supabase**: a BaaS built on **PostgreSQL** (a relational database, usually
"Postgres"). Both Casey products use it.

**RLS** (row-level security): a Postgres feature where the database itself
decides which rows a given user may see, so the application cannot leak them by
forgetting a filter. Firestore Security Rules do the same job.
*Workbook, Part 5.3.*

**Migration**: a versioned, committed file that changes the database schema,
so every environment gets the same change in the same order.

**Edge function**: server code that runs close to the user rather than in one
region. Supabase's name for its server-side functions.

**Emulator**: a local copy of the hosted services so you can develop and test
without touching a real project.

**Serverless**: code that runs on demand with no server you maintain.
"Serverless" means you do not operate the server, not that there is not one.

---

## Web plumbing

**HTTP**: the request-and-response protocol the web runs on. A **status code**
says what happened: 200 fine, 401 not authenticated, 403 not allowed, 404 not
found, 500 the server broke.

**API** (application programming interface): the set of operations one piece
of software offers another. A **REST API** offers them as HTTP endpoints.

**Endpoint**: one URL that accepts requests.

**Webhook**: an HTTP request sent *to* you when something happens elsewhere: a
payment succeeded, a build finished. You do not ask; it arrives. Since anyone
can post to that URL, it must be **signed** and verified.
*Workbook, Parts 4.4 and 8.3.*

**Idempotent**: safe to do more than once, with the same result. Necessary for
webhooks, because providers retry. *Workbook, Part 4.4.*

**Middleware**: code that runs before the main handler on every matching
request. Used for security headers, redirects and cheap checks.
*React course, Lesson 17.*

**Cookie**: a small value the browser stores and sends back on every request
to that site. Usually how a session is carried. The browser can edit it, so it
must never decide permission on its own.

**localStorage**: a per-site key-value store in the browser. Survives a
refresh, never leaves the device, and the user can change it. Fine for a
remembered preference; never for a permission or a count that matters.

**Cache**: a stored copy kept to avoid redoing work. Most caching bugs are
about serving one person's copy to someone else.

---

## Security and data

**Authentication**: establishing who the caller is. **Authorisation**: what
they are allowed to do. Different questions, and most breaches are the second.
*Workbook, Part 5.*

**Session**: the server's record that this browser is a signed-in user.

**JWT** (JSON web token): a signed token carrying claims about a user. Signed,
not encrypted: anyone can read it, nobody can forge it.

**TLS**: the encryption behind `https`. Protects data in transit, and nothing
at either end.

**HMAC**: a signature proving a message came from someone holding a shared
secret, and was not altered. How webhooks are verified.

**PBKDF2**: a deliberately slow function for turning a password into a key, so
guessing is expensive. **AES-GCM** is the cipher used to encrypt with that key.
*Workbook, Part 6.8.*

**CSP** (Content-Security-Policy): a header telling the browser which sources
of script it may execute. The last line against injected script.
*Workbook, Part 5.5.*

**Injection**: untrusted data being treated as code. SQL injection, script
injection, and prompt injection are the same bug in three costumes.
*Workbook, Parts 5.5 and 9.2.*

**OWASP Top Ten**: a widely used list of the most serious application security
risks, revised every few years. *Workbook, Part 5.1.*

**STRIDE**: six prompts for finding threats in a feature: spoofing, tampering,
repudiation, information disclosure, denial of service, elevation of privilege.
*Workbook, Part 5.10.*

**POPIA**: South Africa's Protection of Personal Information Act 4 of 2013.
**GDPR** is the European equivalent. *Workbook, Part 6, maps them.*

**Audit log**: an append-only record of who did what, when. Written by the
server, so the person acting cannot omit it. *Workbook, Part 5.7.*

---

## Types and validation

**Static types**: types checked before the program runs, in your editor,
rather than when it breaks. *TypeScript course, Lesson 0.*

**Type inference**: the compiler working out a type you did not write.

**Schema**: a description of a data shape, precise enough to check a value
against. **Zod** turns one schema into both a runtime check and a TypeScript
type, so the two cannot drift. *TypeScript course, Lesson 13.*

**Validation**: checking that data actually has the shape you assumed, at the
point it enters your program. A type annotation is a claim; validation is a
check.

**Branded type**: a type that stops two values of the same underlying shape
being confused, such as cents and rands. *TypeScript course, Lesson 13a.*

---

## Miscellaneous

**Intl**: JavaScript's built-in internationalisation API. Formats dates,
numbers and currency for a given locale. `Intl.NumberFormat("en-ZA", ...)`
produces South African rand formatting. Used instead of hand-written
formatting, which gets the separators and the currency symbol wrong.

**Vercel**: a hosting service for websites, and the company behind Next.js.
The learning hub in `site/` is deployed there.

**HPCSA**: the Health Professions Council of South Africa, which registers
practitioners. It appears in examples drawn from a health product.

**Fixture**: a fixed piece of sample data used by tests, so a test does not
depend on a network or a database. *JavaScript course, Lesson 14.*

**Mock**: a stand-in for a real dependency during a test, so the test exercises
your code and not somebody else's service.
