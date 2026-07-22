---
name: pangu
description: >-
  Apply paranoid text spacing (盤古之白) to the text you write — put a single
  space wherever a CJK (Chinese / Japanese / Korean) character meets a half-width
  letter, digit, or symbol, so your mixed-language output reads cleanly. Do this
  in everything you write or edit (chat replies, docs, README, code comments,
  commit messages), even when the user does not ask; and do it when the user asks
  to add spacing or mentions pangu, 盤古之白, or 加空格. Leave code, URLs, file
  paths, version strings, and compound identifiers unsplit.
---

# Paranoid Text Spacing (盤古之白)

Text that jams CJK characters against half-width letters, numbers, or symbols
reads cramped. A single space at each boundary lets it breathe. Make this part
of how you write — every reply, document, comment, and commit message — so your
mixed-language output is always readable.

> 漢學家稱這個空白字元為「盤古之白」，因為它劈開了全形字和半形字之間的混沌。

## How to apply

1. Scan what you write for each boundary where a **CJK** character meets a
   **half-width** letter / digit / symbol (either order).
2. Insert exactly **one** half-width space there — unless a rule below keeps the
   token whole (paths, versions, compound words…) or the gate says leave it.
3. Leave markup and code alone — you know prose from syntax; that is your edge.

## The one core rule

> Put a single half-width space between a CJK character and an adjacent
> half-width alphabet / number / symbol.

```
當你凝視著bug，bug也凝視著你   →   當你凝視著 bug，bug 也凝視著你
與PM戰鬥的人                    →   與 PM 戰鬥的人
這是2025年的事                  →   這是 2025 年的事
```

CJK = Chinese characters, Japanese kana, and bopomofo, plus the Han ideographs
used in Korean — but **not** Korean Hangul 諺文 (`한국어test` stays `한국어test`,
since pangu does not treat 한글 as CJK). Half-width =
`A-Za-z`, `0-9`, ASCII symbols. **Full-width** CJK punctuation (`，。！？「」`)
needs **no** surrounding space — note `…著 bug，bug 也…` has no space around `，`.

## When NOT to add a space

- **No CJK in the run of text** → leave it 100% unchanged: `Vinta/Mollie`,
  `Vinta+Mollie`, `state-of-the-art`, `\n`, `25%OFF` stay as-is. Spacing happens
  only where CJK actually meets a half-width character — so pure code or English
  is never mangled.
- **Already correctly spaced** → never add a second space, never reflow.
- Use a **single half-width space**, never a full-width one.

## Symbol rules

### Operators — always spaced (when CJK is in the line)

`+  -  *  =  ^  <  >  \` take a space on **both** sides. (`/` and `&` are
special — they glue two half-width characters; see below.)

```
前面+後面        →   前面 + 後面
得到一個A-B的結果 →   得到一個 A - B 的結果
前面\後面        →   前面 \ 後面
前面~=後面       →   前面 ~= 後面
```

### Separators — never spaced

`_` and `|` are always separators — never add spaces, in any context.

```
前面|後面        →   前面|後面
Mollie_陳上進     →   Mollie_陳上進
```

### Slash & ampersand — a joiner between half-width, an operator next to CJK

A single `/` or `&` **glues** two half-width characters into one token (`A/B`,
`R&D`) — no space inside; the whole token then spaces off any adjacent CJK. It
only reads as a spaced operator when a **CJK** character sits on at least one
side. Two or more slashes are a path and keep their structure.

```
得到一個A/B的結果     →   得到一個 A/B 的結果      (half-width both sides: glued)
前面/後面            →   前面 / 後面             (CJK on a side: operator)
陳上進/貓咪/Mollie   →   陳上進/貓咪/Mollie       (2+ slashes: a path, untouched)
得到一個R&D的部門     →   得到一個 R&D 的部門      (`&` glues half-width the same way)
陳上進&Mollie        →   陳上進 & Mollie          (CJK on a side: operator too)
```

### Punctuation — right space, kept half-width (one colon exception)

`. , : ; ! ? ~` take a space **after** them when the next character is a CJK,
letter, or digit — but, as everywhere, only when the line has CJK somewhere; a
run with no CJK is never touched (`really?yes` stays `really?yes`). No left
space, not at the end of the text, and not inside file extensions or version
numbers.

These marks stay half-width, with **one exception**: a half-width `:` pressed
directly against a bracket is the single spot pangu makes full-width —
`記住:(東西)` → `記住：(東西)`.

```
前面,後面     →   前面, 後面
電話:123456789 →   電話: 123456789
前面?後面     →   前面? 後面
前面…後面     →   前面… 後面        (ellipsis keeps its dots, space after)
```

### `@` `#` `$` `%` — the attached token stays one unit

