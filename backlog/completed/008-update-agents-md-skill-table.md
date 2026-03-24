# Update AGENTS.md Skill Reference Table for Debug-Retry Loop

## Status
completed

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
- [x] Given `AGENTS.md` is read, when the Skill References table in the Workflow section is inspected, then a row exists for the `debug-retry-loop` skill with a Concern description and a Used-by value
- [x] Given the new row is read, when its position in the table is checked, then it appears after the `task-delegation-engineering-workflow` row
- [x] Given the rest of `AGENTS.md` is read after the update, when compared to the previous version, then no other content has changed

## Dependencies
007

## Implementation Notes
Added a new row `| Debug-retry loop for implementation tasks | \`debug-retry-loop\` | Task Dispatcher (via engineering workflow) |` to the Skill References table in AGENTS.md, positioned immediately after the `task-delegation-engineering-workflow` row. No other content was changed.

## Testing Findings
- **Overall**: PASS
- **Criterion 1**: PASS — `AGENTS.md` line 125 contains `| Debug-retry loop for implementation tasks | \`debug-retry-loop\` | Task Dispatcher (via engineering workflow) |`, satisfying both the Concern description and Used-by value requirements.
- **Criterion 2**: PASS — `git diff` confirms the new row was inserted immediately after the `| Implementation task workflow | \`task-delegation-engineering-workflow\` | Task Dispatcher |` row (line 124), making it the next and final row of the table.
- **Criterion 3**: PASS — `git diff AGENTS.md` shows exactly one line added (`+| Debug-retry loop for implementation tasks | ...`) with no deletions or other modifications anywhere else in the file.
