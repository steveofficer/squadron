# Add agent-handoff-schemas Row to AGENTS.md Skill Table

## Status
pending

## Priority
low

## Milestone
M2

## Description
Add one new row to the Skill References table in `/AGENTS.md` for the `agent-handoff-schemas` skill.

The table is located under the `### Skill References` heading within the `## Workflow` section. The new row must be appended to the existing table with:
- **Concern**: `Structured inter-agent handoff schemas`
- **Skill**: `agent-handoff-schemas`
- **Used by**: `Test Engineer, Software Engineer, Code Reviewer, Acceptance Tester, Task Dispatcher`

The existing rows in the table must not be modified.

## Acceptance Criteria
- [ ] Given `AGENTS.md`, when the Skill References table is inspected, then it contains a row for `agent-handoff-schemas`.
- [ ] Given the `agent-handoff-schemas` row, when the "Used by" column is read, then it lists Test Engineer, Software Engineer, Code Reviewer, Acceptance Tester, and Task Dispatcher.
- [ ] Given `AGENTS.md`, when the Skill References table is inspected, then all pre-existing rows remain unchanged.

## Dependencies
009

## Implementation Notes
<!-- Populated by the Software Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
