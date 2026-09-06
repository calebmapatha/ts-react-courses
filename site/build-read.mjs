/* Renders the repository's markdown into the site's reading pages.
 * Run with: node build-read.mjs
 * Output is committed, so the site needs no build step to deploy. */

import { readFile, writeFile } from "node:fs/promises";
import { marked } from "marked";

const PAGES = [
  { src: "../javascript-course/course.md",              out: "read/javascript-course.html",              title: "Modern JavaScript",              track: "js",       solutions: "javascript-course-solutions.html" },
  { src: "../javascript-course/solutions.md",           out: "read/javascript-course-solutions.html",     title: "Modern JavaScript: answers" },
  { src: "../typescript-course/course.md",              out: "read/typescript-course.html",              title: "TypeScript",                     track: "ts",       solutions: "typescript-course-solutions.html" },
  { src: "../typescript-course/solutions.md",           out: "read/typescript-course-solutions.html",     title: "TypeScript: answers" },
  { src: "../react-typescript-course/course.md",        out: "read/react-typescript-course.html",        title: "React with TypeScript",          track: "react",    solutions: "react-typescript-course-solutions.html" },
  { src: "../react-typescript-course/solutions.md",     out: "read/react-typescript-course-solutions.html", title: "React with TypeScript: answers" },
  { src: "../casey-workbook/workbook.md",               out: "read/workbook.html",                       title: "The Casey Workbook",             track: "workbook", solutions: "workbook-solutions.html" },
  { src: "../casey-workbook/solutions.md",              out: "read/workbook-solutions.html",             title: "The Casey Workbook: answers", solutions: "workbook.html" },
  { src: "../STACK.md",                                 out: "read/stack.html",                          title: "STACK" },
  { src: "../README.md",                                out: "read/readme.html",                         title: "README" }
];

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const GH = "https://github.com/calebmapatha/ts-react-courses/blob/main";

const LINKS = {
  "./javascript-course/course.md":                 "javascript-course.html",
  "./javascript-course/solutions.md":              "javascript-course-solutions.html",
  "./typescript-course/course.md":                 "typescript-course.html",
  "./typescript-course/solutions.md":              "typescript-course-solutions.html",
  "./react-typescript-course/course.md":           "react-typescript-course.html",
  "./react-typescript-course/solutions.md":        "react-typescript-course-solutions.html",
  "./casey-workbook/workbook.md":                  "workbook.html",
  "./casey-workbook/solutions.md":                 "workbook-solutions.html",
  "../casey-workbook/workbook.md":                 "workbook.html",
  "./workbook.md":                                 "workbook.html",
  "./STACK.md":                                    "stack.html",
  "../STACK.md":                                   "stack.html",
  "./site/":                                       "../",
  "./site/README.md":                              GH + "/site/README.md",
  "./casey-workbook/workbook.pdf":                 GH + "/casey-workbook/workbook.pdf",
  "./casey-workbook/solutions.pdf":                GH + "/casey-workbook/solutions.pdf",
  "./LICENSE":                                     GH + "/LICENSE"
};

marked.setOptions({ gfm: true, mangle: false, headerIds: true });

for (const page of PAGES) {
  let body = marked.parse(await readFile(page.src, "utf8"));

  /* Links between the markdown files must point at the rendered pages.
     An explicit map, not a clever regex: the first version of this guessed
     and produced six broken links that a crawl found. */
  for (const [from, to] of Object.entries(LINKS)) {
    body = body.split(`href="${from}"`).join(`href="${to}"`);
  }
  /* Each course's own "./solutions.md" resolves differently per page. */
  if (page.solutions) {
    body = body.split('href="./solutions.md"').join(`href="${page.solutions}"`);
  }

  const done = page.track
    ? `<label class="done"><input type="checkbox" id="done"> Mark <b>&nbsp;${escape(page.title)}&nbsp;</b> as read</label>`
    : "";

  const script = page.track
    ? `<script src="../app.js"></script><script>
const box = document.getElementById("done");
box.checked = Progress.isRead("${page.track}");
box.addEventListener("change", () => Progress.setRead("${page.track}", box.checked));
</script>`
    : "";

  await writeFile(page.out, `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(page.title)} · Casey Learning Hub</title>
<link rel="stylesheet" href="../styles.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23111'/><text y='72' x='50' text-anchor='middle' font-size='64' fill='%23fff' font-family='sans-serif'>C</text></svg>">
</head>
<body>
<header class="top">
  <div class="wrap">
    <a class="home" href="../">Casey Learning Hub</a>
    <nav><a href="../">Hub</a><a href="../test.html">Test</a></nav>
  </div>
</header>
<main class="wrap">
${body}
${done}
<footer class="foot"><p><a href="../">Back to the hub</a> · <a href="../test.html">Test yourself</a></p></footer>
</main>
${script}
</body>
</html>
`, "utf8");
  console.log("wrote", page.out);
}
