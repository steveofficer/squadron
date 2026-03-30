# Add Output Format Section to Test Engineer Agent

## Status
completed

## Priority
medium

## Milestone
M2

## Description
Add an `## Output Format` section to `/plugins/squadron/agents/test-engineer.agent.md`. The section must be inserted between `## 5. Report` and `# Quality Standards`.

The section must instruct the Test Engineer to:
1. Reference the `agent-handoff-schemas` skill for the full schema definition
2. Produce a `TestResults` structured block after its prose report, using the ` ```json agent-handoff ` / ` ``` ` delimiter convention defined by that skill

The `TestResults` block must contain:
- `files_created`: list of test file paths created
- `tests_written`: array of objects with `name`, `criterion`, and `file` fields (one entry per test)
- `framework`: the test framework used (e.g., `"node:test"`, `"jest"`)

## Acceptance Criteria
- [x] Given the Test Engineer agent file, when inspected, then it contains an `## Output Format` section.
- [x] Given the `## Output Format` section, when its position is checked, then it appears after `## 5. Report` and before `# Quality Standards`.
- [x] Given the `## Output Format` section, when its content is read, then it references the `agent-handoff-schemas` skill and instructs producing a `TestResults` structured block using the ` ```json agent-handoff ` delimiter.
- [x] Given the `## Output Format` section, when the required fields are inspected, then `files_created`, `tests_written` (with `name`, `criterion`, `file` sub-fields), and `framework` are all specified.

## Dependencies
009

## Implementation Notes
Inserted `## Output Format` section between `## 5. Report` and `# Quality Standards` in `test-engineer.agent.md`. The section references the `agent-handoff-schemas` skill and instructs producing a `TestResults` structured block with `files_created`, `tests_written` (with `name`, `criterion`, `file` per entry), and `framework` fields using the ` ```json agent-handoff ` delimiter.

## Testing Findings
- **Overall**: PASS
- **Criterion 1**: PASS — `## Output Format` heading present at line 55 of `test-engineer.agent.md`.
- **Criterion 2**: PASS — Section sits between `## 5. Report` (line 48) and `# Quality Standards` (line 77); order confirmed by line numbers.
- **Criterion 3**: PASS — Line 57 references the `agent-handoff-schemas` skill; line 59 instructs producing a `TestResults` structured block; line 61 uses the ` ```json agent-handoff ` delimiter exactly as specified.
- **Criterion 4**: PASS — `files_created` (line 63), `tests_written` array (line 64) with `name` (line 66), `criterion` (line 67), and `file` (line 68) sub-fields, and `framework` (line 71) are all present. Line 75 also lists them explicitly as required fields.
- **Test suite**: 8/8 existing tests pass (`node --test tests/*.test.js`); no regressions introduced.
