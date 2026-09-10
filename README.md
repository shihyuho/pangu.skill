<p align="center">
  <a href="https://shihyuho.github.io/pangu.skill/">
    <img src="assets/image.png" alt="pangu.skill" width="120" />
  </a>
</p>

<h1 align="center">pangu.skill</h1>

<p align="center"><strong>Why can't AI just add a space?</strong></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://shihyuho.github.io/pangu.skill/"><img src="https://img.shields.io/badge/live_demo-df372b" alt="Live demo"></a>
  <a href="https://github.com/vinta/pangu.js/blob/master/HISTORY.md"><img src="https://img.shields.io/github/package-json/dependency-version/shihyuho/pangu.skill/dev/pangu?label=pangu&color=df372b" alt="pangu"></a>
</p>

<p align="center">
  <b>English</b> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a>
</p>

An agent skill / plugin for Claude Code, Codex, Antigravity, Cursor, Gemini CLI, and other AI coding agents. It applies paranoid text spacing (盤古之白) as the agent writes CJK-mixed replies, docs, comments, and commit messages.

It spaces the prose created or edited for your task while preserving code, markup, URLs, paths, and exact quotations. Your requested format and editing scope take priority; existing text outside that scope stays as received.

The text rules follow pangu.js for Han ideographs, Japanese kana, and bopomofo; Hangul is unchanged. All runtime rules fit in one `SKILL.md`.

## See it in action

**You type**

> 我用Claude Code寫了3個component，修好login的bug

**With spacing**

> 我用 Claude Code 寫了 3 個 component，修好 login 的 bug

The [live demo](https://shihyuho.github.io/pangu.skill/) shows pangu.js on plain text. The agent handles prose boundaries; the demo applies the library directly.

## Install

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add shihyuho/pangu.skill
claude plugin install pangu@pangu
```

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add shihyuho/pangu.skill
codex plugin add pangu@pangu
```

</details>

<details>
<summary><strong>Antigravity</strong></summary>

```bash
agy plugin install https://github.com/shihyuho/pangu.skill.git
```

</details>

Using Gemini CLI, Cursor, Windsurf, GitHub Copilot, Kiro, or OpenCode? The [full install guide](docs/install.md) covers them all.

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
