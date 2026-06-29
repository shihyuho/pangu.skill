# pangu.skill

[English](README.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

> どうして AI はスペースひとつ入れてくれないのだろう？

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Live demo](https://img.shields.io/badge/live_demo-df372b)](https://shihyuho.github.io/pangu.skill/)

paranoid text spacing（盤古之白）を AI コーディングエージェントにもたらす agent skill / plugin です。Claude Code、Codex、Cursor、Gemini CLI をはじめとする AI エージェントが、生成する文章・ドキュメント・コメント・コミットメッセージなどあらゆる出力で、CJK 文字と隣り合う半角の英字・数字・記号の間に自動でスペースを挿入します。

AI は文章を書くのが得意ですが、CJK と Latin の間にスペースを入れることをつい忘れてしまいます。この skill は、どこにスペースを入れ、どこはそのままにしておくかというルールを直接 AI に教え込むので、後から直すのではなく、書いたその瞬間に正しく書けるようになります。

## Installation

方法は 2 通りです。パッケージマネージャーを備えたエージェントはワンステップでインストールでき、それ以外は、エージェントが読み込むルールディレクトリに [`skills/pangu/SKILL.md`](skills/pangu/SKILL.md) をコピーするだけです。

### パッケージマネージャー（ワンステップでインストール）

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

`/skills list` で `pangu` が利用可能になっているか確認してください。

#### Antigravity

```bash
agy plugin install https://github.com/shihyuho/pangu.skill.git
```

#### skills (npx)

[skills](https://github.com/vercel-labs/skills) を使って単独でインストールすることもできます：

```bash
npx skills add shihyuho/pangu.skill --skill pangu
```

### その他のエージェント（ルールファイルをコピー）

Cursor、Windsurf、GitHub Copilot、Kiro、OpenCode には plugin インストーラーがないため、`skills/pangu/SKILL.md` をそれぞれが読み込む場所に置きます。リポジトリ全体を clone する必要はなく、raw ファイルを直接取得すれば十分です：

| Agent | 配置先 |
| --- | --- |
| Cursor | `.cursor/rules/pangu.md` |
| Windsurf | `.windsurfrules` に追記 |
| GitHub Copilot | `.github/skills/pangu/SKILL.md` |
| Kiro | `.kiro/skills/pangu/SKILL.md` |
| OpenCode | `skills/pangu/SKILL.md` にコピーし、`AGENTS.md` で組み込みの `skill` ツールを介してそれを読み込んで従うようエージェントに指示する |

たとえば Cursor の場合：

```bash
mkdir -p .cursor/rules
curl -sL https://raw.githubusercontent.com/shihyuho/pangu.skill/main/skills/pangu/SKILL.md \
  -o .cursor/rules/pangu.md
```

他のプラットフォームでは、コピー先のパスを変えるだけです（Windsurf は `>> .windsurfrules` で追記します）。

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
