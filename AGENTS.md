# AGENTS.md

This repo packages paranoid text spacing (盤古之白) as an agent skill, so the
skill's rules must stay faithful to pangu.js, and its own docs must not drift.

## The skill must match pangu.js

`skills/pangu/SKILL.md` documents the spacing rules as `before → after`
examples. Those examples are pinned to pangu's real behavior: `npm run check`
(`scripts/check-skill.mjs`) extracts every example — from the fenced blocks and
the tables — and asserts `pangu.spacingText(before) === after` against the
pinned `pangu` devDependency, then verifies pangu's wider text-level behavior
against a generated probe snapshot (`scripts/check-snapshot.mjs`).

- Run `npm run check` after editing any example or rule in SKILL.md.
- CI runs it on every push / PR; Dependabot bumps `pangu`, so an upstream
  behavior change surfaces as a failing check you then reconcile in SKILL.md.
- Never hand-edit an example to a value pangu would not produce — fix the rule
  or the example until the check passes. The check, not your eyeballs, is the
  source of truth for what pangu does.

## Upgrading pangu

Three guards pin this repo to the exact pangu it verifies, all run by `npm run
check`:

- every SKILL.md `before → after` example matches the pinned pangu;
- the version stamps match it — the stamp under SKILL.md's Quick reference
  (`pangu **X.Y.Z**`) and the site's live-demo CDN pin in `site/index.html`;
- pangu's text-level behavior matches `scripts/pangu-snapshot.jsonl` — ~900
  generated probes (every printable ASCII character across the adjacency
  contexts that decide spacing, plus curated multi-char patterns), so a
  behavior change reds even where no curated example covers it.

A Dependabot bump PR only edits `package.json` and the lockfile, so it opens
red at the stamps on every bump — even a behavior-free patch. The flow:

1. `npm run fix-stamps` — rewrites both stamps to the pinned version.
2. `npm run check` — now the result is the real signal:
   - **green** means behavior-identical across examples and snapshot — safe to
     merge at any semver level (pangu ships behavior changes outside majors —
     6.1.0 revised the spacing algorithm — so trust the snapshot, not semver).
   - **snapshot red** means pangu's behavior changed: reconcile SKILL.md — rule
     wording AND examples for the changed characters (the check prints which
     ones lack examples) — then `npm run update-snapshot` and rerun until
     green. Never run `update-snapshot` to silence a red you haven't
     reconciled into SKILL.md; and rule-prose diffs must pass human eyes,
     because the check verifies examples, not prose, and agents build their
     mental model from the prose.
3. Skim the changelog for *added* rules the probes may not reach — pangu
   publishes no GitHub Releases; the changelog is
   [HISTORY.md](https://github.com/vinta/pangu.js/blob/master/HISTORY.md).
   DOM-only changes never show in the snapshot. On a red or major bump, post
   the bumped versions' HISTORY.md entries as a PR comment, each with a
   one-line takeaway — the skim leaves a visible artifact a reviewer can
   check happened.

Dependabot-branch hygiene: a stamp-only fix may be pushed straight onto the
Dependabot branch; anything touching SKILL.md belongs on your own branch / PR —
Dependabot supersedes or recreates its branches and discards foreign commits
(never comment `@dependabot recreate` on a PR carrying manual work). The
READMEs' version badge reads `package.json` live and never needs a bump.

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
