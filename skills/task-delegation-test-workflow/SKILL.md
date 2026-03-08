---
name: task-delegation-test-workflow
description: Defines the agent delegation workflow for test-only backlog tasks (adding or enhancing tests for existing functionality without changing implementation).
---

# Test-only Task Workflow

Use this workflow when the task has been classified as a test-only task (see `task-delegation-task-identification` skill). Track the current iteration number starting at 1.

## Step 1: Write Tests

Invoke the **Test Engineer** agent with:
- The task description and acceptance criteria
- The project's testing framework and conventions
- Relevant codebase context: key file paths, architecture patterns, coding conventions
- The existing implementation that needs test coverage

## Step 2: Code Review

Invoke the **Code Reviewer** agent with:
- The task description and acceptance criteria
- The list of test files created or modified
- The project's testing conventions
- The current iteration number (1–4)

## Step 3: Verify

Invoke the **Acceptance Tester** agent with:
- The task description and acceptance criteria
- Test summaries from the Test Engineer
- The backlog file path for recording findings

## Step 4: Handle Results

- **If Code Review verdict is PASS and all acceptance criteria PASS**: proceed to task completion
- **If Code Review verdict is REWORK NEEDED or any acceptance criterion FAILS**:
  - Increment the iteration counter
  - If iteration count exceeds 4: accept the tests as-is, proceed to task completion
  - Otherwise: return to Step 1 with the feedback
