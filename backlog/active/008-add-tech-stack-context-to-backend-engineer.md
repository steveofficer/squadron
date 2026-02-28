# Add Tech Stack Context Step to Backend Engineer Agent

## Status
pending

## Priority
medium

## Description
Add a "Load Tech Stack Context" step to the Backend Engineer agent (`agents/backend-engineer.agent.md`) so it loads the project's tech stack skill files before researching the codebase.

**Change:** In `## 2. Research the Codebase`, insert a new bullet as the **first item** in that section:

> Load `.github/skills/project-stacks/SKILL.md` and then each stack skill file it lists. Use this context to ensure implementations follow the idioms, library conventions, and patterns of the project's actual technology.

The rest of the section and the full agent file must remain unchanged. The agent uses `chatagent` fenced code block format with YAML frontmatter — this format must be preserved exactly.

## Acceptance Criteria
- [ ] Given the updated `agents/backend-engineer.agent.md`, when the file is read, then `## 2. Research the Codebase` contains a first bullet instructing the agent to load `.github/skills/project-stacks/SKILL.md`.
- [ ] Given the updated file, when the full file is read, then the `chatagent` fenced block, YAML frontmatter, and all other sections are structurally identical to the original.
- [ ] Given the new instruction, when read, then it explicitly states to load each stack skill file listed in the project-stacks index.

## Dependencies
None

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
