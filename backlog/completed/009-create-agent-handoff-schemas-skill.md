# Create agent-handoff-schemas Skill

## Status
completed

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
- [x] Given the repository, when `/plugins/squadron/skills/agent-handoff-schemas/SKILL.md` is read, then it contains valid YAML frontmatter with both `name` and `description` fields present and non-empty.
- [x] Given the skill file, when each of the four schema sections is inspected, then all four schemas are present — TestResults, ImplementationSummary, ReviewVerdict, AcceptanceReport — each with a Markdown field table and a fenced JSON example.
- [x] Given the skill file, when the ReviewVerdict schema is inspected, then it documents the severity mapping: `"blocking"` covers Confirmed Issues and Show-Stoppers, and `"minor"` covers Likely Issues, Potential Issues, and Nitpicks.
- [x] Given the skill file, when the output block format section is inspected, then it explicitly specifies the ` ```json agent-handoff ` opening tag and ` ``` ` closing tag as the required delimiter convention for all structured handoff output.
- [x] Given the skill file, when the AcceptanceReport schema is inspected, then the `criteria` array items each define `text` (string), `result` (enum PASS|FAIL), and `evidence` (string) fields.

## Dependencies
None

## Implementation Notes
Created `/plugins/squadron/skills/agent-handoff-schemas/SKILL.md` with YAML frontmatter, an Output Block Format section specifying the ` ```json agent-handoff ` delimiter convention, and four schema definitions (TestResults, ImplementationSummary, ReviewVerdict, AcceptanceReport) each with a Markdown field table and a fenced JSON example. The ReviewVerdict severity mapping and AcceptanceReport criteria sub-fields are fully documented.

## Testing Findings
- **Overall**: PASS
- **Criterion 1**: PASS — YAML frontmatter (lines 1–4) is valid and contains `name: agent-handoff-schemas` and a non-empty `description` field.
- **Criterion 2**: PASS — All four schemas are present with Markdown field tables and fenced `json agent-handoff` examples: TestResults (lines 24–54), ImplementationSummary (lines 58–79), ReviewVerdict (lines 83–123), AcceptanceReport (lines 127–157).
- **Criterion 3**: PASS — ReviewVerdict section (lines 98–101) includes an explicit severity mapping table: `"blocking"` = Confirmed Issues and Show-Stoppers; `"minor"` = Likely Issues, Potential Issues, and Nitpicks.
- **Criterion 4**: PASS — "Output Block Format" section (lines 10–20) shows the ` ```json agent-handoff ` opening tag and ` ``` ` closing tag with explanatory prose requiring the `agent-handoff` label on all structured handoff output.
- **Criterion 5**: PASS — AcceptanceReport field table (lines 135–137) defines `criteria[].text` (string), `criteria[].result` ("PASS" | "FAIL"), and `criteria[].evidence` (string), matching the required enum and types exactly.
