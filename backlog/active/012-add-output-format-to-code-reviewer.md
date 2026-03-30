# Add Output Format Section to Code Reviewer Agent

## Status
pending

## Priority
medium

## Milestone
M2

## Description
Add an `## Output Format` section to `/plugins/squadron/agents/code-reviewer.agent.md`. The section must be inserted between `## 4. Report` and `# Delegation Guidelines`.

The section must instruct the Code Reviewer to:
1. Keep the existing Markdown review report (the structured `## Code Review — Iteration N of 4` block) completely unchanged
2. Reference the `agent-handoff-schemas` skill for the full schema definition
3. Append a `ReviewVerdict` structured block after the prose report, using the ` ```json agent-handoff ` / ` ``` ` delimiter convention defined by that skill

The `ReviewVerdict` block must contain:
- `verdict`: either `"PASS"` or `"REWORK"`
- `findings`: array of objects with `severity` (`"blocking"` or `"minor"`), `file`, `issue`, and `suggestion`

The severity mapping to document:
- `"blocking"` → Confirmed Issues and Show-Stoppers from the Markdown report
- `"minor"` → Likely Issues, Potential Issues, and Nitpicks from the Markdown report

## Acceptance Criteria
- [ ] Given the Code Reviewer agent file, when inspected, then it contains an `## Output Format` section.
- [ ] Given the `## Output Format` section, when its position is checked, then it appears after `## 4. Report` and before `# Delegation Guidelines`.
- [ ] Given the `## Output Format` section, when its content is read, then it explicitly states the existing Markdown report must be kept unchanged and a `ReviewVerdict` block appended after it.
- [ ] Given the `## Output Format` section, when the severity mapping is inspected, then `"blocking"` is mapped to Confirmed Issues and Show-Stoppers, and `"minor"` is mapped to Likely Issues, Potential Issues, and Nitpicks.
- [ ] Given the `## Output Format` section, when the required fields are inspected, then `verdict` (PASS|REWORK enum) and `findings` (array with `severity`, `file`, `issue`, `suggestion`) are both specified.

## Dependencies
009

## Implementation Notes
<!-- Populated by the Software Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
