---
name: pangu
description: >-
  Quietly apply pangu spacing whenever you write or edit CJK-mixed prose,
  including replies, docs, code comments, and commit messages, even without
  a spacing request. Also use when asked for 盤古之白 or spacing fixes.
---

# pangu

*Paranoid Text Spacing (盤古之白)*

Space CJK-mixed prose exactly as pangu.js `spaceText()` would, keeping every
literal byte-for-byte. Each rule below settles one boundary: a place where a
CJK character meets another kind of character.

## Literals

1. Follow the user's requested format and editing scope. Space the prose you
   write or modify; format a whole document only when that is the task, and
   keep unrelated text as received.
2. Keep literals byte-for-byte unless the task explicitly changes them: code
   and inline code, fenced or indented code blocks, exact quotations, command
   output and logs (even outside code spans), Markdown markers, link
   destinations and other structural syntax, and the interiors of URLs,
   paths, email addresses, versions, and identifiers. A CJK character inside
   a literal belongs to the literal.
3. All other natural language is prose, including headings, link labels, and
   code comments. Apply the boundary rules to it and deliver the work with
   spacing already applied.

So a Markdown link gets a spaced label and an exact URL, and a quoted log
stays as logged while your sentence around it is spaced. Literals take
precedence over every rule below.

## Boundaries

Apply the rules to each line that contains CJK; a line without CJK stays as
written, while on a CJK line some rules also reach half-width text away from
CJK (see Brackets). CJK means Han ideographs (with Extension A, compatibility
ideographs, and Kangxi and supplementary radicals), hiragana, katakana except
`・`, bopomofo, and enclosed CJK such as `㈱`. Hangul is not CJK:
`한국어test` stays unchanged. Full-width punctuation (`，。！？「」`) takes no
space. Existing spaces and NBSPs stay unless a rule below removes them.

### Letters and digits

Put one half-width space where CJK meets an ASCII letter, a digit, or one of
`$ % ^ & * - + \ =`; `@` takes it only after CJK.

```
當你凝視著bug，bug也凝視著你 → 當你凝視著 bug，bug 也凝視著你
前面\後面 → 前面 \ 後面
```

### Extended characters

The same space applies where CJK meets a character in U+00A1–U+00FF
(Latin-1 after NBSP), U+0370–U+03FF (Greek and Coptic), U+2100–U+214F
(Letterlike Symbols), U+2150–U+218F (Number Forms), or U+2700–U+27BF
(Dingbats). Only direct contact counts: a combining mark or variation
selector between such a character and CJK leaves that pair tight, and
adjacent non-CJK characters stay together (`±5`). The suffixes
`® ¹ ² ³ ⁰ ⁱ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁺ ⁻ ⁼ ⁾ ⁿ ℠ ™` attach to the text before them and
take a space only before following CJK; `⁽` is not a suffix. `©` also
separates from a following digit. Other symbols, such as `★`, keep their
spacing.

```
狀態✓完成 → 狀態 ✓ 完成
版本β測試 → 版本 β 測試
溫度±5度 → 溫度 ±5 度
章節Ⅻ內容 → 章節 Ⅻ 內容
編號№123項 → 編號 №123 項
符號★測試 → 符號★測試
面積m²大小 → 面積 m² 大小
商標™產品 → 商標™ 產品
©2026版權 → © 2026 版權
```

### Punctuation

Half-width punctuation stays half-width, with one exception: `:` between CJK
and a parenthesis becomes `：`.

- `! ; , ? :` after CJK take a space when CJK, a letter, or a digit follows.
  `! ; , ?` before CJK take one after any character, and so do `:` and `.`
  after a letter or digit.
- `.` after CJK takes a space before CJK, but stays tight before a letter or
  digit, which reads as a file extension. A run of dots or `…` before CJK
  takes a space.
- `~` after CJK takes a space when CJK, a letter, or a digit follows; `~=`
  after CJK is spaced on both sides.
- A lone middle dot `·`, `•`, or `‧` with no space, NBSP, or other middle dot
  beside it becomes `・`. Spaced dots and runs of dots stay, and `·`, being
  Latin-1, still takes a space where it touches CJK.

```
Hello,世界 → Hello, 世界
電話:123456789 → 電話: 123456789
Note:這是說明 → Note: 這是說明
結束.下一句 → 結束. 下一句
結束於Inc.之後 → 結束於 Inc. 之後
前面…後面 → 前面… 後面
前面~後面 → 前面~ 後面
前面~=後面 → 前面 ~= 後面
記住:(東西) → 記住：(東西)
喬治·R·R·馬丁 → 喬治・R・R・馬丁
卡號····1234 → 卡號 ····1234
卡號••••1234 → 卡號••••1234
```

