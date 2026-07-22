# pangu.skill

[English](README.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

> 為什麼 AI 就是不能加個空格呢？

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Live demo](https://img.shields.io/badge/live_demo-df372b)](https://shihyuho.github.io/pangu.skill/) [![pangu](https://img.shields.io/github/package-json/dependency-version/shihyuho/pangu.skill/dev/pangu?label=pangu&color=df372b)](https://github.com/vinta/pangu.js/releases)

把「盤古之白」帶給 AI coding agent 的 agent skill / plugin。讓你的 Claude Code、Codex、Cursor、Gemini CLI 等 AI agent 在生成給你的回覆、文件、註解、commit message 或任何中英混排輸出時，自動在 CJK 與半形英文、數字、符號之間補上空白。

AI 很會寫，卻常忘記中英之間要留白。這個 skill 把該加、不該加的規則直接教給它，讓它在落筆當下就寫對，而不是事後再修。

## Installation

分兩種：有套件管理器的 agent 一鍵安裝；其餘 agent 把 [`skills/pangu/SKILL.md`](skills/pangu/SKILL.md) 複製進它讀得到的規則目錄即可。

### 套件管理器（一鍵安裝）

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

裝完用 `/skills list` 確認 `pangu` 已就緒。

#### Antigravity

```bash
agy plugin install https://github.com/shihyuho/pangu.skill.git
```

#### skills (npx)

也可以用 [skills](https://github.com/vercel-labs/skills) 單獨安裝：

```bash
npx skills add shihyuho/pangu.skill --skill pangu
```

### 其他 agent（複製規則檔）

Cursor、Windsurf、GitHub Copilot、Kiro、OpenCode 沒有 plugin 安裝器，做法是把 `skills/pangu/SKILL.md` 放進它各自會讀的位置。不必 clone 整個 repo，直接抓 raw 檔即可：

| Agent | 放這裡 |
| --- | --- |
| Cursor | `.cursor/rules/pangu.md` |
| Windsurf | 附加到 `.windsurfrules` |
| GitHub Copilot | `.github/skills/pangu/SKILL.md` |
| Kiro | `.kiro/skills/pangu/SKILL.md` |
| OpenCode | 複製到 `skills/pangu/SKILL.md`，並在 `AGENTS.md` 指示 agent 用內建 `skill` 工具載入並遵循它 |

以 Cursor 為例：

```bash
mkdir -p .cursor/rules
curl -sL https://raw.githubusercontent.com/shihyuho/pangu.skill/main/skills/pangu/SKILL.md \
  -o .cursor/rules/pangu.md
```

其餘平台改一下目的路徑即可（Windsurf 用 `>> .windsurfrules` 附加）。

## Related Projects

盤古之白有一整個移植家族。

- [pangu.js](https://github.com/vinta/pangu.js)（JavaScript，上游 / SoT）
- [pangu.go](https://github.com/vinta/pangu)（Go）
- [pangu.java](https://github.com/vinta/pangu.java)（Java）
- [pangu.py](https://github.com/vinta/pangu.py)（Python）
- [pangu.clj](https://github.com/coldnew/pangu.clj)（Clojure / ClojureScript）
- [pangu.dart](https://github.com/SemonCat/pangu.dart)（Dart）
- [pangu.ex](https://github.com/cataska/pangu.ex)（Elixir）
- [pangu.objective-c](https://github.com/Cee/pangu.objective-c)（Objective-C）
- [pangu.php](https://github.com/Kunr/pangu.php)（PHP）
- [pangu.rb](https://github.com/dlackty/pangu.rb)（Ruby）
- [pangu.rs](https://github.com/airt/pangu.rs)（Rust）
- [pangu.swift](https://github.com/X140Yu/pangu.Swift)（Swift）

## License

[MIT](LICENSE) © Shihyu Ho
