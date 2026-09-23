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

Insert one half-width space where CJK directly meets ASCII letters or digits,
or a character in the extended ranges below. Use the symbol rules below for
punctuation and operators. CJK includes Han
ideographs, Japanese kana, and bopomofo, including Han used in Korean.
Hangul is outside this definition: `한국어test` stays unchanged.
Full-width punctuation (`，。！？「」`) needs no surrounding space.
For spacing, leave runs without CJK and already-correct whitespace unchanged.

```
當你凝視著bug，bug也凝視著你 → 當你凝視著 bug，bug 也凝視著你
與PM戰鬥的人 → 與 PM 戰鬥的人
這是2025年的事 → 這是 2025 年的事
```

### Extended characters

Apply CJK-boundary spacing to these exact Unicode code-point ranges, except
for the attached suffixes below:

- Latin-1 Supplement after NBSP: U+00A1–U+00FF.
- Greek and Coptic: U+0370–U+03FF.
- Letterlike Symbols: U+2100–U+214F.
- Number Forms: U+2150–U+218F.
- Dingbats: U+2700–U+27BF.

Space only direct CJK contact, keeping adjacent non-CJK characters together
(such as `±5`). The suffixes `® ⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁱ ⁿ ⁺ ⁻ ⁼ ⁾ ℠ ™`
stay attached to preceding text; insert a space when CJK follows them. The
opening superscript parenthesis `⁽` is outside that set. On text containing
CJK, also separate `©` from a following digit.

Other non-ASCII characters keep their existing spacing unless
another text rule applies: `★` is outside these ranges. The middle-dot rule below
still handles `·`. Preserve combining marks and variation selectors as written;
a mark between an eligible character and CJK interrupts that direct boundary.

```
狀態✓完成 → 狀態 ✓ 完成
版本β測試 → 版本 β 測試
溫度±5度 → 溫度 ±5 度
章節Ⅻ內容 → 章節 Ⅻ 內容
符號★測試 → 符號★測試
結果é完成 → 結果 é 完成
溫度℃變化 → 溫度 ℃ 變化
編號№123項 → 編號 №123 項
符號⅏測試 → 符號 ⅏ 測試
面積m²大小 → 面積 m² 大小
中文⁺註記 → 中文⁺ 註記
商標™產品 → 商標™ 產品
品牌®商品 → 品牌® 商品
©2026版權 → © 2026 版權
```

### Operators and separators

- `- * = ^ < > \`: space CJK boundaries, keeping half-width words whole.
  Before CJK, also separate `- * = &` from a preceding `) ] }`. A hyphen
  directly between CJK and digits is a separator; an already-spaced negative
  number stays attached to its sign.
- `_`: keep attached in every context.
- `|`: if one pipe touches CJK, space every pipe on that line; otherwise
  preserve half-width `A|B`.
- `/`: keep joined text such as `中文/English` and `A/B` intact, preserving
  existing spaces. Recognized file paths still get spaces at their outer
  CJK boundaries, as shown under Whole tokens.
- `&`: keep half-width joiners (`R&D`) whole; space CJK boundaries.
- `+`: keep signs and suffixes attached in `+886`, `100+`, and `A+`,
  spacing their outer CJK boundaries first. A plus still touching CJK then
  makes the remaining tight single pluses on that line separators, including
  those between half-width words. Doubled pluses (`C++`) and name suffixes
  such as `Disney+`, `Apple TV+`, `mo 店+`, `公視+`, `AA+`, and `AB+` stay
  attached but still activate the line's other separators. Preserve `A+B` when no plus
  touches CJK. Existing space-adjacent pluses keep their spacing except at a
  direct CJK boundary. Common full-width punctuation
  stays tight on its side of a plus; after `) ] }` and before `（「『【《`,
  insert a space only before the plus.

```
前面+後面 → 前面 + 後面
Switch+健身環 → Switch + 健身環
前+A+B → 前 + A + B
前 A+B 後 → 前 A+B 後
前+A+「方案」 → 前 + A+「方案」
(中文)+「方案」 → (中文) +「方案」
有100+的選擇 → 有 100+ 的選擇
Disney+的節目 → Disney+ 的節目
Disney+的節目 A+B → Disney+ 的節目 A + B
mo店+免運無限次 → mo 店+ 免運無限次
mo 店+ 免運無限次 → mo 店+ 免運無限次
C++的程式 A+B → C++ 的程式 A + B
A+的等級 A+B → A+ 的等級 A+B
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
前面/後面 → 前面/後面
前面 / 後面 → 前面 / 後面
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
An uninterrupted `http://` or `https://` URL includes CJK at its right edge;
keep that entire URL intact and space CJK before its scheme. An explicit
space or full-width punctuation separates following prose from the URL.

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
請看https://example.com/path頁面 → 請看 https://example.com/path頁面
請看https://example.com/path 頁面 → 請看 https://example.com/path 頁面
參考https://example.com/中文API?q=中文#用法，謝謝 → 參考 https://example.com/中文API?q=中文#用法，謝謝
```

_Text-rule examples verified against pangu **10.2.0**; prose scope requires the
judgment described above._