### Quotes

- `"`, `״`, and backticks take a space outside against CJK and stay tight
  inside; text inside backticks is never respaced. A `"` between CJK and a
  letter or digit closes a phrase, so the space goes after it.
- `'` takes a space outside against CJK, except possessive `'s`, which
  attaches to the word before it (a space there is removed), and quotes
  around pure CJK (`'中文'`), which stay tight.
- Curly `“…”` around letters, digits, CJK, `-`, `_`, and spaces get exactly
  one space outside against a letter, digit, or CJK, and `”` takes a space
  before a letter or digit. A pair typed as `”…”` is read the same way.

```
前面"中文"English → 前面 "中文" English
前面`code`後面 → 前面 `code` 後面
日本語の'quote'テスト → 日本語の 'quote' テスト
前面'中文'後面 → 前面'中文'後面
陳上進 likes 林依諾 's status. → 陳上進 likes 林依諾's status.
English“中文”後面 → English “中文” 後面
“中文”English → “中文” English
“中文”   後面 → “中文” 後面
前”中文”後 → 前 ”中文” 後
```

### Brackets

- `( [ { < > “` after CJK and `) ] } < > ”` before CJK take a space outside.
  Spaces just inside a `()`, `[]`, `{}`, or `<>` pair are removed, even when
  `<` and `>` were meant as comparisons.
- On a CJK line, a letter or digit before `( [ {` takes a space, except a
  dotted call such as `Math.floor(x)`, and `) ] }` before a letter or digit
  takes one.

```
前面( 中文 )後面 → 前面 (中文) 後面
見(附錄)A節 → 見 (附錄) A 節
呼叫foo(x)與Math.floor(x)函式 → 呼叫 foo (x) 與 Math.floor(x) 函式
中文 and foo(x) → 中文 and foo (x)
function(123) → function(123)
數量<5個，5>其他 → 數量 <5 個，5> 其他
```

### Operators

- `- * = &` between CJK and a letter, digit, or bracket are spaced on both
  sides, so `中文-123度` reads as a separator, not a negative number; an
  already-spaced `-5` stays attached. Between two half-width characters
  they join one token (`A-B`, `R&D`) and stay tight. `*[` after CJK opens a
  glob and stays tight.
- `-` after CJK before a single lowercase letter is a flag: `-m` stays
  attached.
- `<` and `>` between CJK and a letter or digit are spaced as comparisons.
- On a line where a hyphen touches CJK, a hyphen directly between `) ] }`
  and `( [ {` is also spaced.
- On a line where a `|` touches CJK, every pipe on the line is spaced;
  elsewhere `A|B` stays tight.
- `_` stays attached; `/` keeps `中文/English` and `A/B` joined.

```
得到一個A-B的結果 → 得到一個 A-B 的結果
陳上進&Mollie → 陳上進 & Mollie
中文-123度 → 中文 - 123 度
氣溫 -5°C → 氣溫 -5°C
加上-m參數 → 加上 -m 參數
(中文)-下一步 → (中文) - 下一步
中文=(東西) → 中文 = (東西)
刪除*[0-9].log檔 → 刪除 *[0-9].log 檔
比較A<B和A>B的結果 → 比較 A<B 和 A>B 的結果
數量<5個 → 數量 < 5 個
5>其他 → 5 > 其他
大於>A而A<小於 → 大於 > A 而 A < 小於
中文-中文[A]-(中文) → 中文 - 中文 [A] - (中文)
中文[A]-(中文) → 中文 [A]-(中文)
前|A|B → 前 | A | B
前 A|B 後 → 前 A|B 後
Mollie_陳上進 → Mollie_陳上進
陳上進/貓咪/Mollie → 陳上進/貓咪/Mollie
```

### Plus

Read each `+` in this order:

1. **Attached.** At a CJK boundary, a single letter keeps a following
   `+ - *` (`A+`), `+` before digits is a sign (`+886`), and a standalone
   number keeps a following `+` (`100+`, but not `S24+`). Each takes its outer
   CJK space and then no longer touches CJK.
