# AGENTS.md

This repo packages paranoid text spacing (盤古之白) as an agent skill, so the
skill's rules must stay faithful to pangu.js, and its own docs must not drift.

## The skill must match pangu.js

`skills/pangu/SKILL.md` documents the spacing rules as `before → after`
examples, pinned to pangu's real behavior: `npm run check` asserts every
example — and a generated behavior snapshot — against the pinned `pangu`
devDependency (the scripts under `scripts/` document their own mechanics).

- Run `npm run check` after editing any example or rule in SKILL.md.
- CI runs it on every push / PR; Dependabot bumps `pangu`, so an upstream
  behavior change surfaces as a failing check you then reconcile in SKILL.md.
- Never hand-edit an example to a value pangu would not produce — fix the rule
  or the example until the check passes. The check, not your eyeballs, is the
  source of truth for what pangu does.

## Upgrading pangu

Handling a `pangu` bump PR (Dependabot; the check opens red on every bump)?
That first red is mechanical until the version stamps are fixed — follow
[docs/upgrading-pangu.md](docs/upgrading-pangu.md).

## Writing CJK-mixed prose here

This is a spacing project; its own prose must model the rules. When editing
CJK-mixed text (README*.md, SKILL.md wording, commit messages):

- Put one half-width space between a CJK character and an adjacent half-width
  letter / digit / symbol, per skills/pangu/SKILL.md.
- Use full-width punctuation in Chinese / Japanese prose（，。：；（）「」、）,
  not half-width.

## Keep every surface in sync

The same content lives in several places. When you change install steps, the
rules, the family list, the brand mark, or any user-facing wording, update ALL
of them together — a change that lands in one place but not the others is drift:

- the four READMEs — `README.md` (English, source of truth), `README.zh-TW.md`,
  `README.ja.md`, `README.ko.md`
- the landing page — `site/index.html` (hero, How it works, Install, Family)
- the full install guide — `docs/install.md` (English). The four READMEs keep only
  the Claude Code and Codex quick-starts inline and link here for every other agent,
  so install commands must match `docs/install.md` and `site/index.html`.
- the plugin logo — `.codex-plugin/plugin.json`'s `interface.logo` points at
  `assets/image.png`, a raster of `site/favicon.svg` (the site's brand mark).
  After changing that mark, regenerate the PNG so it doesn't drift:
  `rsvg-convert -w 1024 -h 1024 site/favicon.svg -o assets/image.png`.
