# Write Tests for review-findings Skill Changes

## Status
pending

## Priority
high

## Description
Write automated tests (using Node.js built-in `node:test`) that verify the two changes required in `plugins/squadron/skills/review-findings/SKILL.md`:

1. **Finding ID prefixes in the Citation Format section** — each finding bullet example in the Citation Format section carries a reviewer-scoped ID prefix (`S-1`, `R-1`, `L-1`) before the `[file:line]` reference.
2. **Debate Round References section** — the skill file contains a "Debate Round References" section explaining that reviewers may endorse or rebut findings by referencing those IDs (e.g., "Endorses Strict finding S-2", "Rebuts Reasonable finding R-1: [explanation]").

Create the test file at `tests/009-review-findings-skill-debate.test.js`. These tests must fail against the current skill file (TDD red phase) and pass once the skill file is updated in task 010.

Follow the same patterns used in `tests/001-document-requirement-conflict-resolver.test.js` and `tests/002-rename-backend-engineer.test.js`:
- Import from `node:test` and `node:assert/strict`
- Derive `projectRoot` via `import.meta.url`
- Read the target file with `readFileSync`
- Use `assert.match` with regex, or `assert.ok` with `includes`, to verify content

## Acceptance Criteria
- [ ] Given the test file exists and the current (unmodified) `SKILL.md` is read, when `node --test tests/009-review-findings-skill-debate.test.js` is run, then both tests fail (confirming red phase — the IDs and section are not yet present).
- [ ] Given the test for finding IDs, when reading the Citation Format section of the skill file, then the test asserts that at least one example bullet includes an ID prefix matching the pattern `S-\d+`, `R-\d+`, or `L-\d+` before the `[file:line]` reference.
- [ ] Given the test for the Debate Round References section, when reading the full skill file content, then the test asserts the string "Debate Round References" is present as a heading.
- [ ] Given the test for the Debate Round References section, when reading the skill file content, then the test asserts the section body references endorsing and rebutting findings by ID (e.g., contains words like "endorse" and "rebut").

## Dependencies
None

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the acceptance tester -->
