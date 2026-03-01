# Add Tech Stack Context Step to Test Engineer Agent

## Status
completed

## Priority
medium

## Description
Add a "Load Tech Stack Context" step to the Test Engineer agent (`agents/test-engineer.agent.md`) so it loads the project's tech stack skill files at the start of its research and setup phase.

**Change:** In `## 1. Understand the Requirements`, insert a new bullet as the **first item** in that section:

> Load `.github/skills/project-stacks/SKILL.md` and then each stack skill file it lists. Use this to write tests using the project's actual testing frameworks and library patterns.

The rest of the section and the full agent file must remain unchanged. The agent uses `chatagent` fenced code block format with YAML frontmatter — this format must be preserved exactly.

## Acceptance Criteria
- [ ] Given the updated `agents/test-engineer.agent.md`, when the file is read, then `## 1. Understand the Requirements` contains a first bullet instructing the agent to load `.github/skills/project-stacks/SKILL.md`.
- [ ] Given the updated file, when the full file is read, then the `chatagent` fenced block, YAML frontmatter, and all other sections are structurally identical to the original.
- [ ] Given the new instruction, when read, then it explicitly states to use this context to write tests using the project's actual testing frameworks.

## Dependencies
None

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->

Added first bullet in `## 1. Understand the Requirements` of `agents/test-engineer.agent.md`: load project-stacks/SKILL.md and each listed stack skill file for testing framework context.
