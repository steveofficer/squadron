# Create debug-retry-loop Skill File

## Status
completed

## Priority
high

## Milestone
M1

## Description
Create a new skill file at `/plugins/squadron/skills/debug-retry-loop/SKILL.md` that documents the iterative debug-retry loop procedure. This skill encapsulates the logic for running the test suite after a Software Engineer implementation attempt, capturing structured output (pass/fail counts, failing test names, error messages, stack traces), and re-invoking the Software Engineer with targeted failure context when tests fail.

The skill must specify:
1. Run the test suite and capture structured output (pass/fail counts, failing test names, error messages, stack traces).
2. If all tests pass, exit the loop and continue to Code Review.
3. If tests fail, re-invoke the Software Engineer with a prompt that includes:
   - The original task description and acceptance criteria.
   - The full diff of the implementation just written.
   - The structured test output showing exactly which tests failed and why.
   - The instruction: "Fix only the failing tests listed above. Do not change passing tests or unrelated code."
4. Repeat up to a maximum of 3 retry iterations (not counting the initial implementation attempt).
5. If tests still fail after 3 retry iterations, mark the task blocked with a clear summary of the failures and stop.
6. If tests pass at any iteration, exit the loop and continue to the Code Reviewer step.

The skill file must follow the same YAML frontmatter format as existing skills (`name`, `description`).

## Acceptance Criteria
- [x] Given the `/plugins/squadron/skills/debug-retry-loop/` directory does not exist, when the task is complete, then the directory exists and contains a `SKILL.md` file
- [x] Given the SKILL.md file is read, when the YAML frontmatter is inspected, then it contains a `name` field with value `debug-retry-loop` and a `description` field summarising the skill's purpose
- [x] Given the SKILL.md file is read, when its content is inspected, then it documents all six steps of the procedure: run tests, exit on pass, re-invoke Software Engineer with diff and failure output on fail, maximum 3 retries, block on persistent failure, and continue to Code Review on success
- [x] Given the SKILL.md file is read, when the re-invocation prompt requirements are checked, then the file specifies that the Software Engineer must receive the original task description, acceptance criteria, the full implementation diff, structured test output, and the scoped fix instruction

## Dependencies
None

## Implementation Notes
Created `/plugins/squadron/skills/debug-retry-loop/SKILL.md` with YAML frontmatter (`name: debug-retry-loop`, `description`) and six procedural steps covering: run tests, exit on pass, re-invoke Software Engineer with diff + failure output, enforce 3-retry limit, block on persistent failure, and continue to Code Review on success.

## Testing Findings
- **Overall**: PASS
- **Criterion 1**: PASS — Directory `/plugins/squadron/skills/debug-retry-loop/` exists and contains `SKILL.md` (confirmed via `ls` output showing the file at 2023 bytes).
- **Criterion 2**: PASS — YAML frontmatter (lines 1–4) contains `name: debug-retry-loop` (line 2) and a `description` field (line 3) that summarises the skill's purpose as the iterative debug-retry procedure used by the Task Dispatcher.
- **Criterion 3**: PASS — All six steps are documented: Step 1 (Run Tests), Step 2 (Exit on Pass → proceed to Code Review), Step 3 (Re-invoke Software Engineer with diff and failure output), Step 4 (Enforce maximum 3 retry iterations), Step 5 (Block on Persistent Failure), Step 6 (Continue on Success → proceed to Code Reviewer).
- **Criterion 4**: PASS — Step 3 explicitly lists all required re-invocation prompt elements: original task description and acceptance criteria, the full diff of the implementation just written, structured test output showing which tests failed and why, and the scoped fix instruction ("Fix only the failing tests listed above. Do not change passing tests or unrelated code.").
