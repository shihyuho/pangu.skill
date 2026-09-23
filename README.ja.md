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
  <a href="https://github.com/vinta/pangu.js/blob/master/CHANGELOG.md"><img src="https://img.shields.io/github/package-json/dependency-version/shihyuho/pangu.skill/dev/pangu?label=pangu&color=df372b" alt="pangu"></a>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <b>日本語</b> ·
  <a href="README.ko.md">한국어</a>
</p>

Claude Code、Codex、Antigravity、Cursor、Gemini CLI などの AI コーディングエージェント向けの skill / plugin です。CJK 混在の返信、ドキュメント、コメント、コミットメッセージを書く際に、paranoid text spacing（盤古之白）を自動で適用します。

今回の依頼で新規作成・編集する自然言語を整え、コード、マークアップ、URL、パス、正確な引用は保持します。ユーザー指定の形式と編集範囲を優先し、範囲外の既存テキストはそのまま残します。

文字規則は pangu.js に従い、漢字、仮名、注音を対象とします。ハングルは変更しません。`é`、`β`、`Ⅻ`、`✓`、`℃` など、特定の Unicode 範囲の文字が CJK に接する場合も空白を挿入します。スラッシュでつながる文字列は保持し、`²` や `™` などの上付き接尾辞は直前の文字に付けたままにします。実行時に必要な規則は、一つの `SKILL.md` にすべて含まれています。

## See it in action

**You type**

> 我用Claude Code寫了3個component，修好login的bug

**適用後**

> 我用 Claude Code 寫了 3 個 component，修好 login 的 bug

[ライブデモ](https://shihyuho.github.io/pangu.skill/) では pangu.js のプレーンテキスト処理を確認できます。エージェントは自然言語の範囲を判断しますが、デモはライブラリを直接適用します。

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

Gemini CLI、Cursor、Windsurf、GitHub Copilot、Kiro、OpenCode をお使いですか？[詳しいインストール手順](docs/install.md)ですべて解説しています。

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

## Support

pangu.skill が役に立ったら、[Buy Me a Coffee](https://buymeacoffee.com/methodho) からこのスキルのメンテナンスを支援できます。

## License

[MIT](LICENSE) © Shihyu Ho
