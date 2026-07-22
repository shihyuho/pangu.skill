# pangu.skill

[English](README.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

> AI는 왜 그냥 공백 하나를 못 넣을까?

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Live demo](https://img.shields.io/badge/live_demo-df372b)](https://shihyuho.github.io/pangu.skill/) [![pangu](https://img.shields.io/github/package-json/dependency-version/shihyuho/pangu.skill/dev/pangu?label=pangu&color=df372b)](https://github.com/vinta/pangu.js/blob/master/HISTORY.md)

AI 코딩 에이전트에 paranoid text spacing (盤古之白)을 더해 주는 agent skill / plugin입니다. Claude Code, Codex, Cursor, Gemini CLI를 비롯한 여러 AI 에이전트가 당신에게 보내는 답변, 문서, 주석, 커밋 메시지 등 어떤 글을 만들어 내든 CJK 문자와 인접한 반각 영문자, 숫자, 기호 사이에 자동으로 공백을 넣어 줍니다.

AI는 글은 잘 쓰지만, CJK와 라틴 문자 사이를 띄우는 것은 자꾸 잊어버립니다. 이 skill은 무엇을 띄우고 무엇을 그대로 둘지, 그 규칙을 AI에게 직접 가르쳐 줍니다. 덕분에 AI는 나중에 고치는 대신 입력하는 바로 그 순간에 제대로 씁니다.

> **참고**: pangu는 한자(漢字)를 CJK 문자로 취급해 라틴 문자와의 경계에 공백을 넣지만, **한글에는 적용되지 않습니다**. 그래서 순수 한글 텍스트에는 거의 영향이 없고, 한자나 중국어, 일본어가 영문이나 숫자와 섞일 때 효과가 나타납니다.

## Installation

방법은 두 가지입니다. 패키지 관리자가 있는 에이전트는 한 번에 설치하고, 나머지는 [`skills/pangu/SKILL.md`](skills/pangu/SKILL.md)를 에이전트가 읽는 규칙 디렉터리에 복사하기만 하면 됩니다.

### 패키지 관리자(한 번에 설치)

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

설치한 뒤 `/skills list`로 `pangu`가 준비되었는지 확인하세요.

#### Antigravity

```bash
agy plugin install https://github.com/shihyuho/pangu.skill.git
```

#### skills (npx)

[skills](https://github.com/vercel-labs/skills)로 단독 설치할 수도 있습니다:

```bash
npx skills add shihyuho/pangu.skill --skill pangu
```

### 기타 에이전트(규칙 파일 복사)

Cursor, Windsurf, GitHub Copilot, Kiro, OpenCode에는 플러그인 설치 도구가 없습니다. `skills/pangu/SKILL.md`를 각 에이전트가 읽는 위치에 두면 됩니다. 전체 repo를 clone할 필요 없이 raw 파일을 바로 받으세요:

| Agent | 여기에 둡니다 |
| --- | --- |
| Cursor | `.cursor/rules/pangu.md` |
| Windsurf | `.windsurfrules`에 추가 |
| GitHub Copilot | `.github/skills/pangu/SKILL.md` |
| Kiro | `.kiro/skills/pangu/SKILL.md` |
| OpenCode | `skills/pangu/SKILL.md`로 복사한 뒤, `AGENTS.md`에서 내장 `skill` 도구로 이를 불러와 따르도록 에이전트에 지시 |

예를 들어 Cursor라면:

```bash
mkdir -p .cursor/rules
curl -sL https://raw.githubusercontent.com/shihyuho/pangu.skill/main/skills/pangu/SKILL.md \
  -o .cursor/rules/pangu.md
```

다른 플랫폼은 대상 경로만 바꾸면 됩니다(Windsurf는 `>> .windsurfrules`로 추가).

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
