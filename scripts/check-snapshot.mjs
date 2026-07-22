// Guard against pangu behavior changes hiding outside SKILL.md's curated
// examples.
//
// SKILL.md's before → after examples are pedagogy — a small, curated teaching
// set. This snapshot is coverage: a generated probe corpus (every printable
// ASCII character crossed with the adjacency contexts that decide spacing,
// plus a curated tail of multi-char patterns) pinned to the exact output of
// the pinned pangu. On a bump, a diff here means pangu's text-level behavior
// changed — whether or not any curated example happened to cover it, and
// whatever the semver level claims. Red ⟺ behavior change.
//
// Known blind spots: DOM-layer behavior (spacingElement and friends) and
// contexts no probe exercises. Grow CURATED when pangu's HISTORY.md names a
// pattern class the cross-product can't reach.
//
// Usage: node scripts/check-snapshot.mjs [--update]
//   --update  rewrite the fixture to the pinned pangu's current output; do
//             this only after reconciling SKILL.md with the behavior change.
import fs from "node:fs";
import pangu from "pangu";

const FIXTURE = "scripts/pangu-snapshot.jsonl";
const UPDATE = process.argv.includes("--update");

// Multi-char patterns the single-symbol cross-product can't reach: paths,
// joiners, attached tokens, unit-preserving compounds, quote pairs, scripts
// beyond Han. Mirrors SKILL.md's rule families without duplicating its text.
const CURATED = [
  "陳上進/貓咪/Mollie",
  "檢查a/b/c路徑",
  "得到一個A/B的結果",
  "前面1/2後面",
  "得到一個R&D的部門",
  "陳上進&Mollie",
  "AT&T的股價",
  "Q&A時間",
  "前面~=後面",
  "這是C++跟C#的差別",
  "得到一個A+的結果",
  "請@vinta吃大便",
  "前面#H2G2後面",
  "前面$100後面",
  "新八的構造成分有95%是眼鏡",
  "電話:123456789",
  "記住:(東西)",
  "喬治·R·R·馬丁",
  "前面…後面",
  "前面(中文123漢字)後面",
  '前面"中文123漢字"後面',
  "我看过的电影(1404)",
  "function(123)",
  "陳上進 likes 林依諾's status.",
  "檢查src/main.py文件",
  "在/home目錄",
  "檔案在C:\\Users\\name\\",
  "請看https://example.com/path頁面",
  "pangu.js v1.2.3橫空出世",
  "當你凝視著bug，bug也凝視著你",
  "中文，English、中文。English",
  "OpenAI的gpt-4o模型",
  "state-of-the-art和最新技術",
  "A&nbsp;中文",
  "中文&nbsp;English",
  'ひらがな"test"カタカナ',
  "日本語の'quote'テスト",
  "한국어test",
];

// One probe set per printable ASCII character: every adjacency that decides
// spacing (CJK-adjacent, sandwiched between alphanumerics with CJK elsewhere —
// the context pangu 8 turned into a joiner — doubled like a path, no CJK at
// all, and non-Han scripts). Deduped by input; deterministic by construction.
function corpus() {
  const probes = new Map(); // input → char under test ("" for curated)
  for (let c = 0x21; c <= 0x7e; c++) {
    const s = String.fromCharCode(c);
    for (const input of [
      `前${s}後`, // CJK on both sides
      `前面${s}B後面`, // CJK-adjacent left, alnum right
      `前面A${s}後面`, // alnum left, CJK-adjacent right
      `前面A${s}B後面`, // between alphanumerics, CJK elsewhere
      `前面1${s}2後面`, // between digits, CJK elsewhere
      `前面A${s}${s}B後面`, // doubled (path-like), CJK elsewhere
      `A${s}B`, // no CJK anywhere — must stay untouched
      `あ${s}ア`, // kana adjacency
      `한${s}A`, // hangul (not CJK to pangu) adjacency
    ]) {
      if (!probes.has(input)) probes.set(input, s);
    }
  }
  for (const input of CURATED) {
    if (!probes.has(input)) probes.set(input, "");
  }
  return probes;
}

