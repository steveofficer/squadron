# Add Output Format Section to Acceptance Tester Agent

## Status
pending

## Priority
medium

## Milestone
M2

## Description
Add an `## Output Format` section to `/plugins/squadron/agents/acceptance-tester.agent.md`. The section must be inserted between `## 6. Report` and `# Quality Standards`.

The section must instruct the Acceptance Tester to:
1. Reference the `agent-handoff-schemas` skill for the full schema definition
2. Produce an `AcceptanceReport` structured block after its prose report, using the ` ```json agent-handoff ` / ` ``` ` delimiter convention defined by that skill

The `AcceptanceReport` block must contain:
- `overall`: either `"PASS"` or `"FAIL"`
- `criteria`: array of objects with `text` (the criterion text), `result` (`"PASS"` or `"FAIL"`), and `evidence` (a brief description of the evidence or failure reason)

## Acceptance Criteria
- [ ] Given the Acceptance Tester agent file, when inspected, then it contains an `## Output Format` section.
- [ ] Given the `## Output Format` section, when its position is checked, then it appears after `## 6. Report` and before `# Quality Standards`.
- [ ] Given the `## Output Format` section, when its content is read, then it references the `agent-handoff-schemas` skill and instructs producing an `AcceptanceReport` structured block using the ` ```json agent-handoff ` delimiter.
- [ ] Given the `## Output Format` section, when the required fields are inspected, then `overall` (PASS|FAIL enum) and `criteria` (array with `text`, `result`, `evidence`) are both specified.

## Dependencies
009

## Implementation Notes
<!-- Populated by the Software Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
