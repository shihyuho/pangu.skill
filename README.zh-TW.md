<p align="center">
  <a href="https://shihyuho.github.io/pangu.skill/">
    <img src="assets/image.png" alt="pangu.skill" width="120" />
  </a>
</p>

<h1 align="center">pangu.skill</h1>

<p align="center"><strong>為什麼 AI 就是不能加個空格呢？</strong></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://shihyuho.github.io/pangu.skill/"><img src="https://img.shields.io/badge/live_demo-df372b" alt="Live demo"></a>
  <a href="https://github.com/vinta/pangu.js/blob/master/HISTORY.md"><img src="https://img.shields.io/github/package-json/dependency-version/shihyuho/pangu.skill/dev/pangu?label=pangu&color=df372b" alt="pangu"></a>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <b>繁體中文</b> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a>
</p>

把「盤古之白」帶給 AI coding agent 的 agent skill / plugin。讓你的 Claude Code、Codex、Cursor、Gemini CLI 等 AI agent 在生成給你的回覆、文件、註解、commit message 或任何中英混排輸出時，自動在 CJK 與半形英文、數字、符號之間補上空白。

AI 很會寫，卻常忘記中英之間要留白。這個 skill 把該加、不該加的規則直接教給它，讓它在落筆當下就寫對，而不是事後再修。

## See it in action

**You type**

> 我用Claude Code寫了3個component，修好login的bug

**pangu writes**

> 我用 Claude Code 寫了 3 個 component，修好 login 的 bug

更多範例看[線上示範](https://shihyuho.github.io/pangu.skill/)。

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

用 Gemini CLI、Antigravity、Cursor、Windsurf、GitHub Copilot、Kiro 或 OpenCode？[完整安裝說明](docs/install.md)全都涵蓋。

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
