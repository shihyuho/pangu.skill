import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const CHECKER = fileURLToPath(new URL("./check-names.mjs", import.meta.url));

function write(root, file, contents) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

function writeValidFixture(root) {
  write(root, "skills/pangu/SKILL.md", `---
name: pangu
description: Test fixture
---

# pangu

*Paranoid Text Spacing (盤古之白)*
`);
  write(root, "skills/pangu/agents/openai.yaml", `interface:
  display_name: "pangu"
`);
  write(root, ".codex-plugin/plugin.json", JSON.stringify({
    name: "pangu",
    interface: { displayName: "pangu" },
  }));
  write(root, ".agents/plugins/marketplace.json", JSON.stringify({
    name: "catalog-name",
    interface: { displayName: "Catalog Name" },
    plugins: [{ name: "pangu" }],
  }));
  write(root, ".claude-plugin/marketplace.json", JSON.stringify({
    name: "catalog-name",
    plugins: [{ name: "pangu" }],
  }));
}

function validFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pangu-name-check-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeValidFixture(root);
  return root;
}

function rewriteContractName(root, name) {
  const files = [
    "skills/pangu/SKILL.md",
    "skills/pangu/agents/openai.yaml",
    ".codex-plugin/plugin.json",
    ".agents/plugins/marketplace.json",
    ".claude-plugin/marketplace.json",
  ];
  for (const file of files) {
    const target = path.join(root, file);
    fs.writeFileSync(target, fs.readFileSync(target, "utf8").replaceAll("pangu", name));
  }
}

function runChecker(root) {
  return spawnSync(process.execPath, [CHECKER], {
    cwd: root,
    encoding: "utf8",
  });
}

test("valid canonical skill and plugin names pass", (t) => {
  const root = validFixture(t);

  const result = runChecker(root);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /name contract: pangu/);
});

test("case differences fail with the source field and expected value", (t) => {
  const root = validFixture(t);
  write(root, "skills/pangu/agents/openai.yaml", `interface:
  display_name: "Pangu"
`);

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /skills\/pangu\/agents\/openai\.yaml interface\.display_name: expected "pangu", got "Pangu"/,
  );
});

test("missing required fields fail with a targeted diagnostic", (t) => {
  const root = validFixture(t);
  write(root, "skills/pangu/agents/openai.yaml", `interface:
  short_description: "Test fixture"
`);

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /skills\/pangu\/agents\/openai\.yaml interface\.display_name: missing required field/,
  );
});

test("duplicate YAML fields fail instead of accepting the first value", (t) => {
  const root = validFixture(t);
  write(root, "skills/pangu/agents/openai.yaml", `interface:
  display_name: "pangu"
  display_name: "Pangu"
`);

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /skills\/pangu\/agents\/openai\.yaml interface\.display_name: duplicate field \(2 occurrences\)/,
  );
});

test("an invalid canonical slug fails even when every surface agrees", (t) => {
  const root = validFixture(t);
  rewriteContractName(root, "pangu_name");

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /skills\/pangu\/SKILL\.md frontmatter\.name: invalid lowercase slug "pangu_name"/,
  );
});

test("the canonical name must match the skill directory", (t) => {
  const root = validFixture(t);
  rewriteContractName(root, "other-skill");

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /skills\/pangu\/SKILL\.md frontmatter\.name: expected directory name "pangu", got "other-skill"/,
  );
});

test("the unsupported agents plugin displayName field must stay absent", (t) => {
  const root = validFixture(t);
  write(root, ".agents/plugins/marketplace.json", JSON.stringify({
    name: "catalog-name",
    interface: { displayName: "Catalog Name" },
    plugins: [{ name: "pangu", displayName: "pangu" }],
  }));

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /.agents\/plugins\/marketplace\.json plugins\[0\]\.displayName: unsupported field must be absent/,
  );
});

test("missing JSON name fields fail with a targeted diagnostic", (t) => {
  const root = validFixture(t);
  write(root, ".codex-plugin/plugin.json", JSON.stringify({
    name: "pangu",
    interface: {},
  }));

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /.codex-plugin\/plugin\.json interface\.displayName: missing required field/,
  );
});

test("a missing skill H1 fails with a targeted diagnostic", (t) => {
  const root = validFixture(t);
  write(root, "skills/pangu/SKILL.md", `---
name: pangu
description: Test fixture
---

Skill body without a heading.
`);

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /skills\/pangu\/SKILL\.md first H1: missing required heading/);
});

test("missing skill frontmatter fails with a targeted diagnostic", (t) => {
  const root = validFixture(t);
  write(root, "skills/pangu/SKILL.md", `# pangu

*Paranoid Text Spacing (盤古之白)*
`);

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /skills\/pangu\/SKILL\.md frontmatter: missing required block/);
});

test("a nested frontmatter name does not satisfy the top-level field", (t) => {
  const root = validFixture(t);
  write(root, "skills/pangu/SKILL.md", `---
metadata:
  name: pangu
description: Test fixture
---

# pangu
`);

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /skills\/pangu\/SKILL\.md frontmatter\.name: missing required field/,
  );
});

test("display_name under another mapping does not satisfy interface.display_name", (t) => {
  const root = validFixture(t);
  write(root, "skills/pangu/agents/openai.yaml", `other:
  display_name: "pangu"
interface:
  short_description: "Test fixture"
`);

  const result = runChecker(root);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /skills\/pangu\/agents\/openai\.yaml interface\.display_name: missing required field/,
  );
});
