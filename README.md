# pangu.skill

[English](README.md) | [繁體中文](README.zh-TW.md)

> Why can't AI just add a space?

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Live demo](https://img.shields.io/badge/live_demo-df372b)](https://shihyuho.github.io/pangu.skill/)

An agent skill / plugin that brings paranoid text spacing (盤古之白) to AI coding agents. It makes your Claude Code, Codex, Cursor, Gemini CLI, and other AI agents automatically insert a space between CJK characters and adjacent half-width letters, numbers, and symbols in any prose, docs, comments, or commit messages they generate.

AI writes well, but it keeps forgetting to leave room between CJK and Latin. This skill teaches it the rules — what to space and what to leave alone — so it gets it right the moment it types, instead of fixing it afterward.

## Installation

Two paths: agents with a package manager install in one step; everything else just copies [`skills/pangu/SKILL.md`](skills/pangu/SKILL.md) into the rules directory it reads.

### Package managers (one-step install)

#### Claude Code

```bash
claude plugin marketplace add shihyuho/pangu.skill
claude plugin install pangu@pangu
```

#### Codex

```bash
codex plugin marketplace add shihyuho/pangu.skill
codex plugin add pangu@pangu
```

#### Gemini CLI

```bash
gemini skills install https://github.com/shihyuho/pangu.skill.git --path skills
```

Verify with `/skills list` that `pangu` is ready.

#### Antigravity

```bash
agy plugin install https://github.com/shihyuho/pangu.skill.git
```

#### skills (npx)

You can also install it standalone with [skills](https://github.com/vercel-labs/skills):

```bash
npx skills add shihyuho/pangu.skill --skill pangu
```

### Other agents (copy the rules file)

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

## Related Projects

Paranoid text spacing has a whole family of ports.

- [pangu.js](https://github.com/vinta/pangu.js) (JavaScript, upstream / SoT)
- [pangu.go](https://github.com/vinta/pangu) (Go)
- [pangu.java](https://github.com/vinta/pangu.java) (Java)
- [pangu.py](https://github.com/vinta/pangu.py) (Python)
- [pangu.clj](https://github.com/coldnew/pangu.clj) (Clojure / ClojureScript)
- [pangu.dart](https://github.com/SemonCat/pangu.dart) (Dart)
- [pangu.ex](https://github.com/cataska/pangu.ex) (Elixir)
- [pangu.objective-c](https://github.com/Cee/pangu.objective-c) (Objective-C)
- [pangu.php](https://github.com/Kunr/pangu.php) (PHP)
- [pangu.rb](https://github.com/dlackty/pangu.rb) (Ruby)
- [pangu.rs](https://github.com/airt/pangu.rs) (Rust)
- [pangu.swift](https://github.com/X140Yu/pangu.Swift) (Swift)

## License

[MIT](LICENSE) © Shihyu Ho
