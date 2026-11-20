# Upgrading pangu

A Dependabot `pangu` bump leaves stale version stamps: Dependabot updates
`package.json` and the lockfile, while SKILL.md and the demo still name the old
version. This is an intentional review gate, including on patch bumps. Removed
APIs can fail earlier checks before the stamp check is reached.
Repairing the stamps starts the behavior review; it does not complete it.

## What the checks cover

`npm run check` runs every checker, even after one fails, and lists the
failing ones at the end. It runs the script tests and canonical-name checks,
then verifies:

- every SKILL.md `before → after` example against the installed pangu;
- the version in SKILL.md's verification footer (`pangu **X.Y.Z**`) and the
  demo's CDN pin in `site/index.html` against the pinned dependency;
- text behavior against `scripts/pangu-snapshot.jsonl`: printable ASCII across
  adjacency contexts, plus curated multi-character patterns in
  `scripts/check-snapshot.mjs`;
- upstream rule coverage against `scripts/upstream-rules.json`: every
  constant `pangu/shared` exports, and every regex `spaceText()` builds
  inline, is mapped to the SKILL.md section that teaches it or marked
  internal with a reason. Each mapped value and the rule engine are pinned
  by fingerprint, and each taught rule must change text on an example in its
  section and on a snapshot probe;
- the authored prose fixtures in `evals/evals.json`, including protected text
  and cases that declare pangu as their plain-text oracle;
- the demo's initial render and input updates against the pinned browser UMD
  asset, using a minimal DOM shell, plus its labeled CDN-unavailable fallback.

A green result covers those examples and probes, and shows that no upstream
rule went unmapped or changed unreviewed. It does not prove that the rule
prose describes every branch accurately, or that a model follows the skill. DOM, CLI, and browser packaging also need separate review
when the changelog identifies changes relevant to this repo.

## The flow

1. Install the bumped lockfile with `npm ci`. Run `npm run check` before
   repairing anything and inspect the reported failures. Stale version stamps
   and a changed rule engine fingerprint are expected on every bump, since
   the engine includes the version; record any example, snapshot, coverage,
   or fixture failures too. Migrate removed APIs in the checks and demo first,
   then inspect the behavior failures they reveal. Tests about the library's old limitations also need
   review; keep the underlying prose-protection assertions.
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
5. Reconcile the coverage report. Map each new upstream constant or inline
   regex in `scripts/upstream-rules.json` to the SKILL.md section that
   teaches it, or mark it internal with a reason. For each changed
   fingerprint, read the upstream diff of that rule and update its SKILL.md
   wording and examples. When the engine changed, read the `spaceText()` diff
   for new, removed, or reordered steps. Add an example or probe wherever the
   report names a rule that no longer changes text on one.
6. Once the rules and probe outputs have been reviewed, run
   `npm run update-snapshot` and `npm run update-rules` as needed. The
   second only re-pins fingerprints, and refuses while any rule is unmapped
   or untaught. Inspect the entire snapshot and map diffs and rerun
   `npm run check`. Keep unrelated probes intact. Have a reviewer read
   the rule prose: the script verifies the examples, not the explanation an
   agent will follow. Synchronize README and site wording if it is affected.
7. Leave a reviewable record in the PR: old/new versions, the version-tagged
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