const probes = corpus();
const current = new Map(); // input → pangu's output now
for (const input of probes.keys()) current.set(input, pangu.spacingText(input));

if (UPDATE) {
  const out = [...current].map((pair) => JSON.stringify(pair)).join("\n") + "\n";
  fs.writeFileSync(FIXTURE, out);
  console.log(`✓ snapshot updated: ${current.size} probes against pangu ${pangu.version}`);
  process.exit(0);
}

if (!fs.existsSync(FIXTURE)) {
  console.error(`${FIXTURE} is missing — run \`npm run update-snapshot\` and commit it.`);
  process.exit(1);
}

const pinned = new Map(
  fs.readFileSync(FIXTURE, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)),
);

// Corpus drift (probe added/removed in this script) is a script edit, not a
// pangu change — report it separately so the fix is obviously --update.
const missing = [...current.keys()].filter((k) => !pinned.has(k));
const stale = [...pinned.keys()].filter((k) => !current.has(k));

const changed = [...current].filter(([input, out]) => pinned.has(input) && pinned.get(input) !== out);

console.log(`snapshotted ${current.size} probes against pangu ${pangu.version}`);
if (missing.length || stale.length) {
  console.error(
    `✗ probe corpus drifted from the fixture (${missing.length} new, ${stale.length} gone) — run \`npm run update-snapshot\` and commit it.`,
  );
}
if (changed.length) {
  const SHOW = 20;
  console.error(`\n✗ pangu's behavior changed on ${changed.length} probe(s):`);
  for (const [input, out] of changed.slice(0, SHOW)) {
    console.error(`  input:    ${JSON.stringify(input)}`);
    console.error(`  pinned:   ${JSON.stringify(pinned.get(input))}`);
    console.error(`  pangu:    ${JSON.stringify(out)}`);
  }
  if (changed.length > SHOW) console.error(`  … and ${changed.length - SHOW} more`);

  // Coverage nudge: a changed character with no SKILL.md example exercising it
  // is exactly how a behavior change slips into the doc unseen (the v8 `&`
  // hole). Point at the gap while the reconcile is happening.
  const befores = skillBefores();
  const uncovered = [...new Set(changed.map(([input]) => probes.get(input)).filter(Boolean))].filter(
    (ch) => !befores.some((b) => b.includes(ch)),
  );
  if (uncovered.length) {
    console.error(
      `\n  changed character(s) with no SKILL.md example: ${uncovered.map((c) => JSON.stringify(c)).join(" ")}`,
    );
    console.error(`  add a before → after example for each while reconciling.`);
  }
  console.error(`\n  reconcile SKILL.md first, then \`npm run update-snapshot\` to accept.`);
}
if (missing.length || stale.length || changed.length) process.exit(1);
console.log(`✓ pangu's text-level behavior matches the pinned snapshot`);

// The `before` side of every SKILL.md example, same extraction shape as
// check-skill.mjs (fenced `→` lines and | label | `before` | `after` | rows).
function skillBefores() {
  const lines = fs.readFileSync("skills/pangu/SKILL.md", "utf8").split("\n");
  const befores = [];
  let inFence = false;
  for (const raw of lines) {
    if (/^\s*(```|~~~)/.test(raw)) { inFence = !inFence; continue; }
    if (inFence) {
      const i = raw.indexOf("→");
      if (i !== -1) befores.push(raw.slice(0, i).trim());
      continue;
    }
    if (raw.trim().startsWith("|") && raw.includes("`")) {
      const cells = raw.split("|").map((c) => c.trim());
      const beforeCell = cells.at(-3);
      if (beforeCell && /^`[^`]*`$/.test(beforeCell)) befores.push(beforeCell.slice(1, -1));
    }
  }
  return befores;
}
