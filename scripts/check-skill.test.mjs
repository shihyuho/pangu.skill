import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import pangu from "pangu";

const checker = fileURLToPath(new URL("./check-skill.mjs", import.meta.url));
function fixture(t, examples, version = pangu.version) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pangu-check-skill-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, "skills/pangu"), { recursive: true });
  fs.mkdirSync(path.join(dir, "site"));
  fs.writeFileSync(path.join(dir, "skills/pangu/SKILL.md"), examples + `\n_Rules verified against pangu **${version}**._\n`);
  fs.writeFileSync(path.join(dir, "site/index.html"), `<script src="https://cdn.jsdelivr.net/npm/pangu@${version}/dist/browser/pangu.umd.js"></script>\n`);
  return dir;
}
function run(dir, ...args) {
  return spawnSync(process.execPath, [checker, ...args], { cwd: dir, encoding: "utf8" });
}

test("an empty teaching corpus fails instead of silently passing", (t) => {
  const result = run(fixture(t, "# pangu\nNo parsed examples here.\n"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no before\/after examples found/);
});

test("fenced and table examples remain checked", (t) => {
  const dir = fixture(t, "```\n中文API → 中文 API\n```\n\n| Label | Before | After |\n| --- | --- | --- |\n| English | `A-B` | `A-B` |\n");
  const result = run(dir);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /checked 2 examples/);
});

test("an example with the wrong output fails", (t) => {
  const result = run(fixture(t, "```\n中文API → 中文API\n```\n"));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /example\(s\) drift/);
});

test("a version bump requires explicit stamp repair and never updates snapshots", (t) => {
  const dir = fixture(t, "```\n中文API → 中文 API\n```\n", "0.0.0");
  const skill = path.join(dir, "skills/pangu/SKILL.md");
  const site = path.join(dir, "site/index.html");
  const snapshot = path.join(dir, "scripts/pangu-snapshot.jsonl");
  fs.mkdirSync(path.dirname(snapshot));
  fs.writeFileSync(snapshot, '["中文API","中文 API"]\n');
  const beforeSkill = fs.readFileSync(skill, "utf8");
  const beforeSite = fs.readFileSync(site, "utf8");
  const beforeSnapshot = fs.readFileSync(snapshot);
  const failed = run(dir);
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /2 version stamp\(s\) out of date/);
  assert.equal(fs.readFileSync(skill, "utf8"), beforeSkill);
  assert.equal(fs.readFileSync(site, "utf8"), beforeSite);
  const fixed = run(dir, "--fix-stamps");
  assert.equal(fixed.status, 0, fixed.stderr);
  assert.equal(fs.readFileSync(skill, "utf8"), beforeSkill.replace("0.0.0", pangu.version));
  assert.equal(fs.readFileSync(site, "utf8"), beforeSite.replace("0.0.0", pangu.version));
  assert.deepEqual(fs.readFileSync(snapshot), beforeSnapshot);
  assert.equal(run(dir).status, 0);
});
