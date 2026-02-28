# Add Tech Stack Context Step to Code Reviewer Agent

## Status
pending

## Priority
medium

## Description
Add a "Load Tech Stack Context" step to the Code Reviewer agent (`agents/code-reviewer.agent.md`) so it loads the project's tech stack skill files before delegating to sub-reviewers.

**Change:** In `## 1. Delegate to Sub-Reviewers`, insert a new introductory paragraph or bullet **before** the "Invoke all three reviewers" instruction:

> Load `.github/skills/project-stacks/SKILL.md` and then each stack skill file it lists. Use this to evaluate code against the idioms, conventions, and pitfalls specific to the project's tech stack. Pass this tech stack context to each sub-reviewer.

The rest of the section and the full agent file must remain unchanged. The agent uses `chatagent` fenced code block format with YAML frontmatter — this format must be preserved exactly.

## Acceptance Criteria
- [ ] Given the updated `agents/code-reviewer.agent.md`, when the file is read, then `## 1. Delegate to Sub-Reviewers` contains an instruction to load `.github/skills/project-stacks/SKILL.md` before delegating.
- [ ] Given the updated file, when the full file is read, then the `chatagent` fenced block, YAML frontmatter, and all other sections are structurally identical to the original.
- [ ] Given the new instruction, when read, then it explicitly states to pass tech stack context to each sub-reviewer.

## Dependencies
None

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
