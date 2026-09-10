---
name: pangu
description: >-
  Quietly apply pangu spacing whenever you write or edit CJK-mixed prose,
  including replies, docs, code comments, and commit messages, even without
  a spacing request. Also use when asked for pangu, 盤古之白, or spacing fixes.
  Preserve code, exact quotes, syntax, and token interiors.
---

# pangu

*Paranoid Text Spacing (盤古之白)*

## Scope first

1. Follow the user's requested format and editing scope. Space the prose you
   create or modify for the task; format an entire document when that is the
   requested task. Keep unrelated text as received.
2. Preserve literal content byte-for-byte: code, inline code, fenced or indented
   code blocks, exact quotations, command output, and logs, even outside code
   spans. Change a literal only when the user's task explicitly calls for it.
3. Apply spacing to natural-language wording, including headings, link labels,
   and code comments. Preserve Markdown markers, link destinations, and other
   structural syntax, plus the interiors of URLs, paths, email addresses,
   versions, and compound identifiers. A Chinese character inside a token is
   still part of that token.
4. Deliver the requested work with spacing already applied.

For example, space a Markdown link's visible label while keeping its URL
exact. When quoting a log for searching, preserve the log and space only your
own explanation. These boundaries take precedence over the text rules below.

## Text rules

Insert one half-width space where CJK meets half-width letters or numbers;
use the symbol rules below for punctuation and operators. CJK includes Han
ideographs, Japanese kana, and bopomofo, including Han used in Korean.
Hangul is outside this definition: `한국어test` stays unchanged.
Full-width punctuation (`，。！？「」`) needs no surrounding space.
For spacing, leave runs without CJK and already-correct whitespace unchanged.

```
當你凝視著bug，bug也凝視著你 → 當你凝視著 bug，bug 也凝視著你
與PM戰鬥的人 → 與 PM 戰鬥的人
這是2025年的事 → 這是 2025 年的事
```

### Operators and separators

- `+ - * = ^ < > \`: space CJK boundaries, keeping half-width words whole.
  Before CJK, also separate `- * = &` from a preceding `) ] }`. A hyphen
  directly between CJK and digits is a separator; an already-spaced negative
  number stays attached to its sign.
- `_`: keep attached in every context.
- `|`: if one pipe touches CJK, space every pipe on that line; otherwise
  preserve half-width `A|B`.
- Single `/` and `&`: keep half-width joiners (`A/B`, `R&D`) whole; space
  them when CJK is adjacent. Two or more slashes keep their path structure.

```
前面+後面 → 前面 + 後面
得到一個A-B的結果 → 得到一個 A-B 的結果
得到一個A*B的結果 → 得到一個 A*B 的結果
比較A<B和A>B的結果 → 比較 A<B 和 A>B 的結果
比較A=B與A^B的結果 → 比較 A=B 與 A^B 的結果
前面\後面 → 前面 \ 後面
前面~=後面 → 前面 ~= 後面
(中文)-下一步 → (中文) - 下一步
[中文]*下一步 → [中文] * 下一步
{中文}=下一步 → {中文} = 下一步
(中文)&下一步 → (中文) & 下一步
中文-123度 → 中文 - 123 度
氣溫 -5°C → 氣溫 -5°C
前_後 → 前_後
Mollie_陳上進 → Mollie_陳上進
前|A|B → 前 | A | B
前 A|B 後 → 前 A|B 後
得到一個A/B的結果 → 得到一個 A/B 的結果
前面/後面 → 前面 / 後面
陳上進/貓咪/Mollie → 陳上進/貓咪/Mollie
得到一個R&D的部門 → 得到一個 R&D 的部門
陳上進&Mollie → 陳上進 & Mollie
```

### Punctuation, quotes, and attached tokens

- On a line containing CJK, `. , : ; ! ? ~` take a space after them when
  followed by CJK, a letter, or a digit. Preserve their half-width form,
  file extensions, and version numbers. The colon touching a bracket in
  `記住:(東西)` is an exception: it becomes full-width.
- `"`, `'`, backticks, and `( ) [ ] { } < >`: space outside against CJK,
  keeping the inside edges tight. Possessive `'s` stays attached.
- Keep `@user`, `#tag`, `C#`, `$100`, and `95%` together.
- Middle dots `· • ‧` between names become `・` with no surrounding spaces.

```
前面,後面 → 前面, 後面
電話:123456789 → 電話: 123456789
前面?後面 → 前面? 後面
前面…後面 → 前面… 後面
記住:(東西) → 記住：(東西)
前面(中文123漢字)後面 → 前面 (中文 123 漢字) 後面
前面"中文123漢字"後面 → 前面 "中文 123 漢字" 後面
我看过的电影(1404) → 我看过的电影 (1404)
function(123) → function(123)
陳上進 likes 林依諾's status. → 陳上進 likes 林依諾's status.
請@vinta吃大便 → 請 @vinta 吃大便
前面#H2G2後面 → 前面 #H2G2 後面
前面C#後面 → 前面 C# 後面
前面$100後面 → 前面 $100 後面
新八的構造成分有95%是眼鏡 → 新八的構造成分有 95% 是眼鏡
喬治·R·R·馬丁 → 喬治・R・R・馬丁
```

### Whole tokens

Space between a token and surrounding prose, preserving its interior.

```
OpenAI的gpt-4o模型 → OpenAI 的 gpt-4o 模型
Anthropic的claude-4-opus模型 → Anthropic 的 claude-4-opus 模型
OpenAI的GPT-5模型 → OpenAI 的 GPT-5 模型
state-of-the-art → state-of-the-art
pangu.js v1.2.3橫空出世 → pangu.js v1.2.3 橫空出世
這是C++跟C#的差別 → 這是 C++ 跟 C# 的差別
得到一個A+的結果 → 得到一個 A+ 的結果
檢查src/main.py文件 → 檢查 src/main.py 文件
在/home目錄 → 在 /home 目錄
檔案在C:\Users\name\ → 檔案在 C:\Users\name\
請看https://example.com/path頁面 → 請看 https://example.com/path 頁面
```

_Text-rule examples verified against pangu **9.1.1**; prose scope requires the
judgment described above._
