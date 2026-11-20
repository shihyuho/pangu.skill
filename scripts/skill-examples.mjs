import fs from "node:fs";

// Read SKILL.md's `before → after` examples: lines with `→` inside fenced code
// blocks, and table rows whose last two cells are inline code. Each example
// carries its 1-based line and the nearest H2–H6 heading above it; `sections`
// lists every such heading.
export function readSkillExamples(file) {
  const sections = new Set();
  const examples = [];
  let section = null;
  let inFence = false;
  fs.readFileSync(file, "utf8").split("\n").forEach((raw, idx) => {
    const line = idx + 1;
    if (/^\s*(```|~~~)/.test(raw)) { inFence = !inFence; return; }
    if (!inFence && /^#{2,6} /.test(raw)) { section = raw.replace(/^#+ /, "").trim(); sections.add(section); return; }
    if (inFence) {
      const i = raw.indexOf("→");
      if (i !== -1) examples.push({ line, section, before: raw.slice(0, i).trim(), after: raw.slice(i + 1).trim().split(/\s{2,}/)[0] });
      return;
    }
    if (raw.trim().startsWith("|") && raw.includes("`")) {
      const cells = raw.split("|").map((c) => c.trim());
      const [before, after] = [cells.at(-3), cells.at(-2)];
      const code = (c) => c && /^`[^`]*`$/.test(c);
      if (code(before) && code(after)) examples.push({ line, section, before: before.slice(1, -1), after: after.slice(1, -1) });
    }
  });
  return { sections, examples };
}
