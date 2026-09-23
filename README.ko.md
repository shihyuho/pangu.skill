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
  <a href="https://github.com/vinta/pangu.js/blob/master/CHANGELOG.md"><img src="https://img.shields.io/github/package-json/dependency-version/shihyuho/pangu.skill/dev/pangu?label=pangu&color=df372b" alt="pangu"></a>
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <b>한국어</b>
</p>

Claude Code, Codex, Antigravity, Cursor, Gemini CLI 등 AI 코딩 에이전트를 위한 skill / plugin입니다. 에이전트가 CJK 혼합 답변, 문서, 주석, 커밋 메시지를 작성할 때 paranoid text spacing (盤古之白)을 자동으로 적용합니다.

이번 작업에서 새로 쓰거나 수정하는 자연어만 정리하고 코드, 마크업, URL, 경로, 정확한 인용문은 보존합니다. 사용자가 지정한 형식과 편집 범위를 우선하며 범위 밖의 기존 텍스트는 그대로 둡니다.

문자 규칙은 pangu.js를 따르며 한자, 일본어 가나, 주음을 대상으로 합니다. **한글은 변경하지 않습니다**. `é`, `β`, `Ⅻ`, `✓`, `℃` 등 특정 Unicode 범위의 문자가 CJK와 맞닿을 때도 공백을 넣습니다. 슬래시로 이어진 텍스트는 그대로 두고 `²`, `™` 같은 위 첨자 접미사는 앞의 텍스트에 붙여 둡니다. 실행에 필요한 모든 규칙은 하나의 `SKILL.md`에 들어 있습니다.

## See it in action

**You type**

> 我用Claude Code寫了3個component，修好login的bug

**적용 후**

> 我用 Claude Code 寫了 3 個 component，修好 login 的 bug

[라이브 데모](https://shihyuho.github.io/pangu.skill/)는 pangu.js의 일반 텍스트 처리 결과를 보여 줍니다. 에이전트는 자연어의 범위를 판단하고, 데모는 라이브러리를 직접 적용합니다.

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

Gemini CLI, Cursor, Windsurf, GitHub Copilot, Kiro, OpenCode를 쓰시나요? [전체 설치 가이드](docs/install.md)에서 모두 다룹니다.

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
