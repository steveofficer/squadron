# Update task-delegation-engineering-workflow to Reference Debug-Retry Loop

## Status
pending

## Priority
high

## Milestone
M1

## Description
Update the skill file at `/plugins/squadron/skills/task-delegation-engineering-workflow/SKILL.md` to insert a new step between the current Step 2 (Implement) and Step 3 (Code Review) that invokes the `debug-retry-loop` skill.

The new step (Step 2.5 or renumbered as appropriate) must:
- Be positioned immediately after the Software Engineer completes an implementation attempt and before the Code Reviewer is invoked.
- Instruct the Task Dispatcher to load and follow the `debug-retry-loop` skill.
- Not inline the debug-retry-loop procedure — reference the skill by name only, consistent with the project principle that agent files must not inline scenario-specific workflow branches.

If the debug-retry loop results in the task being blocked (tests still failing after max retries), the engineering workflow must handle that outcome by skipping the Code Review and Documentation steps and instead proceeding directly to task blocking per the `agent-backlog-maintenance` skill conventions.

Do not otherwise alter the existing steps in the engineering workflow skill.

## Acceptance Criteria
- [ ] Given the updated `task-delegation-engineering-workflow` SKILL.md is read, when its steps are listed in order, then a step referencing the `debug-retry-loop` skill appears between the Implement step and the Code Review step
- [ ] Given the new step is read, when its content is inspected, then it references the `debug-retry-loop` skill by name and does not inline the retry procedure itself
- [ ] Given the new step is read, when the blocked-task outcome is checked, then the skill specifies that a blocked result from the debug-retry loop skips Code Review and Documentation and proceeds to task blocking
- [ ] Given the existing steps (Write Tests, Code Review, Verify, Handle Results, Document) are read after the update, when compared to the previous version, then their content and ordering are unchanged except for renumbering if steps were shifted

## Dependencies
006

## Implementation Notes
<!-- Populated by the Software Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
