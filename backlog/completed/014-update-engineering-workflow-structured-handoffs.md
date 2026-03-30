# Update Engineering Workflow Skill for Structured Handoffs

## Status
completed

## Priority
high

## Milestone
M2

## Description
Update `/plugins/squadron/skills/task-delegation-engineering-workflow/SKILL.md` to integrate structured handoff parsing throughout the workflow. Six specific changes are required:

1. **Top of file**: Add a reference to the `agent-handoff-schemas` skill and state that it governs structured output parsing used in this workflow.

2. **Step 2 (Implement)**: Update the Software Engineer prompt construction instructions to extract `TestResults` fields from the Test Engineer's structured block. Specifically, instruct the dispatcher to parse `files_created`, `tests_written`, and `framework` from the ` ```json agent-handoff ` block in the Test Engineer's output and pass them explicitly to the Software Engineer prompt.

3. **Step 4 (Code Review)**: Update the Code Reviewer prompt construction instructions to extract `ImplementationSummary` fields from the Software Engineer's structured block. Specifically, instruct the dispatcher to parse `files_modified` and `approach` from the ` ```json agent-handoff ` block and pass them explicitly to the Code Reviewer prompt.

4. **Step 5 (Verify)**: Update the Acceptance Tester prompt construction instructions to pass `ImplementationSummary` fields (`files_modified`, `approach`) extracted from the Software Engineer's structured block.

5. **Step 6 (Handle Results)**: Update the branch logic to read `ReviewVerdict.verdict` from the Code Reviewer's structured block and `AcceptanceReport.overall` from the Acceptance Tester's structured block when determining whether to PASS or REWORK.

6. **New section — Malformed Output Handling**: Add a `## Malformed Output Handling` section (place it after Step 6 and before Step 7) that specifies:
   - If a structured block is missing or cannot be parsed, retry the agent invocation once
   - If the retry also produces malformed output, fall back to extracting information from the agent's prose response
   - Record a warning in the backlog task file noting that structured output was unavailable for that step

## Acceptance Criteria
- [x] Given the updated skill file, when the top of the file is read, then it contains a reference to the `agent-handoff-schemas` skill and states that it governs structured output parsing.
- [x] Given the updated skill file, when Step 2 is read, then it explicitly instructs extracting `files_created`, `tests_written`, and `framework` from the Test Engineer's `agent-handoff` structured block before constructing the Software Engineer prompt.
- [x] Given the updated skill file, when Steps 4 and 5 are read, then both explicitly instruct extracting `files_modified` and `approach` from the Software Engineer's `agent-handoff` structured block.
- [x] Given the updated skill file, when Step 6 is read, then it instructs reading `ReviewVerdict.verdict` and `AcceptanceReport.overall` from their respective structured blocks to determine the PASS/REWORK branch.
- [x] Given the updated skill file, when inspected, then it contains a `## Malformed Output Handling` section specifying retry-once behavior and a prose-fallback with backlog warning when structured output remains unavailable.

## Dependencies
009

## Implementation Notes
Updated `task-delegation-engineering-workflow/SKILL.md` with six targeted changes: (1) added `agent-handoff-schemas` reference at top of file; (2) Step 2 now instructs parsing `TestResults.files_created`, `tests_written`, and `framework` from the Test Engineer's handoff block; (3) Step 4 instructs parsing `ImplementationSummary.files_modified` and `approach`; (4) Step 5 instructs the same ImplementationSummary extraction; (5) Step 6 reads `ReviewVerdict.verdict` and `AcceptanceReport.overall` from structured blocks; (6) added `## Malformed Output Handling` section with retry-once and prose-fallback logic.

## Testing Findings
- **Overall**: PASS
- **Criterion 1**: PASS — Line 10 of SKILL.md explicitly states: "Structured output parsing in this workflow is governed by the `agent-handoff-schemas` skill. Load that skill to understand block delimiters, field names, and fallback behaviour."
- **Criterion 2**: PASS — Step 2 (lines 25–26) instructs: "Parsed from the Test Engineer's ` ```json agent-handoff ` block: `TestResults.files_created`, `TestResults.tests_written`, and `TestResults.framework` — pass these explicitly so the Software Engineer knows exactly which files and test cases to make pass."
- **Criterion 3**: PASS — Step 4 (lines 43–46) instructs extracting `ImplementationSummary.files_modified` and `ImplementationSummary.approach` from the Software Engineer's block. Step 5 (lines 52–54) repeats the same extraction instruction for the Acceptance Tester prompt.
- **Criterion 4**: PASS — Step 6 (lines 61–62) reads: "Determine the Code Review verdict by reading `ReviewVerdict.verdict` from the Code Reviewer's ` ```json agent-handoff ` block" and "Determine acceptance by reading `AcceptanceReport.overall` from the Acceptance Tester's ` ```json agent-handoff ` block."
- **Criterion 5**: PASS — `## Malformed Output Handling` section (lines 69–76) specifies retry-once on missing/unparseable block, prose-fallback on second failure, and a backlog warning in both cases.
