# Update review-findings Skill with Finding IDs and Debate Round References

## Status
pending

## Priority
high

## Description
Modify `plugins/squadron/skills/review-findings/SKILL.md` to implement requirement R1 from the Multiagent Debate specification:

**Change 1 — Finding ID prefixes in the Citation Format section**

Update the Citation Format section so every example finding bullet leads with a reviewer-scoped short ID:
- Strict Reviewer findings: `S-1`, `S-2`, `S-3`, …
- Reasonable Reviewer findings: `R-1`, `R-2`, `R-3`, …
- Lenient Reviewer findings: `L-1`, `L-2`, `L-3`, …

The ID appears at the start of each finding bullet, before the `[file:line]` reference:

```
- S-1 [path/to/file.ts:42] Description of the issue
```

Update the existing Citation Format code block example accordingly. Also update the Report Structure skeleton example bullets and any other example bullets in the file to include the appropriate ID prefix.

**Change 2 — Add "Debate Round References" section**

Append a new `## Debate Round References` section (after the existing `## Recommendation` section) explaining that when participating in a debate round, reviewers may reference other reviewers' findings by ID. The section must include illustrative examples:
- "Endorses Strict finding S-2"
- "Rebuts Reasonable finding R-1: [explanation]"

The section should explain that IDs are used so findings can be unambiguously cross-referenced during endorsement or rebuttal.

Do not change severity profiles, verdict rules, or any other existing content beyond the citation format examples and the new section.

## Acceptance Criteria
- [ ] Given the updated `SKILL.md`, when reading the Citation Format section, then the code block example contains a finding bullet with an ID prefix (`S-1`, `R-1`, or `L-1`) immediately before the `[file:line]` reference.
- [ ] Given the updated `SKILL.md`, when reading the full file content, then a `## Debate Round References` heading is present.
- [ ] Given the updated `SKILL.md`, when reading the Debate Round References section body, then it contains both "endorse" (or a variant) and "rebut" (or a variant) to describe cross-reviewer referencing behaviour.
- [ ] Given the updated `SKILL.md`, when running `node --test tests/009-review-findings-skill-debate.test.js`, then all tests pass (green phase).

## Dependencies
009

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the acceptance tester -->
