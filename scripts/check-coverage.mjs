// Guard that SKILL.md carries every upstream pangu rule.
//
// check-skill.mjs proves each example is correct and check-snapshot.mjs pins
// behavior on a probe corpus; neither proves that every rule pangu applies is
// taught. This check reads pangu's own rule inventory — every constant
// exported from `pangu/shared`, plus the regexes `spaceText()` builds inline —
// and asserts it against scripts/upstream-rules.json:
//
//   1. every upstream constant and inline rule is mapped, either to the
//      SKILL.md section that teaches it or as internal, with a reason;
//   2. each mapped value and the rule engine itself match their pinned
//      fingerprints, so any upstream rule change opens a review;
//   3. each mapped rule changes text on at least one example in its section
//      and on at least one snapshot probe.
//
// "Changes text" is observed, not inferred: while pangu runs, every
// String.prototype.replace call that alters its string is attributed to the
// regex it used. If upstream stops applying rules through replace(), nothing
// is attributed and every rule reports uncovered, so the check fails closed.
//
// Usage: node scripts/check-coverage.mjs [--update]
//   --update  rewrite fingerprints for already-mapped rules; do this only
//             after reconciling SKILL.md with the upstream change. Unmapped
//             rules are never added for you.
import crypto from "node:crypto";
import fs from "node:fs";
import pangu from "pangu";
import * as shared from "pangu/shared";

const { Pangu, PlaceholderReplacer } = shared;

const SKILL = "skills/pangu/SKILL.md";
const SNAPSHOT = "scripts/pangu-snapshot.jsonl";
const MAP = "scripts/upstream-rules.json";
const UPDATE = process.argv.includes("--update");

const hash = (text) => crypto.createHash("sha256").update(text).digest("hex").slice(0, 12);
function fingerprint(value) {
  if (value instanceof RegExp) return hash(`/${value.source}/${value.flags}`);
  if (value instanceof Set) return hash(JSON.stringify([...value].sort()));
  if (Array.isArray(value)) return hash(JSON.stringify(value.map((v) => (v?.pattern instanceof RegExp ? { ...v, pattern: `/${v.pattern.source}/${v.pattern.flags}` } : v))));
  return hash(JSON.stringify(value));
}
const engineFingerprint = () =>
  hash(
    [Pangu, PlaceholderReplacer]
      .flatMap((cls) => Object.getOwnPropertyNames(cls.prototype).sort().map((k) => `${cls.name}.${k}:${cls.prototype[k]}`))
      .join("\n"),
  );

// Upstream inventory: exported constants (rule regexes and the character data
// they are built from), keyed by name. Classes are covered by the engine hash.
const exported = Object.entries(shared).filter(([, v]) => typeof v !== "function" && !(v instanceof Pangu));
const ruleName = new Map(); // RegExp object -> rule name
for (const [name, value] of exported) {
  if (value instanceof RegExp) ruleName.set(value, name);
  if (Array.isArray(value)) value.forEach((v) => v?.pattern instanceof RegExp && ruleName.set(v.pattern, name));
}

// Placeholder restores are plumbing: the matching store step is a rule of its
// own, attributed when it fires.
const PLACEHOLDER_RESTORE = /^[-]\w+_\(\\d\+\)[-]$/;

const map = JSON.parse(fs.readFileSync(MAP, "utf8"));
const inlineBySource = new Map(Object.entries(map.inline ?? {}).map(([name, e]) => [e.source, name]));

// Attribute each text-changing replace() during spaceText() to its rule.
let fired = null;
const unknownInline = new Map(); // source -> sample input
const origReplace = String.prototype.replace;
String.prototype.replace = function (pattern, replacement) {
  const before = String(this);
  const after = origReplace.call(this, pattern, replacement);
  if (fired && pattern instanceof RegExp && after !== before) {
    const name = ruleName.get(pattern) ?? inlineBySource.get(pattern.source);
    if (name) fired.rules.add(name);
    else if (!PLACEHOLDER_RESTORE.test(pattern.source) && !unknownInline.has(pattern.source)) unknownInline.set(pattern.source, fired.input);
  }
  return after;
};
function rulesFiredBy(input) {
  fired = { input, rules: new Set() };
  pangu.spaceText(input);
  const { rules } = fired;
  fired = null;
  return rules;
}

