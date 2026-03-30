---
name: task-delegation-engineering-workflow
description: Defines the full TDD agent delegation workflow for implementation backlog tasks (new features, bug fixes, refactors, or combined code + documentation changes).
---

# Engineering Task Workflow (Full TDD)

Use this workflow when the task has been classified as an implementation task or documentation + code task (see `task-delegation-task-identification` skill). Track the current iteration number starting at 1.

Structured output parsing in this workflow is governed by the `agent-handoff-schemas` skill. Load that skill to understand block delimiters, field names, and fallback behaviour.

## Step 1: Write Tests First (TDD)

Invoke the **Test Engineer** agent with:
- The full task description and acceptance criteria
- The project's testing framework and conventions
- Relevant codebase context: key file paths, architecture patterns, coding conventions
- The instruction to write tests that correspond to each acceptance criterion **before any implementation exists** — these tests are expected to fail initially and will pass once the Software Engineer completes the implementation

## Step 2: Implement

Invoke the **Software Engineer** agent with a focused prompt containing:
- The full task description and acceptance criteria
- The Test Engineer's summary of tests written (files, test names, what each test verifies)
- Parsed from the Test Engineer's ` ```json agent-handoff ` block: `TestResults.files_created`, `TestResults.tests_written`, and `TestResults.framework` — pass these explicitly so the Software Engineer knows exactly which files and test cases to make pass
- Relevant codebase context: key file paths, architecture patterns, coding conventions
- Scope boundaries: what should and should not be changed
- Any dependency context from previously completed tasks
- The instruction to implement only what is needed to make the pre-written TDD tests pass
- On rework iterations: the Code Reviewer's rework instructions and/or the Acceptance Tester's failure findings

## Step 3: Debug-Retry Loop

Load and follow the `debug-retry-loop` skill.

- **If the debug-retry loop completes successfully** (tests passing): proceed to Step 4 (Code Review)
- **If the debug-retry loop results in the task being blocked** (tests still failing after maximum retries): skip Step 4 (Code Review) and Step 7 (Document) and proceed directly to task blocking per the `agent-backlog-maintenance` skill conventions

## Step 4: Code Review

Invoke the **Code Reviewer** agent with:
- The task description and acceptance criteria
- The list of all files created or modified by the Test Engineer and Software Engineer
- A summary of the implementation approach
- Parsed from the Software Engineer's ` ```json agent-handoff ` block: `ImplementationSummary.files_modified` and `ImplementationSummary.approach` — pass these explicitly so the reviewer has precise scope and intent
- The project's coding conventions and style context
- The current iteration number (1–4)

## Step 5: Verify

Invoke the **Acceptance Tester** agent with:
- The task description and acceptance criteria
- Implementation and test summaries from the previous steps
- Parsed from the Software Engineer's ` ```json agent-handoff ` block: `ImplementationSummary.files_modified` and `ImplementationSummary.approach` — pass these explicitly so the tester knows exactly what was changed and why
- The backlog file path for recording findings
- The instruction that the TDD tests written in Step 1 serve as executable evidence — each passing test is direct proof that the corresponding acceptance criterion has been met

## Step 6: Handle Results

- **If Code Review verdict is PASS and all acceptance criteria PASS**: proceed to Step 7 (Document)
  - Determine the Code Review verdict by reading `ReviewVerdict.verdict` from the Code Reviewer's ` ```json agent-handoff ` block
  - Determine acceptance by reading `AcceptanceReport.overall` from the Acceptance Tester's ` ```json agent-handoff ` block
- **If Code Review verdict is REWORK NEEDED or any acceptance criterion FAILS**:
  - Collect the Code Reviewer's rework instructions and the Acceptance Tester's failure findings
  - Increment the iteration counter
  - If iteration count exceeds 4: accept the code as-is, proceed to Step 7. Record any outstanding findings in the backlog but do not block completion — the code is as good as it will get.
  - Otherwise: return to Step 2 with the combined feedback from the Code Review and Acceptance Test, instructing the Software Engineer to address the specific issues (do not rewrite the TDD tests unless the acceptance criteria themselves have changed)

## Malformed Output Handling

When reading a structured ` ```json agent-handoff ` block from any agent response:

- **If the block is missing or cannot be parsed**: retry the agent invocation once with the same prompt
- **If the retry also produces malformed output**: fall back to extracting the required information from the agent's prose response; continue the workflow using the extracted prose values
- In both cases, record a warning in the backlog task file noting that structured output was unavailable for that step

## Step 7: Document

Invoke the **Technical Writer** agent with:
- The completed task description and summary of all changes
- List of all files created or modified
- The scope of documentation updates needed (README, CHANGELOG, API docs)