2. **Names.** These keep `+` attached and still touch CJK: `Apple TV`,
   `CATCHPLAY`, `Discovery`, `discovery`, `Disney`, `ESPN`, `Fitness`,
   `iCloud`, `mo店`, `mo 店`, `Paramount`, `PS`, `Pro`, `公視`, and `影劇館`.
   Credit ratings `AA`, `BB`, `BBB`, `CCC` (also prefixed `tw`), `twA`, and
   `twB`, and blood types `AB`, `Rh`, and `RhD` keep `+` or `-`. A closing
   mark (`/ ) ] }` or `）】〕〉》」』，。、；：！？`) after a name stays tight.
3. **Line.** If any `+` still touches CJK, every tight single `+` on that
   line, that one included, becomes a separator: one space goes on each side
   of the `+` itself, even between half-width words, while the text beyond
   those two spaces keeps its spacing. Without such contact `A+B` stays tight. A `+` beside a
   space or in `++` (`C++`) keeps its spacing, and full-width punctuation
   stays tight on its side of a `+`.

A `+` between `) ] }` and `（「『【《` always takes a space before it only.

```
比較Switch+健身環與其他方案 → 比較 Switch + 健身環與其他方案
前+A+B → 前 + A + B
前 A+B 後 → 前 A+B 後
A+的等級 A+B → A+ 的等級 A+B
有100+的選擇 → 有 100+ 的選擇
打+886這個號碼 → 打 +886 這個號碼
Disney+的節目 A+B → Disney+ 的節目 A + B
看Disney+/Apple TV+的節目 → 看 Disney+/Apple TV+ 的節目
mo店+免運無限次 → mo 店+ 免運無限次
C++的程式 A+B → C++ 的程式 A + B
前+A+「方案」 → 前 + A+「方案」
(中文)+「方案」 → (中文) +「方案」
```

### Whole tokens

Space between a token and the prose around it, keeping its interior.

- Hyphenated names stay whole when a part has a lowercase letter or letters
  meet digits (`state-of-the-art`, `gpt-4o`, `GPT-5`); an all-caps pair such
  as `ABC-DEF` follows the operator rules.
- `@user`, `#tag`, `C#`, `$100`, and `95%` stay together, while `%` before a
  letter takes a space. A CJK run between two `#` is one tag, and `/#`
  stays tight.
- A path is spaced from CJK before it, and a trailing `/` takes a space
  before CJK. Paths are Windows paths such as `C:\Users\`, `/` followed by a
  dotfile name or one of the directory names below, or one of those names
  (optionally after `./`) followed by `/` segments of letters, digits, and
  `_ - . @ + *`: `home root usr etc var opt tmp dev mnt proc sys bin boot lib
  media run sbin srv node_modules path project src dist test tests docs
  templates assets public static config scripts tools build out target your
  .claude .git .vscode`.
- An `http://` or `https://` URL not preceded by a letter or digit runs until
  whitespace, `< > "`, a backtick, a curly quote, `…`, or full-width or CJK
  punctuation, so CJK at its right edge stays inside it. Trailing
  `. , ; : ! ? ' "` and an unbalanced `)` belong to the prose. CJK before the
  scheme takes a space.
- HTML tags take no space around them and keep their names and attribute
  names; double-quoted attribute values are spaced as prose, with URLs left
  exact. An unpaired tag mentioned in prose (`<div>`) is spaced from CJK it
  touches, unless it is a void element: `area base br col embed hr img input
  link meta param source track wbr`.

```
OpenAI的gpt-4o模型 → OpenAI 的 gpt-4o 模型
pangu.js v1.2.3橫空出世 → pangu.js v1.2.3 橫空出世
這是C++跟C#的差別 → 這是 C++ 跟 C# 的差別
請@vinta吃大便 → 請 @vinta 吃大便
前面#H2G2後面 → 前面 #H2G2 後面
前面#話題#後面 → 前面 #話題# 後面
打95%off的折扣 → 打 95% off 的折扣
目錄/usr/bin/包含執行檔 → 目錄 /usr/bin/ 包含執行檔
放在src/utils/目錄 → 放在 src/utils/ 目錄
檔案在C:\Users\name\ → 檔案在 C:\Users\name\
請看https://example.com/path. → 請看 https://example.com/path.
參考https://example.com/中文API?q=中文#用法，謝謝 → 參考 https://example.com/中文API?q=中文#用法，謝謝
<a title="中文API">連結</a> → <a title="中文 API">連結</a>
前<div>後 → 前 <div> 後
前<br>後 → 前<br>後
```

_Rules mapped to and examples verified against pangu **10.4.1**._