// SKILL.md examples with the section heading each sits under (same example
// shapes as check-skill.mjs: fenced `before → after` lines and table rows).
const sections = new Set();
const examples = []; // { section, before }
let section = null;
let inFence = false;
for (const raw of fs.readFileSync(SKILL, "utf8").split("\n")) {
  if (/^\s*(```|~~~)/.test(raw)) { inFence = !inFence; continue; }
  if (!inFence && /^#{2,6} /.test(raw)) { section = raw.replace(/^#+ /, "").trim(); sections.add(section); continue; }
  if (inFence) {
    const i = raw.indexOf("→");
    if (i !== -1) examples.push({ section, before: raw.slice(0, i).trim() });
  } else if (raw.trim().startsWith("|") && raw.includes("`")) {
    const beforeCell = raw.split("|").map((c) => c.trim()).at(-3);
    if (beforeCell && /^`[^`]*`$/.test(beforeCell)) examples.push({ section, before: beforeCell.slice(1, -1) });
  }
}

const taughtIn = new Map(); // rule -> Set of sections whose examples fire it
for (const { section: s, before } of examples) {
  for (const rule of rulesFiredBy(before)) {
    if (!taughtIn.has(rule)) taughtIn.set(rule, new Set());
    taughtIn.get(rule).add(s);
  }
}
const probed = new Set();
for (const line of fs.readFileSync(SNAPSHOT, "utf8").split("\n").filter(Boolean)) {
  for (const rule of rulesFiredBy(JSON.parse(line)[0])) probed.add(rule);
}
String.prototype.replace = origReplace;

const problems = [];
const entries = { ...map.constants, ...map.inline };
const isRegexRule = (name) => (map.inline && name in map.inline) || shared[name] instanceof RegExp || Array.isArray(shared[name]);

// 1. Mapping: both directions, with a section or a reason.
for (const [name] of exported) {
  if (!map.constants?.[name]) problems.push(`unmapped upstream constant ${name} — map it in ${MAP} to the SKILL.md section that teaches it, or mark it internal with a reason`);
}
for (const name of Object.keys(map.constants ?? {})) {
  if (!(name in shared)) problems.push(`${MAP} maps ${name}, which pangu ${pangu.version} no longer exports — reconcile SKILL.md, then remove the entry`);
}
for (const [source, input] of unknownInline) {
  problems.push(`unmapped inline rule /${source}/ (first changed ${JSON.stringify(input)}) — name it under "inline" in ${MAP}`);
}
for (const [name, e] of Object.entries(entries)) {
  const target = e.section ?? e.internal;
  if (!target) problems.push(`${name}: give it a "section" or an "internal" reason`);
  else if (e.section && !sections.has(e.section)) problems.push(`${name}: section "${e.section}" is not a SKILL.md heading`);
}

// 2. Fingerprints: any change to a mapped value or to the engine is a review.
const stale = [];
if (map.engine !== engineFingerprint()) stale.push("the spaceText() rule engine (review its steps for new or reordered rules)");
for (const [name, e] of Object.entries(map.constants ?? {})) {
  if (name in shared && e.fingerprint !== fingerprint(shared[name])) stale.push(`${name} = ${String(shared[name]).slice(0, 120)}`);
}

// 3. Coverage: every taught rule fires on an example in its section and on a probe.
for (const [name, e] of Object.entries(entries)) {
  if (!e.section || !isRegexRule(name)) continue;
  if (!taughtIn.get(name)?.has(e.section)) {
    problems.push(`${name}: no example under "${e.section}" changes text through it — add a before → after example there`);
  }
  if (!probed.has(name) && !e.unprobed) {
    problems.push(`${name}: no snapshot probe changes text through it — add a probe to CURATED in scripts/check-snapshot.mjs`);
  }
}

if (UPDATE) {
  if (problems.length) {
    problems.forEach((p) => console.error(`✗ ${p}`));
    console.error(`\nResolve the mapping and coverage problems first; --update only re-pins fingerprints.`);
    process.exit(1);
  }
  map.engine = engineFingerprint();
  for (const [name, e] of Object.entries(map.constants)) e.fingerprint = fingerprint(shared[name]);
  fs.writeFileSync(MAP, JSON.stringify(map, null, 2) + "\n");
  console.log(`✓ re-pinned ${Object.keys(map.constants).length} fingerprints and the engine against pangu ${pangu.version}`);
  process.exit(0);
}

const taught = Object.entries(entries).filter(([n, e]) => e.section && isRegexRule(n)).length;
console.log(`mapped ${Object.keys(entries).length} upstream rules and constants (${taught} regex rules taught by example) against pangu ${pangu.version}`);
if (stale.length) {
  console.error(`\n✗ upstream changed ${stale.length} pinned rule(s):`);
  stale.forEach((s) => console.error(`  ${s}`));
  console.error(`  reconcile SKILL.md with each change, then \`npm run update-rules\` to re-pin.`);
}
if (problems.length) {
  console.error(`\n✗ ${problems.length} coverage problem(s):`);
  problems.forEach((p) => console.error(`  ${p}`));
}
if (stale.length || problems.length) process.exit(1);
console.log(`✓ every upstream rule is mapped, pinned, and taught by a SKILL.md example and a snapshot probe`);
