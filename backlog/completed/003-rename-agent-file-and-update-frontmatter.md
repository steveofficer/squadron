# Rename Agent File and Update Frontmatter

## Status
completed

## Priority
high

## Description
Rename the file `agents/backend-engineer.agent.md` to `agents/software-engineer.agent.md` and update its YAML frontmatter `name:` field from "Backend Engineer" to "Software Engineer". This is the authoritative source change — all other tasks update references to match this new name.

No behavioral changes: the agent's workflow, role description, tools, or any other content must remain identical. Only the file name and the `name:` frontmatter field change.

## Acceptance Criteria
- [ ] Given the `agents/` directory, when it is listed, then `agents/software-engineer.agent.md` exists and `agents/backend-engineer.agent.md` does not exist
- [ ] Given `agents/software-engineer.agent.md`, when its YAML frontmatter is read, then the `name:` field equals exactly "Software Engineer"
- [ ] Given `agents/software-engineer.agent.md`, when its content is compared to the original `agents/backend-engineer.agent.md` (excluding the `name:` field), then all other content is identical and unchanged
- [ ] Given the tests from task 002, when `tests/002-rename-backend-engineer.test.js` is run after this change, then the test case asserting `agents/software-engineer.agent.md` exists with `name: "Software Engineer"` passes

## Dependencies
002

## Implementation Notes
Copied `agents/backend-engineer.agent.md` to `agents/software-engineer.agent.md` and removed the original. Updated only the `name:` frontmatter field from "Backend Engineer" to "Software Engineer". All other content is identical.

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
