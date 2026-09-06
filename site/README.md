# Casey Learning Hub

A static learning hub: the three courses and the workbook to read, and an
interactive test over all of it. Progress is kept in the browser.

No framework, no build step, no dependencies at runtime. Open `index.html` and
it works, including from the filesystem.

## What is here

```
site/
  index.html        the hub: reading list, per-topic scores, overall progress
  test.html         the interactive test
  questions.js      the question bank: 76 questions, 38 easy and 38 hard
  app.js            progress storage and small helpers
  styles.css        black on white, responsive, follows the system dark mode
  read/*.html       the courses and workbook, rendered from the markdown
  build-read.mjs    regenerates read/ when the markdown changes
  vercel.json       security headers
```

## The test

Seventy-six questions across nine topics. Every test is drawn at random and
split evenly between straightforward questions and harder ones, most of which
are scenarios: a stolen laptop, a paywall that leaks, a webhook that grants
twice, a cancellation that cannot reach the payment gateway.

You get the reasoning after every answer, whether you were right or wrong. The
reasoning is the point; the score is just a way of finding which reasoning you
have not met yet.

Only your best score per topic is kept. A mixed test records a topic only if it
asked at least three questions about it, so a lucky single question cannot set
your score for a whole subject.

## Progress

Kept in `localStorage` under one key, in that browser, on that device. Nothing
is sent anywhere, there is no account and there is no cookie. Clearing your
site data clears it, and there is a reset button on the hub.

Reads and writes are wrapped in `try`/`catch`, because `localStorage` throws in
private browsing and under some corporate policies. Progress is a convenience;
failing to remember it is not an error worth showing anybody.

## Running it locally

```sh
open index.html                 # works directly, no server needed
python3 -m http.server 4321     # or serve the directory, if you prefer
```

## Deploying to Vercel

It is a plain static directory, so there is nothing to build.

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. **Root Directory:** `site`
3. **Framework Preset:** Other
4. Leave the build command empty and the output directory empty.
5. Deploy.

Or from the command line:

```sh
cd site
npx vercel deploy --prod
```

The same directory works unchanged on Netlify, Cloudflare Pages, GitHub Pages,
or any static host.

## Regenerating the reading pages

`read/` is generated from the markdown at the repository root and committed, so
that deployment needs no build step. After editing any course or the workbook:

```sh
cd site
npm install        # marked, the only dependency, and only for this script
node build-read.mjs
```

## Adding a question

Append to the array in `questions.js`:

```js
{
  id: "sec-13",              // unique
  topic: "sec",              // one of the ids in TOPICS at the foot of the file
  level: "hard",             // "easy" or "hard"
  scenario: "Optional setup, for a scenario question.",
  q: "The question.",
  options: ["A", "B", "C", "D"],   // exactly four
  answer: 1,                 // index of the correct one
  why: "Why, in a sentence or three. Shown whether the answer was right or wrong."
}
```

Keep each topic balanced between `easy` and `hard`: the test picker splits them
evenly, and an unbalanced topic quietly stops being an even split.
