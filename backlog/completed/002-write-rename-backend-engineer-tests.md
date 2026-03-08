# Write Tests for Backend Engineer → Software Engineer Rename

## Status
completed

## Priority
high

## Description
Write automated tests that verify the "Backend Engineer" → "Software Engineer" rename has been completed correctly across all source files. Tests must be written before implementation begins (TDD). Follow the pattern established in `tests/001-document-requirement-conflict-resolver.test.js`.

Tests must cover all four TDD scenarios from the specification:
1. No occurrences of "Backend Engineer" exist anywhere in `agents/` source files
2. No occurrences of "Backend Engineer" exist anywhere in `skills/` source files
3. No occurrences of "Backend Engineer" exist in `AGENTS.md` or `README.md`
4. `agents/software-engineer.agent.md` exists and its frontmatter `name` field equals "Software Engineer"

The test file must be placed at `tests/002-rename-backend-engineer.test.js`.

Note: `.github/agents/` and `.github/skills/` are human-managed installed copies and must NOT be included in these searches. Tests must scope to source files only.

## Acceptance Criteria
- [ ] Given `tests/002-rename-backend-engineer.test.js` exists, when it is run against the unmodified codebase, then all four test cases fail (confirming tests are meaningful and not trivially passing)
- [ ] Given the test file, when it searches `agents/` for "Backend Engineer", then the check targets only the `agents/` directory (not `.github/agents/`)
- [ ] Given the test file, when it searches `skills/` for "Backend Engineer", then the check targets only the `skills/` directory (not `.github/skills/`)
- [ ] Given the test file, when it checks for `agents/software-engineer.agent.md`, then it also reads and asserts that the `name:` frontmatter field equals "Software Engineer"
- [ ] Given the test file, when its code style is reviewed, then it matches the conventions of `tests/001-document-requirement-conflict-resolver.test.js`

## Dependencies
None

## Implementation Notes
Created `tests/002-rename-backend-engineer.test.js` with four test cases following the conventions of `tests/001-document-requirement-conflict-resolver.test.js`. Tests use `node:test`, `node:assert/strict`, and `node:fs`. A `collectFiles` helper recursively scans directories. Tests confirmed failing before implementation and passing after all rename tasks completed.

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
