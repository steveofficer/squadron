# Add Output Format Section to Test Engineer Agent

## Status
pending

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
- [ ] Given the Test Engineer agent file, when inspected, then it contains an `## Output Format` section.
- [ ] Given the `## Output Format` section, when its position is checked, then it appears after `## 5. Report` and before `# Quality Standards`.
- [ ] Given the `## Output Format` section, when its content is read, then it references the `agent-handoff-schemas` skill and instructs producing a `TestResults` structured block using the ` ```json agent-handoff ` delimiter.
- [ ] Given the `## Output Format` section, when the required fields are inspected, then `files_created`, `tests_written` (with `name`, `criterion`, `file` sub-fields), and `framework` are all specified.

## Dependencies
009

## Implementation Notes
<!-- Populated by the Software Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
