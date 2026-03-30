# Add Output Format Section to Code Reviewer Agent

## Status
completed

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
- [x] Given the Code Reviewer agent file, when inspected, then it contains an `## Output Format` section.
- [x] Given the `## Output Format` section, when its position is checked, then it appears after `## 4. Report` and before `# Delegation Guidelines`.
- [x] Given the `## Output Format` section, when its content is read, then it explicitly states the existing Markdown report must be kept unchanged and a `ReviewVerdict` block appended after it.
- [x] Given the `## Output Format` section, when the severity mapping is inspected, then `"blocking"` is mapped to Confirmed Issues and Show-Stoppers, and `"minor"` is mapped to Likely Issues, Potential Issues, and Nitpicks.
- [x] Given the `## Output Format` section, when the required fields are inspected, then `verdict` (PASS|REWORK enum) and `findings` (array with `severity`, `file`, `issue`, `suggestion`) are both specified.

## Dependencies
009

## Implementation Notes
Inserted `## Output Format` section between `## 4. Report` and `# Delegation Guidelines` in `code-reviewer.agent.md`. The section states the existing Markdown review report must remain unchanged, references the `agent-handoff-schemas` skill, and instructs appending a `ReviewVerdict` structured block with `verdict` (PASS|REWORK) and `findings` (array with `severity`, `file`, `issue`, `suggestion`), including the severity mapping table.

## Testing Findings
- **Overall**: PASS
- **Criterion 1**: PASS — `## Output Format` heading present at line 126 of `code-reviewer.agent.md`.
- **Criterion 2**: PASS — Section sits between `## 4. Report` (line 94) and `# Delegation Guidelines` (line 157); order confirmed by line numbers.
- **Criterion 3**: PASS — Line 128 explicitly states the Markdown review report "must be kept completely unchanged — do not alter its structure, headings, or content"; line 132 instructs appending a `ReviewVerdict` structured block after the prose report.
- **Criterion 4**: PASS — Severity mapping table at lines 152–155 maps `"blocking"` to "Confirmed Issues and Show-Stoppers" and `"minor"` to "Likely Issues, Potential Issues, and Nitpicks".
- **Criterion 5**: PASS — `verdict` field with `"PASS | REWORK"` enum values (line 136); `findings` array with `severity`, `file`, `issue`, and `suggestion` per entry (lines 137–144); required fields documented at line 148.
- **Test suite**: 8/8 existing tests pass (`node --test tests/*.test.js`); no regressions introduced.
