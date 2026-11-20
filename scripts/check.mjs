// Run every checker, even after one fails, so a pangu bump shows its stale
// stamps, behavior changes, and rule changes in a single pass. Exits nonzero
// when any checker failed.
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const tests = fs.readdirSync("scripts").filter((f) => f.endsWith(".test.mjs")).sort().map((f) => `scripts/${f}`);
const CHECKS = [
  ["tests", ["--test", ...tests]],
  ["names", ["scripts/check-names.mjs"]],
  ["examples", ["scripts/check-skill.mjs"]],
  ["snapshot", ["scripts/check-snapshot.mjs"]],
  ["coverage", ["scripts/check-coverage.mjs"]],
  ["prose fixtures", ["scripts/check-prose-evals.mjs"]],
];

const failed = [];
for (const [name, args] of CHECKS) {
  const { status } = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (status !== 0) failed.push(name);
}
if (failed.length) {
  console.error(`\n✗ failing checks: ${failed.join(", ")}`);
  process.exit(1);
}
