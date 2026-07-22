<p align="center">
  <a href="https://shihyuho.github.io/pangu.skill/">
    <img src="assets/image.png" alt="pangu.skill" width="120" />
  </a>
</p>

<h1 align="center">pangu.skill</h1>

<p align="center"><strong>どうして AI はスペースひとつ入れてくれないのだろう？</strong></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://shihyuho.github.io/pangu.skill/"><img src="https://img.shields.io/badge/live_demo-df372b" alt="Live demo"></a>
  <a href="https://github.com/vinta/pangu.js/blob/master/HISTORY.md"><img src="https://img.shields.io/github/package-json/dependency-version/shihyuho/pangu.skill/dev/pangu?label=pangu&color=df372b" alt="pangu"></a>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <b>日本語</b> ·
  <a href="README.ko.md">한국어</a>
</p>

paranoid text spacing（盤古之白）を AI コーディングエージェントにもたらす agent skill / plugin です。Claude Code、Codex、Cursor、Gemini CLI をはじめとする AI エージェントが、生成するあなたへの返信・ドキュメント・コメント・コミットメッセージなどあらゆる出力で、CJK 文字と隣り合う半角の英字・数字・記号の間に自動でスペースを挿入します。

AI は文章を書くのが得意ですが、CJK と Latin の間にスペースを入れることをつい忘れてしまいます。この skill は、どこにスペースを入れ、どこはそのままにしておくかというルールを直接 AI に教え込むので、後から直すのではなく、書いたその瞬間に正しく書けるようになります。

## See it in action

**You type**

> 我用Claude Code寫了3個component，修好login的bug

**pangu writes**

> 我用 Claude Code 寫了 3 個 component，修好 login 的 bug

その他の例は[ライブデモ](https://shihyuho.github.io/pangu.skill/)で。

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

Gemini CLI、Antigravity、Cursor、Windsurf、GitHub Copilot、Kiro、OpenCode をお使いですか？[詳しいインストール手順](docs/install.md)ですべて解説しています。

## Related Projects

Paranoid text spacing には、移植版の大きなファミリーがあります。

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
