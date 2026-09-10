import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import pangu from "pangu";
import { validateSuite, gradeOutput } from "./check-prose-evals.mjs";

const suite = JSON.parse(fs.readFileSync(new URL("../evals/evals.json", import.meta.url), "utf8"));

test("authored expectations preserve literals and match their declared text oracle", () => {
  validateSuite(suite);
});

test("invalid fixture identities and protected-text changes fail validation", () => {
  const duplicate = structuredClone(suite);
  duplicate.evals.push(duplicate.evals[0]);
  assert.throws(() => validateSuite(duplicate), /duplicate eval id/);
  const broken = structuredClone(suite);
  broken.evals[1].expected_output = broken.evals[1].expected_output.replace("中文API?q", "中文 API?q");
  assert.throws(() => validateSuite(broken), /protected literal/);
});

test("grading catches raw library damage to a Markdown link destination", () => {
  const item = suite.evals.find((e) => e.id === 2);
  assert.equal(gradeOutput(item, item.expected_output).passed, true);
  const result = gradeOutput(item, pangu.spacingText(item.input));
  assert.equal(result.passed, false);
  assert.deepEqual(result.changedLiterals, item.preserve);
});

test("grading catches edits outside the task and additional whitespace", () => {
  const item = suite.evals.find((e) => e.id === 9);
  assert.equal(gradeOutput(item, item.expected_output.replace("既有API", "既有 API")).passed, false);
  assert.equal(gradeOutput(item, item.expected_output + "\n").passed, false);
});

test("the grading command requires an output for every case", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pangu-prose-outputs-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const item of suite.evals) {
    fs.writeFileSync(path.join(dir, `${item.id}.txt`), item.expected_output);
  }
  const script = fileURLToPath(new URL("./check-prose-evals.mjs", import.meta.url));
  const run = () => spawnSync(process.execPath, [script, dir], { encoding: "utf8" });
  const complete = run();
  assert.equal(complete.status, 0, complete.stderr);
  fs.rmSync(path.join(dir, "2.txt"));
  const incomplete = run();
  assert.equal(incomplete.status, 1);
  assert.match(incomplete.stderr, /2 markdown-link: missing/);
});