```
請@vinta吃大便   →   請 @vinta 吃大便     (@username is one unit)
前面#H2G2後面    →   前面 #H2G2 後面      (#tag is one unit)
前面C#後面       →   前面 C# 後面         (C# = one unit, spaced from CJK)
前面$100後面     →   前面 $100 後面       ($100 = one unit)
新八的構造成分有95%是眼鏡 → 新八的構造成分有 95% 是眼鏡   (95% = one unit)
```

### Quotes & brackets — space outside, never just-inside

For `"`  `` ` ``  `'`  `( )`  `[ ]`  `{ }`  `< >`: space between CJK and the
bracket / quote, but **no** space right after an opening or right before a
closing bracket.

```
前面(中文123漢字)後面   →   前面 (中文 123 漢字) 後面
前面"中文123漢字"後面   →   前面 "中文 123 漢字" 後面
我看过的电影(1404)      →   我看过的电影 (1404)
function(123)          →   function(123)        (identifier+(: no space)
陳上進 likes 林依諾's status. → 陳上進 likes 林依諾's status.  (possessive 's attaches)
```

### Middle dot — normalized, not spaced

`·` `•` `‧` between names become a full-width `・` with **no** surrounding space.

```
喬治·R·R·馬丁   →   喬治・R・R・馬丁
```

## Keep these units whole (do **not** split internally)

Space the boundary between CJK and the token, but never insert a space *inside*
the token.

| Kind | Example in | Example out |
|------|-----------|-------------|
| Compound words / product names | `OpenAI的gpt-4o模型` | `OpenAI 的 gpt-4o 模型` |
| Model / version with hyphen | `Anthropic的claude-4-opus模型` | `Anthropic 的 claude-4-opus 模型` |
| Letter+number names | `OpenAI的GPT-5模型` | `OpenAI 的 GPT-5 模型` |
| Hyphen phrases | `state-of-the-art` | `state-of-the-art` |
| Version numbers | `pangu.js v1.2.3橫空出世` | `pangu.js v1.2.3 橫空出世` |
| Programming terms | `這是C++跟C#的差別` | `這是 C++ 跟 C# 的差別` |
| Single-letter grades | `得到一個A+的結果` | `得到一個 A+ 的結果` |
| Unix paths | `檢查src/main.py文件` | `檢查 src/main.py 文件` |
| Unix absolute paths | `在/home目錄` | `在 /home 目錄` |
| Windows paths | `檔案在C:\Users\name\` | `檔案在 C:\Users\name\` |
| URLs | `請看https://example.com/path頁面` | `請看 https://example.com/path 頁面` |
| Escape seq. / pure ASCII | `\n`, `Vinta-Mollie` | unchanged |

Rule of thumb: hyphenated identifiers, file paths, URLs, version strings, and
programming tokens are **units** — push them away from neighbouring CJK, never
split them down the middle.

## Scope — write spacing into prose, not into code or markup

Apply the spacing to the natural-language text you produce — paragraphs, heading
wording, comment text, commit-message bodies, chat replies. Leave the rest exactly
as it is:

- Inside fenced / indented **code blocks** and inline code spans (`` `...` ``).
- **Verbatim command output, logs, or any string you quote for exact matching** —
  leave it byte-for-byte even when it is *not* wrapped in code, because adding a
  space misreports what was actually printed and breaks copy-paste / search.
  Prefer wrapping such quotes in code; if they land in prose, still don't touch
  them.
- Inside **URLs, file paths, email addresses, version strings**, and compound
  identifiers.
- In **structural syntax**. When writing Markdown, space the *wording* but not
  the markers — write `## 標題 Heading`, never `##標題Heading`, and never put a
  space inside the `##` marker. Don't blanket-space a whole Markdown or code
  file; space the prose within it.

This is why the judgment is yours and not a blind find-and-replace: you can tell
the sentence from the syntax around it.

## Quick reference

| Between CJK and… | Space? |
|---|---|
| letter / number | yes |
| operator `+ - * = ^ < > \` | yes (both sides) |
| single `/` or `&` | glued between half-width (`A/B`, `R&D`); spaced only if CJK adjacent |
| separator `_` `\|`, or 2+ `/` (a path) | no |
| `. , : ; ! ? ~` | space **after** (right) only |
| opening / closing bracket or quote | yes outside, no just-inside |
| `@user` `#tag` `$100` `95%` `C++` `GPT-5` `v1.2.3` path / URL | space the boundary, keep the token whole |
| full-width punctuation `，。！？` | no |
| a run of text with no CJK at all | leave entirely unchanged |

---

_Rules verified against pangu **8.0.0**._
