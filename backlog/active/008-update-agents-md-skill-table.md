# Update AGENTS.md Skill Reference Table for Debug-Retry Loop

## Status
pending

## Priority
medium

## Milestone
M1

## Description
Update `AGENTS.md` to add the new `debug-retry-loop` skill to the Skill References table in the Workflow section. The table currently lists eight skills; a ninth row must be added for the debug-retry-loop skill.

The new row must follow the existing table format:

| Concern | Skill | Used by |
|---------|-------|---------|
| Debug-retry loop for implementation tasks | `debug-retry-loop` | Task Dispatcher (via engineering workflow) |

Place the new row after the existing `task-delegation-engineering-workflow` row, as the debug-retry loop is subordinate to the engineering workflow.

No other changes to `AGENTS.md` are required.

## Acceptance Criteria
- [ ] Given `AGENTS.md` is read, when the Skill References table in the Workflow section is inspected, then a row exists for the `debug-retry-loop` skill with a Concern description and a Used-by value
- [ ] Given the new row is read, when its position in the table is checked, then it appears after the `task-delegation-engineering-workflow` row
- [ ] Given the rest of `AGENTS.md` is read after the update, when compared to the previous version, then no other content has changed

## Dependencies
007

## Implementation Notes
<!-- Populated by the Software Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
