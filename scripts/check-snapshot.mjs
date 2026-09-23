// Guard against pangu behavior changes hiding outside SKILL.md's curated
// examples.
//
// SKILL.md's before → after examples are pedagogy — a small, curated teaching
// set. This snapshot is coverage: a generated probe corpus (every printable
// ASCII character and extended-Unicode boundary/representative probes crossed
// with adjacency contexts, plus a curated tail of multi-char patterns) pinned
// to the exact output of the pinned pangu. On a bump, a diff here means its text-level behavior
// changed — whether or not any curated example happened to cover it, and
// whatever the semver level claims. Green covers only the tested corpus.
//
// Known blind spots: DOM-layer behavior (spaceNode and friends) and
// contexts no probe exercises. Grow CURATED when pangu's changelog names a
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
  // pangu 9.1.1: closing bracket + operator + CJK, and CJK + hyphen + digits.
  // These multi-char contexts were absent from the original 882 probes.
  "(中文)-下一步",
  "[中文]-下一步",
  "{中文}-下一步",
  "(中文)*下一步",
  "[中文]*下一步",
  "{中文}*下一步",
  "(中文)=下一步",
  "[中文]=下一步",
  "{中文}=下一步",
  "(中文)&下一步",
  "[中文]&下一步",
  "{中文}&下一步",
  "中文-123",
  "中文-123度",
  "氣溫 -5°C",
  // Extended Unicode: Issue #24, attached signs, middle dots, existing NBSP,
  // and marks that interrupt direct code-point adjacency (no normalization).
  "狀態✓完成",
  "版本β測試",
  "溫度±5度",
  "章節Ⅻ內容",
  "符號★測試",
  "結果é完成",
  "前±後",
  "前±5後",
  "前α+β後",
  "前·後",
  "前\u00a0後",
  "前\u00a0é\u00a0後",
  "前e\u0301後",
  "前é\u0301後",
  "前✓\ufe0f後",
  // pangu 10: joined slashes, protected URLs, per-line plus separators,
  // attached superscripts, Letterlike Symbols, and copyright + digits.
  "前面/後面",
  "前面 / 後面",
  "中文/src/index.ts檔案",
  "目錄/usr/bin/包含執行檔",
  "參考https://example.com/中文API?q=中文#用法，謝謝",
  "參考http://example.com/中文API?q=中文#用法，謝謝",
  "https://example.com/中文API?q=中文#用法",
  "請看https://example.com/path 頁面",
  '請看https://example.com/path(中文)，再看API',
  '前<a href="https://example.com/中文API">中文API</a>後',
  "Switch+健身環",
  "前+A+B",
  "前 A+B 後",
  "前+A+B\n後 A+B",
  "Switch+中文 A+B",
  "前+A+「方案」",
  "前 +A+B",
  "(中文)+「方案」",
  "前+A(中文)+「方案」",
  "有100+的選擇",
  "打+886這個號碼",
  "Disney+的節目 A+B",
  "C++的程式 A+B",
  "A+的等級 A+B",
  "100+的選擇 A+B",
  "前+886 A+B",
  "Apple TV+的節目",
  "公視+的節目",
  "AA+的等級",
  "AB+的血型",
  // pangu 10.2: mo 店+ keeps its suffix, including an already-spaced name.
  "mo店+免運無限次",
  "mo 店+ 免運無限次",
  "mo 店+的優惠 A+B",
  "momo店+會員",
  "面積m²大小",
  "中文⁺註記",
  "商標™產品",
  "品牌®商品",
  "中文⁽後",
  "溫度℃變化",
  "溫度℉變化",
  "編號№123項",
  "©2026版權",
  "版權©2026",
  "©2026",
  "版權© 2026",
];

// Keep these ranges explicit so an upstream boundary change cannot silently
// redefine the corpus. Sample both ends and their immediate outside neighbors.
const EXTENDED_RANGES = [
  [0x00a1, 0x00ff],
  [0x0370, 0x03ff],
  [0x2100, 0x214f],
  [0x2150, 0x218f],
  [0x2700, 0x27bf],
];
const CODE_POINTS = new Set([
  ...Array.from({ length: 0x7e - 0x21 + 1 }, (_, i) => 0x21 + i),
  ...EXTENDED_RANGES.flatMap(([first, last]) => [first - 1, first, first + 1, last - 1, last, last + 1]),
  ...Array.from("é±βⅫ✓★ΩñⅧ✗☆·℃℉№©®⁰¹²³⁴⁵⁶⁷⁸⁹ⁱⁿ⁺⁻⁼⁽⁾℠™", (ch) => ch.codePointAt(0)),
]);

// One probe set per selected code point: every adjacency that decides
// spacing (CJK-adjacent, sandwiched between alphanumerics with CJK elsewhere —
// the context pangu 8 turned into a joiner — doubled like a path, no CJK at
// all, and non-Han scripts). Deduped by input; deterministic by construction.
function corpus() {
  const probes = new Map(); // input → char under test ("" for curated)
  for (const c of CODE_POINTS) {
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
for (const input of probes.keys()) current.set(input, pangu.spaceText(input));

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
    `✗ probe corpus drifted from the fixture (${missing.length} new, ${stale.length} gone) — review the probe changes, then run \`npm run update-snapshot\` and commit it.`,
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
