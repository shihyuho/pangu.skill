// Guard the canonical skill name across the agent and plugin surfaces that
// represent this repository's single pangu skill. Marketplace-level branding
// is intentionally outside this contract.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const skillFile = path.join(root, "skills/pangu/SKILL.md");
const skillText = fs.readFileSync(skillFile, "utf8");
const frontmatter = skillText.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
const errors = [];
if (!frontmatter) {
  errors.push("skills/pangu/SKILL.md frontmatter: missing required block");
}

function topLevelScalar(text, key, source) {
  const matches = [...text.matchAll(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "gm"))];
  return matchedScalar(matches.map((match) => match[1]), source);
}

function matchedScalar(values, source) {
  if (!values.length) {
    errors.push(`${source}: missing required field`);
    return undefined;
  }
  if (values.length > 1) {
    errors.push(`${source}: duplicate field (${values.length} occurrences)`);
    return undefined;
  }
  const raw = values[0].trim();
  if (raw.startsWith('"') && raw.endsWith('"')) return JSON.parse(raw);
  if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1).replaceAll("''", "'");
  return raw;
}

function mappingScalar(text, parentKey, childKey, source) {
  const lines = text.split(/\r?\n/);
  const parentIndexes = lines.flatMap((line, index) =>
    new RegExp(`^${parentKey}:\\s*(?:#.*)?$`).test(line) ? [index] : [],
  );
  const values = [];

  for (const parentIndex of parentIndexes) {
    const entries = [];
    for (let index = parentIndex + 1; index < lines.length; index++) {
      const line = lines[index];
      if (!line.trim() || line.trimStart().startsWith("#")) continue;
      const match = line.match(/^([ \t]+)([A-Za-z0-9_-]+):\s*(.*?)\s*$/);
      if (!match) {
        if (!/^[ \t]/.test(line)) break;
        continue;
      }
      entries.push({ indent: match[1].length, key: match[2], value: match[3] });
    }
    const directIndent = Math.min(...entries.map((entry) => entry.indent));
    values.push(
      ...entries
        .filter((entry) => entry.indent === directIndent && entry.key === childKey)
        .map((entry) => entry.value),
    );
  }

  return matchedScalar(values, source);
}

function requiredString(value, source) {
  if (typeof value !== "string") {
    errors.push(`${source}: missing required field`);
    return undefined;
  }
  return value;
}

const canonicalName = frontmatter
  ? topLevelScalar(frontmatter[1], "name", "skills/pangu/SKILL.md frontmatter.name")
  : undefined;
if (canonicalName !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(canonicalName)) {
  errors.push(
    `skills/pangu/SKILL.md frontmatter.name: invalid lowercase slug ${JSON.stringify(canonicalName)}`,
  );
}
const skillDirectoryName = path.basename(path.dirname(skillFile));
if (canonicalName !== undefined && canonicalName !== skillDirectoryName) {
  errors.push(
    `skills/pangu/SKILL.md frontmatter.name: expected directory name ${JSON.stringify(skillDirectoryName)}, got ${JSON.stringify(canonicalName)}`,
  );
}
const skillBody = frontmatter ? skillText.slice(frontmatter[0].length) : skillText;
const firstH1Match = skillBody.match(/^#\s+(.+?)\s*$/m);
const firstH1 = firstH1Match?.[1];
if (firstH1 === undefined) {
  errors.push("skills/pangu/SKILL.md first H1: missing required heading");
}
const openaiName = mappingScalar(
  fs.readFileSync(path.join(root, "skills/pangu/agents/openai.yaml"), "utf8"),
  "interface",
  "display_name",
  "skills/pangu/agents/openai.yaml interface.display_name",
);
const codexPlugin = JSON.parse(fs.readFileSync(path.join(root, ".codex-plugin/plugin.json"), "utf8"));
const agentsMarketplace = JSON.parse(
  fs.readFileSync(path.join(root, ".agents/plugins/marketplace.json"), "utf8"),
);
const claudeMarketplace = JSON.parse(
  fs.readFileSync(path.join(root, ".claude-plugin/marketplace.json"), "utf8"),
);
const codexPluginName = requiredString(codexPlugin.name, ".codex-plugin/plugin.json name");
const codexDisplayName = requiredString(
  codexPlugin.interface?.displayName,
  ".codex-plugin/plugin.json interface.displayName",
);

agentsMarketplace.plugins.forEach((plugin, index) => {
  if (Object.hasOwn(plugin, "displayName")) {
    errors.push(
      `.agents/plugins/marketplace.json plugins[${index}].displayName: unsupported field must be absent`,
    );
  }
});

const surfaces = [
  ["skills/pangu/SKILL.md first H1", firstH1],
  ["skills/pangu/agents/openai.yaml interface.display_name", openaiName],
  [".codex-plugin/plugin.json name", codexPluginName],
  [".codex-plugin/plugin.json interface.displayName", codexDisplayName],
  ...agentsMarketplace.plugins.map((plugin, index) => [
    `.agents/plugins/marketplace.json plugins[${index}].name`,
    requiredString(
      plugin.name,
      `.agents/plugins/marketplace.json plugins[${index}].name`,
    ),
  ]),
  ...claudeMarketplace.plugins.map((plugin, index) => [
    `.claude-plugin/marketplace.json plugins[${index}].name`,
    requiredString(
      plugin.name,
      `.claude-plugin/marketplace.json plugins[${index}].name`,
    ),
  ]),
];

const mismatches = surfaces.filter(([, actual]) => actual !== undefined && actual !== canonicalName);
for (const [surface, actual] of mismatches) {
  errors.push(`${surface}: expected ${JSON.stringify(canonicalName)}, got ${JSON.stringify(actual)}`);
}

if (errors.length) {
  errors.forEach((error) => console.error(error));
  process.exit(1);
}

console.log(`✓ name contract: ${canonicalName} across ${surfaces.length} skill/plugin surfaces`);
