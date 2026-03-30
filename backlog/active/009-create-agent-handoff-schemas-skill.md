# Create agent-handoff-schemas Skill

## Status
pending

## Priority
high

## Milestone
M2

## Description
Create a new skill file at `/plugins/squadron/skills/agent-handoff-schemas/SKILL.md` that defines four typed output schemas for inter-agent handoffs. This skill is the foundation for all typed structured handoffs between agents in the engineering workflow.

The file must include:
- YAML frontmatter with `name: agent-handoff-schemas` and a `description` field
- A specification of the output block delimiter convention: agents must wrap structured output in a labeled fenced block ` ```json agent-handoff ` / ` ``` `
- Four schema definitions, each presented as a Markdown table of fields plus a fenced JSON example:

1. **TestResults** (produced by Test Engineer):
   - `files_created`: array of strings
   - `tests_written`: array of objects with fields `name` (string), `criterion` (string), `file` (string)
   - `framework`: string

2. **ImplementationSummary** (produced by Software Engineer):
   - `files_modified`: array of strings
   - `approach`: string
   - `trade_offs`: string
   - `tests_passing`: boolean

3. **ReviewVerdict** (produced by Code Reviewer):
   - `verdict`: enum `PASS` | `REWORK`
   - `findings`: array of objects with fields `severity` (enum `blocking` | `minor`), `file` (string), `issue` (string), `suggestion` (string)
   - Severity mapping must be documented: `"blocking"` = Confirmed Issues + Show-Stoppers; `"minor"` = Likely Issues + Potential Issues + Nitpicks

4. **AcceptanceReport** (produced by Acceptance Tester):
   - `overall`: enum `PASS` | `FAIL`
   - `criteria`: array of objects with fields `text` (string), `result` (enum `PASS` | `FAIL`), `evidence` (string)

## Acceptance Criteria
- [ ] Given the repository, when `/plugins/squadron/skills/agent-handoff-schemas/SKILL.md` is read, then it contains valid YAML frontmatter with both `name` and `description` fields present and non-empty.
- [ ] Given the skill file, when each of the four schema sections is inspected, then all four schemas are present — TestResults, ImplementationSummary, ReviewVerdict, AcceptanceReport — each with a Markdown field table and a fenced JSON example.
- [ ] Given the skill file, when the ReviewVerdict schema is inspected, then it documents the severity mapping: `"blocking"` covers Confirmed Issues and Show-Stoppers, and `"minor"` covers Likely Issues, Potential Issues, and Nitpicks.
- [ ] Given the skill file, when the output block format section is inspected, then it explicitly specifies the ` ```json agent-handoff ` opening tag and ` ``` ` closing tag as the required delimiter convention for all structured handoff output.
- [ ] Given the skill file, when the AcceptanceReport schema is inspected, then the `criteria` array items each define `text` (string), `result` (enum PASS|FAIL), and `evidence` (string) fields.

## Dependencies
None

## Implementation Notes
<!-- Populated by the Software Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
