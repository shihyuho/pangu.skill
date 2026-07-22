<p align="center">
  <a href="https://shihyuho.github.io/pangu.skill/">
    <img src="assets/image.png" alt="pangu.skill" width="120" />
  </a>
</p>

<h1 align="center">pangu.skill</h1>

<p align="center"><strong>AI는 왜 그냥 공백 하나를 못 넣을까?</strong></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://shihyuho.github.io/pangu.skill/"><img src="https://img.shields.io/badge/live_demo-df372b" alt="Live demo"></a>
  <a href="https://github.com/vinta/pangu.js/blob/master/HISTORY.md"><img src="https://img.shields.io/github/package-json/dependency-version/shihyuho/pangu.skill/dev/pangu?label=pangu&color=df372b" alt="pangu"></a>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <b>한국어</b>
</p>

AI 코딩 에이전트에 paranoid text spacing (盤古之白)을 더해 주는 agent skill / plugin입니다. Claude Code, Codex, Cursor, Gemini CLI를 비롯한 여러 AI 에이전트가 당신에게 보내는 답변, 문서, 주석, 커밋 메시지 등 어떤 글을 만들어 내든 CJK 문자와 인접한 반각 영문자, 숫자, 기호 사이에 자동으로 공백을 넣어 줍니다.

AI는 글은 잘 쓰지만, CJK와 라틴 문자 사이를 띄우는 것은 자꾸 잊어버립니다. 이 skill은 무엇을 띄우고 무엇을 그대로 둘지, 그 규칙을 AI에게 직접 가르쳐 줍니다. 덕분에 AI는 나중에 고치는 대신 입력하는 바로 그 순간에 제대로 씁니다.

> **참고**: pangu는 한자(漢字)를 CJK 문자로 취급해 라틴 문자와의 경계에 공백을 넣지만, **한글에는 적용되지 않습니다**. 그래서 순수 한글 텍스트에는 거의 영향이 없고, 한자나 중국어, 일본어가 영문이나 숫자와 섞일 때 효과가 나타납니다.

## See it in action

**You type**

> 我用Claude Code寫了3個component，修好login的bug

**pangu writes**

> 我用 Claude Code 寫了 3 個 component，修好 login 的 bug

더 많은 예시는 [라이브 데모](https://shihyuho.github.io/pangu.skill/)에서 확인하세요.

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

Gemini CLI, Antigravity, Cursor, Windsurf, GitHub Copilot, Kiro, OpenCode를 쓰시나요? [전체 설치 가이드](docs/install.md)에서 모두 다룹니다.

## Related Projects

paranoid text spacing은 여러 언어로 이식되어 하나의 프로젝트 가족을 이루고 있습니다.

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
