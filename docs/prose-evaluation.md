# Prose evaluation

`npm run check` verifies pangu's text behavior and the consistency of the
authored fixtures in `evals/evals.json`. It does not run a model. The fixtures
exercise prose spacing, Markdown links and emphasis, code, exact quotations
and logs, paths containing CJK, partial edits, explicit verbatim output,
structured output, and the scripts and punctuation pangu handles.

Only fixtures marked `"oracle": "pangu"` compare their whole input with
`pangu.spacingText()`. The others specify the agent's editing boundaries:
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

## During an upstream upgrade

Follow [Upgrading pangu](upgrading-pangu.md) first. Inspect failures in fixtures
with a pangu oracle alongside the examples and snapshot. Review other fixtures
against the prose contract rather than regenerating them with the library.
Add a regression case when a rule or editing boundary changes, then rerun the
affected model comparisons if making a claim about agent behavior. Keep those
model results separate from the deterministic CI checks.
