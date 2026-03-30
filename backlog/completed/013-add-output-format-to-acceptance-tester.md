# Add Output Format Section to Acceptance Tester Agent

## Status
completed

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
- [x] Given the Acceptance Tester agent file, when inspected, then it contains an `## Output Format` section.
- [x] Given the `## Output Format` section, when its position is checked, then it appears after `## 6. Report` and before `# Quality Standards`.
- [x] Given the `## Output Format` section, when its content is read, then it references the `agent-handoff-schemas` skill and instructs producing an `AcceptanceReport` structured block using the ` ```json agent-handoff ` delimiter.
- [x] Given the `## Output Format` section, when the required fields are inspected, then `overall` (PASS|FAIL enum) and `criteria` (array with `text`, `result`, `evidence`) are both specified.

## Dependencies
009

## Implementation Notes
Inserted `## Output Format` section between `## 6. Report` and `# Quality Standards` in `acceptance-tester.agent.md`. The section references the `agent-handoff-schemas` skill and instructs producing an `AcceptanceReport` structured block with `overall` (PASS|FAIL) and `criteria` (array with `text`, `result`, `evidence` per entry) using the ` ```json agent-handoff ` delimiter.

## Testing Findings
- **Overall**: PASS
- **Criterion 1**: PASS — `## Output Format` section is present at line 65 of `acceptance-tester.agent.md`.
- **Criterion 2**: PASS — Section appears at line 65, after `## 6. Report` (line 59) and before `# Quality Standards` (line 86); ordering is correct.
- **Criterion 3**: PASS — Line 67 references the `agent-handoff-schemas` skill ("See the `agent-handoff-schemas` skill for the full schema definition and delimiter conventions."); line 69 instructs producing an `AcceptanceReport` block using the ` ```json agent-handoff ` / ` ``` ` delimiter convention.
- **Criterion 4**: PASS — The example block (lines 73–82) explicitly specifies `overall` (`"PASS or FAIL"`) and `criteria` as an array of objects each containing `text`, `result`, and `evidence` fields.
