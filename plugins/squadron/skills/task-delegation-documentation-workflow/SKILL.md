---
name: task-delegation-documentation-workflow
description: Defines the agent delegation workflow for documentation-only backlog tasks.
---

# Documentation-only Task Workflow

Use this workflow when the task has been classified as documentation-only (see `task-delegation-task-identification` skill). Track the current iteration number starting at 1.

## Step 1: Document

Invoke the **Technical Writer** agent with:
- The task description and acceptance criteria
- The scope of documentation updates needed (README, CHANGELOG, API docs)
- Relevant context about the project

## Step 2: Verify

Invoke the **Acceptance Tester** agent with:
- The task description and acceptance criteria
- Documentation changes summary from the Technical Writer
- The backlog file path for recording findings

## Step 3: Handle Results

- **If all acceptance criteria PASS**: proceed to task completion
- **If any acceptance criterion FAILS**:
  - Increment the iteration counter
  - If iteration count exceeds 4: accept the documentation as-is, proceed to task completion
  - Otherwise: return to Step 1 with the Acceptance Tester's failure findings
