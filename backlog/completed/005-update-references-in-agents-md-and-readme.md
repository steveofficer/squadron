# Update Backend Engineer References in AGENTS.md and README.md

## Status
completed

## Priority
medium

## Description
Replace all occurrences of "Backend Engineer" with "Software Engineer" in the two root documentation files:

- `AGENTS.md` — update the workflow description table where "Backend Engineer" is listed as a workflow participant
- `README.md` — update the mermaid diagram node label and any prose references

This is a pure text replacement. No content other than the label "Backend Engineer" → "Software Engineer" should be changed.

Do NOT modify `docs/AGENT_REVIEW.md` — it is a historical artifact that must be preserved as-is.

## Acceptance Criteria
- [x] Given `AGENTS.md`, when it is searched for "Backend Engineer", then zero matches are found
- [x] Given `README.md`, when it is searched for "Backend Engineer", then zero matches are found
- [x] Given `README.md`, when the mermaid diagram is read, then the node that previously represented "Backend Engineer" now shows "Software Engineer"
- [x] Given `docs/AGENT_REVIEW.md`, when it is checked, then its contents are unchanged (historical artifact preserved)
- [x] Given the tests from task 002, when `tests/002-rename-backend-engineer.test.js` is run after this change, then the AGENTS.md and README.md "no Backend Engineer" test cases pass

## Dependencies
003

## Implementation Notes
Replaced all occurrences of "Backend Engineer" with "Software Engineer" in `AGENTS.md` (1 occurrence in workflow step list) and `README.md` (3 occurrences: mermaid node label, Step 3 delegation description, and `### Backend Engineer` section heading). `docs/AGENT_REVIEW.md` was not modified (historical artifact preserved).

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
