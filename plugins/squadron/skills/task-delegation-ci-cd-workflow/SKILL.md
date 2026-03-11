---
name: task-delegation-ci-cd-workflow
description: Defines the agent delegation workflow for code review backlog tasks, including CI/CD pipeline reviews, standards compliance audits, and code quality reviews where no new implementation is required.
---

# Code Review Task Workflow

Use this workflow when the task has been classified as a code review task (see `task-delegation-task-identification` skill). This covers reviewing existing code, CI/CD pipeline configuration, standards compliance, and quality audits where no new implementation is required. Track the current iteration number starting at 1.

## Step 1: Review

Invoke the **Code Reviewer** agent with:
- The task description and acceptance criteria
- The list of files to review
- The project's coding conventions and style context
- The current iteration number (1–4)

## Step 2: Verify

Invoke the **Acceptance Tester** agent with:
- The task description and acceptance criteria
- Code review findings from the Code Reviewer
- The backlog file path for recording findings

## Step 3: Handle Results

- **If all acceptance criteria PASS**: proceed to task completion
- **If the Code Reviewer identifies issues that require code changes**: the task scope has expanded beyond review-only. Update the current task's description to include the implementation work, then switch to the `task-delegation-engineering-workflow` skill to complete the remaining steps (write tests, implement, review, verify, document).
- **If any acceptance criterion FAILS but no code changes are required** (e.g., the review output is missing required sections or format):
  - Increment the iteration counter
  - If iteration count exceeds 4: accept the review as-is, proceed to task completion
  - Otherwise: return to Step 1 with the Acceptance Tester's failure findings so the Code Reviewer can produce a conforming review
