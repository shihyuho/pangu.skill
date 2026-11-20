# Prose evaluation

`npm run check` verifies pangu's text behavior and the consistency of the
authored fixtures in `evals/evals.json`. It does not run a model. The fixtures
exercise prose spacing, Markdown links and emphasis, code, exact quotations
and logs, paths containing CJK, partial edits, explicit verbatim output,
structured output, and the scripts and punctuation pangu handles.

Only fixtures marked `"oracle": "pangu"` compare their whole input with
`pangu.spaceText()`. The others specify the agent's editing boundaries:
their expected outputs preserve literal text and syntax that a raw string
formatter can alter. Review those expectations as part of the prose contract.
The `preserve` list identifies exact substrings that must remain unchanged;
the grader also compares the complete output, including whitespace.

## Running a model comparison

For an Astra trial, compare no skill, the previous skill, and the revised
skill separately at both medium and high effort. Use the same resolved model,
host instructions, tools, and fixture inputs for every arm. Start a fresh
context for each case and arm. Ensure automatic plugin loading does not expose
the skill to the no-skill arm or load a second version in the other arms.

Give the model only the case's `prompt` and `input`, plus the selected skill
when applicable. Ask it to return only the transformed content, preserving the
specified format. Keep `expected_output`, `preserve`, and the grader out of
the model's context. Save the unedited result as `<id>.txt` in a separate
directory for each run; do not trim whitespace or add a trailing newline.

```sh
npm run grade:prose -- /absolute/path/to/run-outputs
```

The command requires an output file for every fixture and exits nonzero on a
missing or mismatching result. Writing expected outputs to those files tests
the grader only; it is not a model run. Record model/effort, host configuration,
repository and skill revisions, raw outputs, per-case results, and any actual
latency or usage measurements. Repeat trials before inferring an effort-level
or skill benefit, and report protected-text failures separately from missed
spacing. Do not infer model quality from library checks or file size.

These explicit editing requests are regression cases, not a held-out benchmark
or a test of automatic skill selection. Before deciding to retire the skill,
add held-out ordinary writing tasks that do not ask for spacing, and assess
invocation behavior and unnecessary edits as well as spacing correctness.
Until measured, the same skill remains applicable at both effort levels.

## Extended Unicode regression

Cases 17–21 cover the Issue #24 list conversion, characters absent from the
skill's examples, and Unicode inside inline code, fenced code, and an exact
quotation. The list tasks ask only for Markdown conversion, exercising the
skill alongside an ordinary formatting task. Their expected list contents
were verified against pangu 9.1.1; the literal-preservation cases follow the
prose contract.

For this change, run the previous and revised skills with `gpt-6-sol` at
`high` effort. Use a fresh context for every case, skill version, and trial,
with three trials per case. Give each context only its selected skill and
the case's prompt/input, plus identical instructions for saving raw output.
Keep expected answers, the grader, other cases, and formatter execution out
of the executor's context. Require all three revised-skill outputs per case
to match exactly, including protected text. Use the exported `gradeOutput`
function for this focused subset; the CLI still requires the full suite.

[Recorded results](../evals/results/issue-24.json) retain the unedited outputs,
model/effort, skill and fixture hashes, and per-run verdicts. These are loaded-skill
regression trials, not evidence about automatic skill selection or other models.

## Upstream rule coverage rewrite

The Issue #34 rewrite maps every upstream rule to a SKILL.md section. Its
comparison ran the previous and revised skills with Claude Sonnet
(`claude-sonnet-5-5`) at medium effort, three trials per case, each in a
fresh headless Claude Code session (`claude -p`) started outside the
repository, with no skills, MCP servers, or setting sources loaded and only
the Read and Write tools. Each session received only its selected skill, the
case's prompt and input files, and identical instructions for saving raw
output.

[Recorded results](../evals/results/issue-34.json): both skills passed 83 of
84 runs, and neither changed protected text through spacing. The revised
skill's one failure, in case 7, spaced correctly but dropped the input's
trailing newline when saving; five extra case-7 trials per arm, recorded
separately, show the previous skill dropping it too (2 of 5 passed, against
5 of 5). The record keeps the first rewrite's iteration (81 of 84) and what
changed after it. Sessions averaged 31,404 total tokens with the previous
skill and 33,827 with the revised one, which teaches more upstream rules.

## During an upstream upgrade

Cases 22–26 cover pangu v10 slash/path boundaries, uninterrupted HTTP URLs,
per-line plus separators and attached suffixes, superscripts and Letterlike
Symbols, and these rules alongside protected code, link destinations, and an
exact quotation. Plain-text cases use the pinned library as their oracle;
the Markdown case retains the agent's prose boundaries. These fixtures are
separate from the historical Issue #24 model results above.

Case 27 covers pangu 10.2's `mo 店+` name suffix, both spellings with and
without a space after `mo`, and its interaction with other pluses on the line.

Follow [Upgrading pangu](upgrading-pangu.md) first. Inspect failures in fixtures
with a pangu oracle alongside the examples and snapshot. Review other fixtures
against the prose contract rather than regenerating them with the library.
Add a regression case when a rule or editing boundary changes, then rerun the
affected model comparisons if making a claim about agent behavior. Keep those
model results separate from the deterministic CI checks.
