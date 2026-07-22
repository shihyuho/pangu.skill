# Install

pangu.skill ships as an agent skill / plugin. Agents with a package manager install it in one step; everything else just copies [`skills/pangu/SKILL.md`](../skills/pangu/SKILL.md) into the rules directory it reads.

## Package managers (one-step install)

### Claude Code

```bash
claude plugin marketplace add shihyuho/pangu.skill
claude plugin install pangu@pangu
```

### Codex

```bash
codex plugin marketplace add shihyuho/pangu.skill
codex plugin add pangu@pangu
```

### Gemini CLI

```bash
gemini skills install https://github.com/shihyuho/pangu.skill.git --path skills
```

Verify with `/skills list` that `pangu` is ready.

### Antigravity

```bash
agy plugin install https://github.com/shihyuho/pangu.skill.git
```

### skills (npx)

You can also install it standalone with [skills](https://github.com/vercel-labs/skills):

```bash
npx skills add shihyuho/pangu.skill --skill pangu
```

Or browse the listing on [skills.sh](https://www.skills.sh/shihyuho/pangu.skill/pangu).

## Other agents (copy the rules file)

Cursor, Windsurf, GitHub Copilot, Kiro, and OpenCode have no plugin installer — put `skills/pangu/SKILL.md` where each one reads it. No need to clone the whole repo; grab the raw file directly:

| Agent | Put it here |
| --- | --- |
| Cursor | `.cursor/rules/pangu.md` |
| Windsurf | append to `.windsurfrules` |
| GitHub Copilot | `.github/skills/pangu/SKILL.md` |
| Kiro | `.kiro/skills/pangu/SKILL.md` |
| OpenCode | copy to `skills/pangu/SKILL.md`, then in `AGENTS.md` tell the agent to load and follow it via the built-in `skill` tool |

For Cursor, for example:

```bash
mkdir -p .cursor/rules
curl -sL https://raw.githubusercontent.com/shihyuho/pangu.skill/main/skills/pangu/SKILL.md \
  -o .cursor/rules/pangu.md
```

For the other platforms, just change the destination path (Windsurf uses `>> .windsurfrules` to append).
