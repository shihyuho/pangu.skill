import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const checker = fileURLToPath(new URL("./check-coverage.mjs", import.meta.url));
const repo = fileURLToPath(new URL("..", import.meta.url));
const FILES = ["skills/pangu/SKILL.md", "scripts/pangu-snapshot.jsonl", "scripts/upstream-rules.json"];

function isolatedChecker(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pangu-check-coverage-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const f of FILES) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    fs.copyFileSync(path.join(repo, f), path.join(dir, f));
  }
  const edit = (f, fn) => fs.writeFileSync(path.join(dir, f), fn(fs.readFileSync(path.join(dir, f), "utf8")));
  const run = (...args) => spawnSync(process.execPath, [checker, ...args], { cwd: dir, encoding: "utf8" });
  return { dir, edit, run };
}
const editMap = (fn) => (text) => {
  const map = JSON.parse(text);
  fn(map);
  return JSON.stringify(map, null, 2) + "\n";
};

test("the committed skill, snapshot, and map pass", (t) => {
  const { run } = isolatedChecker(t);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /every upstream rule is mapped, pinned, and taught/);
});

test("removing the only example of a rule names that rule", (t) => {
  const { edit, run } = isolatedChecker(t);
  edit("skills/pangu/SKILL.md", (s) => s.replace("記住:(東西) → 記住：(東西)\n", ""));
  const result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /FIX_CJK_COLON_ANS: no example under "Punctuation"/);
});

test("an example only counts in the section the rule is mapped to", (t) => {
  const { edit, run } = isolatedChecker(t);
  edit("skills/pangu/SKILL.md", (s) =>
    s.replace("記住:(東西) → 記住：(東西)\n", "").replace("前面`code`後面 → 前面 `code` 後面\n", "$&記住:(東西) → 記住：(東西)\n"),
  );
  const result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /FIX_CJK_COLON_ANS: no example under "Punctuation"/);
});

test("an upstream constant missing from the map fails", (t) => {
  const { edit, run } = isolatedChecker(t);
  edit("scripts/upstream-rules.json", editMap((m) => delete m.constants.S_A));
  const result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unmapped upstream constant S_A/);
});

test("an inline rule missing from the map fails with the input that fired it", (t) => {
  const { edit, run } = isolatedChecker(t);
  edit("scripts/upstream-rules.json", editMap((m) => delete m.inline.COMPOUND_WORD));
  const result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unmapped inline rule .*first changed/);
});

test("a rule no snapshot probe fires fails", (t) => {
  const { edit, run } = isolatedChecker(t);
  edit("scripts/pangu-snapshot.jsonl", (s) => s.split("\n").filter((l) => !l.startsWith('["前面#話題#後面"')).join("\n"));
  const result = run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /HASH_ANS_CJK_HASH: no snapshot probe/);
});

test("a changed upstream value opens a review, and --update re-pins it", (t) => {
  const { edit, run } = isolatedChecker(t);
  edit("scripts/upstream-rules.json", editMap((m) => (m.constants.PRODUCT_NAME.fingerprint = "000000000000")));
  const stale = run();
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /upstream changed 1 pinned rule\(s\):\n  PRODUCT_NAME = /);
  const updated = run("--update");
  assert.equal(updated.status, 0, updated.stderr);
  assert.equal(run().status, 0);
});

test("--update refuses to re-pin while a rule is untaught", (t) => {
  const { dir, edit, run } = isolatedChecker(t);
  edit("skills/pangu/SKILL.md", (s) => s.replace("記住:(東西) → 記住：(東西)\n", ""));
  edit("scripts/upstream-rules.json", editMap((m) => (m.constants.PRODUCT_NAME.fingerprint = "000000000000")));
  const before = fs.readFileSync(path.join(dir, "scripts/upstream-rules.json"), "utf8");
  const result = run("--update");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /FIX_CJK_COLON_ANS/);
  assert.equal(fs.readFileSync(path.join(dir, "scripts/upstream-rules.json"), "utf8"), before);
});
