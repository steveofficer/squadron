# Update task-delegation-engineering-workflow to Reference Debug-Retry Loop

## Status
completed

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
- [x] Given the updated `task-delegation-engineering-workflow` SKILL.md is read, when its steps are listed in order, then a step referencing the `debug-retry-loop` skill appears between the Implement step and the Code Review step
- [x] Given the new step is read, when its content is inspected, then it references the `debug-retry-loop` skill by name and does not inline the retry procedure itself
- [x] Given the new step is read, when the blocked-task outcome is checked, then the skill specifies that a blocked result from the debug-retry loop skips Code Review and Documentation and proceeds to task blocking
- [x] Given the existing steps (Write Tests, Code Review, Verify, Handle Results, Document) are read after the update, when compared to the previous version, then their content and ordering are unchanged except for renumbering if steps were shifted

## Dependencies
006

## Implementation Notes
Inserted a new Step 3 ("Debug-Retry Loop") between Step 2 (Implement) and the former Step 3 (Code Review), which is now Step 4. The new step references the `debug-retry-loop` skill by name only. Includes blocked-task outcome handling (skip Code Review and Document, proceed to task blocking). Renumbered all subsequent steps and updated internal references in Handle Results accordingly.

## Testing Findings
- **Overall**: PASS

- **Criterion 1** — New debug-retry-loop step positioned between Implement and Code Review: PASS — The updated SKILL.md has Step 3: "Debug-Retry Loop" inserted directly between Step 2 "Implement" and Step 4 "Code Review". Confirmed via direct file inspection and `git diff` against the original commit (5765aa3).

- **Criterion 2** — New step references `debug-retry-loop` by name without inlining the procedure: PASS — Step 3 contains exactly: "Load and follow the `debug-retry-loop` skill." — the skill name is referenced explicitly and none of the internal debug-retry-loop steps (run tests, re-invoke engineer, enforce retry limit, etc.) are replicated inline.

- **Criterion 3** — Blocked outcome skips Code Review and Documentation and proceeds to task blocking: PASS — Step 3 states: "If the debug-retry loop results in the task being blocked (tests still failing after maximum retries): skip Step 4 (Code Review) and Step 7 (Document) and proceed directly to task blocking per the `agent-backlog-maintenance` skill conventions." All three required behaviors (skip Code Review, skip Document, proceed to task blocking) are specified.

- **Criterion 4** — Existing steps content unchanged, only renumbered: PASS — `git diff` confirms the only changes to pre-existing steps are: (a) step headings incremented by one (Code Review 3→4, Verify 4→5, Handle Results 5→6, Document 6→7), and (b) two internal step-number references in Handle Results updated from "Step 6 (Document)" to "Step 7 (Document)". All bullet-point content in every existing step is word-for-word identical to the original.

- **Test suite**: All 8 existing automated tests pass (`node --test tests/*.test.js`). No automated tests were written for Task 007 specifically; all criteria were verified through direct file inspection and git diff analysis.
