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

適用於 Claude Code、Codex、Antigravity、Cursor、Gemini CLI 等 AI coding agent 的 skill / plugin。讓 agent 在撰寫 CJK 混排的回覆、文件、註解與 commit message 時，自動套用「盤古之白」。

只處理本次任務新增或修改的自然語言，保留程式碼、標記語法、URL、路徑與精確引文。使用者指定的格式和編輯範圍優先，範圍外的既有文字維持原樣。

文字規則依照 pangu.js，適用於漢字、日文假名與注音；Hangul 維持原樣。所有執行規則都包含在一份 `SKILL.md` 中。

## See it in action

**You type**

> 我用Claude Code寫了3個component，修好login的bug

**套用空白後**

> 我用 Claude Code 寫了 3 個 component，修好 login 的 bug

[線上示範](https://shihyuho.github.io/pangu.skill/) 展示 pangu.js 的純文字處理結果。Agent 會判斷自然語言的範圍，示範則直接套用函式庫。

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

用 Gemini CLI、Cursor、Windsurf、GitHub Copilot、Kiro 或 OpenCode？[完整安裝說明](docs/install.md)全都涵蓋。

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
