---
name: review-findings
description: Defines the standard format for reporting code review findings. All reviewer agents must follow this structure to ensure the Code Reviewer can synthesize findings consistently.
---

# Review Findings Format

All reviewer agents report findings using a common structure. This ensures the Code Reviewer can reliably parse, deduplicate, and classify findings across reviewers.

## Report Structure

Every review report follows this skeleton:

```markdown
## <Reviewer Type> Review Findings

### <Severity 1>
- [file:line] Description of finding

### <Severity 2>
- [file:line] Description of finding

...

### Summary
X <severity-1>, Y <severity-2>, ... findings.
Recommendation: PASS / REWORK NEEDED
```

## Citation Format

Every finding must reference a specific location:

```
[path/to/file.ts:42] Description of the issue
```

- Use the repository-relative file path
- Include the line number after a colon
- One finding per bullet point
- Be specific: describe what is wrong and what must be done instead

## Empty Review

When there are no findings at any severity level, use:

```markdown
## <Reviewer Type> Review Findings

No issues found.

Recommendation: PASS
```

## Severity Profiles

Each reviewer type uses a specific set of severity levels and pass/fail criteria.

### Strict Reviewer

| Severity | Purpose |
|----------|---------|
| **Critical** | Logic errors, correctness failures, security issues |
| **Important** | Code quality issues, convention violations, missing error handling |
| **Minor** | Naming, readability, minor improvements |
| **Nitpick** | Stylistic preferences, formatting, trivial observations |

**Verdict rule**: REWORK NEEDED if any Critical or Important findings. PASS if all findings are Minor or Nitpick.

### Reasonable Reviewer

| Severity | Purpose |
|----------|---------|
| **Must Fix** | Correctness, security, or maintainability issues that must be addressed |
| **Should Fix** | Real issues worth addressing but not blocking |
| **Consider** | Suggestions worth considering, not blocking |

**Verdict rule**: REWORK NEEDED if any Must Fix findings. PASS if all findings are Should Fix or Consider.

### Lenient Reviewer

| Severity | Purpose |
|----------|---------|
| **Blockers** | Show-stopping issues — broken logic, security holes, catastrophic problems |
| **Warnings** | Notable concerns that aren't show-stoppers |

**Verdict rule**: REWORK NEEDED only if there are Blockers. Warnings alone do not fail a review.

## Recommendation

Every report must end with exactly one of:
- `Recommendation: PASS`
- `Recommendation: REWORK NEEDED`

This line is parsed by the Code Reviewer to determine the per-reviewer verdict. Do not omit it.
