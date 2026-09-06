/* Shared: progress storage and small helpers. No dependencies. */

const STORE = "casey-hub-v1";

/* localStorage can throw in private browsing and some corporate policies.
   Progress is a convenience; failing to remember it is not worth an error. */
function load() {
  try { return JSON.parse(localStorage.getItem(STORE) || "{}"); }
  catch { return {}; }
}
function save(state) {
  try { localStorage.setItem(STORE, JSON.stringify(state)); } catch { /* ignore */ }
}

const Progress = {
  all() {
    const s = load();
    return { read: s.read || {}, scores: s.scores || {} };
  },
  isRead(id) { return Boolean(this.all().read[id]); },
  setRead(id, value) {
    const s = load();
    s.read = s.read || {};
    if (value) s.read[id] = new Date().toISOString(); else delete s.read[id];
    save(s);
  },
  /* Best score per topic only. A worse attempt never overwrites a better one. */
  recordScore(topic, correct, total) {
    const s = load();
    s.scores = s.scores || {};
    const pct = Math.round((correct / total) * 100);
    const prev = s.scores[topic];
    if (!prev || pct > prev.pct) {
      s.scores[topic] = { pct, correct, total, at: new Date().toISOString() };
    }
    s.scores[topic].attempts = (prev?.attempts || 0) + 1;
    save(s);
    return s.scores[topic];
  },
  reset() { try { localStorage.removeItem(STORE); } catch { /* ignore */ } }
};

const el = (tag, attrs = {}, ...kids) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v === null || v === undefined) continue;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? "" : String(v));
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return node;
};

/* replaceChildren is native and turns null into the string "null". This does
   what el() does with its children: drops the blanks. */
function setKids(node, ...kids) {
  node.replaceChildren(...kids.flat().filter((k) => k !== null && k !== undefined && k !== false));
  return node;
}

function bar(percent) {
  const outer = el("div", { class: "bar" });
  const inner = el("i");
  outer.append(inner);
  requestAnimationFrame(() => { inner.style.width = Math.max(0, Math.min(100, percent)) + "%"; });
  return outer;
}

/* Fisher-Yates. Math.random is fine here: this is a quiz, not a lottery. */
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Take up to `count`, split as evenly as the bank allows between easy and hard. */
function pickBalanced(pool, count) {
  const easy = shuffle(pool.filter((q) => q.level === "easy"));
  const hard = shuffle(pool.filter((q) => q.level === "hard"));
  const half = Math.floor(count / 2);
  const chosen = [...easy.slice(0, half), ...hard.slice(0, count - half)];
  /* If one side ran short, top up from the other so the length still holds. */
  const rest = shuffle([...easy.slice(half), ...hard.slice(count - half)]);
  while (chosen.length < count && rest.length) chosen.push(rest.pop());
  return shuffle(chosen);
}
