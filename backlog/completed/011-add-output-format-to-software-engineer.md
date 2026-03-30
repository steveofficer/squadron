# Add Output Format Section to Software Engineer Agent

## Status
completed

## Priority
medium

## Milestone
M2

## Description
Add an `## Output Format` section to `/plugins/squadron/agents/software-engineer.agent.md`. The section must be inserted between `## 6. Report` and `# Quality Standards`.

The section must instruct the Software Engineer to:
1. Reference the `agent-handoff-schemas` skill for the full schema definition
2. Produce an `ImplementationSummary` structured block after its prose report, using the ` ```json agent-handoff ` / ` ``` ` delimiter convention defined by that skill

The `ImplementationSummary` block must contain:
- `files_modified`: list of all file paths created or modified
- `approach`: string describing the implementation approach taken
- `trade_offs`: string describing any trade-offs or concerns
- `tests_passing`: boolean indicating whether all tests pass

## Acceptance Criteria
- [x] Given the Software Engineer agent file, when inspected, then it contains an `## Output Format` section.
- [x] Given the `## Output Format` section, when its position is checked, then it appears after `## 6. Report` and before `# Quality Standards`.
- [x] Given the `## Output Format` section, when its content is read, then it references the `agent-handoff-schemas` skill and instructs producing an `ImplementationSummary` structured block using the ` ```json agent-handoff ` delimiter.
- [x] Given the `## Output Format` section, when the required fields are inspected, then `files_modified`, `approach`, `trade_offs`, and `tests_passing` are all specified.

## Dependencies
009

## Implementation Notes
Inserted `## Output Format` section between `## 6. Report` and `# Quality Standards` in `software-engineer.agent.md`. The section references the `agent-handoff-schemas` skill and instructs producing an `ImplementationSummary` structured block with `files_modified`, `approach`, `trade_offs`, and `tests_passing` fields using the ` ```json agent-handoff ` delimiter.

## Testing Findings
- **Overall**: PASS
- **Criterion 1**: PASS — `## Output Format` heading present at line 62 of `software-engineer.agent.md`.
- **Criterion 2**: PASS — Section sits between `## 6. Report` (line 55) and `# Quality Standards` (line 79); order confirmed by line numbers.
- **Criterion 3**: PASS — Line 64 references the `agent-handoff-schemas` skill; line 66 instructs producing an `ImplementationSummary` structured block; line 68 uses the ` ```json agent-handoff ` delimiter exactly as specified.
- **Criterion 4**: PASS — `files_modified` (line 70), `approach` (line 71), `trade_offs` (line 72), and `tests_passing` (line 73) are all present. Line 77 also lists them explicitly as required fields.
- **Test suite**: 8/8 existing tests pass (`node --test tests/*.test.js`); no regressions introduced.
