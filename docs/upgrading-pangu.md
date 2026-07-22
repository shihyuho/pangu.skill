# Upgrading pangu

How to handle a Dependabot `pangu` bump PR. The check opens red on every bump —
even a behavior-free patch — because Dependabot only edits `package.json` and
the lockfile, while the version stamps still name the old version. That first
red is mechanical, not a signal.

Three guards pin this repo to the exact pangu it verifies, all run by `npm run
check`:

- every SKILL.md `before → after` example matches the pinned pangu
  (`scripts/check-skill.mjs`);
- the version stamps match it — the stamp under SKILL.md's Quick reference
  (`pangu **X.Y.Z**`) and the site's live-demo CDN pin in `site/index.html`;
- pangu's text-level behavior matches `scripts/pangu-snapshot.jsonl` — ~900
  generated probes (every printable ASCII character across the adjacency
  contexts that decide spacing, plus curated multi-char patterns), so a
  behavior change reds even where no curated example covers it
  (`scripts/check-snapshot.mjs`).

## The flow

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

## Dependabot-branch hygiene

A stamp-only fix may be pushed straight onto the Dependabot branch; anything
touching SKILL.md belongs on your own branch / PR — Dependabot supersedes or
recreates its branches and discards foreign commits (never comment
`@dependabot recreate` on a PR carrying manual work). Merge reconciled bumps
promptly: pangu's pattern is a patch/minor burst right after each major, and a
superseding PR discards the branch.

The READMEs' version badge reads `package.json` live and never needs a bump.
