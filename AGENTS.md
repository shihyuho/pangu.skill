# AGENTS.md

This repo packages paranoid text spacing (盤古之白) as an agent skill, so the
skill's rules must stay faithful to pangu.js, and its own docs must not drift.

## The skill must match pangu.js

`skills/pangu/SKILL.md` documents the spacing rules as `before → after`
examples. Those examples are pinned to pangu's real behavior: `npm run check`
(`scripts/check-skill.mjs`) extracts every example — from the fenced blocks and
the tables — and asserts `pangu.spacingText(before) === after` against the
pinned `pangu` devDependency.

- Run `npm run check` after editing any example or rule in SKILL.md.
- CI runs it on every push / PR; Dependabot bumps `pangu`, so an upstream
  behavior change surfaces as a failing check you then reconcile in SKILL.md.
- Never hand-edit an example to a value pangu would not produce — fix the rule
  or the example until the check passes. The check, not your eyeballs, is the
  source of truth for what pangu does.

## Upgrading pangu

`npm run check` also asserts the pinned `pangu` version against every place that
names it, so a bump can't leave a stale number behind:

- the version stamp under SKILL.md's Quick reference (`pangu **X.Y.Z**`)
- the site's live-demo CDN pin in `site/index.html` (`pangu@X.Y.Z`)

When Dependabot opens a `pangu` bump PR, CI runs the check. Green means the new
pangu is behavior-compatible with what SKILL.md teaches — safe to merge. Red is
the signal to reconcile on that same PR: fix any drifted `before → after`
example and rule wording, bump both version stamps above, then rerun `npm run
check` until green. The READMEs' version badge reads `package.json` live, so it
never needs a manual bump. One caveat the check can't cover: a major pangu bump
may also *add* rules — skim its changelog and document anything new.

## Writing CJK-mixed prose here

This is a spacing project; its own prose must model the rules. When editing
CJK-mixed text (README*.md, SKILL.md wording, commit messages):

- Put one half-width space between a CJK character and an adjacent half-width
  letter / digit / symbol, per skills/pangu/SKILL.md.
- Use full-width punctuation in Chinese / Japanese prose（，。：；（）「」、）,
  not half-width.

## Keep every surface in sync

The same content lives in several places. When you change install steps, the
rules, the family list, or any user-facing wording, update ALL of them together
— a change that lands in one place but not the others is drift:

- the four READMEs — `README.md` (English, source of truth), `README.zh-TW.md`,
  `README.ja.md`, `README.ko.md`
- the landing page — `site/index.html` (hero, How it works, Install, Family)
