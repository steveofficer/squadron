# Write Tests for Code Reviewer Agent Debate Round

## Status
pending

## Priority
high

## Description
Write automated tests (using Node.js built-in `node:test`) that verify the three changes required in `plugins/squadron/agents/code-reviewer.agent.md`:

1. **Debate Round step exists** (T3) — a "Debate Round" step appears in the Workflow section between Step 1 (Delegate to Sub-Reviewers) and Step 2 (Synthesize Findings).
2. **Debate Round instructs revision** (T4) — the Debate Round step states that all three original findings are passed to each reviewer and asks each reviewer to endorse, rebut, or add findings.
3. **Debate is capped at one round** (T5) — the Debate Round step explicitly states the debate is capped at exactly one round (no further iteration).
4. **Synthesis uses revised findings** (T6) — the Synthesize Findings step (Step 2) references the revised findings from the debate round as its input, not the originals.

Create the test file at `tests/011-code-reviewer-debate-round.test.js`. These tests must fail against the current (unmodified) `code-reviewer.agent.md` (TDD red phase) and pass once the agent file is updated in task 012.

Follow the same patterns used in existing test files:
- Import from `node:test` and `node:assert/strict`
- Derive `projectRoot` via `import.meta.url`
- Read the target file with `readFileSync`
- Use `assert.match` with regex, or `assert.ok` with `includes`, to verify content

## Acceptance Criteria
- [ ] Given the test file exists and the current (unmodified) `code-reviewer.agent.md` is read, when `node --test tests/011-code-reviewer-debate-round.test.js` is run, then all four tests fail (confirming the red phase — the debate round content is not yet present).
- [ ] Given the test for debate round existence (T3), when reading the agent file's Workflow section, then the test asserts that a heading or label containing "Debate Round" appears between "Delegate" (Step 1) and "Synthesize" (Step 2).
- [ ] Given the test for debate round instructions (T4), when reading the Debate Round step content, then the test asserts it references all three reviewer reports and contains instructions to endorse, rebut, or add findings.
- [ ] Given the test for the one-round cap (T5), when reading the Debate Round step content, then the test asserts that it explicitly states the debate is limited to one round (e.g., matches a phrase like "one round", "capped at", or "no further iteration").
- [ ] Given the test for synthesis input (T6), when reading the Synthesize Findings step content, then the test asserts it references "revised" findings (not only "original") as input to synthesis.

## Dependencies
None

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the acceptance tester -->
