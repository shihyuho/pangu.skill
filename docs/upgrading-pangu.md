# Upgrading pangu

A Dependabot `pangu` bump initially fails the version-stamp check: Dependabot
updates `package.json` and the lockfile, while SKILL.md and the demo still name
the old version. This is an intentional review gate, including on patch bumps.
Repairing the stamps starts the behavior review; it does not complete it.

## What the checks cover

`npm run check` runs the script tests and canonical-name checks, then verifies:

- every SKILL.md `before → after` example against the installed pangu;
- the version in SKILL.md's verification footer (`pangu **X.Y.Z**`) and the
  demo's CDN pin in `site/index.html` against the pinned dependency;
- text behavior against `scripts/pangu-snapshot.jsonl`: printable ASCII across
  adjacency contexts, plus curated multi-character patterns in
  `scripts/check-snapshot.mjs`;
- the authored prose fixtures in `evals/evals.json`, including protected text
  and cases that declare pangu as their plain-text oracle.

A green result covers those examples and probes. It does not prove that all
upstream behavior is unchanged, that rule prose is accurate, or that a model
follows the skill. DOM, CLI, and browser packaging also need separate review
when the changelog identifies changes relevant to this repo.

## The flow

1. Install the bumped lockfile with `npm ci`. Run `npm run check` before
   repairing anything and inspect the reported failures. Stale version stamps
   are expected; record any example, snapshot, or fixture failures too. The
   command stops at the first failing checker, so rerun after resolving it.
2. Read every intervening release entry at the target version's upstream tag.
   Current tags use `CHANGELOG.md`; older tags may use `HISTORY.md`. Use the
   file from that tag rather than the default branch. Identify text-rule
   changes, new pattern classes, and relevant non-text changes regardless of
   the semver level or current check result.
3. Run `npm run fix-stamps`, then `npm run check` again. The stamp command
   updates only SKILL.md's footer and the demo CDN pin; it does not accept
   behavior changes or rewrite the snapshot.
4. Reconcile each text change with SKILL.md's wording **and** examples. Add
   probes to `CURATED` when the changelog names a context the generated corpus
   does not exercise. Inspect the installed version's outputs before accepting
   them. For example, [9.1.1's changelog](https://github.com/vinta/pangu.js/blob/v9.1.1/CHANGELOG.md)
   changed closing-bracket/operator/CJK and CJK/hyphen/digit sequences; the
   original 882 probes stayed green, so this repo added those contexts.
5. Once the rules and probe outputs have been reviewed, run
   `npm run update-snapshot` if needed. Inspect the entire snapshot diff and
   rerun `npm run check`. Keep unrelated probes intact. Have a reviewer read
   the rule prose: the script verifies the examples, not the explanation an
   agent will follow. Synchronize README and site wording if it is affected.
6. Leave a reviewable record in the PR: old/new versions, the version-tagged
   changelog, each relevant change and its disposition, the reconciled rules
   and probes, and the final check result. Record relevant demo/CLI checks
   separately. State whether model trials were run; fixture validation alone
   is not model evidence. See [Prose evaluation](prose-evaluation.md) for the
   scope fixtures and the Astra medium/high comparison protocol.

Do not change an example to an output pangu does not produce, regenerate a
snapshot simply to clear CI, or remove the stamp check to make bump PRs open
green. If the library's new behavior conflicts with the intended prose
contract, explain the conflict and resolve the upgrade decision first.

## Dependabot-branch hygiene

A stamp-only fix, including the SKILL.md footer, may be pushed directly onto
the Dependabot branch. Changes to rule prose, examples, probes, or fixtures
belong on your own branch and PR based on the bump. Link both PRs. When behavior
needs reconciliation, land the bumped dependency and reviewed rule/probe
changes together; the owned PR can carry both. Dependabot can supersede or
recreate its branch, so keep substantive manual work on the owned branch.
Avoid requesting `@dependabot recreate` on a PR carrying manual work.

The READMEs' version badge reads `package.json` live and needs no manual bump.
