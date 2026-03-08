---
name: task-delegation-task-identification
description: Defines how to classify a backlog task into a task type and select the appropriate agent delegation workflow.
---

# Task Identification

Before delegating to any agents, analyze the task description and acceptance criteria to determine what kind of work is required and which agents are needed.

## Determine the Task Type

**Examine the following signals:**
- Keywords in the task title and description (e.g., "document", "review", "implement", "fix", "refactor", "test")
- The nature of the acceptance criteria (e.g., documentation updates, code changes, test coverage)
- File types that will be modified (e.g., `.md` files for documentation, `.js`/`.ts` for code)

## Task Type Classification

1. **Documentation-only tasks** — require Technical Writer and Acceptance Tester
   - Task involves only updating documentation files (README, CHANGELOG, guides)
   - No code implementation needed
   - Acceptance criteria focus on documentation quality and completeness
   - **Required agents**: Technical Writer → Acceptance Tester
   - **Skill to follow**: `task-delegation-documentation-workflow`

2. **Code review tasks** — require Code Reviewer and Acceptance Tester
   - Task is to review existing code, CI/CD configuration, or quality standards
   - No new implementation needed
   - Acceptance criteria focus on code quality, standards compliance
   - **Required agents**: Code Reviewer → Acceptance Tester
   - **Skill to follow**: `task-delegation-ci-cd-workflow`

3. **Test-only tasks** — require Test Engineer, Code Reviewer, and Acceptance Tester
   - Task is to add tests for existing functionality
   - No implementation changes needed (only test files)
   - Acceptance criteria focus on test coverage and test quality
   - **Required agents**: Test Engineer → Code Reviewer → Acceptance Tester
   - **Skill to follow**: `task-delegation-test-workflow`

4. **Implementation tasks** — require full TDD workflow
   - Task involves creating or modifying functional code
   - Acceptance criteria describe new behavior or fixes
   - Requires tests, implementation, and review
   - **Required agents**: Test Engineer → Backend Engineer → Code Reviewer → Acceptance Tester → Technical Writer
   - **Skill to follow**: `task-delegation-engineering-workflow`

5. **Documentation + Code tasks** — require implementation and documentation
   - Task involves both code changes and documentation updates
   - Acceptance criteria cover both implementation and documentation
   - **Required agents**: Test Engineer → Backend Engineer → Code Reviewer → Acceptance Tester → Technical Writer
   - **Skill to follow**: `task-delegation-engineering-workflow`

## Selecting the Workflow

Based on the task type, load the appropriate workflow skill and follow its steps. If the task doesn't fit cleanly into one category, err on the side of including more agents rather than fewer — better to have unnecessary verification than to skip a critical step.

## Examples

- **Task: "Update README to document new authentication flow"**
  - Type: Documentation-only
  - Workflow: Technical Writer → Acceptance Tester
  - Rationale: Only documentation files will be modified

- **Task: "Review the error handling in the API module for consistency"**
  - Type: Code review
  - Workflow: Code Reviewer → Acceptance Tester
  - Rationale: The task is to review existing code, not implement changes

- **Task: "Add unit tests for the existing user validation module"**
  - Type: Test-only
  - Workflow: Test Engineer → Code Reviewer → Acceptance Tester
  - Rationale: Adding tests for existing functionality without changing implementation

- **Task: "Implement token refresh functionality"**
  - Type: Implementation
  - Workflow: Test Engineer → Backend Engineer → Code Reviewer → Acceptance Tester → Technical Writer
  - Rationale: New feature requiring tests, implementation, review, and documentation

- **Task: "Fix bug in password reset that allows expired tokens"**
  - Type: Implementation
  - Workflow: Test Engineer → Backend Engineer → Code Reviewer → Acceptance Tester → Technical Writer
  - Rationale: Bug fix requires failing test first, then implementation to fix it

- **Task: "Add API documentation and update README for new endpoints"**
  - Type: Documentation-only (if endpoints already exist)
  - Workflow: Technical Writer → Acceptance Tester
  - Rationale: Only documenting existing functionality
