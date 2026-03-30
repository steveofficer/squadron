# Add Output Format Section to Software Engineer Agent

## Status
pending

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
- [ ] Given the Software Engineer agent file, when inspected, then it contains an `## Output Format` section.
- [ ] Given the `## Output Format` section, when its position is checked, then it appears after `## 6. Report` and before `# Quality Standards`.
- [ ] Given the `## Output Format` section, when its content is read, then it references the `agent-handoff-schemas` skill and instructs producing an `ImplementationSummary` structured block using the ` ```json agent-handoff ` delimiter.
- [ ] Given the `## Output Format` section, when the required fields are inspected, then `files_modified`, `approach`, `trade_offs`, and `tests_passing` are all specified.

## Dependencies
009

## Implementation Notes
<!-- Populated by the Software Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
