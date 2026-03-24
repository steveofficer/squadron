# Update Code Reviewer Agent with Debate Round Step

## Status
pending

## Priority
high

## Description
Modify `plugins/squadron/agents/code-reviewer.agent.md` to implement requirements R2 and R3 from the Multiagent Debate specification.

**Change 1 — Insert Step 1.5: Debate Round (R2)**

After `## 1. Delegate to Sub-Reviewers` and before `## 2. Synthesize Findings`, insert a new `## Step 1.5: Debate Round` section containing the following orchestration logic:

1. Pass all three original reviewer reports to each reviewer (Strict, Reasonable, Lenient) — each reviewer sees the full set of findings from the other two.
2. Ask each reviewer: *"Given the findings from the other two reviewers above, do you wish to revise your own findings? Specifically: (a) endorse any finding you agree with, (b) rebut any finding you disagree with and explain why, (c) add any new finding surfaced by reading the others."*
3. Each reviewer produces a revised report (max 200 words).
4. The debate is capped at exactly one round — no further iteration.

Reviewers reference findings by the IDs defined in the `review-findings` skill (e.g., `S-1`, `R-2`, `L-3`).

**Change 2 — Update Step 2: Synthesize Findings to use revised findings (R3)**

Update the opening sentence / instructions of `## 2. Synthesize Findings` so it explicitly states that synthesis operates on the **revised** findings produced in the Debate Round (Step 1.5), not the original findings from Step 1.

No other changes to the Synthesize Findings logic, Verdict, Report, Delegation Guidelines, or Quality Standards sections are required.

Do not modify `strict-reviewer.agent.md`, `reasonable-reviewer.agent.md`, or `lenient-reviewer.agent.md`.

## Acceptance Criteria
- [ ] Given the updated `code-reviewer.agent.md`, when reading the Workflow section, then a "Debate Round" step (heading containing "Debate Round") appears after `## 1. Delegate to Sub-Reviewers` and before `## 2. Synthesize Findings`.
- [ ] Given the updated Debate Round step, when reading its content, then it instructs the orchestrator to pass all three reviewer reports to each reviewer and asks each reviewer to endorse, rebut, or add findings.
- [ ] Given the updated Debate Round step, when reading its content, then it explicitly states the debate is capped at one round with no further iteration.
- [ ] Given the updated `## 2. Synthesize Findings` section, when reading its opening instructions, then it references the revised findings from the debate round as the input to synthesis (not the original findings).
- [ ] Given the updated agent file, when running `node --test tests/011-code-reviewer-debate-round.test.js`, then all four tests pass (green phase).

## Dependencies
010, 011

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the acceptance tester -->
