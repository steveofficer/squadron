# Update Backend Engineer References in Agent and Skill Files

## Status
completed

## Priority
high

## Description
Replace all occurrences of "Backend Engineer" with "Software Engineer" in the following source files:

- `agents/task-dispatcher.agent.md` — update the `agents:` YAML list entry and all prose references (the agent is referenced by name in delegation instructions)
- `skills/task-delegation-engineering-workflow/SKILL.md` — 4 occurrences
- `skills/agent-backlog-maintenance/SKILL.md` — 1 occurrence (in the Implementation Notes comment template)
- `skills/task-delegation-task-identification/SKILL.md` — 4 occurrences

This is a pure text replacement. No logic, workflow, or behavioral changes are permitted — only the label "Backend Engineer" is being renamed to "Software Engineer".

Do NOT modify anything under `.github/agents/` or `.github/skills/` — those are human-managed installed copies.

## Acceptance Criteria
- [x] Given `agents/task-dispatcher.agent.md`, when it is searched for "Backend Engineer", then zero matches are found
- [x] Given `skills/task-delegation-engineering-workflow/SKILL.md`, when it is searched for "Backend Engineer", then zero matches are found
- [x] Given `skills/agent-backlog-maintenance/SKILL.md`, when it is searched for "Backend Engineer", then zero matches are found
- [x] Given `skills/task-delegation-task-identification/SKILL.md`, when it is searched for "Backend Engineer", then zero matches are found
- [x] Given `agents/task-dispatcher.agent.md`, when its `agents:` YAML list is read, then "Software Engineer" appears where "Backend Engineer" previously appeared
- [x] Given the tests from task 002, when `tests/002-rename-backend-engineer.test.js` is run after this change, then the agents/ and skills/ "no Backend Engineer" test cases pass

## Dependencies
003

## Implementation Notes
Replaced all occurrences of "Backend Engineer" with "Software Engineer" in: `agents/task-dispatcher.agent.md` (3 occurrences: YAML `agents:` list, prose delegation note, and Step 3 notes reference), `skills/agent-backlog-maintenance/SKILL.md` (1 occurrence in comment template), `skills/task-delegation-engineering-workflow/SKILL.md` (4 occurrences), `skills/task-delegation-task-identification/SKILL.md` (4 occurrences). No behavioral changes.

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
