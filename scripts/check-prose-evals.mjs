// Validate authored fixtures, or grade externally generated output files.
// This script never calls a model or formats a document.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pangu from "pangu";

export function validateSuite(suite) {
  if (suite.skill_name !== "pangu" || !Array.isArray(suite.evals) || !suite.evals.length) {
    throw new Error("Expected a nonempty pangu evaluation suite");
  }
  const ids = new Set();
  for (const item of suite.evals) {
    if (!Number.isSafeInteger(item.id) || item.id <= 0 || ids.has(item.id)) {
      throw new Error(`Invalid or duplicate eval id: ${item.id}`);
    }
    ids.add(item.id);
    for (const field of ["category", "prompt", "input", "expected_output"]) {
      if (typeof item[field] !== "string" || !item[field].length) {
        throw new Error(`Eval ${item.id}: missing ${field}`);
      }
    }
    if (!Array.isArray(item.preserve)) throw new Error(`Eval ${item.id}: missing preserve list`);
    for (const literal of item.preserve) {
      if (typeof literal !== "string" || !literal.length || !item.input.includes(literal)) {
        throw new Error(`Eval ${item.id}: invalid protected literal`);
      }
      if (item.input.split(literal).length !== item.expected_output.split(literal).length) {
        throw new Error(`Eval ${item.id}: expected output changes a protected literal`);
      }
    }
    if (item.oracle !== undefined && item.oracle !== "pangu") {
      throw new Error(`Eval ${item.id}: unsupported oracle`);
    }
    if (item.oracle === "pangu" && pangu.spacingText(item.input) !== item.expected_output) {
      throw new Error(`Eval ${item.id}: plain-text expectation drifted from pangu ${pangu.version}`);
    }
  }
}

export function gradeOutput(item, actual) {
  return {
    passed: actual === item.expected_output,
    changedLiterals: item.preserve.filter(
      (literal) => actual.split(literal).length !== item.expected_output.split(literal).length,
    ),
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    const suite = JSON.parse(fs.readFileSync(new URL("../evals/evals.json", import.meta.url), "utf8"));
    validateSuite(suite);
    const outputDir = process.argv[2];
    if (process.argv.length > 3) throw new Error("Usage: node scripts/check-prose-evals.mjs [output-directory]");
    if (!outputDir) {
      console.log(`✓ validated ${suite.evals.length} prose fixtures; no model outputs evaluated`);
    } else {
      let failed = 0;
      for (const item of suite.evals) {
        const file = path.join(outputDir, `${item.id}.txt`);
        if (!fs.existsSync(file)) {
          failed++;
          console.error(`✗ ${item.id} ${item.category}: missing ${file}`);
          continue;
        }
        const result = gradeOutput(item, fs.readFileSync(file, "utf8"));
        if (!result.passed) {
          failed++;
          const why = result.changedLiterals.length ? "protected text changed" : "output differs (including whitespace)";
          console.error(`✗ ${item.id} ${item.category}: ${why}`);
        } else {
          console.log(`✓ ${item.id} ${item.category}`);
        }
      }
      console.log(`${suite.evals.length - failed}/${suite.evals.length} supplied outputs match the fixtures`);
      if (failed) process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
